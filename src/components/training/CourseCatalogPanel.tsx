"use client";

import { useMemo, useState } from "react";
import { Clock, FolderOpen, LayoutGrid, List, Pencil, Plus, Trash2, Users } from "lucide-react";
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
  COURSE_TYPE_OPTIONS,
  TRAINING_CATEGORY_OPTIONS,
  type CourseCatalogItem,
} from "@/data/mock/trainingPlanning";

interface CourseCatalogPanelProps {
  items: CourseCatalogItem[];
  onChange: (items: CourseCatalogItem[]) => void;
  onNotify: (message: string) => void;
}

const PAGE_SIZE = 6;

const TYPE_BADGE: Record<
  CourseCatalogItem["courseType"],
  { variant: "primary" | "warning" | "success" | "neutral"; hint: string }
> = {
  "In-House": { variant: "primary", hint: "จัดอบรมภายในองค์กร โดยวิทยากรภายในหรือภายนอก" },
  Public: { variant: "warning", hint: "ส่งพนักงานเข้าอบรมกับสถาบันฝึกอบรมภายนอก" },
  LMS: { variant: "success", hint: "เรียนออนไลน์ด้วยตนเองบนระบบ LMS พร้อมออกใบรับรอง" },
  Workshop: { variant: "neutral", hint: "เวิร์กช็อปฝึกปฏิบัติจริงเป็นกลุ่มย่อยพร้อมกรณีศึกษา" },
};

export function CourseCatalogPanel({ items, onChange, onNotify }: CourseCatalogPanelProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [courseType, setCourseType] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CourseCatalogItem | null>(null);

  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [formCat, setFormCat] = useState("Leadership");
  const [formType, setFormType] = useState<CourseCatalogItem["courseType"]>("In-House");
  const [hours, setHours] = useState("6");
  const [cost, setCost] = useState("45000");
  const [audience, setAudience] = useState("");
  const [summary, setSummary] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchCat = category === "all" || item.category === category;
      const matchType = courseType === "all" || item.courseType === courseType;
      const matchQuery =
        !q ||
        item.code.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.targetAudience.toLowerCase().includes(q);
      return matchCat && matchType && matchQuery;
    });
  }, [items, search, category, courseType]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const openCreate = () => {
    setEditingId(null);
    setCode(`CRS-NEW-${String(items.length + 1).padStart(2, "0")}`);
    setTitle("");
    setFormCat("Leadership");
    setFormType("In-House");
    setHours("6");
    setCost("45000");
    setAudience("");
    setSummary("");
    setModalOpen(true);
  };

  const openEdit = (item: CourseCatalogItem) => {
    setEditingId(item.id);
    setCode(item.code);
    setTitle(item.title);
    setFormCat(item.category);
    setFormType(item.courseType);
    setHours(String(item.durationHours));
    setCost(String(item.costPerSession));
    setAudience(item.targetAudience);
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
                category: formCat,
                courseType: formType,
                durationHours: Math.max(1, Number(hours) || 1),
                costPerSession: Math.max(0, Number(cost) || 0),
                targetAudience: audience.trim() || "พนักงานทั่วไป",
                summary: summary.trim() || "-",
              }
            : item
        )
      );
      onNotify(`อัปเดตหลักสูตร "${title.trim()}" เรียบร้อยแล้ว`);
    } else {
      const created: CourseCatalogItem = {
        id: `CRS-${Date.now()}`,
        code: code.trim().toUpperCase(),
        title: title.trim(),
        category: formCat,
        courseType: formType,
        durationHours: Math.max(1, Number(hours) || 1),
        costPerSession: Math.max(0, Number(cost) || 0),
        targetAudience: audience.trim() || "พนักงานทุกระดับ",
        summary: summary.trim() || "-",
        active: true,
      };
      onChange([created, ...items]);
      setPage(1);
      onNotify(`เพิ่มหลักสูตร "${created.title}" เข้าคลังเรียบร้อยแล้ว`);
    }
    setModalOpen(false);
  };

  const toggleActive = (id: string) => {
    const target = items.find((i) => i.id === id);
    onChange(items.map((item) => (item.id === id ? { ...item, active: !item.active } : item)));
    if (target) {
      onNotify(`${target.active ? "ปิดหลักสูตร" : "เปิดใช้งานหลักสูตร"} "${target.title}" แล้ว`);
    }
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    onChange(items.filter((i) => i.id !== deleteTarget.id));
    onNotify(`ลบหลักสูตร "${deleteTarget.title}" แล้ว`);
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
            placeholder="ค้นหารหัส หรือชื่อหลักสูตร..."
            containerClassName="w-full sm:w-60"
          />
          <Select
            value={category}
            onChange={(v) => {
              setCategory(v);
              setPage(1);
            }}
            options={TRAINING_CATEGORY_OPTIONS}
            className="w-full sm:w-48"
          />
          <Select
            value={courseType}
            onChange={(v) => {
              setCourseType(v);
              setPage(1);
            }}
            options={COURSE_TYPE_OPTIONS}
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
            เพิ่มหลักสูตร
          </Button>
        </div>
      </div>

      {/* Content: Table or Card Grid */}
      {paged.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="ไม่พบหลักสูตรในคลัง"
          description="ลองปรับคำค้นหา หมวดหมู่ หรือประเภทหลักสูตร"
          action={
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSearch("");
                setCategory("all");
                setCourseType("all");
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
                  <TableHead>รหัส / ชื่อหลักสูตร</TableHead>
                  <TableHead className="w-32 text-center">ประเภท</TableHead>
                  <TableHead className="w-44">หมวดหมู่</TableHead>
                  <TableHead className="w-36 pr-6 text-right">ชั่วโมง / งบต่อรุ่น</TableHead>
                  <TableHead className="w-24 text-center">ใช้งาน</TableHead>
                  <TableHead className="w-24 text-center">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((item) => (
                  <TableRow key={item.id} className={!item.active ? "opacity-60" : ""}>
                    <TableCell>
                      <span className="rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                        {item.code}
                      </span>
                      <p className="mt-1 font-semibold text-[#1E293B]">{item.title}</p>
                      <p className="text-xs text-[#94A3B8]">{item.targetAudience}</p>
                    </TableCell>
                    <TableCell className="text-center">
                      <Tooltip
                        title={`ประเภท ${item.courseType}`}
                        content={TYPE_BADGE[item.courseType].hint}
                      >
                        <Badge variant={TYPE_BADGE[item.courseType].variant} className="cursor-help">
                          {item.courseType}
                        </Badge>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="text-xs text-[#64748B]">{item.category}</TableCell>
                    <TableCell className="pr-6 text-right tabular-nums">
                      <Tooltip content={`ระยะเวลาเรียน ${item.durationHours} ชม. • งบประมาณต่อรุ่น ฿${item.costPerSession.toLocaleString()}`}>
                        <div className="inline-block cursor-help">
                          <p className="font-semibold text-[#1E293B]">{item.durationHours} ชม.</p>
                          <p className="text-xs text-[#94A3B8]">
                            ฿{item.costPerSession.toLocaleString()}/รุ่น
                          </p>
                        </div>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="text-center">
                      <Tooltip
                        content={
                          item.active
                            ? "เปิดใช้งาน (เลือกบรรจุลงแผนและเปิดรุ่นได้)"
                            : "ปิดใช้งานชั่วคราว (ซ่อนจากการลงทะเบียนใหม่)"
                        }
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
                    <TableCell className="text-center">
                      <div className="inline-flex items-center gap-1">
                        <Tooltip content="แก้ไขหลักสูตร">
                          <button
                            type="button"
                            onClick={() => openEdit(item)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#EFF6FF] hover:text-[#2563EB] cursor-pointer"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        </Tooltip>
                        <Tooltip content="ลบหลักสูตร">
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
                ))}
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
            {paged.map((item) => (
              <div
                key={item.id}
                className={`flex flex-col justify-between rounded-2xl border border-[#EEF2F6] bg-white p-5 transition-all hover:border-[#BFDBFE] ${
                  !item.active ? "opacity-65" : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-md bg-[#EFF6FF] px-2 py-0.5 font-mono text-xs font-semibold text-[#2563EB]">
                      {item.code}
                    </span>
                    <Tooltip
                      title={`ประเภท ${item.courseType}`}
                      content={TYPE_BADGE[item.courseType].hint}
                    >
                      <Badge variant={TYPE_BADGE[item.courseType].variant} className="cursor-help">
                        {item.courseType}
                      </Badge>
                    </Tooltip>
                  </div>
                  <h4 className="mt-2.5 text-[15px] font-bold text-[#1E293B]">{item.title}</h4>
                  <p className="mt-1 line-clamp-2 text-xs text-[#64748B]">{item.summary}</p>
                </div>

                <div className="mt-4 space-y-3 border-t border-[#F1F5F9] pt-3.5">
                  <div className="flex items-center justify-between text-xs text-[#64748B]">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-[#94A3B8]" />
                      {item.durationHours} ชม.
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-[#94A3B8]" />
                      {item.category}
                    </span>
                    <span className="font-semibold text-[#1E293B] tabular-nums">
                      ฿{item.costPerSession.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={item.active}
                      onClick={() => toggleActive(item.id)}
                      className={`relative inline-flex h-5.5 w-10 items-center rounded-full transition-colors cursor-pointer ${
                        item.active ? "bg-[#22B89A]" : "bg-[#CBD5E1]"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 rounded-full bg-white shadow-xs transition-transform ${
                          item.active ? "translate-x-5" : "translate-x-1"
                        }`}
                      />
                    </button>
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" onClick={() => openEdit(item)}>
                        แก้ไข
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
        title={editingId ? "แก้ไขรายละเอียดหลักสูตร" : "เพิ่มหลักสูตรใหม่เข้าคลัง"}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              ยกเลิก
            </Button>
            <Button disabled={!code.trim() || !title.trim()} onClick={handleSave}>
              {editingId ? "บันทึกการแก้ไข" : "เพิ่มหลักสูตร"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="รหัสหลักสูตร"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <Select
              label="ประเภทหลักสูตร"
              value={formType}
              onChange={(v) => setFormType(v as CourseCatalogItem["courseType"])}
              options={COURSE_TYPE_OPTIONS.filter((o) => o.value !== "all")}
            />
          </div>
          <Input
            label="ชื่อหลักสูตร"
            placeholder="เช่น Strategic Thinking for Leaders"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Select
              label="หมวดหมู่"
              value={formCat}
              onChange={setFormCat}
              options={TRAINING_CATEGORY_OPTIONS.filter((o) => o.value !== "all")}
            />
            <Input
              label="จำนวนชั่วโมง"
              type="number"
              min={1}
              value={hours}
              onChange={(e) => setHours(e.target.value)}
            />
            <Input
              label="งบประมาณ/รุ่น (บาท)"
              type="number"
              min={0}
              value={cost}
              onChange={(e) => setCost(e.target.value)}
            />
          </div>
          <Input
            label="กลุ่มเป้าหมาย"
            placeholder="เช่น หัวหน้างาน / พนักงานทุกระดับ"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
          />
          <Input
            label="คำอธิบายโดยย่อ"
            placeholder="ระบุวัตถุประสงค์หรือเนื้อหาหลักของหลักสูตร"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="ยืนยันการลบหลักสูตร"
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
          ต้องการลบหลักสูตร{" "}
          <strong className="text-[#1E293B]">
            {deleteTarget?.code} — {deleteTarget?.title}
          </strong>{" "}
          ออกจากคลังใช่หรือไม่?
        </p>
      </Modal>
    </div>
  );
}
