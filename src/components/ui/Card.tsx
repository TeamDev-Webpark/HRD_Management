import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ className = "", children, ...props }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-[#EEF2F6] bg-white hrd-card-shadow ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = "", children, ...props }: CardProps) {
  return (
    <div className={`flex flex-col gap-1 px-6 pt-6 pb-2 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className = "", children, ...props }: CardProps) {
  return (
    <h3 className={`text-[17px] font-semibold text-[#1E293B] ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className = "", children, ...props }: CardProps) {
  return (
    <p className={`text-sm text-[#94A3B8] ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className = "", children, ...props }: CardProps) {
  return (
    <div className={`px-6 py-5 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className = "", children, ...props }: CardProps) {
  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-b-2xl border-t border-[#F1F5F9] px-6 py-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
