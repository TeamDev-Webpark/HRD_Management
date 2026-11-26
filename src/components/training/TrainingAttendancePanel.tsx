"use client";

import { useMemo, useState } from "react";
import { CheckCheck, Clock, FolderOpen, UserCheck, UserX } from "lucide-react";
import {
  Badge,
  Button,
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
import type {
  AttendanceRecord,
  AttendanceStatus,
  TrainingSessionItem,
} from "@/data/mock/trainingOperations";

interface TrainingAttendancePanelProps {
  records: AttendanceRecord[];
  sessions: TrainingSessionItem[];
  onChange: (records: AttendanceRecord[]) => void;
  onNotify: (message: string) => void;
}

const ATTENDANCE_META: Record<
  AttendanceStatus,
  { label: string; variant: "success" | "warning" | "danger"; hint: string }
> = {
  present: { label: "เข้าอบรม", variant: "success", hint: "ลงเวลาเข้าอบรมตรงตามกำหนด" },
  late: { label: "มาสาย", variant: "warning", hint: "เข้าอบรมล่าช้ากว่าเวลาเริ่มเกิน 15 นาที" },
  absent: { label: "ขาดอบรม", variant: "danger", hint: "ไม่ได้เข้าร่วมการอบรมในรุ่นนี้" },
};

export function TrainingAttendancePanel({
  records,
  sessions,
  onChange,
  onNotify,
}: TrainingAttendancePanelProps) {
  const [selectedSessionId, setSelectedSessionId] = useState(sessions[1]?.id ?? sessions[0]?.id ?? "");
  const [search, setSearch] = useState("");

  const sessionRecords = useMemo(() => {
    const q = search.trim().toLowerCase();
    return records.filter((r) => {
      const matchSession = !selectedSessionId || r.sessionId === selectedSessionId;
      const matchQuery =
        !q ||
        r.employeeName.toLowerCase().includes(q) ||
        r.employeeCode.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q);
      return matchSession && matchQuery;
    });
  }, [records, selectedSessionId, search]);

  const stats = useMemo(() => {
    const inSession = records.filter((r) => !selectedSessionId || r.sessionId === selectedSessionId);
    const total = inSession.length;
    const present = inSession.filter((r) => r.status === "present").length;
    const late = inSession.filter((r) => r.status === "late").length;
    const absent = inSession.filter((r) => r.status === "absent").length;
    const rate = total ? Math.round(((present + late) / total) * 100) : 0;
    return { total, present, late, absent, rate };
  }, [records, selectedSessionId]);

  const setStatus = (id: string, nextStatus: AttendanceStatus) => {
    const nowTime = nextStatus === "absent" ? "—" : nextStatus === "late" ? "09:20 น." : "08:55 น.";
    const target = records.find((r) => r.id === id);
    onChange(
      records.map((r) =>
        r.id === id
          ? {
              ...r,
              status: nextStatus,
              checkInTime: nowTime,
              note:
                nextStatus === "present"
                  ? "เช็คชื่อเข้าอบรมแล้ว"
                  : nextStatus === "late"
                    ? "บันทึกเข้าอบรมสาย"
                    : "ไม่มาเข้าอบรม",
            }
          : r
      )
    );
    if (target) {
      onNotify(`บันทึกสถานะ "${target.employeeName}" เป็น ${ATTENDANCE_META[nextStatus].label} แล้ว`);
    }
  };

  const markAllPresent = () => {
    onChange(
      records.map((r) =>
        r.sessionId === selectedSessionId
          ? { ...r, status: "present", checkInTime: r.checkInTime === "—" ? "08:55 น." : r.checkInTime, note: "เช็คชื่อเข้าอบรมแล้ว" }
          : r
      )
    );
    onNotify("เช็คชื่อเข้าอบรมครบทุกคนในรุ่นที่เลือกเรียบร้อยแล้ว");
  };

  return (
    <div className="space-y-4">
      {/* Compact Attendance Summary Strip */}
      <div className="grid grid-cols-2 gap-3 rounded-2xl border border-[#EEF2F6] bg-[#F8FAFC] p-4 sm:grid-cols-4">
        <Tooltip className="block w-full" content="อัตราการเข้าร่วมอบรม (นับรวมเข้าอบรมตรงเวลาและมาสาย)">
          <div className="w-full rounded-xl bg-white p-3.5 ring-1 ring-[#EEF2F6] cursor-help">
            <p className="text-xs font-medium text-[#64748B]">อัตราเข้าอบรม</p>
            <p className="mt-1 tabular-nums text-xl font-bold text-[#2563EB]">{stats.rate}%</p>
          </div>
        </Tooltip>
        <Tooltip className="block w-full" content="จำนวนผู้เรียนที่ลงเวลาเข้าอบรมตรงเวลา">
          <div className="w-full rounded-xl bg-white p-3.5 ring-1 ring-[#EEF2F6] cursor-help">
            <p className="text-xs font-medium text-[#64748B]">เข้าอบรมตรงเวลา</p>
            <p className="mt-1 tabular-nums text-xl font-bold text-[#1CA388]">{stats.present} คน</p>
          </div>
        </Tooltip>
        <Tooltip className="block w-full" content="จำนวนผู้เรียนที่มาสายกว่ากำหนด">
          <div className="w-full rounded-xl bg-white p-3.5 ring-1 ring-[#EEF2F6] cursor-help">
            <p className="text-xs font-medium text-[#64748B]">มาสาย</p>
            <p className="mt-1 tabular-nums text-xl font-bold text-[#C68A12]">{stats.late} คน</p>
          </div>
        </Tooltip>
        <Tooltip className="block w-full" content="จำนวนผู้เรียนที่ขาดอบรมในรุ่นนี้">
          <div className="w-full rounded-xl bg-white p-3.5 ring-1 ring-[#EEF2F6] cursor-help">
            <p className="text-xs font-medium text-[#64748B]">ขาดอบรม</p>
            <p className="mt-1 tabular-nums text-xl font-bold text-[#DC2626]">{stats.absent} คน</p>
          </div>
        </Tooltip>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <Select
            value={selectedSessionId}
            onChange={setSelectedSessionId}
            options={sessions.map((s) => ({
              value: s.id,
              label: `${s.code} — ${s.courseTitle}`,
            }))}
            className="w-full sm:w-80"
          />
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="ค้นหาชื่อหรือรหัสพนักงาน..."
            containerClassName="w-full sm:w-60"
          />
        </div>

        <Tooltip content="เปลี่ยนสถานะผู้เรียนทุกคนในรุ่นนี้เป็น 'เข้าอบรม' พร้อมกัน">
          <Button
            variant="outline"
            leftIcon={<CheckCheck className="h-4 w-4 text-[#1CA388]" />}
            onClick={markAllPresent}
            disabled={sessionRecords.length === 0}
          >
            เช็คชื่อเข้าอบรมทั้งหมด
          </Button>
        </Tooltip>
      </div>

      {/* Table */}
      {sessionRecords.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="ยังไม่มีรายชื่อเช็คชื่อในรุ่นนี้"
          description="เลือกรุ่นฝึกอบรมที่มีรายชื่อผู้ลงทะเบียนแล้ว (เช่น SES-2569-01 หรือ SES-2569-02)"
        />
      ) : (
        <TableContainer className="rounded-xl border border-[#EEF2F6]">
          <Table>
            <TableHeader className="bg-[#F8FAFC]">
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-5">รหัส / ผู้เข้าอบรม</TableHead>
                <TableHead className="w-32 text-center">เวลาเช็คอิน</TableHead>
                <TableHead>หมายเหตุ</TableHead>
                <TableHead className="w-32 text-center">สถานะ</TableHead>
                <TableHead className="w-56 pr-5 text-center">บันทึกสถานะด่วน</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessionRecords.map((item) => {
                const st = ATTENDANCE_META[item.status];
                return (
                  <TableRow key={item.id}>
                    <TableCell className="py-3.5 pl-5">
                      <span className="rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                        {item.employeeCode}
                      </span>
                      <p className="mt-1 font-semibold text-[#1E293B]">{item.employeeName}</p>
                      <p className="text-xs text-[#94A3B8]">
                        {item.position} • {item.department}
                      </p>
                    </TableCell>
                    <TableCell className="py-3.5 text-center tabular-nums text-xs font-medium text-[#334155]">
                      {item.checkInTime}
                    </TableCell>
                    <TableCell className="py-3.5 text-xs text-[#64748B]">{item.note}</TableCell>
                    <TableCell className="py-3.5 text-center">
                      <Tooltip title={`สถานะ: ${st.label}`} content={st.hint}>
                        <Badge variant={st.variant} dot className="cursor-help">
                          {st.label}
                        </Badge>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="py-3.5 pr-5 text-center">
                      <div className="inline-flex items-center gap-1 rounded-xl bg-[#F4F6FA] p-1">
                        <Tooltip content="บันทึกว่าเข้าอบรมตรงเวลา">
                          <button
                            type="button"
                            onClick={() => setStatus(item.id, "present")}
                            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                              item.status === "present"
                                ? "bg-[#22B89A] text-white shadow-2xs"
                                : "text-[#64748B] hover:bg-white hover:text-[#1CA388]"
                            }`}
                          >
                            <UserCheck className="h-3.5 w-3.5" />
                            มา
                          </button>
                        </Tooltip>
                        <Tooltip content="บันทึกว่ามาสาย">
                          <button
                            type="button"
                            onClick={() => setStatus(item.id, "late")}
                            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                              item.status === "late"
                                ? "bg-[#F5B73B] text-white shadow-2xs"
                                : "text-[#64748B] hover:bg-white hover:text-[#C68A12]"
                            }`}
                          >
                            <Clock className="h-3.5 w-3.5" />
                            สาย
                          </button>
                        </Tooltip>
                        <Tooltip content="บันทึกว่าขาดอบรม">
                          <button
                            type="button"
                            onClick={() => setStatus(item.id, "absent")}
                            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                              item.status === "absent"
                                ? "bg-[#EF4444] text-white shadow-2xs"
                                : "text-[#64748B] hover:bg-white hover:text-[#DC2626]"
                            }`}
                          >
                            <UserX className="h-3.5 w-3.5" />
                            ขาด
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
    </div>
  );
}
