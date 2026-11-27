"use client";

import { useMemo, useState } from "react";
import { FolderOpen, Pencil, Plus, Trash2 } from "lucide-react";
import {
  Badge,
  Button,
  EmptyState,
  Modal,
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
  POSITION_OPTIONS,
  type CompetencyDictItem,
  type PositionCompetencyItem,
} from "@/data/mock/competencyFramework";

interface PositionCompetencyPanelProps {
  items: PositionCompetencyItem[];
  dictionary: CompetencyDictItem[];
  onChange: (items: PositionCompetencyItem[]) => void;
  onNotify: (message: string) => void;
}

const LEVEL_HINTS: Record<number, string> = {
  1: "Lv.1 Awareness — เข้าใจพื้นฐานและปฏิบัติตามคำแนะนำได้",
  2: "Lv.2 Basic — ปฏิบัติงานประจำได้ด้วยตนเองภายใต้การกำกับดูแล",
  3: "Lv.3 Practitioner — ปฏิบัติงานที่ซับซ้อนและแก้ปัญหาหน้างานได้ดี",
  4: "Lv.4 Advanced — ออกแบบระบบ/มาตรฐานและสอนงานผู้อื่นได้",
  5: "Lv.5 Expert — เป็นต้นแบบและกำหนดกลยุทธ์ระดับองค์กรได้",
};

export function PositionCompetencyPanel({
  items,
  dictionary,
  onChange,
  onNotify,
}: PositionCompetencyPanelProps) {
  const [selectedPosId, setSelectedPosId] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PositionCompetencyItem | null>(null);

  const [formPosId, setFormPosId] = useState("POS-01");
  const [formCompCode, setFormCompCode] = useState(dictionary[0]?.code ?? "CC-01");
  const [formTargetLevel, setFormTargetLevel] = useState("3");
  const [formCritical, setFormCritical] = useState("true");

  const filtered = useMemo(() => {
    if (selectedPosId === "all") return items;
    return items.filter((i) => i.positionId === selectedPosId);
  }, [items, selectedPosId]);

  const openCreate = () => {
    setEditing(null);
    setFormPosId(selectedPosId === "all" ? "POS-01" : selectedPosId);
    setFormCompCode(dictionary[0]?.code ?? "CC-01");
    setFormTargetLevel("3");
    setFormCritical("true");
    setModalOpen(true);
  };

  const openEdit = (item: PositionCompetencyItem) => {
    setEditing(item);
    setFormPosId(item.positionId);
    setFormCompCode(item.competencyCode);
    setFormTargetLevel(String(item.targetLevel));
    setFormCritical(String(item.critical));
    setModalOpen(true);
  };

  const handleSave = () => {
    const posLabel = POSITION_OPTIONS.find((p) => p.value === formPosId)?.label ?? "ตำแหน่งงาน";
    const posTitle = posLabel.split(" (")[0];
    const comp = dictionary.find((d) => d.code === formCompCode) ?? dictionary[0];
    const level = Math.min(5, Math.max(1, Number(formTargetLevel) || 3));
    const isCritical = formCritical === "true";

    if (editing) {
      onChange(
        items.map((item) =>
          item.id === editing.id
            ? {
                ...item,
                targetLevel: level,
                critical: isCritical,
              }
            : item
        )
      );
      onNotify(`อัปเดตระดับคาดหวังของ "${editing.competencyName}" เป็น Lv.${level} แล้ว`);
    } else {
      const created: PositionCompetencyItem = {
        id: `PC-${Date.now()}`,
        positionId: formPosId,
        positionTitle: posTitle,
        department: "อ้างอิงโครงสร้าง HRM",
        jobGrade: posLabel.match(/\(([^)]+)\)/)?.[1] ?? "JG-05",
        competencyCode: comp.code,
        competencyName: comp.name,
        type: comp.type,
        targetLevel: level,
        critical: isCritical,
      };
      onChange([created, ...items]);
      onNotify(`กำหนดสมรรถนะ "${created.competencyName}" (Lv.${level}) ให้ตำแหน่ง ${posTitle} แล้ว`);
    }
    setModalOpen(false);
  };

  const handleDelete = (item: PositionCompetencyItem) => {
    onChange(items.filter((i) => i.id !== item.id));
    onNotify(`นำสมรรถนะ "${item.competencyName}" ออกจากตำแหน่ง ${item.positionTitle} แล้ว`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Select
          value={selectedPosId}
          onChange={setSelectedPosId}
          options={[{ value: "all", label: "ทุกตำแหน่งงาน (HRM)" }, ...POSITION_OPTIONS]}
          className="w-full sm:w-80"
        />
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={openCreate}>
          กำหนดสมรรถนะประจำตำแหน่ง
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="ยังไม่ได้กำหนดสมรรถนะสำหรับตำแหน่งนี้"
          description="คลิกปุ่ม 'กำหนดสมรรถนะประจำตำแหน่ง' เพื่อตั้งค่าเกณฑ์ระดับคาดหวัง"
        />
      ) : (
        <TableContainer className="rounded-xl border border-[#EEF2F6]">
          <Table>
            <TableHeader className="bg-[#F8FAFC]">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[26%] pl-5">ตำแหน่งงาน (HRM)</TableHead>
                <TableHead>สมรรถนะที่กำหนด</TableHead>
                <TableHead className="w-32 text-center">ความสำคัญ</TableHead>
                <TableHead className="w-36 text-center">ระดับคาดหวัง</TableHead>
                <TableHead className="w-24 pr-5 text-center">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="py-3.5 pl-5">
                    <span className="rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                      {item.jobGrade}
                    </span>
                    <p className="mt-1 font-semibold text-[#1E293B]">{item.positionTitle}</p>
                    <p className="text-xs text-[#94A3B8]">{item.department}</p>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <p className="font-medium text-[#1E293B]">{item.competencyName}</p>
                    <p className="text-xs text-[#94A3B8]">
                      {item.competencyCode} • {item.type} Competency
                    </p>
                  </TableCell>
                  <TableCell className="py-3.5 text-center">
                    <Badge variant={item.critical ? "danger" : "neutral"}>
                      {item.critical ? "สมรรถนะหลัก" : "สมรรถนะเสริม"}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3.5 text-center">
                    <Tooltip content={LEVEL_HINTS[item.targetLevel]}>
                      <span className="inline-flex cursor-help items-center rounded-lg bg-[#EFF6FF] px-3 py-1 text-xs font-bold text-[#2563EB]">
                        Target Lv.{item.targetLevel}
                      </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="py-3.5 pr-5 text-center">
                    <div className="inline-flex items-center gap-1">
                      <Tooltip content="ปรับระดับคาดหวัง">
                        <button
                          type="button"
                          onClick={() => openEdit(item)}
                          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[#64748B] hover:bg-[#EFF6FF] hover:text-[#2563EB]"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      </Tooltip>
                      <Tooltip content="นำออกจากตำแหน่ง">
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[#64748B] hover:bg-red-50 hover:text-[#DC2626]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "ปรับระดับสมรรถนะประจำตำแหน่ง" : "กำหนดสมรรถนะประจำตำแหน่ง"}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              ยกเลิก
            </Button>
            <Button onClick={handleSave}>บันทึกข้อมูล</Button>
          </>
        }
      >
        <div className="space-y-4">
          {!editing && (
            <>
              <Select
                label="เลือกตำแหน่งงาน (HRM)"
                value={formPosId}
                onChange={setFormPosId}
                options={POSITION_OPTIONS}
              />
              <Select
                label="เลือกสมรรถนะจากพจนานุกรม"
                value={formCompCode}
                onChange={setFormCompCode}
                options={dictionary.map((d) => ({ value: d.code, label: `${d.code} — ${d.name}` }))}
              />
            </>
          )}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="ระดับที่คาดหวัง (Target Level)"
              value={formTargetLevel}
              onChange={setFormTargetLevel}
              options={[
                { value: "1", label: "Lv.1 — Awareness" },
                { value: "2", label: "Lv.2 — Basic" },
                { value: "3", label: "Lv.3 — Practitioner" },
                { value: "4", label: "Lv.4 — Advanced" },
                { value: "5", label: "Lv.5 — Expert" },
              ]}
            />
            <Select
              label="ความสำคัญต่อตำแหน่ง"
              value={formCritical}
              onChange={setFormCritical}
              options={[
                { value: "true", label: "สมรรถนะหลัก (Critical)" },
                { value: "false", label: "สมรรถนะเสริม (Secondary)" },
              ]}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
