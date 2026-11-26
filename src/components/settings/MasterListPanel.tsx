"use client";

import { useMemo, useState } from "react";
import { FolderOpen, Pencil, Plus, Trash2 } from "lucide-react";
import {
  Button,
  EmptyState,
  Input,
  Modal,
  Pagination,
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
import type { MasterItem } from "@/data/mock/hrdSettings";

interface MasterListPanelProps {
  title: string;
  addLabel: string;
  items: MasterItem[];
  onChange: (items: MasterItem[]) => void;
  onNotify: (message: string) => void;
  codePlaceholder?: string;
  metaPlaceholder?: string;
}

const PAGE_SIZE = 5;

const CODE_TONES = [
  "bg-[#EFF6FF] text-[#2563EB]",
  "bg-[#ECFAF5] text-[#1CA388]",
  "bg-[#F3F0FF] text-[#7C6CF6]",
  "bg-[#FEF9EC] text-[#C68A12]",
];

export function MasterListPanel({
  title,
  addLabel,
  items,
  onChange,
  onNotify,
  codePlaceholder = "เช่น CAT-NEW",
  metaPlaceholder = "เช่น 10 หลักสูตร / สเกล 1–5",
}: MasterListPanelProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MasterItem | null>(null);

  const [formCode, setFormCode] = useState("");
  const [formName, setFormName] = useState("");
  const [formNameEn, setFormNameEn] = useState("");
  const [formMeta, setFormMeta] = useState("");
  const [formDesc, setFormDesc] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && item.active) ||
        (statusFilter === "inactive" && !item.active);
      const matchQuery =
        !q ||
        item.code.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.nameEn.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);
      return matchStatus && matchQuery;
    });
  }, [items, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const openCreate = () => {
    setEditingId(null);
    setFormCode("");
    setFormName("");
    setFormNameEn("");
    setFormMeta("");
    setFormDesc("");
    setModalOpen(true);
  };

  const openEdit = (item: MasterItem) => {
    setEditingId(item.id);
    setFormCode(item.code);
    setFormName(item.name);
    setFormNameEn(item.nameEn);
    setFormMeta(item.meta ?? "");
    setFormDesc(item.description);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!formCode.trim() || !formName.trim()) return;

    if (editingId) {
      onChange(
        items.map((item) =>
          item.id === editingId
            ? {
                ...item,
                code: formCode.trim().toUpperCase(),
                name: formName.trim(),
                nameEn: formNameEn.trim() || formName.trim(),
                meta: formMeta.trim() || undefined,
                description: formDesc.trim(),
              }
            : item
        )
      );
      onNotify(`อัปเดตรายการ "${formName.trim()}" เรียบร้อยแล้ว`);
    } else {
      const created: MasterItem = {
        id: `ITEM-${Date.now()}`,
        code: formCode.trim().toUpperCase(),
        name: formName.trim(),
        nameEn: formNameEn.trim() || formName.trim(),
        meta: formMeta.trim() || "ใหม่",
        description: formDesc.trim() || "-",
        active: true,
      };
      onChange([created, ...items]);
      setPage(1);
      onNotify(`เพิ่มรายการ "${created.name}" เรียบร้อยแล้ว`);
    }
    setModalOpen(false);
  };

  const toggleActive = (id: string) => {
    const target = items.find((i) => i.id === id);
    onChange(items.map((item) => (item.id === id ? { ...item, active: !item.active } : item)));
    if (target) {
      onNotify(`${target.active ? "ปิดใช้งาน" : "เปิดใช้งาน"} "${target.name}" แล้ว`);
    }
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    onChange(items.filter((item) => item.id !== deleteTarget.id));
    onNotify(`ลบรายการ "${deleteTarget.name}" แล้ว`);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar: Search + Status Filter + Add CTA */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <SearchBar
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            placeholder="ค้นหารหัส / ชื่อรายการ..."
            containerClassName="w-full sm:w-64"
          />

          <div className="inline-flex self-start rounded-xl bg-[#F4F6FA] p-1 text-xs sm:self-auto">
            {(
              [
                { key: "all", label: `ทั้งหมด (${items.length})` },
                { key: "active", label: `ใช้งาน (${items.filter((i) => i.active).length})` },
                { key: "inactive", label: `ปิด (${items.filter((i) => !i.active).length})` },
              ] as const
            ).map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => {
                  setStatusFilter(opt.key);
                  setPage(1);
                }}
                className={`rounded-lg px-2.5 py-1.5 font-medium transition-all cursor-pointer ${
                  statusFilter === opt.key
                    ? "bg-white text-[#1E293B] shadow-2xs"
                    : "text-[#64748B] hover:text-[#1E293B]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <Button size="md" leftIcon={<Plus className="h-4 w-4" />} onClick={openCreate}>
          {addLabel}
        </Button>
      </div>

      {/* Table with Crisp Header Band */}
      {pagedItems.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="ไม่พบรายการที่ค้นหา"
          description="ลองปรับคำค้นหาหรือตัวกรองสถานะ เพื่อดูรายการทั้งหมด"
          action={
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
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
                  <TableHead className="pl-5">รหัส / ชื่อรายการ</TableHead>
                  <TableHead className="w-40 text-center">ป้ายกำกับ</TableHead>
                  <TableHead className="hidden lg:table-cell">รายละเอียด</TableHead>
                  <TableHead className="w-24 text-center">ใช้งาน</TableHead>
                  <TableHead className="w-24 pr-5 text-center">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagedItems.map((item) => (
                  <TableRow key={item.id} className={!item.active ? "opacity-65" : ""}>
                    <TableCell className="py-3.5 pl-5">
                      <span className="rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                        {item.code}
                      </span>
                      <p className="mt-1 font-semibold text-[#1E293B]">{item.name}</p>
                      <p className="text-xs text-[#94A3B8]">{item.nameEn}</p>
                    </TableCell>
                    <TableCell className="py-3.5 text-center">
                      {item.meta ? (
                        <span className="inline-flex rounded-full bg-[#EFF6FF] px-2.5 py-0.5 text-xs font-medium text-[#2563EB] whitespace-nowrap">
                          {item.meta}
                        </span>
                      ) : (
                        <span className="text-xs text-[#CBD5E1]">—</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden max-w-md py-3.5 text-xs text-[#64748B] lg:table-cell">
                      <p className="line-clamp-2">{item.description}</p>
                    </TableCell>
                    <TableCell className="py-3.5 text-center">
                      <Tooltip
                        content={item.active ? "กำลังเปิดใช้งาน (คลิกเพื่อปิด)" : "ปิดใช้งานอยู่ (คลิกเพื่อเปิด)"}
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
                        <Tooltip content="แก้ไขรายการ">
                          <button
                            type="button"
                            onClick={() => openEdit(item)}
                            aria-label="แก้ไข"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#EFF6FF] hover:text-[#2563EB] cursor-pointer"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        </Tooltip>
                        <Tooltip content="ลบรายการ">
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(item)}
                            aria-label="ลบ"
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
      )}

      {/* Add / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? `แก้ไขข้อมูล — ${title}` : `${addLabel}`}
        description="ข้อมูลนี้ใช้เป็นค่ามาตรฐานร่วมกันในโมดูลต่างๆ ของระบบ HRD"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              ยกเลิก
            </Button>
            <Button
              variant="primary"
              disabled={!formCode.trim() || !formName.trim()}
              onClick={handleSave}
            >
              {editingId ? "บันทึกการแก้ไข" : "เพิ่มรายการ"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="รหัส (Code)"
              placeholder={codePlaceholder}
              value={formCode}
              onChange={(e) => setFormCode(e.target.value)}
              required
            />
            <Input
              label="ป้ายกำกับเสริม (Meta / หมายเหตุสั้น)"
              placeholder={metaPlaceholder}
              value={formMeta}
              onChange={(e) => setFormMeta(e.target.value)}
            />
          </div>
          <Input
            label="ชื่อภาษาไทย"
            placeholder="ระบุชื่อรายการภาษาไทย"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            required
          />
          <Input
            label="ชื่อภาษาอังกฤษ (English Name)"
            placeholder="ระบุชื่อภาษาอังกฤษกำกับ"
            value={formNameEn}
            onChange={(e) => setFormNameEn(e.target.value)}
          />
          <Input
            label="รายละเอียด / คำอธิบาย"
            placeholder="อธิบายขอบเขตการใช้งานของรายการนี้"
            value={formDesc}
            onChange={(e) => setFormDesc(e.target.value)}
          />
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="ยืนยันการลบรายการ"
        description="การลบข้อมูลตัวอย่างนี้จะมีผลเฉพาะในเซสชัน Demo ปัจจุบัน"
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
          ต้องการลบรายการ{" "}
          <strong className="text-[#1E293B]">
            {deleteTarget?.code} — {deleteTarget?.name}
          </strong>{" "}
          ใช่หรือไม่?
        </p>
      </Modal>
    </div>
  );
}
