"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, FolderOpen, ThumbsUp } from "lucide-react";
import {
  Badge,
  Button,
  EmptyState,
  SearchBar,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
} from "@/components/ui";
import type { TalentReviewItem, TalentReviewStatus } from "@/data/mock/talentManagement";

interface TalentReviewPanelProps {
  items: TalentReviewItem[];
  onChange: (items: TalentReviewItem[]) => void;
  onNotify: (message: string) => void;
}

const STATUS_META: Record<
  TalentReviewStatus,
  { label: string; variant: "warning" | "success" | "neutral" }
> = {
  pending: { label: "รอมติคณะกรรมการ", variant: "warning" },
  approved: { label: "อนุมัติมติแล้ว", variant: "success" },
  deferred: { label: "เลื่อนพิจารณา", variant: "neutral" },
};

export function TalentReviewPanel({ items, onChange, onNotify }: TalentReviewPanelProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | TalentReviewStatus>("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (!q) return true;
      return (
        item.code.toLowerCase().includes(q) ||
        item.employeeName.toLowerCase().includes(q) ||
        item.proposedAction.toLowerCase().includes(q) ||
        item.boxLabel.toLowerCase().includes(q)
      );
    });
  }, [items, search, statusFilter]);

  const handleApprove = (item: TalentReviewItem) => {
    onChange(
      items.map((row) => (row.id === item.id ? { ...row, status: "approved" } : row))
    );
    onNotify(`อนุมัติมติ Talent Review สำหรับ ${item.employeeName} เรียบร้อยแล้ว`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="ค้นหาพนักงาน, กลุ่ม 9-Box หรือข้อเสนอการพัฒนา..."
            className="w-full sm:w-80"
          />
          <Select
            aria-label="กรองตามสถานะมติ"
            value={statusFilter}
            onChange={(v) => setStatusFilter(v as "all" | TalentReviewStatus)}
            options={[
              { value: "all", label: "สถานะมติ: ทั้งหมด" },
              { value: "pending", label: "รอมติคณะกรรมการ" },
              { value: "approved", label: "อนุมัติมติแล้ว" },
              { value: "deferred", label: "เลื่อนพิจารณา" },
            ]}
            className="w-48"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="ไม่พบวาระทบทวน Talent Review"
          description="ลองปรับคำค้นหาหรือตัวกรองสถานะมติ"
        />
      ) : (
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[22%]">รหัส / พนักงาน</TableHead>
                <TableHead className="w-[15%] text-center">กลุ่ม 9-Box</TableHead>
                <TableHead className="w-[37%]">ข้อเสนอและบันทึกคณะกรรมการ</TableHead>
                <TableHead className="w-[14%] text-center">สถานะมติ</TableHead>
                <TableHead className="w-[12%] text-center">ดำเนินการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => {
                const sMeta = STATUS_META[item.status];
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <span className="inline-block rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                        {item.code}
                      </span>
                      <div className="mt-1 font-semibold text-[#1E293B]">{item.employeeName}</div>
                      <div className="text-xs text-[#64748B]">
                        {item.position} • {item.department}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Tooltip content={`ตำแหน่งปัจจุบันในตาราง 9-Box Grid ของ ${item.employeeName}`}>
                        <Badge variant="primary">{item.boxLabel}</Badge>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-[#1E293B]">{item.proposedAction}</div>
                      <div className="mt-1 text-xs text-[#64748B]">{item.committeeNote}</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Tooltip
                        content={
                          item.status === "approved"
                            ? "คณะกรรมการอนุมัติแผนดำเนินการเรียบร้อยแล้ว"
                            : item.status === "pending"
                              ? "รอคณะกรรมการบริหารบุคลากรพิจารณาอนุมัติมติ"
                              : "เลื่อนการพิจารณาไปยังรอบทบทวนถัดไป"
                        }
                      >
                        <Badge variant={sMeta.variant} dot>
                          {sMeta.label}
                        </Badge>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        {item.status === "pending" ? (
                          <Tooltip content="อนุมัติมติการพัฒนา/เลื่อนระดับจากคณะกรรมการ">
                            <Button
                              size="sm"
                              variant="primary"
                              leftIcon={<ThumbsUp className="h-3.5 w-3.5" />}
                              onClick={() => handleApprove(item)}
                              className="w-[104px] justify-center"
                            >
                              อนุมัติมติ
                            </Button>
                          </Tooltip>
                        ) : (
                          <span className="inline-flex w-[104px] items-center justify-center gap-1 text-xs font-medium text-emerald-600">
                            <CheckCircle2 className="h-3.5 w-3.5" /> อนุมัติแล้ว
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
