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
import type { TalentSuccessionReportRow } from "@/data/mock/hrdReportsPart2";

interface TalentSuccessionReportPanelProps {
  rows: TalentSuccessionReportRow[];
  onNotify: (message: string) => void;
}

export function TalentSuccessionReportPanel({
  rows,
  onNotify,
}: TalentSuccessionReportPanelProps) {
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
      "hrd-talent-succession-report-2569.csv",
      ["รหัสแผนก", "แผนก", "Talent Pool", "กลุ่ม HiPo", "ตำแหน่งสำคัญ", "มีผู้สืบทอดครบ", "พร้อมรับตำแหน่งทันที", "เสี่ยงลาออกสูง"],
      filtered.map((r) => [
        r.deptCode,
        r.department,
        r.talentCount,
        r.hipoCount,
        r.keyPositions,
        r.coveredPositions,
        r.readyNowSuccessors,
        r.highFlightRisk,
      ])
    );
    onNotify("ส่งออกรายงาน Talent & Succession (CSV) เรียบร้อยแล้ว");
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
        <Tooltip content="ดาวน์โหลดรายงาน Talent & Succession Coverage เป็นไฟล์ CSV">
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
          title="ไม่พบข้อมูลรายงาน Talent & Succession"
          description="ลองปรับคำค้นหาใหม่"
        />
      ) : (
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[24%]">รหัส / แผนก</TableHead>
                <TableHead className="w-[14%] text-center">
                  <Tooltip
                    title="Talent Pool / HiPo"
                    content="จำนวนบุคลากรใน Talent Pool ทั้งหมดของแผนก และกลุ่ม HiPo (High Potential — ศักยภาพและผลงานสูงสุด)"
                  >
                    <span className="cursor-help border-b border-dashed border-[#CBD5E1]">
                      Talent / HiPo
                    </span>
                  </Tooltip>
                </TableHead>
                <TableHead className="w-[22%]">ความครอบคลุมตำแหน่งสำคัญ</TableHead>
                <TableHead className="w-[14%] text-center">พร้อมทันที</TableHead>
                <TableHead className="w-[14%] text-center">เสี่ยงลาออกสูง</TableHead>
                <TableHead className="w-[12%] text-center">สถานะภาพรวม</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((row) => {
                const covPct = Math.round((row.coveredPositions / row.keyPositions) * 100);
                return (
                  <TableRow key={row.id}>
                    <TableCell>
                      <span className="inline-block rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                        {row.deptCode}
                      </span>
                      <div className="mt-1 font-semibold text-[#1E293B]">{row.department}</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Tooltip
                        title={`Talent Pool ${row.talentCount} คน`}
                        content={`ในจำนวนนี้เป็นกลุ่ม HiPo (High Potential ระดับสูงสุด) จำนวน ${row.hipoCount} คน (${Math.round((row.hipoCount / row.talentCount) * 100)}%)`}
                      >
                        <div className="inline-block cursor-help">
                          <div className="font-semibold text-[#1E293B]">{row.talentCount} คน</div>
                          <div className="text-xs text-[#2563EB]">HiPo {row.hipoCount} คน</div>
                        </div>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Tooltip
                        className="block w-full"
                        content={`มีผู้สืบทอดครบ ${row.coveredPositions} จาก ${row.keyPositions} ตำแหน่งสำคัญ (${covPct}%)`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#64748B]">
                              {row.coveredPositions}/{row.keyPositions} ตำแหน่ง
                            </span>
                            <span className="font-semibold text-[#1E293B]">{covPct}%</span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-[#EEF2F6]">
                            <div
                              className={`h-full rounded-full ${
                                covPct === 100
                                  ? "bg-emerald-500"
                                  : covPct >= 75
                                    ? "bg-[#2563EB]"
                                    : "bg-amber-500"
                              }`}
                              style={{ width: `${covPct}%` }}
                            />
                          </div>
                        </div>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="text-center">
                      <Tooltip content="จำนวนผู้สืบทอดที่มีความพร้อมระดับ Ready Now (รับตำแหน่งได้ทันที)">
                        <Badge variant="success">{row.readyNowSuccessors} คน</Badge>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="text-center">
                      <Tooltip
                        content={
                          row.highFlightRisk >= 2
                            ? "มีกลุ่ม Talent เสี่ยงลาออกสูงหลายราย ควรเร่งวางแผน Retention"
                            : "ระดับความเสี่ยงการลาออกอยู่ในเกณฑ์ที่ควบคุมได้"
                        }
                      >
                        <Badge variant={row.highFlightRisk >= 2 ? "danger" : "neutral"}>
                          {row.highFlightRisk} คน
                        </Badge>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="text-center">
                      <Tooltip
                        content={
                          covPct >= 80
                            ? "ความครอบคลุมผู้สืบทอดตำแหน่งสำคัญ ≥ 80% อยู่ในเกณฑ์แข็งแกร่ง"
                            : "ความครอบคลุมผู้สืบทอดต่ำกว่า 80% ควรพัฒนาหรือสรรหาผู้สืบทอดเพิ่ม"
                        }
                      >
                        <Badge variant={covPct >= 80 ? "success" : "warning"} dot>
                          {covPct >= 80 ? "แข็งแกร่ง" : "ต้องเสริม"}
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
