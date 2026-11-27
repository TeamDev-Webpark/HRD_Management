"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Copy,
  FolderOpen,
  Lock,
  Pencil,
  Plus,
  Power,
  ShieldCheck,
  Trash2,
} from "lucide-react";
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
import type { RoleDefinition } from "@/data/mock/rbacData";

interface RolesListPanelProps {
  roles: RoleDefinition[];
  onCreateRole: (name: string, code: string, description: string) => void;
  onUpdateRole: (id: string, name: string, description: string) => void;
  onCopyRole: (role: RoleDefinition) => void;
  onToggleRole: (role: RoleDefinition) => void;
  onDeleteRole: (role: RoleDefinition) => void;
}

export function RolesListPanel({
  roles,
  onCreateRole,
  onUpdateRole,
  onCopyRole,
  onToggleRole,
  onDeleteRole,
}: RolesListPanelProps) {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<RoleDefinition | null>(null);
  const [formCode, setFormCode] = useState("");
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return roles;
    return roles.filter(
      (r) =>
        r.code.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
    );
  }, [roles, search]);

  const openCreate = () => {
    setEditing(null);
    setFormCode(`ROLE-CUSTOM-${roles.length + 1}`);
    setFormName("");
    setFormDesc("");
    setModalOpen(true);
  };

  const openEdit = (role: RoleDefinition) => {
    setEditing(role);
    setFormCode(role.code);
    setFormName(role.name);
    setFormDesc(role.description);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim()) return;
    if (editing) {
      onUpdateRole(editing.id, formName.trim(), formDesc.trim());
    } else {
      onCreateRole(
        formName.trim(),
        formCode.trim() || `ROLE-${roles.length + 1}`,
        formDesc.trim() || "บทบาทที่กำหนดสิทธิ์เฉพาะทางในระบบ HRD"
      );
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Security Guardrails Notice */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-2.5 text-xs text-[#1E40AF]">
        <ShieldCheck className="h-4 w-4 shrink-0 text-[#2563EB]" />
        <span>
          <strong>กฎความปลอดภัย (Security Rules):</strong> บทบาทระบบหลัก (`Admin`, `Manager`, `Employee`) ไม่สามารถลบได้ และบทบาท `Admin` ไม่สามารถปิดใช้งานเพื่อป้องกันการล็อกระบบ
        </span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="ค้นหาชื่อบทบาท, รหัส หรือคำอธิบาย..."
          className="w-full sm:w-80"
        />
        <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />} onClick={openCreate}>
          สร้างบทบาทใหม่
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="ไม่พบบทบาทผู้ใช้งาน"
          description="ลองปรับคำค้นหาหรือสร้างบทบาทใหม่"
        />
      ) : (
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[26%]">รหัส / ชื่อบทบาท (Role)</TableHead>
                <TableHead className="w-[30%]">คำอธิบายสิทธิ์</TableHead>
                <TableHead className="w-[10%] text-center">ประเภท</TableHead>
                <TableHead className="w-[10%] text-center">ผู้ใช้งาน</TableHead>
                <TableHead className="w-[10%] text-center">สถานะ</TableHead>
                <TableHead className="w-[14%] text-center">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((role) => {
                const totalPerms = Object.values(role.permissions).reduce(
                  (acc, list) => acc + list.length,
                  0
                );
                return (
                  <TableRow key={role.id}>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <span className="inline-block rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                          {role.code}
                        </span>
                        {role.isProtectedAdmin && (
                          <Tooltip content="บทบาท Admin หลักของระบบ — ป้องกันการปิดใช้งานและลบ">
                            <Lock className="h-3.5 w-3.5 text-[#64748B]" />
                          </Tooltip>
                        )}
                      </div>
                      <div className="mt-1 font-semibold text-[#1E293B]">{role.name}</div>
                      <div className="text-xs text-[#94A3B8]">
                        เปิดใช้งาน {totalPerms} สิทธิ์จาก 60 สิทธิ์ทั้งหมด
                      </div>
                    </TableCell>
                    <TableCell className="text-xs leading-relaxed text-[#475569]">
                      {role.description}
                    </TableCell>
                    <TableCell className="text-center">
                      <Tooltip
                        content={
                          role.isSystem
                            ? "บทบาทมาตรฐานของระบบ (ไม่สามารถลบได้)"
                            : "บทบาทที่สร้างขึ้นเอง (แก้ไข/คัดลอก/ลบได้)"
                        }
                      >
                        <Badge variant={role.isSystem ? "primary" : "neutral"}>
                          {role.isSystem ? "System" : "Custom"}
                        </Badge>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="text-center font-semibold text-[#1E293B]">
                      {role.usersCount} คน
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={role.active ? "success" : "neutral"} dot>
                        {role.active ? "ใช้งาน" : "ปิดใช้งาน"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1.5">
                        <Tooltip content="แก้ไขชื่อและคำอธิบายบทบาท">
                          <button
                            type="button"
                            onClick={() => openEdit(role)}
                            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#475569] hover:border-[#2563EB] hover:text-[#2563EB]"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                        </Tooltip>
                        <Tooltip content="คัดลอกบทบาทนี้พร้อมตารางสิทธิ์ทั้งหมดเป็นบทบาทใหม่">
                          <button
                            type="button"
                            onClick={() => onCopyRole(role)}
                            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#475569] hover:border-[#2563EB] hover:text-[#2563EB]"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        </Tooltip>
                        <Tooltip
                          content={
                            role.isProtectedAdmin
                              ? "ไม่สามารถปิดใช้งานบทบาท Admin หลักได้"
                              : role.active
                                ? "ปิดใช้งานบทบาทนี้ชั่วคราว"
                                : "เปิดใช้งานบทบาทนี้"
                          }
                        >
                          <button
                            type="button"
                            disabled={role.isProtectedAdmin}
                            onClick={() => onToggleRole(role)}
                            className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
                              role.isProtectedAdmin
                                ? "cursor-not-allowed border-[#EEF2F6] bg-[#F8FAFC] text-[#CBD5E1]"
                                : "cursor-pointer border-[#E2E8F0] bg-white text-[#475569] hover:border-amber-500 hover:text-amber-600"
                            }`}
                          >
                            <Power className="h-3.5 w-3.5" />
                          </button>
                        </Tooltip>
                        <Tooltip
                          content={
                            role.isSystem
                              ? "ไม่สามารถลบบทบาทมาตรฐานของระบบได้"
                              : "ลบบทบาทนี้"
                          }
                        >
                          <button
                            type="button"
                            disabled={role.isSystem}
                            onClick={() => onDeleteRole(role)}
                            className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
                              role.isSystem
                                ? "cursor-not-allowed border-[#EEF2F6] bg-[#F8FAFC] text-[#CBD5E1]"
                                : "cursor-pointer border-[#E2E8F0] bg-white text-[#475569] hover:border-rose-500 hover:text-rose-600"
                            }`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
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

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "แก้ไขข้อมูลบทบาท (Role)" : "สร้างบทบาทใหม่ (Dynamic Role)"}
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
              disabled={!formName.trim()}
            >
              บันทึกบทบาท
            </Button>
          </>
        }
      >
        <div className="space-y-3.5">
          {!editing && (
            <Input
              label="รหัสบทบาท (Role Code)"
              value={formCode}
              onChange={(e) => setFormCode(e.target.value)}
            />
          )}
          <Input
            label="ชื่อบทบาท (Role Name)"
            placeholder="เช่น Training Coordinator"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />
          <Input
            label="คำอธิบายขอบเขตสิทธิ์"
            placeholder="ระบุหน้าที่ความรับผิดชอบของบทบาทนี้"
            value={formDesc}
            onChange={(e) => setFormDesc(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}
