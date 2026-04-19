export type ServiceId =
  | "balance"
  | "upper-body"
  | "hand-and-arm"
  | "walking-on-air"
  | "holistic"
  | "fibromyalgia"
  | "hot-stones";

export type DurationMins = 30 | 45 | 60 | 75 | 90;

export interface Duration {
  mins: DurationMins;
  price: number;
}

export interface Service {
  id: ServiceId;
  name: string;
  tagline: string;
  lead: string;
  whatToExpect: { eyebrow: string; body: string }[];
  goodFor: string[];
  durations: Duration[];
  image: string;
}

export interface Therapist {
  name: string;
  role: string;
  bio: string;
  image: string;
}

export interface JournalPost {
  slug: string;
  category: string;
  title: string;
  teaser: string;
  author: string;
  date: string;
  readMins: number;
  cover: string;
  body: string[];
}

export interface BookingSelection {
  treatment?: ServiceId;
  duration?: DurationMins;
  date?: string;
  time?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  firstTime?: boolean;
  notes?: string;
  consent?: boolean;
  voucherCode?: string;
  voucherDiscountPence?: number;
}

export interface ConfirmedBooking extends Required<Omit<BookingSelection, "notes" | "firstTime" | "voucherCode" | "voucherDiscountPence">> {
  id: string;
  firstTime: boolean;
  notes: string;
  price: number;
  createdAt: string;
}
