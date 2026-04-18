// Admin dashboard: bookings (calendar + list, confirm/cancel/reschedule),
// WYSIWYG page content editor, services & pricing editor, drag-drop image manager.

const { useState, useEffect, useRef, useMemo } = React;

function AdminShell({ state, setState, go, children, tab, setTab }) {
  const tabs = [
    { id: "bookings", label: "Bookings" },
    { id: "content", label: "Page content" },
    { id: "services", label: "Services & pricing" },
    { id: "images", label: "Images" },
  ];
  return (
    <div className="min-h-screen flex" style={{ background: "var(--cream)" }}>
      <aside className="w-64 shrink-0 border-r py-8 px-6 flex flex-col"
        style={{ background: "var(--cream-light)", borderColor: "rgba(62,79,86,0.08)" }}>
        <div className="flex items-baseline mb-1">
          <span className="font-display text-[22px]" style={{ color: "var(--teal)" }}>Balance</span>
          <span className="font-script text-[14px] ml-1" style={{ color: "var(--gold)", opacity: "var(--gold-intensity, 1)" }}>and Wellness</span>
        </div>
        <Eyebrow>Studio admin</Eyebrow>
        <nav className="mt-10 flex-1 flex flex-col gap-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="text-left px-3 py-2.5 text-[13px] transition-all"
              style={{
                background: tab === t.id ? "var(--teal)" : "transparent",
                color: tab === t.id ? "var(--cream)" : "var(--teal)",
                borderRadius: "2px",
              }}>
              {t.label}
            </button>
          ))}
        </nav>
        <div className="pt-6 border-t flex flex-col gap-2" style={{ borderColor: "rgba(62,79,86,0.08)" }}>
          <button onClick={() => go("home")} className="text-left text-[12px] tracking-[0.18em] uppercase opacity-70 hover:opacity-100" style={{ color: "var(--teal)" }}>← View site</button>
          <button onClick={() => { if (confirm("Reset all admin changes to seed data?")) { window.BW.resetState(); setState(window.BW.loadState()); } }}
            className="text-left text-[11px] tracking-[0.18em] uppercase opacity-50 hover:opacity-80" style={{ color: "var(--teal)" }}>Reset demo data</button>
        </div>
      </aside>
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}

// ---- Bookings -----------------------------------------------------------

function BookingsView({ state, setState }) {
  const [view, setView] = useState("calendar"); // calendar | list
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
  const [reschedule, setReschedule] = useState(null);

  const serviceName = id => state.services.find(s => s.id === id)?.name || id;
  const therapistName = id => id === "any" ? "Unassigned" : (state.therapists.find(t => t.id === id)?.name || id);

  const filtered = state.bookings.filter(b => filter === "all" ? true : b.status === filter).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const selected = state.bookings.find(b => b.id === selectedId);

  const updateBooking = (id, patch) => {
    setState({ ...state, bookings: state.bookings.map(b => b.id === id ? { ...b, ...patch } : b) });
  };

  const stats = [
    { label: "Today", value: state.bookings.filter(b => b.date === new Date().toISOString().slice(0,10)).length },
    { label: "Upcoming", value: state.bookings.filter(b => b.status === "confirmed" && b.date >= new Date().toISOString().slice(0,10)).length },
    { label: "Pending", value: state.bookings.filter(b => b.status === "pending").length },
    { label: "This month", value: `£${state.bookings.filter(b => b.status !== "cancelled").reduce((s,b) => s + b.price, 0)}` },
  ];

  return (
    <div className="p-10">
      <div className="flex items-start justify-between mb-10">
        <div>
          <Eyebrow>Bookings</Eyebrow>
          <h1 className="font-display text-[38px] mt-3" style={{ color: "var(--teal)" }}>Appointments</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView("calendar")} className="px-4 py-2 text-[12px] tracking-[0.18em] uppercase transition-all"
            style={{ background: view === "calendar" ? "var(--teal)" : "transparent", color: view === "calendar" ? "var(--cream)" : "var(--teal)", border: "1px solid rgba(62,79,86,0.2)", borderRadius: "2px" }}>Calendar</button>
          <button onClick={() => setView("list")} className="px-4 py-2 text-[12px] tracking-[0.18em] uppercase transition-all"
            style={{ background: view === "list" ? "var(--teal)" : "transparent", color: view === "list" ? "var(--cream)" : "var(--teal)", border: "1px solid rgba(62,79,86,0.2)", borderRadius: "2px" }}>List</button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-10">
        {stats.map(s => (
          <div key={s.label} className="p-6" style={{ background: "var(--cream-light)", borderRadius: "8px" }}>
            <Eyebrow>{s.label}</Eyebrow>
            <div className="font-display text-[34px] mt-2" style={{ color: "var(--teal)" }}>{s.value}</div>
          </div>
        ))}
      </div>

      {view === "calendar" ? (
        <CalendarView state={state} onSelect={setSelectedId} />
      ) : (
        <div>
          <div className="flex gap-2 mb-4">
            {["all","confirmed","pending","cancelled"].map(f => (
              <button key={f} onClick={() => setFilter(f)} className="px-4 py-2 text-[11px] tracking-[0.18em] uppercase"
                style={{ background: filter === f ? "var(--teal)" : "transparent", color: filter === f ? "var(--cream)" : "var(--teal)", border: "1px solid rgba(62,79,86,0.15)", borderRadius: "2px" }}>{f}</button>
            ))}
          </div>
          <div className="overflow-hidden" style={{ background: "var(--cream-light)", borderRadius: "8px" }}>
            <table className="w-full text-[13px]" style={{ color: "var(--teal)" }}>
              <thead>
                <tr className="text-left text-[10px] tracking-[0.22em] uppercase" style={{ color: "var(--gold)", opacity: "var(--gold-intensity, 1)" }}>
                  <th className="p-4">ID</th><th className="p-4">Guest</th><th className="p-4">Treatment</th><th className="p-4">Therapist</th><th className="p-4">Date & time</th><th className="p-4">Price</th><th className="p-4">Status</th><th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(b => (
                  <tr key={b.id} className="border-t cursor-pointer hover:bg-white/40" style={{ borderColor: "rgba(62,79,86,0.08)" }} onClick={() => setSelectedId(b.id)}>
                    <td className="p-4 font-mono text-[11px] opacity-70">{b.id}</td>
                    <td className="p-4">{b.firstName} {b.lastName}</td>
                    <td className="p-4">{serviceName(b.treatment)} · {b.duration}m</td>
                    <td className="p-4">{therapistName(b.therapist)}</td>
                    <td className="p-4">{b.date} · {b.time}</td>
                    <td className="p-4">£{b.price}</td>
                    <td className="p-4"><StatusPill s={b.status} /></td>
                    <td className="p-4 text-right opacity-50">→</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && (
        <BookingDrawer booking={selected} state={state} onClose={() => setSelectedId(null)}
          onUpdate={patch => updateBooking(selected.id, patch)}
          onReschedule={() => setReschedule(selected)} />
      )}
      {reschedule && (
        <RescheduleModal booking={reschedule} state={state}
          onSave={(date, time) => { updateBooking(reschedule.id, { date, time }); setReschedule(null); }}
          onClose={() => setReschedule(null)} />
      )}
    </div>
  );
}

function StatusPill({ s }) {
  const map = {
    confirmed: { bg: "rgba(62,79,86,0.1)", color: "var(--teal)", label: "Confirmed" },
    pending: { bg: "rgba(178,139,93,0.15)", color: "var(--gold)", label: "Pending" },
    cancelled: { bg: "rgba(163,74,59,0.1)", color: "#A34A3B", label: "Cancelled" },
  }[s];
  return <span className="px-2.5 py-1 text-[10px] tracking-[0.18em] uppercase" style={{ background: map.bg, color: map.color, borderRadius: "2px" }}>{map.label}</span>;
}

function CalendarView({ state, onSelect }) {
  const [cursor, setCursor] = useState(() => new Date());
  const firstDay = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const offset = (firstDay.getDay() + 6) % 7;

  const byDate = {};
  for (const b of state.bookings) {
    if (b.status === "cancelled") continue;
    (byDate[b.date] ||= []).push(b);
  }
  const therapistColor = id => ({ maya: "var(--teal)", jordan: "var(--gold)", rani: "var(--stone)" }[id] || "var(--teal)");

  const cells = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div style={{ background: "var(--cream-light)", borderRadius: "8px" }}>
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: "rgba(62,79,86,0.08)" }}>
        <button onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))} className="opacity-70 hover:opacity-100" style={{ color: "var(--teal)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div className="font-display text-[20px]" style={{ color: "var(--teal)" }}>{cursor.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</div>
        <button onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))} className="opacity-70 hover:opacity-100" style={{ color: "var(--teal)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 6l6 6-6 6"/></svg>
        </button>
      </div>
      <div className="grid grid-cols-7 text-[10px] tracking-[0.2em] uppercase" style={{ color: "var(--gold)", opacity: "var(--gold-intensity, 1)" }}>
        {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => <div key={d} className="p-3 text-center">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-px" style={{ background: "rgba(62,79,86,0.06)" }}>
        {cells.map((d, i) => {
          if (d === null) return <div key={i} className="min-h-[100px]" style={{ background: "var(--cream-light)" }} />;
          const iso = `${cursor.getFullYear()}-${String(cursor.getMonth()+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
          const items = byDate[iso] || [];
          const dow = new Date(iso + "T00:00").getDay();
          const closed = dow === 0 || dow === 1;
          return (
            <div key={i} className="min-h-[100px] p-2" style={{ background: closed ? "rgba(160,150,135,0.05)" : "white" }}>
              <div className="text-[12px] mb-1" style={{ color: "var(--teal)", opacity: closed ? 0.3 : 0.8 }}>{d}</div>
              <div className="space-y-1">
                {items.map(b => (
                  <button key={b.id} onClick={() => onSelect(b.id)}
                    className="w-full text-left px-2 py-1 text-[10px] flex items-center gap-1.5 overflow-hidden"
                    style={{ background: "var(--cream-light)", borderLeft: `2px solid ${therapistColor(b.therapist)}`, color: "var(--teal)", borderRadius: "2px" }}>
                    <span className="opacity-70">{b.time}</span>
                    <span className="truncate">{b.lastName}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BookingDrawer({ booking, state, onClose, onUpdate, onReschedule }) {
  const service = state.services.find(s => s.id === booking.treatment);
  const therapist = booking.therapist === "any" ? { name: "Unassigned" } : state.therapists.find(t => t.id === booking.therapist);
  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ background: "rgba(40,54,60,0.4)" }} onClick={onClose}>
      <div className="w-[480px] h-full overflow-y-auto p-10" style={{ background: "var(--cream)" }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="text-[11px] tracking-[0.22em] uppercase opacity-60 hover:opacity-100" style={{ color: "var(--teal)" }}>← Close</button>
        <Eyebrow className="block mt-6">Booking · {booking.id}</Eyebrow>
        <h2 className="font-display text-[30px] mt-3" style={{ color: "var(--teal)" }}>{booking.firstName} {booking.lastName}</h2>
        <div className="mt-2"><StatusPill s={booking.status} /></div>

        <div className="mt-8 space-y-5 text-[14px]" style={{ color: "var(--teal)" }}>
          <DetailRow k="Treatment" v={`${service.name} · ${booking.duration} min`} />
          <DetailRow k="Therapist" v={therapist.name} />
          <DetailRow k="Date" v={new Date(booking.date + "T00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })} />
          <DetailRow k="Time" v={booking.time} />
          <DetailRow k="Email" v={booking.email} />
          <DetailRow k="Phone" v={booking.phone} />
          <DetailRow k="Price" v={`£${booking.price}`} />
          {booking.firstTime && <DetailRow k="First visit" v="Yes" />}
          {booking.notes && <DetailRow k="Notes" v={booking.notes} />}
        </div>

        <div className="mt-10 flex flex-col gap-3">
          {booking.status !== "confirmed" && (
            <Button variant="primary" onClick={() => onUpdate({ status: "confirmed" })}>Confirm booking</Button>
          )}
          <Button variant="secondary" onClick={onReschedule}>Reschedule</Button>
          {booking.status !== "cancelled" && (
            <button onClick={() => { if (confirm("Cancel this booking?")) onUpdate({ status: "cancelled" }); }}
              className="text-[12px] tracking-[0.2em] uppercase py-3" style={{ color: "#A34A3B" }}>Cancel booking</button>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ k, v }) {
  return (
    <div className="flex items-baseline justify-between gap-4 pb-3 border-b" style={{ borderColor: "rgba(62,79,86,0.08)" }}>
      <span className="text-[10px] tracking-[0.22em] uppercase opacity-60">{k}</span>
      <span className="text-right">{v}</span>
    </div>
  );
}

function RescheduleModal({ booking, state, onSave, onClose }) {
  const [date, setDate] = useState(booking.date);
  const [time, setTime] = useState(booking.time);
  const slots = window.BW.slotsFor(date, booking.therapist === "any" ? "maya" : booking.therapist, state.bookings.filter(b => b.id !== booking.id));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: "rgba(40,54,60,0.6)" }} onClick={onClose}>
      <div className="w-full max-w-[520px] p-8" style={{ background: "var(--cream)", borderRadius: "8px" }} onClick={e => e.stopPropagation()}>
        <Eyebrow>Reschedule</Eyebrow>
        <h2 className="font-display text-[26px] mt-3" style={{ color: "var(--teal)" }}>Move {booking.firstName}'s appointment</h2>
        <div className="mt-6">
          <Field label="Date"><input type="date" value={date} onChange={e => { setDate(e.target.value); setTime(null); }}
            className="w-full px-4 py-3 text-[14px] focus:outline-none" style={{ background: "var(--cream-light)", border: "1px solid rgba(160,150,135,0.4)", borderRadius: "2px", color: "var(--teal)" }} /></Field>
        </div>
        <div className="mt-5">
          <Eyebrow>New time</Eyebrow>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {slots.length === 0 && <div className="col-span-4 text-[13px] opacity-60" style={{ color: "var(--teal)" }}>No slots on this day.</div>}
            {slots.map(t => (
              <button key={t} onClick={() => setTime(t)}
                className="py-2 text-[13px]" style={{ background: t === time ? "var(--teal)" : "white", color: t === time ? "var(--cream)" : "var(--teal)", border: `1px solid ${t === time ? "var(--teal)" : "rgba(62,79,86,0.15)"}`, borderRadius: "2px" }}>{t}</button>
            ))}
          </div>
        </div>
        <div className="mt-8 flex gap-3 justify-end">
          <button onClick={onClose} className="px-5 py-2.5 text-[12px] tracking-[0.2em] uppercase" style={{ color: "var(--teal)" }}>Cancel</button>
          <Button variant="primary" disabled={!time} onClick={() => onSave(date, time)}>Save</Button>
        </div>
      </div>
    </div>
  );
}

// ---- Content WYSIWYG ----------------------------------------------------

function ContentView({ state, setState }) {
  const [selection, setSelection] = useState({ section: "hero", key: null });
  const c = state.content;
  const setField = (section, key, value) => {
    setState({ ...state, content: { ...c, [section]: { ...c[section], [key]: value } } });
  };
  const setApproachItem = (i, patch) => {
    const items = c.approach.items.map((it, idx) => idx === i ? { ...it, ...patch } : it);
    setState({ ...state, content: { ...c, approach: { ...c.approach, items } } });
  };
  return (
    <div className="p-10">
      <Eyebrow>Page content</Eyebrow>
      <h1 className="font-display text-[38px] mt-3 mb-10" style={{ color: "var(--teal)" }}>Edit what guests see</h1>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          <EditBlock title="Hero">
            <LabelledInput label="Eyebrow" value={c.hero.eyebrow} onChange={v => setField("hero", "eyebrow", v)} />
            <LabelledInput label="Display headline" value={c.hero.display} onChange={v => setField("hero", "display", v)} big />
            <LabelledTextarea label="Sub-copy" value={c.hero.sub} onChange={v => setField("hero", "sub", v)} />
            <div className="grid grid-cols-2 gap-4">
              <LabelledInput label="Primary CTA" value={c.hero.primaryCta} onChange={v => setField("hero", "primaryCta", v)} />
              <LabelledInput label="Secondary CTA" value={c.hero.secondaryCta} onChange={v => setField("hero", "secondaryCta", v)} />
            </div>
          </EditBlock>

          <EditBlock title="Approach — three principles">
            {c.approach.items.map((it, i) => (
              <div key={i} className="pb-5 border-b last:border-0" style={{ borderColor: "rgba(62,79,86,0.08)" }}>
                <LabelledInput label={`Title #${i + 1}`} value={it.eyebrow} onChange={v => setApproachItem(i, { eyebrow: v })} />
                <LabelledTextarea label="Body" value={it.body} onChange={v => setApproachItem(i, { body: v })} />
              </div>
            ))}
          </EditBlock>

          <EditBlock title="Testimonial">
            <LabelledTextarea label="Quote" value={c.testimonial.quote} onChange={v => setField("testimonial", "quote", v)} />
            <LabelledInput label="Attribution" value={c.testimonial.attribution} onChange={v => setField("testimonial", "attribution", v)} />
          </EditBlock>

          <EditBlock title="Visit">
            <LabelledInput label="Eyebrow" value={c.visit.eyebrow} onChange={v => setField("visit", "eyebrow", v)} />
            <LabelledInput label="Title" value={c.visit.title} onChange={v => setField("visit", "title", v)} />
            <LabelledTextarea label="Body" value={c.visit.body} onChange={v => setField("visit", "body", v)} />
            <div className="grid grid-cols-2 gap-4">
              <LabelledInput label="Phone" value={c.visit.phone} onChange={v => setField("visit", "phone", v)} />
              <LabelledInput label="Email" value={c.visit.email} onChange={v => setField("visit", "email", v)} />
            </div>
          </EditBlock>
        </div>

        <aside className="col-span-1">
          <div className="sticky top-10 p-6 text-[12px]" style={{ background: "var(--cream-light)", borderRadius: "8px", color: "var(--teal)" }}>
            <Eyebrow>Tip</Eyebrow>
            <p className="mt-3 leading-[22px] opacity-80">Edits save automatically to local storage. Click <em>View site</em> in the sidebar to see them live.</p>
            <p className="mt-4 leading-[22px] opacity-80">Keep headlines under ~8 words. The display face is most beautiful when given room.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function EditBlock({ title, children }) {
  return (
    <section className="p-6" style={{ background: "var(--cream-light)", borderRadius: "8px" }}>
      <Eyebrow>{title}</Eyebrow>
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}

// Tiny WYSIWYG with bold/italic/link on a contentEditable div
function RichEditor({ value, onChange, placeholder }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) ref.current.innerHTML = value || "";
  }, []);
  const cmd = (c, v) => { document.execCommand(c, false, v); ref.current.focus(); sync(); };
  const sync = () => onChange(ref.current.innerHTML);
  const makeLink = () => {
    const url = prompt("Link URL:");
    if (url) cmd("createLink", url);
  };
  return (
    <div>
      <div className="flex gap-1 mb-2 p-1" style={{ background: "rgba(62,79,86,0.06)", borderRadius: "2px", width: "fit-content" }}>
        <ToolBtn onClick={() => cmd("bold")} label="B" weight="font-bold" />
        <ToolBtn onClick={() => cmd("italic")} label="I" weight="italic" />
        <ToolBtn onClick={() => cmd("underline")} label="U" weight="underline" />
        <ToolBtn onClick={makeLink} label="🔗" />
        <ToolBtn onClick={() => cmd("insertUnorderedList")} label="• —" />
      </div>
      <div ref={ref} contentEditable onInput={sync} onBlur={sync}
        className="w-full min-h-[90px] px-4 py-3 text-[14px] leading-[24px] focus:outline-none focus:ring-2"
        style={{ background: "var(--cream-light)", border: "1px solid rgba(160,150,135,0.4)", borderRadius: "2px", color: "var(--teal)" }}
        data-placeholder={placeholder} />
    </div>
  );
}
function ToolBtn({ onClick, label, weight = "" }) {
  return <button type="button" onClick={onClick} className={`px-2.5 py-1 text-[13px] hover:bg-white/70 ${weight}`} style={{ color: "var(--teal)" }}>{label}</button>;
}

function LabelledInput({ label, value, onChange, big }) {
  return (
    <label className="block">
      <div className="text-[10px] tracking-[0.22em] uppercase mb-2" style={{ color: "var(--gold)", opacity: "var(--gold-intensity, 1)" }}>{label}</div>
      <input value={value} onChange={e => onChange(e.target.value)}
        className={`w-full px-4 py-3 focus:outline-none focus:ring-2 ${big ? "font-display text-[22px]" : "text-[14px]"}`}
        style={{ background: "var(--cream-light)", border: "1px solid rgba(160,150,135,0.4)", borderRadius: "2px", color: "var(--teal)" }} />
    </label>
  );
}
function LabelledTextarea({ label, value, onChange }) {
  return (
    <label className="block">
      <div className="text-[10px] tracking-[0.22em] uppercase mb-2" style={{ color: "var(--gold)", opacity: "var(--gold-intensity, 1)" }}>{label}</div>
      <textarea rows={3} value={value} onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-3 text-[14px] leading-[22px] focus:outline-none focus:ring-2"
        style={{ background: "var(--cream-light)", border: "1px solid rgba(160,150,135,0.4)", borderRadius: "2px", color: "var(--teal)" }} />
    </label>
  );
}

// ---- Services editor ----------------------------------------------------

function ServicesView({ state, setState }) {
  const setService = (id, patch) => {
    setState({ ...state, services: state.services.map(s => s.id === id ? { ...s, ...patch } : s) });
  };
  const setDuration = (id, idx, patch) => {
    const svc = state.services.find(s => s.id === id);
    const durations = svc.durations.map((d, i) => i === idx ? { ...d, ...patch } : d);
    setService(id, { durations });
  };
  return (
    <div className="p-10">
      <Eyebrow>Services & pricing</Eyebrow>
      <h1 className="font-display text-[38px] mt-3 mb-10" style={{ color: "var(--teal)" }}>Treatments</h1>
      <div className="space-y-6">
        {state.services.map(s => (
          <section key={s.id} className="p-7" style={{ background: "var(--cream-light)", borderRadius: "8px" }}>
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-4">
                <LabelledInput label="Name" value={s.name} onChange={v => setService(s.id, { name: v })} big />
                <LabelledInput label="Tagline" value={s.tagline} onChange={v => setService(s.id, { tagline: v })} />
                <label className="block">
                  <div className="text-[10px] tracking-[0.22em] uppercase mb-2" style={{ color: "var(--gold)", opacity: "var(--gold-intensity, 1)" }}>Lead paragraph</div>
                  <RichEditor value={s.lead} onChange={v => setService(s.id, { lead: v })} />
                </label>
              </div>
              <div>
                <Eyebrow>Durations & pricing</Eyebrow>
                <div className="mt-3 space-y-2">
                  {s.durations.map((d, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input value={d.mins} onChange={e => setDuration(s.id, i, { mins: +e.target.value })}
                        className="w-20 px-3 py-2 text-[14px] focus:outline-none" style={{ background: "white", border: "1px solid rgba(160,150,135,0.4)", borderRadius: "2px", color: "var(--teal)" }} />
                      <span className="text-[12px] opacity-60" style={{ color: "var(--teal)" }}>min · £</span>
                      <input value={d.price} onChange={e => setDuration(s.id, i, { price: +e.target.value })}
                        className="w-20 px-3 py-2 text-[14px] focus:outline-none" style={{ background: "white", border: "1px solid rgba(160,150,135,0.4)", borderRadius: "2px", color: "var(--teal)" }} />
                    </div>
                  ))}
                </div>
                <Eyebrow className="block mt-6">Qualified therapists</Eyebrow>
                <div className="mt-3 flex flex-wrap gap-2">
                  {state.therapists.map(t => {
                    const on = s.therapists.includes(t.id);
                    return (
                      <button key={t.id} onClick={() => setService(s.id, { therapists: on ? s.therapists.filter(x => x !== t.id) : [...s.therapists, t.id] })}
                        className="px-3 py-1.5 text-[12px]" style={{ background: on ? "var(--teal)" : "transparent", color: on ? "var(--cream)" : "var(--teal)", border: `1px solid ${on ? "var(--teal)" : "rgba(62,79,86,0.2)"}`, borderRadius: "2px" }}>{t.name}</button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

// ---- Image manager ------------------------------------------------------

function ImagesView({ state, setState }) {
  const slots = [
    { key: "hero", label: "Home hero", ratio: "21 / 9" },
    { key: "swedish", label: "Swedish treatment", ratio: "4 / 5" },
    { key: "deep", label: "Deep Tissue treatment", ratio: "4 / 5" },
    { key: "stone", label: "Hot Stone treatment", ratio: "4 / 5" },
    { key: "studio", label: "Studio interior", ratio: "4 / 3" },
  ];

  const setImage = async (key, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setState({ ...state, images: { ...state.images, [key]: reader.result } });
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-10">
      <Eyebrow>Images</Eyebrow>
      <h1 className="font-display text-[38px] mt-3" style={{ color: "var(--teal)" }}>Drop images in</h1>
      <p className="mt-3 text-[14px] opacity-70 max-w-[460px]" style={{ color: "var(--teal)" }}>
        Drag and drop a file, or click to browse. Warm natural light works best.
      </p>
      <div className="grid grid-cols-2 gap-6 mt-10">
        {slots.map(s => (
          <ImageDropSlot key={s.key} slot={s} value={state.images[s.key]}
            onChange={f => setImage(s.key, f)}
            onClear={() => setState({ ...state, images: { ...state.images, [s.key]: null } })} />
        ))}
      </div>
    </div>
  );
}

function ImageDropSlot({ slot, value, onChange, onClear }) {
  const [over, setOver] = useState(false);
  const inputRef = useRef(null);
  return (
    <div className="p-6" style={{ background: "var(--cream-light)", borderRadius: "8px" }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <Eyebrow>{slot.label}</Eyebrow>
          <div className="text-[11px] opacity-60 mt-1" style={{ color: "var(--teal)" }}>Ratio {slot.ratio}</div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => inputRef.current.click()} className="text-[11px] tracking-[0.18em] uppercase" style={{ color: "var(--teal)" }}>Replace</button>
          {value && <button onClick={onClear} className="text-[11px] tracking-[0.18em] uppercase" style={{ color: "#A34A3B" }}>Remove</button>}
        </div>
      </div>
      <div
        onDragOver={e => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={e => { e.preventDefault(); setOver(false); const f = e.dataTransfer.files[0]; if (f) onChange(f); }}
        onClick={() => inputRef.current.click()}
        className="relative cursor-pointer overflow-hidden transition-all"
        style={{
          aspectRatio: slot.ratio,
          outline: over ? `2px dashed var(--gold)` : `1px dashed rgba(62,79,86,0.25)`,
          outlineOffset: "-6px",
          background: value ? "black" : "var(--cream)",
          borderRadius: "4px",
        }}
      >
        {value ? (
          <img src={value} alt={slot.label} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3" style={{ color: "var(--stone)" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <rect x="3" y="3" width="18" height="18" rx="1" />
              <circle cx="9" cy="9" r="1.5" />
              <path d="M21 15l-5-5-11 11" />
            </svg>
            <div className="text-[12px] tracking-[0.18em] uppercase">Drop image · or click</div>
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => onChange(e.target.files[0])} />
    </div>
  );
}

// ---- Root ---------------------------------------------------------------

function AdminApp({ state, setState, go }) {
  const [tab, setTab] = useState("bookings");
  return (
    <AdminShell state={state} setState={setState} go={go} tab={tab} setTab={setTab}>
      {tab === "bookings" && <BookingsView state={state} setState={setState} />}
      {tab === "content" && <ContentView state={state} setState={setState} />}
      {tab === "services" && <ServicesView state={state} setState={setState} />}
      {tab === "images" && <ImagesView state={state} setState={setState} />}
    </AdminShell>
  );
}

Object.assign(window, { AdminApp });
