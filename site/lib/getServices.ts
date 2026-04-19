import { db } from "./db";
import { services as defaultServices } from "./data";
import type { Service, ServiceId, DurationMins } from "./types";

function rowToService(row: {
  id: string;
  name: string;
  tagline: string;
  lead: string;
  image: string;
  whatToExpect: unknown;
  goodFor: unknown;
  durations: { mins: number; price: number }[];
}): Service {
  return {
    id: row.id as ServiceId,
    name: row.name,
    tagline: row.tagline,
    lead: row.lead,
    image: row.image,
    whatToExpect: (row.whatToExpect as { eyebrow: string; body: string }[]) ?? [],
    goodFor: (row.goodFor as string[]) ?? [],
    durations: row.durations.map((d) => ({
      mins: d.mins as DurationMins,
      price: d.price,
    })),
  };
}

export async function getServices(): Promise<Service[]> {
  const rows = await db.service.findMany({
    include: { durations: { orderBy: { mins: "asc" } } },
    orderBy: { displayOrder: "asc" },
  });
  if (rows.length === 0) return defaultServices;
  return rows.map(rowToService);
}

export async function getService(id: string): Promise<Service | null> {
  const row = await db.service.findUnique({
    where: { id },
    include: { durations: { orderBy: { mins: "asc" } } },
  });
  if (!row) return defaultServices.find((s) => s.id === id) ?? null;
  return rowToService(row);
}

export async function priceForFromDb(serviceId: string, mins: number): Promise<number | null> {
  const dur = await db.serviceDuration.findUnique({
    where: { serviceId_mins: { serviceId, mins } },
  });
  return dur?.price ?? null;
}
