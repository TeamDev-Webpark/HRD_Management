"use client";

import { useMemo, useState } from "react";
import { Download, FolderOpen } from "lucide-react";
import {
  Badge,
  Button,
  EmptyState,
  SearchBar,
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
  type TrainingBudgetReportRow,
} from "@/data/mock/hrdReportsPart1";

interface TrainingBudgetReportPanelProps {
  rows: TrainingBudgetReportRow[];
  onNotify: (message: string) => void;
}

const fmtBaht = (n: number) => `฿${n.toLocaleString("th-TH")}`;

export function TrainingBudgetReportPanel({
  rows,
  onNotify,
}: TrainingBudgetReportPanelProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.deptCode.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q)
    );
  }, [rows, search]);

  const handleExport = () => {
    downloadCsv(
      "hrd-training-budget-2569.csv",
      ["รหัสแผนก", "แผนก", "งบจัดสรร (บาท)", "ใช้จ่ายจริง (บาท)", "จองงบไว้รอจัดอบรม (บาท)", "งบคงเหลือ (บาท)", "อัตราเบิกจ่าย (%)"],
      filtered.map((r) => {
        const remaining = r.allocated - r.spent - r.reserved;
        const util = Math.round(((r.spent + r.reserved) / r.allocated) * 100);
        return [r.deptCode, r.department, r.allocated, r.spent, r.reserved, remaining, util];
      })
    );
    onNotify("ส่งออกรายงานงบประมาณฝึกอบรม (CSV) เรียบร้อยแล้ว");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="ค้นหาชื่อแผนก หรือรหัสแผนก..."
          className="w-full sm:w-80"
        />
        <Tooltip content="ดาวน์โหลดรายงานการใช้งบประมาณฝึกอบรมเป็นไฟล์ CSV">
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
          title="ไม่พบข้อมูลรายงานงบประมาณ"
          description="ลองปรับคำค้นหาใหม่"
        />
      ) : (
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[24%]">รหัส / แผนก</TableHead>
                <TableHead className="w-[14%] text-right">งบจัดสรร</TableHead>
                <TableHead className="w-[14%] text-right">ใช้จ่ายจริง</TableHead>
                <TableHead className="w-[16%] text-right">
                  <Tooltip
                    title="จองงบไว้รอจัดอบรม"
                    content="งบประมาณที่อนุมัติแผน/รุ่นอบรมแล้วและกันวงเงินไว้รอเบิกจ่ายจริง"
                  >
                    <span className="cursor-help border-b border-dashed border-[#CBD5E1]">
                      จองงบไว้รอจัดอบรม
                    </span>
                  </Tooltip>
                </TableHead>
                <TableHead className="w-[14%] text-right">คงเหลือ</TableHead>
                <TableHead className="w-[18%]">อัตราการใช้งบ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((row) => {
                const remaining = row.allocated - row.spent - row.reserved;
                const utilPct = Math.round(((row.spent + row.reserved) / row.allocated) * 100);
                const perHead = Math.round(row.spent / row.headcount);
                return (
                  <TableRow key={row.id}>
                    <TableCell>
                      <span className="inline-block rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                        {row.deptCode}
                      </span>
                      <div className="mt-1 font-semibold text-[#1E293B]">{row.department}</div>
                      <div className="text-xs text-[#64748B]">
                        เฉลี่ย {fmtBaht(perHead)}/คน ({row.headcount} คน)
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-[#1E293B]">
                      {fmtBaht(row.allocated)}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-[#2563EB]">
                      {fmtBaht(row.spent)}
                    </TableCell>
                    <TableCell className="text-right font-medium text-amber-700">
                      {fmtBaht(row.reserved)}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-emerald-700">
                      {fmtBaht(remaining)}
                    </TableCell>
                    <TableCell>
                      <Tooltip
                        className="block w-full"
                        content={`ใช้จ่ายจริง + จองงบไว้รอจัดอบรม คิดเป็น ${utilPct}% ของงบจัดสรร`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <Badge variant={utilPct >= 90 ? "warning" : "primary"}>
                              {utilPct}%
                            </Badge>
                            <span className="text-[11px] text-[#94A3B8]">
                              เหลือ {100 - utilPct}%
                            </span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-[#EEF2F6]">
                            <div
                              className={`h-full rounded-full ${
                                utilPct >= 90 ? "bg-amber-500" : "bg-[#2563EB]"
                              }`}
                              style={{ width: `${Math.min(100, utilPct)}%` }}
                            />
                          </div>
                        </div>
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
