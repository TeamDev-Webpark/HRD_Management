"use client";

import { Bell, CheckCircle2, Star, ThumbsDown, ThumbsUp } from "lucide-react";
import {
  Badge,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
} from "@/components/ui";
import type { MssTeamMember, MssTrainingApprovalItem } from "@/data/mock/mssData";

export function MssTrainingApprovalsPanel({
  items,
  onChange,
  onNotify,
}: {
  items: MssTrainingApprovalItem[];
  onChange: (items: MssTrainingApprovalItem[]) => void;
  onNotify: (msg: string) => void;
}) {
  const handleDecision = (
    item: MssTrainingApprovalItem,
    decision: "approved" | "rejected"
  ) => {
    onChange(items.map((r) => (r.id === item.id ? { ...r, status: decision } : r)));
    onNotify(
      decision === "approved"
        ? `อนุมัติคำขออบรม "${item.courseName}" ให้ ${item.employeeName} เรียบร้อยแล้ว`
        : `ไม่อนุมัติคำขออบรม "${item.courseName}" ของ ${item.employeeName}`
    );
  };

  return (
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[22%]">รหัส / พนักงาน</TableHead>
            <TableHead className="w-[30%]">หลักสูตรและเหตุผลการขออบรม</TableHead>
            <TableHead className="w-[14%] text-right">งบประมาณ</TableHead>
            <TableHead className="w-[14%] text-center">สถานะ</TableHead>
            <TableHead className="w-[20%] text-center">พิจารณา</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <span className="inline-block rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                  {item.code}
                </span>
                <div className="mt-1 font-semibold text-[#1E293B]">{item.employeeName}</div>
                <div className="text-xs text-[#64748B]">{item.dateRange}</div>
              </TableCell>
              <TableCell>
                <div className="font-semibold text-[#1E293B]">{item.courseName}</div>
                <div className="mt-0.5 text-xs text-[#64748B]">{item.reason}</div>
              </TableCell>
              <TableCell className="text-right font-semibold text-[#1E293B]">
                ฿{item.cost.toLocaleString("th-TH")}
              </TableCell>
              <TableCell className="text-center">
                <Tooltip
                  content={
                    item.status === "pending"
                      ? "รอหัวหน้างานพิจารณาอนุมัติงบประมาณและเวลาอบรม"
                      : item.status === "approved"
                        ? "อนุมัติคำขอแล้ว ส่งต่อฝ่าย HRD ลงทะเบียนจริง"
                        : "ไม่อนุมัติคำขอในรอบนี้"
                  }
                >
                  <Badge
                    variant={
                      item.status === "approved"
                        ? "success"
                        : item.status === "rejected"
                          ? "danger"
                          : "warning"
                    }
                    dot
                  >
                    {item.status === "approved"
                      ? "อนุมัติแล้ว"
                      : item.status === "rejected"
                        ? "ไม่อนุมัติ"
                        : "รออนุมัติ"}
                  </Badge>
                </Tooltip>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-1.5">
                  {item.status === "pending" ? (
                    <>
                      <Tooltip content="อนุมัติคำขอลงทะเบียนอบรมนี้">
                        <Button
                          size="sm"
                          variant="primary"
                          leftIcon={<ThumbsUp className="h-3.5 w-3.5" />}
                          onClick={() => handleDecision(item, "approved")}
                        >
                          อนุมัติ
                        </Button>
                      </Tooltip>
                      <Tooltip content="ไม่อนุมัติคำขอลงทะเบียนอบรมนี้">
                        <Button
                          size="sm"
                          variant="outline"
                          leftIcon={<ThumbsDown className="h-3.5 w-3.5" />}
                          onClick={() => handleDecision(item, "rejected")}
                        >
                          ปฏิเสธ
                        </Button>
                      </Tooltip>
                    </>
                  ) : (
                    <span className="text-xs font-medium text-[#64748B]">ดำเนินการแล้ว</span>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function MssTeamLmsPanel({
  team,
  onNotify,
}: {
  team: MssTeamMember[];
  onNotify: (msg: string) => void;
}) {
  return (
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[28%]">รหัส / สมาชิกในทีม</TableHead>
            <TableHead className="w-[28%]">ความคืบหน้าคอร์ส LMS บังคับ</TableHead>
            <TableHead className="w-[20%] text-center">สถานะการเรียน</TableHead>
            <TableHead className="w-[24%] text-center">ติดตามผล</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {team.map((m) => (
            <TableRow key={m.id}>
              <TableCell>
                <span className="inline-block rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                  {m.employeeCode}
                </span>
                <div className="mt-1 font-semibold text-[#1E293B]">{m.name}</div>
                <div className="text-xs text-[#64748B]">{m.position}</div>
              </TableCell>
              <TableCell>
                <Tooltip className="block w-full" content={`เรียนจบคอร์สออนไลน์แล้ว ${m.lmsProgress}%`}>
                  <div className="space-y-1.5">
                    <div className="text-right text-xs font-semibold text-[#1E293B]">
                      {m.lmsProgress}%
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#EEF2F6]">
                      <div
                        className={`h-full rounded-full ${
                          m.lmsProgress >= 90
                            ? "bg-emerald-500"
                            : m.lmsProgress < 70
                              ? "bg-amber-500"
                              : "bg-[#2563EB]"
                        }`}
                        style={{ width: `${m.lmsProgress}%` }}
                      />
                    </div>
                  </div>
                </Tooltip>
              </TableCell>
              <TableCell className="text-center">
                <Tooltip
                  content={
                    m.lmsProgress === 100
                      ? "เรียนจบครบทุกคอร์สบังคับแล้ว"
                      : m.lmsProgress >= 80
                        ? "ใกล้ครบตามเกณฑ์ที่กำหนด"
                        : "ความคืบหน้ายังต่ำกว่าเกณฑ์ ควรแจ้งเตือนให้เร่งเรียน"
                  }
                >
                  <Badge
                    variant={
                      m.lmsProgress === 100
                        ? "success"
                        : m.lmsProgress >= 80
                          ? "primary"
                          : "warning"
                    }
                    dot
                  >
                    {m.lmsProgress === 100
                      ? "เรียนครบแล้ว"
                      : m.lmsProgress >= 80
                        ? "ตามแผน"
                        : "ควรเร่งเรียน"}
                  </Badge>
                </Tooltip>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center">
                  {m.lmsProgress < 100 ? (
                    <Tooltip content={`ส่งข้อความแจ้งเตือนการเรียน LMS ไปยัง ${m.name}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        leftIcon={<Bell className="h-3.5 w-3.5" />}
                        onClick={() =>
                          onNotify(`ส่งการแจ้งเตือนเรียนคอร์ส LMS ให้ ${m.name} เรียบร้อยแล้ว`)
                        }
                        className="w-[116px] justify-center"
                      >
                        ส่งแจ้งเตือน
                      </Button>
                    </Tooltip>
                  ) : (
                    <span className="inline-flex w-[116px] items-center justify-center gap-1 text-xs font-medium text-emerald-600">
                      <CheckCircle2 className="h-3.5 w-3.5" /> ครบถ้วน
                    </span>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function MssTeamTalentPanel({
  team,
  onChange,
  onNotify,
}: {
  team: MssTeamMember[];
  onChange: (team: MssTeamMember[]) => void;
  onNotify: (msg: string) => void;
}) {
  const handleNominate = (m: MssTeamMember) => {
    onChange(team.map((row) => (row.id === m.id ? { ...row, talentNominated: true } : row)));
    onNotify(`เสนอชื่อ ${m.name} เข้าสู่ Talent Pool / Succession Pipeline แล้ว`);
  };

  return (
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[28%]">รหัส / สมาชิกในทีม</TableHead>
            <TableHead className="w-[16%] text-center">KPI / ทักษะ</TableHead>
            <TableHead className="w-[24%] text-center">สถานะการเสนอชื่อ Talent</TableHead>
            <TableHead className="w-[32%] text-center">ดำเนินการ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {team.map((m) => (
            <TableRow key={m.id}>
              <TableCell>
                <span className="inline-block rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                  {m.employeeCode}
                </span>
                <div className="mt-1 font-semibold text-[#1E293B]">{m.name}</div>
                <div className="text-xs text-[#64748B]">
                  {m.position} • {m.jobGrade}
                </div>
              </TableCell>
              <TableCell className="text-center text-xs font-semibold text-[#334155]">
                <Tooltip content={`KPI ${m.kpiProgress}% และความพร้อมทักษะ ${m.skillReadiness}%`}>
                  <span className="cursor-help">
                    KPI {m.kpiProgress}% • ทักษะ {m.skillReadiness}%
                  </span>
                </Tooltip>
              </TableCell>
              <TableCell className="text-center">
                <Tooltip
                  content={
                    m.talentNominated
                      ? "ถูกเสนอชื่อเข้า Talent Pool ขององค์กรแล้ว"
                      : "สามารถเสนอชื่อเข้า Talent Review รอบถัดไปได้"
                  }
                >
                  <Badge variant={m.talentNominated ? "success" : "neutral"} dot>
                    {m.talentNominated ? "เสนอชื่อเข้า Pool แล้ว" : "ยังไม่ได้เสนอชื่อ"}
                  </Badge>
                </Tooltip>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center">
                  {!m.talentNominated ? (
                    <Tooltip content="เสนอชื่อลูกทีมที่มีผลงานโดดเด่นเข้าสู่ Talent Pool ขององค์กร">
                      <Button
                        size="sm"
                        variant="primary"
                        leftIcon={<Star className="h-3.5 w-3.5" />}
                        onClick={() => handleNominate(m)}
                        className="w-[152px] justify-center"
                      >
                        เสนอชื่อเข้า Pool
                      </Button>
                    </Tooltip>
                  ) : (
                    <span className="inline-flex w-[152px] items-center justify-center gap-1 text-xs font-medium text-emerald-600">
                      <CheckCircle2 className="h-3.5 w-3.5" /> เสนอชื่อแล้ว
                    </span>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
