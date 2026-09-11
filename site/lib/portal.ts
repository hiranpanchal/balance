const PORTAL_API = "https://portal.freedomhost.uk/api/build/5b81ae736adf58d4ba64e898eb26eb03";

interface PortalPostPayload {
  title: string;
  slug: string;
  excerpt?: string;
  body?: string;
  category?: string;
  coverImage?: string;
  publishedAt?: string;
  status?: "published" | "draft";
}

async function portalFetch(path: string, method: string, body?: object) {
  const res = await fetch(`${PORTAL_API}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Portal API ${method} ${path} → ${res.status}: ${text}`);
  }
  return res.status === 204 ? null : res.json();
}

// POST upserts by slug — works for both create and update
// Portal uses snake_case field names: published_at, cover_image
export async function portalUpsertPost(payload: PortalPostPayload): Promise<number> {
  const data = await portalFetch("/blog/post", "POST", {
    title: payload.title,
    slug: payload.slug,
    excerpt: payload.excerpt,
    body: payload.body,
    category: payload.category,
    cover_image_url: payload.coverImage,
    // Format: "YYYY-MM-DD HH:MM:SS"
    published_at: payload.publishedAt
      ? payload.publishedAt.replace("T", " ").replace(/\.\d+Z$/, "").replace("Z", "")
      : undefined,
    status: payload.status,
  });
  return data.id as number;
}

export async function portalDeletePost(id: number) {
  await portalFetch(`/blog/post/${id}`, "DELETE");
}
