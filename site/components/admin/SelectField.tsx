import { ChevronDown } from "lucide-react";

interface Option {
  value: string | number;
  label: string;
}

interface Props {
  label?: string;
  value: string | number;
  onChange: (value: string) => void;
  options: Option[];
  className?: string;
}

export function SelectField({ label, value, onChange, options, className = "" }: Props) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-[11px] tracking-[0.12em] uppercase text-[#A09687] mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-white border border-[#3E4F56]/15 rounded-md px-3 py-2.5 pr-9 text-[13px] text-[#3E4F56] focus:outline-none focus:border-[#B28B5D] focus:ring-1 focus:ring-[#B28B5D]/30 cursor-pointer transition-colors hover:border-[#3E4F56]/30"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          strokeWidth={1.5}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A09687] pointer-events-none"
        />
      </div>
    </div>
  );
}
