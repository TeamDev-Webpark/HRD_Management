"use client";

import { useMemo, useState } from "react";
import { FolderOpen, Pencil, Plus, Trash2 } from "lucide-react";
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
import type { CompetencyDictItem, CompetencyType } from "@/data/mock/competencyFramework";

interface CompetencyDictionaryPanelProps {
  items: CompetencyDictItem[];
  onChange: (items: CompetencyDictItem[]) => void;
  onNotify: (message: string) => void;
}

const PAGE_SIZE = 5;

const TYPE_META: Record<
  CompetencyType,
  { label: string; variant: "primary" | "warning" | "success"; hint: string }
> = {
  Core: { label: "Core Competency", variant: "primary", hint: "สมรรถนะหลักที่พนักงานทุกคนในองค์กรต้องมีร่วมกัน" },
  Managerial: { label: "Managerial", variant: "warning", hint: "สมรรถนะด้านการบริหารจัดการและภาวะผู้นำสำหรับหัวหน้างาน" },
  Functional: { label: "Functional", variant: "success", hint: "สมรรถนะเฉพาะสายงานและทักษะเชิงเทคนิคตามตำแหน่ง" },
};

export function CompetencyDictionaryPanel({
  items,
  onChange,
  onNotify,
}: CompetencyDictionaryPanelProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | CompetencyType>("all");
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CompetencyDictItem | null>(null);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [type, setType] = useState<CompetencyType>("Core");
  const [description, setDescription] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchType = typeFilter === "all" || item.type === typeFilter;
      const matchQuery =
        !q ||
        item.code.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.nameEn.toLowerCase().includes(q);
      return matchType && matchQuery;
    });
  }, [items, search, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const openCreate = () => {
    setEditingId(null);
    setCode(`FC-${String(items.length + 1).padStart(2, "0")}`);
    setName("");
    setNameEn("");
    setType("Functional");
    setDescription("");
    setModalOpen(true);
  };

  const openEdit = (item: CompetencyDictItem) => {
    setEditingId(item.id);
    setCode(item.code);
    setName(item.name);
    setNameEn(item.nameEn);
    setType(item.type);
    setDescription(item.description);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!code.trim() || !name.trim()) return;
    if (editingId) {
      onChange(
        items.map((item) =>
          item.id === editingId
            ? {
                ...item,
                code: code.trim().toUpperCase(),
                name: name.trim(),
                nameEn: nameEn.trim() || item.nameEn,
                type,
                description: description.trim() || "-",
              }
            : item
        )
      );
      onNotify(`อัปเดตสมรรถนะ "${name.trim()}" เรียบร้อยแล้ว`);
    } else {
      const created: CompetencyDictItem = {
        id: `CMP-${Date.now()}`,
        code: code.trim().toUpperCase(),
        name: name.trim(),
        nameEn: nameEn.trim() || name.trim(),
        type,
        maxLevel: 5,
        mappedPositions: 0,
        description: description.trim() || "-",
        active: true,
      };
      onChange([created, ...items]);
      setPage(1);
      onNotify(`เพิ่มสมรรถนะ "${created.name}" เข้าคลังสมรรถนะแล้ว`);
    }
    setModalOpen(false);
  };

  const toggleActive = (id: string) => {
    onChange(items.map((i) => (i.id === id ? { ...i, active: !i.active } : i)));
    onNotify("อัปเดตสถานะการใช้งานสมรรถนะแล้ว");
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    onChange(items.filter((i) => i.id !== deleteTarget.id));
    onNotify(`ลบสมรรถนะ "${deleteTarget.name}" แล้ว`);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <SearchBar
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="ค้นหารหัส หรือชื่อสมรรถนะ..."
            containerClassName="w-full sm:w-64"
          />
          <Select
            value={typeFilter}
            onChange={(v) => {
              setTypeFilter(v as "all" | CompetencyType);
              setPage(1);
            }}
            options={[
              { value: "all", label: "ทุกประเภทสมรรถนะ" },
              { value: "Core", label: "Core Competency" },
              { value: "Managerial", label: "Managerial" },
              { value: "Functional", label: "Functional" },
            ]}
            className="w-full sm:w-48"
          />
        </div>

        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={openCreate}>
          เพิ่มสมรรถนะใหม่
        </Button>
      </div>

      {paged.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="ไม่พบสมรรถนะในคลัง"
          description="ลองปรับคำค้นหาหรือประเภทสมรรถนะ"
        />
      ) : (
        <>
          <TableContainer className="rounded-xl border border-[#EEF2F6]">
            <Table>
              <TableHeader className="bg-[#F8FAFC]">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[34%] pl-5">รหัส / ชื่อสมรรถนะ</TableHead>
                  <TableHead className="hidden lg:table-cell">คำอธิบายพฤติกรรม</TableHead>
                  <TableHead className="w-36 text-center">ประเภท</TableHead>
                  <TableHead className="w-28 pr-6 text-right">ผูกตำแหน่ง</TableHead>
                  <TableHead className="w-24 text-center">ใช้งาน</TableHead>
                  <TableHead className="w-24 pr-5 text-center">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((item) => {
                  const meta = TYPE_META[item.type];
                  return (
                    <TableRow key={item.id} className={!item.active ? "opacity-60" : ""}>
                      <TableCell className="py-3.5 pl-5">
                        <span className="rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                          {item.code}
                        </span>
                        <p className="mt-1 font-semibold text-[#1E293B]">{item.name}</p>
                        <p className="text-xs text-[#94A3B8]">{item.nameEn}</p>
                      </TableCell>
                      <TableCell className="hidden max-w-sm py-3.5 text-xs text-[#64748B] lg:table-cell">
                        <p className="line-clamp-2">{item.description}</p>
                      </TableCell>
                      <TableCell className="py-3.5 text-center">
                        <Tooltip title={meta.label} content={meta.hint}>
                          <Badge variant={meta.variant} className="cursor-help">
                            {meta.label}
                          </Badge>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="py-3.5 pr-6 text-right tabular-nums font-semibold text-[#1E293B]">
                        {item.mappedPositions} ตำแหน่ง
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
                        <div className="inline-flex items-center gap-1">
                          <Tooltip content="แก้ไขสมรรถนะ">
                            <button
                              type="button"
                              onClick={() => openEdit(item)}
                              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[#64748B] hover:bg-[#EFF6FF] hover:text-[#2563EB]"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                          </Tooltip>
                          <Tooltip content="ลบสมรรถนะ">
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(item)}
                              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[#64748B] hover:bg-red-50 hover:text-[#DC2626]"
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

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "แก้ไขข้อมูลสมรรถนะ" : "เพิ่มสมรรถนะใหม่เข้าคลัง"}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              ยกเลิก
            </Button>
            <Button disabled={!code.trim() || !name.trim()} onClick={handleSave}>
              {editingId ? "บันทึกการแก้ไข" : "เพิ่มสมรรถนะ"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="รหัสสมรรถนะ" value={code} onChange={(e) => setCode(e.target.value)} required />
            <Select
              label="ประเภทสมรรถนะ"
              value={type}
              onChange={(v) => setType(v as CompetencyType)}
              options={[
                { value: "Core", label: "Core Competency" },
                { value: "Managerial", label: "Managerial Competency" },
                { value: "Functional", label: "Functional Competency" },
              ]}
            />
          </div>
          <Input
            label="ชื่อสมรรถนะ (ภาษาไทย)"
            placeholder="เช่น การบริหารโครงการและนวัตกรรม"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="ชื่อสมรรถนะ (ภาษาอังกฤษ)"
            placeholder="เช่น Project & Innovation Management"
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
          />
          <Input
            label="คำอธิบายและพฤติกรรมที่คาดหวัง"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </Modal>

      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="ยืนยันการลบสมรรถนะ"
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
          ต้องการลบสมรรถนะ <strong className="text-[#1E293B]">{deleteTarget?.name}</strong> ออกจากคลังสมรรถนะใช่หรือไม่?
        </p>
      </Modal>
    </div>
  );
}
