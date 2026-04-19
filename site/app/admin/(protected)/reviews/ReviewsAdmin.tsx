"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface Review {
  id: string;
  name: string;
  company: string;
  body: string;
  rating: number;
  createdAt: string;
}

const inputCls =
  "w-full border border-[#3E4F56]/15 rounded-md px-3 py-2.5 text-[13px] text-[#3E4F56] bg-white focus:outline-none focus:border-[#B28B5D] focus:ring-1 focus:ring-[#B28B5D]/30 transition-colors hover:border-[#3E4F56]/30";
const labelCls = "block text-[11px] tracking-[0.12em] uppercase text-[#A09687] mb-1.5";

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex gap-1 mt-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="text-[24px] leading-none transition-transform hover:scale-110"
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
        >
          <span style={{ color: n <= value ? "#B28B5D" : "#D1C4B0" }}>★</span>
        </button>
      ))}
    </div>
  );
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} style={{ color: n <= rating ? "#B28B5D" : "#D1C4B0" }} className="text-[16px]">
          ★
        </span>
      ))}
    </span>
  );
}

export function ReviewsAdmin({ initialReviews }: { initialReviews: Review[] }) {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [body, setBody] = useState("");
  const [rating, setRating] = useState(5);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, company, body, rating }),
    });
    if (!res.ok) {
      setError("Failed to save review.");
      setSaving(false);
      return;
    }
    const created = await res.json();
    setReviews((prev) => [created, ...prev]);
    setName("");
    setCompany("");
    setBody("");
    setRating(5);
    setSaving(false);
    router.refresh();
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    setReviews((prev) => prev.filter((r) => r.id !== id));
    setDeletingId(null);
    router.refresh();
  }

  return (
    <div className="grid md:grid-cols-[380px_1fr] gap-8 items-start">
      {/* Add form */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-[11px] tracking-[0.12em] uppercase text-[#A09687] mb-5">Add review</h2>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-[12px] text-red-700">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelCls}>Name *</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Smith"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Company (optional)</label>
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Acme Ltd"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Review *</label>
            <textarea
              required
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="What did they say?"
              className={`${inputCls} resize-none leading-[22px]`}
            />
          </div>
          <div>
            <label className={labelCls}>Rating</label>
            <StarPicker value={rating} onChange={setRating} />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 bg-[#3E4F56] text-white text-[12px] tracking-[0.12em] uppercase rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {saving ? "Saving…" : "Add review"}
          </button>
        </form>
      </div>

      {/* Reviews list */}
      <div className="space-y-3">
        {reviews.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center text-[13px] text-[#A09687]">
            No reviews yet. Add your first one.
          </div>
        )}
        {reviews.map((r) => (
          <div key={r.id} className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <StarDisplay rating={r.rating} />
                  <span className="font-serif text-[15px] text-[#3E4F56]">{r.name}</span>
                  {r.company && (
                    <span className="text-[12px] text-[#A09687]">· {r.company}</span>
                  )}
                </div>
                <p className="mt-2 text-[13px] leading-[22px] text-[#3E4F56]/80">{r.body}</p>
                <p className="mt-2 text-[11px] text-[#A09687]">
                  {new Date(r.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(r.id)}
                disabled={deletingId === r.id}
                className="text-[#A09687] hover:text-red-500 transition-colors disabled:opacity-40 shrink-0 mt-0.5"
                aria-label="Delete review"
              >
                <Trash2 size={15} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
