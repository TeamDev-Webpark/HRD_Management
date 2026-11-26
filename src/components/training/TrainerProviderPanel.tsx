"use client";

import { useMemo, useState } from "react";
import { FolderOpen, Pencil, Plus, Star, Trash2 } from "lucide-react";
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
  TRAINER_TYPE_OPTIONS,
  type TrainerProviderItem,
  type TrainerType,
} from "@/data/mock/trainingResources";

interface TrainerProviderPanelProps {
  items: TrainerProviderItem[];
  onChange: (items: TrainerProviderItem[]) => void;
  onNotify: (message: string) => void;
}

const PAGE_SIZE = 5;

const TYPE_META: Record<
  TrainerType,
  { label: string; variant: "primary" | "success" | "warning"; hint: string }
> = {
  Internal: {
    label: "วิทยากรภายใน",
    variant: "success",
    hint: "พนักงานภายในองค์กรที่มีความเชี่ยวชาญเฉพาะด้าน (ไม่มีค่าจ้างภายนอก)",
  },
  External: {
    label: "วิทยากรภายนอก",
    variant: "primary",
    hint: "ผู้เชี่ยวชาญหรือที่ปรึกษาอิสระจากภายนอก คิดค่าบรรยายรายวัน",
  },
  Institute: {
    label: "สถาบันฝึกอบรม",
    variant: "warning",
    hint: "สถาบันหรือบริษัทฝึกอบรมพันธมิตร รองรับหลักสูตรองค์กรและใบรับรอง",
  },
};

export function TrainerProviderPanel({ items, onChange, onNotify }: TrainerProviderPanelProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TrainerProviderItem | null>(null);

  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [type, setType] = useState<TrainerType>("External");
  const [specialty, setSpecialty] = useState("");
  const [rate, setRate] = useState("30000");
  const [contact, setContact] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((i) => {
      const matchType = typeFilter === "all" || i.type === typeFilter;
      const matchQuery =
        !q ||
        i.name.toLowerCase().includes(q) ||
        i.organization.toLowerCase().includes(q) ||
        i.specialty.toLowerCase().includes(q) ||
        i.code.toLowerCase().includes(q);
      return matchType && matchQuery;
    });
  }, [items, search, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const openCreate = () => {
    setEditingId(null);
    setName("");
    setOrg("");
    setType("External");
    setSpecialty("");
    setRate("30000");
    setContact("");
    setModalOpen(true);
  };

  const openEdit = (item: TrainerProviderItem) => {
    setEditingId(item.id);
    setName(item.name);
    setOrg(item.organization);
    setType(item.type);
    setSpecialty(item.specialty);
    setRate(String(item.ratePerDay));
    setContact(item.contact);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    if (editingId) {
      onChange(
        items.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name: name.trim(),
                organization: org.trim() || "-",
                type,
                specialty: specialty.trim() || "-",
                ratePerDay: type === "Internal" ? 0 : Math.max(0, Number(rate) || 0),
                contact: contact.trim() || "-",
              }
            : item
        )
      );
      onNotify(`อัปเดตข้อมูล "${name.trim()}" เรียบร้อยแล้ว`);
    } else {
      const prefix = type === "Internal" ? "INT" : type === "Institute" ? "INS" : "EXT";
      const created: TrainerProviderItem = {
        id: `TR-${Date.now()}`,
        code: `TRN-${prefix}-${String(items.length + 1).padStart(2, "0")}`,
        name: name.trim(),
        organization: org.trim() || "อิสระ",
        type,
        specialty: specialty.trim() || "ทั่วไป",
        ratePerDay: type === "Internal" ? 0 : Math.max(0, Number(rate) || 0),
        rating: 4.8,
        sessionsTaught: 0,
        contact: contact.trim() || "-",
        active: true,
      };
      onChange([created, ...items]);
      setPage(1);
      onNotify(`เพิ่ม "${created.name}" เข้าทะเบียนวิทยากรแล้ว`);
    }
    setModalOpen(false);
  };

  const toggleActive = (id: string) => {
    const target = items.find((i) => i.id === id);
    onChange(items.map((i) => (i.id === id ? { ...i, active: !i.active } : i)));
    if (target) {
      onNotify(`${target.active ? "ปิดใช้งาน" : "เปิดใช้งาน"} "${target.name}" แล้ว`);
    }
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    onChange(items.filter((i) => i.id !== deleteTarget.id));
    onNotify(`ลบ "${deleteTarget.name}" ออกจากทะเบียนแล้ว`);
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
            placeholder="ค้นหาชื่อวิทยากร สถาบัน หรือความเชี่ยวชาญ..."
            containerClassName="w-full sm:w-72"
          />
          <Select
            value={typeFilter}
            onChange={(v) => {
              setTypeFilter(v);
              setPage(1);
            }}
            options={TRAINER_TYPE_OPTIONS}
            className="w-full sm:w-56"
          />
        </div>

        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={openCreate}>
          เพิ่มวิทยากร / สถาบัน
        </Button>
      </div>

      {/* Table */}
      {paged.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="ไม่พบวิทยากรหรือสถาบันที่ค้นหา"
          description="ลองปรับคำค้นหาหรือตัวกรองประเภทวิทยากร"
          action={
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSearch("");
                setTypeFilter("all");
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
                  <TableHead>วิทยากร / สถาบัน</TableHead>
                  <TableHead className="w-36 text-center">ประเภท</TableHead>
                  <TableHead>ความเชี่ยวชาญ</TableHead>
                  <TableHead className="w-32 pr-6 text-right">ค่าบรรยาย / วัน</TableHead>
                  <TableHead className="w-28 text-center">คะแนนประเมิน</TableHead>
                  <TableHead className="w-24 text-center">ใช้งาน</TableHead>
                  <TableHead className="w-24 text-center">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((item) => {
                  const meta = TYPE_META[item.type];
                  return (
                    <TableRow key={item.id} className={!item.active ? "opacity-60" : ""}>
                      <TableCell>
                        <span className="rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                          {item.code}
                        </span>
                        <p className="mt-1 font-semibold text-[#1E293B]">{item.name}</p>
                        <p className="text-xs text-[#94A3B8]">
                          {item.organization} • {item.contact}
                        </p>
                      </TableCell>
                      <TableCell className="text-center">
                        <Tooltip title={meta.label} content={meta.hint}>
                          <Badge variant={meta.variant} className="cursor-help">
                            {meta.label}
                          </Badge>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="max-w-xs text-xs text-[#64748B]">
                        {item.specialty}
                      </TableCell>
                      <TableCell className="pr-6 text-right tabular-nums font-semibold text-[#1E293B]">
                        {item.ratePerDay === 0 ? (
                          <span className="text-xs font-medium text-[#1CA388]">วิทยากรภายใน</span>
                        ) : (
                          `฿${item.ratePerDay.toLocaleString()}`
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Tooltip
                          content={`คะแนนเฉลี่ย ${item.rating}/5.0 จากการสอนทั้งหมด ${item.sessionsTaught} รุ่น`}
                        >
                          <div className="inline-flex items-center gap-1 rounded-full bg-[#FEF9EC] px-2.5 py-0.5 text-xs font-semibold text-[#C68A12] cursor-help">
                            <Star className="h-3.5 w-3.5 fill-[#F5B73B] text-[#F5B73B]" />
                            <span className="tabular-nums">{item.rating.toFixed(1)}</span>
                          </div>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="text-center">
                        <Tooltip
                          content={item.active ? "พร้อมรับเชิญสอน (คลิกเพื่อปิด)" : "ปิดใช้งานชั่วคราว"}
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
                          <Tooltip content="แก้ไขข้อมูล">
                            <button
                              type="button"
                              onClick={() => openEdit(item)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#EFF6FF] hover:text-[#2563EB] cursor-pointer"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                          </Tooltip>
                          <Tooltip content="ลบรายการ">
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

      {/* Add / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "แก้ไขข้อมูลวิทยากร / สถาบัน" : "เพิ่มวิทยากร / สถาบันใหม่"}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              ยกเลิก
            </Button>
            <Button disabled={!name.trim()} onClick={handleSave}>
              {editingId ? "บันทึกการแก้ไข" : "เพิ่มเข้าทะเบียน"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="ชื่อวิทยากร / สถาบัน"
              placeholder="เช่น อ.สมชาย ใจดี"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Select
              label="ประเภท"
              value={type}
              onChange={(v) => setType(v as TrainerType)}
              options={TRAINER_TYPE_OPTIONS.filter((o) => o.value !== "all")}
            />
          </div>
          <Input
            label="สังกัด / องค์กร"
            placeholder="ชื่อบริษัท สถาบัน หรือแผนกภายใน"
            value={org}
            onChange={(e) => setOrg(e.target.value)}
          />
          <Input
            label="ความเชี่ยวชาญ / หัวข้อที่สอน"
            placeholder="เช่น Leadership, Project Management, Excel"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="อัตราค่าบรรยายต่อวัน (บาท)"
              type="number"
              min={0}
              disabled={type === "Internal"}
              value={type === "Internal" ? "0" : rate}
              onChange={(e) => setRate(e.target.value)}
              helperText={type === "Internal" ? "วิทยากรภายในไม่มีค่าจ้างภายนอก" : undefined}
            />
            <Input
              label="อีเมล / ช่องทางติดต่อ"
              placeholder="email@provider.co.th"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="ยืนยันการลบข้อมูลวิทยากร"
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
          ต้องการลบ <strong className="text-[#1E293B]">{deleteTarget?.name}</strong> ออกจากทะเบียนใช่หรือไม่?
        </p>
      </Modal>
    </div>
  );
}
