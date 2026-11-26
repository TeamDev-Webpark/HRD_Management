"use client";

import { useMemo, useState } from "react";
import { Check, FolderOpen, Plus, RotateCcw } from "lucide-react";
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
  type PriorityLevel,
  type TrainingNeedItem,
  type TrainingNeedStatus,
} from "@/data/mock/trainingPlanning";

interface TrainingNeedsPanelProps {
  items: TrainingNeedItem[];
  onChange: (items: TrainingNeedItem[]) => void;
  onNotify: (message: string) => void;
}

const PAGE_SIZE = 5;

const PRIORITY_STYLE: Record<
  PriorityLevel,
  { label: string; variant: "danger" | "warning" | "neutral"; hint: string }
> = {
  high: { label: "เร่งด่วน", variant: "danger", hint: "ควรจัดอบรมภายในไตรมาสนี้เพื่อปิดช่องว่างสำคัญ" },
  medium: { label: "ปานกลาง", variant: "warning", hint: "วางแผนจัดอบรมภายในครึ่งปีนี้ตามลำดับงบประมาณ" },
  low: { label: "ทั่วไป", variant: "neutral", hint: "เสริมทักษะเพิ่มเติม สามารถจัดได้ตามความเหมาะสม" },
};

const SOURCE_HINTS: Record<TrainingNeedItem["source"], string> = {
  "Skill Gap": "พบช่องว่างทักษะจากการประเมิน Skill Matrix / Competency",
  "Manager Request": "หัวหน้างานเสนอขอฝึกอบรมเพิ่มเติมให้สมาชิกในทีม",
  IDP: "รวบรวมจากแผนพัฒนารายบุคคล (IDP) ของพนักงาน",
  Compliance: "หลักสูตรบังคับตามกฎหมายหรือมาตรฐานองค์กร",
};

const STATUS_STYLE: Record<
  TrainingNeedStatus,
  { label: string; variant: "warning" | "success" | "danger"; hint: string }
> = {
  pending: { label: "รอพิจารณา", variant: "warning", hint: "รอ HRD ตรวจสอบงบประมาณและความสอดคล้อง" },
  approved: { label: "อนุมัติแล้ว", variant: "success", hint: "ผ่านการอนุมัติ พร้อมบรรจุลงแผนฝึกอบรมประจำปี" },
  returned: { label: "ส่งกลับแก้ไข", variant: "danger", hint: "ส่งกลับให้ผู้เสนอปรับรายละเอียดหรือประมาณการงบ" },
};

export function TrainingNeedsPanel({ items, onChange, onNotify }: TrainingNeedsPanelProps) {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | TrainingNeedStatus>("all");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("Digital & Data");
  const [reqDept, setReqDept] = useState("ฝ่ายวิศวกรรมซอฟต์แวร์");
  const [headcount, setHeadcount] = useState("25");
  const [budget, setBudget] = useState("80000");
  const [priority, setPriority] = useState<PriorityLevel>("medium");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchDept = department === "all" || item.department === department;
      const matchStatus = statusFilter === "all" || item.status === statusFilter;
      const matchQuery =
        !q ||
        item.code.toLowerCase().includes(q) ||
        item.topic.toLowerCase().includes(q) ||
        item.requester.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchDept && matchStatus && matchQuery;
    });
  }, [items, search, department, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleDecision = (id: string, status: TrainingNeedStatus) => {
    const target = items.find((i) => i.id === id);
    onChange(items.map((item) => (item.id === id ? { ...item, status } : item)));
    if (target) {
      onNotify(
        status === "approved"
          ? `อนุมัติคำขอ "${target.topic}" เข้าสู่แผนแล้ว`
          : `ส่งกลับคำขอ "${target.topic}" เพื่อปรับแก้แล้ว`
      );
    }
  };

  const handleCreate = () => {
    if (!topic.trim()) return;
    const nextNum = String(items.length + 1).padStart(2, "0");
    const created: TrainingNeedItem = {
      id: `TN-${Date.now()}`,
      code: `TNA-2569-${nextNum}`,
      topic: topic.trim(),
      category,
      department: reqDept,
      requester: "พิมพ์ชนก วัฒนากูล",
      targetHeadcount: Math.max(1, Number(headcount) || 1),
      estimatedBudget: Math.max(0, Number(budget) || 0),
      priority,
      source: "Manager Request",
      status: "pending",
      submittedDate: "วันนี้",
    };
    onChange([created, ...items]);
    setTopic("");
    setPage(1);
    setModalOpen(false);
    onNotify(`บันทึกคำขอความต้องการอบรม "${created.topic}" แล้ว`);
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
            placeholder="ค้นหารหัส หัวข้อ หรือผู้เสนอ..."
            containerClassName="w-full sm:w-64"
          />
          <Select
            value={department}
            onChange={(v) => {
              setDepartment(v);
              setPage(1);
            }}
            options={TRAINING_DEPARTMENT_OPTIONS}
            className="w-full sm:w-52"
          />
          <div className="inline-flex self-start rounded-xl bg-[#F4F6FA] p-1 text-xs sm:self-auto">
            {(
              [
                { key: "all", label: `ทั้งหมด (${items.length})` },
                {
                  key: "pending",
                  label: `รอพิจารณา (${items.filter((i) => i.status === "pending").length})`,
                },
                {
                  key: "approved",
                  label: `อนุมัติ (${items.filter((i) => i.status === "approved").length})`,
                },
              ] as const
            ).map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => {
                  setStatusFilter(opt.key);
                  setPage(1);
                }}
                className={`rounded-lg px-2.5 py-1.5 font-medium transition-all cursor-pointer ${
                  statusFilter === opt.key
                    ? "bg-white text-[#1E293B] shadow-2xs"
                    : "text-[#64748B] hover:text-[#1E293B]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setModalOpen(true)}>
          เสนอความต้องการอบรม
        </Button>
      </div>

      {/* Table */}
      {paged.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="ไม่พบรายการสำรวจความต้องการอบรม"
          description="ลองปรับคำค้นหา แผนก หรือสถานะ เพื่อดูรายการทั้งหมด"
          action={
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSearch("");
                setDepartment("all");
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
                  <TableHead>รหัส / หัวข้ออบรม</TableHead>
                  <TableHead className="w-48">แผนก / ผู้เสนอ</TableHead>
                  <TableHead className="w-32 text-center">ความเร่งด่วน</TableHead>
                  <TableHead className="w-36 pr-6 text-right">ผู้เรียน / งบประมาณ</TableHead>
                  <TableHead className="w-36 text-center">สถานะ</TableHead>
                  <TableHead className="w-44 text-center">พิจารณา</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((item) => {
                  const prio = PRIORITY_STYLE[item.priority];
                  const st = STATUS_STYLE[item.status];
                  const costPerHead = Math.round(item.estimatedBudget / Math.max(1, item.targetHeadcount));
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                            {item.code}
                          </span>
                          <Tooltip title={`ที่มา: ${item.source}`} content={SOURCE_HINTS[item.source]}>
                            <span className="rounded-md bg-[#F4F6FA] px-2 py-0.5 text-[11px] font-medium text-[#64748B] cursor-help">
                              {item.source}
                            </span>
                          </Tooltip>
                        </div>
                        <p className="mt-1 font-semibold text-[#1E293B]">{item.topic}</p>
                        <p className="text-xs text-[#94A3B8]">
                          หมวด {item.category} • เสนอเมื่อ {item.submittedDate}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm font-medium text-[#1E293B]">{item.department}</p>
                        <p className="text-xs text-[#94A3B8]">{item.requester}</p>
                      </TableCell>
                      <TableCell className="text-center">
                        <Tooltip title={`ความเร่งด่วน: ${prio.label}`} content={prio.hint}>
                          <Badge variant={prio.variant} className="cursor-help">
                            {prio.label}
                          </Badge>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="pr-6 text-right tabular-nums">
                        <Tooltip
                          title="ประมาณการค่าใช้จ่าย"
                          content={`เฉลี่ยประมาณ ฿${costPerHead.toLocaleString()} / คน`}
                        >
                          <div className="inline-block cursor-help">
                            <p className="font-semibold text-[#1E293B]">
                              {item.targetHeadcount.toLocaleString()} คน
                            </p>
                            <p className="text-xs text-[#94A3B8]">
                              ฿{item.estimatedBudget.toLocaleString()}
                            </p>
                          </div>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="text-center">
                        <Tooltip title={`สถานะ: ${st.label}`} content={st.hint}>
                          <Badge variant={st.variant} dot className="cursor-help">
                            {st.label}
                          </Badge>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="text-center">
                        {item.status === "pending" ? (
                          <div className="inline-flex items-center gap-1.5">
                            <Tooltip content="ส่งกลับให้ปรับแก้รายละเอียด">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDecision(item.id, "returned")}
                                leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
                              >
                                ส่งกลับ
                              </Button>
                            </Tooltip>
                            <Tooltip content="อนุมัติเข้าสู่แผนฝึกอบรม">
                              <Button
                                size="sm"
                                variant="primary"
                                onClick={() => handleDecision(item.id, "approved")}
                                leftIcon={<Check className="h-3.5 w-3.5" />}
                              >
                                อนุมัติ
                              </Button>
                            </Tooltip>
                          </div>
                        ) : (
                          <span className="text-xs text-[#94A3B8]">ดำเนินการแล้ว</span>
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

      {/* Create Training Need Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="เสนอความต้องการฝึกอบรม (Training Need)"
        description="กรอกหัวข้อและประมาณการผู้เรียนเพื่อส่งพิจารณาบรรจุในแผนฝึกอบรมประจำปี"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              ยกเลิก
            </Button>
            <Button disabled={!topic.trim()} onClick={handleCreate}>
              ส่งคำขออบรม
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="หัวข้อ / หลักสูตรที่ต้องการ"
            placeholder="เช่น AI Workflow Automation for Operations"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="หมวดหมู่หลักสูตร"
              value={category}
              onChange={setCategory}
              options={TRAINING_CATEGORY_OPTIONS.filter((o) => o.value !== "all")}
            />
            <Select
              label="แผนกที่เสนอ (HRM)"
              value={reqDept}
              onChange={setReqDept}
              options={TRAINING_DEPARTMENT_OPTIONS.filter((o) => o.value !== "all")}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input
              label="จำนวนผู้เรียน (คน)"
              type="number"
              min={1}
              value={headcount}
              onChange={(e) => setHeadcount(e.target.value)}
            />
            <Input
              label="งบประมาณประเมิน (บาท)"
              type="number"
              min={0}
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
            <Select
              label="ระดับความเร่งด่วน"
              value={priority}
              onChange={(v) => setPriority(v as PriorityLevel)}
              options={[
                { value: "high", label: "เร่งด่วน" },
                { value: "medium", label: "ปานกลาง" },
                { value: "low", label: "ทั่วไป" },
              ]}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
