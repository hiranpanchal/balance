"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploadField } from "./ImageUploadField";

interface Duration {
  mins: number;
  price: number;
}

interface Step {
  eyebrow: string;
  body: string;
}

interface Service {
  id: string;
  name: string;
  tagline: string;
  lead: string;
  image: string;
  durations: Duration[];
  whatToExpect: unknown;
  goodFor: unknown;
}

function parseSteps(raw: unknown): Step[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((s): s is Step => typeof s === "object" && s !== null && "eyebrow" in s && "body" in s);
}

function parseGoodFor(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((s): s is string => typeof s === "string");
}

export function ServiceEditor({ service }: { service: Service }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: service.name,
    tagline: service.tagline,
    lead: service.lead,
    image: service.image,
  });
  const [durations, setDurations] = useState<Duration[]>(service.durations);
  const [steps, setSteps] = useState<Step[]>(parseSteps(service.whatToExpect));
  const [goodFor, setGoodFor] = useState<string[]>(parseGoodFor(service.goodFor));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function updateDuration(index: number, field: keyof Duration, value: string) {
    setDurations((prev) =>
      prev.map((d, i) => (i === index ? { ...d, [field]: parseInt(value) || 0 } : d))
    );
  }

  function addDuration() {
    setDurations((prev) => [...prev, { mins: 60, price: 65 }]);
  }

  function removeDuration(index: number) {
    setDurations((prev) => prev.filter((_, i) => i !== index));
  }

  function updateStep(index: number, field: keyof Step, value: string) {
    setSteps((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  }

  function addStep() {
    setSteps((prev) => [...prev, { eyebrow: `0${prev.length + 1}`, body: "" }]);
  }

  function removeStep(index: number) {
    setSteps((prev) => prev.filter((_, i) => i !== index));
  }

  function updateGoodFor(index: number, value: string) {
    setGoodFor((prev) => prev.map((s, i) => (i === index ? value : s)));
  }

  function addGoodFor() {
    setGoodFor((prev) => [...prev, ""]);
  }

  function removeGoodFor(index: number) {
    setGoodFor((prev) => prev.filter((_, i) => i !== index));
  }

  async function save() {
    setSaving(true);
    await fetch(`/api/admin/services/${service.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, durations, whatToExpect: steps, goodFor }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-5">
        <h2 className="font-serif text-[20px] text-[#3E4F56] font-normal">Service details</h2>

        {(["name", "tagline"] as const).map((field) => (
          <div key={field}>
            <label className="block text-[11px] tracking-[0.1em] uppercase text-[#A09687] mb-2">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              type="text"
              value={form[field]}
              onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
              className="w-full border border-[#3E4F56]/15 rounded px-4 py-3 text-[13px] text-[#3E4F56] bg-[#F5F0E6] focus:outline-none focus:border-[#B28B5D]"
            />
          </div>
        ))}

        <div>
          <label className="block text-[11px] tracking-[0.1em] uppercase text-[#A09687] mb-2">
            Image
          </label>
          <ImageUploadField
            value={form.image}
            onChange={(url) => setForm((f) => ({ ...f, image: url }))}
            slot={`service:${service.id}`}
            alt={form.name}
          />
        </div>

        <div>
          <label className="block text-[11px] tracking-[0.1em] uppercase text-[#A09687] mb-2">
            Lead paragraph
          </label>
          <textarea
            value={form.lead}
            onChange={(e) => setForm((f) => ({ ...f, lead: e.target.value }))}
            rows={4}
            className="w-full border border-[#3E4F56]/15 rounded px-4 py-3 text-[13px] text-[#3E4F56] bg-[#F5F0E6] focus:outline-none focus:border-[#B28B5D] resize-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="font-serif text-[20px] text-[#3E4F56] font-normal mb-5">Pricing</h2>
        <div className="space-y-3">
          {durations.map((d, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex-1 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] tracking-[0.1em] uppercase text-[#A09687] mb-1">
                    Minutes
                  </label>
                  <input
                    type="number"
                    value={d.mins}
                    onChange={(e) => updateDuration(i, "mins", e.target.value)}
                    className="w-full border border-[#3E4F56]/15 rounded px-3 py-2 text-[13px] text-[#3E4F56] bg-[#F5F0E6] focus:outline-none focus:border-[#B28B5D]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] tracking-[0.1em] uppercase text-[#A09687] mb-1">
                    Price (£)
                  </label>
                  <input
                    type="number"
                    value={d.price}
                    onChange={(e) => updateDuration(i, "price", e.target.value)}
                    className="w-full border border-[#3E4F56]/15 rounded px-3 py-2 text-[13px] text-[#3E4F56] bg-[#F5F0E6] focus:outline-none focus:border-[#B28B5D]"
                  />
                </div>
              </div>
              <button
                onClick={() => removeDuration(i)}
                className="text-[#A09687] hover:text-red-600 text-[18px] mt-4"
                title="Remove"
              >
                ×
              </button>
            </div>
          ))}
          <button
            onClick={addDuration}
            className="text-[13px] text-[#B28B5D] hover:underline mt-2"
          >
            + Add duration
          </button>
        </div>
      </div>

      {/* What to expect */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="font-serif text-[20px] text-[#3E4F56] font-normal mb-5">What to expect</h2>
        <div className="space-y-4">
          {steps.map((s, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex-1 grid grid-cols-[80px_1fr] gap-3">
                <div>
                  <label className="block text-[11px] tracking-[0.1em] uppercase text-[#A09687] mb-1">Label</label>
                  <input
                    type="text"
                    value={s.eyebrow}
                    onChange={(e) => updateStep(i, "eyebrow", e.target.value)}
                    placeholder="01"
                    className="w-full border border-[#3E4F56]/15 rounded px-3 py-2 text-[13px] text-[#3E4F56] bg-[#F5F0E6] focus:outline-none focus:border-[#B28B5D]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] tracking-[0.1em] uppercase text-[#A09687] mb-1">Step description</label>
                  <input
                    type="text"
                    value={s.body}
                    onChange={(e) => updateStep(i, "body", e.target.value)}
                    placeholder="What happens at this point…"
                    className="w-full border border-[#3E4F56]/15 rounded px-3 py-2 text-[13px] text-[#3E4F56] bg-[#F5F0E6] focus:outline-none focus:border-[#B28B5D]"
                  />
                </div>
              </div>
              <button onClick={() => removeStep(i)} className="text-[#A09687] hover:text-red-600 text-[18px] mt-6" title="Remove">×</button>
            </div>
          ))}
          <button onClick={addStep} className="text-[13px] text-[#B28B5D] hover:underline mt-1">+ Add step</button>
        </div>
      </div>

      {/* Good for */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="font-serif text-[20px] text-[#3E4F56] font-normal mb-5">Good for</h2>
        <div className="space-y-3">
          {goodFor.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                type="text"
                value={item}
                onChange={(e) => updateGoodFor(i, e.target.value)}
                placeholder="e.g. General tension"
                className="flex-1 border border-[#3E4F56]/15 rounded px-3 py-2 text-[13px] text-[#3E4F56] bg-[#F5F0E6] focus:outline-none focus:border-[#B28B5D]"
              />
              <button onClick={() => removeGoodFor(i)} className="text-[#A09687] hover:text-red-600 text-[18px]" title="Remove">×</button>
            </div>
          ))}
          <button onClick={addGoodFor} className="text-[13px] text-[#B28B5D] hover:underline mt-1">+ Add item</button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={save}
          disabled={saving}
          className="bg-[#3E4F56] text-[#EAE2D2] text-[12px] tracking-[0.15em] uppercase px-8 py-3 rounded hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
        {saved && (
          <span className="text-[13px] text-emerald-600">Saved ✓</span>
        )}
      </div>
    </div>
  );
}
