"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const start = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const end = Math.min(safePage * pageSize, totalItems);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex flex-col gap-2.5 border-t border-[#F1F5F9] pt-4 text-xs text-[#64748B] sm:flex-row sm:items-center sm:justify-between">
      <p className="tabular-nums">
        แสดง <strong className="text-[#1E293B]">{start}–{end}</strong> จากทั้งหมด{" "}
        <strong className="text-[#1E293B]">{totalItems}</strong> รายการ
      </p>

      <div className="inline-flex items-center gap-1">
        <button
          type="button"
          disabled={safePage <= 1}
          onClick={() => onPageChange(safePage - 1)}
          aria-label="หน้าก่อนหน้า"
          className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#E2E8F0] bg-white px-2.5 font-medium text-[#64748B] transition-colors hover:bg-[#F8FAFC] hover:text-[#1E293B] disabled:pointer-events-none disabled:opacity-45 cursor-pointer"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          ก่อนหน้า
        </button>

        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2 font-semibold tabular-nums transition-colors cursor-pointer ${
              p === safePage
                ? "bg-[#2563EB] text-white shadow-2xs"
                : "border border-[#E2E8F0] bg-white text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1E293B]"
            }`}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          disabled={safePage >= totalPages}
          onClick={() => onPageChange(safePage + 1)}
          aria-label="หน้าถัดไป"
          className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#E2E8F0] bg-white px-2.5 font-medium text-[#64748B] transition-colors hover:bg-[#F8FAFC] hover:text-[#1E293B] disabled:pointer-events-none disabled:opacity-45 cursor-pointer"
        >
          ถัดไป
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
