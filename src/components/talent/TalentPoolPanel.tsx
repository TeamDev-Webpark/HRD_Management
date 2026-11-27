"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, FolderOpen, Plus, UserCheck } from "lucide-react";
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
  RetentionRisk,
  TalentPoolItem,
  TalentPoolStatus,
  TalentTier,
} from "@/data/mock/talentManagement";

interface TalentPoolPanelProps {
  items: TalentPoolItem[];
  onChange: (items: TalentPoolItem[]) => void;
  onNotify: (message: string) => void;
}

const PAGE_SIZE = 5;

const TIER_META: Record<
  TalentTier,
  { rank: number; variant: "primary" | "success" | "warning" | "neutral"; hint: string }
> = {
  HiPo: {
    rank: 1,
    variant: "primary",
    hint: "ระดับ 1 (สูงสุด) — High Potential ศักยภาพและผลงานโดดเด่น พร้อมพัฒนาสู่ผู้นำระดับสูง",
  },
  "Key Talent": {
    rank: 2,
    variant: "success",
    hint: "ระดับ 2 — บุคลากรสำคัญที่มีทักษะเชี่ยวชาญและสร้างผลกระทบสูงต่อธุรกิจ (รองจาก HiPo)",
  },
  "Emerging Talent": {
    rank: 3,
    variant: "warning",
    hint: "ระดับ 3 — ดาวรุ่งรุ่นใหม่ที่กำลังเติบโต มีแววก้าวขึ้นเป็น Key Talent / HiPo ในอนาคต",
  },
  "Core Performer": {
    rank: 4,
    variant: "neutral",
    hint: "ระดับ 4 (ฐานหลัก) — ผู้ปฏิบัติงานหลักที่รักษามาตรฐานผลงานได้อย่างสม่ำเสมอ",
  },
};

const TIER_ORDER: TalentTier[] = ["HiPo", "Key Talent", "Emerging Talent", "Core Performer"];

const RISK_META: Record<
  RetentionRisk,
  { label: string; variant: "success" | "warning" | "danger"; hint: string }
> = {
  low: {
    label: "ความเสี่ยงต่ำ",
    variant: "success",
    hint: "มีความผูกพันกับองค์กรสูง โอกาสลาออกใน 12 เดือนต่ำ",
  },
  medium: {
    label: "ปานกลาง",
    variant: "warning",
    hint: "ควรติดตามความก้าวหน้าและจัดคุย Career Check-in อย่างสม่ำเสมอ",
  },
  high: {
    label: "เสี่ยงสูง",
    variant: "danger",
    hint: "มีโอกาสถูกดึงตัวหรือลาออกสูง ควรจัดทำ Retention Plan เร่งด่วน",
  },
};

const STATUS_META: Record<
  TalentPoolStatus,
  { label: string; variant: "success" | "primary" | "danger"; hint: string }
> = {
  active: {
    label: "อยู่ใน Pool",
    variant: "success",
    hint: "ได้รับการอนุมัติเข้าทะเบียน Talent Pool และอยู่ระหว่างพัฒนาตามแผน",
  },
  nominated: {
    label: "เสนอชื่อเข้า Pool",
    variant: "primary",
    hint: "หัวหน้างานเสนอชื่อแล้ว รอฝ่าย HRD / คณะกรรมการยืนยันรับเข้า Pool",
  },
  "on-watch": {
    label: "เฝ้าระวังรักษาตัว",
    variant: "danger",
    hint: "กลุ่ม Talent สำคัญที่ต้องดูแลใกล้ชิดเพื่อป้องกันการลาออก",
  },
};

export function TalentPoolPanel({ items, onChange, onNotify }: TalentPoolPanelProps) {
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState<"all" | TalentTier>("all");
  const [page, setPage] = useState(1);

  const [addOpen, setAddOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formPosition, setFormPosition] = useState("Senior Specialist");
  const [formDept, setFormDept] = useState("ฝ่ายวิศวกรรมซอฟต์แวร์");
  const [formTier, setFormTier] = useState<TalentTier>("HiPo");
  const [formNextRole, setFormNextRole] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      if (tierFilter !== "all" && item.tier !== tierFilter) return false;
      if (!q) return true;
      return (
        item.code.toLowerCase().includes(q) ||
        item.employeeName.toLowerCase().includes(q) ||
        item.position.toLowerCase().includes(q) ||
        item.department.toLowerCase().includes(q) ||
        item.targetNextRole.toLowerCase().includes(q)
      );
    });
  }, [items, search, tierFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleConfirmPool = (item: TalentPoolItem) => {
    onChange(
      items.map((row) => (row.id === item.id ? { ...row, status: "active" } : row))
    );
    onNotify(`อนุมัติรับ ${item.employeeName} เข้าสู่ Talent Pool เรียบร้อยแล้ว`);
  };

  const handleAdd = () => {
    if (!formName.trim()) return;
    const nextNum = String(items.length + 1).padStart(2, "0");
    const created: TalentPoolItem = {
      id: `TL-${Date.now()}`,
      code: `TLT-69-${nextNum}`,
      employeeCode: `EMP-${1120 + items.length}`,
      employeeName: formName.trim(),
      position: formPosition.trim() || "พนักงาน",
      department: formDept.trim() || "ฝ่ายพัฒนาทรัพยากรบุคคล",
      tier: formTier,
      performance: formTier === "HiPo" ? 3 : 2,
      potential: formTier === "HiPo" ? 3 : 2,
      retentionRisk: "low",
      targetNextRole: formNextRole.trim() || "Team Lead",
      status: "nominated",
    };
    onChange([created, ...items]);
    onNotify(`เสนอชื่อ ${created.employeeName} เข้าสู่ Talent Pool แล้ว`);
    setAddOpen(false);
    setFormName("");
    setFormNextRole("");
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
            placeholder="ค้นหาชื่อ Talent, ตำแหน่ง, แผนก หรือตำแหน่งเป้าหมาย..."
            className="w-full sm:w-80"
          />
          <Select
            aria-label="กรองตามกลุ่ม Talent"
            value={tierFilter}
            onChange={(v) => {
              setTierFilter(v as "all" | TalentTier);
              setPage(1);
            }}
            options={[
              { value: "all", label: "กลุ่ม Talent: ทั้งหมด" },
              { value: "HiPo", label: "HiPo (High Potential)" },
              { value: "Key Talent", label: "Key Talent" },
              { value: "Emerging Talent", label: "Emerging Talent" },
            ]}
            className="w-48"
          />
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setAddOpen(true)}
        >
          เสนอชื่อเข้า Talent Pool
        </Button>
      </div>

      {/* Clear Hierarchy Guide (Highest -> Lowest) */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[#EEF2F6] bg-[#F8FAFC] px-3.5 py-2.5 text-xs">
        <span className="font-semibold text-[#475569]">ลำดับระดับกลุ่ม Talent (สูงสุด → ฐานหลัก):</span>
        <div className="flex flex-wrap items-center gap-1.5">
          {TIER_ORDER.map((tier, idx) => {
            const meta = TIER_META[tier];
            return (
              <div key={tier} className="inline-flex items-center gap-1.5">
                <Tooltip title={`ระดับ ${meta.rank}: ${tier}`} content={meta.hint}>
                  <Badge variant={meta.variant}>
                    {meta.rank}. {tier}
                  </Badge>
                </Tooltip>
                {idx < TIER_ORDER.length - 1 && (
                  <span className="font-bold text-[#94A3B8]">›</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {paged.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="ไม่พบรายชื่อใน Talent Pool"
          description="ลองปรับคำค้นหาหรือเสนอชื่อพนักงานศักยภาพสูงเข้าสู่กลุ่ม Talent"
        />
      ) : (
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[24%]">รหัส / พนักงาน</TableHead>
                <TableHead className="w-[14%] text-center">กลุ่ม Talent</TableHead>
                <TableHead className="w-[22%]">ตำแหน่งเป้าหมายถัดไป</TableHead>
                <TableHead className="w-[14%] text-center">ความเสี่ยงลาออก</TableHead>
                <TableHead className="w-[14%] text-center">สถานะ</TableHead>
                <TableHead className="w-[12%] text-center">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map((item) => {
                const tierMeta = TIER_META[item.tier];
                const riskMeta = RISK_META[item.retentionRisk];
                const statusMeta = STATUS_META[item.status];
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
                    <TableCell className="text-center">
                      <Tooltip title={item.tier} content={tierMeta.hint}>
                        <Badge variant={tierMeta.variant}>{item.tier}</Badge>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-[#1E293B]">{item.targetNextRole}</div>
                      <Tooltip content={`ตำแหน่งบน 9-Box Grid: ผลงานระดับ ${item.performance}/3 และศักยภาพระดับ ${item.potential}/3`}>
                        <div className="inline-block cursor-help text-xs text-[#94A3B8]">
                          Perf {item.performance}/3 • Potential {item.potential}/3
                        </div>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="text-center">
                      <Tooltip title={`ความเสี่ยงการลาออก: ${riskMeta.label}`} content={riskMeta.hint}>
                        <Badge variant={riskMeta.variant}>{riskMeta.label}</Badge>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="text-center">
                      <Tooltip title={statusMeta.label} content={statusMeta.hint}>
                        <Badge variant={statusMeta.variant} dot>
                          {statusMeta.label}
                        </Badge>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        {item.status === "nominated" ? (
                          <Tooltip content="ยืนยันรับพนักงานเข้าสู่ทะเบียน Talent Pool">
                            <Button
                              size="sm"
                              variant="primary"
                              leftIcon={<UserCheck className="h-3.5 w-3.5" />}
                              onClick={() => handleConfirmPool(item)}
                              className="w-[100px] justify-center"
                            >
                              รับเข้า Pool
                            </Button>
                          </Tooltip>
                        ) : (
                          <span className="inline-flex w-[100px] items-center justify-center text-xs font-medium text-[#64748B]">
                            ยืนยันแล้ว
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
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="เสนอชื่อพนักงานเข้า Talent Pool"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              ยกเลิก
            </Button>
            <Button
              variant="primary"
              leftIcon={<CheckCircle2 className="h-4 w-4" />}
              onClick={handleAdd}
              disabled={!formName.trim()}
            >
              บันทึกการเสนอชื่อ
            </Button>
          </>
        }
      >
        <div className="space-y-3.5">
          <Input
            label="ชื่อพนักงาน"
            placeholder="เช่น พีรพล กิตติวัฒน์"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              label="ตำแหน่งปัจจุบัน"
              value={formPosition}
              onChange={(e) => setFormPosition(e.target.value)}
            />
            <Input
              label="แผนก"
              value={formDept}
              onChange={(e) => setFormDept(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Select
              label="กลุ่ม Talent"
              value={formTier}
              onChange={(v) => setFormTier(v as TalentTier)}
              options={[
                { value: "HiPo", label: "HiPo (High Potential)" },
                { value: "Key Talent", label: "Key Talent" },
                { value: "Emerging Talent", label: "Emerging Talent" },
              ]}
            />
            <Input
              label="ตำแหน่งเป้าหมายถัดไป"
              placeholder="เช่น Product Manager"
              value={formNextRole}
              onChange={(e) => setFormNextRole(e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
