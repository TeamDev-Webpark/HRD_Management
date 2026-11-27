"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, FolderOpen, Plus } from "lucide-react";
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
  CriticalityLevel,
  KeyPositionItem,
  PositionCoverageStatus,
  VacancyRisk,
} from "@/data/mock/successionData";

interface KeyPositionsPanelProps {
  items: KeyPositionItem[];
  onChange: (items: KeyPositionItem[]) => void;
  onNotify: (message: string) => void;
}

const CRIT_META: Record<
  CriticalityLevel,
  { label: string; variant: "danger" | "warning" | "neutral"; hint: string }
> = {
  critical: {
    label: "ระดับ 1: วิกฤตสูงสุด",
    variant: "danger",
    hint: "ตำแหน่งหลักที่หากว่างลงจะกระทบกลยุทธ์และรายได้องค์กรทันที ต้องมีผู้สืบทอดอย่างน้อย 2 คน",
  },
  high: {
    label: "ระดับ 2: สำคัญสูง",
    variant: "warning",
    hint: "ตำแหน่งผู้นำหรือผู้เชี่ยวชาญเฉพาะทางที่หาทดแทนจากภายนอกได้ยาก",
  },
  medium: {
    label: "ระดับ 3: สำคัญปานกลาง",
    variant: "neutral",
    hint: "ตำแหน่งหัวหน้างานระดับต้นที่ควรเตรียมผู้สืบทอดไว้ล่วงหน้า",
  },
};

const RISK_META: Record<VacancyRisk, { label: string; variant: "success" | "warning" | "danger" }> = {
  low: { label: "ความเสี่ยงต่ำ", variant: "success" },
  medium: { label: "ปานกลาง", variant: "warning" },
  high: { label: "เสี่ยงว่างสูง", variant: "danger" },
};

const COVERAGE_META: Record<
  PositionCoverageStatus,
  { label: string; variant: "success" | "warning" | "danger"; hint: string }
> = {
  covered: { label: "มีผู้สืบทอดครบ", variant: "success", hint: "มีผู้สืบทอดตัวหลักและสำรองรองรับแล้ว" },
  "at-risk": { label: "เสี่ยงขาดช่วง", variant: "warning", hint: "มีผู้สืบทอดน้อยหรือยังไม่พร้อมรับตำแหน่งทันที" },
  vacant: { label: "ตำแหน่งว่าง", variant: "danger", hint: "ยังไม่มีผู้ดำรงตำแหน่งตัวจริง ควรเร่งสรรหา/โอนย้าย" },
};

export function KeyPositionsPanel({ items, onChange, onNotify }: KeyPositionsPanelProps) {
  const [search, setSearch] = useState("");
  const [critFilter, setCritFilter] = useState<"all" | CriticalityLevel>("all");

  const [addOpen, setAddOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [dept, setDept] = useState("ฝ่ายวิศวกรรมซอฟต์แวร์");
  const [grade, setGrade] = useState("JG-08");
  const [incumbent, setIncumbent] = useState("");
  const [criticality, setCriticality] = useState<CriticalityLevel>("critical");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      if (critFilter !== "all" && item.criticality !== critFilter) return false;
      if (!q) return true;
      return (
        item.code.toLowerCase().includes(q) ||
        item.positionTitle.toLowerCase().includes(q) ||
        item.department.toLowerCase().includes(q) ||
        item.incumbentName.toLowerCase().includes(q)
      );
    });
  }, [items, search, critFilter]);

  const handleAdd = () => {
    if (!title.trim()) return;
    const nextNum = String(items.length + 1).padStart(2, "0");
    const created: KeyPositionItem = {
      id: `KP-${Date.now()}`,
      code: `KEY-${nextNum}`,
      positionTitle: title.trim(),
      department: dept.trim() || "ฝ่ายพัฒนาทรัพยากรบุคคล",
      jobGrade: grade.trim() || "JG-08",
      incumbentName: incumbent.trim() || "ยังว่าง",
      criticality,
      vacancyRisk: "medium",
      successorsCount: 0,
      status: incumbent.trim() ? "at-risk" : "vacant",
    };
    onChange([created, ...items]);
    onNotify(`เพิ่มตำแหน่งสำคัญ "${created.positionTitle}" เรียบร้อยแล้ว`);
    setAddOpen(false);
    setTitle("");
    setIncumbent("");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="ค้นหาตำแหน่งสำคัญ, แผนก หรือผู้ดำรงตำแหน่งปัจจุบัน..."
            className="w-full sm:w-80"
          />
          <Select
            aria-label="กรองตามระดับความสำคัญ"
            value={critFilter}
            onChange={(v) => setCritFilter(v as "all" | CriticalityLevel)}
            options={[
              { value: "all", label: "ความสำคัญ: ทั้งหมด" },
              { value: "critical", label: "ระดับ 1: วิกฤตสูงสุด" },
              { value: "high", label: "ระดับ 2: สำคัญสูง" },
              { value: "medium", label: "ระดับ 3: สำคัญปานกลาง" },
            ]}
            className="w-52"
          />
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setAddOpen(true)}
        >
          เพิ่มตำแหน่งสำคัญ
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="ไม่พบตำแหน่งสำคัญ (Key Positions)"
          description="ลองปรับคำค้นหาหรือเพิ่มตำแหน่งสำคัญใหม่"
        />
      ) : (
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[26%]">รหัส / ตำแหน่งสำคัญ</TableHead>
                <TableHead className="w-[18%]">ผู้ดำรงตำแหน่งปัจจุบัน</TableHead>
                <TableHead className="w-[16%] text-center">ระดับความสำคัญ</TableHead>
                <TableHead className="w-[14%] text-center">ความเสี่ยงว่าง</TableHead>
                <TableHead className="w-[12%] text-center">ผู้สืบทอด</TableHead>
                <TableHead className="w-[14%] text-center">สถานะความพร้อม</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => {
                const cMeta = CRIT_META[item.criticality];
                const rMeta = RISK_META[item.vacancyRisk];
                const covMeta = COVERAGE_META[item.status];
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <span className="inline-block rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                        {item.code}
                      </span>
                      <div className="mt-1 font-semibold text-[#1E293B]">{item.positionTitle}</div>
                      <div className="text-xs text-[#64748B]">
                        {item.department} • {item.jobGrade}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-medium text-[#334155]">
                      {item.incumbentName}
                    </TableCell>
                    <TableCell className="text-center">
                      <Tooltip title={cMeta.label} content={cMeta.hint}>
                        <Badge variant={cMeta.variant}>{cMeta.label}</Badge>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={rMeta.variant}>{rMeta.label}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="primary">{item.successorsCount} คน</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Tooltip title={covMeta.label} content={covMeta.hint}>
                        <Badge variant={covMeta.variant} dot>
                          {covMeta.label}
                        </Badge>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="เพิ่มตำแหน่งสำคัญ (Key Position)"
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
              disabled={!title.trim()}
            >
              บันทึกตำแหน่ง
            </Button>
          </>
        }
      >
        <div className="space-y-3.5">
          <Input
            label="ชื่อตำแหน่งสำคัญ"
            placeholder="เช่น Head of Data Engineering"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input label="แผนก / หน่วยงาน" value={dept} onChange={(e) => setDept(e.target.value)} />
            <Input label="Job Grade" value={grade} onChange={(e) => setGrade(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              label="ผู้ดำรงตำแหน่งปัจจุบัน"
              placeholder="เว้นว่างหากตำแหน่งยังว่าง"
              value={incumbent}
              onChange={(e) => setIncumbent(e.target.value)}
            />
            <Select
              label="ระดับความสำคัญต่อองค์กร"
              value={criticality}
              onChange={(v) => setCriticality(v as CriticalityLevel)}
              options={[
                { value: "critical", label: "ระดับ 1: วิกฤตสูงสุด" },
                { value: "high", label: "ระดับ 2: สำคัญสูง" },
                { value: "medium", label: "ระดับ 3: สำคัญปานกลาง" },
              ]}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
