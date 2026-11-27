"use client";

import { useMemo, useState } from "react";
import { Clock, FolderOpen, Pencil, Plus } from "lucide-react";
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
  Tooltip,
} from "@/components/ui";
import type { OnlineAssessmentItem } from "@/data/mock/lmsAssessment";

interface OnlineAssessmentPanelProps {
  items: OnlineAssessmentItem[];
  onChange: (items: OnlineAssessmentItem[]) => void;
  onNotify: (message: string) => void;
}

export function OnlineAssessmentPanel({
  items,
  onChange,
  onNotify,
}: OnlineAssessmentPanelProps) {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [courseTitle, setCourseTitle] = useState("Generative AI Essentials for Everyday Work");
  const [questionCount, setQuestionCount] = useState("20");
  const [timeLimitMin, setTimeLimitMin] = useState("30");
  const [passingScore, setPassingScore] = useState("80");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) =>
        i.code.toLowerCase().includes(q) ||
        i.title.toLowerCase().includes(q) ||
        i.courseTitle.toLowerCase().includes(q)
    );
  }, [items, search]);

  const openCreate = () => {
    setEditingId(null);
    setTitle("");
    setCourseTitle("Generative AI Essentials for Everyday Work");
    setQuestionCount("20");
    setTimeLimitMin("30");
    setPassingScore("80");
    setModalOpen(true);
  };

  const openEdit = (item: OnlineAssessmentItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setCourseTitle(item.courseTitle);
    setQuestionCount(String(item.questionCount));
    setTimeLimitMin(String(item.timeLimitMin));
    setPassingScore(String(item.passingScore));
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!title.trim()) return;
    if (editingId) {
      onChange(
        items.map((item) =>
          item.id === editingId
            ? {
                ...item,
                title: title.trim(),
                courseTitle: courseTitle.trim() || item.courseTitle,
                questionCount: Math.max(1, Number(questionCount) || 10),
                timeLimitMin: Math.max(5, Number(timeLimitMin) || 20),
                passingScore: Math.min(100, Math.max(1, Number(passingScore) || 80)),
              }
            : item
        )
      );
      onNotify(`อัปเดตแบบทดสอบ "${title.trim()}" เรียบร้อยแล้ว`);
    } else {
      const created: OnlineAssessmentItem = {
        id: `ASM-${Date.now()}`,
        code: `EXAM-NEW-${String(items.length + 1).padStart(2, "0")}`,
        title: title.trim(),
        courseTitle: courseTitle.trim() || "หลักสูตรออนไลน์",
        questionCount: Math.max(1, Number(questionCount) || 15),
        timeLimitMin: Math.max(5, Number(timeLimitMin) || 30),
        passingScore: Math.min(100, Math.max(1, Number(passingScore) || 80)),
        attemptsCount: 0,
        passRate: 0,
        active: true,
      };
      onChange([created, ...items]);
      onNotify(`สร้างแบบทดสอบออนไลน์ "${created.title}" แล้ว`);
    }
    setModalOpen(false);
  };

  const toggleActive = (id: string) => {
    const target = items.find((i) => i.id === id);
    onChange(items.map((i) => (i.id === id ? { ...i, active: !i.active } : i)));
    if (target) {
      onNotify(`${target.active ? "ปิดรับสอบ" : "เปิดรับสอบ"} "${target.title}" แล้ว`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="ค้นหารหัส ชื่อแบบทดสอบ หรือหลักสูตร..."
          containerClassName="w-full sm:w-72"
        />
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={openCreate}>
          สร้างแบบทดสอบออนไลน์
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="ไม่พบแบบทดสอบออนไลน์"
          description="ลองปรับคำค้นหาใหม่"
        />
      ) : (
        <TableContainer className="rounded-xl border border-[#EEF2F6]">
          <Table>
            <TableHeader className="bg-[#F8FAFC]">
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-5">รหัส / แบบทดสอบออนไลน์</TableHead>
                <TableHead className="w-36 text-center">จำนวนข้อ / เวลา</TableHead>
                <TableHead className="w-28 text-center">เกณฑ์ผ่าน</TableHead>
                <TableHead className="w-48 px-4">อัตราการสอบผ่าน</TableHead>
                <TableHead className="w-24 text-center">เปิดสอบ</TableHead>
                <TableHead className="w-20 pr-5 text-center">แก้ไข</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id} className={!item.active ? "opacity-60" : ""}>
                  <TableCell className="py-3.5 pl-5">
                    <span className="rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                      {item.code}
                    </span>
                    <p className="mt-1 font-semibold text-[#1E293B]">{item.title}</p>
                    <p className="text-xs text-[#94A3B8]">{item.courseTitle}</p>
                  </TableCell>
                  <TableCell className="py-3.5 text-center">
                    <p className="text-xs font-semibold text-[#1E293B]">{item.questionCount} ข้อ</p>
                    <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-[#94A3B8]">
                      <Clock className="h-3 w-3" />
                      {item.timeLimitMin} นาที
                    </p>
                  </TableCell>
                  <TableCell className="py-3.5 text-center">
                    <Badge variant="primary">≥ {item.passingScore}%</Badge>
                  </TableCell>
                  <TableCell className="py-3.5 px-4">
                    <Tooltip
                      className="block w-full"
                      content={`มีผู้เข้าสอบ ${item.attemptsCount} ครั้ง • อัตราผ่านเกณฑ์ ${item.passRate}%`}
                    >
                      <div className="w-full cursor-help space-y-1.5">
                        <div className="flex items-center justify-between gap-2 text-xs tabular-nums">
                          <span className="text-[#64748B]">{item.attemptsCount} ครั้ง</span>
                          <span className="font-semibold text-[#1E293B]">{item.passRate}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-[#EEF2F6]">
                          <div
                            className="h-full rounded-full bg-[#22B89A]"
                            style={{ width: `${item.passRate}%` }}
                          />
                        </div>
                      </div>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="py-3.5 text-center">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={item.active}
                      onClick={() => toggleActive(item.id)}
                      className={`relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors ${
                        item.active ? "bg-[#22B89A]" : "bg-[#CBD5E1]"
                      }`}
                    >
                      <span
                        className={`inline-block h-4.5 w-4.5 rounded-full bg-white shadow-xs transition-transform ${
                          item.active ? "translate-x-5.5" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </TableCell>
                  <TableCell className="py-3.5 pr-5 text-center">
                    <Tooltip content="ตั้งค่าจำนวนข้อ เวลา และเกณฑ์ผ่าน">
                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                        className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[#64748B] hover:bg-[#EFF6FF] hover:text-[#2563EB]"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "แก้ไขการตั้งค่าแบบทดสอบ" : "สร้างแบบทดสอบออนไลน์ใหม่"}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              ยกเลิก
            </Button>
            <Button disabled={!title.trim()} onClick={handleSave}>
              {editingId ? "บันทึกการแก้ไข" : "สร้างแบบทดสอบ"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="ชื่อแบบทดสอบ"
            placeholder="เช่น แบบทดสอบวัดผลปลายภาค: Generative AI"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Input
            label="หลักสูตรที่เชื่อมโยง"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
          />
          <div className="grid grid-cols-3 gap-3">
            <Input
              label="จำนวนข้อสอบ"
              type="number"
              min={1}
              value={questionCount}
              onChange={(e) => setQuestionCount(e.target.value)}
            />
            <Input
              label="เวลาสอบ (นาที)"
              type="number"
              min={5}
              value={timeLimitMin}
              onChange={(e) => setTimeLimitMin(e.target.value)}
            />
            <Input
              label="เกณฑ์ผ่าน (%)"
              type="number"
              min={1}
              max={100}
              value={passingScore}
              onChange={(e) => setPassingScore(e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
