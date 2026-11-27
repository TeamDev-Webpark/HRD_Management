"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, FolderOpen, Pencil, Plus } from "lucide-react";
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
import type { JobFamilyItem } from "@/data/mock/careerPathData";

interface JobFamilyPanelProps {
  items: JobFamilyItem[];
  onChange: (items: JobFamilyItem[]) => void;
  onNotify: (message: string) => void;
}

export function JobFamilyPanel({ items, onChange, onNotify }: JobFamilyPanelProps) {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<JobFamilyItem | null>(null);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [departmentScope, setDepartmentScope] = useState("");
  const [description, setDescription] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.code.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.nameEn.toLowerCase().includes(q) ||
        item.departmentScope.toLowerCase().includes(q)
    );
  }, [items, search]);

  const openCreate = () => {
    setEditing(null);
    setCode(`JF-NEW${items.length + 1}`);
    setName("");
    setNameEn("");
    setDepartmentScope("");
    setDescription("");
    setModalOpen(true);
  };

  const openEdit = (item: JobFamilyItem) => {
    setEditing(item);
    setCode(item.code);
    setName(item.name);
    setNameEn(item.nameEn);
    setDepartmentScope(item.departmentScope);
    setDescription(item.description);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    if (editing) {
      onChange(
        items.map((row) =>
          row.id === editing.id
            ? {
                ...row,
                code: code.trim() || row.code,
                name: name.trim(),
                nameEn: nameEn.trim() || row.nameEn,
                departmentScope: departmentScope.trim() || row.departmentScope,
                description: description.trim() || row.description,
              }
            : row
        )
      );
      onNotify(`อัปเดตกลุ่มสายงาน "${name.trim()}" เรียบร้อยแล้ว`);
    } else {
      const created: JobFamilyItem = {
        id: `JF-${Date.now()}`,
        code: code.trim() || `JF-0${items.length + 1}`,
        name: name.trim(),
        nameEn: nameEn.trim() || "New Job Family",
        departmentScope: departmentScope.trim() || "ทุกหน่วยงานที่เกี่ยวข้อง",
        positionsCount: 4,
        employeesCount: 15,
        description: description.trim() || "กลุ่มสายงานใหม่ในโครงสร้างสายอาชีพองค์กร",
        active: true,
      };
      onChange([created, ...items]);
      onNotify(`เพิ่มกลุ่มสายงาน "${created.name}" เรียบร้อยแล้ว`);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="ค้นหารหัส, ชื่อกลุ่มสายงาน หรือขอบเขตแผนก..."
          className="w-full sm:w-80"
        />
        <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />} onClick={openCreate}>
          เพิ่มกลุ่มสายงาน
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="ไม่พบกลุ่มสายงาน"
          description="ลองปรับคำค้นหาหรือเพิ่มกลุ่มสายงานใหม่"
        />
      ) : (
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[26%]">รหัส / กลุ่มสายงาน</TableHead>
                <TableHead className="w-[34%]">ขอบเขตหน่วยงานและคำอธิบาย</TableHead>
                <TableHead className="w-[12%] text-center">จำนวนตำแหน่ง</TableHead>
                <TableHead className="w-[12%] text-center">พนักงานในสาย</TableHead>
                <TableHead className="w-[8%] text-center">สถานะ</TableHead>
                <TableHead className="w-[8%] text-center">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <span className="inline-block rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                      {item.code}
                    </span>
                    <div className="mt-1 font-semibold text-[#1E293B]">{item.name}</div>
                    <div className="text-xs text-[#64748B]">{item.nameEn}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs font-medium text-[#334155]">{item.departmentScope}</div>
                    <div className="mt-1 text-xs text-[#64748B]">{item.description}</div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="primary">{item.positionsCount} ตำแหน่ง</Badge>
                  </TableCell>
                  <TableCell className="text-center font-semibold text-[#1E293B]">
                    {item.employeesCount} คน
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={item.active ? "success" : "neutral"} dot>
                      {item.active ? "ใช้งาน" : "ปิดใช้งาน"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      <Tooltip content="แก้ไขข้อมูลกลุ่มสายงาน">
                        <Button
                          size="sm"
                          variant="outline"
                          leftIcon={<Pencil className="h-3.5 w-3.5" />}
                          onClick={() => openEdit(item)}
                        >
                          แก้ไข
                        </Button>
                      </Tooltip>
                    </div>
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
        title={editing ? "แก้ไขกลุ่มสายงาน (Job Family)" : "เพิ่มกลุ่มสายงานใหม่"}
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              ยกเลิก
            </Button>
            <Button
              variant="primary"
              leftIcon={<CheckCircle2 className="h-4 w-4" />}
              onClick={handleSave}
              disabled={!name.trim()}
            >
              บันทึกข้อมูล
            </Button>
          </>
        }
      >
        <div className="space-y-3.5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input label="รหัสกลุ่มสายงาน" value={code} onChange={(e) => setCode(e.target.value)} />
            <Input
              label="ชื่อภาษาอังกฤษ"
              placeholder="เช่น Finance & Accounting"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
            />
          </div>
          <Input
            label="ชื่อกลุ่มสายงาน (ภาษาไทย)"
            placeholder="เช่น การเงินและบัญชีองค์กร"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="ขอบเขตแผนกที่เกี่ยวข้อง"
            placeholder="เช่น ฝ่ายบัญชี, ฝ่ายการเงินและงบประมาณ"
            value={departmentScope}
            onChange={(e) => setDepartmentScope(e.target.value)}
          />
          <Input
            label="คำอธิบายกลุ่มสายงาน"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}
