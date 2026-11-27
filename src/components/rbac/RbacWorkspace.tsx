"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  ClipboardList,
  Grid3x3,
  Lock,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";
import { Card, InfoHint, Tooltip } from "@/components/ui";
import {
  HRD_MODULES_FOR_RBAC,
  INITIAL_RBAC_AUDIT_LOGS,
  INITIAL_ROLES,
  INITIAL_USER_ROLE_MAPPINGS,
  type AuditActionType,
  type PermissionAction,
  type RbacAuditLogItem,
  type RoleDefinition,
  type UserRoleMappingItem,
} from "@/data/mock/rbacData";
import { RolesListPanel } from "./RolesListPanel";
import { PermissionMatrixPanel } from "./PermissionMatrixPanel";
import { UserRoleMappingPanel } from "./UserRoleMappingPanel";
import { RbacAuditLogPanel } from "./RbacAuditLogPanel";

type RbacTabKey = "roles" | "matrix" | "users" | "audit";
const VALID_TABS: RbacTabKey[] = ["roles", "matrix", "users", "audit"];

const TAB_META: Record<RbacTabKey, { title: string; subtitle: string; hint: string }> = {
  roles: {
    title: "จัดการบทบาทผู้ใช้งาน (Dynamic Roles)",
    subtitle: "สร้าง แก้ไข คัดลอก และเปิด-ปิดบทบาทได้อย่างอิสระ พร้อมระบบล็อกบทบาทมาตรฐานเพื่อความปลอดภัย",
    hint: "บทบาทเริ่มต้น (Admin, Manager, Employee) ถูกป้องกันไม่ให้ลบ และ Admin ไม่สามารถปิดใช้งานได้",
  },
  matrix: {
    title: "ตารางกำหนดสิทธิ์ (Permission Matrix 6 Actions)",
    subtitle: "กำหนดสิทธิ์รายโมดูลครบทั้ง 6 การกระทำ (View, Create, Edit, Delete, Approve, Export) สำหรับแต่ละบทบาท",
    hint: "คลิกชื่อโมดูลด้านซ้ายเพื่อเปิด/ปิดสิทธิ์ทั้งแถว และกดบันทึกเพื่อให้มีผลพร้อมลง Audit Log",
  },
  users: {
    title: "กำหนดบทบาทให้ผู้ใช้งาน (User-Role Mapping)",
    subtitle: "เชื่อมโยงพนักงานแต่ละคนเข้ากับบทบาทในระบบ HRD สามารถปรับเปลี่ยนบทบาทได้ทันที",
    hint: "การเปลี่ยนบทบาทผู้ใช้งานทุกครั้งจะถูกบันทึกเข้า Audit Log อัตโนมัติเพื่อความโปร่งใส",
  },
  audit: {
    title: "ประวัติการเปลี่ยนแปลงสิทธิ์ (RBAC Audit Log)",
    subtitle: "บันทึกประวัติการสร้าง/แก้ไขบทบาท การปรับตารางสิทธิ์ และการเปลี่ยนบทบาทผู้ใช้แบบตรวจสอบย้อนหลังได้",
    hint: "ข้อมูลใน Audit Log เป็นแบบ Append-Only ไม่สามารถแก้ไขหรือลบย้อนหลังได้",
  },
};

export function RbacWorkspace() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as RbacTabKey | null;
  const activeTab: RbacTabKey = tabParam && VALID_TABS.includes(tabParam) ? tabParam : "roles";

  const [roles, setRoles] = useState<RoleDefinition[]>(INITIAL_ROLES);
  const [users, setUsers] = useState<UserRoleMappingItem[]>(INITIAL_USER_ROLE_MAPPINGS);
  const [logs, setLogs] = useState<RbacAuditLogItem[]>(INITIAL_RBAC_AUDIT_LOGS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const appendAudit = (actionType: AuditActionType, target: string, detail: string) => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const entry: RbacAuditLogItem = {
      id: `AUD-${Date.now()}`,
      timestamp: `27 พ.ย. 2569 ${hh}:${mm}`,
      actorName: "พิมพ์ชนก วัฒนากูล",
      actionType,
      target,
      detail,
    };
    setLogs((prev) => [entry, ...prev]);
  };

  const handleCreateRole = (name: string, code: string, description: string) => {
    const emptyPerms: Record<string, PermissionAction[]> = {};
    HRD_MODULES_FOR_RBAC.forEach((m) => {
      emptyPerms[m.id] = ["view"];
    });
    const created: RoleDefinition = {
      id: `role-${Date.now()}`,
      code,
      name,
      description,
      isSystem: false,
      active: true,
      usersCount: 0,
      permissions: emptyPerms,
    };
    setRoles((prev) => [...prev, created]);
    appendAudit("ROLE_CREATED", `${name} (${code})`, "สร้างบทบาทใหม่พร้อมสิทธิ์พื้นฐาน View ทุกโมดูล");
    notify(`สร้างบทบาท "${name}" เรียบร้อยแล้ว`);
  };

  const handleUpdateRole = (id: string, name: string, description: string) => {
    const target = roles.find((r) => r.id === id);
    setRoles((prev) =>
      prev.map((r) => (r.id === id ? { ...r, name, description } : r))
    );
    if (target) {
      appendAudit("ROLE_UPDATED", `${name} (${target.code})`, "แก้ไขชื่อหรือคำอธิบายบทบาท");
    }
    notify(`อัปเดตบทบาท "${name}" เรียบร้อยแล้ว`);
  };

  const handleCopyRole = (role: RoleDefinition) => {
    const copiedPerms: Record<string, PermissionAction[]> = {};
    Object.entries(role.permissions).forEach(([k, v]) => {
      copiedPerms[k] = [...v];
    });
    const copied: RoleDefinition = {
      id: `role-copy-${Date.now()}`,
      code: `${role.code}-COPY`,
      name: `${role.name} (สำเนา)`,
      description: role.description,
      isSystem: false,
      active: true,
      usersCount: 0,
      permissions: copiedPerms,
    };
    setRoles((prev) => [...prev, copied]);
    appendAudit(
      "ROLE_COPIED",
      `${copied.name} (${copied.code})`,
      `คัดลอกตารางสิทธิ์ทั้งหมดมาจากบทบาท ${role.name}`
    );
    notify(`คัดลอกบทบาท "${role.name}" เป็น "${copied.name}" แล้ว`);
  };

  const handleToggleRole = (role: RoleDefinition) => {
    if (role.isProtectedAdmin) return;
    const nextActive = !role.active;
    setRoles((prev) =>
      prev.map((r) => (r.id === role.id ? { ...r, active: nextActive } : r))
    );
    appendAudit(
      "ROLE_TOGGLED",
      `${role.name} (${role.code})`,
      nextActive ? "เปิดใช้งานบทบาท" : "ปิดใช้งานบทบาทชั่วคราว"
    );
    notify(`${nextActive ? "เปิดใช้งาน" : "ปิดใช้งาน"}บทบาท "${role.name}" แล้ว`);
  };

  const handleDeleteRole = (role: RoleDefinition) => {
    if (role.isSystem) return;
    setRoles((prev) => prev.filter((r) => r.id !== role.id));
    appendAudit("ROLE_UPDATED", `${role.name} (${role.code})`, "ลบบทบาท Custom ออกจากระบบ");
    notify(`ลบบทบาท "${role.name}" เรียบร้อยแล้ว`);
  };

  const handleSavePermissions = (
    roleId: string,
    nextPermissions: Record<string, PermissionAction[]>
  ) => {
    const target = roles.find((r) => r.id === roleId);
    setRoles((prev) =>
      prev.map((r) => (r.id === roleId ? { ...r, permissions: nextPermissions } : r))
    );
    if (target) {
      const total = Object.values(nextPermissions).reduce((a, arr) => a + arr.length, 0);
      appendAudit(
        "PERMISSION_CHANGED",
        `${target.name} (${target.code})`,
        `บันทึกตารางสิทธิ์ใหม่ (เปิดใช้งานรวม ${total} สิทธิ์จาก 60 สิทธิ์)`
      );
      notify(`บันทึกตารางสิทธิ์ของบทบาท "${target.name}" เรียบร้อยแล้ว`);
    }
  };

  const handleAssignRole = (user: UserRoleMappingItem, nextRoleId: string) => {
    const nextRole = roles.find((r) => r.id === nextRoleId);
    if (!nextRole) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id ? { ...u, roleId: nextRoleId, assignedDate: "27 พ.ย. 2569" } : u
      )
    );
    appendAudit(
      "USER_ASSIGNED",
      `${user.employeeName} (${user.employeeCode})`,
      `เปลี่ยนบทบาทเป็น ${nextRole.name}`
    );
    notify(`เปลี่ยนบทบาทของ ${user.employeeName} เป็น "${nextRole.name}" แล้ว`);
  };

  const kpiCards = useMemo(() => {
    const activeRolesCount = roles.filter((r) => r.active).length;
    const customRolesCount = roles.filter((r) => !r.isSystem).length;
    const totalMappedUsers = roles.reduce((a, r) => a + r.usersCount, 0);
    return [
      {
        label: "บทบาททั้งหมดในระบบ",
        value: `${roles.length} บทบาท`,
        sub: `เปิดใช้งาน ${activeRolesCount} บทบาท (Custom ${customRolesCount})`,
        icon: <ShieldCheck className="h-5 w-5" />,
        color: "bg-[#EEF4FF] text-[#2563EB]",
      },
      {
        label: "โมดูลที่ควบคุมสิทธิ์",
        value: `${HRD_MODULES_FOR_RBAC.length} โมดูล`,
        sub: "ละเอียด 6 สิทธิ์ต่อโมดูล (60 สิทธิ์)",
        icon: <Grid3x3 className="h-5 w-5" />,
        color: "bg-[#F3E8FF] text-[#7C3AED]",
      },
      {
        label: "ผู้ใช้งานที่ผูกบทบาท",
        value: `${totalMappedUsers} บัญชี`,
        sub: "เชื่อมต่อโครงสร้างองค์กรจาก HRM",
        icon: <Users className="h-5 w-5" />,
        color: "bg-[#DCFCE7] text-[#16A34A]",
      },
      {
        label: "บันทึก Audit Log",
        value: `${logs.length} รายการ`,
        sub: "ติดตามการแก้ไขสิทธิ์แบบ Real-time",
        icon: activeTab === "audit" ? <ClipboardList className="h-5 w-5" /> : <Lock className="h-5 w-5" />,
        color: "bg-[#FEF3C7] text-[#D97706]",
      },
    ];
  }, [roles, logs, activeTab]);

  const meta = TAB_META[activeTab];

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-[#1E293B]">{meta.title}</h1>
          <InfoHint content={meta.hint} />
        </div>
        <p className="text-sm text-[#64748B]">{meta.subtitle}</p>
      </div>

      {/* Context-Aware 4 White KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((kpi) => (
          <Tooltip
            key={kpi.label}
            className="block w-full"
            title={kpi.label}
            content={`${kpi.value} — ${kpi.sub}`}
          >
            <Card className="flex items-start justify-between gap-3 p-5 transition-colors hover:border-[#DCE6F5]">
              <div className="min-w-0">
                <div className="text-xs font-medium text-[#64748B]">{kpi.label}</div>
                <div className="mt-1.5 text-2xl font-bold tracking-tight text-[#1E293B]">
                  {kpi.value}
                </div>
                <div className="mt-1 text-xs text-[#94A3B8]">{kpi.sub}</div>
              </div>
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${kpi.color}`}
              >
                {kpi.icon}
              </div>
            </Card>
          </Tooltip>
        ))}
      </div>

      {toastMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700 shadow-xs">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <Card className="p-6">
        {activeTab === "roles" && (
          <RolesListPanel
            roles={roles}
            onCreateRole={handleCreateRole}
            onUpdateRole={handleUpdateRole}
            onCopyRole={handleCopyRole}
            onToggleRole={handleToggleRole}
            onDeleteRole={handleDeleteRole}
          />
        )}
        {activeTab === "matrix" && (
          <PermissionMatrixPanel
            roles={roles}
            onSavePermissions={handleSavePermissions}
          />
        )}
        {activeTab === "users" && (
          <UserRoleMappingPanel
            users={users}
            roles={roles}
            onAssignRole={handleAssignRole}
          />
        )}
        {activeTab === "audit" && <RbacAuditLogPanel logs={logs} />}
      </Card>
    </div>
  );
}
