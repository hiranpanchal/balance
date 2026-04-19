import type { MetadataRoute } from "next";
import { journalPosts } from "@/lib/data";
import { getServices } from "@/lib/getServices";

const BASE_URL = "https://balanceandwellness.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services] = await Promise.all([getServices()]);
  const now = new Date();
  const staticPaths = [
    "",
    "/services",
    "/about",
    "/pricing",
    "/journal",
    "/book",
    "/contact",
    "/gift-vouchers",
    "/privacy",
    "/terms",
  ].map((p) => ({ url: `${BASE_URL}${p}`, lastModified: now }));

  const servicePaths = services.map((s) => ({
    url: `${BASE_URL}/services/${s.id}`,
    lastModified: now,
  }));

  const journalPaths = journalPosts.map((p) => ({
    url: `${BASE_URL}/journal/${p.slug}`,
    lastModified: new Date(p.date),
  }));

  return [...staticPaths, ...servicePaths, ...journalPaths];
}
