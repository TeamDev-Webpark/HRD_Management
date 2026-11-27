"use client";

import { useMemo, useState } from "react";
import { ClipboardEdit, FolderOpen } from "lucide-react";
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
import type { AppraisalReviewItem, AppraisalStatus } from "@/data/mock/pmsReview";

interface SelfManagerReviewPanelProps {
  items: AppraisalReviewItem[];
  onChange: (items: AppraisalReviewItem[]) => void;
  onNotify: (message: string) => void;
}

const PAGE_SIZE = 5;

const REVIEW_STATUS_META: Record<
  AppraisalStatus,
  { label: string; variant: "neutral" | "warning" | "success"; hint: string }
> = {
  "waiting-self": { label: "รอพนักงานประเมิน", variant: "neutral", hint: "รอพนักงานกรอกแบบประเมินตนเอง (Self-Appraisal)" },
  "waiting-manager": { label: "รอหัวหน้าประเมิน", variant: "warning", hint: "พนักงานส่งแล้ว รอหัวหน้างานให้คะแนนและข้อเสนอแนะ" },
  submitted: { label: "ส่ง Calibration แล้ว", variant: "success", hint: "ประเมินครบทั้งสองฝั่งและส่งเข้าสู่รอบ Calibration แล้ว" },
};

export function SelfManagerReviewPanel({
  items,
  onChange,
  onNotify,
}: SelfManagerReviewPanelProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | AppraisalStatus>("all");
  const [page, setPage] = useState(1);

  const [reviewing, setReviewing] = useState<AppraisalReviewItem | null>(null);
  const [mgrScore, setMgrScore] = useState("4.2");
  const [strengths, setStrengths] = useState("");
  const [improvements, setImprovements] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchSt = statusFilter === "all" || item.status === statusFilter;
      const matchQuery =
        !q ||
        item.code.toLowerCase().includes(q) ||
        item.employeeName.toLowerCase().includes(q) ||
        item.employeeCode.toLowerCase().includes(q) ||
        item.department.toLowerCase().includes(q);
      return matchSt && matchQuery;
    });
  }, [items, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const openReview = (item: AppraisalReviewItem) => {
    setReviewing(item);
    setMgrScore(String(item.managerScore ?? item.selfScore ?? 4.0));
    setStrengths(item.strengths);
    setImprovements(item.improvements);
  };

  const handleSubmitReview = () => {
    if (!reviewing) return;
    const score = Math.min(5, Math.max(1, Number(mgrScore) || 3.5));
    onChange(
      items.map((item) =>
        item.id === reviewing.id
          ? {
              ...item,
              selfScore: item.selfScore ?? score,
              managerScore: score,
              strengths: strengths.trim() || item.strengths,
              improvements: improvements.trim() || item.improvements,
              status: "submitted",
            }
          : item
      )
    );
    onNotify(`บันทึกผลประเมินของ "${reviewing.employeeName}" (${score.toFixed(2)}/5.00) และส่งเข้า Calibration แล้ว`);
    setReviewing(null);
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
            placeholder="ค้นหาชื่อพนักงาน รหัส หรือแผนก..."
            containerClassName="w-full sm:w-64"
          />
          <Select
            value={statusFilter}
            onChange={(v) => {
              setStatusFilter(v as "all" | AppraisalStatus);
              setPage(1);
            }}
            options={[
              { value: "all", label: "ทุกสถานะการประเมิน" },
              { value: "waiting-self", label: "รอพนักงานประเมิน" },
              { value: "waiting-manager", label: "รอหัวหน้าประเมิน" },
              { value: "submitted", label: "ส่ง Calibration แล้ว" },
            ]}
            className="w-full sm:w-48"
          />
        </div>
      </div>

      {paged.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="ไม่พบรายการประเมินผลงาน"
          description="ลองปรับคำค้นหาหรือตัวกรองสถานะ"
        />
      ) : (
        <>
          <TableContainer className="rounded-xl border border-[#EEF2F6]">
            <Table>
              <TableHeader className="bg-[#F8FAFC]">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-5">รหัส / พนักงาน</TableHead>
                  <TableHead className="w-40">ผู้ประเมิน (หัวหน้างาน)</TableHead>
                  <TableHead className="w-28 text-center">ประเมินตนเอง</TableHead>
                  <TableHead className="w-28 text-center">หัวหน้าประเมิน</TableHead>
                  <TableHead className="w-40 text-center">สถานะ</TableHead>
                  <TableHead className="w-32 pr-5 text-center">ดำเนินการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((item) => {
                  const st = REVIEW_STATUS_META[item.status];
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="py-3.5 pl-5">
                        <span className="rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                          {item.employeeCode}
                        </span>
                        <p className="mt-1 font-semibold text-[#1E293B]">{item.employeeName}</p>
                        <p className="text-xs text-[#94A3B8]">
                          {item.position} • {item.department}
                        </p>
                      </TableCell>
                      <TableCell className="py-3.5 text-xs font-medium text-[#334155]">
                        {item.managerName}
                      </TableCell>
                      <TableCell className="py-3.5 text-center tabular-nums">
                        {item.selfScore !== null ? (
                          <span className="font-semibold text-[#475569]">
                            {item.selfScore.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-xs text-[#CBD5E1]">—</span>
                        )}
                      </TableCell>
                      <TableCell className="py-3.5 text-center tabular-nums">
                        {item.managerScore !== null ? (
                          <span className="font-bold text-[#2563EB]">
                            {item.managerScore.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-xs text-[#94A3B8]">รอประเมิน</span>
                        )}
                      </TableCell>
                      <TableCell className="py-3.5 text-center">
                        <Tooltip title={st.label} content={st.hint}>
                          <Badge variant={st.variant} dot className="cursor-help">
                            {st.label}
                          </Badge>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="py-3.5 pr-5 text-center">
                        <Tooltip content="เปิดแบบฟอร์มให้คะแนนและบันทึกข้อเสนอแนะ">
                          <Button
                            size="sm"
                            variant={item.status === "submitted" ? "outline" : "primary"}
                            leftIcon={<ClipboardEdit className="h-3.5 w-3.5" />}
                            onClick={() => openReview(item)}
                          >
                            {item.status === "submitted" ? "ดูผล" : "ประเมิน"}
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

      <Modal
        open={Boolean(reviewing)}
        onClose={() => setReviewing(null)}
        title={`แบบประเมินผลงาน — ${reviewing?.employeeName ?? ""}`}
        description={reviewing ? `${reviewing.position} • ${reviewing.department}` : undefined}
        footer={
          <>
            <Button variant="outline" onClick={() => setReviewing(null)}>
              ยกเลิก
            </Button>
            <Button onClick={handleSubmitReview}>บันทึกผลและส่ง Calibration</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 rounded-xl border border-[#EEF2F6] bg-[#F8FAFC] p-3.5 text-xs">
            <div>
              <p className="text-[#64748B]">คะแนนประเมินตนเอง</p>
              <p className="mt-0.5 text-base font-bold text-[#1E293B]">
                {reviewing?.selfScore !== null && reviewing?.selfScore !== undefined
                  ? `${reviewing.selfScore.toFixed(2)} / 5.00`
                  : "ยังไม่กรอก"}
              </p>
            </div>
            <Input
              label="คะแนนประเมินจากหัวหน้างาน (1.00 – 5.00)"
              type="number"
              step="0.05"
              min={1}
              max={5}
              value={mgrScore}
              onChange={(e) => setMgrScore(e.target.value)}
            />
          </div>
          <Input
            label="จุดแข็งและผลงานที่โดดเด่น (Strengths)"
            placeholder="ระบุจุดแข็งและผลงานหลักในรอบปีนี้"
            value={strengths}
            onChange={(e) => setStrengths(e.target.value)}
          />
          <Input
            label="ประเด็นที่ควรพัฒนาต่อยอดใน IDP (Areas for Development)"
            placeholder="ระบุทักษะหรือพฤติกรรมที่แนะนำให้พัฒนาต่อ"
            value={improvements}
            onChange={(e) => setImprovements(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}
