# Balance and Wellness

Boutique massage and bodywork studio website, built to the brand brief.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** with brand tokens wired as `theme.extend.colors`
- **React Hook Form** + **Zod** for validation
- **Lucide** for icons
- Booking state is held in React + URL params + `sessionStorage` — no backend yet

## Run (public site only — no database)

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Full setup (admin panel + database)

### 1. Start Postgres
From the repo root (one level up from `site/`):

```bash
docker-compose up -d
```

### 2. Set environment variables
Copy `.env.example` to `.env` and fill in real values:

```bash
cp .env.example .env
```

| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | Already set for local Docker (`bw:bw_dev@localhost:5432/balance_wellness`) |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `ADMIN_EMAIL` | Mukti's email address |
| `RESEND_API_KEY` | [resend.com](https://resend.com) → API Keys |
| `EMAIL_FROM` | Verified domain sender in Resend |
| `BLOB_READ_WRITE_TOKEN` | Vercel project settings → Storage → Blob |
| `NEXT_PUBLIC_BASE_URL` | `http://localhost:3000` locally, your domain in prod |

### 3. Create tables and seed data

```bash
npm run db:migrate   # runs migrations + applies schema
npm run db:seed      # seeds 7 services, 4 journal posts, admin user
```

### 4. Run dev server

```bash
npm run dev
```

### 5. Sign in to admin
Go to <http://localhost:3000/admin/login> and enter the `ADMIN_EMAIL` address.

In **development**, the magic link is printed to the terminal (no email sent). Click it to sign in.

In **production**, Resend sends the magic link email.

---

### Admin panel — what's available at `/admin`

| Tab | What it does |
|---|---|
| **Bookings** | View all bookings, filter by status/date, confirm/cancel, add notes |
| **Services** | Edit treatment copy, images, durations, and prices |
| **Availability** | Block holidays and half-days |
| **Content** | Edit hero copy, studio address, hours, phone |
| **Journal** | Write/edit/publish journal posts with markdown editor |
| **Images** | Upload images to Vercel Blob, copy URLs |

## Production build

```bash
npm run build
npm start
```

## Project layout

```
app/                  Next.js app router pages
  (each page also sets its own <Metadata>)
components/
  site/               Nav, Footer, shared UI primitives
  booking/            5-step booking wizard + BookingSummary
lib/
  data.ts             Services, therapist, journal posts, studio hours, slot generator
  types.ts            Shared domain types
  calendar.ts         .ics generation + downloader
public/
  Balance-2025.-logo.png
```

## Swapping the fonts for the licensed files

The site currently loads **Lora / Great Vibes / Lato** from Google Fonts as fallbacks for the licensed **Benton Modern D** and **Domestic Script** from the brand guidelines.

To swap in the real faces:

1. Drop the `.woff2` files into `public/fonts/`.
2. In `app/layout.tsx`, replace the `Lora`, `Great_Vibes`, `Lato` imports with a `localFont()` declaration pointing at your files — keep the same `variable` names (`--font-display`, `--font-script`, `--font-sans`).
3. Update the fallback stacks in `tailwind.config.ts` if you want to adjust the fallback chain.

A `TODO` marker sits at the top of `app/layout.tsx`.

## Wiring in a real booking backend

The booking wizard is fully working client-side. On confirm, the payload is currently `console.log`-ged from `components/booking/BookingWizard.tsx` (`handleConfirm`). Replace that `console.log` with a `fetch` to your own API route (or a Next.js server action) and persist the booking there.

Minimum shape to send to the backend:

```ts
{
  id: "BK-2045",
  selection: {
    treatment: "balance",
    duration: 60,
    date: "2026-05-01",
    time: "10:00",
    firstName: "…",
    lastName: "…",
    email: "…",
    phone: "…",
    firstTime: true,
    notes: "",
    consent: true,
  },
  price: 75,
  createdAt: "2026-05-01T00:00:00.000Z",
}
```

Transactional email (confirmation to the guest, notification to the studio) should be triggered from the backend — e.g. Resend, Postmark, or SendGrid. The `.ics` is generated client-side so guests can add the session to their calendar immediately.

### Availability

`lib/data.ts` has `slotsFor(dateISO)` — a deterministic mock generator. Replace with a real call to your backend (keeping the same `string[]` return shape) when ready.

## Analytics

No analytics are installed. When you're ready, add **Plausible** or **Fathom** (both are privacy-friendly). Avoid Google Analytics.

## Accessibility

- `lang="en"` on `<html>`
- Skip-to-content link at the top of every page
- `:focus-visible` state as a 2px gold ring
- Semantic landmarks (`<header>`, `<main>`, `<footer>`, `<nav>`)
- Forms validated with inline error messages and `aria-invalid`
- Announcement bar is dismissible; dismissal persists in localStorage
- Respects `prefers-reduced-motion`
