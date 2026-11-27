"use client";

import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, FolderOpen, Pencil } from "lucide-react";
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
  CareerReadinessStatus,
  EmployeeCareerPlanItem,
} from "@/data/mock/careerPathData";

interface EmployeeCareerPlanPanelProps {
  items: EmployeeCareerPlanItem[];
  onChange: (items: EmployeeCareerPlanItem[]) => void;
  onNotify: (message: string) => void;
}

const STATUS_META: Record<
  CareerReadinessStatus,
  { label: string; variant: "success" | "primary" | "warning" }
> = {
  "ready-now": { label: "พร้อมเลื่อนระดับ", variant: "success" },
  developing: { label: "กำลังเตรียมความพร้อม", variant: "primary" },
  exploring: { label: "สำรวจเส้นทาง", variant: "warning" },
};

export function EmployeeCareerPlanPanel({
  items,
  onChange,
  onNotify,
}: EmployeeCareerPlanPanelProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | CareerReadinessStatus>("all");

  const [selected, setSelected] = useState<EmployeeCareerPlanItem | null>(null);
  const [formReadiness, setFormReadiness] = useState("85");
  const [formTimeframe, setFormTimeframe] = useState("ภายใน 12 เดือน");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (!q) return true;
      return (
        item.code.toLowerCase().includes(q) ||
        item.employeeName.toLowerCase().includes(q) ||
        item.currentPosition.toLowerCase().includes(q) ||
        item.targetPosition.toLowerCase().includes(q)
      );
    });
  }, [items, search, statusFilter]);

  const openUpdate = (item: EmployeeCareerPlanItem) => {
    setSelected(item);
    setFormReadiness(String(item.readiness));
    setFormTimeframe(item.timeframe);
  };

  const handleSave = () => {
    if (!selected) return;
    const pct = Math.min(100, Math.max(0, Number(formReadiness) || 0));
    const nextStatus: CareerReadinessStatus =
      pct >= 90 ? "ready-now" : pct >= 65 ? "developing" : "exploring";
    onChange(
      items.map((row) =>
        row.id === selected.id
          ? {
              ...row,
              readiness: pct,
              timeframe: formTimeframe.trim() || row.timeframe,
              status: nextStatus,
            }
          : row
      )
    );
    onNotify(`อัปเดตความพร้อมแผนอาชีพของ ${selected.employeeName} (${pct}%) เรียบร้อยแล้ว`);
    setSelected(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="ค้นหาชื่อพนักงาน, ตำแหน่งปัจจุบัน หรือตำแหน่งเป้าหมาย..."
            className="w-full sm:w-80"
          />
          <Select
            aria-label="กรองตามสถานะความพร้อม"
            value={statusFilter}
            onChange={(v) => setStatusFilter(v as "all" | CareerReadinessStatus)}
            options={[
              { value: "all", label: "สถานะ: ทั้งหมด" },
              { value: "ready-now", label: "พร้อมเลื่อนระดับ" },
              { value: "developing", label: "กำลังเตรียมความพร้อม" },
              { value: "exploring", label: "สำรวจเส้นทาง" },
            ]}
            className="w-48"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="ไม่พบแผนเส้นทางอาชีพพนักงาน"
          description="ลองปรับคำค้นหาหรือเปลี่ยนตัวกรองสถานะความพร้อม"
        />
      ) : (
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[21%]">รหัส / พนักงาน</TableHead>
                <TableHead className="w-[31%]">ตำแหน่งปัจจุบัน → เป้าหมาย</TableHead>
                <TableHead className="w-[14%]">ความพร้อม</TableHead>
                <TableHead className="w-[11%] text-center">ระยะเวลา</TableHead>
                <TableHead className="w-[12%] text-center">สถานะ</TableHead>
                <TableHead className="w-[11%] text-center">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => {
                const sMeta = STATUS_META[item.status];
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <span className="inline-block rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                        {item.code}
                      </span>
                      <div className="mt-1 font-semibold text-[#1E293B]">{item.employeeName}</div>
                      <div className="text-xs text-[#64748B]">{item.department}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-[#334155]">
                        <span>{item.currentPosition}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-[#2563EB]" />
                        <span className="font-semibold text-[#2563EB]">{item.targetPosition}</span>
                      </div>
                      <div className="mt-1 text-[11px] text-[#94A3B8]">
                        Mentor: {item.mentorName} • {item.trackType} Track
                      </div>
                    </TableCell>
                    <TableCell>
                      <Tooltip
                        className="block w-full"
                        content={`ความพร้อมตามเกณฑ์เลื่อนระดับ ${item.readiness}%`}
                      >
                        <div className="space-y-1.5">
                          <div className="text-right text-xs font-semibold text-[#1E293B]">
                            {item.readiness}%
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-[#EEF2F6]">
                            <div
                              className={`h-full rounded-full ${
                                item.readiness >= 90 ? "bg-emerald-500" : "bg-[#2563EB]"
                              }`}
                              style={{ width: `${item.readiness}%` }}
                            />
                          </div>
                        </div>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="text-center text-xs font-medium text-[#475569]">
                      {item.timeframe}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={sMeta.variant} dot>
                        {sMeta.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        <Tooltip content="ปรับระดับความพร้อมและระยะเวลาเป้าหมาย">
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
        title="อัปเดตความพร้อมแผนเส้นทางอาชีพ"
        description={
          selected ? `${selected.employeeName} → ${selected.targetPosition}` : undefined
        }
        size="sm"
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
              บันทึกความพร้อม
            </Button>
          </>
        }
      >
        <div className="space-y-3.5">
          <Input
            label="เปอร์เซ็นต์ความพร้อม (0–100%)"
            type="number"
            min={0}
            max={100}
            value={formReadiness}
            onChange={(e) => setFormReadiness(e.target.value)}
          />
          <Input
            label="ระยะเวลาเป้าหมาย"
            value={formTimeframe}
            onChange={(e) => setFormTimeframe(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}
