"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import {
  Badge,
  Button,
  Input,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
} from "@/components/ui";
import type { ScoringCriterion } from "@/data/mock/hrdSettings";

interface ScoringCriteriaPanelProps {
  items: ScoringCriterion[];
  onChange: (items: ScoringCriterion[]) => void;
  onNotify: (message: string) => void;
}

export function ScoringCriteriaPanel({ items, onChange, onNotify }: ScoringCriteriaPanelProps) {
  const [editing, setEditing] = useState<ScoringCriterion | null>(null);
  const [label, setLabel] = useState("");
  const [minScore, setMinScore] = useState("");
  const [maxScore, setMaxScore] = useState("");
  const [desc, setDesc] = useState("");

  const openEdit = (item: ScoringCriterion) => {
    setEditing(item);
    setLabel(item.label);
    setMinScore(String(item.minScore));
    setMaxScore(String(item.maxScore));
    setDesc(item.description);
  };

  const handleSave = () => {
    if (!editing) return;
    onChange(
      items.map((item) =>
        item.id === editing.id
          ? {
              ...item,
              label: label.trim() || item.label,
              minScore: Number(minScore) || 0,
              maxScore: Number(maxScore) || 5,
              description: desc.trim(),
            }
          : item
      )
    );
    onNotify(`อัปเดตเกณฑ์เกรด ${editing.grade} เรียบร้อยแล้ว`);
    setEditing(null);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-[#1E293B]">
          เกณฑ์การให้คะแนนผลการปฏิบัติงาน (Scoring Criteria)
        </h3>
        <p className="mt-0.5 text-xs text-[#94A3B8]">
          กำหนดช่วงคะแนนมาตรฐาน (เต็ม 5.00) สำหรับคำนวณเกรดและเชื่อมโยงกับ Calibration / 9-Box Grid
        </p>
      </div>

      <TableContainer className="rounded-xl border border-[#EEF2F6]">
        <Table>
          <TableHeader className="bg-[#F8FAFC]">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-24 pl-5 text-center">เกรด</TableHead>
              <TableHead className="w-56">ระดับผลงาน</TableHead>
              <TableHead className="w-40 text-center">ช่วงคะแนน</TableHead>
              <TableHead className="hidden md:table-cell">คำอธิบายเกณฑ์</TableHead>
              <TableHead className="w-24 pr-5 text-center">แก้ไข</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="py-3.5 pl-5 text-center">
                  <span
                    className="inline-flex h-8 min-w-11 items-center justify-center rounded-lg px-2.5 text-xs font-bold text-white shadow-2xs"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.grade}
                  </span>
                </TableCell>
                <TableCell className="py-3.5 font-semibold text-[#1E293B]">{item.label}</TableCell>
                <TableCell className="py-3.5 text-center whitespace-nowrap">
                  <Badge variant="neutral" className="tabular-nums font-semibold text-[#1E293B]">
                    {item.minScore.toFixed(2)} – {item.maxScore.toFixed(2)}
                  </Badge>
                </TableCell>
                <TableCell className="hidden max-w-md py-3.5 text-xs text-[#64748B] md:table-cell">
                  {item.description}
                </TableCell>
                <TableCell className="py-3.5 pr-5 text-center">
                  <Tooltip content="ปรับเกณฑ์คะแนน">
                    <button
                      type="button"
                      onClick={() => openEdit(item)}
                      aria-label={`แก้ไขเกรด ${item.grade}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#EFF6FF] hover:text-[#2563EB] cursor-pointer"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title={`แก้ไขเกณฑ์คะแนน — เกรด ${editing?.grade ?? ""}`}
        footer={
          <>
            <Button variant="outline" onClick={() => setEditing(null)}>
              ยกเลิก
            </Button>
            <Button onClick={handleSave}>บันทึกเกณฑ์คะแนน</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="ชื่อระดับผลงาน" value={label} onChange={(e) => setLabel(e.target.value)} />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="คะแนนต่ำสุด"
              type="number"
              step="0.01"
              value={minScore}
              onChange={(e) => setMinScore(e.target.value)}
            />
            <Input
              label="คะแนนสูงสุด"
              type="number"
              step="0.01"
              value={maxScore}
              onChange={(e) => setMaxScore(e.target.value)}
            />
          </div>
          <Input
            label="คำอธิบายเกณฑ์"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}
