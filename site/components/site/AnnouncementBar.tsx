"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const STORAGE_KEY = "bw_announcement_dismissed_v1";
const MESSAGE = "Spring hours — now open Saturdays until 5pm";

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      setDismissed(false);
    }
  }, []);

  if (dismissed) return null;

  return (
    <div
      role="region"
      aria-label="Announcement"
      className="bg-cream-light text-teal text-center py-2 px-10 text-[11px] tracking-[0.22em] uppercase relative"
    >
      <span>{MESSAGE}</span>
      <button
        type="button"
        onClick={() => {
          try {
            localStorage.setItem(STORAGE_KEY, "1");
          } catch {}
          setDismissed(true);
        }}
        aria-label="Dismiss announcement"
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-teal/70 hover:text-teal"
      >
        <X size={14} strokeWidth={1.5} />
      </button>
    </div>
  );
}
