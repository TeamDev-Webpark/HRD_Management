"use client";

import { useMemo, useState } from "react";
import { FolderOpen, ShieldAlert } from "lucide-react";
import {
  Badge,
  EmptyState,
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
import type { AuditActionType, RbacAuditLogItem } from "@/data/mock/rbacData";

interface RbacAuditLogPanelProps {
  logs: RbacAuditLogItem[];
}

const ACTION_META: Record<
  AuditActionType,
  { label: string; variant: "primary" | "success" | "warning" | "neutral" }
> = {
  ROLE_CREATED: { label: "สร้างบทบาทใหม่", variant: "success" },
  ROLE_COPIED: { label: "คัดลอกบทบาท", variant: "primary" },
  ROLE_UPDATED: { label: "แก้ไขบทบาท", variant: "neutral" },
  ROLE_TOGGLED: { label: "เปิด/ปิดบทบาท", variant: "warning" },
  PERMISSION_CHANGED: { label: "แก้ไข Permission Matrix", variant: "primary" },
  USER_ASSIGNED: { label: "เปลี่ยน Role ผู้ใช้", variant: "warning" },
};

export function RbacAuditLogPanel({ logs }: RbacAuditLogPanelProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return logs;
    return logs.filter(
      (l) =>
        l.actorName.toLowerCase().includes(q) ||
        l.target.toLowerCase().includes(q) ||
        l.detail.toLowerCase().includes(q)
    );
  }, [logs, search]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="ค้นหาผู้ดำเนินการ, เป้าหมาย หรือรายละเอียดการเปลี่ยนแปลง..."
          className="w-full sm:w-80"
        />
        <Tooltip content="บันทึกประวัติการเปลี่ยนแปลงสิทธิ์แบบ Append-Only ไม่สามารถแก้ไขหรือลบย้อนหลังได้">
          <span className="inline-flex cursor-help items-center gap-1.5 text-xs font-medium text-[#64748B]">
            <ShieldAlert className="h-4 w-4 text-[#2563EB]" />
            Immutable Audit Trail ({logs.length} รายการ)
          </span>
        </Tooltip>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="ไม่พบประวัติ Audit Log"
          description="ลองปรับคำค้นหาใหม่"
        />
      ) : (
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[18%]">วัน-เวลา</TableHead>
                <TableHead className="w-[18%]">ผู้ดำเนินการ</TableHead>
                <TableHead className="w-[18%] text-center">ประเภทเหตุการณ์</TableHead>
                <TableHead className="w-[20%]">เป้าหมาย</TableHead>
                <TableHead className="w-[26%]">รายละเอียดการเปลี่ยนแปลง</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((log) => {
                const aMeta = ACTION_META[log.actionType];
                return (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-xs text-[#475569]">
                      {log.timestamp}
                    </TableCell>
                    <TableCell className="font-semibold text-[#1E293B]">
                      {log.actorName}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={aMeta.variant}>{aMeta.label}</Badge>
                    </TableCell>
                    <TableCell className="font-medium text-[#2563EB]">{log.target}</TableCell>
                    <TableCell className="text-xs leading-relaxed text-[#475569]">
                      {log.detail}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
