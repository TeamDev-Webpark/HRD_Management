"use client";

import { useMemo, useState } from "react";
import { Award, CheckCircle2, ClipboardCheck, FolderOpen, Pencil } from "lucide-react";
import {
  Badge,
  Button,
  EmptyState,
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
import type { IdpEvalResult, IdpEvaluationItem } from "@/data/mock/idpData";

interface IdpEvaluationPanelProps {
  items: IdpEvaluationItem[];
  onChange: (items: IdpEvaluationItem[]) => void;
  onNotify: (message: string) => void;
}

const RESULT_META: Record<
  IdpEvalResult,
  { label: string; variant: "primary" | "success" | "warning" | "neutral" }
> = {
  exceed: { label: "สูงกว่าเป้าหมาย", variant: "primary" },
  achieved: { label: "บรรลุเป้าหมาย", variant: "success" },
  developing: { label: "กำลังพัฒนาต่อเนื่อง", variant: "warning" },
  pending: { label: "รอประเมินผล", variant: "neutral" },
};

const LEVEL_OPTIONS = [
  { value: "1", label: "Lv.1 — Awareness" },
  { value: "2", label: "Lv.2 — Basic" },
  { value: "3", label: "Lv.3 — Practitioner" },
  { value: "4", label: "Lv.4 — Advanced" },
  { value: "5", label: "Lv.5 — Expert" },
];

export function IdpEvaluationPanel({
  items,
  onChange,
  onNotify,
}: IdpEvaluationPanelProps) {
  const [search, setSearch] = useState("");
  const [resultFilter, setResultFilter] = useState<"all" | IdpEvalResult>("all");

  const [selected, setSelected] = useState<IdpEvaluationItem | null>(null);
  const [formAfterLevel, setFormAfterLevel] = useState("4");
  const [formResult, setFormResult] = useState<IdpEvalResult>("achieved");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      if (resultFilter !== "all" && item.result !== resultFilter) return false;
      if (!q) return true;
      return (
        item.code.toLowerCase().includes(q) ||
        item.employeeName.toLowerCase().includes(q) ||
        item.focusGoal.toLowerCase().includes(q) ||
        item.department.toLowerCase().includes(q)
      );
    });
  }, [items, search, resultFilter]);

  const openEvaluate = (item: IdpEvaluationItem) => {
    setSelected(item);
    setFormAfterLevel(String(item.afterLevel ?? Math.min(5, item.beforeLevel + 1)));
    setFormResult(item.result === "pending" ? "achieved" : item.result);
  };

  const handleSaveEvaluation = () => {
    if (!selected) return;
    const afterLv = Number(formAfterLevel);
    onChange(
      items.map((row) =>
        row.id === selected.id
          ? {
              ...row,
              afterLevel: afterLv,
              result: formResult,
              evaluatedDate: "27 พ.ย. 2569",
            }
          : row
      )
    );
    onNotify(`บันทึกผลประเมิน IDP ของ ${selected.employeeName} (หลังพัฒนา Lv.${afterLv}) แล้ว`);
    setSelected(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="ค้นหาพนักงาน, รหัส หรือหัวข้อเป้าหมาย IDP..."
            className="w-full sm:w-80"
          />
          <Select
            aria-label="กรองตามผลการประเมิน"
            value={resultFilter}
            onChange={(v) => setResultFilter(v as "all" | IdpEvalResult)}
            options={[
              { value: "all", label: "ผลประเมิน: ทั้งหมด" },
              { value: "exceed", label: "สูงกว่าเป้าหมาย" },
              { value: "achieved", label: "บรรลุเป้าหมาย" },
              { value: "developing", label: "กำลังพัฒนาต่อเนื่อง" },
              { value: "pending", label: "รอประเมินผล" },
            ]}
            className="w-48"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="ไม่พบรายการประเมินผล IDP"
          description="ลองปรับคำค้นหาหรือตัวกรองผลการประเมิน"
        />
      ) : (
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[23%]">รหัส / พนักงาน</TableHead>
                <TableHead className="w-[27%]">หัวข้อการพัฒนาที่ประเมิน</TableHead>
                <TableHead className="w-[15%] text-center">ก่อน → หลังพัฒนา</TableHead>
                <TableHead className="w-[11%] text-center">พัฒนาการ</TableHead>
                <TableHead className="w-[12%] text-center">ผลประเมิน</TableHead>
                <TableHead className="w-[12%] text-center">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => {
                const growth =
                  item.afterLevel !== null ? item.afterLevel - item.beforeLevel : null;
                const rMeta = RESULT_META[item.result];

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
                      <div className="font-medium text-[#1E293B]">{item.focusGoal}</div>
                      <div className="mt-1 text-xs text-[#94A3B8]">
                        ผู้ประเมิน: {item.evaluatorName} • {item.evaluatedDate}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="inline-flex items-center gap-1.5 rounded-lg border border-[#EEF2F6] bg-[#F8FAFC] px-2.5 py-1 text-xs font-semibold">
                        <span className="text-[#64748B]">Lv.{item.beforeLevel}</span>
                        <span className="text-[#CBD5E1]">→</span>
                        <span
                          className={
                            item.afterLevel === null
                              ? "text-[#94A3B8]"
                              : item.afterLevel > item.beforeLevel
                                ? "text-emerald-600"
                                : "text-[#475569]"
                          }
                        >
                          {item.afterLevel !== null ? `Lv.${item.afterLevel}` : "—"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {growth === null ? (
                        <span className="text-xs text-[#94A3B8]">รอผล</span>
                      ) : growth > 0 ? (
                        <Badge variant="success">+{growth} ระดับ</Badge>
                      ) : (
                        <Badge variant="warning">คงเดิม</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={rMeta.variant} dot>
                        {rMeta.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        <Tooltip
                          content={
                            item.result === "pending"
                              ? "บันทึกผลการประเมินแผน IDP"
                              : "แก้ไขผลการประเมินแผน IDP"
                          }
                        >
                          <Button
                            size="sm"
                            variant={item.result === "pending" ? "primary" : "outline"}
                            leftIcon={
                              item.result === "pending" ? (
                                <ClipboardCheck className="h-3.5 w-3.5" />
                              ) : (
                                <Pencil className="h-3.5 w-3.5" />
                              )
                            }
                            onClick={() => openEvaluate(item)}
                            className="w-[104px] justify-center"
                          >
                            {item.result === "pending" ? "ประเมิน" : "ปรับผล"}
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

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title="บันทึกผลประเมินแผนพัฒนา IDP"
        description={selected ? `${selected.employeeName} — ${selected.focusGoal}` : undefined}
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setSelected(null)}>
              ยกเลิก
            </Button>
            <Button
              variant="primary"
              leftIcon={<Award className="h-4 w-4" />}
              onClick={handleSaveEvaluation}
            >
              บันทึกผลประเมิน
            </Button>
          </>
        }
      >
        {selected && (
          <div className="space-y-4">
            <div className="rounded-xl border border-[#EEF2F6] bg-[#F8FAFC] p-3 text-sm">
              ระดับทักษะก่อนเริ่มพัฒนา:{" "}
              <strong className="text-[#1E293B]">Lv.{selected.beforeLevel}</strong>
            </div>
            <Select
              label="ระดับทักษะหลังพัฒนา (After Level)"
              value={formAfterLevel}
              onChange={setFormAfterLevel}
              options={LEVEL_OPTIONS}
            />
            <Select
              label="สรุปผลลัพธ์แผนพัฒนา IDP"
              value={formResult}
              onChange={(v) => setFormResult(v as IdpEvalResult)}
              options={[
                { value: "exceed", label: "สูงกว่าเป้าหมาย (Exceed)" },
                { value: "achieved", label: "บรรลุเป้าหมาย (Achieved)" },
                { value: "developing", label: "กำลังพัฒนาต่อเนื่อง (Developing)" },
              ]}
            />
            <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50/70 px-3 py-2 text-xs text-emerald-700">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>ผลประเมินจะถูกใช้อัปเดตประวัติการพัฒนาและรายงาน HRD อัตโนมัติ</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
