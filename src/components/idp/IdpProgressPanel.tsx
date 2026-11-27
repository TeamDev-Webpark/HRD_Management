"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, FolderOpen, MessageSquarePlus } from "lucide-react";
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
import type { IdpTrackingItem, IdpTrackStatus } from "@/data/mock/idpData";

interface IdpProgressPanelProps {
  items: IdpTrackingItem[];
  onChange: (items: IdpTrackingItem[]) => void;
  onNotify: (message: string) => void;
}

const TRACK_STATUS_META: Record<
  IdpTrackStatus,
  { label: string; variant: "primary" | "danger" | "success" }
> = {
  "on-track": { label: "ตามแผน", variant: "primary" },
  "at-risk": { label: "ล่าช้ากว่าแผน", variant: "danger" },
  completed: { label: "บรรลุผลแล้ว", variant: "success" },
};

export function IdpProgressPanel({ items, onChange, onNotify }: IdpProgressPanelProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | IdpTrackStatus>("all");

  const [selected, setSelected] = useState<IdpTrackingItem | null>(null);
  const [formProgress, setFormProgress] = useState("80");
  const [formFeedback, setFormFeedback] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (!q) return true;
      return (
        item.code.toLowerCase().includes(q) ||
        item.employeeName.toLowerCase().includes(q) ||
        item.activityTitle.toLowerCase().includes(q) ||
        item.evidenceNote.toLowerCase().includes(q)
      );
    });
  }, [items, search, statusFilter]);

  const openCheckin = (item: IdpTrackingItem) => {
    setSelected(item);
    setFormProgress(String(item.progress));
    setFormFeedback(item.managerFeedback);
  };

  const handleSaveCheckin = () => {
    if (!selected) return;
    const pct = Math.min(100, Math.max(0, Number(formProgress) || 0));
    const nextStatus: IdpTrackStatus =
      pct >= 100 ? "completed" : pct < 50 ? "at-risk" : "on-track";
    onChange(
      items.map((row) =>
        row.id === selected.id
          ? {
              ...row,
              progress: pct,
              managerFeedback: formFeedback.trim() || row.managerFeedback,
              updatedDate: "27 พ.ย. 2569",
              status: nextStatus,
            }
          : row
      )
    );
    onNotify(`บันทึกการติดตามความคืบหน้าของ ${selected.employeeName} (${pct}%) เรียบร้อยแล้ว`);
    setSelected(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="ค้นหาพนักงาน, กิจกรรม หรือหลักฐานความคืบหน้า..."
            className="w-full sm:w-80"
          />
          <Select
            aria-label="กรองตามสถานะติดตาม"
            value={statusFilter}
            onChange={(v) => setStatusFilter(v as "all" | IdpTrackStatus)}
            options={[
              { value: "all", label: "สถานะ: ทั้งหมด" },
              { value: "on-track", label: "ตามแผน" },
              { value: "at-risk", label: "ล่าช้ากว่าแผน" },
              { value: "completed", label: "บรรลุผลแล้ว" },
            ]}
            className="w-44"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="ไม่พบรายการติดตามความคืบหน้า"
          description="ลองปรับคำค้นหาหรือเปลี่ยนตัวกรองสถานะ"
        />
      ) : (
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[20%]">รหัส / พนักงาน</TableHead>
                <TableHead className="w-[28%]">กิจกรรมและหลักฐานล่าสุด</TableHead>
                <TableHead className="w-[20%]">ความเห็นหัวหน้างาน</TableHead>
                <TableHead className="w-[12%]">ความคืบหน้า</TableHead>
                <TableHead className="w-[10%] text-center">สถานะ</TableHead>
                <TableHead className="w-[10%] text-center">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => {
                const sMeta = TRACK_STATUS_META[item.status];
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <span className="inline-block rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                        {item.code}
                      </span>
                      <div className="mt-1 font-semibold text-[#1E293B]">{item.employeeName}</div>
                      <div className="text-xs text-[#64748B]">อัปเดต {item.updatedDate}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-[#1E293B]">{item.activityTitle}</div>
                      <div className="mt-1 text-xs text-[#64748B]">{item.evidenceNote}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs leading-relaxed text-[#475569]">
                        “{item.managerFeedback}”
                      </div>
                    </TableCell>
                    <TableCell>
                      <Tooltip
                        className="block w-full"
                        content={`ความคืบหน้ากิจกรรม ${item.progress}%`}
                      >
                        <div className="space-y-1.5">
                          <div className="text-right text-xs font-semibold text-[#1E293B]">
                            {item.progress}%
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-[#EEF2F6]">
                            <div
                              className={`h-full rounded-full ${
                                item.status === "at-risk"
                                  ? "bg-rose-500"
                                  : item.progress === 100
                                    ? "bg-emerald-500"
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
                        <Tooltip content="อัปเดต % ความคืบหน้าและบันทึกคำแนะนำของหัวหน้างาน">
                          <Button
                            size="sm"
                            variant="outline"
                            leftIcon={<MessageSquarePlus className="h-3.5 w-3.5" />}
                            onClick={() => openCheckin(item)}
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
        title="อัปเดตความคืบหน้า & Feedback"
        description={
          selected ? `${selected.employeeName} — ${selected.activityTitle}` : undefined
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
              onClick={handleSaveCheckin}
            >
              บันทึกความคืบหน้า
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
            label="ความเห็น / ข้อเสนอแนะจากหัวหน้างาน"
            value={formFeedback}
            onChange={(e) => setFormFeedback(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}
