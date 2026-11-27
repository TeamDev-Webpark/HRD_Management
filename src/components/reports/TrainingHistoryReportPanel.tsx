"use client";

import { useMemo, useState } from "react";
import { Download, FolderOpen } from "lucide-react";
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
import {
  downloadCsv,
  type HoursComplianceStatus,
  type TrainingHistoryReportRow,
} from "@/data/mock/hrdReportsPart1";

interface TrainingHistoryReportPanelProps {
  rows: TrainingHistoryReportRow[];
  onNotify: (message: string) => void;
}

const STATUS_META: Record<
  HoursComplianceStatus,
  { label: string; variant: "success" | "primary" | "danger" }
> = {
  met: { label: "ครบเกณฑ์ชั่วโมง", variant: "success" },
  "in-progress": { label: "กำลังสะสม", variant: "primary" },
  behind: { label: "ต่ำกว่าเกณฑ์", variant: "danger" },
};

export function TrainingHistoryReportPanel({
  rows,
  onNotify,
}: TrainingHistoryReportPanelProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | HoursComplianceStatus>("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!q) return true;
      return (
        r.employeeCode.toLowerCase().includes(q) ||
        r.employeeName.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q) ||
        r.lastCourse.toLowerCase().includes(q)
      );
    });
  }, [rows, search, statusFilter]);

  const handleExport = () => {
    downloadCsv(
      "hrd-training-history-2569.csv",
      ["รหัสพนักงาน", "ชื่อพนักงาน", "แผนก", "จำนวนหลักสูตร", "ชั่วโมงสะสม", "เป้าหมาย (ชม.)", "หลักสูตรล่าสุด", "วันที่อบรมล่าสุด"],
      filtered.map((r) => [
        r.employeeCode,
        r.employeeName,
        r.department,
        r.totalCourses,
        r.totalHours,
        r.targetHours,
        r.lastCourse,
        r.lastAttendedDate,
      ])
    );
    onNotify("ส่งออกรายงานประวัติการอบรมรายบุคคล (CSV) เรียบร้อยแล้ว");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="ค้นหาชื่อพนักงาน, รหัส, แผนก หรือหลักสูตรล่าสุด..."
            className="w-full sm:w-80"
          />
          <Select
            aria-label="กรองตามสถานะชั่วโมงอบรม"
            value={statusFilter}
            onChange={(v) => setStatusFilter(v as "all" | HoursComplianceStatus)}
            options={[
              { value: "all", label: "สถานะชั่วโมง: ทั้งหมด" },
              { value: "met", label: "ครบเกณฑ์ชั่วโมง" },
              { value: "in-progress", label: "กำลังสะสม" },
              { value: "behind", label: "ต่ำกว่าเกณฑ์" },
            ]}
            className="w-48"
          />
        </div>
        <Tooltip content="ดาวน์โหลดรายงานประวัติการอบรมรายบุคคลเป็นไฟล์ CSV">
          <Button
            variant="outline"
            leftIcon={<Download className="h-4 w-4" />}
            onClick={handleExport}
          >
            ส่งออก CSV
          </Button>
        </Tooltip>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="ไม่พบประวัติการอบรม"
          description="ลองปรับคำค้นหาหรือตัวกรองสถานะชั่วโมงอบรม"
        />
      ) : (
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[24%]">รหัส / พนักงาน</TableHead>
                <TableHead className="w-[11%] text-center">หลักสูตร</TableHead>
                <TableHead className="w-[21%]">ชั่วโมงอบรมสะสม vs เป้าหมาย</TableHead>
                <TableHead className="w-[30%]">หลักสูตรล่าสุดที่เข้าอบรม</TableHead>
                <TableHead className="w-[14%] text-center">สถานะ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((row) => {
                const pct = Math.min(100, Math.round((row.totalHours / row.targetHours) * 100));
                const sMeta = STATUS_META[row.status];
                return (
                  <TableRow key={row.id}>
                    <TableCell>
                      <span className="inline-block rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                        {row.employeeCode}
                      </span>
                      <div className="mt-1 font-semibold text-[#1E293B]">{row.employeeName}</div>
                      <div className="text-xs text-[#64748B]">
                        {row.position} • {row.department}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="neutral">{row.totalCourses} คอร์ส</Badge>
                    </TableCell>
                    <TableCell>
                      <Tooltip
                        className="block w-full"
                        content={`สะสมแล้ว ${row.totalHours} ชั่วโมง จากเป้าหมายประจำปี ${row.targetHours} ชั่วโมง`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-[#1E293B]">
                              {row.totalHours} / {row.targetHours} ชม.
                            </span>
                            <span className="text-[#64748B]">{pct}%</span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-[#EEF2F6]">
                            <div
                              className={`h-full rounded-full ${
                                row.status === "met"
                                  ? "bg-emerald-500"
                                  : row.status === "behind"
                                    ? "bg-rose-500"
                                    : "bg-[#2563EB]"
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-[#1E293B]">{row.lastCourse}</div>
                      <div className="text-xs text-[#94A3B8]">อบรมล่าสุด {row.lastAttendedDate}</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Tooltip
                        content={
                          row.status === "met"
                            ? "สะสมชั่วโมงอบรมครบตามเกณฑ์นโยบายประจำปีแล้ว"
                            : row.status === "in-progress"
                              ? `ยังขาดอีก ${Math.max(0, row.targetHours - row.totalHours)} ชั่วโมงเพื่อให้ครบเกณฑ์`
                              : `ชั่วโมงอบรมต่ำกว่าเกณฑ์มาก (ขาดอีก ${Math.max(0, row.targetHours - row.totalHours)} ชม.) ควรเร่งลงทะเบียน`
                        }
                      >
                        <Badge variant={sMeta.variant} dot>
                          {sMeta.label}
                        </Badge>
                      </Tooltip>
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
