import type { MetadataRoute } from "next";
import { services, journalPosts } from "@/lib/data";

const BASE_URL = "https://balanceandwellness.com";

export default function sitemap(): MetadataRoute.Sitemap {
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
