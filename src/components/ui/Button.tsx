import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-[#2563EB] text-white hover:bg-[#1D4ED8] border border-transparent shadow-2xs focus-visible:ring-[#2563EB]/30",
  secondary:
    "bg-[#DBEAFE] text-[#2563EB] hover:bg-[#BFDBFE] border border-transparent focus-visible:ring-[#2563EB]/20",
  outline:
    "bg-white text-[#1E293B] hover:bg-[#F8FAFC] border border-[#E2E8F0] focus-visible:ring-[#2563EB]/20",
  ghost:
    "bg-transparent text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#1E293B] border border-transparent focus-visible:ring-[#2563EB]/20",
  danger:
    "bg-[#DC2626] text-white hover:bg-[#B91C1C] border border-transparent shadow-2xs focus-visible:ring-[#DC2626]/30",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-sm gap-1.5 rounded-lg",
  md: "h-10 px-4.5 text-[15px] gap-2 rounded-xl",
  lg: "h-12 px-6 text-base gap-2.5 rounded-xl",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  className = "",
  children,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
}
