"use client";

import { useMemo, useState } from "react";
import { Award, FolderOpen, Pencil, Star, TrendingUp } from "lucide-react";
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
import type { TrainingResultItem, TrainingResultStatus } from "@/data/mock/trainingOperations";

interface TrainingResultsPanelProps {
  items: TrainingResultItem[];
  onChange: (items: TrainingResultItem[]) => void;
  onNotify: (message: string) => void;
}

const PAGE_SIZE = 5;

const RESULT_STATUS_META: Record<
  TrainingResultStatus,
  { label: string; variant: "success" | "danger" | "warning"; hint: string }
> = {
  passed: { label: "ผ่านการอบรม", variant: "success", hint: "คะแนน Post-test ผ่านเกณฑ์ 80% ขึ้นไปและบันทึกชั่วโมงอบรมแล้ว" },
  failed: { label: "ไม่ผ่านเกณฑ์", variant: "danger", hint: "คะแนน Post-test ต่ำกว่าเกณฑ์ ต้องสอบซ่อมหรือทบทวนเนื้อหา" },
  "in-review": { label: "รอสรุปผล", variant: "warning", hint: "อยู่ระหว่างรอคะแนนสอบหลังอบรมหรือแบบประเมินความพึงพอใจ" },
};

export function TrainingResultsPanel({ items, onChange, onNotify }: TrainingResultsPanelProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | TrainingResultStatus>("all");
  const [page, setPage] = useState(1);

  const [editing, setEditing] = useState<TrainingResultItem | null>(null);
  const [preScore, setPreScore] = useState("70");
  const [postScore, setPostScore] = useState("85");
  const [satisfaction, setSatisfaction] = useState("4.8");
  const [resultStatus, setResultStatus] = useState<TrainingResultStatus>("passed");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchStatus = statusFilter === "all" || item.status === statusFilter;
      const matchQuery =
        !q ||
        item.code.toLowerCase().includes(q) ||
        item.employeeName.toLowerCase().includes(q) ||
        item.employeeCode.toLowerCase().includes(q) ||
        item.courseTitle.toLowerCase().includes(q) ||
        item.department.toLowerCase().includes(q);
      return matchStatus && matchQuery;
    });
  }, [items, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const openEdit = (item: TrainingResultItem) => {
    setEditing(item);
    setPreScore(String(item.preTestScore));
    setPostScore(String(item.postTestScore));
    setSatisfaction(String(item.satisfaction || 4.8));
    setResultStatus(item.status);
  };

  const handleSave = () => {
    if (!editing) return;
    const post = Math.min(100, Math.max(0, Number(postScore) || 0));
    const pre = Math.min(100, Math.max(0, Number(preScore) || 0));
    const sat = Math.min(5, Math.max(0, Number(satisfaction) || 0));
    onChange(
      items.map((item) =>
        item.id === editing.id
          ? {
              ...item,
              preTestScore: pre,
              postTestScore: post,
              satisfaction: sat,
              status: resultStatus,
              certificateIssued: resultStatus === "passed",
              completedDate: item.completedDate === "รอสรุปผล" ? "วันนี้" : item.completedDate,
            }
          : item
      )
    );
    onNotify(`บันทึกผลการอบรมของ "${editing.employeeName}" เรียบร้อยแล้ว`);
    setEditing(null);
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
            placeholder="ค้นหาชื่อพนักงาน หลักสูตร หรือรหัส..."
            containerClassName="w-full sm:w-64"
          />
          <Select
            value={statusFilter}
            onChange={(v) => {
              setStatusFilter(v as "all" | TrainingResultStatus);
              setPage(1);
            }}
            options={[
              { value: "all", label: "ทุกผลการประเมิน" },
              { value: "passed", label: "ผ่านการอบรม" },
              { value: "failed", label: "ไม่ผ่านเกณฑ์" },
              { value: "in-review", label: "รอสรุปผล" },
            ]}
            className="w-full sm:w-48"
          />
        </div>
      </div>

      {/* Table */}
      {paged.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="ไม่พบประวัติหรือผลการฝึกอบรม"
          description="ลองปรับคำค้นหาหรือตัวกรองสถานะผลการอบรม"
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
                  <TableHead className="pl-5">รหัส / พนักงาน</TableHead>
                  <TableHead>หลักสูตรและประวัติการอบรม</TableHead>
                  <TableHead className="w-40 text-center">คะแนน Pre → Post</TableHead>
                  <TableHead className="w-28 text-center">ความพึงพอใจ</TableHead>
                  <TableHead className="w-36 text-center">ผลการอบรม</TableHead>
                  <TableHead className="w-24 pr-5 text-center">บันทึกผล</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((item) => {
                  const st = RESULT_STATUS_META[item.status];
                  const gain = item.postTestScore > 0 ? item.postTestScore - item.preTestScore : 0;

                  return (
                    <TableRow key={item.id}>
                      <TableCell className="py-3.5 pl-5">
                        <span className="rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                          {item.employeeCode}
                        </span>
                        <p className="mt-1 font-semibold text-[#1E293B]">{item.employeeName}</p>
                        <p className="text-xs text-[#94A3B8]">{item.department}</p>
                      </TableCell>
                      <TableCell className="py-3.5">
                        <p className="font-medium text-[#1E293B]">{item.courseTitle}</p>
                        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-[#94A3B8]">
                          <span>{item.sessionCode}</span>
                          <span>•</span>
                          <span>{item.trainingHours} ชม.</span>
                          <span>•</span>
                          <span>{item.completedDate}</span>
                          {item.certificateIssued && (
                            <Tooltip content="ออกใบประกาศนียบัตรในประวัติพนักงานเรียบร้อยแล้ว">
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFAF5] px-2 py-0.5 text-[11px] font-medium text-[#1CA388] cursor-help">
                                <Award className="h-3 w-3" />
                                ออกใบรับรองแล้ว
                              </span>
                            </Tooltip>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-3.5 text-center tabular-nums">
                        {item.postTestScore > 0 ? (
                          <Tooltip
                            content={`ก่อนเรียน ${item.preTestScore}% → หลังเรียน ${item.postTestScore}% (พัฒนาขึ้น +${gain} คะแนน)`}
                          >
                            <div className="inline-flex items-center gap-1.5 cursor-help">
                              <span className="text-xs text-[#94A3B8]">{item.preTestScore}%</span>
                              <span className="text-xs text-[#CBD5E1]">→</span>
                              <span className="text-sm font-bold text-[#1E293B]">
                                {item.postTestScore}%
                              </span>
                              {gain > 0 && (
                                <span className="inline-flex items-center gap-0.5 rounded-full bg-[#ECFAF5] px-1.5 py-0.5 text-[10px] font-semibold text-[#1CA388]">
                                  <TrendingUp className="h-3 w-3" />+{gain}
                                </span>
                              )}
                            </div>
                          </Tooltip>
                        ) : (
                          <span className="text-xs text-[#94A3B8]">รอสอบ Post-test</span>
                        )}
                      </TableCell>
                      <TableCell className="py-3.5 text-center">
                        {item.satisfaction > 0 ? (
                          <Tooltip content="คะแนนประเมินความพึงพอใจหลังอบรม (เต็ม 5.0)">
                            <div className="inline-flex items-center gap-1 rounded-full bg-[#FEF9EC] px-2.5 py-0.5 text-xs font-semibold text-[#C68A12] cursor-help">
                              <Star className="h-3.5 w-3.5 fill-[#F5B73B] text-[#F5B73B]" />
                              <span className="tabular-nums">{item.satisfaction.toFixed(1)}</span>
                            </div>
                          </Tooltip>
                        ) : (
                          <span className="text-xs text-[#CBD5E1]">—</span>
                        )}
                      </TableCell>
                      <TableCell className="py-3.5 text-center">
                        <Tooltip title={`ผลประเมิน: ${st.label}`} content={st.hint}>
                          <Badge variant={st.variant} dot className="cursor-help">
                            {st.label}
                          </Badge>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="py-3.5 pr-5 text-center">
                        <Tooltip content="บันทึก / แก้ไขคะแนนและผลการอบรม">
                          <button
                            type="button"
                            onClick={() => openEdit(item)}
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

          <Pagination
            currentPage={currentPage}
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </>
      )}

      {/* Update Result Modal */}
      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title={`บันทึกผลการอบรม — ${editing?.employeeName ?? ""}`}
        description={editing ? `${editing.courseTitle} (${editing.sessionCode})` : undefined}
        footer={
          <>
            <Button variant="outline" onClick={() => setEditing(null)}>
              ยกเลิก
            </Button>
            <Button onClick={handleSave}>บันทึกผลการอบรม</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input
              label="คะแนน Pre-test (%)"
              type="number"
              min={0}
              max={100}
              value={preScore}
              onChange={(e) => setPreScore(e.target.value)}
            />
            <Input
              label="คะแนน Post-test (%)"
              type="number"
              min={0}
              max={100}
              value={postScore}
              onChange={(e) => setPostScore(e.target.value)}
            />
            <Input
              label="ความพึงพอใจ (เต็ม 5)"
              type="number"
              step="0.1"
              min={0}
              max={5}
              value={satisfaction}
              onChange={(e) => setSatisfaction(e.target.value)}
            />
          </div>
          <Select
            label="สรุปผลการอบรม"
            value={resultStatus}
            onChange={(v) => setResultStatus(v as TrainingResultStatus)}
            options={[
              { value: "passed", label: "ผ่านการอบรม (ออกใบรับรองอัตโนมัติ)" },
              { value: "failed", label: "ไม่ผ่านเกณฑ์" },
              { value: "in-review", label: "รอสรุปผล" },
            ]}
          />
        </div>
      </Modal>
    </div>
  );
}
