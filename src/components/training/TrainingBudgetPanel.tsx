"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus } from "lucide-react";
import {
  Badge,
  Button,
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
import type { TrainingBudgetItem } from "@/data/mock/trainingResources";

interface TrainingBudgetPanelProps {
  items: TrainingBudgetItem[];
  onChange: (items: TrainingBudgetItem[]) => void;
  onNotify: (message: string) => void;
}

function fmtCurrency(n: number) {
  return `฿${new Intl.NumberFormat("th-TH").format(Math.round(n))}`;
}

export function TrainingBudgetPanel({ items, onChange, onNotify }: TrainingBudgetPanelProps) {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [deptName, setDeptName] = useState("");
  const [costCenter, setCostCenter] = useState("");
  const [allocated, setAllocated] = useState("500000");
  const [spent, setSpent] = useState("0");
  const [committed, setCommitted] = useState("0");

  const totals = useMemo(() => {
    const totalAllocated = items.reduce((s, i) => s + i.allocated, 0);
    const totalSpent = items.reduce((s, i) => s + i.spent, 0);
    const totalCommitted = items.reduce((s, i) => s + i.committed, 0);
    const totalRemaining = Math.max(0, totalAllocated - totalSpent - totalCommitted);
    const spentPct = totalAllocated ? Math.round((totalSpent / totalAllocated) * 100) : 0;
    const committedPct = totalAllocated ? Math.round((totalCommitted / totalAllocated) * 100) : 0;
    return {
      totalAllocated,
      totalSpent,
      totalCommitted,
      totalRemaining,
      spentPct,
      committedPct,
      utilizationPct: spentPct + committedPct,
    };
  }, [items]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) =>
        i.department.toLowerCase().includes(q) ||
        i.code.toLowerCase().includes(q) ||
        i.costCenter.toLowerCase().includes(q)
    );
  }, [items, search]);

  const openCreate = () => {
    setEditingId(null);
    setDeptName("");
    setCostCenter("CC-1050");
    setAllocated("400000");
    setSpent("0");
    setCommitted("0");
    setModalOpen(true);
  };

  const openEdit = (item: TrainingBudgetItem) => {
    setEditingId(item.id);
    setDeptName(item.department);
    setCostCenter(item.costCenter);
    setAllocated(String(item.allocated));
    setSpent(String(item.spent));
    setCommitted(String(item.committed));
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!deptName.trim()) return;
    if (editingId) {
      onChange(
        items.map((item) =>
          item.id === editingId
            ? {
                ...item,
                department: deptName.trim(),
                costCenter: costCenter.trim() || item.costCenter,
                allocated: Math.max(0, Number(allocated) || 0),
                spent: Math.max(0, Number(spent) || 0),
                committed: Math.max(0, Number(committed) || 0),
              }
            : item
        )
      );
      onNotify(`อัปเดตงบประมาณ "${deptName.trim()}" เรียบร้อยแล้ว`);
    } else {
      const created: TrainingBudgetItem = {
        id: `BG-${Date.now()}`,
        code: `BG-2569-NEW`,
        department: deptName.trim(),
        costCenter: costCenter.trim() || "CC-1099",
        allocated: Math.max(0, Number(allocated) || 0),
        spent: Math.max(0, Number(spent) || 0),
        committed: Math.max(0, Number(committed) || 0),
        coursesCount: 0,
      };
      onChange([created, ...items]);
      onNotify(`จัดสรรงบประมาณให้ "${created.department}" แล้ว`);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Compact Overall Budget Utilization Strip */}
      <div className="rounded-2xl border border-[#EEF2F6] bg-[#F8FAFC] p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Tooltip
            className="block w-full"
            content="งบประมาณฝึกอบรมที่ได้รับอนุมัติประจำปีงบประมาณ 2569"
          >
            <div className="w-full rounded-xl bg-white p-3.5 ring-1 ring-[#EEF2F6] cursor-help">
              <p className="text-xs font-medium text-[#64748B]">งบจัดสรรทั้งหมด</p>
              <p className="mt-1 tabular-nums text-xl font-bold text-[#1E293B]">
                {fmtCurrency(totals.totalAllocated)}
              </p>
            </div>
          </Tooltip>

          <Tooltip
            className="block w-full"
            title="รายละเอียดการใช้งบ"
            content={`เบิกจ่ายจริงแล้ว ${fmtCurrency(totals.totalSpent)} (${totals.spentPct}%) • จองงบไว้รอจัดอบรม ${fmtCurrency(totals.totalCommitted)} (${totals.committedPct}%)`}
          >
            <div className="w-full rounded-xl bg-white p-3.5 ring-1 ring-[#EEF2F6] cursor-help">
              <p className="text-xs font-medium text-[#64748B]">เบิกจ่าย + จองงบไว้แล้ว</p>
              <p className="mt-1 tabular-nums text-xl font-bold text-[#2563EB]">
                {fmtCurrency(totals.totalSpent + totals.totalCommitted)}{" "}
                <span className="text-xs font-semibold text-[#1CA388]">
                  ({totals.utilizationPct}%)
                </span>
              </p>
            </div>
          </Tooltip>

          <Tooltip
            className="block w-full"
            content="งบประมาณคงเหลือที่ยังสามารถจัดสรรให้หลักสูตรหรือคำขอใหม่ได้"
          >
            <div className="w-full rounded-xl bg-white p-3.5 ring-1 ring-[#EEF2F6] cursor-help">
              <p className="text-xs font-medium text-[#64748B]">งบประมาณคงเหลือ</p>
              <p className="mt-1 tabular-nums text-xl font-bold text-[#1CA388]">
                {fmtCurrency(totals.totalRemaining)}
              </p>
            </div>
          </Tooltip>
        </div>

        {/* 100% Segmented Utilization Bar */}
        <div className="mt-4 space-y-2">
          <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-[#E2E8F0]/70">
            <div className="h-full bg-[#22B89A]" style={{ width: `${totals.spentPct}%` }} />
            <div className="h-full bg-[#3B82F6]" style={{ width: `${totals.committedPct}%` }} />
          </div>
          <div className="flex flex-wrap items-center gap-5 text-xs text-[#64748B]">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#22B89A]" />
              เบิกจ่ายแล้ว ({totals.spentPct}%)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#3B82F6]" />
              จองงบไว้รอจัดอบรม ({totals.committedPct}%)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#CBD5E1]" />
              คงเหลือ ({Math.max(0, 100 - totals.utilizationPct)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="ค้นหาแผนก หรือ Cost Center..."
          containerClassName="w-full sm:w-72"
        />
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={openCreate}>
          จัดสรรงบประมาณเพิ่ม
        </Button>
      </div>

      {/* Department Budget Table */}
      <TableContainer className="rounded-xl border border-[#EEF2F6]">
        <Table>
          <TableHeader className="bg-[#F8FAFC]">
            <TableRow className="hover:bg-transparent">
              <TableHead className="min-w-[230px] pl-5">แผนก / Cost Center</TableHead>
              <TableHead className="w-36 pr-6 text-right">งบจัดสรร</TableHead>
              <TableHead className="w-44 pr-6 text-right">เบิกจ่าย / จองงบไว้</TableHead>
              <TableHead className="w-36 pr-6 text-right">คงเหลือ</TableHead>
              <TableHead className="w-48 px-4">สัดส่วนการใช้งบ</TableHead>
              <TableHead className="w-36 text-center">สถานะ</TableHead>
              <TableHead className="w-24 pr-5 text-center">ปรับงบ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => {
              const used = item.spent + item.committed;
              const remaining = item.allocated - used;
              const pct = item.allocated ? Math.round((used / item.allocated) * 100) : 0;
              const status =
                pct > 100
                  ? { label: "เกินงบประมาณ", variant: "danger" as const, hint: "ยอดเบิกจ่ายและยอดจองงบรวมกันเกินงบจัดสรร" }
                  : pct >= 85
                    ? { label: "ใกล้เต็มงบ", variant: "warning" as const, hint: "ใช้และจองงบไปแล้วตั้งแต่ 85% ขึ้นไป ควรระวังการอนุมัติเพิ่ม" }
                    : { label: "อยู่ในเกณฑ์", variant: "success" as const, hint: "การใช้งบประมาณยังอยู่ในกรอบที่จัดสรรไว้" };

              return (
                <TableRow key={item.id}>
                  <TableCell className="py-3.5 pl-5">
                    <span className="rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                      {item.costCenter}
                    </span>
                    <p className="mt-1 font-semibold text-[#1E293B]">{item.department}</p>
                    <p className="text-xs text-[#94A3B8]">{item.coursesCount} หลักสูตรในปีนี้</p>
                  </TableCell>
                  <TableCell className="py-3.5 pr-6 text-right tabular-nums font-semibold text-[#1E293B]">
                    {fmtCurrency(item.allocated)}
                  </TableCell>
                  <TableCell className="py-3.5 pr-6 text-right tabular-nums">
                    <Tooltip
                      content={`เบิกจ่ายจริง ${fmtCurrency(item.spent)} • จองงบไว้รอจัดอบรม ${fmtCurrency(item.committed)}`}
                    >
                      <div className="inline-block cursor-help">
                        <p className="font-semibold text-[#2563EB]">{fmtCurrency(item.spent)}</p>
                        <p className="text-xs text-[#94A3B8]">
                          จองงบไว้ {fmtCurrency(item.committed)}
                        </p>
                      </div>
                    </Tooltip>
                  </TableCell>
                  <TableCell
                    className={`py-3.5 pr-6 text-right tabular-nums font-semibold ${
                      remaining < 0 ? "text-[#DC2626]" : "text-[#1CA388]"
                    }`}
                  >
                    {fmtCurrency(remaining)}
                  </TableCell>
                  <TableCell className="py-3.5 px-4">
                    <Tooltip
                      className="block w-full"
                      content={`เบิกจ่ายและจองงบไว้แล้ว ${pct}% ของงบจัดสรร`}
                    >
                      <div className="w-full space-y-1.5 cursor-help">
                        <div className="flex items-center justify-between gap-3 text-xs tabular-nums">
                          <span className="text-[#64748B]">ใช้ไป</span>
                          <span className="font-semibold text-[#1E293B]">{pct}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-[#EEF2F6]">
                          <div
                            className={`h-full rounded-full transition-all ${
                              pct > 100
                                ? "bg-[#EF4444]"
                                : pct >= 85
                                  ? "bg-[#F5B73B]"
                                  : "bg-[#22B89A]"
                            }`}
                            style={{ width: `${Math.min(100, pct)}%` }}
                          />
                        </div>
                      </div>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="py-3.5 text-center">
                    <Tooltip content={status.hint}>
                      <Badge variant={status.variant} dot className="cursor-help">
                        {status.label}
                      </Badge>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="py-3.5 pr-5 text-center">
                    <Tooltip content="ปรับปรุงวงเงินงบประมาณ">
                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                        aria-label={`แก้ไขงบ ${item.department}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#EFF6FF] hover:text-[#2563EB] cursor-pointer"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Budget Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "ปรับปรุงงบประมาณฝึกอบรม" : "จัดสรรงบประมาณฝึกอบรมเพิ่ม"}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              ยกเลิก
            </Button>
            <Button disabled={!deptName.trim()} onClick={handleSave}>
              บันทึกงบประมาณ
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <Input
                label="ฝ่าย / แผนก (อ้างอิง HRM)"
                placeholder="เช่น ฝ่ายบัญชีและการเงิน"
                value={deptName}
                onChange={(e) => setDeptName(e.target.value)}
                required
              />
            </div>
            <Input
              label="Cost Center"
              value={costCenter}
              onChange={(e) => setCostCenter(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input
              label="งบจัดสรร (บาท)"
              type="number"
              min={0}
              value={allocated}
              onChange={(e) => setAllocated(e.target.value)}
            />
            <Input
              label="เบิกจ่ายแล้ว (บาท)"
              type="number"
              min={0}
              value={spent}
              onChange={(e) => setSpent(e.target.value)}
            />
            <Input
              label="จองงบไว้รอจัดอบรม (บาท)"
              type="number"
              min={0}
              value={committed}
              onChange={(e) => setCommitted(e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
