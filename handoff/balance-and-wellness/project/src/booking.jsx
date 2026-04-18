// 5-step booking wizard with mock Stripe-style payment and .ics download.

const { useState, useEffect, useMemo, useRef } = React;

function Stepper({ step }) {
  const steps = ["Treatment", "Therapist", "Date & time", "Details", "Confirm"];
  return (
    <div className="flex items-center gap-3 max-w-[880px] mx-auto">
      {steps.map((label, i) => (
        <div key={label} className="flex-1">
          <div className="h-[2px] w-full transition-all"
            style={{
              background: i <= step ? "var(--gold)" : "rgba(62,79,86,0.15)",
              opacity: i <= step ? "var(--gold-intensity, 1)" : 1,
            }} />
          <div className="mt-3 text-[10px] tracking-[0.22em] uppercase"
            style={{ color: i === step ? "var(--teal)" : "rgba(62,79,86,0.5)" }}>
            {String(i + 1).padStart(2, "0")} · {label}
          </div>
        </div>
      ))}
    </div>
  );
}

function Step1Treatment({ services, selected, onSelect, images }) {
  return (
    <div>
      <div className="text-center mb-14">
        <Eyebrow>Step one</Eyebrow>
        <h1 className="font-display text-[40px] md:text-[52px] mt-5" style={{ color: "var(--teal)" }}>What would your body like?</h1>
        <p className="mt-4 text-[15px] opacity-75 max-w-[460px] mx-auto" style={{ color: "var(--teal)" }}>Choose a treatment and a duration. You can change this later — nothing is booked yet.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {services.map(s => {
          const isSel = selected?.treatment === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onSelect({ treatment: s.id, duration: selected?.treatment === s.id ? selected.duration : s.durations[0].mins, price: selected?.treatment === s.id ? selected.price : s.durations[0].price })}
              className="text-left group transition-all"
              style={{
                background: "var(--cream-light)",
                borderRadius: "8px",
                outline: isSel ? `2px solid var(--gold)` : "1px solid rgba(62,79,86,0.08)",
                outlineOffset: "-1px",
              }}>
              <ImgPlaceholder label={`${s.name}`} url={images[s.image]} ratio="4 / 3" />
              <div className="p-6">
                <Eyebrow>Treatment</Eyebrow>
                <h3 className="font-display text-[24px] mt-2" style={{ color: "var(--teal)" }}>{s.name}</h3>
                <p className="mt-3 text-[13px] leading-[22px] opacity-80" style={{ color: "var(--teal)" }}>{s.tagline}</p>
                <div className="mt-4 text-[12px] opacity-70" style={{ color: "var(--teal)" }}>from £{s.durations[0].price} · {s.durations[0].mins} min</div>
              </div>
            </button>
          );
        })}
      </div>

      {selected?.treatment && (
        <div className="mt-12 text-center">
          <Eyebrow>Choose a duration</Eyebrow>
          <div className="mt-5 flex items-center justify-center gap-3 flex-wrap">
            {services.find(s => s.id === selected.treatment).durations.map(d => {
              const sel = d.mins === selected.duration;
              return (
                <button
                  key={d.mins}
                  onClick={() => onSelect({ ...selected, duration: d.mins, price: d.price })}
                  className="px-5 py-3 rounded-[2px] text-[13px] transition-all"
                  style={{
                    background: sel ? "var(--teal)" : "transparent",
                    color: sel ? "var(--cream)" : "var(--teal)",
                    border: `1px solid ${sel ? "var(--teal)" : "rgba(62,79,86,0.3)"}`,
                  }}>
                  {d.mins} minutes · £{d.price}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function Step2Therapist({ services, therapists, selected, onSelect }) {
  const treatment = services.find(s => s.id === selected.treatment);
  const available = therapists.filter(t => treatment.therapists.includes(t.id));
  return (
    <div>
      <div className="text-center mb-14">
        <Eyebrow>Step two</Eyebrow>
        <h1 className="font-display text-[40px] md:text-[52px] mt-5" style={{ color: "var(--teal)" }}>Who would you like to see?</h1>
        <p className="mt-4 text-[15px] opacity-75 max-w-[480px] mx-auto" style={{ color: "var(--teal)" }}>Each of our therapists is qualified for {treatment.name}. Pick a name — or leave it to us.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {available.map(t => {
          const sel = selected.therapist === t.id;
          const initials = t.name.split(" ").map(n => n[0]).join("");
          return (
            <button key={t.id} onClick={() => onSelect({ ...selected, therapist: t.id })}
              className="text-left p-7 transition-all"
              style={{
                background: "var(--cream-light)",
                borderRadius: "8px",
                outline: sel ? `2px solid var(--gold)` : "1px solid rgba(62,79,86,0.08)",
                outlineOffset: "-1px",
              }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center font-display text-[22px]"
                style={{ background: "var(--teal-deep)", color: "var(--cream)" }}>{initials}</div>
              <h3 className="font-display text-[22px] mt-5" style={{ color: "var(--teal)" }}>{t.name}</h3>
              <div className="text-[11px] tracking-[0.2em] uppercase mt-1" style={{ color: "var(--gold)", opacity: "var(--gold-intensity, 1)" }}>{t.role}</div>
              <p className="mt-4 text-[13px] leading-[22px] opacity-80" style={{ color: "var(--teal)" }}>{t.bio}</p>
              <div className="mt-4 text-[12px] opacity-60" style={{ color: "var(--teal)" }}>{t.years} years of practice</div>
            </button>
          );
        })}
        <button onClick={() => onSelect({ ...selected, therapist: "any" })}
          className="text-left p-7 transition-all flex flex-col justify-center items-start"
          style={{
            background: "transparent",
            borderRadius: "8px",
            outline: selected.therapist === "any" ? `2px solid var(--gold)` : "1px dashed rgba(62,79,86,0.3)",
          }}>
          <Eyebrow>Flexible</Eyebrow>
          <h3 className="font-display text-[22px] mt-3" style={{ color: "var(--teal)" }}>No preference</h3>
          <p className="mt-3 text-[13px] leading-[22px] opacity-80" style={{ color: "var(--teal)" }}>We'll assign based on who has the quietest hour.</p>
        </button>
      </div>
    </div>
  );
}

function MiniCalendar({ value, onChange, bookings, therapistId }) {
  const today = new Date();
  const [view, setView] = useState(() => {
    if (value) {
      const [y, m] = value.split("-").map(Number);
      return { y, m: m - 1 };
    }
    return { y: today.getFullYear(), m: today.getMonth() };
  });
  const firstDay = new Date(view.y, view.m, 1);
  const offset = (firstDay.getDay() + 6) % 7; // Mon-first
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const minBookable = new Date(); minBookable.setHours(minBookable.getHours() + 4);

  const cells = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const monthLabel = firstDay.toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => setView(v => ({ y: v.m === 0 ? v.y - 1 : v.y, m: (v.m + 11) % 12 }))}
          className="text-[var(--teal)] opacity-70 hover:opacity-100" aria-label="Previous month">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div className="font-display text-[20px]" style={{ color: "var(--teal)" }}>{monthLabel}</div>
        <button onClick={() => setView(v => ({ y: v.m === 11 ? v.y + 1 : v.y, m: (v.m + 1) % 12 }))}
          className="text-[var(--teal)] opacity-70 hover:opacity-100" aria-label="Next month">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 6l6 6-6 6"/></svg>
        </button>
      </div>
      <div className="grid grid-cols-7 text-center text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color: "var(--gold)", opacity: "var(--gold-intensity, 1)" }}>
        {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => <div key={d}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (d === null) return <div key={i} />;
          const dateObj = new Date(view.y, view.m, d);
          const iso = `${view.y}-${String(view.m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
          const dow = dateObj.getDay();
          const isClosed = dow === 0 || dow === 1;
          const isPast = dateObj < minBookable && !(dateObj.toDateString() === today.toDateString());
          const t0 = new Date(); t0.setHours(0,0,0,0);
          const isBeforeToday = dateObj < t0;
          const isSel = value === iso;
          const isToday = dateObj.toDateString() === today.toDateString();
          const disabled = isClosed || isBeforeToday;
          return (
            <button key={i} disabled={disabled} onClick={() => onChange(iso)}
              className="aspect-square flex items-center justify-center text-[13px] transition-all relative"
              style={{
                color: disabled ? "rgba(62,79,86,0.25)" : (isSel ? "var(--cream)" : "var(--teal)"),
                background: isSel ? "var(--teal)" : (isClosed ? "rgba(160,150,135,0.05)" : "transparent"),
                borderRadius: "2px",
                cursor: disabled ? "not-allowed" : "pointer",
                textDecoration: isClosed ? "line-through" : "none",
                fontWeight: isToday ? 600 : 400,
              }}>
              {d}
              {isToday && !isSel && <span className="absolute bottom-1 w-1 h-1 rounded-full" style={{ background: "var(--gold)", opacity: "var(--gold-intensity, 1)" }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Step3Schedule({ selected, onSelect, bookings }) {
  const onDate = (iso) => onSelect({ ...selected, date: iso, time: null });
  const slots = selected.date ? window.BW.slotsFor(selected.date, selected.therapist === "any" ? "maya" : selected.therapist, bookings) : [];
  return (
    <div>
      <div className="text-center mb-14">
        <Eyebrow>Step three</Eyebrow>
        <h1 className="font-display text-[40px] md:text-[52px] mt-5" style={{ color: "var(--teal)" }}>Find your hour.</h1>
        <p className="mt-4 text-[15px] opacity-75 max-w-[480px] mx-auto" style={{ color: "var(--teal)" }}>We're closed Sundays and Mondays. Bookings are held for 24 hours.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-12 max-w-[900px] mx-auto">
        <div className="p-8" style={{ background: "var(--cream-light)", borderRadius: "8px" }}>
          <MiniCalendar value={selected.date} onChange={onDate} bookings={bookings} therapistId={selected.therapist} />
        </div>
        <div className="p-8" style={{ background: "var(--cream-light)", borderRadius: "8px" }}>
          <Eyebrow>Available times</Eyebrow>
          <div className="font-display text-[22px] mt-3" style={{ color: "var(--teal)" }}>
            {selected.date ? new Date(selected.date + "T00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" }) : "Choose a date"}
          </div>
          {!selected.date && (
            <p className="mt-6 text-[13px] opacity-60" style={{ color: "var(--teal)" }}>Pick a date on the calendar to see available slots.</p>
          )}
          {selected.date && slots.length === 0 && (
            <p className="mt-6 text-[13px] opacity-70" style={{ color: "var(--teal)" }}>No availability this day. Please try another.</p>
          )}
          {slots.length > 0 && (
            <div className="mt-6 grid grid-cols-3 gap-2">
              {slots.map(t => {
                const sel = selected.time === t;
                return (
                  <button key={t} onClick={() => onSelect({ ...selected, time: t })}
                    className="py-3 text-[13px] transition-all"
                    style={{
                      background: sel ? "var(--teal)" : "white",
                      color: sel ? "var(--cream)" : "var(--teal)",
                      border: `1px solid ${sel ? "var(--teal)" : "rgba(62,79,86,0.15)"}`,
                      borderRadius: "2px",
                    }}>{t}</button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, required, hint, error }) {
  return (
    <label className="block">
      <div className="text-[10px] tracking-[0.22em] uppercase mb-2" style={{ color: "var(--gold)", opacity: "var(--gold-intensity, 1)" }}>{label}{required && <span className="opacity-70"> *</span>}</div>
      {children}
      {hint && !error && <div className="text-[12px] mt-1 opacity-60" style={{ color: "var(--teal)" }}>{hint}</div>}
      {error && <div className="text-[12px] mt-1" style={{ color: "#A34A3B" }}>{error}</div>}
    </label>
  );
}

const inputStyle = {
  background: "var(--cream-light)",
  border: "1px solid rgba(160,150,135,0.4)",
  borderRadius: "2px",
  color: "var(--teal)",
};

function Step4Details({ selected, onSelect, errors }) {
  const upd = (k, v) => onSelect({ ...selected, [k]: v });
  return (
    <div className="max-w-[640px] mx-auto">
      <div className="text-center mb-14">
        <Eyebrow>Step four</Eyebrow>
        <h1 className="font-display text-[40px] md:text-[52px] mt-5" style={{ color: "var(--teal)" }}>A few details.</h1>
        <p className="mt-4 text-[15px] opacity-75" style={{ color: "var(--teal)" }}>So we can be ready when you arrive.</p>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <Field label="First name" required error={errors.firstName}>
          <input value={selected.firstName || ""} onChange={e => upd("firstName", e.target.value)} className="w-full px-4 py-3 text-[14px] focus:outline-none focus:ring-2" style={{ ...inputStyle, '--tw-ring-color': 'var(--gold)' }} />
        </Field>
        <Field label="Last name" required error={errors.lastName}>
          <input value={selected.lastName || ""} onChange={e => upd("lastName", e.target.value)} className="w-full px-4 py-3 text-[14px] focus:outline-none focus:ring-2" style={inputStyle} />
        </Field>
        <Field label="Email" required error={errors.email}>
          <input type="email" value={selected.email || ""} onChange={e => upd("email", e.target.value)} className="w-full px-4 py-3 text-[14px] focus:outline-none focus:ring-2" style={inputStyle} />
        </Field>
        <Field label="Phone" required error={errors.phone}>
          <input type="tel" value={selected.phone || ""} onChange={e => upd("phone", e.target.value)} className="w-full px-4 py-3 text-[14px] focus:outline-none focus:ring-2" style={inputStyle} />
        </Field>
      </div>
      <label className="mt-6 flex items-center gap-3 text-[14px]" style={{ color: "var(--teal)" }}>
        <input type="checkbox" checked={!!selected.firstTime} onChange={e => upd("firstTime", e.target.checked)} className="w-4 h-4 accent-[var(--teal)]" />
        First time with us
      </label>
      <div className="mt-6">
        <Field label="Notes or requests" hint={`${(selected.notes || "").length}/300 — optional`}>
          <textarea maxLength={300} rows={4} value={selected.notes || ""} onChange={e => upd("notes", e.target.value)} className="w-full px-4 py-3 text-[14px] focus:outline-none focus:ring-2" style={inputStyle} />
        </Field>
      </div>
      <label className="mt-6 flex items-start gap-3 text-[13px] leading-[20px]" style={{ color: "var(--teal)" }}>
        <input type="checkbox" checked={!!selected.consent} onChange={e => upd("consent", e.target.checked)} className="mt-1 w-4 h-4 accent-[var(--teal)]" />
        <span className="opacity-85">I've read the cancellation policy (24 hours' notice) and consent to be contacted about this booking.</span>
      </label>
      {errors.consent && <div className="text-[12px] mt-1" style={{ color: "#A34A3B" }}>{errors.consent}</div>}
    </div>
  );
}

function CardMock({ card, setCard, errors }) {
  const fmt = v => v.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})/g, "$1 ").trim();
  const fmtExp = v => v.replace(/\D/g, "").slice(0, 4).replace(/(\d{2})(\d{1,2})/, "$1 / $2");
  return (
    <div className="p-6 rounded-[8px]" style={{ background: "var(--cream-light)", border: "1px solid rgba(62,79,86,0.08)" }}>
      <div className="flex items-center justify-between mb-5">
        <Eyebrow>Card payment</Eyebrow>
        <div className="flex items-center gap-1 text-[11px] opacity-60" style={{ color: "var(--teal)" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="1"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          Secured by Stripe (mock)
        </div>
      </div>
      <Field label="Card number" error={errors.cardNum}>
        <div className="flex items-center" style={{ ...inputStyle, padding: "0 12px" }}>
          <svg width="20" height="14" viewBox="0 0 32 20" fill="none"><rect width="32" height="20" rx="2" fill="#3E4F56"/><rect y="5" width="32" height="3" fill="#B28B5D"/></svg>
          <input value={card.num} onChange={e => setCard({ ...card, num: fmt(e.target.value) })} placeholder="4242 4242 4242 4242"
            className="w-full px-3 py-3 text-[14px] bg-transparent focus:outline-none" />
        </div>
      </Field>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <Field label="Expiry" error={errors.exp}>
          <input value={card.exp} onChange={e => setCard({ ...card, exp: fmtExp(e.target.value) })} placeholder="MM / YY"
            className="w-full px-4 py-3 text-[14px] focus:outline-none" style={inputStyle} />
        </Field>
        <Field label="CVC" error={errors.cvc}>
          <input value={card.cvc} onChange={e => setCard({ ...card, cvc: e.target.value.replace(/\D/g, "").slice(0, 3) })} placeholder="123"
            className="w-full px-4 py-3 text-[14px] focus:outline-none" style={inputStyle} />
        </Field>
      </div>
      <Field label="Name on card" error={errors.name}>
        <input value={card.name} onChange={e => setCard({ ...card, name: e.target.value })}
          className="w-full px-4 py-3 text-[14px] focus:outline-none" style={inputStyle} />
      </Field>
      <div className="mt-5 flex items-center gap-2 text-[11px] opacity-60" style={{ color: "var(--teal)" }}>
        <span>Try: 4242 4242 4242 4242 · any future date · any 3-digit CVC</span>
      </div>
    </div>
  );
}

function Step5Confirm({ selected, services, therapists, onConfirm, processing }) {
  const service = services.find(s => s.id === selected.treatment);
  const therapist = selected.therapist === "any" ? { name: "Any available therapist" } : therapists.find(t => t.id === selected.therapist);
  const [card, setCard] = useState({ num: "", exp: "", cvc: "", name: "" });
  const [errors, setErrors] = useState({});

  const submit = () => {
    const e = {};
    if (card.num.replace(/\s/g, "").length < 15) e.cardNum = "Please enter a valid card number.";
    if (!card.exp.match(/^\d{2}\s*\/\s*\d{2}$/)) e.exp = "MM / YY";
    if (card.cvc.length < 3) e.cvc = "3 digits";
    if (!card.name.trim()) e.name = "Name on card";
    setErrors(e);
    if (Object.keys(e).length === 0) onConfirm();
  };

  return (
    <div className="max-w-[880px] mx-auto">
      <div className="text-center mb-14">
        <Eyebrow>Step five</Eyebrow>
        <h1 className="font-display text-[40px] md:text-[52px] mt-5" style={{ color: "var(--teal)" }}>Confirm & hold.</h1>
        <p className="mt-4 text-[15px] opacity-75" style={{ color: "var(--teal)" }}>We'll charge £{selected.price} to hold your hour. Refundable up to 24 hours before.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <Eyebrow>Summary</Eyebrow>
          <div className="mt-4 p-6 space-y-3 text-[14px]" style={{ background: "var(--cream-light)", borderRadius: "8px", color: "var(--teal)" }}>
            <Row k="Treatment" v={`${service.name} · ${selected.duration} min`} />
            <Row k="Therapist" v={therapist.name} />
            <Row k="Date" v={new Date(selected.date + "T00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} />
            <Row k="Time" v={selected.time} />
            <Row k="Guest" v={`${selected.firstName} ${selected.lastName}`} />
            <Row k="Email" v={selected.email} />
            <div className="h-px my-3" style={{ background: "rgba(178,139,93,calc(var(--gold-intensity,1) * 0.5))" }} />
            <Row k="Total" v={<span className="font-display text-[18px]">£{selected.price}</span>} />
          </div>
          <div className="mt-6 text-[12px] leading-[20px] opacity-70" style={{ color: "var(--teal)" }}>
            Cancellation: Cancel or reschedule up to 24 hours before your appointment for a full refund. Shorter notice forfeits 50% of the treatment fee.
          </div>
        </div>
        <div>
          <CardMock card={card} setCard={setCard} errors={errors} />
          <div className="mt-6">
            <Button variant="primary" onClick={submit} disabled={processing} className="w-full !rounded-full !py-4">
              {processing ? "Processing…" : `Pay £${selected.price} & confirm`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
function Row({ k, v }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-[10px] tracking-[0.22em] uppercase opacity-60">{k}</span>
      <span className="text-right">{v}</span>
    </div>
  );
}

function SuccessScreen({ booking, services, therapists, go }) {
  const service = services.find(s => s.id === booking.treatment);
  const therapist = booking.therapist === "any" ? { name: "Your therapist" } : therapists.find(t => t.id === booking.therapist);
  const downloadIcs = () => {
    const ics = window.BW.makeIcs(booking, service.name, therapist.name);
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `balance-wellness-${booking.id}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="max-w-[720px] mx-auto text-center pt-10 pb-24">
      <GoldRule width="w-12" />
      <Eyebrow className="block mt-6">Confirmed · {booking.id}</Eyebrow>
      <h1 className="font-display text-[56px] md:text-[72px] mt-6 leading-[1.1]" style={{ color: "var(--teal)" }}>Your hour is held.</h1>
      <p className="mt-6 text-[15px] leading-[28px] opacity-80 max-w-[460px] mx-auto" style={{ color: "var(--teal)" }}>
        A confirmation is on its way to {booking.email}. Please arrive five minutes early so we can walk you in slowly.
      </p>
      <div className="mt-10 p-8 text-left grid grid-cols-2 gap-5 text-[14px]"
        style={{ background: "var(--cream-light)", borderRadius: "8px", color: "var(--teal)" }}>
        <Cell k="Treatment" v={`${service.name} · ${booking.duration} min`} />
        <Cell k="Therapist" v={therapist.name} />
        <Cell k="Date" v={new Date(booking.date + "T00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })} />
        <Cell k="Time" v={booking.time} />
        <Cell k="Studio" v="14 Linen Lane, Bristol BS1 4AA" />
        <Cell k="Total paid" v={`£${booking.price}`} />
      </div>
      <div className="mt-10 flex items-center justify-center gap-6 flex-wrap">
        <Button variant="primary" onClick={downloadIcs}>Add to calendar</Button>
        <a onClick={() => go("journal")} className="cursor-pointer text-[13px] tracking-[0.12em] uppercase border-b pb-1"
          style={{ color: "var(--teal)", borderColor: "var(--gold)", opacity: "var(--gold-intensity, 1)" }}>Read the journal →</a>
      </div>
    </div>
  );
}
function Cell({ k, v }) {
  return (
    <div>
      <div className="text-[10px] tracking-[0.22em] uppercase opacity-60">{k}</div>
      <div className="mt-1">{v}</div>
    </div>
  );
}

function BookingFlow({ state, setState, go }) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState({});
  const [processing, setProcessing] = useState(false);
  const [confirmed, setConfirmed] = useState(null);
  const [errors, setErrors] = useState({});

  const canAdvance = () => {
    if (step === 0) return selected.treatment && selected.duration;
    if (step === 1) return !!selected.therapist;
    if (step === 2) return !!selected.date && !!selected.time;
    if (step === 3) {
      const e = {};
      if (!selected.firstName) e.firstName = "Required";
      if (!selected.lastName) e.lastName = "Required";
      if (!selected.email || !selected.email.includes("@")) e.email = "Valid email required";
      if (!selected.phone) e.phone = "Required";
      if (!selected.consent) e.consent = "Please accept to continue";
      setErrors(e);
      return Object.keys(e).length === 0;
    }
    return true;
  };

  const onConfirm = () => {
    setProcessing(true);
    setTimeout(() => {
      const booking = {
        id: "BK-" + Math.floor(2000 + Math.random() * 8000),
        status: "confirmed",
        ...selected,
        createdAt: new Date().toISOString(),
      };
      const next = { ...state, bookings: [...state.bookings, booking] };
      setState(next);
      console.log("[mock-email] Confirmation sent:", { to: booking.email, booking });
      setConfirmed(booking);
      setProcessing(false);
    }, 1400);
  };

  if (confirmed) {
    return (
      <div className="min-h-screen px-6 md:px-12 py-16" style={{ background: "var(--cream)" }}>
        <SuccessScreen booking={confirmed} services={state.services} therapists={state.therapists} go={go} />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 md:px-12 py-12" style={{ background: "var(--cream)" }}>
      <div className="max-w-[1100px] mx-auto">
        <button onClick={() => step === 0 ? go("home") : setStep(s => s - 1)}
          className="text-[11px] tracking-[0.22em] uppercase opacity-60 hover:opacity-100 flex items-center gap-2" style={{ color: "var(--teal)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          {step === 0 ? "Back to home" : "Back"}
        </button>
        <div className="mt-10"><Stepper step={step} /></div>
        <div className="mt-20">
          {step === 0 && <Step1Treatment services={state.services} selected={selected} onSelect={setSelected} images={state.images} />}
          {step === 1 && <Step2Therapist services={state.services} therapists={state.therapists} selected={selected} onSelect={setSelected} />}
          {step === 2 && <Step3Schedule selected={selected} onSelect={setSelected} bookings={state.bookings} />}
          {step === 3 && <Step4Details selected={selected} onSelect={setSelected} errors={errors} />}
          {step === 4 && <Step5Confirm selected={selected} services={state.services} therapists={state.therapists} onConfirm={onConfirm} processing={processing} />}
        </div>
        {step < 4 && (
          <div className="mt-16 flex items-center justify-between">
            <span className="text-[11px] tracking-[0.22em] uppercase opacity-50" style={{ color: "var(--teal)" }}>
              {selected.treatment && selected.price ? `£${selected.price}` : "—"}
            </span>
            <Button variant="primary" disabled={false} onClick={() => { if (canAdvance()) setStep(s => s + 1); }}>
              Continue →
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { BookingFlow });
