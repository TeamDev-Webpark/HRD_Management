"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, FolderOpen, Pencil } from "lucide-react";
import {
  Badge,
  Button,
  EmptyState,
  Input,
  Modal,
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
import type {
  ReadinessAssessmentItem,
  ReadinessLevel,
} from "@/data/mock/successionData";

interface ReadinessAssessmentPanelProps {
  items: ReadinessAssessmentItem[];
  onChange: (items: ReadinessAssessmentItem[]) => void;
  onNotify: (message: string) => void;
}

function deriveReadiness(avg: number): ReadinessLevel {
  if (avg >= 85) return "ready-now";
  if (avg >= 70) return "1-2-years";
  return "3-plus-years";
}

const READINESS_BADGE: Record<
  ReadinessLevel,
  { label: string; variant: "success" | "primary" | "warning" }
> = {
  "ready-now": { label: "พร้อมทันที (≥85%)", variant: "success" },
  "1-2-years": { label: "1–2 ปี (70–84%)", variant: "primary" },
  "3-plus-years": { label: "3+ ปี (<70%)", variant: "warning" },
};

export function ReadinessAssessmentPanel({
  items,
  onChange,
  onNotify,
}: ReadinessAssessmentPanelProps) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ReadinessAssessmentItem | null>(null);
  const [leadScore, setLeadScore] = useState("85");
  const [expScore, setExpScore] = useState("85");
  const [skillScore, setSkillScore] = useState("85");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.code.toLowerCase().includes(q) ||
        item.candidateName.toLowerCase().includes(q) ||
        item.targetKeyPosition.toLowerCase().includes(q)
    );
  }, [items, search]);

  const openEdit = (item: ReadinessAssessmentItem) => {
    setSelected(item);
    setLeadScore(String(item.leadershipScore));
    setExpScore(String(item.experienceScore));
    setSkillScore(String(item.skillMatchScore));
  };

  const handleSave = () => {
    if (!selected) return;
    const clamp = (v: string) => Math.min(100, Math.max(0, Number(v) || 0));
    const l = clamp(leadScore);
    const e = clamp(expScore);
    const s = clamp(skillScore);
    const avg = Math.round((l + e + s) / 3);
    const nextReadiness = deriveReadiness(avg);

    onChange(
      items.map((row) =>
        row.id === selected.id
          ? {
              ...row,
              leadershipScore: l,
              experienceScore: e,
              skillMatchScore: s,
              readiness: nextReadiness,
              assessedDate: "27 พ.ย. 2569",
            }
          : row
      )
    );
    onNotify(`อัปเดตผลประเมินความพร้อมของ ${selected.candidateName} (เฉลี่ย ${avg}%) แล้ว`);
    setSelected(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="ค้นหาชื่อผู้สืบทอด หรือตำแหน่งเป้าหมาย..."
          className="w-full sm:w-80"
        />
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
          <span className="font-semibold text-[#475569]">เกณฑ์ระดับ (สูง → ต่ำ):</span>
          <Badge variant="success">พร้อมทันที ≥85%</Badge>
          <span>›</span>
          <Badge variant="primary">1–2 ปี (70–84%)</Badge>
          <span>›</span>
          <Badge variant="warning">3+ ปี (&lt;70%)</Badge>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="ไม่พบรายการประเมินความพร้อม"
          description="ลองปรับคำค้นหาใหม่"
        />
      ) : (
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[24%]">รหัส / ผู้สืบทอด</TableHead>
                <TableHead className="w-[12%] text-center">
                  <Tooltip title="Leadership Readiness" content="ความพร้อมด้านภาวะผู้นำ การตัดสินใจ และการบริหารทีม">
                    <span className="cursor-help border-b border-dashed border-[#CBD5E1]">Leadership</span>
                  </Tooltip>
                </TableHead>
                <TableHead className="w-[12%] text-center">
                  <Tooltip title="Experience Match" content="ประสบการณ์ตรงในโปรเจกต์สำคัญและขอบเขตงานใกล้เคียง">
                    <span className="cursor-help border-b border-dashed border-[#CBD5E1]">Experience</span>
                  </Tooltip>
                </TableHead>
                <TableHead className="w-[12%] text-center">
                  <Tooltip title="Skill & Competency Match" content="ความสอดคล้องของทักษะกับเกณฑ์ตำแหน่งเป้าหมาย">
                    <span className="cursor-help border-b border-dashed border-[#CBD5E1]">Skill Match</span>
                  </Tooltip>
                </TableHead>
                <TableHead className="w-[11%] text-center">เฉลี่ยรวม</TableHead>
                <TableHead className="w-[17%] text-center">ระดับความพร้อม</TableHead>
                <TableHead className="w-[12%] text-center">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => {
                const avg = Math.round(
                  (item.leadershipScore + item.experienceScore + item.skillMatchScore) / 3
                );
                const rBadge = READINESS_BADGE[item.readiness];
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <span className="inline-block rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                        {item.code}
                      </span>
                      <div className="mt-1 font-semibold text-[#1E293B]">{item.candidateName}</div>
                      <div className="text-xs text-[#64748B]">
                        เป้าหมาย: {item.targetKeyPosition}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-semibold text-[#1E293B]">
                      {item.leadershipScore}%
                    </TableCell>
                    <TableCell className="text-center font-semibold text-[#1E293B]">
                      {item.experienceScore}%
                    </TableCell>
                    <TableCell className="text-center font-semibold text-[#1E293B]">
                      {item.skillMatchScore}%
                    </TableCell>
                    <TableCell className="text-center text-sm font-bold text-[#2563EB]">
                      {avg}%
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={rBadge.variant}>{rBadge.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        <Tooltip content="ปรับปรุงคะแนนความพร้อมทั้ง 3 ด้าน">
                          <Button
                            size="sm"
                            variant="outline"
                            leftIcon={<Pencil className="h-3.5 w-3.5" />}
                            onClick={() => openEdit(item)}
                            className="w-[104px] justify-center"
                          >
                            ปรับคะแนน
                          </Button>
                        </Tooltip>
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
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title="ปรับคะแนนประเมินความพร้อม (Readiness)"
        description={
          selected ? `${selected.candidateName} → ${selected.targetKeyPosition}` : undefined
        }
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setSelected(null)}>
              ยกเลิก
            </Button>
            <Button
              variant="primary"
              leftIcon={<CheckCircle2 className="h-4 w-4" />}
              onClick={handleSave}
            >
              บันทึกคะแนน
            </Button>
          </>
        }
      >
        <div className="space-y-3.5">
          <Input
            label="Leadership Readiness (0–100%)"
            type="number"
            min={0}
            max={100}
            value={leadScore}
            onChange={(e) => setLeadScore(e.target.value)}
          />
          <Input
            label="Experience Match (0–100%)"
            type="number"
            min={0}
            max={100}
            value={expScore}
            onChange={(e) => setExpScore(e.target.value)}
          />
          <Input
            label="Skill & Competency Match (0–100%)"
            type="number"
            min={0}
            max={100}
            value={skillScore}
            onChange={(e) => setSkillScore(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}
