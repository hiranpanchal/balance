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
      { key: "hero.headline", label: "Headline", type: "input", placeholder: "A quiet hour, well kept." },
      { key: "hero.subheadline", label: "Sub-headline", type: "textarea", placeholder: "Boutique massage and bodywork, delivered with unhurried attention." },
    ],
  },
  {
    title: "Studio",
    fields: [
      { key: "studio.address", label: "Address (one line per line)", type: "textarea", placeholder: "57 Watkin Ln,\nLostock Hall,\nPR5 5RE." },
      { key: "studio.phone", label: "Phone", type: "input", placeholder: "+44 1234 567890" },
      { key: "studio.email", label: "Email", type: "input", placeholder: "hello@balanceandwellness.com" },
      { key: "studio.instagram", label: "Instagram handle", type: "input", placeholder: "@balance.and.wellness" },
      { key: "studio.hours", label: "Opening hours (format: Day: HH:MM — HH:MM)", type: "textarea", placeholder: "Tuesday — Friday: 09:00 — 19:00\nSaturday: 09:00 — 17:00\nSunday & Monday: Closed" },
    ],
  },
  {
    title: "Page descriptions",
    note: "These appear in Google search results under each page title. Keep them under 160 characters.",
    fields: [
      { key: "page.home.description", label: "Home", type: "textarea", placeholder: "Boutique massage and bodywork by clinical aromatherapist Mukti Panchal. Seven treatments, one guest at a time." },
      { key: "page.about.description", label: "About", type: "textarea", placeholder: "Meet Mukti Panchal — fully qualified clinical aromatherapist and massage therapist." },
      { key: "page.services.description", label: "Treatments", type: "textarea", placeholder: "Seven boutique massage and bodywork treatments. One therapist, one guest at a time." },
      { key: "page.contact.description", label: "Contact", type: "textarea", placeholder: "Get in touch with Balance and Wellness. Studio address, opening hours, phone and email." },
      { key: "page.book.description", label: "Book", type: "textarea", placeholder: "Book a massage or bodywork session with Mukti Panchal. Choose your treatment and a time that suits you." },
      { key: "page.journal.description", label: "Journal", type: "textarea", placeholder: "Notes from the studio — short essays on stillness, sleep, ritual, and the craft of bodywork." },
      { key: "page.pricing.description", label: "Pricing", type: "textarea", placeholder: "Quiet, steady pricing across all seven treatments. No add-ons, no upsells. From £35." },
    ],
  },
  {
    title: "SEO",
    note: "Paste your Google Search Console verification code here to verify ownership of the site.",
    fields: [
      { key: "seo.googleVerification", label: "Google Search Console verification code", type: "input", placeholder: "e.g. abc123XYZ…" },
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
          <div>
            <h2 className="font-serif text-[20px] text-[#3E4F56] font-normal">{section.title}</h2>
            {"note" in section && section.note && (
              <p className="text-[12px] text-[#A09687] mt-1">{section.note}</p>
            )}
          </div>
          {section.fields.map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <label className="block text-[11px] tracking-[0.1em] uppercase text-[#A09687] mb-2">
                {label}
              </label>
              {type === "textarea" ? (
                <textarea
                  value={values[key] ?? ""}
                  onChange={(e) => update(key, e.target.value)}
                  placeholder={placeholder}
                  rows={3}
                  className="w-full border border-[#3E4F56]/15 rounded px-4 py-3 text-[13px] text-[#3E4F56] bg-[#F5F0E6] resize-none focus:outline-none focus:border-[#B28B5D] placeholder:text-[#A09687]/50"
                />
              ) : (
                <input
                  type="text"
                  value={values[key] ?? ""}
                  onChange={(e) => update(key, e.target.value)}
                  placeholder={placeholder}
                  className="w-full border border-[#3E4F56]/15 rounded px-4 py-3 text-[13px] text-[#3E4F56] bg-[#F5F0E6] focus:outline-none focus:border-[#B28B5D] placeholder:text-[#A09687]/50"
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
