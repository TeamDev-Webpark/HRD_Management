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
import { downloadCsv } from "@/data/mock/hrdReportsPart1";
import type { SkillGapReportRow } from "@/data/mock/hrdReportsPart2";

interface SkillGapReportPanelProps {
  rows: SkillGapReportRow[];
  onNotify: (message: string) => void;
}

export function SkillGapReportPanel({ rows, onNotify }: SkillGapReportPanelProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.deptCode.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q) ||
        r.topGapSkill.toLowerCase().includes(q)
    );
  }, [rows, search]);

  const handleExport = () => {
    downloadCsv(
      "hrd-skill-gap-report-2569.csv",
      ["รหัสแผนก", "แผนก", "พนักงานที่ประเมิน", "Gap ทั้งหมด", "Gap เร่งด่วน", "ปิด Gap แล้ว", "ทักษะที่ขาดมากที่สุด"],
      filtered.map((r) => [
        r.deptCode,
        r.department,
        r.assessedEmployees,
        r.totalGaps,
        r.criticalGaps,
        r.closedGaps,
        r.topGapSkill,
      ])
    );
    onNotify("ส่งออกรายงานช่องว่างทักษะ (CSV) เรียบร้อยแล้ว");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="ค้นหาแผนก หรือทักษะที่มี Gap สูงสุด..."
          className="w-full sm:w-80"
        />
        <Tooltip content="ดาวน์โหลดรายงานสรุป Skill Gap เป็นไฟล์ CSV">
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
          title="ไม่พบข้อมูลรายงานช่องว่างทักษะ"
          description="ลองปรับคำค้นหาใหม่"
        />
      ) : (
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[24%]">รหัส / แผนก</TableHead>
                <TableHead className="w-[24%]">ทักษะที่พบ Gap สูงสุด</TableHead>
                <TableHead className="w-[12%] text-center">Gap ทั้งหมด</TableHead>
                <TableHead className="w-[12%] text-center">Gap เร่งด่วน</TableHead>
                <TableHead className="w-[28%]">อัตราการปิดช่องว่างทักษะ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((row) => {
                const closePct = Math.round((row.closedGaps / row.totalGaps) * 100);
                return (
                  <TableRow key={row.id}>
                    <TableCell>
                      <span className="inline-block rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                        {row.deptCode}
                      </span>
                      <div className="mt-1 font-semibold text-[#1E293B]">{row.department}</div>
                      <div className="text-xs text-[#64748B]">ประเมินแล้ว {row.assessedEmployees} คน</div>
                    </TableCell>
                    <TableCell className="font-medium text-[#1E293B]">
                      {row.topGapSkill}
                    </TableCell>
                    <TableCell className="text-center font-semibold text-[#334155]">
                      {row.totalGaps} รายการ
                    </TableCell>
                    <TableCell className="text-center">
                      <Tooltip content="ช่องว่างทักษะระดับวิกฤตที่กระทบงานหลักโดยตรง ควรเร่งปิด Gap ก่อน">
                        <Badge variant={row.criticalGaps >= 8 ? "danger" : "warning"}>
                          {row.criticalGaps} รายการ
                        </Badge>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip
                        className="block w-full"
                        content={`ปิดช่องว่างทักษะแล้ว ${row.closedGaps} จาก ${row.totalGaps} รายการ (${closePct}%)`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#64748B]">
                              ปิดแล้ว {row.closedGaps}/{row.totalGaps}
                            </span>
                            <span className="font-semibold text-[#1E293B]">{closePct}%</span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-[#EEF2F6]">
                            <div
                              className={`h-full rounded-full ${
                                closePct >= 70 ? "bg-emerald-500" : "bg-[#2563EB]"
                              }`}
                              style={{ width: `${closePct}%` }}
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
