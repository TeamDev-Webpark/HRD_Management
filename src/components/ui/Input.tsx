import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
}

export function Input({
  label,
  helperText,
  error,
  required,
  id,
  className = "",
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[#1E293B]">
          {label}
          {required && <span className="ml-0.5 text-[#DC2626]">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`h-11 w-full rounded-xl border bg-white px-3.5 text-[15px] text-[#1E293B] placeholder:text-[#94A3B8] transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-[#F8FAFC] disabled:text-[#94A3B8] ${
          error
            ? "border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/15"
            : "border-[#E2E8F0] hover:border-[#CBD5E1] focus:border-[#2563EB] focus:ring-[#2563EB]/15"
        } ${className}`}
        {...props}
      />
      {error ? (
        <p className="text-[13px] text-[#DC2626]">{error}</p>
      ) : helperText ? (
        <p className="text-[13px] text-[#64748B]">{helperText}</p>
      ) : null}
    </div>
  );
}
