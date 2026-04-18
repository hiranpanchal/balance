"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  content: Record<string, string>;
}

const sections = [
  {
    title: "Hero",
    fields: [
      { key: "hero.headline", label: "Headline", type: "input" },
      { key: "hero.subheadline", label: "Sub-headline", type: "textarea" },
    ],
  },
  {
    title: "Studio",
    fields: [
      { key: "studio.address", label: "Address (one line per line)", type: "textarea" },
      { key: "studio.phone", label: "Phone", type: "input" },
      { key: "studio.email", label: "Email", type: "input" },
      { key: "studio.instagram", label: "Instagram handle", type: "input" },
      { key: "studio.hours", label: "Opening hours (format: Day: HH:MM — HH:MM)", type: "textarea" },
    ],
  },
];

export function ContentEditor({ content }: Props) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>(content);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function update(key: string, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function save() {
    setSaving(true);
    await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <div key={section.title} className="bg-white rounded-lg shadow-sm p-6 space-y-5">
          <h2 className="font-serif text-[20px] text-[#3E4F56] font-normal">{section.title}</h2>
          {section.fields.map(({ key, label, type }) => (
            <div key={key}>
              <label className="block text-[11px] tracking-[0.1em] uppercase text-[#A09687] mb-2">
                {label}
              </label>
              {type === "textarea" ? (
                <textarea
                  value={values[key] ?? ""}
                  onChange={(e) => update(key, e.target.value)}
                  rows={3}
                  className="w-full border border-[#3E4F56]/15 rounded px-4 py-3 text-[13px] text-[#3E4F56] bg-[#F5F0E6] resize-none focus:outline-none focus:border-[#B28B5D]"
                />
              ) : (
                <input
                  type="text"
                  value={values[key] ?? ""}
                  onChange={(e) => update(key, e.target.value)}
                  className="w-full border border-[#3E4F56]/15 rounded px-4 py-3 text-[13px] text-[#3E4F56] bg-[#F5F0E6] focus:outline-none focus:border-[#B28B5D]"
                />
              )}
            </div>
          ))}
        </div>
      ))}

      <div className="flex items-center gap-4">
        <button
          onClick={save}
          disabled={saving}
          className="bg-[#3E4F56] text-[#EAE2D2] text-[12px] tracking-[0.15em] uppercase px-8 py-3 rounded hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save all changes"}
        </button>
        {saved && <span className="text-[13px] text-emerald-600">Saved ✓</span>}
      </div>
    </div>
  );
}
