import type { ReactNode } from "react";

export type BadgeVariant = "primary" | "success" | "warning" | "danger" | "neutral";

interface BadgeProps {
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  primary: "bg-[#DBEAFE] text-[#2563EB] border-[#BFDBFE]",
  success: "bg-emerald-50 text-[#16A34A] border-emerald-200",
  warning: "bg-amber-50 text-[#B45309] border-amber-200",
  danger: "bg-red-50 text-[#DC2626] border-red-200",
  neutral: "bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]",
};

const DOT_CLASSES: Record<BadgeVariant, string> = {
  primary: "bg-[#2563EB]",
  success: "bg-[#16A34A]",
  warning: "bg-[#F59E0B]",
  danger: "bg-[#DC2626]",
  neutral: "bg-[#64748B]",
};

export function Badge({
  variant = "neutral",
  dot = false,
  className = "",
  children,
}: BadgeProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1 text-[13px] font-medium leading-5 ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {dot && <span className={`h-2 w-2 shrink-0 rounded-full ${DOT_CLASSES[variant]}`} />}
      {children}
    </span>
  );
}
