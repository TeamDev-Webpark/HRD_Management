"use client";

import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, FolderOpen, Plus } from "lucide-react";
import {
  Badge,
  Button,
  EmptyState,
  Input,
  Modal,
  SearchBar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import type { CareerRequirementItem } from "@/data/mock/careerPathData";

interface CareerRequirementsPanelProps {
  items: CareerRequirementItem[];
  onChange: (items: CareerRequirementItem[]) => void;
  onNotify: (message: string) => void;
}

export function CareerRequirementsPanel({
  items,
  onChange,
  onNotify,
}: CareerRequirementsPanelProps) {
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  const [fromPosition, setFromPosition] = useState("");
  const [toPosition, setToPosition] = useState("");
  const [jobFamilyName, setJobFamilyName] = useState("เทคโนโลยีและวิศวกรรมซอฟต์แวร์");
  const [minTenureYears, setMinTenureYears] = useState("2");
  const [minPerfGrade, setMinPerfGrade] = useState("เกรด B+ ขึ้นไป");
  const [requiredSkills, setRequiredSkills] = useState("");
  const [requiredCert, setRequiredCert] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.code.toLowerCase().includes(q) ||
        item.fromPosition.toLowerCase().includes(q) ||
        item.toPosition.toLowerCase().includes(q) ||
        item.requiredSkills.toLowerCase().includes(q) ||
        item.requiredCert.toLowerCase().includes(q)
    );
  }, [items, search]);

  const handleAdd = () => {
    if (!fromPosition.trim() || !toPosition.trim()) return;
    const nextNum = String(items.length + 1).padStart(2, "0");
    const created: CareerRequirementItem = {
      id: `CR-${Date.now()}`,
      code: `REQ-${nextNum}`,
      fromPosition: fromPosition.trim(),
      toPosition: toPosition.trim(),
      jobFamilyName: jobFamilyName.trim() || "กลุ่มสายงานหลัก",
      minTenureYears: Math.max(1, Number(minTenureYears) || 2),
      minPerfGrade: minPerfGrade.trim() || "เกรด B+ ขึ้นไป",
      requiredSkills: requiredSkills.trim() || "ผ่านเกณฑ์สมรรถนะหลักประจำตำแหน่ง",
      requiredCert: requiredCert.trim() || "ผ่านหลักสูตรเตรียมความพร้อมผู้บริหาร",
    };
    onChange([created, ...items]);
    onNotify(`เพิ่มเกณฑ์การเลื่อนระดับ "${created.toPosition}" เรียบร้อยแล้ว`);
    setAddOpen(false);
    setFromPosition("");
    setToPosition("");
    setRequiredSkills("");
    setRequiredCert("");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="ค้นหาตำแหน่ง, ทักษะที่ต้องผ่าน หรือใบรับรองบังคับ..."
          className="w-full sm:w-80"
        />
        <Button
          variant="primary"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setAddOpen(true)}
        >
          เพิ่มเกณฑ์เลื่อนระดับ
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="ไม่พบเกณฑ์การเลื่อนระดับ"
          description="ลองปรับคำค้นหาหรือเพิ่มเงื่อนไขการเลื่อนตำแหน่งใหม่"
        />
      ) : (
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30%]">รหัส / เส้นทางการเลื่อนระดับ</TableHead>
                <TableHead className="w-[14%] text-center">อายุงานขั้นต่ำ</TableHead>
                <TableHead className="w-[16%]">เกณฑ์ผลประเมิน</TableHead>
                <TableHead className="w-[22%]">สมรรถนะที่ต้องผ่าน</TableHead>
                <TableHead className="w-[18%]">ใบรับรอง / หลักสูตรบังคับ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <span className="inline-block rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                      {item.code}
                    </span>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs font-semibold text-[#1E293B]">
                      <span>{item.fromPosition}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-[#2563EB]" />
                      <span className="text-[#2563EB]">{item.toPosition}</span>
                    </div>
                    <div className="mt-0.5 text-[11px] text-[#94A3B8]">{item.jobFamilyName}</div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="neutral">≥ {item.minTenureYears} ปี</Badge>
                  </TableCell>
                  <TableCell className="text-xs font-medium text-[#334155]">
                    {item.minPerfGrade}
                  </TableCell>
                  <TableCell className="text-xs text-[#475569]">{item.requiredSkills}</TableCell>
                  <TableCell className="text-xs font-medium text-[#2563EB]">
                    {item.requiredCert}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="เพิ่มเกณฑ์การเลื่อนระดับ (Career Requirements)"
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
              disabled={!fromPosition.trim() || !toPosition.trim()}
            >
              บันทึกเกณฑ์
            </Button>
          </>
        }
      >
        <div className="space-y-3.5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              label="ตำแหน่งต้นทาง"
              placeholder="เช่น Software Engineer (JG-05)"
              value={fromPosition}
              onChange={(e) => setFromPosition(e.target.value)}
            />
            <Input
              label="ตำแหน่งเป้าหมาย"
              placeholder="เช่น Senior Software Engineer (JG-06)"
              value={toPosition}
              onChange={(e) => setToPosition(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              label="อายุงานขั้นต่ำในตำแหน่ง (ปี)"
              type="number"
              min={1}
              value={minTenureYears}
              onChange={(e) => setMinTenureYears(e.target.value)}
            />
            <Input
              label="เกณฑ์ผลประเมินผลงาน"
              value={minPerfGrade}
              onChange={(e) => setMinPerfGrade(e.target.value)}
            />
          </div>
          <Input
            label="สมรรถนะที่ต้องผ่าน"
            placeholder="เช่น System Architecture Lv.3, Collaboration Lv.3"
            value={requiredSkills}
            onChange={(e) => setRequiredSkills(e.target.value)}
          />
          <Input
            label="ใบรับรอง / หลักสูตรบังคับ"
            placeholder="เช่น Cloud Practitioner หรือหลักสูตร Internal Tech Lead"
            value={requiredCert}
            onChange={(e) => setRequiredCert(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}
