"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploadField } from "./ImageUploadField";

interface PostData {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  tag: string;
  readingTime: number;
  image: string;
  published: boolean;
  publishedAt: string;
}

interface Props {
  post?: PostData;
  mode: "new" | "edit";
}

export function PostEditor({ post, mode }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<PostData>(
    post ?? {
      slug: "",
      title: "",
      excerpt: "",
      body: "",
      tag: "",
      readingTime: 3,
      image: "",
      published: false,
      publishedAt: new Date().toISOString().split("T")[0],
    }
  );
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update(field: keyof PostData, value: unknown) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function autoSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }

  async function save(publish?: boolean) {
    setSaving(true);
    setError("");
    const data = { ...form, published: publish ?? form.published };

    if (mode === "new") {
      const res = await fetch("/api/admin/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        router.push(`/admin/journal/${data.slug}`);
        router.refresh();
      } else {
        const json = await res.json();
        setError(JSON.stringify(json.error));
        setSaving(false);
      }
    } else {
      const res = await fetch(`/api/admin/journal/${form.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        router.refresh();
      } else {
        setError("Save failed");
      }
      setSaving(false);
    }
  }

  async function deletePost() {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    await fetch(`/api/admin/journal/${form.slug}`, { method: "DELETE" });
    router.push("/admin/journal");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-[13px]">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6 space-y-5">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-[11px] tracking-[0.1em] uppercase text-[#A09687] mb-2">
              Title
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => {
                update("title", e.target.value);
                if (mode === "new") update("slug", autoSlug(e.target.value));
              }}
              className="w-full border border-[#3E4F56]/15 rounded px-4 py-3 text-[13px] text-[#3E4F56] bg-[#F5F0E6] focus:outline-none focus:border-[#B28B5D]"
            />
          </div>
          <div>
            <label className="block text-[11px] tracking-[0.1em] uppercase text-[#A09687] mb-2">
              Slug
            </label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => update("slug", e.target.value)}
              readOnly={mode === "edit"}
              className="w-full border border-[#3E4F56]/15 rounded px-4 py-3 text-[13px] text-[#3E4F56] bg-[#F5F0E6] focus:outline-none focus:border-[#B28B5D] font-mono read-only:opacity-60"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] tracking-[0.1em] uppercase text-[#A09687] mb-2">
            Excerpt
          </label>
          <textarea
            value={form.excerpt}
            onChange={(e) => update("excerpt", e.target.value)}
            rows={2}
            className="w-full border border-[#3E4F56]/15 rounded px-4 py-3 text-[13px] text-[#3E4F56] bg-[#F5F0E6] resize-none focus:outline-none focus:border-[#B28B5D]"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          <div>
            <label className="block text-[11px] tracking-[0.1em] uppercase text-[#A09687] mb-2">
              Tag / Category
            </label>
            <input
              type="text"
              value={form.tag}
              onChange={(e) => update("tag", e.target.value)}
              placeholder="Practice, Ritual, Guide…"
              className="w-full border border-[#3E4F56]/15 rounded px-4 py-3 text-[13px] text-[#3E4F56] bg-[#F5F0E6] focus:outline-none focus:border-[#B28B5D] placeholder:text-[#A09687]"
            />
          </div>
          <div>
            <label className="block text-[11px] tracking-[0.1em] uppercase text-[#A09687] mb-2">
              Reading time (min)
            </label>
            <input
              type="number"
              value={form.readingTime}
              onChange={(e) => update("readingTime", parseInt(e.target.value))}
              className="w-full border border-[#3E4F56]/15 rounded px-4 py-3 text-[13px] text-[#3E4F56] bg-[#F5F0E6] focus:outline-none focus:border-[#B28B5D]"
            />
          </div>
          <div>
            <label className="block text-[11px] tracking-[0.1em] uppercase text-[#A09687] mb-2">
              Published date
            </label>
            <input
              type="date"
              value={form.publishedAt}
              onChange={(e) => update("publishedAt", e.target.value)}
              className="w-full border border-[#3E4F56]/15 rounded px-4 py-3 text-[13px] text-[#3E4F56] bg-[#F5F0E6] focus:outline-none focus:border-[#B28B5D]"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] tracking-[0.1em] uppercase text-[#A09687] mb-2">
            Cover image
          </label>
          <ImageUploadField
            value={form.image}
            onChange={(url) => update("image", url)}
            slot="journal"
            alt={form.title}
          />
        </div>
      </div>

      {/* Body editor */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex border-b border-[#F5F0E6]">
          <button
            onClick={() => setPreview(false)}
            className={`px-5 py-3 text-[12px] tracking-[0.1em] uppercase ${
              !preview ? "text-[#3E4F56] border-b-2 border-[#B28B5D]" : "text-[#A09687]"
            }`}
          >
            Write
          </button>
          <button
            onClick={() => setPreview(true)}
            className={`px-5 py-3 text-[12px] tracking-[0.1em] uppercase ${
              preview ? "text-[#3E4F56] border-b-2 border-[#B28B5D]" : "text-[#A09687]"
            }`}
          >
            Preview
          </button>
        </div>
        {preview ? (
          <div
            className="p-6 prose prose-sm max-w-none text-[#3E4F56]"
            dangerouslySetInnerHTML={{
              __html: form.body
                .split("\n\n")
                .map((p) => `<p>${p}</p>`)
                .join(""),
            }}
          />
        ) : (
          <textarea
            value={form.body}
            onChange={(e) => update("body", e.target.value)}
            rows={18}
            placeholder="Write in plain text. Separate paragraphs with a blank line."
            className="w-full p-6 text-[13px] leading-[24px] text-[#3E4F56] bg-white focus:outline-none placeholder:text-[#A09687] resize-y font-mono"
          />
        )}
      </div>

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => save(false)}
            disabled={saving}
            className="border border-[#3E4F56]/20 text-[#3E4F56] text-[12px] tracking-[0.15em] uppercase px-6 py-3 rounded hover:border-[#B28B5D] disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save draft"}
          </button>
          <button
            onClick={() => save(true)}
            disabled={saving}
            className="bg-[#3E4F56] text-[#EAE2D2] text-[12px] tracking-[0.15em] uppercase px-6 py-3 rounded hover:opacity-90 disabled:opacity-50"
          >
            Publish
          </button>
        </div>
        {mode === "edit" && (
          <button
            onClick={deletePost}
            className="text-[13px] text-red-600 hover:underline"
          >
            Delete post
          </button>
        )}
      </div>
    </div>
  );
}
