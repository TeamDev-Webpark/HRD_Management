"use client";

import { useMemo, useState } from "react";
import { Check, FolderOpen, Pencil, Plus } from "lucide-react";
import {
  Badge,
  Button,
  EmptyState,
  Input,
  Modal,
  Pagination,
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
import type { GoalFramework, GoalItem, GoalStatus } from "@/data/mock/pmsGoals";
import { TRAINING_DEPARTMENT_OPTIONS } from "@/data/mock/trainingPlanning";

interface GoalSettingPanelProps {
  items: GoalItem[];
  onChange: (items: GoalItem[]) => void;
  onNotify: (message: string) => void;
}

const PAGE_SIZE = 5;

const FRAMEWORK_META: Record<
  GoalFramework,
  { variant: "primary" | "success" | "warning"; hint: string }
> = {
  OKR: { variant: "primary", hint: "Objectives & Key Results — เป้าหมายเชิงกลยุทธ์ที่ท้าทายและวัดผลได้" },
  KPI: { variant: "success", hint: "Key Performance Indicator — ตัวชี้วัดผลงานหลักประจำตำแหน่ง" },
  MBO: { variant: "warning", hint: "Management by Objectives — เป้าหมายโครงการที่ตกลงร่วมกับหัวหน้างาน" },
};

const GOAL_STATUS_META: Record<
  GoalStatus,
  { label: string; variant: "primary" | "danger" | "success" | "warning"; hint: string }
> = {
  "on-track": { label: "ตามแผน", variant: "primary", hint: "ความคืบหน้าเป็นไปตามกรอบเวลาที่กำหนด" },
  "at-risk": { label: "เสี่ยงล่าช้า", variant: "danger", hint: "ต่ำกว่าเกณฑ์เป้าหมาย ควรเร่งแก้ไขหรือขอการสนับสนุน" },
  achieved: { label: "บรรลุเป้าหมาย", variant: "success", hint: "ทำผลงานได้ครบหรือสูงกว่าเป้าหมายแล้ว" },
  pending: { label: "รออนุมัติเป้า", variant: "warning", hint: "พนักงานเสนอเป้าหมายใหม่ รอหัวหน้างานอนุมัติ" },
};

export function GoalSettingPanel({ items, onChange, onNotify }: GoalSettingPanelProps) {
  const [search, setSearch] = useState("");
  const [frameworkFilter, setFrameworkFilter] = useState<"all" | GoalFramework>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | GoalStatus>("all");
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [framework, setFramework] = useState<GoalFramework>("OKR");
  const [ownerName, setOwnerName] = useState("ณัฐพล เจริญสุข");
  const [department, setDepartment] = useState("ฝ่ายวิศวกรรมซอฟต์แวร์");
  const [weight, setWeight] = useState("25");
  const [targetLabel, setTargetLabel] = useState("");
  const [actualLabel, setActualLabel] = useState("");
  const [progressPct, setProgressPct] = useState("0");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchFw = frameworkFilter === "all" || item.framework === frameworkFilter;
      const matchSt = statusFilter === "all" || item.status === statusFilter;
      const matchQuery =
        !q ||
        item.code.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.ownerName.toLowerCase().includes(q) ||
        item.department.toLowerCase().includes(q);
      return matchFw && matchSt && matchQuery;
    });
  }, [items, search, frameworkFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const openCreate = () => {
    setEditingId(null);
    setTitle("");
    setFramework("OKR");
    setOwnerName("ณัฐพล เจริญสุข");
    setDepartment("ฝ่ายวิศวกรรมซอฟต์แวร์");
    setWeight("25");
    setTargetLabel("100% ตามกำหนด");
    setActualLabel("กำลังเริ่มต้น");
    setProgressPct("0");
    setModalOpen(true);
  };

  const openEdit = (item: GoalItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setFramework(item.framework);
    setOwnerName(item.ownerName);
    setDepartment(item.department);
    setWeight(String(item.weight));
    setTargetLabel(item.targetLabel);
    setActualLabel(item.actualLabel);
    setProgressPct(String(item.progressPct));
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!title.trim()) return;
    const pct = Math.min(100, Math.max(0, Number(progressPct) || 0));
    const derivedStatus: GoalStatus =
      pct >= 100 ? "achieved" : pct < 60 && editingId ? "at-risk" : editingId ? "on-track" : "pending";

    if (editingId) {
      onChange(
        items.map((item) =>
          item.id === editingId
            ? {
                ...item,
                title: title.trim(),
                framework,
                ownerName: ownerName.trim() || item.ownerName,
                department,
                weight: Math.min(100, Math.max(5, Number(weight) || 20)),
                targetLabel: targetLabel.trim() || item.targetLabel,
                actualLabel: actualLabel.trim() || item.actualLabel,
                progressPct: pct,
                status: derivedStatus,
              }
            : item
        )
      );
      onNotify(`อัปเดตเป้าหมายและผลงาน "${title.trim()}" เรียบร้อยแล้ว`);
    } else {
      const created: GoalItem = {
        id: `GL-${Date.now()}`,
        code: `${framework}-69-${String(items.length + 1).padStart(2, "0")}`,
        title: title.trim(),
        framework,
        ownerName: ownerName.trim() || "พนักงาน",
        employeeCode: "EMP-1024",
        department,
        weight: Math.min(100, Math.max(5, Number(weight) || 20)),
        targetLabel: targetLabel.trim() || "100%",
        actualLabel: actualLabel.trim() || "รออัปเดต",
        progressPct: pct,
        dueDate: "31 ธ.ค. 2569",
        status: "pending",
      };
      onChange([created, ...items]);
      setPage(1);
      onNotify(`เพิ่มเป้าหมายใหม่ "${created.title}" ส่งอนุมัติแล้ว`);
    }
    setModalOpen(false);
  };

  const approveGoal = (item: GoalItem) => {
    onChange(items.map((g) => (g.id === item.id ? { ...g, status: "on-track" } : g)));
    onNotify(`อนุมัติเป้าหมาย ${item.code} ของ "${item.ownerName}" แล้ว`);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <SearchBar
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="ค้นหาเป้าหมาย ชื่อพนักงาน หรือแผนก..."
            containerClassName="w-full sm:w-64"
          />
          <Select
            value={frameworkFilter}
            onChange={(v) => {
              setFrameworkFilter(v as "all" | GoalFramework);
              setPage(1);
            }}
            options={[
              { value: "all", label: "ทุกรูปแบบ (KPI/OKR/MBO)" },
              { value: "OKR", label: "OKR" },
              { value: "KPI", label: "KPI" },
              { value: "MBO", label: "MBO" },
            ]}
            className="w-full sm:w-48"
          />
          <Select
            value={statusFilter}
            onChange={(v) => {
              setStatusFilter(v as "all" | GoalStatus);
              setPage(1);
            }}
            options={[
              { value: "all", label: "ทุกสถานะเป้าหมาย" },
              { value: "on-track", label: "ตามแผน" },
              { value: "at-risk", label: "เสี่ยงล่าช้า" },
              { value: "achieved", label: "บรรลุเป้าหมาย" },
              { value: "pending", label: "รออนุมัติเป้า" },
            ]}
            className="w-full sm:w-44"
          />
        </div>

        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={openCreate}>
          ตั้งเป้าหมายใหม่
        </Button>
      </div>

      {/* Table */}
      {paged.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="ไม่พบรายการเป้าหมายที่ค้นหา"
          description="ลองปรับคำค้นหาหรือตัวกรองรูปแบบ/สถานะ"
        />
      ) : (
        <>
          <TableContainer className="rounded-xl border border-[#EEF2F6]">
            <Table>
              <TableHeader className="bg-[#F8FAFC]">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-5">รหัส / เป้าหมาย (KPI / OKR / MBO)</TableHead>
                  <TableHead className="w-24 text-center">รูปแบบ</TableHead>
                  <TableHead className="w-24 pr-6 text-right">น้ำหนัก</TableHead>
                  <TableHead className="w-48 px-4">ความคืบหน้าผลงาน</TableHead>
                  <TableHead className="w-36 text-center">สถานะ</TableHead>
                  <TableHead className="w-32 pr-5 text-center">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((item) => {
                  const fw = FRAMEWORK_META[item.framework];
                  const st = GOAL_STATUS_META[item.status];
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="py-3.5 pl-5">
                        <span className="rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                          {item.code}
                        </span>
                        <p className="mt-1 font-semibold text-[#1E293B]">{item.title}</p>
                        <p className="text-xs text-[#94A3B8]">
                          {item.ownerName} • {item.department} • เป้าหมาย: {item.targetLabel}
                        </p>
                      </TableCell>
                      <TableCell className="py-3.5 text-center">
                        <Tooltip title={item.framework} content={fw.hint}>
                          <Badge variant={fw.variant} className="cursor-help">
                            {item.framework}
                          </Badge>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="py-3.5 pr-6 text-right tabular-nums font-semibold text-[#1E293B]">
                        {item.weight}%
                      </TableCell>
                      <TableCell className="py-3.5 px-4">
                        <Tooltip
                          className="block w-full"
                          content={`ผลจริง: ${item.actualLabel} (เป้าหมาย: ${item.targetLabel})`}
                        >
                          <div className="w-full cursor-help space-y-1.5">
                            <div className="flex items-center justify-between gap-2 text-xs tabular-nums">
                              <span className="truncate text-[#64748B]">{item.actualLabel}</span>
                              <span className="shrink-0 font-semibold text-[#1E293B]">
                                {item.progressPct}%
                              </span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-[#EEF2F6]">
                              <div
                                className={`h-full rounded-full ${
                                  item.status === "at-risk"
                                    ? "bg-[#EF4444]"
                                    : item.progressPct >= 100
                                      ? "bg-[#22B89A]"
                                      : "bg-[#2563EB]"
                                }`}
                                style={{ width: `${item.progressPct}%` }}
                              />
                            </div>
                          </div>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="py-3.5 text-center">
                        <Tooltip title={`สถานะ: ${st.label}`} content={st.hint}>
                          <Badge variant={st.variant} dot className="cursor-help">
                            {st.label}
                          </Badge>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="py-3.5 pr-5 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          {item.status === "pending" ? (
                            <Tooltip content="อนุมัติเป้าหมายนี้เข้าสู่รอบประเมิน">
                              <Button
                                size="sm"
                                variant="primary"
                                className="w-[82px]"
                                leftIcon={<Check className="h-3.5 w-3.5" />}
                                onClick={() => approveGoal(item)}
                              >
                                อนุมัติ
                              </Button>
                            </Tooltip>
                          ) : (
                            <span aria-hidden="true" className="inline-block w-[82px] shrink-0" />
                          )}
                          <Tooltip content="อัปเดตผลจริง / แก้ไขเป้าหมาย">
                            <button
                              type="button"
                              onClick={() => openEdit(item)}
                              className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[#64748B] hover:bg-[#EFF6FF] hover:text-[#2563EB]"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <Pagination
            currentPage={currentPage}
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </>
      )}

      {/* Create / Edit Goal Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "อัปเดตผลงานและเป้าหมาย" : "ตั้งเป้าหมายใหม่ (KPI / OKR / MBO)"}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              ยกเลิก
            </Button>
            <Button disabled={!title.trim()} onClick={handleSave}>
              {editingId ? "บันทึกความคืบหน้า" : "ส่งอนุมัติเป้าหมาย"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="ชื่อเป้าหมาย / ตัวชี้วัด"
            placeholder="เช่น เพิ่มอัตราการส่งมอบงานตรงเวลาเป็น 95%"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Select
              label="รูปแบบเป้าหมาย"
              value={framework}
              onChange={(v) => setFramework(v as GoalFramework)}
              options={[
                { value: "OKR", label: "OKR" },
                { value: "KPI", label: "KPI" },
                { value: "MBO", label: "MBO" },
              ]}
            />
            <Input
              label="เจ้าของเป้าหมาย"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
            />
            <Input
              label="น้ำหนักคะแนน (%)"
              type="number"
              min={5}
              max={100}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
          <Select
            label="แผนก (HRM)"
            value={department}
            onChange={setDepartment}
            options={TRAINING_DEPARTMENT_OPTIONS.filter((o) => o.value !== "all")}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input
              label="ค่าเป้าหมาย (Target)"
              value={targetLabel}
              onChange={(e) => setTargetLabel(e.target.value)}
            />
            <Input
              label="ผลจริงปัจจุบัน (Actual)"
              value={actualLabel}
              onChange={(e) => setActualLabel(e.target.value)}
            />
            <Input
              label="ความคืบหน้า (%)"
              type="number"
              min={0}
              max={100}
              value={progressPct}
              onChange={(e) => setProgressPct(e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
