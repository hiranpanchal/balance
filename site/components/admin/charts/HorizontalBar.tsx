"use client";

interface Row {
  label: string;
  value: number;
  count: number;
}

export function HorizontalBar({ data, prefix = "£" }: { data: Row[]; prefix?: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="space-y-3">
      {data.map((row, i) => (
        <div key={i}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[12px] text-[#3E4F56] truncate pr-4">{row.label}</span>
            <span className="text-[12px] text-[#A09687] shrink-0">
              {prefix}{row.value.toLocaleString()} · {row.count} session{row.count !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="h-1.5 bg-[#EAE2D2] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#B28B5D] rounded-full transition-all"
              style={{ width: `${(row.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
