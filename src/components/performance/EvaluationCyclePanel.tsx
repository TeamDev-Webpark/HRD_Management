"use client";

import { useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, FolderOpen, Pencil, Plus } from "lucide-react";
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
import type { CycleStatus, EvaluationCycleItem } from "@/data/mock/pmsSetup";

interface EvaluationCyclePanelProps {
  items: EvaluationCycleItem[];
  onChange: (items: EvaluationCycleItem[]) => void;
  onNotify: (message: string) => void;
}

const PAGE_SIZE = 5;

const CYCLE_STATUS_META: Record<
  CycleStatus,
  { label: string; variant: "primary" | "warning" | "success"; hint: string }
> = {
  active: { label: "กำลังเปิดประเมิน", variant: "primary", hint: "พนักงานและหัวหน้างานสามารถกรอกแบบประเมินได้ในรอบนี้" },
  upcoming: { label: "รอเปิดรอบ", variant: "warning", hint: "ตั้งค่าโครงสร้างไว้ล่วงหน้า ยังไม่เปิดให้พนักงานเข้าประเมิน" },
  closed: { label: "ปิดรอบแล้ว", variant: "success", hint: "สรุปผล Calibration และล็อกคะแนนประเมินเรียบร้อยแล้ว" },
};

const TYPE_META: Record<
  EvaluationCycleItem["cycleType"],
  { variant: "primary" | "success" | "warning" | "neutral"; hint: string }
> = {
  Annual: { variant: "primary", hint: "รอบประเมินประจำปีเชื่อมโยงการปรับเงินเดือนและโบนัส" },
  "Mid-Year": { variant: "success", hint: "รอบทบทวนผลงานกลางปีเพื่อปรับแผนงานและโค้ชชิ่ง" },
  Probation: { variant: "warning", hint: "ประเมินพนักงานใหม่ครบกำหนดทดลองงาน 119 วัน" },
  Quarterly: { variant: "neutral", hint: "รอบติดตามผล OKR / KPI รายไตรมาส" },
};

export function EvaluationCyclePanel({ items, onChange, onNotify }: EvaluationCyclePanelProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | CycleStatus>("all");
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [cycleType, setCycleType] = useState<EvaluationCycleItem["cycleType"]>("Annual");
  const [periodLabel, setPeriodLabel] = useState("1 ม.ค. – 31 ธ.ค. 2570");
  const [reviewWindow, setReviewWindow] = useState("1 – 20 ธ.ค. 2570");
  const [kpiWeight, setKpiWeight] = useState("60");
  const [status, setStatus] = useState<CycleStatus>("upcoming");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchStatus = statusFilter === "all" || item.status === statusFilter;
      const matchQuery =
        !q ||
        item.code.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.cycleType.toLowerCase().includes(q);
      return matchStatus && matchQuery;
    });
  }, [items, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const openCreate = () => {
    setEditingId(null);
    setName("");
    setCycleType("Annual");
    setPeriodLabel("1 ม.ค. – 31 ธ.ค. 2570");
    setReviewWindow("1 – 20 ธ.ค. 2570");
    setKpiWeight("60");
    setStatus("upcoming");
    setModalOpen(true);
  };

  const openEdit = (item: EvaluationCycleItem) => {
    setEditingId(item.id);
    setName(item.name);
    setCycleType(item.cycleType);
    setPeriodLabel(item.periodLabel);
    setReviewWindow(item.reviewWindow);
    setKpiWeight(String(item.kpiWeight));
    setStatus(item.status);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    const kpi = Math.min(100, Math.max(0, Number(kpiWeight) || 60));
    const comp = 100 - kpi;

    if (editingId) {
      onChange(
        items.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name: name.trim(),
                cycleType,
                periodLabel: periodLabel.trim() || item.periodLabel,
                reviewWindow: reviewWindow.trim() || item.reviewWindow,
                kpiWeight: kpi,
                competencyWeight: comp,
                status,
              }
            : item
        )
      );
      onNotify(`อัปเดตรอบการประเมิน "${name.trim()}" เรียบร้อยแล้ว`);
    } else {
      const created: EvaluationCycleItem = {
        id: `CYC-${Date.now()}`,
        code: `PMS-2570-${String(items.length + 1).padStart(2, "0")}`,
        name: name.trim(),
        cycleType,
        periodLabel: periodLabel.trim() || "1 ม.ค. – 31 ธ.ค. 2570",
        reviewWindow: reviewWindow.trim() || "รอระบุกำหนดการ",
        eligibleEmployees: 482,
        submittedCount: 0,
        kpiWeight: kpi,
        competencyWeight: comp,
        status,
      };
      onChange([created, ...items]);
      setPage(1);
      onNotify(`สร้างรอบการประเมิน "${created.name}" แล้ว`);
    }
    setModalOpen(false);
  };

  const toggleCycleStatus = (item: EvaluationCycleItem) => {
    const nextStatus: CycleStatus = item.status === "active" ? "closed" : "active";
    onChange(items.map((c) => (c.id === item.id ? { ...c, status: nextStatus } : c)));
    onNotify(
      nextStatus === "closed"
        ? `ปิดรอบการประเมิน "${item.code}" เรียบร้อยแล้ว`
        : `เปิดรอบการประเมิน "${item.code}" ให้พนักงานเข้าประเมินแล้ว`
    );
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <SearchBar
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="ค้นหารหัส หรือชื่อรอบการประเมิน..."
            containerClassName="w-full sm:w-64"
          />
          <Select
            value={statusFilter}
            onChange={(v) => {
              setStatusFilter(v as "all" | CycleStatus);
              setPage(1);
            }}
            options={[
              { value: "all", label: "ทุกสถานะรอบประเมิน" },
              { value: "active", label: "กำลังเปิดประเมิน" },
              { value: "upcoming", label: "รอเปิดรอบ" },
              { value: "closed", label: "ปิดรอบแล้ว" },
            ]}
            className="w-full sm:w-48"
          />
        </div>

        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={openCreate}>
          สร้างรอบการประเมินใหม่
        </Button>
      </div>

      {/* Table */}
      {paged.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="ไม่พบรอบการประเมินที่ค้นหา"
          description="ลองปรับคำค้นหาหรือตัวกรองสถานะ"
          action={
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
                setPage(1);
              }}
            >
              ล้างตัวกรอง
            </Button>
          }
        />
      ) : (
        <>
          <TableContainer className="rounded-xl border border-[#EEF2F6]">
            <Table>
              <TableHeader className="bg-[#F8FAFC]">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-5">รหัส / รอบการประเมิน</TableHead>
                  <TableHead className="w-28 text-center">ประเภท</TableHead>
                  <TableHead className="w-40 text-center">สัดส่วนน้ำหนัก</TableHead>
                  <TableHead className="w-48 px-4">ความคืบหน้าการส่ง</TableHead>
                  <TableHead className="w-36 text-center">สถานะ</TableHead>
                  <TableHead className="w-36 pr-5 text-center">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((item) => {
                  const st = CYCLE_STATUS_META[item.status];
                  const tp = TYPE_META[item.cycleType];
                  const pct = item.eligibleEmployees
                    ? Math.round((item.submittedCount / item.eligibleEmployees) * 100)
                    : 0;
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="py-3.5 pl-5">
                        <span className="rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                          {item.code}
                        </span>
                        <p className="mt-1 font-semibold text-[#1E293B]">{item.name}</p>
                        <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-[#94A3B8]">
                          <CalendarDays className="h-3.5 w-3.5 text-[#94A3B8]" />
                          รอบผลงาน {item.periodLabel} • ช่วงประเมิน {item.reviewWindow}
                        </p>
                      </TableCell>
                      <TableCell className="py-3.5 text-center">
                        <Tooltip title={item.cycleType} content={tp.hint}>
                          <Badge variant={tp.variant} className="cursor-help">
                            {item.cycleType}
                          </Badge>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="py-3.5 text-center">
                        <Tooltip
                          content={`ค่าน้ำหนัก KPI / เป้าหมาย ${item.kpiWeight}% และสมรรถนะ (Competency) ${item.competencyWeight}%`}
                        >
                          <span className="inline-flex cursor-help items-center gap-1 rounded-lg bg-[#F8FAFC] px-2.5 py-1 text-xs font-medium text-[#334155] ring-1 ring-[#EEF2F6]">
                            KPI {item.kpiWeight}% / Comp {item.competencyWeight}%
                          </span>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="py-3.5 px-4">
                        <Tooltip
                          className="block w-full"
                          content={`ส่งผลประเมินแล้ว ${item.submittedCount} จาก ${item.eligibleEmployees} คน (${pct}%)`}
                        >
                          <div className="w-full cursor-help space-y-1.5">
                            <div className="flex items-center justify-between gap-2 text-xs tabular-nums">
                              <span className="text-[#64748B]">
                                {item.submittedCount}/{item.eligibleEmployees} คน
                              </span>
                              <span className="font-semibold text-[#1E293B]">{pct}%</span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-[#EEF2F6]">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  pct >= 100 ? "bg-[#22B89A]" : "bg-[#2563EB]"
                                }`}
                                style={{ width: `${pct}%` }}
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
                          <Tooltip content="แก้ไขรายละเอียดรอบการประเมิน">
                            <button
                              type="button"
                              onClick={() => openEdit(item)}
                              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[#64748B] hover:bg-[#EFF6FF] hover:text-[#2563EB]"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                          </Tooltip>
                          {item.status !== "closed" ? (
                            <Tooltip
                              content={
                                item.status === "active"
                                  ? "ปิดรอบการประเมินและล็อกคะแนน"
                                  : "เปิดรอบให้พนักงานเริ่มเข้าประเมิน"
                              }
                            >
                              <button
                                type="button"
                                onClick={() => toggleCycleStatus(item)}
                                className="inline-flex w-[76px] shrink-0 cursor-pointer items-center justify-center gap-1 rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-1.5 text-xs font-medium text-[#334155] transition-colors hover:border-[#22B89A] hover:bg-[#ECFAF5] hover:text-[#1CA388] whitespace-nowrap"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5 text-[#22B89A]" />
                                {item.status === "active" ? "ปิดรอบ" : "เปิดรอบ"}
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

          <Pagination
            currentPage={currentPage}
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </>
      )}

      {/* Create / Edit Cycle Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "แก้ไขรอบการประเมินผล" : "สร้างรอบการประเมินผลใหม่"}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              ยกเลิก
            </Button>
            <Button disabled={!name.trim()} onClick={handleSave}>
              {editingId ? "บันทึกการแก้ไข" : "สร้างรอบประเมิน"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="ชื่อรอบการประเมิน"
            placeholder="เช่น การประเมินผลการปฏิบัติงานประจำปี 2570"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="ประเภทรอบประเมิน"
              value={cycleType}
              onChange={(v) => setCycleType(v as EvaluationCycleItem["cycleType"])}
              options={[
                { value: "Annual", label: "ประจำปี (Annual)" },
                { value: "Mid-Year", label: "กลางปี (Mid-Year)" },
                { value: "Probation", label: "ทดลองงาน (Probation)" },
                { value: "Quarterly", label: "รายไตรมาส (Quarterly)" },
              ]}
            />
            <Select
              label="สถานะเริ่มต้น"
              value={status}
              onChange={(v) => setStatus(v as CycleStatus)}
              options={[
                { value: "upcoming", label: "รอเปิดรอบ" },
                { value: "active", label: "กำลังเปิดประเมิน" },
                { value: "closed", label: "ปิดรอบแล้ว" },
              ]}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="ช่วงเวลาผลงานที่ประเมิน"
              value={periodLabel}
              onChange={(e) => setPeriodLabel(e.target.value)}
            />
            <Input
              label="ช่วงเวลาเปิดให้กรอกประเมิน"
              value={reviewWindow}
              onChange={(e) => setReviewWindow(e.target.value)}
            />
          </div>
          <Input
            label="สัดส่วนน้ำหนัก KPI (%)"
            type="number"
            min={0}
            max={100}
            value={kpiWeight}
            onChange={(e) => setKpiWeight(e.target.value)}
            helperText={`สัดส่วนสมรรถนะ (Competency) จะถูกคำนวณอัตโนมัติเป็น ${Math.max(0, 100 - (Number(kpiWeight) || 0))}%`}
          />
        </div>
      </Modal>
    </div>
  );
}
