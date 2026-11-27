"use client";

import { useMemo, useState } from "react";
import { FolderOpen, MessageSquarePlus, Plus } from "lucide-react";
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
import type {
  CheckinStatus,
  ConfidenceLevel,
  ProgressCheckinItem,
} from "@/data/mock/pmsGoals";

interface ProgressCheckinPanelProps {
  items: ProgressCheckinItem[];
  onChange: (items: ProgressCheckinItem[]) => void;
  onNotify: (message: string) => void;
}

const PAGE_SIZE = 5;

const CONFIDENCE_META: Record<
  ConfidenceLevel,
  { label: string; variant: "success" | "warning" | "danger"; hint: string }
> = {
  high: { label: "มั่นใจสูง", variant: "success", hint: "คาดว่าจะบรรลุเป้าหมายได้ตามกำหนดหรือดีกว่าเป้า" },
  medium: { label: "ปานกลาง", variant: "warning", hint: "มีจุดต้องติดตามเพิ่มเติมแต่ยังควบคุมได้" },
  low: { label: "ต้องช่วยปลดล็อก", variant: "danger", hint: "พบอุปสรรคสำคัญ ต้องการคำแนะนำหรือทรัพยากรจากหัวหน้างาน" },
};

const CHECKIN_STATUS_META: Record<
  CheckinStatus,
  { label: string; variant: "warning" | "success"; hint: string }
> = {
  "waiting-manager": { label: "รอหัวหน้าตอบกลับ", variant: "warning", hint: "พนักงานส่งรายงานความคืบหน้าแล้ว รอหัวหน้างานให้ Feedback" },
  reviewed: { label: "โค้ชชิ่งแล้ว", variant: "success", hint: "หัวหน้างานทบทวนและบันทึกข้อเสนอแนะเรียบร้อยแล้ว" },
};

export function ProgressCheckinPanel({
  items,
  onChange,
  onNotify,
}: ProgressCheckinPanelProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | CheckinStatus>("all");
  const [page, setPage] = useState(1);

  const [reviewTarget, setReviewTarget] = useState<ProgressCheckinItem | null>(null);
  const [feedbackDraft, setFeedbackDraft] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [newEmpName, setNewEmpName] = useState("ณัฐพล เจริญสุข");
  const [newProgress, setNewProgress] = useState("80");
  const [newConfidence, setNewConfidence] = useState<ConfidenceLevel>("high");
  const [newUpdate, setNewUpdate] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchSt = statusFilter === "all" || item.status === statusFilter;
      const matchQuery =
        !q ||
        item.code.toLowerCase().includes(q) ||
        item.employeeName.toLowerCase().includes(q) ||
        item.department.toLowerCase().includes(q) ||
        item.employeeUpdate.toLowerCase().includes(q);
      return matchSt && matchQuery;
    });
  }, [items, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const openReview = (item: ProgressCheckinItem) => {
    setReviewTarget(item);
    setFeedbackDraft(item.managerFeedback);
  };

  const handleSaveFeedback = () => {
    if (!reviewTarget || !feedbackDraft.trim()) return;
    onChange(
      items.map((item) =>
        item.id === reviewTarget.id
          ? { ...item, managerFeedback: feedbackDraft.trim(), status: "reviewed" }
          : item
      )
    );
    onNotify(`บันทึกผล Check-in และโค้ชชิ่งให้ "${reviewTarget.employeeName}" เรียบร้อยแล้ว`);
    setReviewTarget(null);
  };

  const handleCreateCheckin = () => {
    if (!newUpdate.trim()) return;
    const created: ProgressCheckinItem = {
      id: `CHK-${Date.now()}`,
      code: `CHK-69-Q4-${String(items.length + 1).padStart(2, "0")}`,
      employeeCode: "EMP-1024",
      employeeName: newEmpName.trim() || "พนักงาน",
      department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
      managerName: "ธนกร ศิริสวัสดิ์",
      periodLabel: "Check-in ไตรมาส 4 / 2569",
      submittedDate: "วันนี้",
      overallProgress: Math.min(100, Math.max(0, Number(newProgress) || 0)),
      confidence: newConfidence,
      employeeUpdate: newUpdate.trim(),
      managerFeedback: "",
      status: "waiting-manager",
    };
    onChange([created, ...items]);
    setNewUpdate("");
    setPage(1);
    setCreateOpen(false);
    onNotify(`ส่งรายงาน Progress Check-in ของ "${created.employeeName}" แล้ว`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <SearchBar
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="ค้นหาชื่อพนักงาน แผนก หรือบันทึกความคืบหน้า..."
            containerClassName="w-full sm:w-64"
          />
          <Select
            value={statusFilter}
            onChange={(v) => {
              setStatusFilter(v as "all" | CheckinStatus);
              setPage(1);
            }}
            options={[
              { value: "all", label: "ทุกสถานะ Check-in" },
              { value: "waiting-manager", label: "รอหัวหน้าตอบกลับ" },
              { value: "reviewed", label: "โค้ชชิ่งแล้ว" },
            ]}
            className="w-full sm:w-48"
          />
        </div>

        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setCreateOpen(true)}>
          ส่ง Progress Check-in
        </Button>
      </div>

      {paged.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="ไม่พบรายการ Progress Check-in"
          description="ลองปรับคำค้นหาหรือตัวกรองสถานะ"
        />
      ) : (
        <>
          <TableContainer className="rounded-xl border border-[#EEF2F6]">
            <Table>
              <TableHeader className="bg-[#F8FAFC]">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-5">รหัส / พนักงาน</TableHead>
                  <TableHead>สรุปความคืบหน้า & อุปสรรค</TableHead>
                  <TableHead className="w-32 text-center">ความมั่นใจ</TableHead>
                  <TableHead className="w-36 text-center">สถานะ</TableHead>
                  <TableHead className="w-36 pr-5 text-center">โค้ชชิ่ง</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((item) => {
                  const conf = CONFIDENCE_META[item.confidence];
                  const st = CHECKIN_STATUS_META[item.status];
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="py-3.5 pl-5">
                        <span className="rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                          {item.employeeCode}
                        </span>
                        <p className="mt-1 font-semibold text-[#1E293B]">{item.employeeName}</p>
                        <p className="text-xs text-[#94A3B8]">
                          {item.department} • ส่ง {item.submittedDate}
                        </p>
                      </TableCell>
                      <TableCell className="max-w-md py-3.5">
                        <p className="line-clamp-2 text-xs text-[#334155]">{item.employeeUpdate}</p>
                        {item.managerFeedback && (
                          <p className="mt-1 line-clamp-1 text-xs text-[#1CA388]">
                            หัวหน้า ({item.managerName}): {item.managerFeedback}
                          </p>
                        )}
                      </TableCell>
                      <TableCell className="py-3.5 text-center">
                        <Tooltip title={conf.label} content={conf.hint}>
                          <Badge variant={conf.variant} className="cursor-help">
                            {conf.label} ({item.overallProgress}%)
                          </Badge>
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
                        <Tooltip content="บันทึกข้อเสนอแนะและผลโค้ชชิ่ง 1-on-1">
                          <Button
                            size="sm"
                            variant={item.status === "waiting-manager" ? "primary" : "outline"}
                            leftIcon={<MessageSquarePlus className="h-3.5 w-3.5" />}
                            onClick={() => openReview(item)}
                          >
                            {item.status === "waiting-manager" ? "ตอบกลับ" : "ดูบันทึก"}
                          </Button>
                        </Tooltip>
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

      {/* Manager Coaching Modal */}
      <Modal
        open={Boolean(reviewTarget)}
        onClose={() => setReviewTarget(null)}
        title={`บันทึกผลโค้ชชิ่ง 1-on-1 — ${reviewTarget?.employeeName ?? ""}`}
        description={reviewTarget?.periodLabel}
        footer={
          <>
            <Button variant="outline" onClick={() => setReviewTarget(null)}>
              ยกเลิก
            </Button>
            <Button disabled={!feedbackDraft.trim()} onClick={handleSaveFeedback}>
              บันทึกข้อเสนอแนะ
            </Button>
          </>
        }
      >
        {reviewTarget && (
          <div className="space-y-4">
            <div className="rounded-xl border border-[#EEF2F6] bg-[#F8FAFC] p-3.5 text-xs">
              <p className="font-semibold text-[#1E293B]">
                อัปเดตจากพนักงาน (ความคืบหน้า {reviewTarget.overallProgress}%):
              </p>
              <p className="mt-1 leading-relaxed text-[#475569]">{reviewTarget.employeeUpdate}</p>
            </div>
            <Input
              label="ข้อเสนอแนะและแนวทางสนับสนุนจากหัวหน้างาน (Coaching Note)"
              placeholder="ระบุคำแนะนำ แผนช่วยปลดล็อก หรือทักษะที่แนะนำให้พัฒนาเพิ่ม..."
              value={feedbackDraft}
              onChange={(e) => setFeedbackDraft(e.target.value)}
              required
            />
          </div>
        )}
      </Modal>

      {/* Create Check-in Modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="ส่งรายงานความคืบหน้า (Progress Check-in)"
        footer={
          <>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              ยกเลิก
            </Button>
            <Button disabled={!newUpdate.trim()} onClick={handleCreateCheckin}>
              ส่งรายงาน Check-in
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input
              label="ชื่อพนักงาน"
              value={newEmpName}
              onChange={(e) => setNewEmpName(e.target.value)}
            />
            <Input
              label="ความคืบหน้ารวม (%)"
              type="number"
              min={0}
              max={100}
              value={newProgress}
              onChange={(e) => setNewProgress(e.target.value)}
            />
            <Select
              label="ระดับความมั่นใจ"
              value={newConfidence}
              onChange={(v) => setNewConfidence(v as ConfidenceLevel)}
              options={[
                { value: "high", label: "มั่นใจสูง" },
                { value: "medium", label: "ปานกลาง" },
                { value: "low", label: "ต้องช่วยปลดล็อก" },
              ]}
            />
          </div>
          <Input
            label="สรุปผลงานที่ทำได้และอุปสรรคที่ต้องการให้ช่วย"
            placeholder="อธิบายความคืบหน้าของ KPI / OKR และประเด็นที่อยากหารือกับหัวหน้างาน..."
            value={newUpdate}
            onChange={(e) => setNewUpdate(e.target.value)}
            required
          />
        </div>
      </Modal>
    </div>
  );
}
