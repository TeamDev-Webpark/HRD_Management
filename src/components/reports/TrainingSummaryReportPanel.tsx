"use client";

import { useMemo, useState } from "react";
import { Download, FolderOpen, Star } from "lucide-react";
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
  type TrainingSummaryReportRow,
} from "@/data/mock/hrdReportsPart1";

interface TrainingSummaryReportPanelProps {
  rows: TrainingSummaryReportRow[];
  onNotify: (message: string) => void;
}

export function TrainingSummaryReportPanel({
  rows,
  onNotify,
}: TrainingSummaryReportPanelProps) {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (catFilter !== "all" && r.category !== catFilter) return false;
      if (!q) return true;
      return (
        r.courseCode.toLowerCase().includes(q) ||
        r.courseName.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
      );
    });
  }, [rows, search, catFilter]);

  const handleExport = () => {
    downloadCsv(
      "hrd-training-summary-2569.csv",
      ["รหัสหลักสูตร", "ชื่อหลักสูตร", "หมวดหมู่", "จำนวนรุ่น", "ลงทะเบียน", "เรียนจบ", "อัตราผ่าน (%)", "ความพึงพอใจ"],
      filtered.map((r) => [
        r.courseCode,
        r.courseName,
        r.category,
        r.sessionsCount,
        r.enrolled,
        r.completed,
        r.passRate,
        r.avgSatisfaction.toFixed(1),
      ])
    );
    onNotify("ส่งออกรายงานสรุปการฝึกอบรม (CSV) เรียบร้อยแล้ว");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="ค้นหารหัสหลักสูตร หรือชื่อหลักสูตร..."
            className="w-full sm:w-80"
          />
          <Select
            aria-label="กรองตามหมวดหลักสูตร"
            value={catFilter}
            onChange={setCatFilter}
            options={[
              { value: "all", label: "หมวดหมู่: ทั้งหมด" },
              { value: "Leadership", label: "Leadership" },
              { value: "Digital & AI", label: "Digital & AI" },
              { value: "Technical", label: "Technical" },
              { value: "Soft Skills", label: "Soft Skills" },
            ]}
            className="w-44"
          />
        </div>
        <Tooltip content="ดาวน์โหลดรายงานสรุปการฝึกอบรมเป็นไฟล์ CSV">
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
          title="ไม่พบข้อมูลรายงานการฝึกอบรม"
          description="ลองปรับคำค้นหาหรือเปลี่ยนหมวดหมู่หลักสูตร"
        />
      ) : (
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[32%]">รหัส / ชื่อหลักสูตร</TableHead>
                <TableHead className="w-[14%] text-center">หมวดหมู่</TableHead>
                <TableHead className="w-[10%] text-center">จำนวนรุ่น</TableHead>
                <TableHead className="w-[18%]">ผู้เรียนจบ / ลงทะเบียน</TableHead>
                <TableHead className="w-[13%] text-center">อัตราผ่าน</TableHead>
                <TableHead className="w-[13%] text-center">ความพึงพอใจ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((row) => {
                const completionPct = Math.round((row.completed / row.enrolled) * 100);
                return (
                  <TableRow key={row.id}>
                    <TableCell>
                      <span className="inline-block rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                        {row.courseCode}
                      </span>
                      <div className="mt-1 font-semibold text-[#1E293B]">{row.courseName}</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="primary">{row.category}</Badge>
                    </TableCell>
                    <TableCell className="text-center font-semibold text-[#334155]">
                      {row.sessionsCount} รุ่น
                    </TableCell>
                    <TableCell>
                      <Tooltip
                        className="block w-full"
                        content={`เรียนจบ ${row.completed} จากผู้ลงทะเบียน ${row.enrolled} คน (${completionPct}%)`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#64748B]">
                              {row.completed}/{row.enrolled} คน
                            </span>
                            <span className="font-semibold text-[#1E293B]">{completionPct}%</span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-[#EEF2F6]">
                            <div
                              className="h-full rounded-full bg-[#2563EB]"
                              style={{ width: `${completionPct}%` }}
                            />
                          </div>
                        </div>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="text-center">
                      <Tooltip
                        content={
                          row.passRate >= 90
                            ? "อัตราผ่านเกณฑ์ดีเยี่ยม (≥ 90%)"
                            : "อัตราผ่านเกณฑ์ต่ำกว่า 90% ควรทบทวนเนื้อหาหรือแบบทดสอบ"
                        }
                      >
                        <Badge variant={row.passRate >= 90 ? "success" : "warning"}>
                          {row.passRate}%
                        </Badge>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="text-center">
                      <Tooltip content={`คะแนนความพึงพอใจเฉลี่ย ${row.avgSatisfaction.toFixed(1)} จากเต็ม 5.0`}>
                        <span className="inline-flex cursor-help items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          {row.avgSatisfaction.toFixed(1)}
                          <span className="font-normal text-amber-600/70">/5.0</span>
                        </span>
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
