"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AboutEditor } from "./AboutEditor";
import { Trash2 } from "lucide-react";
import { ImageUploadField } from "./ImageUploadField";

const inputCls =
  "w-full border border-[#3E4F56]/15 rounded px-4 py-3 text-[13px] text-[#3E4F56] bg-[#F5F0E6] focus:outline-none focus:border-[#B28B5D] placeholder:text-[#A09687]/50";
const labelCls = "block text-[11px] tracking-[0.1em] uppercase text-[#A09687] mb-2";

interface Value { name: string; body: string; }
interface GalleryItem { src: string; label: string; }

interface Props {
  content: Record<string, string>;
  // About data
  aboutIntro: string;
  therapistName: string;
  therapistRole: string;
  therapistBio: string;
  therapistImage: string;
  studioValues: Value[];
  gallery: GalleryItem[];
}

const TABS = ["Studio Details", "About", "Copy", "SEO"] as const;
type Tab = typeof TABS[number];

function Field({
  label, value, onChange, type = "input", rows = 3, placeholder = "",
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: "input" | "textarea"; rows?: number; placeholder?: string;
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className={`${inputCls} resize-none`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputCls}
        />
      )}
    </div>
  );
}

function Card({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-5">
      <div>
        <h2 className="font-serif text-[20px] text-[#3E4F56] font-normal">{title}</h2>
        {note && <p className="text-[12px] text-[#A09687] mt-1">{note}</p>}
      </div>
      {children}
    </div>
  );
}

function SaveBar({ saving, saved, onSave }: { saving: boolean; saved: boolean; onSave: () => void }) {
  return (
    <div className="flex items-center gap-4 pt-2">
      <button
        onClick={onSave}
        disabled={saving}
        className="bg-[#3E4F56] text-[#EAE2D2] text-[12px] tracking-[0.15em] uppercase px-8 py-3 rounded hover:opacity-90 disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save changes"}
      </button>
      {saved && <span className="text-[13px] text-emerald-600">Saved ✓</span>}
    </div>
  );
}

export function ContentEditor({
  content,
  aboutIntro, therapistName, therapistRole, therapistBio, therapistImage,
  studioValues, gallery,
}: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("Studio Details");
  const [values, setValues] = useState<Record<string, string>>(content);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function update(key: string, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function save(extra?: Record<string, string>) {
    setSaving(true);
    await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, ...extra }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    router.refresh();
  }

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 mb-8 border-b border-[#3E4F56]/10">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-3 text-[12px] tracking-[0.1em] uppercase transition-colors ${
              tab === t
                ? "text-[#3E4F56] border-b-2 border-[#B28B5D] -mb-px"
                : "text-[#A09687] hover:text-[#3E4F56]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Studio Details" && (
        <StudioTab values={values} update={update} saving={saving} saved={saved} onSave={() => save()} />
      )}
      {tab === "About" && (
        <AboutEditor
          intro={aboutIntro}
          therapistName={therapistName}
          therapistRole={therapistRole}
          therapistBio={therapistBio}
          therapistImage={therapistImage}
          values={studioValues}
          gallery={gallery}
        />
      )}
      {tab === "Copy" && (
        <CopyTab values={values} update={update} saving={saving} saved={saved} onSave={() => save()} />
      )}
      {tab === "SEO" && (
        <SeoTab values={values} update={update} saving={saving} saved={saved} onSave={() => save()} />
      )}
    </div>
  );
}

function StudioTab({ values, update, saving, saved, onSave }: {
  values: Record<string, string>;
  update: (k: string, v: string) => void;
  saving: boolean; saved: boolean; onSave: () => void;
}) {
  return (
    <div className="space-y-6">
      <Card title="Contact & Location">
        <Field label="Address" value={values["studio.address"] ?? ""} onChange={(v) => update("studio.address", v)}
          type="textarea" rows={3} placeholder={"10 Watkin Lane\nLostock Hall, Preston\nPR5 5RH"} />
        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Phone" value={values["studio.phone"] ?? ""} onChange={(v) => update("studio.phone", v)}
            placeholder="01772 419519" />
          <Field label="Email" value={values["studio.email"] ?? ""} onChange={(v) => update("studio.email", v)}
            placeholder="hello@balanceandwellness.com" />
        </div>
      </Card>

      <Card title="Opening Hours" note="One line per time slot.">
        <Field label="Hours" value={values["studio.hours"] ?? ""} onChange={(v) => update("studio.hours", v)}
          type="textarea" rows={5}
          placeholder={"Tuesday — Friday: 09:00 — 19:00\nSaturday: 09:00 — 17:00\nSunday & Monday: Closed"} />
      </Card>

      <Card title="Social Media">
        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Instagram handle" value={values["studio.instagram"] ?? ""}
            onChange={(v) => update("studio.instagram", v)} placeholder="@balance.and.wellness" />
          <Field label="Facebook page URL" value={values["studio.facebook"] ?? ""}
            onChange={(v) => update("studio.facebook", v)} placeholder="https://facebook.com/balanceandwellness" />
        </div>
      </Card>

      <Card title="Accreditations" note="Professional memberships and qualifications. One per line.">
        <Field label="Accreditations" value={values["studio.accreditations"] ?? ""}
          onChange={(v) => update("studio.accreditations", v)}
          type="textarea" rows={5}
          placeholder={"Federation of Holistic Therapists (FHT)\nInternational Federation of Aromatherapists (IFA)\nClinical Aromatherapy Diploma — XYZ College"} />
      </Card>

      <SaveBar saving={saving} saved={saved} onSave={onSave} />
    </div>
  );
}

function CopyTab({ values, update, saving, saved, onSave }: {
  values: Record<string, string>;
  update: (k: string, v: string) => void;
  saving: boolean; saved: boolean; onSave: () => void;
}) {
  return (
    <div className="space-y-6">
      <Card title="Homepage hero">
        <Field label="Headline" value={values["hero.headline"] ?? ""} onChange={(v) => update("hero.headline", v)}
          placeholder="A quiet hour with a skilled pair of hands." />
        <Field label="Sub-headline" value={values["hero.subheadline"] ?? ""} onChange={(v) => update("hero.subheadline", v)}
          type="textarea" rows={3} placeholder="Boutique massage and bodywork in Bristol…" />
      </Card>

      <Card title="Page descriptions" note="Shown in Google search results under each page title. Keep under 160 characters.">
        {[
          { key: "page.home.description", label: "Home" },
          { key: "page.about.description", label: "About" },
          { key: "page.services.description", label: "Treatments" },
          { key: "page.contact.description", label: "Contact" },
          { key: "page.book.description", label: "Book" },
          { key: "page.journal.description", label: "Journal" },
          { key: "page.pricing.description", label: "Pricing" },
        ].map(({ key, label }) => (
          <Field key={key} label={label} value={values[key] ?? ""} onChange={(v) => update(key, v)}
            type="textarea" rows={2} />
        ))}
      </Card>

      <SaveBar saving={saving} saved={saved} onSave={onSave} />
    </div>
  );
}

function SeoTab({ values, update, saving, saved, onSave }: {
  values: Record<string, string>;
  update: (k: string, v: string) => void;
  saving: boolean; saved: boolean; onSave: () => void;
}) {
  return (
    <div className="space-y-6">
      <Card title="SEO" note="Paste your Google Search Console verification code to verify site ownership.">
        <Field label="Google Search Console verification code" value={values["seo.googleVerification"] ?? ""}
          onChange={(v) => update("seo.googleVerification", v)} placeholder="abc123XYZ…" />
        <Field label="Google Reviews link" value={values["seo.googleReviewsUrl"] ?? ""}
          onChange={(v) => update("seo.googleReviewsUrl", v)} placeholder="https://g.page/r/…/review" />
      </Card>

      <SaveBar saving={saving} saved={saved} onSave={onSave} />
    </div>
  );
}
