"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface SelectProps {
  label?: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
}

interface MenuPosition {
  top: number;
  left: number;
  width: number;
  openUpward: boolean;
}

export function Select({
  label,
  options,
  value,
  defaultValue = "",
  onChange,
  placeholder = "เลือกรายการ...",
  helperText,
  error,
  required,
  disabled = false,
  id,
  className = "",
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string>(defaultValue);
  const currentValue = isControlled ? value : internalValue;

  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [menuPos, setMenuPos] = useState<MenuPosition | null>(null);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === currentValue);

  const selectOption = (opt: SelectOption) => {
    if (opt.disabled) return;
    if (!isControlled) {
      setInternalValue(opt.value);
    }
    onChange?.(opt.value);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const estimatedHeight = Math.min(options.length * 46 + 18, 280);
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpward = spaceBelow < estimatedHeight && rect.top > estimatedHeight;

    setMenuPos({
      top: openUpward ? rect.top - 6 : rect.bottom + 6,
      left: rect.left,
      width: rect.width,
      openUpward,
    });
  };

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
    const idx = options.findIndex((opt) => opt.value === currentValue);
    setHighlightedIndex(idx >= 0 ? idx : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, currentValue, options.length]);

  useEffect(() => {
    if (!open) return;

    function handleOutsideClick(event: MouseEvent) {
      const target = event.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    }

    function handleViewportChange() {
      updatePosition();
    }

    document.addEventListener("mousedown", handleOutsideClick);
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (e.key === "Escape") {
      setOpen(false);
      return;
    }

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
      } else if (highlightedIndex >= 0 && options[highlightedIndex]) {
        selectOption(options[highlightedIndex]);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
      } else {
        setHighlightedIndex((prev) => (prev + 1) % options.length);
      }
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
      } else {
        setHighlightedIndex((prev) => (prev <= 0 ? options.length - 1 : prev - 1));
      }
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-[#1E293B]">
          {label}
          {required && <span className="ml-0.5 text-[#DC2626]">*</span>}
        </label>
      )}

      <button
        ref={triggerRef}
        id={selectId}
        type="button"
        disabled={disabled}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => !disabled && setOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        className={`flex h-11 w-full items-center justify-between gap-2 rounded-xl border bg-white px-3.5 text-left text-[15px] transition-all focus:outline-none disabled:cursor-not-allowed disabled:bg-[#F8FAFC] disabled:text-[#94A3B8] cursor-pointer ${
          error
            ? "border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/15"
            : open
              ? "border-[#2563EB] ring-2 ring-[#2563EB]/15"
              : "border-[#E2E8F0] hover:border-[#CBD5E1] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
        }`}
      >
        <span className={`truncate ${selectedOption ? "text-[#1E293B]" : "text-[#94A3B8]"}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`h-4.5 w-4.5 shrink-0 text-[#64748B] transition-transform duration-150 ${
            open ? "rotate-180 text-[#2563EB]" : ""
          }`}
        />
      </button>

      {error ? (
        <p className="text-[13px] text-[#DC2626]">{error}</p>
      ) : helperText ? (
        <p className="text-[13px] text-[#64748B]">{helperText}</p>
      ) : null}

      {open &&
        menuPos &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            role="listbox"
            style={{
              position: "fixed",
              top: menuPos.top,
              left: menuPos.left,
              width: menuPos.width,
              transform: menuPos.openUpward ? "translateY(-100%)" : undefined,
            }}
            className="z-[100] max-h-72 overflow-y-auto rounded-xl border border-[#E2E8F0] bg-white p-2 shadow-lg shadow-slate-900/10 hrd-scrollbar"
          >
            {options.map((opt, index) => {
              const isSelected = opt.value === currentValue;
              const isHighlighted = index === highlightedIndex;

              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  disabled={opt.disabled}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={() => selectOption(opt)}
                  className={`flex w-full items-center justify-between gap-2.5 rounded-lg px-3 py-2.5 text-left text-[15px] transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-45 ${
                    isSelected
                      ? "bg-[#DBEAFE]/75 font-medium text-[#2563EB]"
                      : isHighlighted
                        ? "bg-[#F8FAFC] text-[#1E293B]"
                        : "text-[#334155]"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="truncate">{opt.label}</p>
                    {opt.description && (
                      <p className="truncate text-xs font-normal text-[#64748B]">
                        {opt.description}
                      </p>
                    )}
                  </div>
                  {isSelected && <Check className="h-4 w-4 shrink-0 text-[#2563EB]" />}
                </button>
              );
            })}
          </div>,
          document.body
        )}
    </div>
  );
}
