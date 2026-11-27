"use client";

import { useMemo, useState } from "react";
import { FolderOpen, Lock, SlidersHorizontal } from "lucide-react";
import {
  Badge,
  Button,
  EmptyState,
  Input,
  Modal,
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
import type { CalibrationItem, FinalGrade } from "@/data/mock/pmsReview";

interface CalibrationRatingPanelProps {
  items: CalibrationItem[];
  onChange: (items: CalibrationItem[]) => void;
  onNotify: (message: string) => void;
}

const GRADE_STYLE: Record<FinalGrade, string> = {
  A: "bg-[#22B89A] text-white",
  "B+": "bg-[#2563EB] text-white",
  B: "bg-[#8B7CF6] text-white",
  C: "bg-[#F5B73B] text-white",
  PIP: "bg-[#EF4444] text-white",
};

export function CalibrationRatingPanel({
  items,
  onChange,
  onNotify,
}: CalibrationRatingPanelProps) {
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState<"all" | FinalGrade>("all");

  const [editing, setEditing] = useState<CalibrationItem | null>(null);
  const [draftGrade, setDraftGrade] = useState<FinalGrade>("B+");
  const [draftNote, setDraftNote] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchGrade = gradeFilter === "all" || item.finalGrade === gradeFilter;
      const matchQuery =
        !q ||
        item.employeeName.toLowerCase().includes(q) ||
        item.employeeCode.toLowerCase().includes(q) ||
        item.department.toLowerCase().includes(q);
      return matchGrade && matchQuery;
    });
  }, [items, search, gradeFilter]);

  const gradeDistribution = useMemo(() => {
    const grades: FinalGrade[] = ["A", "B+", "B", "C", "PIP"];
    return grades.map((g) => ({
      grade: g,
      count: items.filter((i) => i.finalGrade === g).length,
    }));
  }, [items]);

  const openCalibrate = (item: CalibrationItem) => {
    setEditing(item);
    setDraftGrade(item.finalGrade);
    setDraftNote(item.calibrationNote);
  };

  const handleSaveCalibration = () => {
    if (!editing) return;
    onChange(
      items.map((item) =>
        item.id === editing.id
          ? {
              ...item,
              finalGrade: draftGrade,
              calibrationNote: draftNote.trim() || item.calibrationNote,
            }
          : item
      )
    );
    onNotify(`ปรับเกรดสุทธิของ "${editing.employeeName}" เป็นเกรด ${draftGrade} แล้ว`);
    setEditing(null);
  };

  const lockGrade = (item: CalibrationItem) => {
    onChange(items.map((i) => (i.id === item.id ? { ...i, locked: true } : i)));
    onNotify(`ยืนยันล็อกเกรด ${item.finalGrade} ของ "${item.employeeName}" เรียบร้อยแล้ว`);
  };

  return (
    <div className="space-y-4">
      {/* Compact Grade Distribution Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#EEF2F6] bg-[#F8FAFC] px-4 py-3">
        <span className="text-xs font-semibold text-[#334155]">
          การกระจายเกรดสุทธิ (Grade Distribution):
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {gradeDistribution.map((d) => (
            <button
              key={d.grade}
              type="button"
              onClick={() => setGradeFilter(gradeFilter === d.grade ? "all" : d.grade)}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all ${
                gradeFilter === d.grade
                  ? "border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]"
                  : "border-[#E2E8F0] bg-white text-[#334155] hover:border-[#CBD5E1]"
              }`}
            >
              <span
                className={`inline-flex h-5 min-w-6 items-center justify-center rounded px-1 text-[10px] font-bold ${GRADE_STYLE[d.grade]}`}
              >
                {d.grade}
              </span>
              <span className="tabular-nums">{d.count} คน</span>
            </button>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="ค้นหาชื่อพนักงาน รหัส หรือแผนก..."
          containerClassName="w-full sm:w-72"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="ไม่พบรายการ Calibration"
          description="ลองปรับคำค้นหาหรือล้างตัวกรองเกรด"
          action={
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSearch("");
                setGradeFilter("all");
              }}
            >
              แสดงทุกเกรด
            </Button>
          }
        />
      ) : (
        <TableContainer className="rounded-xl border border-[#EEF2F6]">
          <Table>
            <TableHeader className="bg-[#F8FAFC]">
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-5">รหัส / พนักงาน</TableHead>
                <TableHead className="w-36 pr-6 text-right">คะแนน KPI / Comp</TableHead>
                <TableHead className="w-28 text-center">คะแนนรวม</TableHead>
                <TableHead className="w-28 text-center">เกรดสุทธิ</TableHead>
                <TableHead className="w-32 text-center">สถานะล็อก</TableHead>
                <TableHead className="w-40 pr-5 text-center">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="py-3.5 pl-5">
                    <span className="rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                      {item.employeeCode}
                    </span>
                    <p className="mt-1 font-semibold text-[#1E293B]">{item.employeeName}</p>
                    <p className="text-xs text-[#94A3B8]">
                      {item.department} • {item.calibrationNote}
                    </p>
                  </TableCell>
                  <TableCell className="py-3.5 pr-6 text-right tabular-nums text-xs">
                    <p className="font-semibold text-[#1E293B]">KPI {item.kpiScore.toFixed(2)}</p>
                    <p className="text-[#94A3B8]">Comp {item.compScore.toFixed(2)}</p>
                  </TableCell>
                  <TableCell className="py-3.5 text-center tabular-nums font-bold text-[#1E293B]">
                    {item.rawTotal.toFixed(2)}
                  </TableCell>
                  <TableCell className="py-3.5 text-center">
                    <Tooltip
                      content={`เกรดแนะนำจากระบบ: ${item.suggestedGrade} • เกรดสุทธิหลัง Calibration: ${item.finalGrade}`}
                    >
                      <span
                        className={`inline-flex h-7 min-w-10 cursor-help items-center justify-center rounded-lg px-2 text-xs font-bold shadow-2xs ${GRADE_STYLE[item.finalGrade]}`}
                      >
                        {item.finalGrade}
                      </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="py-3.5 text-center">
                    <Badge variant={item.locked ? "success" : "warning"} dot>
                      {item.locked ? "ล็อกเกรดแล้ว" : "รอ Calibration"}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3.5 pr-5 text-center">
                    {item.locked ? (
                      <span className="inline-flex items-center gap-1 text-xs text-[#94A3B8]">
                        <Lock className="h-3.5 w-3.5" />
                        ยืนยันแล้ว
                      </span>
                    ) : (
                      <div className="inline-flex items-center gap-1.5">
                        <Tooltip content="ปรับเกรดสุทธิและระบุเหตุผล Calibration">
                          <button
                            type="button"
                            onClick={() => openCalibrate(item)}
                            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[#64748B] hover:bg-[#EFF6FF] hover:text-[#2563EB]"
                          >
                            <SlidersHorizontal className="h-4 w-4" />
                          </button>
                        </Tooltip>
                        <Tooltip content="ยืนยันล็อกเกรดสุทธิเพื่อส่งต่อระบบเงินเดือน/โบนัส">
                          <Button size="sm" variant="primary" onClick={() => lockGrade(item)}>
                            ล็อกเกรด
                          </Button>
                        </Tooltip>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title={`ปรับเกรด Calibration — ${editing?.employeeName ?? ""}`}
        description={editing ? `คะแนนรวมดิบ ${editing.rawTotal.toFixed(2)} (เกรดแนะนำ: ${editing.suggestedGrade})` : undefined}
        footer={
          <>
            <Button variant="outline" onClick={() => setEditing(null)}>
              ยกเลิก
            </Button>
            <Button onClick={handleSaveCalibration}>บันทึกเกรดสุทธิ</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="เลือกเกรดสุทธิหลัง Calibration"
            value={draftGrade}
            onChange={(v) => setDraftGrade(v as FinalGrade)}
            options={[
              { value: "A", label: "เกรด A — ผลงานยอดเยี่ยม (Outstanding)" },
              { value: "B+", label: "เกรด B+ — สูงกว่าเป้าหมาย (Exceeds)" },
              { value: "B", label: "เกรด B — บรรลุเป้าหมาย (Meets)" },
              { value: "C", label: "เกรด C — ควรพัฒนาเพิ่ม (Needs Improvement)" },
              { value: "PIP", label: "เกรด PIP — เข้าแผนปรับปรุงผลงาน" },
            ]}
          />
          <Input
            label="เหตุผลประกอบการพิจารณาของคณะกรรมการ"
            value={draftNote}
            onChange={(e) => setDraftNote(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}
