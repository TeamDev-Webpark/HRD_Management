"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, FolderOpen, Pencil, Plus } from "lucide-react";
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
import type { PipRecordItem, PipStatus } from "@/data/mock/pmsReview";
import { TRAINING_DEPARTMENT_OPTIONS } from "@/data/mock/trainingPlanning";

interface PipManagementPanelProps {
  items: PipRecordItem[];
  onChange: (items: PipRecordItem[]) => void;
  onNotify: (message: string) => void;
}

const PIP_STATUS_META: Record<
  PipStatus,
  { label: string; variant: "warning" | "success" | "danger"; hint: string }
> = {
  active: { label: "กำลังติดตามผล", variant: "warning", hint: "อยู่ระหว่างการติดตามเป้าหมายและโค้ชชิ่งรายสัปดาห์" },
  passed: { label: "ผ่านเกณฑ์ PIP", variant: "success", hint: "ปรับปรุงผลงานได้ตามเกณฑ์มาตรฐานและปิดแผน PIP แล้ว" },
  extended: { label: "ขยายเวลา PIP", variant: "danger", hint: "ขยายระยะเวลาติดตามผลเพิ่มอีก 30 วัน" },
};

export function PipManagementPanel({ items, onChange, onNotify }: PipManagementPanelProps) {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [empName, setEmpName] = useState("");
  const [department, setDepartment] = useState("ฝ่ายปฏิบัติการและบริการ");
  const [durationDays, setDurationDays] = useState("90");
  const [progressPct, setProgressPct] = useState("30");
  const [focusArea, setFocusArea] = useState("");
  const [status, setStatus] = useState<PipStatus>("active");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) =>
        i.code.toLowerCase().includes(q) ||
        i.employeeName.toLowerCase().includes(q) ||
        i.department.toLowerCase().includes(q)
    );
  }, [items, search]);

  const openCreate = () => {
    setEditingId(null);
    setEmpName("");
    setDepartment("ฝ่ายปฏิบัติการและบริการ");
    setDurationDays("90");
    setProgressPct("0");
    setFocusArea("");
    setStatus("active");
    setModalOpen(true);
  };

  const openEdit = (item: PipRecordItem) => {
    setEditingId(item.id);
    setEmpName(item.employeeName);
    setDepartment(item.department);
    setDurationDays(String(item.durationDays));
    setProgressPct(String(item.progressPct));
    setFocusArea(item.focusArea);
    setStatus(item.status);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!empName.trim()) return;
    const pct = Math.min(100, Math.max(0, Number(progressPct) || 0));
    if (editingId) {
      onChange(
        items.map((item) =>
          item.id === editingId
            ? {
                ...item,
                employeeName: empName.trim(),
                department,
                durationDays: Number(durationDays) || 90,
                progressPct: status === "passed" ? 100 : pct,
                focusArea: focusArea.trim() || item.focusArea,
                status,
              }
            : item
        )
      );
      onNotify(`อัปเดตแผน PIP ของ "${empName.trim()}" เรียบร้อยแล้ว`);
    } else {
      const created: PipRecordItem = {
        id: `PIP-${Date.now()}`,
        code: `PIP-69-${String(items.length + 1).padStart(2, "0")}`,
        employeeCode: "EMP-1135",
        employeeName: empName.trim(),
        department,
        position: "พนักงาน",
        managerName: "พิมพ์ชนก วัฒนากูล",
        durationDays: Number(durationDays) || 90,
        periodLabel: `เริ่มวันนี้ (${durationDays} วัน)`,
        progressPct: pct,
        focusArea: focusArea.trim() || "ปรับปรุงผลการปฏิบัติงานตามเป้าหมายหลัก",
        status,
      };
      onChange([created, ...items]);
      onNotify(`เปิดแผนปรับปรุงผลงาน (PIP) ให้ "${created.employeeName}" แล้ว`);
    }
    setModalOpen(false);
  };

  const markPassed = (item: PipRecordItem) => {
    onChange(
      items.map((i) => (i.id === item.id ? { ...i, status: "passed", progressPct: 100 } : i))
    );
    onNotify(`ปิดแผน PIP ของ "${item.employeeName}" เป็น "ผ่านเกณฑ์ PIP" แล้ว`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="ค้นหารหัส ชื่อพนักงาน หรือแผนก..."
          containerClassName="w-full sm:w-72"
        />
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={openCreate}>
          เปิดแผน PIP ใหม่
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="ไม่พบรายการแผนปรับปรุงผลงาน (PIP)"
          description="ลองปรับคำค้นหาใหม่"
        />
      ) : (
        <TableContainer className="rounded-xl border border-[#EEF2F6]">
          <Table>
            <TableHeader className="bg-[#F8FAFC]">
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-5">รหัส / พนักงานในแผน PIP</TableHead>
                <TableHead>หัวข้อที่ต้องปรับปรุง</TableHead>
                <TableHead className="w-44 px-4">ความคืบหน้า</TableHead>
                <TableHead className="w-36 text-center">สถานะ</TableHead>
                <TableHead className="w-36 pr-5 text-center">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => {
                const st = PIP_STATUS_META[item.status];
                return (
                  <TableRow key={item.id}>
                    <TableCell className="py-3.5 pl-5">
                      <span className="rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                        {item.code}
                      </span>
                      <p className="mt-1 font-semibold text-[#1E293B]">{item.employeeName}</p>
                      <p className="text-xs text-[#94A3B8]">
                        {item.department} • {item.periodLabel}
                      </p>
                    </TableCell>
                    <TableCell className="max-w-md py-3.5 text-xs text-[#334155]">
                      {item.focusArea}
                    </TableCell>
                    <TableCell className="py-3.5 px-4">
                      <Tooltip
                        className="block w-full"
                        content={`ความคืบหน้าแผน PIP ${item.durationDays} วัน: ${item.progressPct}%`}
                      >
                        <div className="w-full cursor-help space-y-1.5">
                          <div className="flex items-center justify-between gap-2 text-xs tabular-nums">
                            <span className="text-[#64748B]">{item.durationDays} วัน</span>
                            <span className="font-semibold text-[#1E293B]">{item.progressPct}%</span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-[#EEF2F6]">
                            <div
                              className={`h-full rounded-full ${
                                item.status === "passed" ? "bg-[#22B89A]" : "bg-[#F5B73B]"
                              }`}
                              style={{ width: `${item.progressPct}%` }}
                            />
                          </div>
                        </div>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="py-3.5 text-center">
                      <Tooltip title={st.label} content={st.hint}>
                        <Badge variant={st.variant} dot className="cursor-help">
                          {st.label}
                        </Badge>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="py-3.5 pr-5 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <Tooltip content="อัปเดตผลติดตามแผน PIP">
                          <button
                            type="button"
                            onClick={() => openEdit(item)}
                            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[#64748B] hover:bg-[#EFF6FF] hover:text-[#2563EB]"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        </Tooltip>
                        {item.status !== "passed" ? (
                          <Tooltip content="บันทึกว่าผ่านเกณฑ์และปิดแผน PIP">
                            <button
                              type="button"
                              onClick={() => markPassed(item)}
                              className="inline-flex w-[76px] shrink-0 cursor-pointer items-center justify-center gap-1 rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-1.5 text-xs font-medium text-[#334155] hover:border-[#22B89A] hover:bg-[#ECFAF5] hover:text-[#1CA388] whitespace-nowrap"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 text-[#22B89A]" />
                              ปิดแผน
                            </button>
                          </Tooltip>
                        ) : (
                          <span aria-hidden="true" className="inline-block w-[76px] shrink-0" />
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
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "อัปเดตผลติดตามแผน PIP" : "เปิดแผนปรับปรุงผลงาน (PIP) ใหม่"}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              ยกเลิก
            </Button>
            <Button disabled={!empName.trim()} onClick={handleSave}>
              {editingId ? "บันทึกผลติดตาม" : "เปิดแผน PIP"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="ชื่อพนักงาน"
              value={empName}
              onChange={(e) => setEmpName(e.target.value)}
              required
            />
            <Select
              label="แผนก"
              value={department}
              onChange={setDepartment}
              options={TRAINING_DEPARTMENT_OPTIONS.filter((o) => o.value !== "all")}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Select
              label="ระยะเวลา PIP"
              value={durationDays}
              onChange={setDurationDays}
              options={[
                { value: "60", label: "60 วัน" },
                { value: "90", label: "90 วัน" },
              ]}
            />
            <Input
              label="ความคืบหน้า (%)"
              type="number"
              min={0}
              max={100}
              value={progressPct}
              onChange={(e) => setProgressPct(e.target.value)}
            />
            <Select
              label="สถานะ"
              value={status}
              onChange={(v) => setStatus(v as PipStatus)}
              options={[
                { value: "active", label: "กำลังติดตามผล" },
                { value: "passed", label: "ผ่านเกณฑ์ PIP" },
                { value: "extended", label: "ขยายเวลา PIP" },
              ]}
            />
          </div>
          <Input
            label="เป้าหมายที่ต้องปรับปรุงให้ชัดเจน"
            placeholder="ระบุตัวชี้วัดและเกณฑ์ที่ต้องทำให้ได้ภายในกรอบเวลา"
            value={focusArea}
            onChange={(e) => setFocusArea(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}
