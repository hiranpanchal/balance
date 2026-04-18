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
