import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={`flex flex-wrap items-center gap-1.5 text-[13px] ${className}`}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={`${item.label}-${index}`} className="inline-flex items-center gap-1.5">
            {index > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#94A3B8]" />}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="font-medium text-[#64748B] transition-colors hover:text-[#2563EB]"
              >
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "font-semibold text-[#1E293B]" : "font-medium text-[#64748B]"}>
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
