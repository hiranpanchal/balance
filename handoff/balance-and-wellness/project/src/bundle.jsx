// Mock data + shared state for the Balance and Wellness prototype.
// Stored in localStorage so admin edits persist across refreshes.

const LS_KEY = "bw_prototype_state_v1";

const SEED = {
  content: {
    hero: {
      eyebrow: "MASSAGE · BODYWORK · SPA",
      display: "A quiet hour, well kept.",
      sub: "Boutique massage and bodywork, delivered with unhurried attention. Open Tuesday through Saturday.",
      primaryCta: "Book a session",
      secondaryCta: "See our treatments",
    },
    approach: {
      title: "Our approach",
      items: [
        { eyebrow: "Stillness", body: "We protect quiet — in our rooms, our rituals, our design." },
        { eyebrow: "Craft", body: "Fully-qualified therapists with at least five years of clinical practice." },
        { eyebrow: "Presence", body: "One guest at a time. No double-booking, no overlap, no rushing." },
      ],
    },
    treatmentsIntro: {
      eyebrow: "TREATMENTS",
      title: "Three treatments, each honed over years.",
      body: "Choose what your body is asking for — or let us help you decide.",
    },
    testimonial: {
      quote: "I came in rigid. I left feeling like myself again.",
      attribution: "— ANNA R., GUEST SINCE 2024",
    },
    visit: {
      eyebrow: "VISIT",
      title: "14 Linen Lane, Bristol.",
      body: "A quiet side street two minutes from the harbour. Tea is always on.",
      address: ["14 Linen Lane", "Bristol BS1 4AA"],
      hours: [
        ["Tuesday — Friday", "09:00 — 19:00"],
        ["Saturday", "09:00 — 17:00"],
        ["Sunday & Monday", "Closed"],
      ],
      phone: "+44 117 496 2250",
      email: "hello@balanceandwellness.com",
    },
    newsletter: {
      title: "Monthly notes on stillness, sleep, and simple rituals.",
      sub: "No noise. Unsubscribe any time.",
    },
  },

  services: [
    {
      id: "swedish",
      name: "Swedish",
      tagline: "Long, gliding strokes to settle the nervous system.",
      lead: "Our Swedish massage is built around long, gliding strokes and a steady rhythm. It's designed to quiet the nervous system — ideal if you've been carrying weeks of low-grade stress and just need to land.",
      goodFor: ["General tension", "Sleep difficulty", "First-time guests", "Recovery weeks"],
      durations: [
        { mins: 60, price: 75 },
        { mins: 75, price: 88 },
        { mins: 90, price: 105 },
      ],
      therapists: ["maya", "jordan", "rani"],
      image: "swedish",
    },
    {
      id: "deep-tissue",
      name: "Deep Tissue",
      tagline: "Focused, therapeutic pressure for tension that's had enough.",
      lead: "Therapeutic, focused-pressure bodywork for tension that's become stubborn. Slower than a Swedish, deeper into the muscle, and tailored to whatever is holding you back today.",
      goodFor: ["Desk-related tightness", "Frozen shoulder", "Post-exercise recovery", "Chronic neck/back tension"],
      durations: [
        { mins: 60, price: 85 },
        { mins: 75, price: 98 },
        { mins: 90, price: 115 },
      ],
      therapists: ["maya", "jordan"],
      image: "deep",
    },
    {
      id: "hot-stone",
      name: "Hot Stone",
      tagline: "Heated basalt stones to draw warmth deep into the muscle.",
      lead: "Heated basalt stones, warmed to body temperature plus twenty degrees, used as an extension of the therapist's hands. The warmth reaches places manual pressure alone can't.",
      goodFor: ["Deep cold-weather tension", "Circulation", "Nervous-system down-regulation", "Guests who run cold"],
      durations: [
        { mins: 60, price: 95 },
        { mins: 75, price: 110 },
        { mins: 90, price: 130 },
      ],
      therapists: ["maya", "rani"],
      image: "stone",
    },
  ],

  therapists: [
    {
      id: "maya",
      name: "Maya Chen",
      role: "Lead Therapist",
      years: 11,
      bio: "Trained in Stockholm and Kyoto. Maya leads our clinical practice and teaches the rest of the team the craft of a long, quiet session.",
    },
    {
      id: "jordan",
      name: "Jordan Ayotte",
      role: "Senior Therapist",
      years: 7,
      bio: "A specialist in stubborn, desk-bound tension. Jordan works slowly and always leaves fifteen minutes at the end for a slow return.",
    },
    {
      id: "rani",
      name: "Rani Okafor",
      role: "Therapist & Reiki Practitioner",
      years: 6,
      bio: "Rani pairs bodywork with breath and Reiki. Guests often describe her sessions as the quietest hour of their week.",
    },
  ],

  // Bookings: seed a few so the admin view isn't empty.
  bookings: [
    {
      id: "BK-2041",
      status: "confirmed",
      treatment: "swedish",
      duration: 60,
      therapist: "maya",
      date: "2026-04-22",
      time: "10:00",
      firstName: "Eleanor",
      lastName: "Pryce",
      email: "eleanor.p@example.com",
      phone: "+44 7700 900181",
      firstTime: false,
      notes: "",
      price: 75,
      createdAt: "2026-04-14T09:12:00Z",
    },
    {
      id: "BK-2042",
      status: "confirmed",
      treatment: "deep-tissue",
      duration: 90,
      therapist: "jordan",
      date: "2026-04-22",
      time: "14:30",
      firstName: "Marcus",
      lastName: "Reed",
      email: "m.reed@example.com",
      phone: "+44 7700 900472",
      firstTime: true,
      notes: "Lower-back focus, please.",
      price: 115,
      createdAt: "2026-04-15T18:40:00Z",
    },
    {
      id: "BK-2043",
      status: "pending",
      treatment: "hot-stone",
      duration: 75,
      therapist: "rani",
      date: "2026-04-24",
      time: "11:00",
      firstName: "Priya",
      lastName: "Shah",
      email: "priya@example.com",
      phone: "+44 7700 900903",
      firstTime: false,
      notes: "",
      price: 110,
      createdAt: "2026-04-16T08:05:00Z",
    },
    {
      id: "BK-2044",
      status: "confirmed",
      treatment: "swedish",
      duration: 75,
      therapist: "maya",
      date: "2026-04-25",
      time: "15:00",
      firstName: "Thomas",
      lastName: "Okafor",
      email: "t.o@example.com",
      phone: "+44 7700 900112",
      firstTime: false,
      notes: "",
      price: 88,
      createdAt: "2026-04-16T14:22:00Z",
    },
  ],

  // Simple image library (admin can upload; URLs are object URLs or data URLs).
  images: {
    hero: null,       // null -> use default SVG placeholder
    swedish: null,
    deep: null,
    stone: null,
    studio: null,
  },
};

function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return structuredClone(SEED);
    const parsed = JSON.parse(raw);
    // Shallow merge to add any new keys from future SEED updates.
    return { ...structuredClone(SEED), ...parsed };
  } catch (e) {
    return structuredClone(SEED);
  }
}

function saveState(state) {
  try {
    // Strip blob URLs (can't persist); keep data URLs.
    const copy = { ...state, images: { ...state.images } };
    for (const k of Object.keys(copy.images || {})) {
      const v = copy.images[k];
      if (typeof v === "string" && v.startsWith("blob:")) copy.images[k] = null;
    }
    localStorage.setItem(LS_KEY, JSON.stringify(copy));
  } catch (e) { /* ignore quota */ }
}

function resetState() {
  localStorage.removeItem(LS_KEY);
}

// Generate availability for a given date+therapist. Closed Sun (0) & Mon (1).
function slotsFor(dateISO, therapistId, bookings) {
  const d = new Date(dateISO + "T00:00:00");
  const day = d.getDay();
  if (day === 0 || day === 1) return [];
  const base = [
    "09:00","09:30","10:00","10:30","11:00","11:30",
    "12:00","13:30","14:00","14:30","15:00","15:30",
    "16:00","16:30","17:00","17:30",
  ];
  // Sat (6) closes earlier
  const pool = day === 6 ? base.filter(t => t < "17:00") : base;
  // Remove slots already booked for that therapist
  const taken = new Set(
    bookings
      .filter(b => b.date === dateISO && b.therapist === therapistId && b.status !== "cancelled")
      .map(b => b.time)
  );
  // Pseudo-random unavailability for realism (deterministic by date+therapist)
  const seed = [...(dateISO + therapistId)].reduce((a, c) => a + c.charCodeAt(0), 0);
  return pool.filter((t, i) => {
    if (taken.has(t)) return false;
    const h = (seed + i * 7) % 11;
    return h > 2; // drop ~25% of slots
  });
}

// .ics generation
function makeIcs(booking, treatmentName, therapistName) {
  const dt = booking.date.replace(/-/g, "");
  const [hh, mm] = booking.time.split(":");
  const start = `${dt}T${hh}${mm}00`;
  const endDate = new Date(booking.date + "T" + booking.time + ":00");
  endDate.setMinutes(endDate.getMinutes() + booking.duration);
  const pad = n => String(n).padStart(2, "0");
  const end = `${endDate.getFullYear()}${pad(endDate.getMonth()+1)}${pad(endDate.getDate())}T${pad(endDate.getHours())}${pad(endDate.getMinutes())}00`;
  const uid = `${booking.id}@balanceandwellness.com`;
  const summary = `${treatmentName} with ${therapistName} — Balance and Wellness`;
  const desc = `Your ${booking.duration}-minute ${treatmentName} treatment. 14 Linen Lane, Bristol BS1 4AA.`;
  return [
    "BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Balance and Wellness//Booking//EN",
    "BEGIN:VEVENT",`UID:${uid}`,`DTSTAMP:${start}`,`DTSTART:${start}`,`DTEND:${end}`,
    `SUMMARY:${summary}`,`DESCRIPTION:${desc}`,"LOCATION:14 Linen Lane, Bristol BS1 4AA",
    "END:VEVENT","END:VCALENDAR",
  ].join("\r\n");
}

// Tiny pub/sub so admin edits live-update the site view
const listeners = new Set();
function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }
function notify() { listeners.forEach(fn => fn()); }

window.BW = {
  loadState, saveState, resetState, slotsFor, makeIcs,
  subscribe, notify, SEED,
};


// Shared UI primitives + Nav + Footer + Home page.
// Everything uses Tailwind utility classes and the CSS custom properties
// defined in index.html (--teal, --gold, --cream, etc).

const { useState, useEffect, useMemo, useRef, useCallback } = React;

// ---- primitives ----------------------------------------------------------

const GoldRule = ({ className = "", width = "w-12" }) => (
  <span
    className={`inline-block h-px ${width} ${className}`}
    style={{ background: "var(--gold)", opacity: "var(--gold-intensity, 1)" }}
  />
);

const Eyebrow = ({ children, className = "" }) => (
  <span
    className={`block text-[11px] tracking-[0.22em] uppercase ${className}`}
    style={{ color: "var(--gold)", opacity: "var(--gold-intensity, 1)" }}
  >
    {children}
  </span>
);

const Button = ({ children, variant = "primary", onClick, href, className = "", type = "button", disabled, ...rest }) => {
  const base = "inline-flex items-center justify-center gap-2 text-[13px] tracking-[0.08em] uppercase transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed";
  const styles = {
    primary: "rounded-full px-7 py-3 text-[var(--cream)] hover:bg-[var(--teal-deep)]",
    secondary: "rounded-full px-7 py-3 border border-[var(--teal)] text-[var(--teal)] hover:bg-[var(--cream-light)]",
    tertiary: "px-0 py-1 text-[var(--teal)] border-b border-transparent hover:border-[var(--gold)]",
  };
  const primaryBg = variant === "primary" ? { background: "var(--teal)" } : {};
  const Cmp = href ? "a" : "button";
  return (
    <Cmp
      href={href}
      type={href ? undefined : type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles[variant]} ${className}`}
      style={primaryBg}
      {...rest}
    >
      {children}
    </Cmp>
  );
};

// Striped placeholder with hint label (used when no image uploaded)
const ImgPlaceholder = ({ label, className = "", ratio = "16 / 10", url = null, tone = "cream" }) => {
  if (url) {
    return (
      <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio: ratio }}>
        <img src={url} alt={label} className="w-full h-full object-cover" />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(234,226,210,0.06)" }} />
      </div>
    );
  }
  const bg = tone === "dark" ? "var(--teal-deep)" : "var(--cream-light)";
  const line = tone === "dark" ? "rgba(234,226,210,0.08)" : "rgba(62,79,86,0.08)";
  return (
    <div
      className={`relative overflow-hidden flex items-end ${className}`}
      style={{
        aspectRatio: ratio,
        background: `repeating-linear-gradient(135deg, ${bg} 0 22px, ${line} 22px 23px)`,
      }}
    >
      <div className="p-4 font-mono text-[10px] tracking-widest uppercase" style={{ color: "var(--stone)" }}>
        [ {label} ]
      </div>
    </div>
  );
};

// ---- Nav -----------------------------------------------------------------

function Nav({ route, go, announcement = true }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { id: "services", label: "Services" },
    { id: "about", label: "About" },
    { id: "pricing", label: "Pricing" },
    { id: "journal", label: "Journal" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-40" style={{ background: "var(--cream)" }}>
      {announcement && (
        <div className="text-center py-2 text-[11px] tracking-[0.22em] uppercase"
          style={{ background: "var(--cream-light)", color: "var(--teal)" }}>
          <span>Spring hours — now open Saturdays until 5pm</span>
        </div>
      )}
      <nav className={`flex items-center justify-between px-6 md:px-12 py-5 transition-all ${scrolled ? "border-b" : ""}`}
        style={{ borderColor: scrolled ? "rgba(178,139,93,calc(var(--gold-intensity,1) * 0.35))" : "transparent" }}>
        <a onClick={() => go("home")} className="cursor-pointer flex items-center" aria-label="Balance and Wellness, home">
          <span className="font-display text-[26px] leading-none" style={{ color: "var(--teal)" }}>Balance</span>
          <span className="font-script text-[20px] ml-2 mt-3" style={{ color: "var(--gold)", opacity: "var(--gold-intensity, 1)" }}>and Wellness</span>
        </a>
        <ul className="hidden md:flex items-center gap-9">
          {links.map(l => (
            <li key={l.id}>
              <a
                onClick={() => go(l.id)}
                className="cursor-pointer text-[13px] tracking-[0.12em] uppercase relative pb-1"
                style={{ color: "var(--teal)" }}
              >
                {l.label}
                {route === l.id && (
                  <span className="absolute left-0 right-0 -bottom-1 h-[2px]"
                    style={{ background: "var(--gold)", opacity: "var(--gold-intensity, 1)" }} />
                )}
              </a>
            </li>
          ))}
          <li>
            <Button variant="primary" onClick={() => go("book")}>Book</Button>
          </li>
          <li>
            <a onClick={() => go("admin")} className="cursor-pointer text-[11px] tracking-[0.22em] uppercase opacity-60 hover:opacity-100" style={{ color: "var(--teal)" }}>Admin</a>
          </li>
        </ul>
        <button className="md:hidden text-[var(--teal)]" onClick={() => setOpen(!open)} aria-label="Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      </nav>
      {open && (
        <div className="md:hidden border-t px-6 py-4 flex flex-col gap-4"
          style={{ borderColor: "rgba(62,79,86,0.08)", background: "var(--cream)" }}>
          {links.map(l => (
            <a key={l.id} onClick={() => { go(l.id); setOpen(false); }} className="cursor-pointer text-[14px] tracking-[0.12em] uppercase" style={{ color: "var(--teal)" }}>{l.label}</a>
          ))}
          <Button variant="primary" onClick={() => { go("book"); setOpen(false); }}>Book</Button>
          <a onClick={() => { go("admin"); setOpen(false); }} className="cursor-pointer text-[12px] tracking-[0.22em] uppercase opacity-60" style={{ color: "var(--teal)" }}>Admin</a>
        </div>
      )}
    </header>
  );
}

// ---- Footer --------------------------------------------------------------

function Footer({ content, go }) {
  return (
    <footer className="pt-20 pb-10 px-6 md:px-12" style={{ background: "var(--teal-deep)", color: "var(--cream)" }}>
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div>
          <div className="flex items-baseline">
            <span className="font-display text-[28px]" style={{ color: "var(--cream)" }}>Balance</span>
            <span className="font-script text-[20px] ml-2" style={{ color: "var(--gold)", opacity: "var(--gold-intensity, 1)" }}>and Wellness</span>
          </div>
          <p className="mt-5 text-[13px] leading-[22px] opacity-70 max-w-[220px]">
            A boutique massage studio in the heart of Bristol.
          </p>
        </div>
        <div>
          <Eyebrow className="!text-[var(--gold)]">Studio</Eyebrow>
          <ul className="mt-4 space-y-2 text-[13px]">
            <li><a onClick={() => go("about")} className="cursor-pointer opacity-80 hover:opacity-100">About</a></li>
            <li><a onClick={() => go("services")} className="cursor-pointer opacity-80 hover:opacity-100">Treatments</a></li>
            <li><a onClick={() => go("pricing")} className="cursor-pointer opacity-80 hover:opacity-100">Pricing</a></li>
            <li><a onClick={() => go("journal")} className="cursor-pointer opacity-80 hover:opacity-100">Journal</a></li>
          </ul>
        </div>
        <div>
          <Eyebrow>Visit</Eyebrow>
          <ul className="mt-4 space-y-2 text-[13px] opacity-80">
            {content.visit.address.map(l => <li key={l}>{l}</li>)}
            <li className="pt-2">{content.visit.phone}</li>
            <li><a href={`mailto:${content.visit.email}`} className="hover:opacity-100">{content.visit.email}</a></li>
          </ul>
        </div>
        <div>
          <Eyebrow>Newsletter</Eyebrow>
          <p className="mt-4 text-[13px] leading-[22px] opacity-80">{content.newsletter.title}</p>
          <form onSubmit={(e) => { e.preventDefault(); alert("Subscribed (mock)"); }} className="mt-4 flex items-center border-b pb-2" style={{ borderColor: "rgba(234,226,210,0.25)" }}>
            <input type="email" placeholder="your@email.com" className="bg-transparent flex-1 text-[13px] placeholder:opacity-50 focus:outline-none" style={{ color: "var(--cream)" }} />
            <button type="submit" className="text-[11px] tracking-[0.22em] uppercase" style={{ color: "var(--gold)", opacity: "var(--gold-intensity, 1)" }}>Subscribe →</button>
          </form>
        </div>
      </div>
      <div className="max-w-[1280px] mx-auto mt-16 pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] tracking-[0.18em] uppercase opacity-50 gap-3"
        style={{ borderTop: "1px solid rgba(234,226,210,0.15)" }}>
        <span>© 2026 Balance and Wellness · Designed by Focus & Co</span>
        <div className="flex gap-6">
          <a onClick={() => go("privacy")} className="cursor-pointer">Privacy</a>
          <a onClick={() => go("terms")} className="cursor-pointer">Terms</a>
          <a className="cursor-pointer">Instagram</a>
        </div>
      </div>
    </footer>
  );
}

// ---- Hero ---------------------------------------------------------------

function Hero({ content, images, go, density }) {
  const heroUrl = images.hero;
  const compact = density === "compact";
  return (
    <section className={`relative w-full ${compact ? "h-[72vh] min-h-[520px]" : "h-[88vh] min-h-[640px]"} flex items-center justify-center overflow-hidden`}>
      {/* Image layer */}
      <div className="absolute inset-0">
        {heroUrl ? (
          <img src={heroUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: `
                radial-gradient(ellipse at 30% 40%, rgba(210,184,148,0.55), transparent 60%),
                radial-gradient(ellipse at 70% 70%, rgba(62,79,86,0.85), transparent 70%),
                linear-gradient(180deg, #3a302a, #221a17 70%)
              `,
            }}
          />
        )}
        {/* warm overlay + cream gradient bottom */}
        <div className="absolute inset-0" style={{ background: "rgba(178,139,93,0.04)" }} />
        <div className="absolute inset-x-0 bottom-0 h-40" style={{ background: "linear-gradient(to bottom, transparent, var(--cream))" }} />
      </div>

      <div className="relative z-10 text-center px-6 max-w-[780px]">
        <Eyebrow className="!text-[var(--cream-light)]">{content.hero.eyebrow}</Eyebrow>
        <div className="flex justify-center mt-4">
          <GoldRule width="w-10" />
        </div>
        <h1 className={`font-display mt-6 leading-[1.05] ${compact ? "text-[52px] md:text-[64px]" : "text-[56px] md:text-[78px]"}`}
          style={{ color: "var(--cream)" }}>
          {content.hero.display}
        </h1>
        <p className="mt-8 text-[17px] md:text-[19px] leading-[30px] max-w-[520px] mx-auto"
          style={{ color: "var(--cream)", opacity: 0.9 }}>
          {content.hero.sub}
        </p>
        <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
          <Button variant="primary" onClick={() => go("book")}>{content.hero.primaryCta}</Button>
          <a onClick={() => go("services")} className="cursor-pointer text-[13px] tracking-[0.12em] uppercase border-b pb-1"
            style={{ color: "var(--cream)", borderColor: "var(--gold)", opacity: "var(--gold-intensity, 1)" }}>
            {content.hero.secondaryCta}
          </a>
        </div>
      </div>

      {/* soft scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center" style={{ color: "var(--cream)", opacity: 0.7 }}>
        <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <span className="mt-2 w-px h-10" style={{ background: "var(--cream)" }} />
      </div>
    </section>
  );
}

// ---- Home sections -------------------------------------------------------

function Approach({ content, density }) {
  const pad = density === "compact" ? "py-20" : "py-32";
  return (
    <section className={`${pad} px-6 md:px-12`} style={{ background: "var(--cream)" }}>
      <div className="max-w-[1180px] mx-auto">
        <div className="text-center">
          <Eyebrow>— {content.approach.title} —</Eyebrow>
          <h2 className="font-display text-[36px] md:text-[44px] leading-[1.15] mt-6 max-w-[620px] mx-auto"
            style={{ color: "var(--teal)" }}>
            Welcome to Balance and Wellness. We're passionate about complementary therapies.
          </h2>
          <p className="mt-6 text-[15px] leading-[28px] max-w-[540px] mx-auto" style={{ color: "var(--teal)", opacity: 0.75 }}>
            Three principles shape every session — from the moment you arrive to the final cup of tea on the way out.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-12 md:gap-16 mt-20">
          {content.approach.items.map((it, i) => (
            <div key={i} className="text-center">
              <div className="mx-auto mb-6 w-10 h-10 flex items-center justify-center" style={{ color: "var(--gold)", opacity: "var(--gold-intensity, 1)" }}>
                {/* Minimal lucide-style stroke icons */}
                {i === 0 && (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <circle cx="12" cy="12" r="9" />
                    <circle cx="12" cy="12" r="4" />
                  </svg>
                )}
                {i === 1 && (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <path d="M4 18c4-6 12-6 16 0" />
                    <path d="M4 12c4-6 12-6 16 0" />
                    <path d="M4 6c4-6 12-6 16 0" />
                  </svg>
                )}
                {i === 2 && (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <path d="M12 3v18" />
                    <path d="M5 8c2 3 5 3 7 3s5 0 7-3" />
                    <path d="M5 16c2-3 5-3 7-3s5 0 7 3" />
                  </svg>
                )}
              </div>
              <div className="font-display text-[22px]" style={{ color: "var(--teal)" }}>{it.eyebrow}</div>
              <div className="mt-3 flex justify-center"><GoldRule width="w-6" /></div>
              <p className="mt-5 text-[14px] leading-[24px] max-w-[280px] mx-auto" style={{ color: "var(--teal)", opacity: 0.8 }}>{it.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Treatments({ services, images, content, go, density }) {
  const pad = density === "compact" ? "py-20" : "py-32";
  return (
    <section className={`${pad} px-6 md:px-12`} style={{ background: "var(--cream-light)" }}>
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center">
          <Eyebrow>{content.treatmentsIntro.eyebrow}</Eyebrow>
          <h2 className="font-display text-[40px] md:text-[52px] leading-[1.1] mt-6 max-w-[720px] mx-auto" style={{ color: "var(--teal)" }}>
            {content.treatmentsIntro.title}
          </h2>
          <p className="mt-6 text-[15px] leading-[28px] max-w-[520px] mx-auto" style={{ color: "var(--teal)", opacity: 0.75 }}>
            {content.treatmentsIntro.body}
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 md:gap-10 mt-20">
          {services.map(s => (
            <article key={s.id} className="group cursor-pointer" onClick={() => go(`service:${s.id}`)}>
              <ImgPlaceholder label={`${s.name} image`} url={images[s.image]} className="mb-7" ratio="4 / 5" />
              <Eyebrow>Treatment</Eyebrow>
              <h3 className="font-display text-[26px] mt-3" style={{ color: "var(--teal)" }}>{s.name}</h3>
              <p className="mt-3 text-[14px] leading-[24px]" style={{ color: "var(--teal)", opacity: 0.8 }}>{s.tagline}</p>
              <div className="mt-5 flex items-center justify-between text-[13px]" style={{ color: "var(--teal)" }}>
                <span className="opacity-70">from £{s.durations[0].price} / {s.durations[0].mins} min</span>
                <span className="tracking-[0.14em] uppercase border-b pb-0.5" style={{ borderColor: "var(--gold)", opacity: "var(--gold-intensity, 1)" }}>Read more →</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonial({ content }) {
  return (
    <section className="py-32 px-6 md:px-12" style={{ background: "var(--cream)" }}>
      <div className="max-w-[820px] mx-auto text-center">
        <GoldRule width="w-10" />
        <p className="font-display italic text-[32px] md:text-[44px] leading-[1.25] mt-10" style={{ color: "var(--teal)" }}>
          "{content.testimonial.quote}"
        </p>
        <div className="mt-8 text-[11px] tracking-[0.28em]" style={{ color: "var(--gold)", opacity: "var(--gold-intensity, 1)" }}>
          {content.testimonial.attribution}
        </div>
      </div>
    </section>
  );
}

function Visit({ content, images }) {
  return (
    <section className="py-24 px-6 md:px-12" style={{ background: "var(--cream)" }}>
      <div className="max-w-[1280px] mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div>
          <ImgPlaceholder label="Studio interior" url={images.studio} ratio="4 / 3" />
        </div>
        <div>
          <Eyebrow>{content.visit.eyebrow}</Eyebrow>
          <h2 className="font-display text-[40px] md:text-[48px] leading-[1.1] mt-6" style={{ color: "var(--teal)" }}>
            {content.visit.title}
          </h2>
          <p className="mt-6 text-[15px] leading-[28px] max-w-[440px]" style={{ color: "var(--teal)", opacity: 0.8 }}>
            {content.visit.body}
          </p>
          <div className="mt-10 grid grid-cols-2 gap-x-10 gap-y-4 text-[13px]" style={{ color: "var(--teal)" }}>
            <div>
              <Eyebrow>Address</Eyebrow>
              {content.visit.address.map(a => <div key={a} className="mt-1">{a}</div>)}
              <div className="mt-3 opacity-75">{content.visit.phone}</div>
            </div>
            <div>
              <Eyebrow>Hours</Eyebrow>
              {content.visit.hours.map(([d, h]) => (
                <div key={d} className="mt-1 flex justify-between gap-4">
                  <span>{d}</span><span className="opacity-70">{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Home({ state, go, density }) {
  return (
    <>
      <Hero content={state.content} images={state.images} go={go} density={density} />
      <Approach content={state.content} density={density} />
      <Treatments services={state.services} images={state.images} content={state.content} go={go} density={density} />
      <Testimonial content={state.content} />
      <Visit content={state.content} images={state.images} />
    </>
  );
}

Object.assign(window, { Nav, Footer, Hero, Home, GoldRule, Eyebrow, Button, ImgPlaceholder });


// 5-step booking wizard with mock Stripe-style payment and .ics download.

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
          <input value={selected.firstName || ""} onChange={e => upd("firstName", e.target.value)} className="w-full px-4 py-3 text-[14px] focus:outline-none focus:ring-2" style={inputStyle} />
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


// Admin dashboard: bookings (calendar + list, confirm/cancel/reschedule),
// WYSIWYG page content editor, services & pricing editor, drag-drop image manager.

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


// App shell: route, state, Tweaks panel.

function App() {
  const [state, setState] = useState(() => window.BW.loadState());
  const [route, setRoute] = useState(() => (location.hash.replace(/^#\/?/, "") || "home"));
  const [tweaks, setTweaks] = useState(() => {
    const stored = JSON.parse(localStorage.getItem("bw_tweaks") || "null");
    return stored || (window.__TWEAK_DEFAULTS__ || {});
  });
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const [mobile, setMobile] = useState(false);

  // Persist state on change
  useEffect(() => { window.BW.saveState(state); }, [state]);
  useEffect(() => { localStorage.setItem("bw_tweaks", JSON.stringify(tweaks)); applyTweaks(tweaks); }, [tweaks]);

  // Router
  useEffect(() => {
    const onHash = () => setRoute(location.hash.replace(/^#\/?/, "") || "home");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const go = (r) => {
    location.hash = "#/" + r;
    window.scrollTo(0, 0);
  };

  // Edit-mode protocol
  useEffect(() => {
    const onMsg = (e) => {
      if (!e.data || typeof e.data !== "object") return;
      if (e.data.type === "__activate_edit_mode") setTweaksOpen(true);
      if (e.data.type === "__deactivate_edit_mode") setTweaksOpen(false);
    };
    window.addEventListener("message", onMsg);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", onMsg);
  }, []);

  const isAdmin = route === "admin";
  const isBook = route === "book";

  const PageFrame = ({ children }) => (
    <div className="min-h-screen" style={{ background: "var(--cream)" }}>
      {!isAdmin && !isBook && <Nav route={route} go={go} announcement={tweaks.announcement !== false} />}
      {children}
      {!isAdmin && !isBook && <Footer content={state.content} go={go} />}
    </div>
  );

  let page;
  if (route === "admin") page = <AdminApp state={state} setState={setState} go={go} />;
  else if (route === "book") page = (<>
    <Nav route={route} go={go} announcement={false} />
    <BookingFlow state={state} setState={setState} go={go} />
  </>);
  else page = <Home state={state} go={go} density={tweaks.density || "airy"} />;

  // Mobile breakpoint sim: wrap the entire view at 390px wide iframe-style
  if (mobile) {
    return (
      <div className="min-h-screen flex items-start justify-center py-10" style={{ background: "#1f1a18" }}>
        <div style={{ width: "390px", height: "820px", overflow: "auto", background: "var(--cream)", borderRadius: "36px", boxShadow: "0 40px 80px rgba(0,0,0,0.5)", border: "8px solid #0a0a0a" }}>
          <PageFrame>{page}</PageFrame>
        </div>
        <ViewToggle mobile={mobile} setMobile={setMobile} dark />
        <TweaksPanel open={tweaksOpen} setOpen={setTweaksOpen} tweaks={tweaks} setTweaks={setTweaks} />
      </div>
    );
  }

  return (
    <>
      <PageFrame>{page}</PageFrame>
      <ViewToggle mobile={mobile} setMobile={setMobile} />
      <TweaksPanel open={tweaksOpen} setOpen={setTweaksOpen} tweaks={tweaks} setTweaks={setTweaks} />
    </>
  );
}

function ViewToggle({ mobile, setMobile, dark }) {
  return (
    <button onClick={() => setMobile(!mobile)}
      className="fixed bottom-5 left-5 z-50 px-4 py-2 text-[11px] tracking-[0.2em] uppercase"
      style={{ background: dark ? "var(--cream)" : "var(--teal-deep)", color: dark ? "var(--teal)" : "var(--cream)", borderRadius: "999px", boxShadow: "0 6px 20px rgba(0,0,0,0.2)" }}>
      {mobile ? "Desktop view" : "Mobile view"}
    </button>
  );
}

function applyTweaks(t) {
  const r = document.documentElement;
  r.style.setProperty("--gold-intensity", String(t.goldIntensity ?? 1));
  r.style.setProperty("--gold", t.goldHex || "#B28B5D");
  r.style.setProperty("--teal", t.tealHex || "#3E4F56");
}

function TweaksPanel({ open, setOpen, tweaks, setTweaks }) {
  if (!open) return null;
  const save = (patch) => {
    const next = { ...tweaks, ...patch };
    setTweaks(next);
    window.parent.postMessage({ type: "__edit_mode_set_keys", edits: patch }, "*");
  };
  return (
    <div className="fixed bottom-5 right-5 z-50 w-[320px] p-5" style={{ background: "var(--cream)", borderRadius: "8px", border: "1px solid rgba(62,79,86,0.15)", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
      <div className="flex items-center justify-between mb-5">
        <div className="font-display text-[18px]" style={{ color: "var(--teal)" }}>Tweaks</div>
        <button onClick={() => setOpen(false)} className="text-[11px] tracking-[0.22em] uppercase opacity-60" style={{ color: "var(--teal)" }}>Close</button>
      </div>
      <div className="space-y-5">
        <div>
          <div className="text-[10px] tracking-[0.22em] uppercase mb-2 flex items-center justify-between" style={{ color: "var(--gold)", opacity: "var(--gold-intensity, 1)" }}>
            <span>Gold accent intensity</span><span>{Math.round((tweaks.goldIntensity ?? 1) * 100)}%</span>
          </div>
          <input type="range" min="0" max="1" step="0.05" value={tweaks.goldIntensity ?? 1}
            onChange={e => save({ goldIntensity: parseFloat(e.target.value) })}
            className="w-full accent-[var(--gold)]" />
        </div>
        <div>
          <div className="text-[10px] tracking-[0.22em] uppercase mb-2" style={{ color: "var(--gold)", opacity: "var(--gold-intensity, 1)" }}>Gold hue</div>
          <div className="flex gap-2">
            {[["Warm gold","#B28B5D"],["Antique brass","#A67C3F"],["Pale bronze","#C9A073"],["Deep umber","#8F6B3D"]].map(([label, hex]) => (
              <button key={hex} onClick={() => save({ goldHex: hex })} className="flex-1 h-8" title={label}
                style={{ background: hex, borderRadius: "2px", outline: tweaks.goldHex === hex ? "2px solid var(--teal)" : "1px solid rgba(62,79,86,0.15)", outlineOffset: "-1px" }} />
            ))}
          </div>
        </div>
        <div>
          <div className="text-[10px] tracking-[0.22em] uppercase mb-2" style={{ color: "var(--gold)", opacity: "var(--gold-intensity, 1)" }}>Teal hue</div>
          <div className="flex gap-2">
            {[["Deep teal","#3E4F56"],["Ink","#2B3740"],["Seafoam","#4F6670"],["Charcoal","#333333"]].map(([label, hex]) => (
              <button key={hex} onClick={() => save({ tealHex: hex })} className="flex-1 h-8" title={label}
                style={{ background: hex, borderRadius: "2px", outline: tweaks.tealHex === hex ? "2px solid var(--gold)" : "1px solid rgba(62,79,86,0.15)", outlineOffset: "-1px" }} />
            ))}
          </div>
        </div>
        <div>
          <div className="text-[10px] tracking-[0.22em] uppercase mb-2" style={{ color: "var(--gold)", opacity: "var(--gold-intensity, 1)" }}>Density</div>
          <div className="flex gap-2">
            {["airy","compact"].map(d => (
              <button key={d} onClick={() => save({ density: d })}
                className="flex-1 py-2 text-[12px] tracking-[0.12em] uppercase"
                style={{ background: (tweaks.density || "airy") === d ? "var(--teal)" : "transparent", color: (tweaks.density || "airy") === d ? "var(--cream)" : "var(--teal)", border: "1px solid rgba(62,79,86,0.2)", borderRadius: "2px" }}>{d}</button>
            ))}
          </div>
        </div>
        <label className="flex items-center gap-3 text-[13px]" style={{ color: "var(--teal)" }}>
          <input type="checkbox" checked={tweaks.announcement !== false} onChange={e => save({ announcement: e.target.checked })} className="w-4 h-4 accent-[var(--teal)]" />
          Show announcement bar
        </label>
      </div>
    </div>
  );
}

Object.assign(window, { App });

// Mount
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
