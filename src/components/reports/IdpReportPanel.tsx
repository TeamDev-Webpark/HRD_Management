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
import type { IdpReportRow } from "@/data/mock/hrdReportsPart2";

interface IdpReportPanelProps {
  rows: IdpReportRow[];
  onNotify: (message: string) => void;
}

export function IdpReportPanel({ rows, onNotify }: IdpReportPanelProps) {
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
      "hrd-idp-report-2569.csv",
      ["รหัสแผนก", "แผนก", "แผน IDP ทั้งหมด", "กำลังดำเนินการ", "สำเร็จแล้ว", "ความคืบหน้าเฉลี่ย (%)", "อัตราบรรลุเป้าหมาย (%)"],
      filtered.map((r) => [
        r.deptCode,
        r.department,
        r.totalPlans,
        r.inProgressPlans,
        r.completedPlans,
        r.avgProgress,
        r.achievedRate,
      ])
    );
    onNotify("ส่งออกรายงานความคืบหน้า IDP (CSV) เรียบร้อยแล้ว");
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
        <Tooltip content="ดาวน์โหลดรายงานความคืบหน้า IDP เป็นไฟล์ CSV">
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
          title="ไม่พบข้อมูลรายงาน IDP"
          description="ลองปรับคำค้นหาใหม่"
        />
      ) : (
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[26%]">รหัส / แผนก</TableHead>
                <TableHead className="w-[12%] text-center">แผนทั้งหมด</TableHead>
                <TableHead className="w-[14%] text-center">กำลังพัฒนา</TableHead>
                <TableHead className="w-[14%] text-center">สำเร็จแล้ว</TableHead>
                <TableHead className="w-[20%]">ความคืบหน้าเฉลี่ย</TableHead>
                <TableHead className="w-[14%] text-center">บรรลุเป้าหมาย</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <span className="inline-block rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                      {row.deptCode}
                    </span>
                    <div className="mt-1 font-semibold text-[#1E293B]">{row.department}</div>
                  </TableCell>
                  <TableCell className="text-center font-semibold text-[#1E293B]">
                    {row.totalPlans} แผน
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="primary">{row.inProgressPlans} แผน</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="success">{row.completedPlans} แผน</Badge>
                  </TableCell>
                  <TableCell>
                    <Tooltip
                      className="block w-full"
                      content={`ความคืบหน้าเฉลี่ยของแผน IDP ในแผนกอยู่ที่ ${row.avgProgress}%`}
                    >
                      <div className="space-y-1.5">
                        <div className="text-right text-xs font-semibold text-[#1E293B]">
                          {row.avgProgress}%
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-[#EEF2F6]">
                          <div
                            className={`h-full rounded-full ${
                              row.avgProgress >= 85 ? "bg-emerald-500" : "bg-[#2563EB]"
                            }`}
                            style={{ width: `${row.avgProgress}%` }}
                          />
                        </div>
                      </div>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="text-center">
                    <Tooltip
                      content={
                        row.achievedRate >= 85
                          ? "บรรลุเป้าหมายการพัฒนาเกินเกณฑ์มาตรฐานองค์กร (≥ 85%)"
                          : "ต่ำกว่าเกณฑ์เป้าหมาย 85% ควรติดตามการโค้ชชิ่งเพิ่มเติม"
                      }
                    >
                      <Badge variant={row.achievedRate >= 85 ? "success" : "warning"}>
                        {row.achievedRate}%
                      </Badge>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
