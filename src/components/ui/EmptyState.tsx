import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className = "" }: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC]/70 px-6 py-14 text-center ${className}`}
    >
      {icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DBEAFE] text-[#2563EB]">
          {icon}
        </div>
      )}
      <h4 className="text-base font-semibold text-[#1E293B]">{title}</h4>
      <p className="mt-1.5 max-w-md text-sm text-[#64748B]">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
