"use client";

import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";

interface Props {
  value: string;
  onChange: (url: string) => void;
  slot?: string;
  alt?: string;
}

export function ImageUploadField({ value, onChange, slot = "service", alt = "" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File) {
    setUploading(true);
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    fd.append("slot", slot);
    fd.append("alt", alt || file.name.replace(/\.[^.]+$/, ""));

    const res = await fetch("/api/admin/images", { method: "POST", body: fd });
    if (res.ok) {
      const img = await res.json();
      onChange(img.url);
    } else {
      setError("Upload failed — check your BLOB_READ_WRITE_TOKEN in .env");
    }
    setUploading(false);
  }

  function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    upload(files[0]);
  }

  return (
    <div>
      {value ? (
        <div className="relative group w-full aspect-[16/7] rounded-lg overflow-hidden bg-[#F5F0E6]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt={alt} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-2 bg-white/90 text-[#3E4F56] text-[12px] tracking-[0.1em] uppercase px-4 py-2 rounded hover:bg-white"
            >
              <Upload size={13} strokeWidth={1.5} />
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="flex items-center gap-2 bg-white/90 text-red-600 text-[12px] tracking-[0.1em] uppercase px-4 py-2 rounded hover:bg-white"
            >
              <X size={13} strokeWidth={1.5} />
              Remove
            </button>
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center text-[13px] text-[#3E4F56]">
              Uploading…
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={`w-full aspect-[16/7] rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors ${
            dragOver
              ? "border-[#B28B5D] bg-[#fff8ee]"
              : "border-[#3E4F56]/15 hover:border-[#B28B5D] bg-[#F5F0E6]"
          }`}
        >
          {uploading ? (
            <span className="text-[13px] text-[#A09687]">Uploading…</span>
          ) : (
            <>
              <Upload size={20} strokeWidth={1.5} className="text-[#A09687]" />
              <span className="text-[13px] text-[#A09687]">
                Drop an image here, or click to browse
              </span>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="mt-2 text-[12px] text-red-600">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
