"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, FolderOpen } from "lucide-react";
import {
  Badge,
  Button,
  EmptyState,
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
import {
  SKILL_COLUMNS,
  type SkillColumnDef,
  type SkillMatrixRow,
} from "@/data/mock/skillAnalytics";

interface SkillMatrixPanelProps {
  rows: SkillMatrixRow[];
  onChange: (rows: SkillMatrixRow[]) => void;
  onNotify: (message: string) => void;
}

const LEVEL_OPTIONS = [
  { value: "1", label: "Lv.1 — Awareness (พื้นฐาน)" },
  { value: "2", label: "Lv.2 — Basic (ปฏิบัติได้)" },
  { value: "3", label: "Lv.3 — Practitioner (ชำนาญงาน)" },
  { value: "4", label: "Lv.4 — Advanced (เชี่ยวชาญ)" },
  { value: "5", label: "Lv.5 — Expert (ต้นแบบองค์กร)" },
];

export function SkillMatrixPanel({ rows, onChange, onNotify }: SkillMatrixPanelProps) {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [editingCell, setEditingCell] = useState<{
    row: SkillMatrixRow;
    col: SkillColumnDef;
  } | null>(null);
  const [formActual, setFormActual] = useState("3");

  const departmentOptions = useMemo(() => {
    const depts = Array.from(new Set(rows.map((r) => r.department)));
    return [
      { value: "all", label: "ทุกแผนก" },
      ...depts.map((d) => ({ value: d, label: d })),
    ];
  }, [rows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((row) => {
      if (deptFilter !== "all" && row.department !== deptFilter) return false;
      if (!q) return true;
      return (
        row.employeeName.toLowerCase().includes(q) ||
        row.employeeCode.toLowerCase().includes(q) ||
        row.position.toLowerCase().includes(q) ||
        row.department.toLowerCase().includes(q)
      );
    });
  }, [rows, search, deptFilter]);

  const openEditCell = (row: SkillMatrixRow, col: SkillColumnDef) => {
    const cell = row.skills[col.key] ?? { actual: 1, target: 3 };
    setEditingCell({ row, col });
    setFormActual(String(cell.actual));
  };

  const handleSaveLevel = () => {
    if (!editingCell) return;
    const nextLevel = Number(formActual);
    onChange(
      rows.map((r) =>
        r.id === editingCell.row.id
          ? {
              ...r,
              skills: {
                ...r.skills,
                [editingCell.col.key]: {
                  ...r.skills[editingCell.col.key],
                  actual: nextLevel,
                },
              },
            }
          : r
      )
    );
    onNotify(
      `อัปเดตทักษะ ${editingCell.col.shortLabel} ของ ${editingCell.row.employeeName} เป็น Lv.${nextLevel} แล้ว`
    );
    setEditingCell(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="ค้นหาชื่อพนักงาน, รหัส หรือตำแหน่ง..."
            className="w-full sm:w-72"
          />
          <Select
            aria-label="กรองตามแผนก"
            value={deptFilter}
            onChange={setDeptFilter}
            options={departmentOptions}
            className="w-56"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> ผ่านเกณฑ์
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> สูงกว่าเกณฑ์
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> มี Gap (คลิกเพื่อปรับระดับ)
          </span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="ไม่พบข้อมูลพนักงานใน Skill Matrix"
          description="ลองปรับคำค้นหาหรือเลือกแผนกอื่น"
        />
      ) : (
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[26%]">รหัส / พนักงาน</TableHead>
                {SKILL_COLUMNS.map((col) => (
                  <TableHead key={col.key} className="text-center">
                    <Tooltip content={`${col.code}: ${col.label} (${col.category})`}>
                      <span className="cursor-help">{col.shortLabel}</span>
                    </Tooltip>
                  </TableHead>
                ))}
                <TableHead className="w-[12%] text-center">ความพร้อม</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((row) => {
                const totalSkills = SKILL_COLUMNS.length;
                const metSkills = SKILL_COLUMNS.filter((c) => {
                  const val = row.skills[c.key];
                  return val && val.actual >= val.target;
                }).length;
                const readiness = Math.round((metSkills / totalSkills) * 100);

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
                    {SKILL_COLUMNS.map((col) => {
                      const cell = row.skills[col.key] ?? { actual: 1, target: 3 };
                      const diff = cell.actual - cell.target;
                      const pillClass =
                        diff > 0
                          ? "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                          : diff === 0
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100";

                      return (
                        <TableCell key={col.key} className="text-center">
                          <Tooltip
                            content={`${col.label}: ระดับจริง Lv.${cell.actual} / เป้าหมาย Lv.${cell.target} — คลิกเพื่อปรับระดับ`}
                          >
                            <button
                              type="button"
                              onClick={() => openEditCell(row, col)}
                              className={`inline-flex cursor-pointer flex-col items-center rounded-xl border px-3 py-1.5 transition-colors ${pillClass}`}
                            >
                              <span className="text-xs font-bold">Lv.{cell.actual}</span>
                              <span className="text-[10px] opacity-75">เป้า {cell.target}</span>
                            </button>
                          </Tooltip>
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-center">
                      <Tooltip content={`ผ่านเกณฑ์ ${metSkills} จาก ${totalSkills} ทักษะหลัก`}>
                        <Badge
                          variant={
                            readiness === 100
                              ? "success"
                              : readiness >= 80
                                ? "primary"
                                : "warning"
                          }
                        >
                          {readiness}%
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

      <Modal
        open={Boolean(editingCell)}
        onClose={() => setEditingCell(null)}
        title="ปรับระดับทักษะใน Skill Matrix"
        description={
          editingCell
            ? `${editingCell.row.employeeName} — ${editingCell.col.label}`
            : undefined
        }
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setEditingCell(null)}>
              ยกเลิก
            </Button>
            <Button
              variant="primary"
              leftIcon={<CheckCircle2 className="h-4 w-4" />}
              onClick={handleSaveLevel}
            >
              บันทึกระดับทักษะ
            </Button>
          </>
        }
      >
        {editingCell && (
          <div className="space-y-4">
            <div className="rounded-xl border border-[#EEF2F6] bg-[#F8FAFC] p-3 text-sm">
              ระดับเป้าหมายประจำตำแหน่ง:{" "}
              <strong className="text-[#1E293B]">
                Lv.{editingCell.row.skills[editingCell.col.key]?.target ?? 3}
              </strong>
            </div>
            <Select
              label="ระดับทักษะปัจจุบัน (Actual Level)"
              value={formActual}
              onChange={setFormActual}
              options={LEVEL_OPTIONS}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
