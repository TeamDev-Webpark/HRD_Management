"use client";

import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  footer?: ReactNode;
}

const SIZE_CLASSES = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-3xl",
};

export function Modal({
  open,
  onClose,
  title,
  description,
  size = "md",
  children,
  footer,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px]"
        onClick={onClose}
      />

      <div
        className={`relative z-10 w-full rounded-2xl border border-[#E2E8F0] bg-white shadow-xl ${SIZE_CLASSES[size]}`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#E2E8F0] px-7 py-5">
          <div>
            <h3 id="modal-title" className="text-lg font-semibold text-[#1E293B]">
              {title}
            </h3>
            {description && <p className="mt-1 text-sm text-[#64748B]">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="ปิดหน้าต่าง"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#1E293B] cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-7 py-6 hrd-scrollbar">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-3 rounded-b-2xl border-t border-[#E2E8F0] bg-[#F8FAFC] px-7 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
