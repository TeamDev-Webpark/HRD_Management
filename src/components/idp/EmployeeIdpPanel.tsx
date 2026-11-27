"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, FolderOpen, Plus, ThumbsUp } from "lucide-react";
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
import type { EmployeeIdpItem, IdpPlanStatus } from "@/data/mock/idpData";

interface EmployeeIdpPanelProps {
  items: EmployeeIdpItem[];
  onChange: (items: EmployeeIdpItem[]) => void;
  onNotify: (message: string) => void;
}

const PAGE_SIZE = 5;

const STATUS_META: Record<
  IdpPlanStatus,
  { label: string; variant: "neutral" | "primary" | "warning" | "success" }
> = {
  draft: { label: "รออนุมัติ", variant: "warning" },
  approved: { label: "อนุมัติแล้ว", variant: "primary" },
  "in-progress": { label: "กำลังพัฒนา", variant: "primary" },
  completed: { label: "สำเร็จตามแผน", variant: "success" },
};

export function EmployeeIdpPanel({ items, onChange, onNotify }: EmployeeIdpPanelProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | IdpPlanStatus>("all");
  const [page, setPage] = useState(1);

  const [createOpen, setCreateOpen] = useState(false);
  const [formEmpName, setFormEmpName] = useState("");
  const [formPosition, setFormPosition] = useState("Senior Developer");
  const [formDept, setFormDept] = useState("ฝ่ายวิศวกรรมซอฟต์แวร์");
  const [formGoal, setFormGoal] = useState("");
  const [formManager, setFormManager] = useState("ธนกร ศิริสวัสดิ์");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (!q) return true;
      return (
        item.code.toLowerCase().includes(q) ||
        item.employeeName.toLowerCase().includes(q) ||
        item.focusGoal.toLowerCase().includes(q) ||
        item.department.toLowerCase().includes(q)
      );
    });
  }, [items, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleApprove = (item: EmployeeIdpItem) => {
    onChange(
      items.map((row) =>
        row.id === item.id ? { ...row, status: "approved", progress: Math.max(row.progress, 25) } : row
      )
    );
    onNotify(`อนุมัติแผนพัฒนา IDP (${item.code}) ของ ${item.employeeName} เรียบร้อยแล้ว`);
  };

  const handleCreate = () => {
    if (!formEmpName.trim() || !formGoal.trim()) return;
    const nextNum = String(items.length + 1).padStart(2, "0");
    const created: EmployeeIdpItem = {
      id: `IDP-${Date.now()}`,
      code: `IDP-69-${nextNum}`,
      employeeCode: `EMP-${1100 + items.length}`,
      employeeName: formEmpName.trim(),
      position: formPosition.trim() || "พนักงาน",
      department: formDept.trim() || "ฝ่ายพัฒนาทรัพยากรบุคคล",
      cycle: "IDP 2569",
      focusGoal: formGoal.trim(),
      managerName: formManager.trim() || "หัวหน้างาน",
      activitiesCount: 2,
      progress: 10,
      status: "draft",
    };
    onChange([created, ...items]);
    onNotify(`สร้างแผนพัฒนา IDP (${created.code}) สำหรับ ${created.employeeName} แล้ว`);
    setCreateOpen(false);
    setFormEmpName("");
    setFormGoal("");
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
            placeholder="ค้นหาชื่อพนักงาน, รหัส IDP หรือเป้าหมายการพัฒนา..."
            className="w-full sm:w-80"
          />
          <Select
            aria-label="กรองตามสถานะแผน IDP"
            value={statusFilter}
            onChange={(v) => {
              setStatusFilter(v as "all" | IdpPlanStatus);
              setPage(1);
            }}
            options={[
              { value: "all", label: "สถานะ: ทั้งหมด" },
              { value: "draft", label: "รออนุมัติ" },
              { value: "approved", label: "อนุมัติแล้ว" },
              { value: "in-progress", label: "กำลังพัฒนา" },
              { value: "completed", label: "สำเร็จตามแผน" },
            ]}
            className="w-44"
          />
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setCreateOpen(true)}
        >
          สร้างแผน IDP ใหม่
        </Button>
      </div>

      {paged.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="ไม่พบแผนพัฒนารายบุคคล (IDP)"
          description="ลองปรับคำค้นหาหรือสร้างแผน IDP ใหม่ให้พนักงาน"
        />
      ) : (
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[22%]">รหัส / พนักงาน</TableHead>
                <TableHead className="w-[30%]">เป้าหมายการพัฒนาหลัก</TableHead>
                <TableHead className="w-[16%]">ความคืบหน้า</TableHead>
                <TableHead className="w-[10%] text-center">กิจกรรม</TableHead>
                <TableHead className="w-[11%] text-center">สถานะ</TableHead>
                <TableHead className="w-[11%] text-center">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map((item) => {
                const sMeta = STATUS_META[item.status];
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
                        หัวหน้าผู้ดูแล: {item.managerName} • รอบ {item.cycle}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Tooltip
                        className="block w-full"
                        content={`ความคืบหน้ารวมของแผน IDP อยู่ที่ ${item.progress}%`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#64748B]">ความคืบหน้า</span>
                            <span className="font-semibold text-[#1E293B]">{item.progress}%</span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-[#EEF2F6]">
                            <div
                              className={`h-full rounded-full ${
                                item.progress === 100 ? "bg-emerald-500" : "bg-[#2563EB]"
                              }`}
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                        </div>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="neutral">{item.activitiesCount} รายการ</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={sMeta.variant} dot>
                        {sMeta.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        {item.status === "draft" ? (
                          <Tooltip content="อนุมัติแผน IDP เพื่อให้พนักงานเริ่มดำเนินการพัฒนา">
                            <Button
                              size="sm"
                              variant="primary"
                              leftIcon={<ThumbsUp className="h-3.5 w-3.5" />}
                              onClick={() => handleApprove(item)}
                              className="w-[96px] justify-center"
                            >
                              อนุมัติ
                            </Button>
                          </Tooltip>
                        ) : (
                          <span className="inline-flex w-[96px] items-center justify-center text-xs font-medium text-[#64748B]">
                            {item.status === "completed" ? "เสร็จสมบูรณ์" : "อนุมัติแล้ว"}
                          </span>
                        )}
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
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="สร้างแผนพัฒนารายบุคคล (IDP) ใหม่"
        description="กำหนดเป้าหมายการพัฒนาหลักของพนักงานประจำรอบ IDP 2569"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              ยกเลิก
            </Button>
            <Button
              variant="primary"
              leftIcon={<CheckCircle2 className="h-4 w-4" />}
              onClick={handleCreate}
              disabled={!formEmpName.trim() || !formGoal.trim()}
            >
              บันทึกแผน IDP
            </Button>
          </>
        }
      >
        <div className="space-y-3.5">
          <Input
            label="ชื่อพนักงาน"
            placeholder="เช่น กานต์สินี วงศ์สุวรรณ"
            value={formEmpName}
            onChange={(e) => setFormEmpName(e.target.value)}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              label="ตำแหน่ง"
              value={formPosition}
              onChange={(e) => setFormPosition(e.target.value)}
            />
            <Input
              label="แผนก"
              value={formDept}
              onChange={(e) => setFormDept(e.target.value)}
            />
          </div>
          <Input
            label="เป้าหมายการพัฒนาหลัก (Focus Goal)"
            placeholder="เช่น พัฒนาทักษะ Data Visualization และการนำเสนอระดับผู้บริหาร"
            value={formGoal}
            onChange={(e) => setFormGoal(e.target.value)}
          />
          <Input
            label="หัวหน้าผู้ดูแลแผน (Manager / Mentor)"
            value={formManager}
            onChange={(e) => setFormManager(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}
