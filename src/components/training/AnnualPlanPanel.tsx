"use client";

import { useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, FolderOpen, Plus } from "lucide-react";
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
import {
  TRAINING_CATEGORY_OPTIONS,
  TRAINING_DEPARTMENT_OPTIONS,
  type AnnualPlanItem,
  type AnnualPlanStatus,
} from "@/data/mock/trainingPlanning";

interface AnnualPlanPanelProps {
  items: AnnualPlanItem[];
  onChange: (items: AnnualPlanItem[]) => void;
  onNotify: (message: string) => void;
}

const PAGE_SIZE = 5;

const QUARTER_PILLS: { value: "all" | "Q1" | "Q2" | "Q3" | "Q4"; label: string; tip: string }[] = [
  { value: "all", label: "ทั้งปี 2569", tip: "แสดงแผนฝึกอบรมครบทั้ง 4 ไตรมาส" },
  { value: "Q1", label: "Q1", tip: "ไตรมาส 1 (ม.ค. – มี.ค. 2569)" },
  { value: "Q2", label: "Q2", tip: "ไตรมาส 2 (เม.ย. – มิ.ย. 2569)" },
  { value: "Q3", label: "Q3", tip: "ไตรมาส 3 (ก.ค. – ก.ย. 2569)" },
  { value: "Q4", label: "Q4", tip: "ไตรมาส 4 (ต.ค. – ธ.ค. 2569)" },
];

const QUARTER_MONTH_HINTS: Record<AnnualPlanItem["quarter"], string> = {
  Q1: "ไตรมาส 1 (ม.ค. – มี.ค. 2569)",
  Q2: "ไตรมาส 2 (เม.ย. – มิ.ย. 2569)",
  Q3: "ไตรมาส 3 (ก.ค. – ก.ย. 2569)",
  Q4: "ไตรมาส 4 (ต.ค. – ธ.ค. 2569)",
};

const PLAN_STATUS_META: Record<
  AnnualPlanStatus,
  { label: string; variant: "neutral" | "primary" | "success" | "warning"; hint: string }
> = {
  planned: { label: "ตามแผน", variant: "neutral", hint: "จัดสรรงบแล้ว รอเปิดรุ่นฝึกอบรมตามไตรมาส" },
  "in-progress": { label: "กำลังดำเนินการ", variant: "primary", hint: "กำลังเปิดรับสมัครหรือดำเนินการอบรมบางรุ่นแล้ว" },
  completed: { label: "เสร็จสิ้น", variant: "success", hint: "อบรมครบทุกรุ่นและสรุปผลเรียบร้อยแล้ว" },
  postponed: { label: "เลื่อนกำหนด", variant: "warning", hint: "เลื่อนกำหนดการอบรมไปช่วงเวลาถัดไป" },
};

export function AnnualPlanPanel({ items, onChange, onNotify }: AnnualPlanPanelProps) {
  const [quarter, setQuarter] = useState<"all" | "Q1" | "Q2" | "Q3" | "Q4">("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  const [courseTitle, setCourseTitle] = useState("");
  const [category, setCategory] = useState("Leadership");
  const [formQuarter, setFormQuarter] = useState<AnnualPlanItem["quarter"]>("Q4");
  const [department, setDepartment] = useState("ทุกแผนก (องค์กร)");
  const [sessions, setSessions] = useState("2");
  const [participants, setParticipants] = useState("40");
  const [budget, setBudget] = useState("90000");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchQ = quarter === "all" || item.quarter === quarter;
      const matchQuery =
        !q ||
        item.code.toLowerCase().includes(q) ||
        item.courseTitle.toLowerCase().includes(q) ||
        item.department.toLowerCase().includes(q);
      return matchQ && matchQuery;
    });
  }, [items, quarter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleStatusChange = (id: string, status: AnnualPlanStatus) => {
    onChange(items.map((item) => (item.id === id ? { ...item, status } : item)));
    onNotify(`อัปเดตสถานะแผนฝึกอบรมเป็น "${PLAN_STATUS_META[status].label}" แล้ว`);
  };

  const handleCreate = () => {
    if (!courseTitle.trim()) return;
    const nextNum = String(items.length + 1).padStart(2, "0");
    const created: AnnualPlanItem = {
      id: `AP-${Date.now()}`,
      code: `PLN-2569-${nextNum}`,
      courseTitle: courseTitle.trim(),
      category,
      quarter: formQuarter,
      department,
      sessions: Math.max(1, Number(sessions) || 1),
      targetParticipants: Math.max(1, Number(participants) || 1),
      budgetAllocated: Math.max(0, Number(budget) || 0),
      status: "planned",
    };
    onChange([created, ...items]);
    setCourseTitle("");
    setPage(1);
    setModalOpen(false);
    onNotify(`บรรจุหลักสูตร "${created.courseTitle}" ลงแผนประจำปีแล้ว`);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <div className="inline-flex flex-wrap items-center gap-1 rounded-xl bg-[#F4F6FA] p-1 text-xs">
            {QUARTER_PILLS.map((pill) => (
              <Tooltip key={pill.value} content={pill.tip}>
                <button
                  type="button"
                  onClick={() => {
                    setQuarter(pill.value);
                    setPage(1);
                  }}
                  className={`rounded-lg px-3 py-1.5 font-medium transition-all cursor-pointer ${
                    quarter === pill.value
                      ? "bg-[#2563EB] text-white shadow-2xs"
                      : "text-[#64748B] hover:bg-white/70 hover:text-[#1E293B]"
                  }`}
                >
                  {pill.label}
                </button>
              </Tooltip>
            ))}
          </div>

          <SearchBar
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="ค้นหาหลักสูตร หรือแผนก..."
            containerClassName="w-full sm:w-64"
          />
        </div>

        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setModalOpen(true)}>
          เพิ่มแผนประจำปี
        </Button>
      </div>

      {/* Table */}
      {paged.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="ไม่พบแผนฝึกอบรมในช่วงที่เลือก"
          description="ลองเลือกไตรมาสอื่น หรือล้างคำค้นหา"
          action={
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setQuarter("all");
                setSearch("");
                setPage(1);
              }}
            >
              แสดงทั้งปี
            </Button>
          }
        />
      ) : (
        <>
          <TableContainer className="rounded-xl border border-[#EEF2F6]">
            <Table>
              <TableHeader className="bg-[#F8FAFC]">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="min-w-[260px] pl-5">หลักสูตรในแผน</TableHead>
                  <TableHead className="w-24 text-center">ไตรมาส</TableHead>
                  <TableHead className="w-48">กลุ่มเป้าหมาย</TableHead>
                  <TableHead className="w-36 text-right">จำนวนรุ่น / ผู้เรียน</TableHead>
                  <TableHead className="w-36 pr-6 text-right">งบประมาณ</TableHead>
                  <TableHead className="w-40 text-center">สถานะ</TableHead>
                  <TableHead className="w-32 pr-5 text-center">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((item) => {
                  const st = PLAN_STATUS_META[item.status];
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="py-3.5 pl-5">
                        <span className="rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                          {item.code}
                        </span>
                        <p className="mt-1 font-semibold text-[#1E293B]">{item.courseTitle}</p>
                        <p className="text-xs text-[#94A3B8]">{item.category}</p>
                      </TableCell>
                      <TableCell className="py-3.5 text-center">
                        <Tooltip content={QUARTER_MONTH_HINTS[item.quarter]}>
                          <span className="inline-flex items-center gap-1 rounded-md bg-[#EFF6FF] px-2.5 py-1 text-xs font-semibold text-[#2563EB] cursor-help">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {item.quarter}
                          </span>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="py-3.5 text-sm text-[#475569] whitespace-nowrap">
                        {item.department}
                      </TableCell>
                      <TableCell className="py-3.5 text-right tabular-nums">
                        <Tooltip
                          content={`เฉลี่ยรุ่นละ ${Math.round(item.targetParticipants / Math.max(1, item.sessions))} คน`}
                        >
                          <div className="inline-block cursor-help">
                            <p className="font-semibold text-[#1E293B]">{item.sessions} รุ่น</p>
                            <p className="text-xs text-[#94A3B8]">
                              {item.targetParticipants.toLocaleString()} คน
                            </p>
                          </div>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="py-3.5 pr-6 text-right tabular-nums font-semibold text-[#1E293B]">
                        <Tooltip
                          content={`เฉลี่ย ฿${Math.round(item.budgetAllocated / Math.max(1, item.sessions)).toLocaleString()} / รุ่น`}
                        >
                          <span className="cursor-help">
                            ฿{item.budgetAllocated.toLocaleString()}
                          </span>
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
                        {item.status !== "completed" ? (
                          <Tooltip content="บันทึกว่าจัดอบรมครบทุกรุ่นและปิดแผนรายการนี้แล้ว">
                            <button
                              type="button"
                              onClick={() => handleStatusChange(item.id, "completed")}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-medium text-[#334155] shadow-2xs transition-all hover:border-[#22B89A] hover:bg-[#ECFAF5] hover:text-[#1CA388] cursor-pointer whitespace-nowrap"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 text-[#22B89A]" />
                              ปิดแผน
                            </button>
                          </Tooltip>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-[#94A3B8] whitespace-nowrap">
                            <CheckCircle2 className="h-3.5 w-3.5 text-[#CBD5E1]" />
                            ปิดแผนแล้ว
                          </span>
                        )}
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

      {/* Add Annual Plan Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="เพิ่มรายการในแผนฝึกอบรมประจำปี 2569"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              ยกเลิก
            </Button>
            <Button disabled={!courseTitle.trim()} onClick={handleCreate}>
              เพิ่มลงแผนประจำปี
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="ชื่อหลักสูตร"
            placeholder="เช่น Agile Project Management Workshop"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            required
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="หมวดหมู่"
              value={category}
              onChange={setCategory}
              options={TRAINING_CATEGORY_OPTIONS.filter((o) => o.value !== "all")}
            />
            <Select
              label="ไตรมาสที่จัดอบรม"
              value={formQuarter}
              onChange={(v) => setFormQuarter(v as AnnualPlanItem["quarter"])}
              options={[
                { value: "Q1", label: "Q1 (ม.ค. – มี.ค.)" },
                { value: "Q2", label: "Q2 (เม.ย. – มิ.ย.)" },
                { value: "Q3", label: "Q3 (ก.ค. – ก.ย.)" },
                { value: "Q4", label: "Q4 (ต.ค. – ธ.ค.)" },
              ]}
            />
          </div>
          <Select
            label="กลุ่มเป้าหมาย / แผนก"
            value={department}
            onChange={setDepartment}
            options={TRAINING_DEPARTMENT_OPTIONS.filter((o) => o.value !== "all")}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input
              label="จำนวนรุ่น"
              type="number"
              min={1}
              value={sessions}
              onChange={(e) => setSessions(e.target.value)}
            />
            <Input
              label="ผู้เรียนเป้าหมาย (คน)"
              type="number"
              min={1}
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
            />
            <Input
              label="งบประมาณจัดสรร (บาท)"
              type="number"
              min={0}
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
