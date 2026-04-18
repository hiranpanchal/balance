# Balance and Wellness — Website Build Brief

> **How to use this file:** Paste the full contents into Claude (Artifacts, Claude Code, or the web app) as a single message and ask Claude to build the site. The brief is written so Claude has everything needed — brand system, IA, copy, and technical rules — without follow-up questions.

---

## 1. The Ask

Build a calm, editorial, mobile-first website for **Balance and Wellness**, a boutique massage and bodywork studio. The site should feel like the brand: quiet, warm, unhurried, and deliberately uncluttered. It must include a built-in booking flow (service → therapist → date/time → guest details → confirmation) without relying on a third-party scheduler.

Deliver as a single-page React app (Next.js 14 app-router preferred, or Vite + React) styled with Tailwind CSS. Keep booking state client-side for the prototype; structure the code so a real backend can be wired in later.

---

## 2. Brand System

### 2.1 Voice & personality

- **Warm**, not gushing
- **Grounded**, not clinical
- **Calm**, not sleepy
- **Personal**, not familiar

Short sentences. Plain words. No wellness jargon. No exclamation marks. No pressure. A brand that whispers is trusted more than one that shouts.

### 2.2 Colour palette

All colours should be added to the Tailwind theme as named tokens.

| Role | Name | Hex | RGB |
|---|---|---|---|
| Primary background | Cream | `#EAE2D2` | 234 226 210 |
| Primary ink / text | Deep Teal | `#3E4F56` | 62 79 86 |
| Accent (sparing) | Warm Gold | `#B28B5D` | 178 139 93 |
| Section variant | Teal Deep | `#28363C` | 40 54 60 |
| Soft highlight | Gold Light | `#D2B894` | 210 184 148 |
| Warm neutral mid | Stone | `#A09687` | 160 150 135 |
| Card / panel | Cream Light | `#F5F0E6` | 245 240 230 |
| Body copy fallback | Charcoal | `#2D2D2D` | 45 45 45 |
| Pure contrast | White | `#FFFFFF` | 255 255 255 |

**Pairing rules**
- Cream is the *stage*. Lead every layout with it.
- Teal is the *ink*. Headlines, body copy, primary UI.
- Gold is the *jewel*. Use for rules, monograms, dropped caps, button hovers, link underlines — never large fills.
- Teal Deep is reserved for the footer and one or two inverted sections.
- Never use high-saturation colours, cool greys, or the default Tailwind blues.

### 2.3 Typography

| Use | Font | Fallback stack |
|---|---|---|
| Display (headings) | **Benton Modern D Light** | `'Lora', 'Playfair Display', Georgia, serif` |
| Accent script (one-off flourishes only) | **Domestic Script** | `'Great Vibes', 'Allura', cursive` |
| Body, UI, forms | **Lato** | `'Lato', system-ui, -apple-system, sans-serif` |

Benton Modern D and Domestic Script are the *licensed* fonts used in the logo. Until their .woff2 files are provided, load the fallbacks (Lora + Great Vibes + Lato) from Google Fonts and keep a clear `/* TODO: replace with licensed woff2 */` comment at the font import.

**Type scale (desktop, scale down ~15% on mobile)**
- `display`: 72 / 80 (hero only)
- `h1`: 48 / 56
- `h2`: 36 / 44
- `h3`: 24 / 32
- `lead`: 20 / 30
- `body`: 16 / 26
- `small`: 13 / 20
- `eyebrow`: 11 / 14, tracked +80, uppercase, gold

Line-length 60–72 characters. No full-justified text. Display type in Benton (serif) only — never set the script font at body size, and never use script for more than 3–4 words at a time.

### 2.4 Logo

- File: `/Balance-2025.-logo.png` (place in `/public`)
- Always on cream, soft stone, or deep teal. Never on busy imagery or bright fills.
- Minimum width: 120 px on screen. Clear space on all sides = height of the capital "B" in the mark.

---

## 3. Visual & Interaction Direction

- **Editorial, not salesy.** Big white (cream) space, generous margins, minimal UI chrome.
- **Hairlines in gold.** 0.5–1px gold rules as section dividers, under eyebrows, under active nav links.
- **Image treatment.** Soft natural light, warm neutrals (linen, stone, skin, water). No stocky "client satisfaction" poses. Always use a subtle 1–2% warm overlay to harmonise photos with the cream.
- **Motion.** Micro only. Fades (250–400ms ease-out), gentle image parallax on hero, no bouncing, no carousels with autoplay. Respect `prefers-reduced-motion`.
- **Rounding.** 2px on inputs and small chips, 8px on cards, no pill buttons except the primary "Book" CTA (full rounded).
- **Buttons.**
  - Primary: cream text on teal, rounded-full, hover → teal-deep.
  - Secondary: teal text, 1px teal border, no fill, hover → cream-light fill.
  - Tertiary: text-only with gold hairline underline on hover.
- **Icons.** Lucide, 1.5px stroke, teal. Use sparingly.

---

## 4. Information Architecture

```
/                     Home
/services             Services overview (all three treatments)
/services/swedish     Detail page
/services/deep-tissue Detail page
/services/hot-stone   Detail page
/about                About the studio + therapists
/pricing              Pricing & packages (gift vouchers CTA)
/journal              Journal / blog index (3–4 sample posts)
/journal/[slug]       Journal article layout
/book                 Booking flow (see §7)
/contact              Contact + studio details
/gift-vouchers        Voucher purchase landing
/privacy              Legal
/terms                Legal
```

### Global elements

**Top nav** — cream background, teal links, gold active underline. Order: Services · About · Pricing · Journal · Contact · **Book** (primary button). Sticky on scroll with a hairline gold rule beneath.

**Footer** — teal-deep background, cream text, gold hairlines. Three columns (Studio, Visit, Follow) + small logo + legal line + newsletter email capture.

**Announcement bar** (optional, dismissible) — thin cream-light strip under nav, small eyebrow text, for launch messages.

---

## 5. Page-by-Page Content

All copy below is final. Use it verbatim.

### 5.1 Home (`/`)

**Hero**
- Eyebrow (gold): `MASSAGE · BODYWORK · SPA`
- Display headline: `A quiet hour, well kept.`
- Sub: `Boutique massage and bodywork, delivered with unhurried attention. Open Tuesday through Saturday.`
- Primary CTA: `Book a session` → `/book`
- Secondary CTA: `See our treatments` → `/services`
- Background: full-bleed warm photo of a linen-draped massage table in morning light, with a 30% cream gradient from bottom.

**Section — Our approach** (3-up)
- Icon / eyebrow / short paragraph for each.
  1. **Stillness** · `We protect quiet — in our rooms, our rituals, our design.`
  2. **Craft** · `Fully-qualified therapists with at least five years of clinical practice.`
  3. **Presence** · `One guest at a time. No double-booking, no overlap, no rushing.`

**Section — Treatments** (3 cards linking to detail pages)
- Swedish · `Long, gliding strokes to settle the nervous system.` — from £75 / 60 min
- Deep Tissue · `Focused, therapeutic pressure for tension that's had enough.` — from £85 / 60 min
- Hot Stone · `Heated basalt stones to draw warmth deep into the muscle.` — from £95 / 60 min
- Each card: photograph, service name (Benton), one-line description, price, "Read more →" in gold.

**Section — Testimonial** (single, understated)
- Quote (Benton Italic, large): `"I came in rigid. I left feeling like myself again."`
- Attribution (small caps, gold): `— ANNA R., GUEST SINCE 2024`

**Section — Journal preview** (2 latest articles, side-by-side)

**Section — Visit** (split layout)
- Left: studio photo.
- Right: address, hours, phone, "Get directions" link, embedded map.

**Footer newsletter prompt**: `Monthly notes on stillness, sleep, and simple rituals. No noise.` + email field.

### 5.2 Services overview (`/services`)

- Short intro: `Three treatments, each honed over years. Choose what your body is asking for — or let us help you decide.`
- Three large service blocks (alternating image left / right), each with headline, 60–80 word description, duration options, "Book this treatment" CTA.
- Bottom block: `Not sure which to choose?` → link to a short questionnaire/contact form.

### 5.3 Service detail pages (`/services/[slug]`)

Consistent template:
1. Eyebrow: `TREATMENT` (gold)
2. H1: treatment name (Benton, large)
3. Lead paragraph (60 words)
4. **What to expect** — 4-step process list with numbered eyebrows
5. **Good for** — bulleted list (e.g. chronic tension, sleep difficulty, post-exercise recovery)
6. **Pricing** table — 60 / 75 / 90 min
7. **Your therapist** — cards for the 2–3 therapists qualified in this treatment
8. **Book** CTA (primary)
9. Related treatments (2 cards)

**Swedish**
- Lead: `Our Swedish massage is built around long, gliding strokes and a steady rhythm. It's designed to quiet the nervous system — ideal if you've been carrying weeks of low-grade stress and just need to land.`
- Good for: general tension · sleep difficulty · first-time guests · recovery weeks

**Deep Tissue**
- Lead: `Therapeutic, focused-pressure bodywork for tension that's become stubborn. Slower than a Swedish, deeper into the muscle, and tailored to whatever is holding you back today.`
- Good for: desk-related tightness · frozen shoulder · post-exercise recovery · chronic neck/back tension

**Hot Stone**
- Lead: `Heated basalt stones, warmed to body temperature plus twenty degrees, used as an extension of the therapist's hands. The warmth reaches places manual pressure alone can't.`
- Good for: deep cold-weather tension · circulation · nervous-system down-regulation · guests who run cold

### 5.4 About (`/about`)

- H1: `An unhurried studio, by design.`
- Lead (80 words): the origin of Balance and Wellness — a therapist who wanted to practice without the churn of a corporate spa.
- **Our values** — 5 values from the brand guidelines (Stillness, Presence, Craft, Warmth, Honesty) as a 5-card grid.
- **The therapists** — photo + name + role + one-paragraph bio for 3 therapists (placeholder names: Maya Chen · Lead Therapist; Jordan Ayotte · Senior Therapist; Rani Okafor · Therapist & Reiki Practitioner).
- **The space** — small gallery (4–6 photos) with captions.

### 5.5 Pricing (`/pricing`)

- Simple table, not a pricing *design*. Benton for category headers, Lato for rows.
- Columns: Treatment · 60 min · 75 min · 90 min
- Notes block underneath: cancellation policy (24 hours), gratuity policy (included), gift vouchers link, memberships (3-session pack at 10% off, 6-session at 15%).
- CTA at the bottom: `Book a session` and `Buy a gift voucher`.

### 5.6 Journal (`/journal`)

- Grid of article cards: cover image, category (gold eyebrow), title (Benton H3), 1-line teaser, author + date in small caps.
- Sample posts (create stub content ~150 words each):
  1. **On stillness as a skill** (Practice) — why doing nothing is harder than it sounds.
  2. **A five-minute evening ritual** (Ritual) — for anyone who can't get to sleep.
  3. **When to book a deep tissue over a Swedish** (Guide) — a plain-language decision tree.
  4. **The case for the ninety-minute massage** (Studio) — what an extra half-hour really does.

### 5.7 Book (`/book`) — see §7 for full spec

### 5.8 Contact (`/contact`)

- Split layout: left = contact form (name, email, phone, message). Right = studio address, hours, phone, email, travel directions, map.
- Hours (place in footer too):
  - Tuesday–Friday · 09:00 — 19:00
  - Saturday · 09:00 — 17:00
  - Sunday & Monday · Closed

### 5.9 Gift Vouchers (`/gift-vouchers`)

- Short lead, voucher amounts (£75 / £95 / £150 / custom), delivery (email or post), purchase CTA.

### 5.10 Legal (`/privacy`, `/terms`)

- Stub content placeholders. Use existing Benton-and-Lato hierarchy; tight line-length.

---

## 6. Sample layout notes (for Claude to implement)

### Navigation bar

```
[ Balance and Wellness logo — 140px wide ]   Services  About  Pricing  Journal  Contact   [ Book ]
```

- Hairline gold rule beneath the nav on scroll.
- Active page indicated by a 2px gold underline, offset 6px below the label.

### Hero (home)

- Full-viewport height, 80% on mobile.
- Image bleeds to edges; text block centered-left with 20% page width of negative space to its right.
- Primary CTA pill ~180px wide; secondary a text link with gold underline.

### Cards (services, journal)

- Image top, 16:9 ratio.
- Eyebrow (gold, uppercase) + title (Benton, teal) + one-line description (Lato light) + CTA (gold, with arrow).
- No shadows. Gold hairline border at 10% opacity on hover only.

### Forms

- Single-column.
- Labels above inputs, eyebrow style.
- Inputs: 2px rounded, cream-light fill, 1px stone border, focus state switches to 2px gold border.
- Helper text in stone, 13px.
- Errors in a restrained warm red (`#A34A3B`), never in gold (gold is joyful, errors aren't).

---

## 7. Booking Flow Spec (`/book`)

A 5-step wizard. URL reflects step (`/book?step=2`). Progress indicator at top: 5 hairlines, active one in gold. Back link on every step.

### Step 1 — Choose a treatment
- Three cards (Swedish / Deep Tissue / Hot Stone). Select one to advance.
- Durations shown inline: 60 / 75 / 90 min chips; selecting duration also updates the price summary.

### Step 2 — Choose a therapist
- 3 therapist cards (photo, name, short bio, years of practice).
- Show only therapists qualified for the chosen treatment.
- "No preference" option at the bottom (assigns based on availability).

### Step 3 — Choose a date & time
- Two-pane layout: left = calendar (month view, previous/next); right = available time slots for the selected day.
- Greyed-out past days. Closed days (Sun/Mon) visually distinct.
- Availability data: mock an array of slots in state. Persist selection to URL.

### Step 4 — Your details
- Fields: first name, last name, email, phone, "first time with us?" toggle, notes/requests (optional, 300 chars), consent checkbox (required).
- Show a **booking summary** sticky on the right (desktop) or top (mobile): treatment, therapist, date/time, duration, price.

### Step 5 — Confirm & hold
- Summary of the above + cancellation policy + a `Confirm booking` primary button.
- On confirm: show a calm success screen — Benton H1 `Your hour is held.`, the details, an "Add to calendar" link (generate an .ics), and a soft CTA to read the Journal.
- Send a mock confirmation email (`console.log` the payload — a real transactional email provider can be wired in later).

### Behaviour
- Keyboard-navigable. All buttons and slots reachable by Tab/Enter.
- Reduced-motion compatible.
- If a user reloads mid-flow, restore state from URL params + sessionStorage.
- Don't accept bookings for less than 4 hours ahead.

---

## 8. Tech Requirements

- **Framework:** Next.js 14 (app router) + TypeScript. If Next.js is not feasible in the target environment, fall back to Vite + React + TypeScript.
- **Styling:** Tailwind CSS with the palette in §2.2 wired into `tailwind.config.ts`. Custom font-family tokens `font-display`, `font-script`, `font-sans`.
- **State:** React state / URL params for the booking flow. No external state library needed.
- **Forms:** React Hook Form + Zod.
- **Icons:** `lucide-react`.
- **Analytics:** leave a `TODO` for Plausible or Fathom. No Google Analytics.
- **Images:** Use Next.js `<Image />`. Placeholders: `https://images.unsplash.com/...` — search terms *massage, spa, linen, warm light, hands, stone*. Avoid anyone in branded athleisure.
- **Accessibility:** WCAG 2.1 AA. 4.5:1 contrast for all body text. Focus states on every interactive element (2px gold ring). Skip-to-content link. Semantic landmarks (`<header>`, `<main>`, `<nav>`, `<footer>`). Alt text on every image. `lang="en"`. Respect `prefers-reduced-motion`.
- **Performance target:** Lighthouse 95+ across Performance, Accessibility, Best Practices, SEO on mobile.
- **SEO:** Meta title template `{page} · Balance and Wellness — massage & bodywork`. Per-page descriptions. OG image = the logo on cream. `robots.txt`, sitemap.

### File/folder scaffold expected

```
/app
  /(site)
    page.tsx                     # home
    /services/page.tsx
    /services/[slug]/page.tsx
    /about/page.tsx
    /pricing/page.tsx
    /journal/page.tsx
    /journal/[slug]/page.tsx
    /book/page.tsx
    /contact/page.tsx
    /gift-vouchers/page.tsx
    /privacy/page.tsx
    /terms/page.tsx
  layout.tsx
  globals.css
/components
  /site
    Nav.tsx
    Footer.tsx
    Hero.tsx
    ServiceCard.tsx
    JournalCard.tsx
    Eyebrow.tsx
    GoldRule.tsx
    Button.tsx
    FormField.tsx
  /booking
    BookingWizard.tsx
    StepTreatment.tsx
    StepTherapist.tsx
    StepSchedule.tsx
    StepDetails.tsx
    StepConfirm.tsx
    BookingSummary.tsx
/lib
  data.ts                        # services, therapists, availability mocks
  types.ts
  calendar.ts                    # generate .ics
/public
  Balance-2025.-logo.png
  /photos                        # placeholder warm studio images
tailwind.config.ts
```

---

## 9. Content placeholders you may invent

Where copy is missing (therapist bios, journal article bodies, full studio address), invent plausible content in brand voice. Never insert "Lorem ipsum".

**Studio address placeholder:** `14 Linen Lane, Bristol BS1 4AA`
**Phone placeholder:** `+44 117 496 2250`
**Email:** `hello@balanceandwellness.com`
**Instagram:** `@balance.and.wellness`

---

## 10. Definition of done

1. All pages in §4 exist and render without errors.
2. Colour and type tokens match §2.2 and §2.3 exactly — verify by inspecting the compiled CSS.
3. Booking flow completes in under 5 clicks from the home page `Book` button to `Your hour is held.`, all five steps functional.
4. Lighthouse mobile scores ≥ 95 Performance / ≥ 95 Accessibility / ≥ 95 Best Practices / ≥ 95 SEO.
5. Keyboard-only user can complete a booking end-to-end.
6. No `console.log` left in production builds except the mock email payload (clearly commented).
7. README at the repo root explains: how to run dev, how to swap the Google Fonts fallbacks for the licensed Benton Modern D and Domestic Script files, and where to wire in a real booking backend.

---

*End of brief. Everything needed to build the site is above. Begin with the Tailwind config and the shared components (Nav, Footer, Button, Eyebrow, GoldRule) before moving on to pages.*
