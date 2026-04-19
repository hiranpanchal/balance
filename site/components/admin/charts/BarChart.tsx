"use client";

import { useState } from "react";

interface Bar {
  label: string;
  value: number;
}

export function BarChart({ data, prefix = "£" }: { data: Bar[]; prefix?: string }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex items-end gap-1.5 h-40 w-full">
      {data.map((bar, i) => {
        const heightPct = max > 0 ? (bar.value / max) * 100 : 0;
        const isHovered = hovered === i;
        return (
          <div
            key={i}
            className="flex-1 flex flex-col items-center gap-1 group cursor-default"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {isHovered && (
              <div className="text-[11px] text-[#3E4F56] bg-white border border-[#EAE2D2] rounded px-2 py-1 shadow-sm whitespace-nowrap">
                {prefix}{bar.value.toLocaleString()}
              </div>
            )}
            <div className="w-full flex-1 flex items-end">
              <div
                className="w-full rounded-t transition-colors"
                style={{
                  height: `${Math.max(heightPct, bar.value > 0 ? 2 : 0)}%`,
                  backgroundColor: isHovered ? "#B28B5D" : "#3E4F56",
                  opacity: bar.value === 0 ? 0.15 : 1,
                }}
              />
            </div>
            <div className="text-[9px] text-[#A09687] tracking-wide truncate w-full text-center">
              {bar.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
