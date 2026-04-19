import { db } from "./db";
import { studio as defaultStudio } from "./data";

export async function getSiteContent() {
  const rows = await db.content.findMany();
  const kv: Record<string, string> = {};
  for (const row of rows) kv[row.key] = row.value;

  const addressLines = kv["studio.address"]
    ? kv["studio.address"].split("\n").map((l) => l.trim()).filter(Boolean)
    : defaultStudio.addressLines;

  const hours: [string, string][] = kv["studio.hours"]
    ? kv["studio.hours"]
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l) => {
          const idx = l.indexOf(":");
          return idx === -1
            ? [l, ""] as [string, string]
            : [l.slice(0, idx).trim(), l.slice(idx + 1).trim()] as [string, string];
        })
    : (defaultStudio.hours as unknown as [string, string][]);

  return {
    hero: {
      headline: kv["hero.headline"] ?? "A quiet hour, well kept.",
      subheadline:
        kv["hero.subheadline"] ??
        "Boutique massage and bodywork, delivered with unhurried attention. Open Tuesday through Saturday.",
    },
    studio: {
      ...defaultStudio,
      addressLines,
      phone: kv["studio.phone"] ?? defaultStudio.phone,
      email: kv["studio.email"] ?? defaultStudio.email,
      instagram: kv["studio.instagram"] ?? defaultStudio.instagram,
      hours,
    },
  };
}
