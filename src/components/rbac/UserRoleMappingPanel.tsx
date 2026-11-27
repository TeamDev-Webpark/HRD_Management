"use client";

import { useMemo, useState } from "react";
import { FolderOpen } from "lucide-react";
import {
  Badge,
  EmptyState,
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
import type { RoleDefinition, UserRoleMappingItem } from "@/data/mock/rbacData";

interface UserRoleMappingPanelProps {
  users: UserRoleMappingItem[];
  roles: RoleDefinition[];
  onAssignRole: (user: UserRoleMappingItem, nextRoleId: string) => void;
}

export function UserRoleMappingPanel({
  users,
  roles,
  onAssignRole,
}: UserRoleMappingPanelProps) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const activeRoles = useMemo(() => roles.filter((r) => r.active), [roles]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      if (roleFilter !== "all" && u.roleId !== roleFilter) return false;
      if (!q) return true;
      return (
        u.employeeCode.toLowerCase().includes(q) ||
        u.employeeName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.department.toLowerCase().includes(q)
      );
    });
  }, [users, search, roleFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="ค้นหาชื่อพนักงาน, อีเมล, รหัส หรือแผนก..."
            className="w-full sm:w-80"
          />
          <Select
            aria-label="กรองตามบทบาท"
            value={roleFilter}
            onChange={setRoleFilter}
            options={[
              { value: "all", label: "บทบาท: ทั้งหมด" },
              ...roles.map((r) => ({ value: r.id, label: r.name })),
            ]}
            className="w-56"
          />
        </div>
        <div className="text-xs text-[#64748B]">
          เปลี่ยนบทบาทในคอลัมน์ขวาเพื่ออัปเดตสิทธิ์และบันทึก Audit Log อัตโนมัติ
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="ไม่พบผู้ใช้งาน"
          description="ลองปรับคำค้นหาหรือเปลี่ยนตัวกรองบทบาท"
        />
      ) : (
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[26%]">รหัส / ผู้ใช้งาน</TableHead>
                <TableHead className="w-[24%]">ตำแหน่งและแผนก</TableHead>
                <TableHead className="w-[14%] text-center">วันที่กำหนดสิทธิ์</TableHead>
                <TableHead className="w-[11%] text-center">สถานะบัญชี</TableHead>
                <TableHead className="w-[25%]">บทบาทที่ได้รับมอบหมาย (Role)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <span className="inline-block rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                      {user.employeeCode}
                    </span>
                    <div className="mt-1 font-semibold text-[#1E293B]">{user.employeeName}</div>
                    <div className="text-xs text-[#64748B]">{user.email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-[#1E293B]">{user.position}</div>
                    <div className="text-xs text-[#64748B]">{user.department}</div>
                  </TableCell>
                  <TableCell className="text-center text-xs font-medium text-[#475569]">
                    {user.assignedDate}
                  </TableCell>
                  <TableCell className="text-center">
                    <Tooltip content="บัญชีผู้ใช้งานเชื่อมต่อกับระบบ HRM ปกติ">
                      <Badge variant={user.status === "active" ? "success" : "danger"} dot>
                        {user.status === "active" ? "ใช้งาน" : "ระงับ"}
                      </Badge>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Select
                      aria-label={`เปลี่ยนบทบาทของ ${user.employeeName}`}
                      value={user.roleId}
                      onChange={(nextRoleId) => onAssignRole(user, nextRoleId)}
                      options={activeRoles.map((r) => ({ value: r.id, label: r.name }))}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
