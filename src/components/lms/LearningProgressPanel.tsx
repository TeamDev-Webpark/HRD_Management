"use client";

import { useMemo, useState } from "react";
import { Bell, FolderOpen } from "lucide-react";
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
  LearningProgressItem,
  LearningProgressStatus,
} from "@/data/mock/lmsAssessment";

interface LearningProgressPanelProps {
  items: LearningProgressItem[];
  onNotify: (message: string) => void;
}

const PAGE_SIZE = 5;

const PROGRESS_STATUS_META: Record<
  LearningProgressStatus,
  { label: string; variant: "success" | "primary" | "danger"; hint: string }
> = {
  completed: { label: "เรียนจบแล้ว", variant: "success", hint: "เรียนครบทุกบทและผ่านแบบทดสอบเรียบร้อยแล้ว" },
  "in-progress": { label: "กำลังเรียน", variant: "primary", hint: "อยู่ระหว่างเรียนบทเรียนตามกำหนดเวลา" },
  overdue: { label: "เกินกำหนด", variant: "danger", hint: "เลยกำหนดวันเรียนครบของหลักสูตรบังคับ ควรส่งแจ้งเตือน" },
};

export function LearningProgressPanel({ items, onNotify }: LearningProgressPanelProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | LearningProgressStatus>("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchStatus = statusFilter === "all" || item.status === statusFilter;
      const matchQuery =
        !q ||
        item.employeeName.toLowerCase().includes(q) ||
        item.employeeCode.toLowerCase().includes(q) ||
        item.department.toLowerCase().includes(q) ||
        item.courseTitle.toLowerCase().includes(q);
      return matchStatus && matchQuery;
    });
  }, [items, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <SearchBar
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="ค้นหาชื่อพนักงาน แผนก หรือคอร์ส..."
            containerClassName="w-full sm:w-64"
          />
          <Select
            value={statusFilter}
            onChange={(v) => {
              setStatusFilter(v as "all" | LearningProgressStatus);
              setPage(1);
            }}
            options={[
              { value: "all", label: "ทุกสถานะการเรียน" },
              { value: "completed", label: "เรียนจบแล้ว" },
              { value: "in-progress", label: "กำลังเรียน" },
              { value: "overdue", label: "เกินกำหนด" },
            ]}
            className="w-full sm:w-44"
          />
        </div>
      </div>

      {paged.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="ไม่พบข้อมูลความก้าวหน้าการเรียน"
          description="ลองปรับคำค้นหาหรือตัวกรองสถานะ"
        />
      ) : (
        <>
          <TableContainer className="rounded-xl border border-[#EEF2F6]">
            <Table>
              <TableHeader className="bg-[#F8FAFC]">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-5">รหัส / พนักงาน</TableHead>
                  <TableHead>หลักสูตรที่เรียน</TableHead>
                  <TableHead className="w-48 px-4">ความคืบหน้า</TableHead>
                  <TableHead className="w-28 text-center">คะแนนสอบ</TableHead>
                  <TableHead className="w-32 text-center">สถานะ</TableHead>
                  <TableHead className="w-28 pr-5 text-center">ติดตาม</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((item) => {
                  const st = PROGRESS_STATUS_META[item.status];
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="py-3.5 pl-5">
                        <span className="rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                          {item.employeeCode}
                        </span>
                        <p className="mt-1 font-semibold text-[#1E293B]">{item.employeeName}</p>
                        <p className="text-xs text-[#94A3B8]">{item.department}</p>
                      </TableCell>
                      <TableCell className="py-3.5">
                        <p className="font-medium text-[#1E293B]">{item.courseTitle}</p>
                        <p className="text-xs text-[#94A3B8]">เข้าเรียนล่าสุด: {item.lastActive}</p>
                      </TableCell>
                      <TableCell className="py-3.5 px-4">
                        <Tooltip
                          className="block w-full"
                          content={`เรียนจบแล้ว ${item.completedLessons} จาก ${item.totalLessons} บทเรียน (${item.progressPct}%)`}
                        >
                          <div className="w-full cursor-help space-y-1.5">
                            <div className="flex items-center justify-between gap-2 text-xs tabular-nums">
                              <span className="text-[#64748B]">
                                {item.completedLessons}/{item.totalLessons} บท
                              </span>
                              <span className="font-semibold text-[#1E293B]">{item.progressPct}%</span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-[#EEF2F6]">
                              <div
                                className={`h-full rounded-full ${
                                  item.status === "overdue"
                                    ? "bg-[#EF4444]"
                                    : item.progressPct >= 100
                                      ? "bg-[#22B89A]"
                                      : "bg-[#2563EB]"
                                }`}
                                style={{ width: `${item.progressPct}%` }}
                              />
                            </div>
                          </div>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="py-3.5 text-center tabular-nums">
                        {item.examScore !== null ? (
                          <span className="font-semibold text-[#1CA388]">{item.examScore}%</span>
                        ) : (
                          <span className="text-xs text-[#94A3B8]">รอสอบ</span>
                        )}
                      </TableCell>
                      <TableCell className="py-3.5 text-center">
                        <Tooltip title={`สถานะ: ${st.label}`} content={st.hint}>
                          <Badge variant={st.variant} dot className="cursor-help">
                            {st.label}
                          </Badge>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="py-3.5 pr-5 text-center">
                        {item.status !== "completed" ? (
                          <Tooltip content="ส่งข้อความแจ้งเตือนให้พนักงานกลับมาเรียนต่อ">
                            <Button
                              size="sm"
                              variant="outline"
                              leftIcon={<Bell className="h-3.5 w-3.5 text-[#2563EB]" />}
                              onClick={() =>
                                onNotify(`ส่งแจ้งเตือนติดตามการเรียนให้ "${item.employeeName}" แล้ว`)
                              }
                            >
                              เตือนเรียน
                            </Button>
                          </Tooltip>
                        ) : (
                          <span className="text-xs text-[#94A3B8]">ครบถ้วน</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <Pagination
            currentPage={currentPage}
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
