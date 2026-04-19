"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { ImageUploadField } from "./ImageUploadField";

interface Value { name: string; body: string; }
interface GalleryItem { src: string; label: string; }

const inputCls =
  "w-full border border-[#3E4F56]/15 rounded px-4 py-3 text-[13px] text-[#3E4F56] bg-[#F5F0E6] focus:outline-none focus:border-[#B28B5D] placeholder:text-[#A09687]/50";
const labelCls = "block text-[11px] tracking-[0.1em] uppercase text-[#A09687] mb-2";

interface Props {
  intro: string;
  therapistName: string;
  therapistRole: string;
  therapistBio: string;
  therapistImage: string;
  values: Value[];
  gallery: GalleryItem[];
}

export function AboutEditor(props: Props) {
  const router = useRouter();
  const [intro, setIntro] = useState(props.intro);
  const [therapist, setTherapist] = useState({
    name: props.therapistName,
    role: props.therapistRole,
    bio: props.therapistBio,
    image: props.therapistImage,
  });
  const [values, setValues] = useState<Value[]>(props.values);
  const [gallery, setGallery] = useState<GalleryItem[]>(props.gallery);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function updateValue(i: number, field: keyof Value, val: string) {
    setValues((prev) => prev.map((v, idx) => (idx === i ? { ...v, [field]: val } : v)));
  }
  function addValue() { setValues((prev) => [...prev, { name: "", body: "" }]); }
  function removeValue(i: number) { setValues((prev) => prev.filter((_, idx) => idx !== i)); }

  function updateGallery(i: number, field: keyof GalleryItem, val: string) {
    setGallery((prev) => prev.map((g, idx) => (idx === i ? { ...g, [field]: val } : g)));
  }
  function addGalleryItem() { setGallery((prev) => [...prev, { src: "", label: "" }]); }
  function removeGalleryItem(i: number) { setGallery((prev) => prev.filter((_, idx) => idx !== i)); }

  async function save() {
    setSaving(true);
    await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "about.intro": intro,
        "about.therapist.name": therapist.name,
        "about.therapist.role": therapist.role,
        "about.therapist.bio": therapist.bio,
        "about.therapist.image": therapist.image,
        "about.values": JSON.stringify(values),
        "about.gallery": JSON.stringify(gallery),
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <h2 className="font-serif text-[20px] text-[#3E4F56] font-normal">Page intro</h2>
        <div>
          <label className={labelCls}>Intro paragraph</label>
          <textarea
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            rows={4}
            placeholder="Balance and Wellness is a one-therapist studio…"
            className={`${inputCls} resize-none`}
          />
        </div>
      </div>

      {/* Therapist */}
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-5">
        <h2 className="font-serif text-[20px] text-[#3E4F56] font-normal">Therapist</h2>
        <div>
          <label className={labelCls}>Photo</label>
          <ImageUploadField
            value={therapist.image}
            onChange={(url) => setTherapist((t) => ({ ...t, image: url }))}
            slot="about:therapist"
            alt={therapist.name}
          />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Name</label>
            <input
              type="text"
              value={therapist.name}
              onChange={(e) => setTherapist((t) => ({ ...t, name: e.target.value }))}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Role / credentials</label>
            <input
              type="text"
              value={therapist.role}
              onChange={(e) => setTherapist((t) => ({ ...t, role: e.target.value }))}
              className={inputCls}
            />
          </div>
        </div>
        <div>
          <label className={labelCls}>Bio — use a blank line to separate paragraphs</label>
          <textarea
            value={therapist.bio}
            onChange={(e) => setTherapist((t) => ({ ...t, bio: e.target.value }))}
            rows={8}
            className={`${inputCls} resize-y`}
          />
        </div>
      </div>

      {/* Values */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="font-serif text-[20px] text-[#3E4F56] font-normal mb-5">Studio values</h2>
        <div className="space-y-4">
          {values.map((v, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex-1 grid grid-cols-[160px_1fr] gap-3">
                <div>
                  <label className={labelCls}>Name</label>
                  <input
                    type="text"
                    value={v.name}
                    onChange={(e) => updateValue(i, "name", e.target.value)}
                    placeholder="Balance"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Description</label>
                  <input
                    type="text"
                    value={v.body}
                    onChange={(e) => updateValue(i, "body", e.target.value)}
                    placeholder="What this value means to the studio…"
                    className={inputCls}
                  />
                </div>
              </div>
              <button
                onClick={() => removeValue(i)}
                className="text-[#A09687] hover:text-red-600 text-[18px] mt-6"
                title="Remove"
              >
                ×
              </button>
            </div>
          ))}
          <button onClick={addValue} className="text-[13px] text-[#B28B5D] hover:underline mt-1">
            + Add value
          </button>
        </div>
      </div>

      {/* Gallery */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="font-serif text-[20px] text-[#3E4F56] font-normal mb-1">Gallery</h2>
        <p className="text-[12px] text-[#A09687] mb-5">Photos shown in the &ldquo;Inside the studio&rdquo; section.</p>
        <div className="space-y-6">
          {gallery.map((g, i) => (
            <div key={i} className="border border-[#3E4F56]/10 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] tracking-[0.1em] uppercase text-[#A09687]">Photo {i + 1}</span>
                <button
                  onClick={() => removeGalleryItem(i)}
                  className="text-[#A09687] hover:text-red-600 transition-colors"
                  title="Remove"
                >
                  <Trash2 size={14} strokeWidth={1.5} />
                </button>
              </div>
              <ImageUploadField
                value={g.src}
                onChange={(url) => updateGallery(i, "src", url)}
                slot={`about:gallery:${i}`}
                alt={g.label}
              />
              <div>
                <label className={labelCls}>Caption</label>
                <input
                  type="text"
                  value={g.label}
                  onChange={(e) => updateGallery(i, "label", e.target.value)}
                  placeholder="The treatment room"
                  className={inputCls}
                />
              </div>
            </div>
          ))}
          <button onClick={addGalleryItem} className="text-[13px] text-[#B28B5D] hover:underline">
            + Add photo
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 pb-8">
        <button
          onClick={save}
          disabled={saving}
          className="bg-[#3E4F56] text-[#EAE2D2] text-[12px] tracking-[0.15em] uppercase px-8 py-3 rounded hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
        {saved && <span className="text-[13px] text-emerald-600">Saved ✓</span>}
      </div>
    </div>
  );
}
