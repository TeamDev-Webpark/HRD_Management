"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, FolderOpen, Pencil } from "lucide-react";
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
import type {
  SuccessionPlanItem,
  SuccessionPlanStatus,
} from "@/data/mock/successionData";

interface SuccessionPlanPanelProps {
  items: SuccessionPlanItem[];
  onChange: (items: SuccessionPlanItem[]) => void;
  onNotify: (message: string) => void;
}

const PLAN_STATUS_META: Record<
  SuccessionPlanStatus,
  { label: string; variant: "primary" | "success" | "warning" }
> = {
  active: { label: "กำลังเตรียมความพร้อม", variant: "primary" },
  completed: { label: "พร้อมส่งมอบแล้ว", variant: "success" },
  "review-needed": { label: "ควรทบทวนแผน", variant: "warning" },
};

export function SuccessionPlanPanel({
  items,
  onChange,
  onNotify,
}: SuccessionPlanPanelProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | SuccessionPlanStatus>("all");

  const [selected, setSelected] = useState<SuccessionPlanItem | null>(null);
  const [formProgress, setFormProgress] = useState("80");
  const [formMilestone, setFormMilestone] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (!q) return true;
      return (
        item.code.toLowerCase().includes(q) ||
        item.keyPosition.toLowerCase().includes(q) ||
        item.primarySuccessor.toLowerCase().includes(q) ||
        item.keyMilestone.toLowerCase().includes(q)
      );
    });
  }, [items, search, statusFilter]);

  const openUpdate = (item: SuccessionPlanItem) => {
    setSelected(item);
    setFormProgress(String(item.progress));
    setFormMilestone(item.keyMilestone);
  };

  const handleSave = () => {
    if (!selected) return;
    const pct = Math.min(100, Math.max(0, Number(formProgress) || 0));
    const nextStatus: SuccessionPlanStatus =
      pct >= 100 ? "completed" : pct < 60 ? "review-needed" : "active";
    onChange(
      items.map((row) =>
        row.id === selected.id
          ? {
              ...row,
              progress: pct,
              keyMilestone: formMilestone.trim() || row.keyMilestone,
              status: nextStatus,
            }
          : row
      )
    );
    onNotify(`อัปเดตแผนการสืบทอดตำแหน่ง "${selected.keyPosition}" (${pct}%) แล้ว`);
    setSelected(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="ค้นหาตำแหน่งสำคัญ, ผู้สืบทอด หรือแผนการส่งมอบ..."
            className="w-full sm:w-80"
          />
          <Select
            aria-label="กรองตามสถานะแผนสืบทอด"
            value={statusFilter}
            onChange={(v) => setStatusFilter(v as "all" | SuccessionPlanStatus)}
            options={[
              { value: "all", label: "สถานะแผน: ทั้งหมด" },
              { value: "active", label: "กำลังเตรียมความพร้อม" },
              { value: "completed", label: "พร้อมส่งมอบแล้ว" },
              { value: "review-needed", label: "ควรทบทวนแผน" },
            ]}
            className="w-48"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="ไม่พบแผนการสืบทอดตำแหน่ง"
          description="ลองปรับคำค้นหาหรือตัวกรองสถานะแผน"
        />
      ) : (
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[21%]">รหัส / ตำแหน่งสำคัญ</TableHead>
                <TableHead className="w-[19%]">ผู้สืบทอดตัวหลัก / สำรอง</TableHead>
                <TableHead className="w-[24%]">แผนพัฒนาและส่งมอบงาน</TableHead>
                <TableHead className="w-[13%]">ความคืบหน้า</TableHead>
                <TableHead className="w-[12%] text-center">สถานะ</TableHead>
                <TableHead className="w-[11%] text-center">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => {
                const sMeta = PLAN_STATUS_META[item.status];
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <span className="inline-block rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                        {item.code}
                      </span>
                      <div className="mt-1 font-semibold text-[#1E293B]">{item.keyPosition}</div>
                      <div className="text-xs text-[#64748B]">
                        {item.department} • เป้า {item.targetDate}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs font-semibold text-[#1E293B]">
                        1. {item.primarySuccessor}
                      </div>
                      <div className="mt-0.5 text-xs text-[#64748B]">
                        2. {item.backupSuccessor}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs leading-relaxed text-[#475569]">
                      {item.keyMilestone}
                    </TableCell>
                    <TableCell>
                      <Tooltip
                        className="block w-full"
                        content={`ความคืบหน้าแผนการสืบทอดตำแหน่ง ${item.progress}%`}
                      >
                        <div className="space-y-1.5">
                          <div className="text-right text-xs font-semibold text-[#1E293B]">
                            {item.progress}%
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-[#EEF2F6]">
                            <div
                              className={`h-full rounded-full ${
                                item.progress === 100
                                  ? "bg-emerald-500"
                                  : item.status === "review-needed"
                                    ? "bg-amber-500"
                                    : "bg-[#2563EB]"
                              }`}
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                        </div>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={sMeta.variant} dot>
                        {sMeta.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        <Tooltip content="อัปเดต % ความคืบหน้าและแผนส่งมอบงาน">
                          <Button
                            size="sm"
                            variant="outline"
                            leftIcon={<Pencil className="h-3.5 w-3.5" />}
                            onClick={() => openUpdate(item)}
                            className="w-[100px] justify-center"
                          >
                            อัปเดต
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
        title="อัปเดตแผนการสืบทอดตำแหน่ง"
        description={selected ? `${selected.keyPosition} — ตัวหลัก: ${selected.primarySuccessor}` : undefined}
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setSelected(null)}>
              ยกเลิก
            </Button>
            <Button
              variant="primary"
              leftIcon={<CheckCircle2 className="h-4 w-4" />}
              onClick={handleSave}
            >
              บันทึกแผน
            </Button>
          </>
        }
      >
        <div className="space-y-3.5">
          <Input
            label="เปอร์เซ็นต์ความคืบหน้า (0–100%)"
            type="number"
            min={0}
            max={100}
            value={formProgress}
            onChange={(e) => setFormProgress(e.target.value)}
          />
          <Input
            label="แผนพัฒนาและส่งมอบงานสำคัญ (Key Milestone)"
            value={formMilestone}
            onChange={(e) => setFormMilestone(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}
