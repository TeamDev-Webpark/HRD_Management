"use client";

import { useMemo, useState } from "react";
import { Download, FolderOpen, Plus, Trash2 } from "lucide-react";
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
  LmsCourseItem,
  LmsMaterialItem,
  MaterialFileType,
} from "@/data/mock/lmsCourses";

interface LmsMaterialsPanelProps {
  items: LmsMaterialItem[];
  courses: LmsCourseItem[];
  onChange: (items: LmsMaterialItem[]) => void;
  onNotify: (message: string) => void;
}

const PAGE_SIZE = 5;

const FILE_TYPE_META: Record<
  MaterialFileType,
  { variant: "danger" | "primary" | "success" | "warning"; hint: string }
> = {
  PDF: { variant: "danger", hint: "เอกสารคู่มือหรือแบบฝึกหัดรูปแบบ PDF พร้อมดาวน์โหลด" },
  MP4: { variant: "primary", hint: "ไฟล์วิดีโอบรรยายความละเอียดสูงสำหรับสตรีมมิ่งบน LMS" },
  SCORM: { variant: "success", hint: "ชุดสื่อการเรียนรู้แบบโต้ตอบมาตรฐาน SCORM 1.2 / 2004" },
  PPTX: { variant: "warning", hint: "สไลด์นำเสนอประกอบการเรียนการสอน" },
};

export function LmsMaterialsPanel({
  items,
  courses,
  onChange,
  onNotify,
}: LmsMaterialsPanelProps) {
  const [search, setSearch] = useState("");
  const [fileTypeFilter, setFileTypeFilter] = useState("all");
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<LmsMaterialItem | null>(null);

  const [title, setTitle] = useState("");
  const [courseTitle, setCourseTitle] = useState(courses[0]?.title ?? "");
  const [fileType, setFileType] = useState<MaterialFileType>("PDF");
  const [fileSize, setFileSize] = useState("5.2 MB");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchType = fileTypeFilter === "all" || item.fileType === fileTypeFilter;
      const matchQuery =
        !q ||
        item.code.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.courseTitle.toLowerCase().includes(q);
      return matchType && matchQuery;
    });
  }, [items, search, fileTypeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleUpload = () => {
    if (!title.trim()) return;
    const nextNum = String(items.length + 1).padStart(3, "0");
    const created: LmsMaterialItem = {
      id: `MAT-${Date.now()}`,
      code: `MAT-69-${nextNum}`,
      title: title.trim(),
      courseTitle: courseTitle || courses[0]?.title || "คอร์สออนไลน์",
      fileType,
      fileSize: fileSize.trim() || "4.0 MB",
      downloads: 0,
      uploadedBy: "พิมพ์ชนก วัฒนากูล",
      updatedAt: "วันนี้",
      active: true,
    };
    onChange([created, ...items]);
    setTitle("");
    setPage(1);
    setModalOpen(false);
    onNotify(`อัปโหลดสื่อการเรียนรู้ "${created.title}" เรียบร้อยแล้ว`);
  };

  const toggleActive = (id: string) => {
    const target = items.find((i) => i.id === id);
    onChange(items.map((i) => (i.id === id ? { ...i, active: !i.active } : i)));
    if (target) {
      onNotify(`${target.active ? "ปิดการดาวน์โหลด" : "เปิดให้ดาวน์โหลด"} "${target.title}" แล้ว`);
    }
  };

  const handleDownloadDemo = (item: LmsMaterialItem) => {
    onChange(items.map((i) => (i.id === item.id ? { ...i, downloads: i.downloads + 1 } : i)));
    onNotify(`เริ่มดาวน์โหลด "${item.title}" (${item.fileType}) แล้ว (Demo)`);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    onChange(items.filter((i) => i.id !== deleteTarget.id));
    onNotify(`ลบสื่อการเรียนรู้ "${deleteTarget.title}" แล้ว`);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <SearchBar
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="ค้นหาชื่อไฟล์ รหัส หรือคอร์ส..."
            containerClassName="w-full sm:w-64"
          />
          <Select
            value={fileTypeFilter}
            onChange={(v) => {
              setFileTypeFilter(v);
              setPage(1);
            }}
            options={[
              { value: "all", label: "ทุกประเภทไฟล์" },
              { value: "PDF", label: "PDF เอกสาร" },
              { value: "MP4", label: "MP4 วิดีโอ" },
              { value: "SCORM", label: "SCORM Package" },
              { value: "PPTX", label: "PPTX สไลด์" },
            ]}
            className="w-full sm:w-48"
          />
        </div>

        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setModalOpen(true)}>
          อัปโหลดสื่อการเรียนรู้
        </Button>
      </div>

      {/* Table */}
      {paged.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="ไม่พบสื่อการเรียนรู้ที่ค้นหา"
          description="ลองปรับคำค้นหาหรือประเภทไฟล์"
          action={
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSearch("");
                setFileTypeFilter("all");
                setPage(1);
              }}
            >
              ล้างตัวกรอง
            </Button>
          }
        />
      ) : (
        <>
          <TableContainer className="rounded-xl border border-[#EEF2F6]">
            <Table>
              <TableHeader className="bg-[#F8FAFC]">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-5">รหัส / ชื่อสื่อการเรียนรู้</TableHead>
                  <TableHead className="w-28 text-center">ประเภท</TableHead>
                  <TableHead className="w-28 pr-6 text-right">ขนาดไฟล์</TableHead>
                  <TableHead className="w-28 pr-6 text-right">ดาวน์โหลด</TableHead>
                  <TableHead className="w-24 text-center">ใช้งาน</TableHead>
                  <TableHead className="w-24 pr-5 text-center">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((item) => {
                  const meta = FILE_TYPE_META[item.fileType];
                  return (
                    <TableRow key={item.id} className={!item.active ? "opacity-60" : ""}>
                      <TableCell className="py-3.5 pl-5">
                        <span className="rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                          {item.code}
                        </span>
                        <p className="mt-1 font-semibold text-[#1E293B]">{item.title}</p>
                        <p className="text-xs text-[#94A3B8]">
                          {item.courseTitle} • อัปเดต {item.updatedAt}
                        </p>
                      </TableCell>
                      <TableCell className="py-3.5 text-center">
                        <Tooltip title={`ไฟล์ ${item.fileType}`} content={meta.hint}>
                          <Badge variant={meta.variant} className="cursor-help">
                            {item.fileType}
                          </Badge>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="py-3.5 pr-6 text-right tabular-nums text-xs font-medium text-[#475569]">
                        {item.fileSize}
                      </TableCell>
                      <TableCell className="py-3.5 pr-6 text-right tabular-nums font-semibold text-[#1E293B]">
                        {item.downloads.toLocaleString()} ครั้ง
                      </TableCell>
                      <TableCell className="py-3.5 text-center">
                        <Tooltip
                          content={item.active ? "เปิดให้ผู้เรียนดาวน์โหลด (คลิกเพื่อปิด)" : "ปิดการเข้าถึงชั่วคราว"}
                        >
                          <button
                            type="button"
                            role="switch"
                            aria-checked={item.active}
                            onClick={() => toggleActive(item.id)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                              item.active ? "bg-[#22B89A]" : "bg-[#CBD5E1]"
                            }`}
                          >
                            <span
                              className={`inline-block h-4.5 w-4.5 rounded-full bg-white shadow-xs transition-transform ${
                                item.active ? "translate-x-5.5" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="py-3.5 pr-5 text-center">
                        <div className="inline-flex items-center gap-1">
                          <Tooltip content="ทดสอบดาวน์โหลดไฟล์ (Demo)">
                            <button
                              type="button"
                              onClick={() => handleDownloadDemo(item)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#EFF6FF] hover:text-[#2563EB] cursor-pointer"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          </Tooltip>
                          <Tooltip content="ลบสื่อการเรียนรู้">
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
      )}

      {/* Upload Material Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="อัปโหลดสื่อการเรียนรู้ใหม่"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              ยกเลิก
            </Button>
            <Button disabled={!title.trim()} onClick={handleUpload}>
              อัปโหลดเข้าคลังสื่อ
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="ชื่อสื่อ / เอกสารประกอบการเรียน"
            placeholder="เช่น คู่มือการประยุกต์ใช้ AI สำหรับฝ่ายขาย"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Select
            label="เชื่อมโยงกับคอร์สออนไลน์"
            value={courseTitle}
            onChange={setCourseTitle}
            options={courses.map((c) => ({ value: c.title, label: `${c.code} — ${c.title}` }))}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="ประเภทไฟล์"
              value={fileType}
              onChange={(v) => setFileType(v as MaterialFileType)}
              options={[
                { value: "PDF", label: "PDF เอกสาร" },
                { value: "MP4", label: "MP4 วิดีโอ" },
                { value: "SCORM", label: "SCORM Package" },
                { value: "PPTX", label: "PPTX สไลด์" },
              ]}
            />
            <Input
              label="ขนาดไฟล์โดยประมาณ"
              value={fileSize}
              onChange={(e) => setFileSize(e.target.value)}
            />
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="ยืนยันการลบสื่อการเรียนรู้"
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
          ต้องการลบไฟล์ <strong className="text-[#1E293B]">{deleteTarget?.title}</strong> ออกจากคลังสื่อใช่หรือไม่?
        </p>
      </Modal>
    </div>
  );
}
