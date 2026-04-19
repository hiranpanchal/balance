"use client";

import { useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventClickArg, DateSelectArg, EventDropArg, EventInput } from "@fullcalendar/core";
import type { EventResizeDoneArg } from "@fullcalendar/interaction";
import Link from "next/link";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { SelectField } from "@/components/admin/SelectField";
import type { Service } from "@/lib/types";

type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";

interface Booking {
  id: string;
  ref: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  service: string;
  duration: number;
  date: string;
  time: string;
  price: number;
  status: BookingStatus;
  notes: string;
}

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface Props {
  initialBookings: Booking[];
  clients: Client[];
  services: Service[];
}

const STATUS_COLORS: Record<BookingStatus, string> = {
  CONFIRMED: "#3E4F56",
  PENDING: "#B28B5D",
  COMPLETED: "#5c7a5c",
  CANCELLED: "#a04040",
  NO_SHOW: "#A09687",
};

function toEvent(b: Booking): EventInput {
  const start = new Date(`${b.date}T${b.time}`);
  const end = new Date(start.getTime() + b.duration * 60_000);
  return {
    id: b.id,
    title: `${b.firstName} ${b.lastName}`,
    start,
    end,
    backgroundColor: STATUS_COLORS[b.status],
    borderColor: STATUS_COLORS[b.status],
    textColor: "#fff",
    extendedProps: b,
  };
}

function padTime(d: Date) {
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function toDateStr(d: Date) {
  return d.toISOString().split("T")[0];
}

const TIMES = Array.from({ length: 23 }, (_, i) => {
  const h = Math.floor(i / 2) + 8;
  const m = i % 2 === 0 ? "00" : "30";
  return `${String(h).padStart(2, "0")}:${m}`;
});

const inputCls =
  "w-full border border-[#3E4F56]/15 rounded-md px-3 py-2.5 text-[13px] text-[#3E4F56] bg-white focus:outline-none focus:border-[#B28B5D] focus:ring-1 focus:ring-[#B28B5D]/30 transition-colors hover:border-[#3E4F56]/30";
const labelCls =
  "block text-[11px] tracking-[0.12em] uppercase text-[#A09687] mb-1.5";

export function CalendarView({ initialBookings, clients, services }: Props) {
  const calRef = useRef<FullCalendar>(null);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);

  // New booking modal
  const [newModal, setNewModal] = useState<{ date: string; time: string } | null>(null);
  const [newForm, setNewForm] = useState<{
    clientQuery: string;
    selectedClient: Client | null;
    serviceId: string;
    duration: number;
    price: number;
    time: string;
    date: string;
    notes: string;
    status: string;
  }>({
    clientQuery: "",
    selectedClient: null,
    serviceId: services[0].id,
    duration: services[0].durations[0].mins,
    price: services[0].durations[0].price,
    time: "10:00",
    date: "",
    notes: "",
    status: "CONFIRMED",
  });
  const [clientDropdownOpen, setClientDropdownOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Event detail modal
  const [detailBooking, setDetailBooking] = useState<Booking | null>(null);

  const filteredClients = clients.filter((c) => {
    const q = newForm.clientQuery.toLowerCase();
    return (
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  });

  function openNewModal(date: string, time: string) {
    const svc = services[0];
    setNewForm({
      clientQuery: "",
      selectedClient: null,
      serviceId: svc.id,
      duration: svc.durations[0].mins,
      price: svc.durations[0].price,
      time,
      date,
      notes: "",
      status: "CONFIRMED",
    });
    setClientDropdownOpen(false);
    setNewModal({ date, time });
  }

  function handleServiceChange(id: string) {
    const svc = services.find((s) => s.id === id)!;
    setNewForm((f) => ({
      ...f,
      serviceId: id,
      duration: svc.durations[0].mins,
      price: svc.durations[0].price,
    }));
  }

  function handleDurationChange(mins: number) {
    const svc = services.find((s) => s.id === newForm.serviceId)!;
    const d = svc.durations.find((d) => d.mins === mins);
    setNewForm((f) => ({ ...f, duration: mins, price: d?.price ?? f.price }));
  }

  async function submitNewBooking(e: React.FormEvent) {
    e.preventDefault();
    if (!newForm.selectedClient) return;
    setSaving(true);
    const c = newForm.selectedClient;

    const res = await fetch("/api/admin/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: c.firstName,
        lastName: c.lastName,
        email: c.email,
        phone: c.phone,
        service: newForm.serviceId,
        duration: newForm.duration,
        date: newForm.date,
        time: newForm.time,
        price: newForm.price,
        notes: newForm.notes,
        status: newForm.status,
      }),
    });

    if (res.ok) {
      const booking = await res.json();
      setBookings((prev) => [...prev, booking]);
    }
    setSaving(false);
    setNewModal(null);
  }

  async function handleDrop(arg: EventDropArg) {
    const { event } = arg;
    const date = toDateStr(event.start!);
    const time = padTime(event.start!);
    const duration = event.end
      ? Math.round((event.end.getTime() - event.start!.getTime()) / 60_000)
      : (event.extendedProps as Booking).duration;

    await fetch(`/api/admin/bookings/${event.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, time, duration }),
    });

    setBookings((prev) =>
      prev.map((b) => (b.id === event.id ? { ...b, date, time, duration } : b))
    );
  }

  async function handleResize(arg: EventResizeDoneArg) {
    const { event } = arg;
    const duration = event.end
      ? Math.round((event.end.getTime() - event.start!.getTime()) / 60_000)
      : (event.extendedProps as Booking).duration;

    await fetch(`/api/admin/bookings/${event.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ duration }),
    });

    setBookings((prev) =>
      prev.map((b) => (b.id === event.id ? { ...b, duration } : b))
    );
  }

  function handleSelect(arg: DateSelectArg) {
    const date = toDateStr(arg.start);
    const time = padTime(arg.start);
    openNewModal(date, time);
    calRef.current?.getApi().unselect();
  }

  function handleEventClick(arg: EventClickArg) {
    setDetailBooking(arg.event.extendedProps as Booking);
  }

  const selectedSvc = services.find((s) => s.id === newForm.serviceId)!;

  return (
    <>
      {/* FullCalendar styles */}
      <style>{`
        .fc { font-family: inherit; }
        .fc .fc-toolbar-title { font-family: var(--font-display, serif); font-size: 20px; font-weight: 400; color: #3E4F56; }
        .fc .fc-button { background: #3E4F56 !important; border-color: #3E4F56 !important; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; box-shadow: none !important; }
        .fc .fc-button:hover { opacity: 0.85; }
        .fc .fc-button-active { background: #B28B5D !important; border-color: #B28B5D !important; }
        .fc .fc-today-button { background: #A09687 !important; border-color: #A09687 !important; }
        .fc-theme-standard td, .fc-theme-standard th { border-color: #EAE2D2; }
        .fc .fc-timegrid-slot { height: 2rem; }
        .fc .fc-highlight { background: rgba(178,139,93,0.15) !important; }
        .fc .fc-daygrid-day.fc-day-today, .fc .fc-timegrid-col.fc-day-today { background: rgba(62,79,86,0.04) !important; }
        .fc .fc-col-header-cell-cushion { color: #3E4F56; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 400; }
        .fc .fc-daygrid-day-number { color: #3E4F56; font-size: 13px; }
        .fc .fc-event { border-radius: 4px; padding: 1px 4px; font-size: 12px; cursor: pointer; }
        .fc .fc-event-title { font-weight: 400; }
        .fc .fc-timegrid-event .fc-event-main { padding: 2px 4px; }
        .fc .fc-non-business { background: rgba(0,0,0,0.02); }
        .fc .fc-scrollgrid { border-color: #EAE2D2; }
      `}</style>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <FullCalendar
          ref={calRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={bookings.map(toEvent)}
          editable
          selectable
          selectMirror
          dayMaxEvents
          weekends
          slotMinTime="08:00:00"
          slotMaxTime="20:00:00"
          slotDuration="00:30:00"
          businessHours={{ daysOfWeek: [2, 3, 4, 5, 6], startTime: "09:00", endTime: "19:00" }}
          select={handleSelect}
          eventClick={handleEventClick}
          eventDrop={handleDrop}
          eventResize={handleResize}
          height="auto"
          eventMinHeight={30}
          nowIndicator
          scrollTime="08:00:00"
        />
      </div>

      {/* New booking modal */}
      {newModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-[480px] max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-5 border-b border-[#EAE2D2] flex items-center justify-between">
              <h2 className="font-serif text-[18px] text-[#3E4F56] font-normal">New booking</h2>
              <button onClick={() => setNewModal(null)} className="text-[#A09687] hover:text-[#3E4F56] text-lg leading-none">×</button>
            </div>

            <form onSubmit={submitNewBooking} className="px-6 py-5 space-y-4">
              {/* Client search */}
              <div className="relative">
                <label className={labelCls}>Client</label>
                <input
                  type="text"
                  placeholder="Search by name or email…"
                  value={newForm.clientQuery}
                  onChange={(e) => {
                    setNewForm((f) => ({ ...f, clientQuery: e.target.value, selectedClient: null }));
                    setClientDropdownOpen(true);
                  }}
                  onFocus={() => setClientDropdownOpen(true)}
                  className={inputCls}
                  autoComplete="off"
                />
                {newForm.selectedClient && (
                  <div className="mt-1 text-[12px] text-[#B28B5D]">
                    ✓ {newForm.selectedClient.firstName} {newForm.selectedClient.lastName}
                  </div>
                )}
                {clientDropdownOpen && newForm.clientQuery && !newForm.selectedClient && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-[#EAE2D2] rounded shadow-lg max-h-[180px] overflow-y-auto">
                    {filteredClients.length === 0 ? (
                      <div className="px-4 py-3 text-[12px] text-[#A09687]">No clients found</div>
                    ) : (
                      filteredClients.slice(0, 8).map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          className="w-full text-left px-4 py-2.5 hover:bg-[#F5F0E6] border-b border-[#F5F0E6] last:border-0"
                          onClick={() => {
                            setNewForm((f) => ({
                              ...f,
                              selectedClient: c,
                              clientQuery: `${c.firstName} ${c.lastName}`,
                            }));
                            setClientDropdownOpen(false);
                          }}
                        >
                          <div className="text-[13px] text-[#3E4F56]">{c.firstName} {c.lastName}</div>
                          <div className="text-[11px] text-[#A09687]">{c.email}</div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Treatment */}
              <SelectField
                label="Treatment"
                value={newForm.serviceId}
                onChange={handleServiceChange}
                options={services.map((s) => ({ value: s.id, label: s.name }))}
              />

              <div className="grid grid-cols-2 gap-3">
                <SelectField
                  label="Duration"
                  value={newForm.duration}
                  onChange={(v) => handleDurationChange(Number(v))}
                  options={selectedSvc.durations.map((d) => ({ value: d.mins, label: `${d.mins} min` }))}
                />
                <div>
                  <label className={labelCls}>Price (£)</label>
                  <input
                    type="number"
                    value={newForm.price}
                    onChange={(e) => setNewForm((f) => ({ ...f, price: Number(e.target.value) }))}
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Date</label>
                  <input
                    type="date"
                    required
                    value={newForm.date}
                    onChange={(e) => setNewForm((f) => ({ ...f, date: e.target.value }))}
                    className={inputCls}
                  />
                </div>
                <SelectField
                  label="Time"
                  value={newForm.time}
                  onChange={(v) => setNewForm((f) => ({ ...f, time: v }))}
                  options={TIMES.map((t) => ({ value: t, label: t }))}
                />
              </div>

              <SelectField
                label="Status"
                value={newForm.status}
                onChange={(v) => setNewForm((f) => ({ ...f, status: v }))}
                options={[
                  { value: "CONFIRMED", label: "Confirmed" },
                  { value: "PENDING", label: "Pending" },
                  { value: "COMPLETED", label: "Completed" },
                  { value: "CANCELLED", label: "Cancelled" },
                ]}
              />

              <div>
                <label className={labelCls}>Notes</label>
                <textarea
                  rows={3}
                  value={newForm.notes}
                  onChange={(e) => setNewForm((f) => ({ ...f, notes: e.target.value }))}
                  className={`${inputCls} resize-none leading-[22px]`}
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={saving || !newForm.selectedClient}
                  className="flex-1 py-2.5 bg-[#3E4F56] text-white text-[12px] tracking-[0.1em] uppercase rounded hover:opacity-90 disabled:opacity-40"
                >
                  {saving ? "Saving…" : "Add booking"}
                </button>
                <button
                  type="button"
                  onClick={() => setNewModal(null)}
                  className="px-5 py-2.5 text-[#A09687] text-[12px] tracking-[0.1em] uppercase hover:text-[#3E4F56]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event detail modal */}
      {detailBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setDetailBooking(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-[380px] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-serif text-[20px] text-[#3E4F56] font-normal">
                  {detailBooking.firstName} {detailBooking.lastName}
                </h2>
                <p className="text-[12px] text-[#A09687] mt-0.5">{detailBooking.ref}</p>
              </div>
              <StatusBadge status={detailBooking.status} />
            </div>

            <dl className="space-y-3 text-[13px]">
              <div className="flex justify-between">
                <dt className="text-[#A09687]">Treatment</dt>
                <dd className="text-[#3E4F56]">
                  {services.find((s) => s.id === detailBooking.service)?.name ?? detailBooking.service}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#A09687]">Date</dt>
                <dd className="text-[#3E4F56]">{detailBooking.date}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#A09687]">Time</dt>
                <dd className="text-[#3E4F56]">{detailBooking.time}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#A09687]">Duration</dt>
                <dd className="text-[#3E4F56]">{detailBooking.duration} min</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#A09687]">Price</dt>
                <dd className="text-[#3E4F56]">£{detailBooking.price}</dd>
              </div>
              {detailBooking.phone && (
                <div className="flex justify-between">
                  <dt className="text-[#A09687]">Phone</dt>
                  <dd className="text-[#3E4F56]">{detailBooking.phone}</dd>
                </div>
              )}
            </dl>

            <div className="mt-5 pt-4 border-t border-[#F5F0E6] flex gap-3">
              <Link
                href={`/admin/bookings/${detailBooking.id}`}
                className="flex-1 py-2 text-center bg-[#3E4F56] text-white text-[12px] tracking-[0.1em] uppercase rounded hover:opacity-90"
              >
                Full booking →
              </Link>
              <button
                onClick={() => setDetailBooking(null)}
                className="px-4 py-2 text-[#A09687] text-[12px] tracking-[0.1em] uppercase hover:text-[#3E4F56]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
