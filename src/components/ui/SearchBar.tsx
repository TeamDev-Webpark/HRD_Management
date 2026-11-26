"use client";

import { Search, X } from "lucide-react";
import type { InputHTMLAttributes } from "react";

interface SearchBarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  containerClassName?: string;
}

export function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = "ค้นหา...",
  containerClassName = "",
  className = "",
  ...props
}: SearchBarProps) {
  return (
    <div className={`relative flex items-center ${containerClassName}`}>
      <Search className="pointer-events-none absolute left-3.5 h-4.5 w-4.5 text-[#64748B]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`h-11 w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] pl-10 pr-9 text-[15px] text-[#1E293B] placeholder:text-[#94A3B8] transition-colors hover:border-[#CBD5E1] focus:border-[#2563EB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]/15 ${className}`}
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange("");
            onClear?.();
          }}
          aria-label="ล้างคำค้นหา"
          className="absolute right-3 rounded-md p-1 text-[#64748B] hover:bg-[#E2E8F0]/60 hover:text-[#1E293B] cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
