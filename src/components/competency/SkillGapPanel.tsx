"use client";

import { useMemo, useState } from "react";
import { ArrowRightCircle, CheckCircle2, FolderOpen, Sparkles } from "lucide-react";
import {
  Badge,
  Button,
  EmptyState,
  Pagination,
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
import type {
  GapActionStatus,
  GapPriority,
  SkillGapItem,
} from "@/data/mock/skillAnalytics";

interface SkillGapPanelProps {
  items: SkillGapItem[];
  onChange: (items: SkillGapItem[]) => void;
  onNotify: (message: string) => void;
}

const PAGE_SIZE = 5;

const PRIORITY_META: Record<GapPriority, { label: string; variant: "danger" | "warning" | "neutral" }> = {
  high: { label: "เร่งด่วน", variant: "danger" },
  medium: { label: "ปานกลาง", variant: "warning" },
  low: { label: "ทั่วไป", variant: "neutral" },
};

const STATUS_META: Record<GapActionStatus, { label: string; variant: "warning" | "primary" | "success" }> = {
  open: { label: "รอวางแผนพัฒนา", variant: "warning" },
  "in-idp": { label: "ส่งเข้า IDP แล้ว", variant: "primary" },
  closed: { label: "ปิด Gap แล้ว", variant: "success" },
};

export function SkillGapPanel({ items, onChange, onNotify }: SkillGapPanelProps) {
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<"all" | GapPriority>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | GapActionStatus>("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      if (priorityFilter !== "all" && item.priority !== priorityFilter) return false;
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (!q) return true;
      return (
        item.code.toLowerCase().includes(q) ||
        item.employeeName.toLowerCase().includes(q) ||
        item.skillName.toLowerCase().includes(q) ||
        item.recommendedCourse.toLowerCase().includes(q) ||
        item.department.toLowerCase().includes(q)
      );
    });
  }, [items, search, priorityFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleUpdateStatus = (item: SkillGapItem, nextStatus: GapActionStatus) => {
    onChange(
      items.map((row) => (row.id === item.id ? { ...row, status: nextStatus } : row))
    );
    if (nextStatus === "in-idp") {
      onNotify(`ส่งช่องว่างทักษะของ ${item.employeeName} เข้าแผนพัฒนา IDP เรียบร้อยแล้ว`);
    } else if (nextStatus === "closed") {
      onNotify(`ปิดช่องว่างทักษะ (${item.skillName}) ของ ${item.employeeName} เรียบร้อยแล้ว`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          <SearchBar
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="ค้นหาพนักงาน, ทักษะ หรือหลักสูตรแนะนำ..."
            className="w-full sm:w-72"
          />
          <Select
            aria-label="กรองตามความเร่งด่วน"
            value={priorityFilter}
            onChange={(v) => {
              setPriorityFilter(v as "all" | GapPriority);
              setPage(1);
            }}
            options={[
              { value: "all", label: "ความสำคัญ: ทั้งหมด" },
              { value: "high", label: "เร่งด่วน" },
              { value: "medium", label: "ปานกลาง" },
              { value: "low", label: "ทั่วไป" },
            ]}
            className="w-44"
          />
          <Select
            aria-label="กรองตามสถานะ"
            value={statusFilter}
            onChange={(v) => {
              setStatusFilter(v as "all" | GapActionStatus);
              setPage(1);
            }}
            options={[
              { value: "all", label: "สถานะ: ทั้งหมด" },
              { value: "open", label: "รอวางแผนพัฒนา" },
              { value: "in-idp", label: "ส่งเข้า IDP แล้ว" },
              { value: "closed", label: "ปิด Gap แล้ว" },
            ]}
            className="w-44"
          />
        </div>
      </div>

      {paged.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="ไม่พบรายการช่องว่างทักษะ (Skill Gap)"
          description="ลองปรับคำค้นหาหรือตัวกรองความสำคัญและสถานะ"
        />
      ) : (
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[22%]">รหัส / พนักงาน</TableHead>
                <TableHead className="w-[26%]">ทักษะที่มี Gap / หลักสูตรแนะนำ</TableHead>
                <TableHead className="w-[14%] text-center">เป้าหมาย → จริง</TableHead>
                <TableHead className="w-[10%] text-center">ความสำคัญ</TableHead>
                <TableHead className="w-[14%] text-center">สถานะ</TableHead>
                <TableHead className="w-[14%] text-center">ดำเนินการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map((item) => {
                const gap = item.actualLevel - item.targetLevel;
                const pMeta = PRIORITY_META[item.priority];
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
                    <TableCell>
                      <div className="font-semibold text-[#1E293B]">{item.skillName}</div>
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-[#2563EB]">
                        <Sparkles className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{item.recommendedCourse}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Tooltip content={`ยังขาดอีก ${Math.abs(gap)} ระดับเพื่อให้ผ่านเกณฑ์ตำแหน่ง`}>
                        <div className="inline-flex items-center gap-1.5 rounded-lg border border-rose-100 bg-rose-50/70 px-2.5 py-1 text-xs font-semibold">
                          <span className="text-[#64748B]">Lv.{item.targetLevel}</span>
                          <span className="text-[#CBD5E1]">→</span>
                          <span className="text-rose-600">Lv.{item.actualLevel}</span>
                          <span className="rounded bg-rose-100 px-1 text-[11px] font-bold text-rose-700">
                            {gap}
                          </span>
                        </div>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="text-center">
                      <Tooltip
                        content={
                          item.priority === "high"
                            ? "ความสำคัญระดับสูง — กระทบงานหลัก ควรส่งเข้าแผน IDP ทันที"
                            : item.priority === "medium"
                              ? "ความสำคัญปานกลาง — วางแผนพัฒนาในรอบถัดไป"
                              : "ความสำคัญทั่วไป — เสริมทักษะเพิ่มเติมตามโอกาส"
                        }
                      >
                        <Badge variant={pMeta.variant}>{pMeta.label}</Badge>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="text-center">
                      <Tooltip
                        content={
                          item.status === "open"
                            ? "ยังไม่ได้ส่งเข้าแผนพัฒนารายบุคคล (IDP)"
                            : item.status === "in-idp"
                              ? "ส่งเข้าแผน IDP แล้ว อยู่ระหว่างการอบรม/พัฒนา"
                              : "พนักงานพัฒนาทักษะผ่านเกณฑ์เป้าหมายแล้ว"
                        }
                      >
                        <Badge variant={sMeta.variant} dot>
                          {sMeta.label}
                        </Badge>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        {item.status === "open" ? (
                          <Tooltip content="เชื่อมโยงทักษะและหลักสูตรแนะนำไปยังแผน IDP ของพนักงาน">
                            <Button
                              size="sm"
                              variant="primary"
                              leftIcon={<ArrowRightCircle className="h-3.5 w-3.5" />}
                              onClick={() => handleUpdateStatus(item, "in-idp")}
                              className="w-[118px] justify-center"
                            >
                              ส่งเข้า IDP
                            </Button>
                          </Tooltip>
                        ) : item.status === "in-idp" ? (
                          <Tooltip content="ยืนยันว่าพนักงานพัฒนาทักษะผ่านเกณฑ์แล้ว">
                            <Button
                              size="sm"
                              variant="outline"
                              leftIcon={<CheckCircle2 className="h-3.5 w-3.5" />}
                              onClick={() => handleUpdateStatus(item, "closed")}
                              className="w-[118px] justify-center"
                            >
                              ปิด Gap
                            </Button>
                          </Tooltip>
                        ) : (
                          <span className="inline-flex w-[118px] items-center justify-center text-xs font-medium text-emerald-600">
                            ดำเนินการแล้ว
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

      {totalPages > 1 && (
        <Pagination
          currentPage={safePage}
          onPageChange={setPage}
          totalItems={filtered.length}
          pageSize={PAGE_SIZE}
        />
      )}
    </div>
  );
}
