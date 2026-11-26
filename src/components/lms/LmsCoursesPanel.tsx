"use client";

import { useMemo, useState } from "react";
import {
  BookOpen,
  Clock,
  FolderOpen,
  LayoutGrid,
  List,
  Pencil,
  Plus,
  Star,
  Trash2,
  Users,
} from "lucide-react";
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
import {
  LMS_CATEGORY_OPTIONS,
  type LmsCourseItem,
  type LmsLevel,
} from "@/data/mock/lmsCourses";

interface LmsCoursesPanelProps {
  items: LmsCourseItem[];
  onChange: (items: LmsCourseItem[]) => void;
  onNotify: (message: string) => void;
}

const PAGE_SIZE = 5;

const LEVEL_META: Record<
  LmsLevel,
  { label: string; variant: "success" | "primary" | "warning"; hint: string }
> = {
  Beginner: { label: "ระดับพื้นฐาน", variant: "success", hint: "เหมาะสำหรับผู้เริ่มต้นและพนักงานทุกระดับ" },
  Intermediate: { label: "ระดับกลาง", variant: "primary", hint: "เหมาะสำหรับผู้มีประสบการณ์หรือหัวหน้างาน" },
  Advanced: { label: "ระดับสูง", variant: "warning", hint: "เนื้อหาเชิงลึกสำหรับผู้เชี่ยวชาญเฉพาะทาง" },
};

function fmtDuration(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h} ชม. ${m > 0 ? `${m} น.` : ""}`.trim() : `${m} นาที`;
}

export function LmsCoursesPanel({ items, onChange, onNotify }: LmsCoursesPanelProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LmsCourseItem | null>(null);

  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [formCategory, setFormCategory] = useState("Digital & AI");
  const [instructor, setInstructor] = useState("");
  const [level, setLevel] = useState<LmsLevel>("Beginner");
  const [lessonsCount, setLessonsCount] = useState("6");
  const [durationMinutes, setDurationMinutes] = useState("90");
  const [summary, setSummary] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchCat = category === "all" || item.category === category;
      const matchLevel = levelFilter === "all" || item.level === levelFilter;
      const matchQuery =
        !q ||
        item.code.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.instructor.toLowerCase().includes(q);
      return matchCat && matchLevel && matchQuery;
    });
  }, [items, search, category, levelFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const openCreate = () => {
    setEditingId(null);
    setCode(`LMS-NEW-${String(items.length + 101)}`);
    setTitle("");
    setFormCategory("Digital & AI");
    setInstructor("ดร.ภาณุพงศ์ รัตนชัย");
    setLevel("Beginner");
    setLessonsCount("6");
    setDurationMinutes("90");
    setSummary("");
    setModalOpen(true);
  };

  const openEdit = (item: LmsCourseItem) => {
    setEditingId(item.id);
    setCode(item.code);
    setTitle(item.title);
    setFormCategory(item.category);
    setInstructor(item.instructor);
    setLevel(item.level);
    setLessonsCount(String(item.lessonsCount));
    setDurationMinutes(String(item.durationMinutes));
    setSummary(item.summary);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!code.trim() || !title.trim()) return;
    if (editingId) {
      onChange(
        items.map((item) =>
          item.id === editingId
            ? {
                ...item,
                code: code.trim().toUpperCase(),
                title: title.trim(),
                category: formCategory,
                instructor: instructor.trim() || item.instructor,
                level,
                lessonsCount: Math.max(1, Number(lessonsCount) || 1),
                durationMinutes: Math.max(10, Number(durationMinutes) || 30),
                summary: summary.trim() || "-",
              }
            : item
        )
      );
      onNotify(`อัปเดตคอร์สออนไลน์ "${title.trim()}" เรียบร้อยแล้ว`);
    } else {
      const created: LmsCourseItem = {
        id: `LMS-${Date.now()}`,
        code: code.trim().toUpperCase(),
        title: title.trim(),
        category: formCategory,
        instructor: instructor.trim() || "วิทยากรภายใน",
        level,
        lessonsCount: Math.max(1, Number(lessonsCount) || 6),
        durationMinutes: Math.max(10, Number(durationMinutes) || 90),
        enrolledCount: 0,
        completionRate: 0,
        rating: 4.8,
        published: true,
        summary: summary.trim() || "-",
      };
      onChange([created, ...items]);
      setPage(1);
      onNotify(`สร้างคอร์สออนไลน์ "${created.title}" เรียบร้อยแล้ว`);
    }
    setModalOpen(false);
  };

  const togglePublished = (id: string) => {
    const target = items.find((i) => i.id === id);
    onChange(items.map((i) => (i.id === id ? { ...i, published: !i.published } : i)));
    if (target) {
      onNotify(`${target.published ? "ซ่อนคอร์ส" : "เผยแพร่คอร์ส"} "${target.title}" แล้ว`);
    }
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    onChange(items.filter((i) => i.id !== deleteTarget.id));
    onNotify(`ลบคอร์ส "${deleteTarget.title}" แล้ว`);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <SearchBar
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="ค้นหารหัส ชื่อคอร์ส หรือผู้สอน..."
            containerClassName="w-full sm:w-64"
          />
          <Select
            value={category}
            onChange={(v) => {
              setCategory(v);
              setPage(1);
            }}
            options={LMS_CATEGORY_OPTIONS}
            className="w-full sm:w-48"
          />
          <Select
            value={levelFilter}
            onChange={(v) => {
              setLevelFilter(v);
              setPage(1);
            }}
            options={[
              { value: "all", label: "ทุกระดับความยาก" },
              { value: "Beginner", label: "ระดับพื้นฐาน" },
              { value: "Intermediate", label: "ระดับกลาง" },
              { value: "Advanced", label: "ระดับสูง" },
            ]}
            className="w-full sm:w-44"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <div className="inline-flex rounded-xl bg-[#F4F6FA] p-1">
            <Tooltip content="มุมมองตาราง">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all cursor-pointer ${
                  viewMode === "table"
                    ? "bg-white text-[#2563EB] shadow-2xs"
                    : "text-[#94A3B8] hover:text-[#1E293B]"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </Tooltip>
            <Tooltip content="มุมมองการ์ด">
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all cursor-pointer ${
                  viewMode === "cards"
                    ? "bg-white text-[#2563EB] shadow-2xs"
                    : "text-[#94A3B8] hover:text-[#1E293B]"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </Tooltip>
          </div>

          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={openCreate}>
            สร้างคอร์สออนไลน์
          </Button>
        </div>
      </div>

      {/* Content */}
      {paged.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="ไม่พบคอร์สเรียนออนไลน์ที่ค้นหา"
          description="ลองปรับคำค้นหา หมวดหมู่ หรือระดับความยาก"
          action={
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSearch("");
                setCategory("all");
                setLevelFilter("all");
                setPage(1);
              }}
            >
              ล้างตัวกรอง
            </Button>
          }
        />
      ) : viewMode === "table" ? (
        <>
          <TableContainer className="rounded-xl border border-[#EEF2F6]">
            <Table>
              <TableHeader className="bg-[#F8FAFC]">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-5">รหัส / คอร์สออนไลน์</TableHead>
                  <TableHead className="w-32 text-center">ระดับ</TableHead>
                  <TableHead className="w-36 pr-6 text-right">บทเรียน / เวลา</TableHead>
                  <TableHead className="w-44 px-4">อัตราเรียนจบ</TableHead>
                  <TableHead className="w-24 text-center">คะแนน</TableHead>
                  <TableHead className="w-24 text-center">เผยแพร่</TableHead>
                  <TableHead className="w-24 pr-5 text-center">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((item) => {
                  const lv = LEVEL_META[item.level];
                  return (
                    <TableRow key={item.id} className={!item.published ? "opacity-60" : ""}>
                      <TableCell className="py-3.5 pl-5">
                        <span className="rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                          {item.code}
                        </span>
                        <p className="mt-1 font-semibold text-[#1E293B]">{item.title}</p>
                        <p className="text-xs text-[#94A3B8]">
                          {item.category} • ผู้สอน: {item.instructor}
                        </p>
                      </TableCell>
                      <TableCell className="py-3.5 text-center">
                        <Tooltip title={lv.label} content={lv.hint}>
                          <Badge variant={lv.variant} className="cursor-help">
                            {lv.label}
                          </Badge>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="py-3.5 pr-6 text-right tabular-nums">
                        <Tooltip content={`จำนวน ${item.lessonsCount} บทเรียน • รวม ${fmtDuration(item.durationMinutes)}`}>
                          <div className="inline-block cursor-help">
                            <p className="font-semibold text-[#1E293B]">{item.lessonsCount} บทเรียน</p>
                            <p className="text-xs text-[#94A3B8]">{fmtDuration(item.durationMinutes)}</p>
                          </div>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="py-3.5 px-4">
                        <Tooltip
                          className="block w-full"
                          content={`ผู้เรียนทั้งหมด ${item.enrolledCount} คน • เรียนจบแล้ว ${item.completionRate}%`}
                        >
                          <div className="w-full space-y-1.5 cursor-help">
                            <div className="flex items-center justify-between gap-2 text-xs tabular-nums">
                              <span className="text-[#64748B]">{item.enrolledCount} คน</span>
                              <span className="font-semibold text-[#1E293B]">{item.completionRate}%</span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-[#EEF2F6]">
                              <div
                                className="h-full rounded-full bg-[#22B89A] transition-all"
                                style={{ width: `${item.completionRate}%` }}
                              />
                            </div>
                          </div>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="py-3.5 text-center">
                        <Tooltip content={`คะแนนรีวิวจากผู้เรียน ${item.rating.toFixed(1)} / 5.0`}>
                          <div className="inline-flex items-center gap-1 rounded-full bg-[#FEF9EC] px-2.5 py-0.5 text-xs font-semibold text-[#C68A12] cursor-help">
                            <Star className="h-3.5 w-3.5 fill-[#F5B73B] text-[#F5B73B]" />
                            <span className="tabular-nums">{item.rating.toFixed(1)}</span>
                          </div>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="py-3.5 text-center">
                        <Tooltip
                          content={item.published ? "กำลังเผยแพร่ให้พนักงานเรียน (คลิกเพื่อซ่อน)" : "ฉบับร่าง (ยังไม่เผยแพร่)"}
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
                          <Tooltip content="แก้ไขคอร์ส">
                            <button
                              type="button"
                              onClick={() => openEdit(item)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#EFF6FF] hover:text-[#2563EB] cursor-pointer"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                          </Tooltip>
                          <Tooltip content="ลบคอร์ส">
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

          <Pagination
            currentPage={currentPage}
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {paged.map((item) => {
              const lv = LEVEL_META[item.level];
              return (
                <div
                  key={item.id}
                  className={`flex flex-col justify-between rounded-2xl border border-[#EEF2F6] bg-white p-5 transition-all hover:border-[#BFDBFE] ${
                    !item.published ? "opacity-65" : ""
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                        {item.code}
                      </span>
                      <Badge variant={lv.variant}>{lv.label}</Badge>
                    </div>
                    <h4 className="mt-2.5 text-[15px] font-bold text-[#1E293B]">{item.title}</h4>
                    <p className="mt-1 line-clamp-2 text-xs text-[#64748B]">{item.summary}</p>
                  </div>

                  <div className="mt-4 space-y-3 border-t border-[#F1F5F9] pt-3.5">
                    <div className="flex items-center justify-between text-xs text-[#64748B]">
                      <span className="inline-flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5 text-[#94A3B8]" />
                        {item.lessonsCount} บทเรียน
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-[#94A3B8]" />
                        {fmtDuration(item.durationMinutes)}
                      </span>
                      <span className="inline-flex items-center gap-1 font-medium text-[#1E293B]">
                        <Users className="h-3.5 w-3.5 text-[#2563EB]" />
                        {item.enrolledCount} คน
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={item.published}
                        onClick={() => togglePublished(item.id)}
                        className={`relative inline-flex h-5.5 w-10 items-center rounded-full transition-colors cursor-pointer ${
                          item.published ? "bg-[#22B89A]" : "bg-[#CBD5E1]"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 rounded-full bg-white shadow-xs transition-transform ${
                            item.published ? "translate-x-5" : "translate-x-1"
                          }`}
                        />
                      </button>
                      <Button size="sm" variant="ghost" onClick={() => openEdit(item)}>
                        แก้ไข
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </>
      )}

      {/* Add / Edit Course Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "แก้ไขคอร์สเรียนออนไลน์" : "สร้างคอร์สเรียนออนไลน์ใหม่"}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              ยกเลิก
            </Button>
            <Button disabled={!code.trim() || !title.trim()} onClick={handleSave}>
              {editingId ? "บันทึกการแก้ไข" : "สร้างคอร์ส"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="รหัสคอร์ส"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <Select
              label="หมวดหมู่"
              value={formCategory}
              onChange={setFormCategory}
              options={LMS_CATEGORY_OPTIONS.filter((o) => o.value !== "all")}
            />
          </div>
          <Input
            label="ชื่อคอร์สออนไลน์"
            placeholder="เช่น Generative AI Essentials for Everyday Work"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="ผู้สอน / วิทยากร"
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
            />
            <Select
              label="ระดับความยาก"
              value={level}
              onChange={(v) => setLevel(v as LmsLevel)}
              options={[
                { value: "Beginner", label: "ระดับพื้นฐาน (Beginner)" },
                { value: "Intermediate", label: "ระดับกลาง (Intermediate)" },
                { value: "Advanced", label: "ระดับสูง (Advanced)" },
              ]}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="จำนวนบทเรียน"
              type="number"
              min={1}
              value={lessonsCount}
              onChange={(e) => setLessonsCount(e.target.value)}
            />
            <Input
              label="ระยะเวลารวม (นาที)"
              type="number"
              min={10}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
            />
          </div>
          <Input
            label="คำอธิบายคอร์ส"
            placeholder="สรุปวัตถุประสงค์และสิ่งที่ผู้เรียนจะได้รับ"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="ยืนยันการลบคอร์สออนไลน์"
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
          ต้องการลบคอร์ส <strong className="text-[#1E293B]">{deleteTarget?.title}</strong> ใช่หรือไม่?
        </p>
      </Modal>
    </div>
  );
}
