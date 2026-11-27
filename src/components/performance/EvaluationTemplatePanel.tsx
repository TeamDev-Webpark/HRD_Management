"use client";

import { useMemo, useState } from "react";
import { FolderOpen, Pencil, Plus, Trash2 } from "lucide-react";
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
import type { EvaluationTemplateItem } from "@/data/mock/pmsSetup";

interface EvaluationTemplatePanelProps {
  items: EvaluationTemplateItem[];
  onChange: (items: EvaluationTemplateItem[]) => void;
  onNotify: (message: string) => void;
}

export function EvaluationTemplatePanel({
  items,
  onChange,
  onNotify,
}: EvaluationTemplatePanelProps) {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<EvaluationTemplateItem | null>(null);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [targetGroup, setTargetGroup] = useState("");
  const [kpiWeight, setKpiWeight] = useState("60");
  const [compWeight, setCompWeight] = useState("40");
  const [fbWeight, setFbWeight] = useState("0");
  const [description, setDescription] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) =>
        i.code.toLowerCase().includes(q) ||
        i.name.toLowerCase().includes(q) ||
        i.targetGroup.toLowerCase().includes(q)
    );
  }, [items, search]);

  const totalWeight = (Number(kpiWeight) || 0) + (Number(compWeight) || 0) + (Number(fbWeight) || 0);
  const isWeightValid = totalWeight === 100;

  const openCreate = () => {
    setEditingId(null);
    setCode(`TPL-NEW-${String(items.length + 1).padStart(2, "0")}`);
    setName("");
    setTargetGroup("พนักงานทั่วไป (JG-03 – JG-06)");
    setKpiWeight("60");
    setCompWeight("40");
    setFbWeight("0");
    setDescription("");
    setModalOpen(true);
  };

  const openEdit = (item: EvaluationTemplateItem) => {
    setEditingId(item.id);
    setCode(item.code);
    setName(item.name);
    setTargetGroup(item.targetGroup);
    setKpiWeight(String(item.kpiWeight));
    setCompWeight(String(item.competencyWeight));
    setFbWeight(String(item.feedback360Weight));
    setDescription(item.description);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!name.trim() || !isWeightValid) return;
    if (editingId) {
      onChange(
        items.map((item) =>
          item.id === editingId
            ? {
                ...item,
                code: code.trim().toUpperCase() || item.code,
                name: name.trim(),
                targetGroup: targetGroup.trim() || item.targetGroup,
                kpiWeight: Number(kpiWeight) || 0,
                competencyWeight: Number(compWeight) || 0,
                feedback360Weight: Number(fbWeight) || 0,
                description: description.trim() || "-",
              }
            : item
        )
      );
      onNotify(`อัปเดตแบบฟอร์มประเมิน "${name.trim()}" เรียบร้อยแล้ว`);
    } else {
      const created: EvaluationTemplateItem = {
        id: `TPL-${Date.now()}`,
        code: code.trim().toUpperCase() || `TPL-NEW-${items.length + 1}`,
        name: name.trim(),
        targetGroup: targetGroup.trim() || "พนักงานทุกระดับ",
        scoringScale: "สเกล 1.00 – 5.00 (เกรด A – PIP)",
        kpiWeight: Number(kpiWeight) || 0,
        competencyWeight: Number(compWeight) || 0,
        feedback360Weight: Number(fbWeight) || 0,
        usedInCycles: 0,
        active: true,
        description: description.trim() || "-",
      };
      onChange([created, ...items]);
      onNotify(`สร้างแบบฟอร์มประเมิน "${created.name}" แล้ว`);
    }
    setModalOpen(false);
  };

  const toggleActive = (id: string) => {
    const target = items.find((i) => i.id === id);
    onChange(items.map((i) => (i.id === id ? { ...i, active: !i.active } : i)));
    if (target) {
      onNotify(`${target.active ? "ปิดใช้งาน" : "เปิดใช้งาน"}แบบฟอร์ม "${target.name}" แล้ว`);
    }
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    onChange(items.filter((i) => i.id !== deleteTarget.id));
    onNotify(`ลบแบบฟอร์ม "${deleteTarget.name}" แล้ว`);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="ค้นหารหัส ชื่อแบบฟอร์ม หรือกลุ่มตำแหน่ง..."
          containerClassName="w-full sm:w-72"
        />
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={openCreate}>
          สร้างแบบฟอร์มประเมินใหม่
        </Button>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="ไม่พบแบบฟอร์มประเมินที่ค้นหา"
          description="ลองปรับคำค้นหาใหม่"
        />
      ) : (
        <TableContainer className="rounded-xl border border-[#EEF2F6]">
          <Table>
            <TableHeader className="bg-[#F8FAFC]">
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-5">รหัส / ชื่อแบบฟอร์มประเมิน</TableHead>
                <TableHead className="w-48">กลุ่มเป้าหมาย (HRM)</TableHead>
                <TableHead className="w-56 px-4">โครงสร้างน้ำหนัก (รวม 100%)</TableHead>
                <TableHead className="w-24 text-center">ใช้งาน</TableHead>
                <TableHead className="w-24 pr-5 text-center">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id} className={!item.active ? "opacity-60" : ""}>
                  <TableCell className="py-3.5 pl-5">
                    <span className="rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                      {item.code}
                    </span>
                    <p className="mt-1 font-semibold text-[#1E293B]">{item.name}</p>
                    <p className="text-xs text-[#94A3B8]">{item.description}</p>
                  </TableCell>
                  <TableCell className="py-3.5">
                    <Badge variant="neutral">{item.targetGroup}</Badge>
                    <p className="mt-1 text-[11px] text-[#94A3B8]">{item.scoringScale}</p>
                  </TableCell>
                  <TableCell className="py-3.5 px-4">
                    <Tooltip
                      className="block w-full"
                      content={`KPI/OKR ${item.kpiWeight}% • Competency ${item.competencyWeight}%${
                        item.feedback360Weight > 0 ? ` • 360° Feedback ${item.feedback360Weight}%` : ""
                      }`}
                    >
                      <div className="w-full cursor-help space-y-1.5">
                        <div className="flex h-2 w-full overflow-hidden rounded-full bg-[#EEF2F6]">
                          <div className="h-full bg-[#2563EB]" style={{ width: `${item.kpiWeight}%` }} />
                          <div
                            className="h-full bg-[#22B89A]"
                            style={{ width: `${item.competencyWeight}%` }}
                          />
                          {item.feedback360Weight > 0 && (
                            <div
                              className="h-full bg-[#8B7CF6]"
                              style={{ width: `${item.feedback360Weight}%` }}
                            />
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] tabular-nums text-[#64748B]">
                          <span>KPI {item.kpiWeight}%</span>
                          <span>• Comp {item.competencyWeight}%</span>
                          {item.feedback360Weight > 0 && <span>• 360° {item.feedback360Weight}%</span>}
                        </div>
                      </div>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="py-3.5 text-center">
                    <Tooltip
                      content={item.active ? "เปิดใช้งานในรอบประเมิน (คลิกเพื่อปิด)" : "ปิดใช้งานชั่วคราว"}
                    >
                      <button
                        type="button"
                        role="switch"
                        aria-checked={item.active}
                        onClick={() => toggleActive(item.id)}
                        className={`relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors ${
                          item.active ? "bg-[#22B89A]" : "bg-[#CBD5E1]"
                        }`}
                      >
                        <span
                          className={`inline-block h-4.5 w-4.5 rounded-full bg-white shadow-xs transition-transform ${
                            item.active ? "translate-x-5.5" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="py-3.5 pr-5 text-center">
                    <div className="inline-flex items-center gap-1">
                      <Tooltip content="แก้ไขแบบฟอร์มและน้ำหนักคะแนน">
                        <button
                          type="button"
                          onClick={() => openEdit(item)}
                          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[#64748B] hover:bg-[#EFF6FF] hover:text-[#2563EB]"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      </Tooltip>
                      <Tooltip content="ลบแบบฟอร์ม">
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(item)}
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

      {/* Add / Edit Template Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "แก้ไขแบบฟอร์มและเกณฑ์ประเมิน" : "สร้างแบบฟอร์มประเมินใหม่"}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              ยกเลิก
            </Button>
            <Button disabled={!name.trim() || !isWeightValid} onClick={handleSave}>
              {editingId ? "บันทึกการแก้ไข" : "สร้างแบบฟอร์ม"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input label="รหัสแบบฟอร์ม" value={code} onChange={(e) => setCode(e.target.value)} />
            <div className="sm:col-span-2">
              <Input
                label="ชื่อแบบฟอร์มประเมิน"
                placeholder="เช่น แบบประเมินทีมพัฒนาซอฟต์แวร์"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>
          <Input
            label="กลุ่มเป้าหมาย / ระดับตำแหน่ง (HRM)"
            value={targetGroup}
            onChange={(e) => setTargetGroup(e.target.value)}
          />
          <div className="grid grid-cols-3 gap-3">
            <Input
              label="น้ำหนัก KPI (%)"
              type="number"
              min={0}
              max={100}
              value={kpiWeight}
              onChange={(e) => setKpiWeight(e.target.value)}
            />
            <Input
              label="Competency (%)"
              type="number"
              min={0}
              max={100}
              value={compWeight}
              onChange={(e) => setCompWeight(e.target.value)}
            />
            <Input
              label="360° Feedback (%)"
              type="number"
              min={0}
              max={100}
              value={fbWeight}
              onChange={(e) => setFbWeight(e.target.value)}
            />
          </div>
          <div
            className={`rounded-xl px-3.5 py-2.5 text-xs font-medium ${
              isWeightValid
                ? "bg-[#ECFAF5] text-[#1CA388]"
                : "bg-red-50 text-[#DC2626]"
            }`}
          >
            น้ำหนักรวมปัจจุบัน: {totalWeight}%{" "}
            {isWeightValid ? "✓ ครบ 100% พร้อมบันทึก" : "(ต้องรวมกันให้เท่ากับ 100% พอดี)"}
          </div>
          <Input
            label="คำอธิบายการใช้งาน"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="ยืนยันการลบแบบฟอร์มประเมิน"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              ยกเลิก
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              ยืนยันลบ
            </Button>
          </>
        }
      >
        <p className="text-sm text-[#334155]">
          ต้องการลบแบบฟอร์ม <strong className="text-[#1E293B]">{deleteTarget?.name}</strong> ใช่หรือไม่?
        </p>
      </Modal>
    </div>
  );
}
