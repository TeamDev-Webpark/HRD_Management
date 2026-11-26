"use client";

import { useMemo, useState } from "react";
import {
  FileText,
  FolderOpen,
  HelpCircle,
  Pencil,
  PlayCircle,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
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
  LessonContentType,
  LmsCourseItem,
  LmsLessonItem,
} from "@/data/mock/lmsCourses";

interface LmsLessonsPanelProps {
  lessons: LmsLessonItem[];
  courses: LmsCourseItem[];
  onChange: (lessons: LmsLessonItem[]) => void;
  onNotify: (message: string) => void;
}

const CONTENT_TYPE_META: Record<
  LessonContentType,
  {
    label: string;
    variant: "primary" | "neutral" | "success" | "warning";
    hint: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  Video: {
    label: "วิดีโอบรรยาย",
    variant: "primary",
    hint: "บทเรียนวิดีโอแบบ On-Demand รองรับการติดตามเวลาดูจริง",
    icon: PlayCircle,
  },
  Document: {
    label: "เอกสารอ่าน",
    variant: "neutral",
    hint: "คู่มือหรือสไลด์ PDF สำหรับอ่านประกอบและดาวน์โหลด",
    icon: FileText,
  },
  Interactive: {
    label: "เวิร์กช็อปโต้ตอบ",
    variant: "success",
    hint: "กิจกรรมจำลองสถานการณ์หรือ SCORM Lab ให้ผู้เรียนลงมือทำ",
    icon: Sparkles,
  },
  Quiz: {
    label: "แบบทดสอบ",
    variant: "warning",
    hint: "แบบทดสอบวัดความเข้าใจท้ายบทเรียนหรือท้ายคอร์ส",
    icon: HelpCircle,
  },
};

export function LmsLessonsPanel({
  lessons,
  courses,
  onChange,
  onNotify,
}: LmsLessonsPanelProps) {
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id ?? "");
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LmsLessonItem | null>(null);

  const [title, setTitle] = useState("");
  const [moduleTitle, setModuleTitle] = useState("Module 1: เนื้อหาหลัก");
  const [contentType, setContentType] = useState<LessonContentType>("Video");
  const [durationMinutes, setDurationMinutes] = useState("15");
  const [mandatory, setMandatory] = useState(true);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return lessons
      .filter((item) => {
        const matchCourse = !selectedCourseId || item.courseId === selectedCourseId;
        const matchQuery =
          !q ||
          item.title.toLowerCase().includes(q) ||
          item.moduleTitle.toLowerCase().includes(q) ||
          item.code.toLowerCase().includes(q);
        return matchCourse && matchQuery;
      })
      .sort((a, b) => a.order - b.order);
  }, [lessons, selectedCourseId, search]);

  const openCreate = () => {
    setEditingId(null);
    setTitle("");
    setModuleTitle("Module 1: เนื้อหาหลัก");
    setContentType("Video");
    setDurationMinutes("15");
    setMandatory(true);
    setModalOpen(true);
  };

  const openEdit = (item: LmsLessonItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setModuleTitle(item.moduleTitle);
    setContentType(item.contentType);
    setDurationMinutes(String(item.durationMinutes));
    setMandatory(item.mandatory);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!title.trim()) return;
    if (editingId) {
      onChange(
        lessons.map((item) =>
          item.id === editingId
            ? {
                ...item,
                title: title.trim(),
                moduleTitle: moduleTitle.trim() || item.moduleTitle,
                contentType,
                durationMinutes: Math.max(1, Number(durationMinutes) || 10),
                mandatory,
              }
            : item
        )
      );
      onNotify(`อัปเดตบทเรียน "${title.trim()}" เรียบร้อยแล้ว`);
    } else {
      const courseLessons = lessons.filter((l) => l.courseId === selectedCourseId);
      const nextOrder = courseLessons.length + 1;
      const created: LmsLessonItem = {
        id: `LES-${Date.now()}`,
        courseId: selectedCourseId || courses[0]?.id || "LMS-01",
        code: `LES-NEW-${String(nextOrder).padStart(2, "0")}`,
        order: nextOrder,
        title: title.trim(),
        moduleTitle: moduleTitle.trim() || "Module 1: เนื้อหาหลัก",
        contentType,
        durationMinutes: Math.max(1, Number(durationMinutes) || 15),
        mandatory,
        published: true,
      };
      onChange([...lessons, created]);
      onNotify(`เพิ่มบทเรียน "${created.title}" เรียบร้อยแล้ว`);
    }
    setModalOpen(false);
  };

  const togglePublished = (id: string) => {
    const target = lessons.find((l) => l.id === id);
    onChange(lessons.map((l) => (l.id === id ? { ...l, published: !l.published } : l)));
    if (target) {
      onNotify(`${target.published ? "ซ่อนบทเรียน" : "เปิดเผยแพร่บทเรียน"} "${target.title}" แล้ว`);
    }
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    onChange(lessons.filter((l) => l.id !== deleteTarget.id));
    onNotify(`ลบบทเรียน "${deleteTarget.title}" แล้ว`);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <Select
            value={selectedCourseId}
            onChange={setSelectedCourseId}
            options={courses.map((c) => ({
              value: c.id,
              label: `${c.code} — ${c.title}`,
            }))}
            className="w-full sm:w-80"
          />
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="ค้นหาชื่อบทเรียน หรือโมดูล..."
            containerClassName="w-full sm:w-60"
          />
        </div>

        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={openCreate}>
          เพิ่มบทเรียนใหม่
        </Button>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="ยังไม่มีบทเรียนในคอร์สนี้"
          description="คลิกปุ่ม 'เพิ่มบทเรียนใหม่' เพื่อสร้างโครงสร้างบทเรียนของคอร์ส"
          action={
            <Button size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={openCreate}>
              เพิ่มบทเรียนแรก
            </Button>
          }
        />
      ) : (
        <TableContainer className="rounded-xl border border-[#EEF2F6]">
          <Table>
            <TableHeader className="bg-[#F8FAFC]">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-20 pl-5 text-center">ลำดับ</TableHead>
                <TableHead>รหัส / ชื่อบทเรียน</TableHead>
                <TableHead className="w-36 text-center">รูปแบบสื่อ</TableHead>
                <TableHead className="w-28 pr-6 text-right">เวลาเรียน</TableHead>
                <TableHead className="w-28 text-center">เงื่อนไข</TableHead>
                <TableHead className="w-24 text-center">เผยแพร่</TableHead>
                <TableHead className="w-24 pr-5 text-center">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => {
                const meta = CONTENT_TYPE_META[item.contentType];
                const TypeIcon = meta.icon;
                return (
                  <TableRow key={item.id} className={!item.published ? "opacity-60" : ""}>
                    <TableCell className="py-3.5 pl-5 text-center">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#EFF6FF] text-xs font-bold tabular-nums text-[#2563EB]">
                        {item.order}
                      </span>
                    </TableCell>
                    <TableCell className="py-3.5">
                      <span className="rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                        {item.code}
                      </span>
                      <p className="mt-1 font-semibold text-[#1E293B]">{item.title}</p>
                      <p className="text-xs text-[#94A3B8]">{item.moduleTitle}</p>
                    </TableCell>
                    <TableCell className="py-3.5 text-center">
                      <Tooltip title={meta.label} content={meta.hint}>
                        <Badge variant={meta.variant} className="cursor-help">
                          <span className="inline-flex items-center gap-1">
                            <TypeIcon className="h-3 w-3" />
                            {meta.label}
                          </span>
                        </Badge>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="py-3.5 pr-6 text-right tabular-nums font-semibold text-[#1E293B]">
                      {item.durationMinutes} นาที
                    </TableCell>
                    <TableCell className="py-3.5 text-center">
                      <Tooltip
                        content={
                          item.mandatory
                            ? "ผู้เรียนต้องเรียนบทนี้ให้ครบจึงจะจบคอร์สได้"
                            : "บทเรียนเสริม สามารถเลือกเรียนเพิ่มเติมได้"
                        }
                      >
                        <Badge variant={item.mandatory ? "primary" : "neutral"} className="cursor-help">
                          {item.mandatory ? "บังคับเรียน" : "เพิ่มเติม"}
                        </Badge>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="py-3.5 text-center">
                      <Tooltip
                        content={item.published ? "แสดงในคอร์ส (คลิกเพื่อซ่อน)" : "ซ่อนชั่วคราว"}
                      >
                        <button
                          type="button"
                          role="switch"
                          aria-checked={item.published}
                          onClick={() => togglePublished(item.id)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                            item.published ? "bg-[#22B89A]" : "bg-[#CBD5E1]"
                          }`}
                        >
                          <span
                            className={`inline-block h-4.5 w-4.5 rounded-full bg-white shadow-xs transition-transform ${
                              item.published ? "translate-x-5.5" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="py-3.5 pr-5 text-center">
                      <div className="inline-flex items-center gap-1">
                        <Tooltip content="แก้ไขบทเรียน">
                          <button
                            type="button"
                            onClick={() => openEdit(item)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#EFF6FF] hover:text-[#2563EB] cursor-pointer"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        </Tooltip>
                        <Tooltip content="ลบบทเรียน">
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(item)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] hover:bg-red-50 hover:text-[#DC2626] cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
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

      {/* Add / Edit Lesson Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "แก้ไขรายละเอียดบทเรียน" : "เพิ่มบทเรียนใหม่"}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              ยกเลิก
            </Button>
            <Button disabled={!title.trim()} onClick={handleSave}>
              {editingId ? "บันทึกการแก้ไข" : "เพิ่มบทเรียน"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="ชื่อบทเรียน"
            placeholder="เช่น การเขียน Prompt สำหรับวิเคราะห์ข้อมูล"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Input
            label="หมวดย่อย / โมดูล"
            placeholder="เช่น Module 1: พื้นฐาน AI"
            value={moduleTitle}
            onChange={(e) => setModuleTitle(e.target.value)}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="รูปแบบสื่อบทเรียน"
              value={contentType}
              onChange={(v) => setContentType(v as LessonContentType)}
              options={[
                { value: "Video", label: "วิดีโอบรรยาย (Video)" },
                { value: "Document", label: "เอกสารอ่าน (PDF/Slide)" },
                { value: "Interactive", label: "เวิร์กช็อปโต้ตอบ (SCORM)" },
                { value: "Quiz", label: "แบบทดสอบ (Quiz)" },
              ]}
            />
            <Input
              label="เวลาเรียนโดยประมาณ (นาที)"
              type="number"
              min={1}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
            />
          </div>
          <label className="flex items-center gap-2.5 rounded-xl bg-[#F8FAFC] px-4 py-3 text-sm text-[#334155] cursor-pointer">
            <input
              type="checkbox"
              checked={mandatory}
              onChange={(e) => setMandatory(e.target.checked)}
              className="h-4 w-4 rounded border-[#CBD5E1] accent-[#2563EB]"
            />
            <span>กำหนดเป็นบทเรียนบังคับ (ต้องเรียนครบก่อนรับใบรับรอง)</span>
          </label>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="ยืนยันการลบบทเรียน"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              ยกเลิก
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              ยืนยันลบ
            </Button>
          </>
        }
      >
        <p className="text-sm text-[#334155]">
          ต้องการลบบทเรียน <strong className="text-[#1E293B]">{deleteTarget?.title}</strong> ใช่หรือไม่?
        </p>
      </Modal>
    </div>
  );
}
