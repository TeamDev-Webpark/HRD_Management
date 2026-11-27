"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, FolderOpen, Plus, UserCheck } from "lucide-react";
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
import type { ReadinessLevel, SuccessorItem } from "@/data/mock/successionData";

interface SuccessorsPanelProps {
  items: SuccessorItem[];
  onChange: (items: SuccessorItem[]) => void;
  onNotify: (message: string) => void;
}

const READINESS_META: Record<
  ReadinessLevel,
  { label: string; variant: "success" | "primary" | "warning"; hint: string }
> = {
  "ready-now": {
    label: "พร้อมรับตำแหน่งทันที",
    variant: "success",
    hint: "ระดับ 1 (สูงสุด) — ผ่านเกณฑ์ความพร้อม ≥ 88% สามารถรับช่วงต่อได้ทันที",
  },
  "1-2-years": {
    label: "พร้อมใน 1–2 ปี",
    variant: "primary",
    hint: "ระดับ 2 — มีพื้นฐานแข็งแกร่ง ต้องการประสบการณ์หรือโปรเจกต์เสริมอีก 1–2 ปี",
  },
  "3-plus-years": {
    label: "พัฒนาระยะยาว 3+ ปี",
    variant: "warning",
    hint: "ระดับ 3 — ดาวรุ่งที่มีศักยภาพ ต้องพัฒนาสมรรถนะผู้นำอย่างต่อเนื่อง",
  },
};

export function SuccessorsPanel({ items, onChange, onNotify }: SuccessorsPanelProps) {
  const [search, setSearch] = useState("");
  const [readinessFilter, setReadinessFilter] = useState<"all" | ReadinessLevel>("all");

  const [addOpen, setAddOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formCurrentPos, setFormCurrentPos] = useState("Senior Specialist");
  const [formTargetPos, setFormTargetPos] = useState("Engineering Manager");
  const [formRank, setFormRank] = useState<"1" | "2">("2");
  const [formReadiness, setFormReadiness] = useState<ReadinessLevel>("1-2-years");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      if (readinessFilter !== "all" && item.readiness !== readinessFilter) return false;
      if (!q) return true;
      return (
        item.code.toLowerCase().includes(q) ||
        item.candidateName.toLowerCase().includes(q) ||
        item.targetKeyPosition.toLowerCase().includes(q) ||
        item.department.toLowerCase().includes(q)
      );
    });
  }, [items, search, readinessFilter]);

  const handleConfirm = (item: SuccessorItem) => {
    onChange(
      items.map((row) => (row.id === item.id ? { ...row, status: "confirmed" } : row))
    );
    onNotify(`ยืนยัน ${item.candidateName} เป็นผู้สืบทอดตำแหน่ง ${item.targetKeyPosition} แล้ว`);
  };

  const handleAdd = () => {
    if (!formName.trim()) return;
    const nextNum = String(items.length + 1).padStart(2, "0");
    const created: SuccessorItem = {
      id: `SUC-${Date.now()}`,
      code: `SUC-69-${nextNum}`,
      candidateCode: `EMP-${1130 + items.length}`,
      candidateName: formName.trim(),
      currentPosition: formCurrentPos.trim() || "พนักงาน",
      department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
      targetKeyPosition: formTargetPos.trim() || "Engineering Manager",
      rank: Number(formRank) as 1 | 2,
      readiness: formReadiness,
      readinessScore: formReadiness === "ready-now" ? 90 : formReadiness === "1-2-years" ? 78 : 60,
      status: "nominated",
    };
    onChange([created, ...items]);
    onNotify(`เสนอชื่อ ${created.candidateName} เป็นผู้สืบทอดตำแหน่ง ${created.targetKeyPosition} แล้ว`);
    setAddOpen(false);
    setFormName("");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="ค้นหาชื่อผู้สืบทอด, ตำแหน่งเป้าหมาย หรือแผนก..."
            className="w-full sm:w-80"
          />
          <Select
            aria-label="กรองตามระดับความพร้อม"
            value={readinessFilter}
            onChange={(v) => setReadinessFilter(v as "all" | ReadinessLevel)}
            options={[
              { value: "all", label: "ความพร้อม: ทั้งหมด" },
              { value: "ready-now", label: "พร้อมรับตำแหน่งทันที" },
              { value: "1-2-years", label: "พร้อมใน 1–2 ปี" },
              { value: "3-plus-years", label: "พัฒนาระยะยาว 3+ ปี" },
            ]}
            className="w-52"
          />
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setAddOpen(true)}
        >
          เสนอผู้สืบทอดตำแหน่ง
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="ไม่พบรายชื่อผู้สืบทอดตำแหน่ง"
          description="ลองปรับคำค้นหาหรือเสนอชื่อผู้สืบทอดใหม่"
        />
      ) : (
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[23%]">รหัส / ผู้สืบทอด</TableHead>
                <TableHead className="w-[21%]">ตำแหน่งสำคัญเป้าหมาย</TableHead>
                <TableHead className="w-[12%] text-center">ลำดับตัวเลือก</TableHead>
                <TableHead className="w-[18%] text-center">ระดับความพร้อม</TableHead>
                <TableHead className="w-[13%] text-center">สถานะ</TableHead>
                <TableHead className="w-[13%] text-center">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => {
                const rMeta = READINESS_META[item.readiness];
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <span className="inline-block rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                        {item.code}
                      </span>
                      <div className="mt-1 font-semibold text-[#1E293B]">{item.candidateName}</div>
                      <div className="text-xs text-[#64748B]">
                        {item.currentPosition} • {item.department}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-[#2563EB]">{item.targetKeyPosition}</div>
                      <div className="text-xs text-[#94A3B8]">ความพร้อม {item.readinessScore}%</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Tooltip
                        content={
                          item.rank === 1
                            ? "ผู้สืบทอดอันดับ 1 (ตัวหลัก) ที่จะพิจารณาก่อนเป็นคนแรก"
                            : "ผู้สืบทอดอันดับ 2 (สำรอง) รองรับกรณีฉุกเฉิน"
                        }
                      >
                        <Badge variant={item.rank === 1 ? "primary" : "neutral"}>
                          {item.rank === 1 ? "อันดับ 1 (ตัวหลัก)" : "อันดับ 2 (สำรอง)"}
                        </Badge>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="text-center">
                      <Tooltip title={rMeta.label} content={rMeta.hint}>
                        <Badge variant={rMeta.variant}>{rMeta.label}</Badge>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={item.status === "confirmed" ? "success" : "warning"} dot>
                        {item.status === "confirmed" ? "ยืนยันแล้ว" : "รอรับรอง"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        {item.status === "nominated" ? (
                          <Tooltip content="ยืนยันรับรองรายชื่อผู้สืบทอดเข้าแผน Succession">
                            <Button
                              size="sm"
                              variant="primary"
                              leftIcon={<UserCheck className="h-3.5 w-3.5" />}
                              onClick={() => handleConfirm(item)}
                              className="w-[104px] justify-center"
                            >
                              ยืนยัน
                            </Button>
                          </Tooltip>
                        ) : (
                          <span className="inline-flex w-[104px] items-center justify-center text-xs font-medium text-emerald-600">
                            รับรองแล้ว
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="เสนอชื่อผู้สืบทอดตำแหน่ง (Successor)"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              ยกเลิก
            </Button>
            <Button
              variant="primary"
              leftIcon={<CheckCircle2 className="h-4 w-4" />}
              onClick={handleAdd}
              disabled={!formName.trim()}
            >
              บันทึกผู้สืบทอด
            </Button>
          </>
        }
      >
        <div className="space-y-3.5">
          <Input
            label="ชื่อผู้สืบทอดตำแหน่ง"
            placeholder="เช่น กานต์สินี วงศ์สุวรรณ"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              label="ตำแหน่งปัจจุบัน"
              value={formCurrentPos}
              onChange={(e) => setFormCurrentPos(e.target.value)}
            />
            <Input
              label="ตำแหน่งสำคัญเป้าหมาย"
              value={formTargetPos}
              onChange={(e) => setFormTargetPos(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Select
              label="ลำดับผู้สืบทอด"
              value={formRank}
              onChange={(v) => setFormRank(v as "1" | "2")}
              options={[
                { value: "1", label: "อันดับ 1 (ตัวหลัก)" },
                { value: "2", label: "อันดับ 2 (สำรอง)" },
              ]}
            />
            <Select
              label="ระดับความพร้อมเบื้องต้น"
              value={formReadiness}
              onChange={(v) => setFormReadiness(v as ReadinessLevel)}
              options={[
                { value: "ready-now", label: "พร้อมรับตำแหน่งทันที" },
                { value: "1-2-years", label: "พร้อมใน 1–2 ปี" },
                { value: "3-plus-years", label: "พัฒนาระยะยาว 3+ ปี" },
              ]}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
