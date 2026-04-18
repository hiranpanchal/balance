import type { Service, Therapist, JournalPost } from "./types";

export const studio = {
  name: "Balance and Wellness",
  addressLines: ["14 Linen Lane", "Bristol BS1 4AA"],
  phone: "+44 117 496 2250",
  email: "hello@balanceandwellness.com",
  instagram: "@balance.and.wellness",
  hours: [
    ["Tuesday — Friday", "09:00 — 19:00"],
    ["Saturday", "09:00 — 17:00"],
    ["Sunday & Monday", "Closed"],
  ] as const,
};

/**
 * Seven treatments.
 * TODO: confirm copy, durations, and prices with Mukti.
 * Placeholder leads are written in the brand voice so nothing reads as lorem ipsum.
 */
export const services: Service[] = [
  {
    id: "balance",
    name: "Balance",
    tagline: "Our signature full-body aromatherapy massage.",
    lead:
      "A signature full-body session blending aromatherapy and massage. Bespoke oils, unhurried pressure, and a steady rhythm designed to settle the nervous system from the first minute.",
    whatToExpect: [
      { eyebrow: "01", body: "A short conversation about how you are arriving today, and which oils would best suit." },
      { eyebrow: "02", body: "Warming strokes through the back and shoulders to let the body register it is in quieter company." },
      { eyebrow: "03", body: "A long central passage of bespoke bodywork, tailored to the pace and pressure your body is asking for." },
      { eyebrow: "04", body: "A slow return — ten minutes of stillness, water, and a soft chair before you step back into the day." },
    ],
    goodFor: ["General tension", "Sleep difficulty", "Low-grade anxiety", "First-time guests"],
    durations: [
      { mins: 60, price: 65 },
      { mins: 75, price: 78 },
      { mins: 90, price: 90 },
    ],
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "upper-body",
    name: "Balance the Upper Body",
    tagline: "Focused release for head, neck, and shoulders.",
    lead:
      "A focused session for the places that hold the day — head, neck, shoulders, upper back. Ideal if you carry tension from a desk, a phone, or a low mood you cannot quite shake.",
    whatToExpect: [
      { eyebrow: "01", body: "Intake — we map where the tension lives and what has already been tried." },
      { eyebrow: "02", body: "Warming work through the upper back to prepare tissue for deeper release." },
      { eyebrow: "03", body: "Acupressure and deep tissue at the specific sites you have identified." },
      { eyebrow: "04", body: "A quiet close with a light scalp massage to carry the relief upward." },
    ],
    goodFor: ["Desk-related tightness", "Tension headaches", "Frozen shoulder", "Jaw tension"],
    durations: [
      { mins: 30, price: 38 },
      { mins: 45, price: 52 },
      { mins: 60, price: 65 },
    ],
    image:
      "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "hand-and-arm",
    name: "Hand and Arm Massage",
    tagline: "Relief for hands and forearms that carry the day.",
    lead:
      "A precise, restorative treatment for hands, wrists, and forearms. Designed for writers, carers, gardeners, parents — anyone whose hands do quiet work that rarely gets acknowledged.",
    whatToExpect: [
      { eyebrow: "01", body: "A warm soak to soften the tissue and mark the beginning of the session." },
      { eyebrow: "02", body: "Joint mobilisation through each finger, wrist, and forearm." },
      { eyebrow: "03", body: "Acupressure at the key points of tension, with a bespoke oil blend." },
      { eyebrow: "04", body: "A closing rest, with warm towels and still hands." },
    ],
    goodFor: ["Repetitive strain", "Arthritic stiffness", "Writer's and carer's hands", "Post-gardening recovery"],
    durations: [
      { mins: 30, price: 35 },
      { mins: 45, price: 48 },
    ],
    image:
      "https://images.unsplash.com/photo-1519824145371-296894a0daa9?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "walking-on-air",
    name: "Walking on Air",
    tagline: "A lower-leg and foot treatment to leave you lighter.",
    lead:
      "A restorative session for the feet, ankles, and lower legs. Combines massage, pressure-point work, and warm oils to leave you genuinely lighter on your feet for the rest of the week.",
    whatToExpect: [
      { eyebrow: "01", body: "A warm foot soak with a bespoke oil blend to open the session." },
      { eyebrow: "02", body: "Calf and lower-leg work, slow and firm, to encourage circulation." },
      { eyebrow: "03", body: "Pressure-point work through each foot, tailored to where the day has settled." },
      { eyebrow: "04", body: "A cool-towel close and a slow return to standing." },
    ],
    goodFor: ["Long days on your feet", "Poor circulation", "Post-travel recovery", "Tired runners"],
    durations: [
      { mins: 30, price: 35 },
      { mins: 45, price: 48 },
      { mins: 60, price: 62 },
    ],
    image:
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "holistic",
    name: "Holistic Massage",
    tagline: "A classic, whole-body relaxation massage.",
    lead:
      "A whole-body relaxation massage. Long, even strokes, a warm room, and a steady pace throughout. Ideal if your week has been noisy and you simply need an hour of quiet, competent care.",
    whatToExpect: [
      { eyebrow: "01", body: "A brief settle-in, tea if you would like it, and a short conversation about pressure." },
      { eyebrow: "02", body: "Warming strokes from the feet upward, letting the body soften in order." },
      { eyebrow: "03", body: "Long, even passes through back, shoulders, arms, and legs at a relaxed pace." },
      { eyebrow: "04", body: "A slow, unhurried close and ten minutes of stillness before you stand." },
    ],
    goodFor: ["General tension", "Stress recovery", "Poor sleep", "Weeks that have been too loud"],
    durations: [
      { mins: 60, price: 65 },
      { mins: 75, price: 78 },
      { mins: 90, price: 90 },
    ],
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "fibromyalgia",
    name: "Treatment for Fibromyalgia",
    tagline: "Gentle, bespoke bodywork for chronic-pain conditions.",
    lead:
      "A bespoke, gentle session for guests living with fibromyalgia, chronic fatigue, and related conditions. Pressure is led by you throughout. The aim is ease — not to fix, but to offer the body an hour of genuine rest.",
    whatToExpect: [
      { eyebrow: "01", body: "A thorough intake — current symptoms, flare patterns, what has helped before." },
      { eyebrow: "02", body: "Very light opening work — the session is always led by your feedback." },
      { eyebrow: "03", body: "Soft-tissue and lymphatic techniques, with breath-led pacing and frequent check-ins." },
      { eyebrow: "04", body: "A long, warm close with generous stillness and water." },
    ],
    goodFor: ["Fibromyalgia", "ME / chronic fatigue", "Long-COVID recovery", "Chronic-pain flares"],
    durations: [
      { mins: 60, price: 68 },
      { mins: 75, price: 80 },
    ],
    image:
      "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "hot-stones",
    name: "Hot Stones Treatment",
    tagline: "Heated basalt stones to draw warmth deep into the muscle.",
    lead:
      "Heated basalt stones, used as an extension of the therapist's hands, to draw warmth deep into the muscle. The warmth reaches places manual pressure alone cannot — particularly welcome in colder months.",
    whatToExpect: [
      { eyebrow: "01", body: "Stones are warmed long before your session so the heat is deep rather than surface-level." },
      { eyebrow: "02", body: "Placement stones along the spine and shoulders to let the body soften before pressure." },
      { eyebrow: "03", body: "Working strokes with heated stones, alternating with warm hands at a steady rhythm." },
      { eyebrow: "04", body: "A quiet close with cool linen and dim light; ten minutes of stillness." },
    ],
    goodFor: [
      "Deep cold-weather tension",
      "Circulation",
      "Nervous-system down-regulation",
      "Guests who run cold",
    ],
    durations: [
      { mins: 60, price: 75 },
      { mins: 75, price: 88 },
      { mins: 90, price: 100 },
    ],
    image:
      "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1600&q=80",
  },
];

/** Treatments shown on the home page. Ordered for the 3-up featured grid. */
export const featuredServiceIds = ["balance", "holistic", "hot-stones"] as const;

/** Single therapist — Mukti Panchal. */
export const therapist: Therapist = {
  name: "Mukti Panchal",
  role: "Clinical Aromatherapist & Massage Therapist",
  bio: "I am a fully qualified clinical aromatherapist and massage therapist. I have always been passionate about complementary therapies and their role in helping us to stay balanced both physically and mentally.\n\nI offer a variety of treatments, and use a blend of techniques — acupressure, deep tissue, and more. Whether you are looking to relax and escape the world for an hour and focus on yourself, or you would like a remedial massage to help treat ailments like back pain, muscular problems, stress, anxiety, fibromyalgia and others — I can help. Get in touch today to discuss how I can support you.",
  image:
    "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1200&q=80",
};

export const values = [
  { name: "Balance", body: "Physical and mental — the aim of every session is steadiness, not just relief." },
  { name: "Presence", body: "One guest at a time. No double-booking, no overlap, no rushing." },
  { name: "Craft", body: "Fully qualified in clinical aromatherapy and remedial massage techniques." },
  { name: "Warmth", body: "A quiet studio, bespoke oils, and a kettle that is always on." },
  { name: "Honesty", body: "Plain words. No wellness jargon. No pressure, ever." },
];

export const journalPosts: JournalPost[] = [
  {
    slug: "on-stillness-as-a-skill",
    category: "Practice",
    title: "On stillness as a skill",
    teaser: "Why doing nothing is harder than it sounds — and the case for practising it like any other craft.",
    author: "Mukti Panchal",
    date: "2026-03-14",
    readMins: 4,
    cover:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80",
    body: [
      "We think of stillness as rest — the absence of movement, a default the body returns to when nothing else is being asked of it. It isn't. For most of my guests, stillness is the hardest part of the session.",
      "In a world that rewards restlessness, sitting with a quiet body can feel unnervingly loud. The mind expects to be fed. The shoulders, having learned to hold, don't trust that they are allowed to let go.",
      "Treat stillness as a skill, not a state. Ten minutes a day of nothing — no phone, no music, no podcast — is how the body learns that rest is permitted. Then, and only then, is a ninety-minute massage a rest rather than an interruption.",
    ],
  },
  {
    slug: "a-five-minute-evening-ritual",
    category: "Ritual",
    title: "A five-minute evening ritual",
    teaser: "For anyone who can't get to sleep — a short, repeatable sequence that asks very little of you.",
    author: "Mukti Panchal",
    date: "2026-03-02",
    readMins: 3,
    cover:
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1600&q=80",
    body: [
      "Sleep isn't something you reach for — it's something you allow. The more you reach, the more it moves. A ritual works because it replaces reaching with routine.",
      "Start with warmth. A cup of something hot; not caffeinated. Dim the lights a full hour before bed — most evenings I run my lamps at half strength from nine.",
      "Three slow breaths at the edge of the bed. Four counts in, six counts out. Feet on the floor. Then into bed, flat on your back, palms up. If the mind races, name three things you can hear. That is the whole ritual.",
    ],
  },
  {
    slug: "choosing-a-treatment",
    category: "Guide",
    title: "Choosing a treatment when you can't quite name it",
    teaser: "A plain-language guide for guests who aren't sure what their body is asking for.",
    author: "Mukti Panchal",
    date: "2026-02-18",
    readMins: 5,
    cover:
      "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1600&q=80",
    body: [
      "The most common question I'm asked is: which one? The honest answer is that either works for most people most of the time. But there are a few signals worth paying attention to.",
      "If you are tired — genuinely, in-your-bones tired — book a Holistic or a Balance session. Deeper work asks something of you that a depleted body isn't in a position to give. A long, rhythmic session will do more than a more targeted one ever could.",
      "If you are carrying a specific, stubborn tension — the same shoulder for the last three months, a back that won't quite unlock — book Balance the Upper Body, and block out the longer version. Anything less and you'll leave halfway through the work.",
    ],
  },
  {
    slug: "the-case-for-ninety-minutes",
    category: "Studio",
    title: "The case for the ninety-minute massage",
    teaser: "What an extra half-hour really does — and why most of my regulars never book anything else.",
    author: "Mukti Panchal",
    date: "2026-02-01",
    readMins: 4,
    cover:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1600&q=80",
    body: [
      "A sixty-minute massage is a good massage. A ninety-minute massage is a different thing altogether.",
      "The first twenty minutes of any session is a warming — muscle needs time to register that it is being cared for rather than asked for something. In a sixty, that warming takes up a third of the time.",
      "In a ninety, the warming is a prologue. What follows is the work proper — slow, deep, and unhurried. And then, at the end, fifteen minutes of nothing. That last quarter is the part my regulars book ninety minutes for. It is not an optional add-on. It is the session.",
    ],
  },
];

export const voucherAmounts = [50, 75, 100] as const;

export const faq = [
  {
    q: "Do I need to arrive early?",
    a: "Ten minutes is perfect. It gives us time to welcome you without rushing, and the session itself starts on time.",
  },
  {
    q: "What's your cancellation policy?",
    a: "Free up to 24 hours before. Inside 24 hours we charge 50%. Emergencies are, always, an exception.",
  },
  {
    q: "Do you take walk-ins?",
    a: "Only if there's a cancellation — one guest at a time means we almost never have a slot free. Please book ahead.",
  },
];

/**
 * Generate availability for a given date.
 * Closed Sun (0) & Mon (1). Saturday closes at 17:00.
 */
export function slotsFor(dateISO: string): string[] {
  const d = new Date(dateISO + "T00:00:00");
  const day = d.getDay();
  if (day === 0 || day === 1) return [];

  const base = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
  ];
  const pool = day === 6 ? base.filter((t) => t < "17:00") : base;

  const seed = [...dateISO].reduce((a, c) => a + c.charCodeAt(0), 0);
  return pool.filter((_, i) => {
    const h = (seed + i * 7) % 11;
    return h > 2;
  });
}

/** Look up a price for a treatment + duration (null if the duration isn't offered). */
export function priceFor(serviceId: string, mins: number): number | null {
  const s = services.find((s) => s.id === serviceId);
  return s?.durations.find((d) => d.mins === mins)?.price ?? null;
}
