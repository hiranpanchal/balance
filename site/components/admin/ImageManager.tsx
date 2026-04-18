"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, Copy, Trash2 } from "lucide-react";

interface Image {
  id: string;
  url: string;
  alt: string;
  slot: string;
  filename: string;
  size: number;
}

const SLOTS = [
  "hero",
  "service:balance",
  "service:upper-body",
  "service:hand-and-arm",
  "service:walking-on-air",
  "service:holistic",
  "service:fibromyalgia",
  "service:hot-stones",
  "journal",
  "gallery",
  "team",
];

export function ImageManager({ images: initial }: { images: Image[] }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState(initial);
  const [slot, setSlot] = useState("gallery");
  const [alt, setAlt] = useState("");
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [filterSlot, setFilterSlot] = useState("");

  async function upload(files: FileList) {
    setUploading(true);
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("slot", slot);
      fd.append("alt", alt || file.name.replace(/\.[^.]+$/, ""));
      const res = await fetch("/api/admin/images", { method: "POST", body: fd });
      if (res.ok) {
        const img = await res.json();
        setImages((prev) => [img, ...prev]);
      }
    }
    setUploading(false);
    setAlt("");
  }

  async function deleteImage(id: string) {
    if (!confirm("Delete this image?")) return;
    await fetch(`/api/admin/images?id=${id}`, { method: "DELETE" });
    setImages((prev) => prev.filter((i) => i.id !== id));
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  }

  const displayed = filterSlot ? images.filter((i) => i.slot === filterSlot) : images;

  return (
    <div className="space-y-6">
      {/* Upload zone */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="font-serif text-[20px] text-[#3E4F56] font-normal mb-5">Upload</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-[11px] tracking-[0.1em] uppercase text-[#A09687] mb-2">
              Slot
            </label>
            <select
              value={slot}
              onChange={(e) => setSlot(e.target.value)}
              className="w-full border border-[#3E4F56]/15 rounded px-3 py-2.5 text-[13px] text-[#3E4F56] bg-[#F5F0E6] focus:outline-none focus:border-[#B28B5D]"
            >
              {SLOTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[11px] tracking-[0.1em] uppercase text-[#A09687] mb-2">
              Alt text
            </label>
            <input
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Describe the image"
              className="w-full border border-[#3E4F56]/15 rounded px-3 py-2.5 text-[13px] text-[#3E4F56] bg-[#F5F0E6] focus:outline-none focus:border-[#B28B5D] placeholder:text-[#A09687]"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="w-full flex items-center justify-center gap-2 bg-[#3E4F56] text-[#EAE2D2] text-[12px] tracking-[0.15em] uppercase py-2.5 rounded hover:opacity-90 disabled:opacity-50"
            >
              <Upload size={14} strokeWidth={1.5} />
              {uploading ? "Uploading…" : "Choose files"}
            </button>
          </div>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && upload(e.target.files)}
        />

        {/* Drag and drop zone */}
        <div
          className="border-2 border-dashed border-[#3E4F56]/15 rounded-lg p-10 text-center text-[#A09687] text-[13px] hover:border-[#B28B5D] transition-colors cursor-pointer"
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files.length) upload(e.dataTransfer.files);
          }}
        >
          Drag and drop images here, or click to browse
        </div>
      </div>

      {/* Library */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-[20px] text-[#3E4F56] font-normal">
            Library ({images.length})
          </h2>
          <select
            value={filterSlot}
            onChange={(e) => setFilterSlot(e.target.value)}
            className="border border-[#3E4F56]/15 rounded px-3 py-2 text-[12px] text-[#3E4F56] bg-[#F5F0E6] focus:outline-none"
          >
            <option value="">All slots</option>
            {SLOTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {displayed.length === 0 && (
          <p className="text-[13px] text-[#A09687] text-center py-10">
            No images uploaded yet.
          </p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {displayed.map((img) => (
            <div key={img.id} className="group relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.alt}
                className="w-full aspect-square object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                <button
                  onClick={() => copyUrl(img.url)}
                  title="Copy URL"
                  className="p-2 bg-white/20 rounded hover:bg-white/30"
                >
                  {copied === img.url ? (
                    <span className="text-white text-[11px]">✓</span>
                  ) : (
                    <Copy size={14} strokeWidth={1.5} className="text-white" />
                  )}
                </button>
                <button
                  onClick={() => deleteImage(img.id)}
                  title="Delete"
                  className="p-2 bg-white/20 rounded hover:bg-red-500/70"
                >
                  <Trash2 size={14} strokeWidth={1.5} className="text-white" />
                </button>
              </div>
              <div className="mt-1.5">
                <div className="text-[11px] text-[#3E4F56] truncate">{img.alt || img.filename}</div>
                <div className="text-[10px] text-[#A09687]">{img.slot}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
