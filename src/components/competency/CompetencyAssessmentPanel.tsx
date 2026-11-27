"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, ClipboardCheck, FolderOpen, Pencil } from "lucide-react";
import {
  Badge,
  Button,
  EmptyState,
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
  AssessmentStatus,
  CompetencyAssessmentItem,
  CompetencyType,
} from "@/data/mock/competencyFramework";

interface CompetencyAssessmentPanelProps {
  items: CompetencyAssessmentItem[];
  onChange: (items: CompetencyAssessmentItem[]) => void;
  onNotify: (message: string) => void;
}

const PAGE_SIZE = 5;

const TYPE_META: Record<CompetencyType, { label: string; variant: "primary" | "warning" | "success" }> = {
  Core: { label: "Core", variant: "primary" },
  Managerial: { label: "Managerial", variant: "warning" },
  Functional: { label: "Functional", variant: "success" },
};

const LEVEL_OPTIONS = [
  { value: "1", label: "Lv.1 — Awareness (พื้นฐาน)" },
  { value: "2", label: "Lv.2 — Basic (ปฏิบัติได้)" },
  { value: "3", label: "Lv.3 — Practitioner (ชำนาญงาน)" },
  { value: "4", label: "Lv.4 — Advanced (เชี่ยวชาญ/สอนงานได้)" },
  { value: "5", label: "Lv.5 — Expert (ต้นแบบระดับองค์กร)" },
];

export function CompetencyAssessmentPanel({
  items,
  onChange,
  onNotify,
}: CompetencyAssessmentPanelProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | AssessmentStatus>("all");
  const [page, setPage] = useState(1);

  const [selected, setSelected] = useState<CompetencyAssessmentItem | null>(null);
  const [formActualLevel, setFormActualLevel] = useState("3");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (!q) return true;
      return (
        item.code.toLowerCase().includes(q) ||
        item.employeeName.toLowerCase().includes(q) ||
        item.employeeCode.toLowerCase().includes(q) ||
        item.competencyName.toLowerCase().includes(q) ||
        item.department.toLowerCase().includes(q)
      );
    });
  }, [items, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const openAssessModal = (item: CompetencyAssessmentItem) => {
    setSelected(item);
    setFormActualLevel(String(item.actualLevel ?? item.targetLevel));
  };

  const handleSaveAssessment = () => {
    if (!selected) return;
    const actual = Number(formActualLevel);
    const today = "27 พ.ย. 2569";

    onChange(
      items.map((item) =>
        item.id === selected.id
          ? {
              ...item,
              actualLevel: actual,
              assessedDate: today,
              status: "assessed",
            }
          : item
      )
    );
    onNotify(`บันทึกผลประเมินสมรรถนะของ ${selected.employeeName} (Lv.${actual}) เรียบร้อยแล้ว`);
    setSelected(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          <SearchBar
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="ค้นหาชื่อพนักงาน, รหัส, แผนก หรือสมรรถนะ..."
            className="w-full sm:w-80"
          />
          <Select
            aria-label="กรองตามสถานะการประเมิน"
            value={statusFilter}
            onChange={(val) => {
              setStatusFilter(val as "all" | AssessmentStatus);
              setPage(1);
            }}
            options={[
              { value: "all", label: "สถานะ: ทั้งหมด" },
              { value: "assessed", label: "ประเมินแล้ว" },
              { value: "pending", label: "รอประเมิน" },
            ]}
            className="w-44"
          />
        </div>
        <div className="text-xs text-[#64748B]">
          แสดง {filtered.length} รายการจากการประเมินสมรรถนะทั้งหมด {items.length} รายการ
        </div>
      </div>

      {paged.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="ไม่พบรายการประเมินสมรรถนะ"
          description="ลองปรับคำค้นหาหรือเปลี่ยนตัวกรองสถานะการประเมิน"
        />
      ) : (
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[24%]">รหัส / พนักงาน</TableHead>
                <TableHead className="w-[26%]">สมรรถนะที่ประเมิน</TableHead>
                <TableHead className="w-[15%] text-center">เป้าหมาย vs จริง</TableHead>
                <TableHead className="w-[11%] text-center">Gap</TableHead>
                <TableHead className="w-[12%] text-center">สถานะ</TableHead>
                <TableHead className="w-[12%] text-center">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map((item) => {
                const gap = item.actualLevel !== null ? item.actualLevel - item.targetLevel : null;
                const typeMeta = TYPE_META[item.type];

                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <span className="inline-block rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                        {item.code}
                      </span>
                      <div className="mt-1 font-semibold text-[#1E293B]">{item.employeeName}</div>
                      <div className="text-xs text-[#64748B]">
                        {item.position} • {item.department}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-[#1E293B]">{item.competencyName}</div>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <Badge variant={typeMeta.variant}>
                          {typeMeta.label}
                        </Badge>
                        <span className="text-[11px] text-[#94A3B8]">
                          ผู้ประเมิน: {item.assessorName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Tooltip
                        content={
                          item.actualLevel !== null
                            ? `ระดับเป้าหมาย Lv.${item.targetLevel} / ระดับที่ประเมินได้จริง Lv.${item.actualLevel}`
                            : `ระดับเป้าหมาย Lv.${item.targetLevel} (ยังไม่ได้บันทึกผลประเมิน)`
                        }
                      >
                        <div className="inline-flex items-center gap-1.5 rounded-lg border border-[#EEF2F6] bg-[#F8FAFC] px-2.5 py-1 text-xs font-semibold">
                          <span className="text-[#64748B]">Lv.{item.targetLevel}</span>
                          <span className="text-[#CBD5E1]">→</span>
                          <span
                            className={
                              item.actualLevel === null
                                ? "text-[#94A3B8]"
                                : item.actualLevel >= item.targetLevel
                                  ? "text-emerald-600"
                                  : "text-rose-600"
                            }
                          >
                            {item.actualLevel !== null ? `Lv.${item.actualLevel}` : "—"}
                          </span>
                        </div>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="text-center">
                      {gap === null ? (
                        <span className="text-xs text-[#94A3B8]">รอผล</span>
                      ) : gap < 0 ? (
                        <Tooltip content={`ยังต่ำกว่าเกณฑ์ตำแหน่ง ${Math.abs(gap)} ระดับ — ควรวางแผนพัฒนาใน IDP`}>
                          <Badge variant="danger">{gap} ระดับ</Badge>
                        </Tooltip>
                      ) : gap === 0 ? (
                        <Tooltip content="ผ่านเกณฑ์ระดับเป้าหมายของตำแหน่งพอดี">
                          <Badge variant="success">ตามเกณฑ์</Badge>
                        </Tooltip>
                      ) : (
                        <Tooltip content={`สูงกว่าเกณฑ์เป้าหมายตำแหน่ง +${gap} ระดับ`}>
                          <Badge variant="primary">+{gap} ระดับ</Badge>
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.status === "assessed" ? (
                        <Tooltip content={`บันทึกผลล่าสุดเมื่อ ${item.assessedDate}`}>
                          <Badge variant="success" dot>
                            ประเมินแล้ว
                          </Badge>
                        </Tooltip>
                      ) : (
                        <Tooltip content="ยังไม่ได้บันทึกผลประเมินรอบปัจจุบัน">
                          <Badge variant="warning" dot>
                            รอประเมิน
                          </Badge>
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        <Tooltip
                          content={
                            item.status === "assessed"
                              ? "แก้ไขระดับผลประเมินสมรรถนะ"
                              : "บันทึกผลการประเมินสมรรถนะ"
                          }
                        >
                          <Button
                            size="sm"
                            variant={item.status === "pending" ? "primary" : "outline"}
                            leftIcon={
                              item.status === "pending" ? (
                                <ClipboardCheck className="h-3.5 w-3.5" />
                              ) : (
                                <Pencil className="h-3.5 w-3.5" />
                              )
                            }
                            onClick={() => openAssessModal(item)}
                            className="w-[104px] justify-center"
                          >
                            {item.status === "pending" ? "ประเมิน" : "ปรับระดับ"}
                          </Button>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={safePage}
          onPageChange={setPage}
          totalItems={filtered.length}
          pageSize={PAGE_SIZE}
        />
      )}

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title="บันทึกผลการประเมินสมรรถนะ"
        description={
          selected
            ? `${selected.employeeName} (${selected.position}) — ${selected.competencyName}`
            : undefined
        }
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setSelected(null)}>
              ยกเลิก
            </Button>
            <Button
              variant="primary"
              leftIcon={<CheckCircle2 className="h-4 w-4" />}
              onClick={handleSaveAssessment}
            >
              บันทึกผลประเมิน
            </Button>
          </>
        }
      >
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 rounded-xl border border-[#EEF2F6] bg-[#F8FAFC] p-3.5 text-sm">
              <div>
                <div className="text-xs text-[#64748B]">ระดับเป้าหมายประจำตำแหน่ง</div>
                <div className="mt-0.5 font-bold text-[#1E293B]">Lv.{selected.targetLevel} / 5</div>
              </div>
              <div>
                <div className="text-xs text-[#64748B]">ผู้ประเมิน</div>
                <div className="mt-0.5 font-semibold text-[#1E293B]">{selected.assessorName}</div>
              </div>
            </div>

            <Select
              label="ระดับสมรรถนะที่ประเมินได้จริง (Actual Level)"
              value={formActualLevel}
              onChange={(val) => setFormActualLevel(val)}
              options={LEVEL_OPTIONS}
            />

            <div className="rounded-xl border border-[#E0E7FF] bg-[#EEF2FF]/60 p-3 text-xs text-[#3730A3]">
              ผลต่างจากเป้าหมาย (Gap):{" "}
              <span className="font-bold">
                {Number(formActualLevel) - selected.targetLevel === 0
                  ? "0 (ผ่านเกณฑ์ตำแหน่ง)"
                  : Number(formActualLevel) - selected.targetLevel > 0
                    ? `+${Number(formActualLevel) - selected.targetLevel} ระดับ (สูงกว่าเกณฑ์)`
                    : `${Number(formActualLevel) - selected.targetLevel} ระดับ (แนะนำเชื่อมต่อไปยัง IDP)`}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
