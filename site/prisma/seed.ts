import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  console.log("🌱  Seeding database…");

  // ── Services ─────────────────────────────────────────────────────────────
  const services = [
    {
      id: "balance",
      name: "Balance",
      tagline: "Our signature full-body aromatherapy massage.",
      lead: "A signature full-body session blending aromatherapy and massage. Bespoke oils, unhurried pressure, and a steady rhythm designed to settle the nervous system from the first minute.",
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1600&q=80",
      whatToExpect: [
        { eyebrow: "01", body: "A short conversation about how you are arriving today, and which oils would best suit." },
        { eyebrow: "02", body: "Warming strokes through the back and shoulders to let the body register it is in quieter company." },
        { eyebrow: "03", body: "A long central passage of bespoke bodywork, tailored to the pace and pressure your body is asking for." },
        { eyebrow: "04", body: "A slow return — ten minutes of stillness, water, and a soft chair before you step back into the day." },
      ],
      goodFor: ["General tension", "Sleep difficulty", "Low-grade anxiety", "First-time guests"],
      displayOrder: 1,
      durations: [
        { mins: 60, price: 65 },
        { mins: 75, price: 78 },
        { mins: 90, price: 90 },
      ],
    },
    {
      id: "upper-body",
      name: "Balance the Upper Body",
      tagline: "Focused release for head, neck, and shoulders.",
      lead: "A focused session for the places that hold the day — head, neck, shoulders, upper back. Ideal if you carry tension from a desk, a phone, or a low mood you cannot quite shake.",
      image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1600&q=80",
      whatToExpect: [
        { eyebrow: "01", body: "Intake — we map where the tension lives and what has already been tried." },
        { eyebrow: "02", body: "Warming work through the upper back to prepare tissue for deeper release." },
        { eyebrow: "03", body: "Acupressure and deep tissue at the specific sites you have identified." },
        { eyebrow: "04", body: "A quiet close with a light scalp massage to carry the relief upward." },
      ],
      goodFor: ["Desk-related tightness", "Tension headaches", "Frozen shoulder", "Jaw tension"],
      displayOrder: 2,
      durations: [
        { mins: 30, price: 38 },
        { mins: 45, price: 52 },
        { mins: 60, price: 65 },
      ],
    },
    {
      id: "hand-and-arm",
      name: "Hand and Arm Massage",
      tagline: "Relief for hands and forearms that carry the day.",
      lead: "A precise, restorative treatment for hands, wrists, and forearms. Designed for writers, carers, gardeners, parents — anyone whose hands do quiet work that rarely gets acknowledged.",
      image: "https://images.unsplash.com/photo-1519824145371-296894a0daa9?auto=format&fit=crop&w=1600&q=80",
      whatToExpect: [
        { eyebrow: "01", body: "A warm soak to soften the tissue and mark the beginning of the session." },
        { eyebrow: "02", body: "Joint mobilisation through each finger, wrist, and forearm." },
        { eyebrow: "03", body: "Acupressure at the key points of tension, with a bespoke oil blend." },
        { eyebrow: "04", body: "A closing rest, with warm towels and still hands." },
      ],
      goodFor: ["Repetitive strain", "Arthritic stiffness", "Writer's and carer's hands", "Post-gardening recovery"],
      displayOrder: 3,
      durations: [
        { mins: 30, price: 35 },
        { mins: 45, price: 48 },
      ],
    },
    {
      id: "walking-on-air",
      name: "Walking on Air",
      tagline: "A lower-leg and foot treatment to leave you lighter.",
      lead: "A restorative session for the feet, ankles, and lower legs. Combines massage, pressure-point work, and warm oils to leave you genuinely lighter on your feet for the rest of the week.",
      image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1600&q=80",
      whatToExpect: [
        { eyebrow: "01", body: "A warm foot soak with a bespoke oil blend to open the session." },
        { eyebrow: "02", body: "Calf and lower-leg work, slow and firm, to encourage circulation." },
        { eyebrow: "03", body: "Pressure-point work through each foot, tailored to where the day has settled." },
        { eyebrow: "04", body: "A cool-towel close and a slow return to standing." },
      ],
      goodFor: ["Long days on your feet", "Poor circulation", "Post-travel recovery", "Tired runners"],
      displayOrder: 4,
      durations: [
        { mins: 30, price: 35 },
        { mins: 45, price: 48 },
        { mins: 60, price: 62 },
      ],
    },
    {
      id: "holistic",
      name: "Holistic Massage",
      tagline: "A classic, whole-body relaxation massage.",
      lead: "A whole-body relaxation massage. Long, even strokes, a warm room, and a steady pace throughout. Ideal if your week has been noisy and you simply need an hour of quiet, competent care.",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80",
      whatToExpect: [
        { eyebrow: "01", body: "A brief settle-in, tea if you would like it, and a short conversation about pressure." },
        { eyebrow: "02", body: "Warming strokes from the feet upward, letting the body soften in order." },
        { eyebrow: "03", body: "Long, even passes through back, shoulders, arms, and legs at a relaxed pace." },
        { eyebrow: "04", body: "A slow, unhurried close and ten minutes of stillness before you stand." },
      ],
      goodFor: ["General tension", "Stress recovery", "Poor sleep", "Weeks that have been too loud"],
      displayOrder: 5,
      durations: [
        { mins: 60, price: 65 },
        { mins: 75, price: 78 },
        { mins: 90, price: 90 },
      ],
    },
    {
      id: "fibromyalgia",
      name: "Treatment for Fibromyalgia",
      tagline: "Gentle, bespoke bodywork for chronic-pain conditions.",
      lead: "A bespoke, gentle session for guests living with fibromyalgia, chronic fatigue, and related conditions. Pressure is led by you throughout. The aim is ease — not to fix, but to offer the body an hour of genuine rest.",
      image: "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?auto=format&fit=crop&w=1600&q=80",
      whatToExpect: [
        { eyebrow: "01", body: "A thorough intake — current symptoms, flare patterns, what has helped before." },
        { eyebrow: "02", body: "Very light opening work — the session is always led by your feedback." },
        { eyebrow: "03", body: "Soft-tissue and lymphatic techniques, with breath-led pacing and frequent check-ins." },
        { eyebrow: "04", body: "A long, warm close with generous stillness and water." },
      ],
      goodFor: ["Fibromyalgia", "ME / chronic fatigue", "Long-COVID recovery", "Chronic-pain flares"],
      displayOrder: 6,
      durations: [
        { mins: 60, price: 68 },
        { mins: 75, price: 80 },
      ],
    },
    {
      id: "hot-stones",
      name: "Hot Stones Treatment",
      tagline: "Heated basalt stones to draw warmth deep into the muscle.",
      lead: "Heated basalt stones, used as an extension of the therapist's hands, to draw warmth deep into the muscle. The warmth reaches places manual pressure alone cannot — particularly welcome in colder months.",
      image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1600&q=80",
      whatToExpect: [
        { eyebrow: "01", body: "Stones are warmed long before your session so the heat is deep rather than surface-level." },
        { eyebrow: "02", body: "Placement stones along the spine and shoulders to let the body soften before pressure." },
        { eyebrow: "03", body: "Working strokes with heated stones, alternating with warm hands at a steady rhythm." },
        { eyebrow: "04", body: "A quiet close with cool linen and dim light; ten minutes of stillness." },
      ],
      goodFor: ["Deep cold-weather tension", "Circulation", "Nervous-system down-regulation", "Guests who run cold"],
      displayOrder: 7,
      durations: [
        { mins: 60, price: 75 },
        { mins: 75, price: 88 },
        { mins: 90, price: 100 },
      ],
    },
  ];

  for (const { durations, ...svc } of services) {
    await db.service.upsert({
      where: { id: svc.id },
      update: { ...svc },
      create: { ...svc },
    });
    for (const dur of durations) {
      await db.serviceDuration.upsert({
        where: { serviceId_mins: { serviceId: svc.id, mins: dur.mins } },
        update: { price: dur.price },
        create: { serviceId: svc.id, ...dur },
      });
    }
  }
  console.log("  ✓  7 services seeded");

  // ── Journal posts ─────────────────────────────────────────────────────────
  const posts = [
    {
      slug: "on-stillness-as-a-skill",
      title: "On stillness as a skill",
      excerpt: "Why doing nothing is harder than it sounds — and the case for practising it like any other craft.",
      tag: "Practice",
      readingTime: 4,
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80",
      published: true,
      publishedAt: new Date("2026-03-14"),
      body: `We think of stillness as rest — the absence of movement, a default the body returns to when nothing else is being asked of it. It isn't. For most of my guests, stillness is the hardest part of the session.

In a world that rewards restlessness, sitting with a quiet body can feel unnervingly loud. The mind expects to be fed. The shoulders, having learned to hold, don't trust that they are allowed to let go.

Treat stillness as a skill, not a state. Ten minutes a day of nothing — no phone, no music, no podcast — is how the body learns that rest is permitted. Then, and only then, is a ninety-minute massage a rest rather than an interruption.`,
    },
    {
      slug: "a-five-minute-evening-ritual",
      title: "A five-minute evening ritual",
      excerpt: "For anyone who can't get to sleep — a short, repeatable sequence that asks very little of you.",
      tag: "Ritual",
      readingTime: 3,
      image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1600&q=80",
      published: true,
      publishedAt: new Date("2026-03-02"),
      body: `Sleep isn't something you reach for — it's something you allow. The more you reach, the more it moves. A ritual works because it replaces reaching with routine.

Start with warmth. A cup of something hot; not caffeinated. Dim the lights a full hour before bed — most evenings I run my lamps at half strength from nine.

Three slow breaths at the edge of the bed. Four counts in, six counts out. Feet on the floor. Then into bed, flat on your back, palms up. If the mind races, name three things you can hear. That is the whole ritual.`,
    },
    {
      slug: "choosing-a-treatment",
      title: "Choosing a treatment when you can't quite name it",
      excerpt: "A plain-language guide for guests who aren't sure what their body is asking for.",
      tag: "Guide",
      readingTime: 5,
      image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1600&q=80",
      published: true,
      publishedAt: new Date("2026-02-18"),
      body: `The most common question I'm asked is: which one? The honest answer is that either works for most people most of the time. But there are a few signals worth paying attention to.

If you are tired — genuinely, in-your-bones tired — book a Holistic or a Balance session. Deeper work asks something of you that a depleted body isn't in a position to give. A long, rhythmic session will do more than a more targeted one ever could.

If you are carrying a specific, stubborn tension — the same shoulder for the last three months, a back that won't quite unlock — book Balance the Upper Body, and block out the longer version. Anything less and you'll leave halfway through the work.`,
    },
    {
      slug: "the-case-for-ninety-minutes",
      title: "The case for the ninety-minute massage",
      excerpt: "What an extra half-hour really does — and why most of my regulars never book anything else.",
      tag: "Studio",
      readingTime: 4,
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1600&q=80",
      published: true,
      publishedAt: new Date("2026-02-01"),
      body: `A sixty-minute massage is a good massage. A ninety-minute massage is a different thing altogether.

The first twenty minutes of any session is a warming — muscle needs time to register that it is being cared for rather than asked for something. In a sixty, that warming takes up a third of the time.

In a ninety, the warming is a prologue. What follows is the work proper — slow, deep, and unhurried. And then, at the end, fifteen minutes of nothing. That last quarter is the part my regulars book ninety minutes for. It is not an optional add-on. It is the session.`,
    },
  ];

  for (const post of posts) {
    await db.journalPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }
  console.log("  ✓  4 journal posts seeded");

  // ── Default content ───────────────────────────────────────────────────────
  const content = [
    { key: "hero.headline", value: "A quiet hour with a skilled pair of hands." },
    { key: "hero.subheadline", value: "Boutique massage and bodywork in Bristol by clinical aromatherapist Mukti Panchal. Unhurried, one-guest-at-a-time sessions." },
    { key: "studio.address", value: "14 Linen Lane\nBristol BS1 4AA" },
    { key: "studio.phone", value: "+44 117 496 2250" },
    { key: "studio.email", value: "hello@balanceandwellness.com" },
    { key: "studio.hours", value: "Tuesday — Friday: 09:00 — 19:00\nSaturday: 09:00 — 17:00\nSunday & Monday: Closed" },
    { key: "studio.instagram", value: "@balance.and.wellness" },
  ];

  for (const item of content) {
    await db.content.upsert({
      where: { key: item.key },
      update: { value: item.value },
      create: item,
    });
  }
  console.log("  ✓  Default content seeded");

  // ── Admin user ────────────────────────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL ?? "mukti@balanceandwellness.com";
  await db.user.upsert({
    where: { email: adminEmail },
    update: { name: "Mukti Panchal" },
    create: { email: adminEmail, name: "Mukti Panchal" },
  });
  console.log("  ✓  Admin user upserted:", adminEmail);

  console.log("\n✅  Seed complete.\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
