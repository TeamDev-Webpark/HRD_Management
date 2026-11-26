"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface DropdownProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: ReactNode;
  children: ReactNode;
  align?: "left" | "right";
  panelClassName?: string;
}

export function Dropdown({
  open,
  onOpenChange,
  trigger,
  children,
  align = "right",
  panelClassName = "w-80",
}: DropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onOpenChange(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onOpenChange(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onOpenChange]);

  return (
    <div ref={containerRef} className="relative">
      <div onClick={() => onOpenChange(!open)}>{trigger}</div>
      {open && (
        <div
          className={`absolute top-full z-50 mt-2 rounded-2xl border border-[#E2E8F0] bg-white shadow-lg shadow-slate-900/10 ${
            align === "right" ? "right-0" : "left-0"
          } ${panelClassName}`}
        >
          {children}
        </div>
      )}
    </div>
  );
}
