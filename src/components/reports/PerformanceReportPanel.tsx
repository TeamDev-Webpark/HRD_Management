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
  type PerformanceReportRow,
} from "@/data/mock/hrdReportsPart1";

interface PerformanceReportPanelProps {
  rows: PerformanceReportRow[];
  onNotify: (message: string) => void;
}

export function PerformanceReportPanel({ rows, onNotify }: PerformanceReportPanelProps) {
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
      "hrd-performance-report-2569.csv",
      ["รหัสแผนก", "แผนก", "พนักงานทั้งหมด", "ประเมินแล้ว", "คะแนนเฉลี่ย", "เกรด A", "เกรด B", "เกรด C", "เข้าแผน PIP"],
      filtered.map((r) => [
        r.deptCode,
        r.department,
        r.headcount,
        r.evaluatedCount,
        r.avgScore.toFixed(2),
        r.gradeA,
        r.gradeB,
        r.gradeC,
        r.pipCount,
      ])
    );
    onNotify("ส่งออกรายงานผลประเมินผลงาน (CSV) เรียบร้อยแล้ว");
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
        <Tooltip content="ดาวน์โหลดตารางสรุปผลประเมินเป็นไฟล์ CSV (เปิดด้วย Excel ภาษาไทยได้ทันที)">
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
          title="ไม่พบข้อมูลรายงานผลประเมิน"
          description="ลองปรับคำค้นหาใหม่"
        />
      ) : (
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[26%]">รหัส / แผนก</TableHead>
                <TableHead className="w-[18%]">ความครบถ้วนการประเมิน</TableHead>
                <TableHead className="w-[12%] text-center">คะแนนเฉลี่ย (เต็ม 5.0)</TableHead>
                <TableHead className="w-[11%] text-center">เกรด A</TableHead>
                <TableHead className="w-[11%] text-center">เกรด B</TableHead>
                <TableHead className="w-[11%] text-center">เกรด C</TableHead>
                <TableHead className="w-[11%] text-center">เข้า PIP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((row) => {
                const rate = Math.round((row.evaluatedCount / row.headcount) * 100);
                return (
                  <TableRow key={row.id}>
                    <TableCell>
                      <span className="inline-block rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                        {row.deptCode}
                      </span>
                      <div className="mt-1 font-semibold text-[#1E293B]">{row.department}</div>
                      <div className="text-xs text-[#64748B]">{row.cycle}</div>
                    </TableCell>
                    <TableCell>
                      <Tooltip
                        className="block w-full"
                        content={`ประเมินแล้ว ${row.evaluatedCount} จาก ${row.headcount} คน (${rate}%)`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#64748B]">
                              {row.evaluatedCount}/{row.headcount} คน
                            </span>
                            <span className="font-semibold text-[#1E293B]">{rate}%</span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-[#EEF2F6]">
                            <div
                              className={`h-full rounded-full ${
                                rate === 100 ? "bg-emerald-500" : "bg-[#2563EB]"
                              }`}
                              style={{ width: `${rate}%` }}
                            />
                          </div>
                        </div>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-sm font-bold text-[#2563EB]">
                        {row.avgScore.toFixed(2)}
                      </span>
                      <span className="text-xs font-normal text-[#94A3B8]"> / 5.0</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Tooltip content={`พนักงานเกรด A (ผลงานยอดเยี่ยม) คิดเป็น ${Math.round((row.gradeA / row.evaluatedCount) * 100)}% ของผู้ประเมิน`}>
                        <Badge variant="success">{row.gradeA} คน</Badge>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="text-center">
                      <Tooltip content={`พนักงานเกรด B (ผลงานดีตามมาตรฐาน) คิดเป็น ${Math.round((row.gradeB / row.evaluatedCount) * 100)}% ของผู้ประเมิน`}>
                        <Badge variant="primary">{row.gradeB} คน</Badge>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="text-center">
                      <Tooltip content={`พนักงานเกรด C (ต้องพัฒนาเพิ่มเติม) คิดเป็น ${Math.round((row.gradeC / row.evaluatedCount) * 100)}% ของผู้ประเมิน`}>
                        <Badge variant="neutral">{row.gradeC} คน</Badge>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="text-center">
                      <Tooltip
                        content={
                          row.pipCount > 0
                            ? `มีพนักงานเข้าแผนปรับปรุงผลงาน (PIP) จำนวน ${row.pipCount} คน`
                            : "ไม่มีพนักงานที่ต้องเข้าแผน PIP ในรอบนี้"
                        }
                      >
                        <Badge variant={row.pipCount > 0 ? "danger" : "neutral"}>
                          {row.pipCount} คน
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
