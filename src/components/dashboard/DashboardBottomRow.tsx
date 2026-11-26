"use client";

import { useState } from "react";
import { Calendar, Check, MapPin, RotateCcw, User, Users } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  InfoHint,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
} from "@/components/ui";
import { TALENT_SPOTLIGHT_LIST } from "@/data/mock/dashboardCharts";
import {
  INITIAL_PENDING_APPROVALS,
  TALENT_POOL_DATA,
  UPCOMING_TRAININGS,
  type PendingApprovalItem,
  type UpcomingTrainingItem,
} from "@/data/mock/dashboardOverview";

interface DashboardBottomRowProps {
  department: string;
}

const MODE_BADGE = {
  Onsite: { variant: "primary" as const, hint: "อบรมแบบพบหน้า ณ ห้องฝึกอบรมของบริษัท" },
  Online: { variant: "success" as const, hint: "เรียนสดผ่านระบบออนไลน์ / LMS Live Classroom" },
  Hybrid: { variant: "warning" as const, hint: "รองรับทั้งเข้าห้องอบรมจริงและเข้าร่วมออนไลน์พร้อมกัน" },
};

export function DashboardBottomRow({ department }: DashboardBottomRowProps) {
  const [leftTab, setLeftTab] = useState<"training" | "approvals">("training");
  const [approvals, setApprovals] = useState<PendingApprovalItem[]>(INITIAL_PENDING_APPROVALS);
  const [selectedTraining, setSelectedTraining] = useState<UpcomingTrainingItem | null>(null);

  const visibleTrainings =
    department === "all"
      ? UPCOMING_TRAININGS
      : UPCOMING_TRAININGS.filter(
          (item) => item.departmentKey === department || item.departmentKey === "all"
        );

  const visibleApprovals =
    department === "all"
      ? approvals
      : approvals.filter((item) => item.departmentKey === department);

  const pendingCount = visibleApprovals.filter((item) => item.status === "pending").length;

  const visibleTalents =
    department === "all"
      ? TALENT_SPOTLIGHT_LIST
      : TALENT_SPOTLIGHT_LIST.filter((t) => t.departmentKey === department);

  const handleDecision = (id: string, decision: "approved" | "returned") => {
    setApprovals((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: decision } : item))
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* Left 8 cols: Minimal Tabbed Table */}
        <Card className="xl:col-span-8">
          <CardContent className="p-5">
            <div className="mb-3 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-semibold text-[#1E293B]">
                  {leftTab === "training" ? "รอบฝึกอบรมที่กำลังจะมาถึง" : "รายการรออนุมัติ (HRD)"}
                </h3>
                <InfoHint
                  content={
                    leftTab === "training"
                      ? "คลิกแถวเพื่อดูสถานที่และวิทยากร"
                      : "ทดลองกดอนุมัติหรือส่งกลับแก้ไขได้ทันที"
                  }
                />
              </div>

              <div className="inline-flex self-start rounded-xl bg-[#F4F6FA] p-1">
                <button
                  type="button"
                  onClick={() => setLeftTab("training")}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                    leftTab === "training"
                      ? "bg-white text-[#1E293B] shadow-xs"
                      : "text-[#94A3B8] hover:text-[#64748B]"
                  }`}
                >
                  รอบอบรม ({visibleTrainings.length})
                </button>
                <button
                  type="button"
                  onClick={() => setLeftTab("approvals")}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                    leftTab === "approvals"
                      ? "bg-white text-[#1E293B] shadow-xs"
                      : "text-[#94A3B8] hover:text-[#64748B]"
                  }`}
                >
                  รออนุมัติ
                  {pendingCount > 0 && (
                    <span className="rounded-full bg-[#2563EB] px-1.5 py-0.2 text-[10px] font-semibold text-white">
                      {pendingCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {leftTab === "training" ? (
              <TableContainer>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>รหัส</TableHead>
                      <TableHead>ชื่อหลักสูตร</TableHead>
                      <TableHead>วันที่อบรม</TableHead>
                      <TableHead>รูปแบบ</TableHead>
                      <TableHead className="text-right">ผู้ลงทะเบียน</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visibleTrainings.map((session) => {
                      const modeInfo = MODE_BADGE[session.mode];
                      const seatsLeft = session.capacity - session.enrolled;

                      return (
                        <TableRow
                          key={session.id}
                          onClick={() => setSelectedTraining(session)}
                          className="cursor-pointer"
                        >
                          <TableCell className="font-mono text-sm font-semibold text-[#2563EB]">
                            #{session.code.replace("TRN-2026-", "")}
                          </TableCell>
                          <TableCell>
                            <Tooltip
                              title={session.title}
                              content={`วิทยากร: ${session.trainer} • คลิกที่แถวเพื่อดูรายละเอียดสถานที่และเวลา`}
                            >
                              <div>
                                <p className="font-medium text-[#1E293B]">{session.title}</p>
                                <p className="text-xs text-[#94A3B8]">{session.category}</p>
                              </div>
                            </Tooltip>
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-sm text-[#64748B]">
                            {session.dateLabel}
                          </TableCell>
                          <TableCell>
                            <Tooltip title={`รูปแบบ ${session.mode}`} content={modeInfo.hint}>
                              <Badge variant={modeInfo.variant}>{session.mode}</Badge>
                            </Tooltip>
                          </TableCell>
                          <TableCell className="text-right tabular-nums font-semibold text-[#2563EB]">
                            <Tooltip
                              title="สถานะที่นั่งอบรม"
                              content={`ลงทะเบียนแล้ว ${session.enrolled} คน จากทั้งหมด ${session.capacity} ที่นั่ง (ว่างอีก ${seatsLeft} ที่นั่ง)`}
                            >
                              <span>
                                {session.enrolled}/{session.capacity}
                              </span>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <TableContainer>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>ประเภท</TableHead>
                      <TableHead>รายการคำขอ</TableHead>
                      <TableHead>ผู้ยื่นคำขอ</TableHead>
                      <TableHead className="text-right">การดำเนินการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visibleApprovals.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Badge variant="neutral">{item.typeLabel}</Badge>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium text-[#1E293B]">{item.title}</p>
                          <p className="text-xs text-[#94A3B8]">
                            {item.department} • {item.submittedAt}
                          </p>
                        </TableCell>
                        <TableCell className="text-sm text-[#64748B]">{item.requester}</TableCell>
                        <TableCell className="text-right">
                          {item.status === "pending" ? (
                            <div className="inline-flex items-center gap-1.5">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDecision(item.id, "returned")}
                                leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
                              >
                                ส่งกลับ
                              </Button>
                              <Button
                                size="sm"
                                variant="primary"
                                onClick={() => handleDecision(item.id, "approved")}
                                leftIcon={<Check className="h-3.5 w-3.5" />}
                              >
                                อนุมัติ
                              </Button>
                            </div>
                          ) : item.status === "approved" ? (
                            <Badge variant="success" dot>
                              อนุมัติแล้ว
                            </Badge>
                          ) : (
                            <Badge variant="danger" dot>
                              ส่งกลับแล้ว
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>

        {/* Right 4 cols: Compact Talent Pool Spotlight */}
        <Card className="xl:col-span-4">
          <CardContent className="p-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-semibold text-[#1E293B]">Talent Pool</h3>
                  <InfoHint content="บุคลากรศักยภาพสูงจาก 9-Box Grid เตรียมสืบทอดตำแหน่ง" />
                </div>
                <p className="text-xs text-[#94A3B8]">
                  ทั้งหมด {TALENT_POOL_DATA.totalTalents} คน • Ready Now{" "}
                  {TALENT_POOL_DATA.readyNowSuccessors} คน
                </p>
              </div>
              <Tooltip
                content={`มีผู้สืบทอดแล้ว ${TALENT_POOL_DATA.keyPositionsCovered}/${TALENT_POOL_DATA.keyPositionsTotal} ตำแหน่งสำคัญ`}
              >
                <Badge variant="primary" className="cursor-help">
                  {TALENT_POOL_DATA.keyPositionsCovered}/{TALENT_POOL_DATA.keyPositionsTotal} ตำแหน่ง
                </Badge>
              </Tooltip>
            </div>

            <div className="divide-y divide-[#F1F5F9]">
              {visibleTalents.map((person) => (
                <div
                  key={person.id}
                  className="flex items-center justify-between gap-3 py-2.5 first:pt-1 last:pb-0"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${person.avatarBg} ${person.avatarText}`}
                    >
                      {person.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#1E293B]">{person.name}</p>
                      <p className="truncate text-xs text-[#94A3B8]">{person.role}</p>
                    </div>
                  </div>
                  <Tooltip
                    content={
                      person.isReadyNow
                        ? "พร้อมรับตำแหน่งสำคัญทันที (0–6 เดือน)"
                        : "อยู่ระหว่างพัฒนา พร้อมใน 1–2 ปี"
                    }
                  >
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold cursor-help ${
                        person.isReadyNow
                          ? "bg-[#ECFAF5] text-[#1CA388]"
                          : "bg-[#F3F0FF] text-[#7C6CF6]"
                      }`}
                    >
                      {person.code}
                    </span>
                  </Tooltip>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Training Session Detail Modal */}
      <Modal
        open={Boolean(selectedTraining)}
        onClose={() => setSelectedTraining(null)}
        title={selectedTraining?.title ?? ""}
        description={
          selectedTraining ? `${selectedTraining.code} • ${selectedTraining.category}` : undefined
        }
        footer={
          <Button variant="primary" onClick={() => setSelectedTraining(null)}>
            ปิดหน้าต่าง
          </Button>
        }
      >
        {selectedTraining && (
          <div className="space-y-4 text-[15px]">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={MODE_BADGE[selectedTraining.mode].variant}>
                {selectedTraining.mode}
              </Badge>
              <Badge variant="neutral">{selectedTraining.category}</Badge>
            </div>

            <div className="space-y-3 rounded-xl bg-[#F7F9FC] p-4 text-sm">
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#2563EB]" />
                <div>
                  <p className="font-medium text-[#1E293B]">วันที่และเวลา</p>
                  <p className="text-[#64748B]">
                    {selectedTraining.dateLabel} เวลา {selectedTraining.timeLabel}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#2563EB]" />
                <div>
                  <p className="font-medium text-[#1E293B]">สถานที่ / ช่องทางอบรม</p>
                  <p className="text-[#64748B]">{selectedTraining.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#2563EB]" />
                <div>
                  <p className="font-medium text-[#1E293B]">วิทยากร</p>
                  <p className="text-[#64748B]">{selectedTraining.trainer}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#2563EB]" />
                <div>
                  <p className="font-medium text-[#1E293B]">จำนวนผู้ลงทะเบียน</p>
                  <p className="text-[#64748B]">
                    {selectedTraining.enrolled} จาก {selectedTraining.capacity} ที่นั่ง
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
