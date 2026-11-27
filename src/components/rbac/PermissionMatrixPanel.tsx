"use client";

import { useState } from "react";
import { Check, Lock, Save } from "lucide-react";
import {
  Badge,
  Button,
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
  HRD_MODULES_FOR_RBAC,
  PERMISSION_ACTIONS,
  type PermissionAction,
  type RoleDefinition,
} from "@/data/mock/rbacData";

interface PermissionMatrixPanelProps {
  roles: RoleDefinition[];
  onSavePermissions: (
    roleId: string,
    nextPermissions: Record<string, PermissionAction[]>
  ) => void;
}

export function PermissionMatrixPanel({
  roles,
  onSavePermissions,
}: PermissionMatrixPanelProps) {
  const [selectedRoleId, setSelectedRoleId] = useState<string>(roles[1]?.id ?? roles[0]?.id ?? "");
  const activeRole = roles.find((r) => r.id === selectedRoleId) ?? roles[0];

  const [draftPerms, setDraftPerms] = useState<Record<string, PermissionAction[]>>(
    activeRole ? activeRole.permissions : {}
  );
  const [dirty, setDirty] = useState(false);

  const handleSwitchRole = (nextId: string) => {
    setSelectedRoleId(nextId);
    const found = roles.find((r) => r.id === nextId);
    setDraftPerms(found ? found.permissions : {});
    setDirty(false);
  };

  const toggleCell = (moduleId: string, action: PermissionAction) => {
    if (activeRole?.isProtectedAdmin && moduleId === "m10") return;
    const current = draftPerms[moduleId] ?? [];
    const exists = current.includes(action);
    const next = exists ? current.filter((a) => a !== action) : [...current, action];
    setDraftPerms((prev) => ({ ...prev, [moduleId]: next }));
    setDirty(true);
  };

  const toggleRowAll = (moduleId: string) => {
    if (activeRole?.isProtectedAdmin && moduleId === "m10") return;
    const current = draftPerms[moduleId] ?? [];
    const allKeys = PERMISSION_ACTIONS.map((a) => a.key);
    const next = current.length === allKeys.length ? [] : allKeys;
    setDraftPerms((prev) => ({ ...prev, [moduleId]: next }));
    setDirty(true);
  };

  const handleSave = () => {
    if (!activeRole) return;
    onSavePermissions(activeRole.id, draftPerms);
    setDirty(false);
  };

  if (!activeRole) return null;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <Select
            aria-label="เลือกบทบาทที่ต้องการกำหนดสิทธิ์"
            value={activeRole.id}
            onChange={handleSwitchRole}
            options={roles.map((r) => ({ value: r.id, label: `${r.name} (${r.code})` }))}
            className="w-72"
          />
          {activeRole.isProtectedAdmin && (
            <Tooltip content="เพื่อความปลอดภัย สิทธิ์โมดูล 10 (Settings & RBAC) ของ Admin จะถูกล็อกไว้ไม่ให้เอาออก">
              <Badge variant="primary">
                <Lock className="mr-1 inline h-3 w-3" /> Protected Admin
              </Badge>
            </Tooltip>
          )}
        </div>

        <Button
          variant="primary"
          leftIcon={<Save className="h-4 w-4" />}
          onClick={handleSave}
          disabled={!dirty}
        >
          บันทึกตารางสิทธิ์
        </Button>
      </div>

      <TableContainer>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[34%]">โมดูลในระบบ HRD (คลิกแถวเพื่อเลือกทั้งหมด)</TableHead>
              {PERMISSION_ACTIONS.map((act) => (
                <TableHead key={act.key} className="w-[11%] text-center">
                  <Tooltip title={`${act.label} (${act.labelTh})`} content={act.hint}>
                    <span className="cursor-help border-b border-dashed border-[#CBD5E1]">
                      {act.label}
                    </span>
                  </Tooltip>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {HRD_MODULES_FOR_RBAC.map((mod) => {
              const perms = draftPerms[mod.id] ?? [];
              const lockedRow = Boolean(activeRole.isProtectedAdmin && mod.id === "m10");

              return (
                <TableRow key={mod.id}>
                  <TableCell>
                    <button
                      type="button"
                      disabled={lockedRow}
                      onClick={() => toggleRowAll(mod.id)}
                      className={`flex items-center gap-2 text-left ${
                        lockedRow ? "cursor-not-allowed" : "cursor-pointer hover:text-[#2563EB]"
                      }`}
                    >
                      <span className="inline-block rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                        {mod.code}
                      </span>
                      <span className="font-medium text-[#1E293B]">{mod.name}</span>
                      {lockedRow && <Lock className="h-3.5 w-3.5 text-[#94A3B8]" />}
                    </button>
                  </TableCell>
                  {PERMISSION_ACTIONS.map((act) => {
                    const checked = perms.includes(act.key);
                    return (
                      <TableCell key={act.key} className="text-center">
                        <Tooltip
                          content={
                            lockedRow
                              ? "ล็อกสิทธิ์ Admin เพื่อป้องกันการล็อกระบบ"
                              : `${checked ? "ปิด" : "เปิด"}สิทธิ์ ${act.labelTh} ใน ${mod.name}`
                          }
                        >
                          <button
                            type="button"
                            disabled={lockedRow}
                            onClick={() => toggleCell(mod.id, act.key)}
                            aria-label={`${mod.name} - ${act.label}`}
                            className={`mx-auto flex h-7 w-7 items-center justify-center rounded-lg border transition-all ${
                              checked
                                ? "border-[#2563EB] bg-[#2563EB] text-white shadow-2xs"
                                : "border-[#CBD5E1] bg-white text-transparent hover:border-[#2563EB]"
                            } ${lockedRow ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        </Tooltip>
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
