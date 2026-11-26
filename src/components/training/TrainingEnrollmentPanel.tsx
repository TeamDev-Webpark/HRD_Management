"use client";

import { useMemo, useState } from "react";
import { Check, FolderOpen, Plus, X } from "lucide-react";
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
import type {
  EnrollmentItem,
  EnrollmentStatus,
  TrainingSessionItem,
} from "@/data/mock/trainingOperations";
import { TRAINING_DEPARTMENT_OPTIONS } from "@/data/mock/trainingPlanning";

interface TrainingEnrollmentPanelProps {
  items: EnrollmentItem[];
  sessions: TrainingSessionItem[];
  onChange: (items: EnrollmentItem[]) => void;
  onNotify: (message: string) => void;
}

const PAGE_SIZE = 5;

const ENROLL_STATUS_META: Record<
  EnrollmentStatus,
  { label: string; variant: "warning" | "success" | "danger"; hint: string }
> = {
  pending: { label: "รออนุมัติ", variant: "warning", hint: "รอหัวหน้างานหรือ HRD อนุมัติสิทธิ์เข้าอบรม" },
  approved: { label: "อนุมัติแล้ว", variant: "success", hint: "ยืนยันที่นั่งแล้ว และส่งปฏิทินนัดหมายให้พนักงาน" },
  rejected: { label: "ไม่อนุมัติ", variant: "danger", hint: "ไม่ได้รับการอนุมัติเนื่องจากภาระงานหรืองบไม่ตรงกลุ่มเป้าหมาย" },
};

export function TrainingEnrollmentPanel({
  items,
  sessions,
  onChange,
  onNotify,
}: TrainingEnrollmentPanelProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | EnrollmentStatus>("all");
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [empName, setEmpName] = useState("");
  const [empCode, setEmpCode] = useState("EMP-1125");
  const [department, setDepartment] = useState("ฝ่ายวิศวกรรมซอฟต์แวร์");
  const [position, setPosition] = useState("Software Engineer");
  const [sessionId, setSessionId] = useState(sessions[0]?.id ?? "");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchStatus = statusFilter === "all" || item.status === statusFilter;
      const matchQuery =
        !q ||
        item.code.toLowerCase().includes(q) ||
        item.employeeName.toLowerCase().includes(q) ||
        item.employeeCode.toLowerCase().includes(q) ||
        item.courseTitle.toLowerCase().includes(q) ||
        item.department.toLowerCase().includes(q);
      return matchStatus && matchQuery;
    });
  }, [items, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleDecision = (id: string, nextStatus: EnrollmentStatus) => {
    const target = items.find((i) => i.id === id);
    onChange(items.map((item) => (item.id === id ? { ...item, status: nextStatus } : item)));
    if (target) {
      onNotify(
        nextStatus === "approved"
          ? `อนุมัติการลงทะเบียนของ "${target.employeeName}" เรียบร้อยแล้ว`
          : `ปฏิเสธคำขอลงทะเบียนของ "${target.employeeName}" แล้ว`
      );
    }
  };

  const handleEnroll = () => {
    if (!empName.trim()) return;
    const selectedSession = sessions.find((s) => s.id === sessionId) ?? sessions[0];
    const nextNum = String(items.length + 101).padStart(4, "0");
    const created: EnrollmentItem = {
      id: `ENR-${Date.now()}`,
      code: `ENR-69-${nextNum}`,
      employeeCode: empCode.trim() || "EMP-1125",
      employeeName: empName.trim(),
      department,
      position: position.trim() || "พนักงาน",
      sessionCode: selectedSession?.code ?? "SES-2569-01",
      courseTitle: selectedSession?.courseTitle ?? "หลักสูตรฝึกอบรม",
      sessionDate: selectedSession?.dateRange ?? "เร็วๆ นี้",
      requestDate: "วันนี้",
      approverName: "พิมพ์ชนก วัฒนากูล",
      status: "pending",
    };
    onChange([created, ...items]);
    setEmpName("");
    setPage(1);
    setModalOpen(false);
    onNotify(`ลงทะเบียนให้ "${created.employeeName}" เข้าสู่รุ่น ${created.sessionCode} แล้ว`);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <SearchBar
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="ค้นหาชื่อพนักงาน รหัส หรือหลักสูตร..."
            containerClassName="w-full sm:w-64"
          />
          <div className="inline-flex self-start rounded-xl bg-[#F4F6FA] p-1 text-xs sm:self-auto">
            {(
              [
                { key: "all", label: `ทั้งหมด (${items.length})` },
                {
                  key: "pending",
                  label: `รออนุมัติ (${items.filter((i) => i.status === "pending").length})`,
                },
                {
                  key: "approved",
                  label: `อนุมัติแล้ว (${items.filter((i) => i.status === "approved").length})`,
                },
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

        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setModalOpen(true)}>
          ลงทะเบียนพนักงาน
        </Button>
      </div>

      {/* Table */}
      {paged.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="ไม่พบรายการลงทะเบียน"
          description="ลองปรับคำค้นหาหรือตัวกรองสถานะ"
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
                  <TableHead className="pl-5">รหัส / พนักงาน</TableHead>
                  <TableHead>รุ่นอบรม / หลักสูตร</TableHead>
                  <TableHead className="w-40">ผู้อนุมัติ (HRM)</TableHead>
                  <TableHead className="w-36 text-center">สถานะ</TableHead>
                  <TableHead className="w-44 pr-5 text-center">พิจารณา</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((item) => {
                  const st = ENROLL_STATUS_META[item.status];
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
                      <TableCell className="py-3.5">
                        <p className="font-medium text-[#1E293B]">{item.courseTitle}</p>
                        <p className="text-xs text-[#94A3B8]">
                          {item.sessionCode} • {item.sessionDate}
                        </p>
                      </TableCell>
                      <TableCell className="py-3.5">
                        <p className="text-xs font-medium text-[#1E293B]">{item.approverName}</p>
                        <p className="text-[11px] text-[#94A3B8]">ยื่นเมื่อ {item.requestDate}</p>
                      </TableCell>
                      <TableCell className="py-3.5 text-center">
                        <Tooltip title={`สถานะ: ${st.label}`} content={st.hint}>
                          <Badge variant={st.variant} dot className="cursor-help">
                            {st.label}
                          </Badge>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="py-3.5 pr-5 text-center">
                        {item.status === "pending" ? (
                          <div className="inline-flex items-center gap-1.5">
                            <Tooltip content="ไม่อนุมัติคำขอลงทะเบียนนี้">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDecision(item.id, "rejected")}
                                leftIcon={<X className="h-3.5 w-3.5" />}
                              >
                                ปฏิเสธ
                              </Button>
                            </Tooltip>
                            <Tooltip content="อนุมัติและยืนยันที่นั่งอบรม">
                              <Button
                                size="sm"
                                variant="primary"
                                onClick={() => handleDecision(item.id, "approved")}
                                leftIcon={<Check className="h-3.5 w-3.5" />}
                              >
                                อนุมัติ
                              </Button>
                            </Tooltip>
                          </div>
                        ) : (
                          <span className="text-xs text-[#94A3B8]">พิจารณาแล้ว</span>
                        )}
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

      {/* Enroll Employee Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="ลงทะเบียนพนักงานเข้าอบรม"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              ยกเลิก
            </Button>
            <Button disabled={!empName.trim()} onClick={handleEnroll}>
              ยืนยันลงทะเบียน
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input
              label="รหัสพนักงาน (HRM)"
              value={empCode}
              onChange={(e) => setEmpCode(e.target.value)}
            />
            <div className="sm:col-span-2">
              <Input
                label="ชื่อ–นามสกุลพนักงาน"
                placeholder="เช่น วิชญ์พล รุ่งเรือง"
                value={empName}
                onChange={(e) => setEmpName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="แผนก"
              value={department}
              onChange={setDepartment}
              options={TRAINING_DEPARTMENT_OPTIONS.filter((o) => o.value !== "all")}
            />
            <Input
              label="ตำแหน่ง"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
          </div>
          <Select
            label="เลือกรุ่นฝึกอบรม"
            value={sessionId}
            onChange={setSessionId}
            options={sessions.map((s) => ({
              value: s.id,
              label: `${s.code} — ${s.courseTitle} (${s.dateRange})`,
            }))}
          />
        </div>
      </Modal>
    </div>
  );
}
