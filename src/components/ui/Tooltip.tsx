"use client";

import { Info } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  content: ReactNode;
  title?: string;
  side?: "top" | "bottom";
  maxWidthClass?: string;
  children: ReactNode;
  className?: string;
}

interface Coords {
  top: number;
  left: number;
  actualSide: "top" | "bottom";
}

export function Tooltip({
  content,
  title,
  side = "top",
  maxWidthClass = "max-w-[230px]",
  children,
  className = "inline-flex",
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<Coords | null>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceAbove = rect.top;
    const actualSide = side === "top" && spaceAbove < 95 ? "bottom" : side;

    const rawLeft = rect.left + rect.width / 2;
    const clampedLeft = Math.min(Math.max(rawLeft, 145), window.innerWidth - 145);

    setCoords({
      top: actualSide === "top" ? rect.top - 10 : rect.bottom + 10,
      left: clampedLeft,
      actualSide,
    });
  };

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, side]);

  useEffect(() => {
    if (!open) return;
    const onScrollOrResize = () => updatePosition();
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className={className}
      >
        {children}
      </span>

      {open &&
        coords &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            role="tooltip"
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
              transform:
                coords.actualSide === "top"
                  ? "translate(-50%, -100%)"
                  : "translate(-50%, 0)",
            }}
            className={`pointer-events-none z-[120] ${maxWidthClass} rounded-xl bg-[#1E293B] px-3 py-2 text-left text-[11px] leading-snug text-slate-100 shadow-lg shadow-slate-900/20`}
          >
            {title && <p className="mb-0.5 font-semibold text-white">{title}</p>}
            <div className="text-slate-200">{content}</div>
          </div>,
          document.body
        )}
    </>
  );
}

interface InfoHintProps {
  title?: string;
  content: ReactNode;
  light?: boolean;
}

export function InfoHint({ title, content, light = false }: InfoHintProps) {
  return (
    <Tooltip title={title} content={content}>
      <span
        tabIndex={0}
        aria-label={title ?? "คำอธิบายเพิ่มเติม"}
        className={`inline-flex h-4.5 w-4.5 items-center justify-center rounded-full transition-colors cursor-help ${
          light
            ? "text-blue-100/80 hover:bg-white/15 hover:text-white"
            : "text-[#94A3B8] hover:bg-[#F1F5F9] hover:text-[#2563EB]"
        }`}
      >
        <Info className="h-3.5 w-3.5" />
      </span>
    </Tooltip>
  );
}
