"use client";

import { useState } from "react";
import { CheckCircle2, ClipboardCheck, Pencil, ThumbsUp } from "lucide-react";
import {
  Badge,
  Button,
  Input,
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
import type { MssTeamMember } from "@/data/mock/mssData";

export function MssTeamOverviewPanel({ team }: { team: MssTeamMember[] }) {
  return (
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[26%]">รหัส / สมาชิกในทีม</TableHead>
            <TableHead className="w-[18%]">ความคืบหน้า KPI</TableHead>
            <TableHead className="w-[14%] text-center">ความพร้อมทักษะ</TableHead>
            <TableHead className="w-[14%] text-center">แผน IDP</TableHead>
            <TableHead className="w-[14%] text-center">ชั่วโมงอบรม</TableHead>
            <TableHead className="w-[14%] text-center">สถานะ Talent</TableHead>
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
              <TableCell>
                <Tooltip className="block w-full" content={`ความคืบหน้า KPI รวม ${m.kpiProgress}%`}>
                  <div className="space-y-1.5">
                    <div className="text-right text-xs font-semibold text-[#1E293B]">
                      {m.kpiProgress}%
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#EEF2F6]">
                      <div
                        className={`h-full rounded-full ${
                          m.kpiProgress >= 85 ? "bg-emerald-500" : "bg-[#2563EB]"
                        }`}
                        style={{ width: `${m.kpiProgress}%` }}
                      />
                    </div>
                  </div>
                </Tooltip>
              </TableCell>
              <TableCell className="text-center">
                <Tooltip content={`ผ่านเกณฑ์สมรรถนะประจำตำแหน่งแล้ว ${m.skillReadiness}%`}>
                  <Badge variant={m.skillReadiness >= 85 ? "success" : "primary"}>
                    {m.skillReadiness}%
                  </Badge>
                </Tooltip>
              </TableCell>
              <TableCell className="text-center">
                <Tooltip content={`ความคืบหน้าแผนพัฒนา IDP ${m.idpProgress}%`}>
                  <Badge variant={m.idpProgress === 100 ? "success" : "neutral"}>
                    {m.idpProgress}%
                  </Badge>
                </Tooltip>
              </TableCell>
              <TableCell className="text-center">
                <Tooltip content={`สะสมชั่วโมงอบรม ${m.trainingHours} จากเกณฑ์ 30 ชม./ปี`}>
                  <span className="cursor-help text-xs font-semibold text-[#334155]">
                    {m.trainingHours} / 30 ชม.
                  </span>
                </Tooltip>
              </TableCell>
              <TableCell className="text-center">
                <Tooltip
                  content={
                    m.talentNominated
                      ? "ได้รับการเสนอชื่อเข้ากลุ่ม Talent Pool แล้ว"
                      : "ยังไม่ได้เสนอชื่อเข้า Talent Pool"
                  }
                >
                  <Badge variant={m.talentNominated ? "primary" : "neutral"} dot>
                    {m.talentNominated ? "ใน Talent Pool" : "ทั่วไป"}
                  </Badge>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function MssTeamPerformancePanel({
  team,
  onChange,
  onNotify,
}: {
  team: MssTeamMember[];
  onChange: (team: MssTeamMember[]) => void;
  onNotify: (msg: string) => void;
}) {
  const [selected, setSelected] = useState<MssTeamMember | null>(null);
  const [score, setScore] = useState("4.5");

  const openRate = (m: MssTeamMember) => {
    setSelected(m);
    setScore(String(m.managerScore ?? m.selfScore));
  };

  const handleSave = () => {
    if (!selected) return;
    const val = Math.min(5, Math.max(1, Number(score) || 4));
    onChange(team.map((m) => (m.id === selected.id ? { ...m, managerScore: val } : m)));
    onNotify(`บันทึกคะแนนประเมินหัวหน้างานให้ ${selected.name} (${val.toFixed(1)}/5.0) แล้ว`);
    setSelected(null);
  };

  return (
    <div className="space-y-4">
      <TableContainer>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[26%]">รหัส / พนักงานในทีม</TableHead>
              <TableHead className="w-[16%]">ความคืบหน้า KPI</TableHead>
              <TableHead className="w-[14%] text-center">ประเมินตนเอง</TableHead>
              <TableHead className="w-[16%] text-center">คะแนนหัวหน้างาน</TableHead>
              <TableHead className="w-[14%] text-center">สถานะ</TableHead>
              <TableHead className="w-[14%] text-center">จัดการ</TableHead>
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
                  <Tooltip className="block w-full" content={`KPI บรรลุแล้ว ${m.kpiProgress}%`}>
                    <div className="space-y-1.5">
                      <div className="text-right text-xs font-semibold text-[#1E293B]">
                        {m.kpiProgress}%
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-[#EEF2F6]">
                        <div
                          className="h-full rounded-full bg-[#2563EB]"
                          style={{ width: `${m.kpiProgress}%` }}
                        />
                      </div>
                    </div>
                  </Tooltip>
                </TableCell>
                <TableCell className="text-center font-semibold text-[#475569]">
                  {m.selfScore.toFixed(1)} / 5.0
                </TableCell>
                <TableCell className="text-center font-bold text-[#2563EB]">
                  {m.managerScore !== null ? `${m.managerScore.toFixed(1)} / 5.0` : "—"}
                </TableCell>
                <TableCell className="text-center">
                  <Tooltip
                    content={
                      m.managerScore !== null
                        ? "หัวหน้างานบันทึกคะแนนประเมินเรียบร้อยแล้ว"
                        : "รอหัวหน้างานประเมินและยืนยันคะแนน"
                    }
                  >
                    <Badge variant={m.managerScore !== null ? "success" : "warning"} dot>
                      {m.managerScore !== null ? "ประเมินแล้ว" : "รอประเมิน"}
                    </Badge>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center">
                    <Tooltip content="บันทึกหรือปรับคะแนนประเมินผลงานของลูกทีม">
                      <Button
                        size="sm"
                        variant={m.managerScore === null ? "primary" : "outline"}
                        leftIcon={
                          m.managerScore === null ? (
                            <ClipboardCheck className="h-3.5 w-3.5" />
                          ) : (
                            <Pencil className="h-3.5 w-3.5" />
                          )
                        }
                        onClick={() => openRate(m)}
                        className="w-[104px] justify-center"
                      >
                        {m.managerScore === null ? "ประเมิน" : "ปรับคะแนน"}
                      </Button>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title="บันทึกคะแนนประเมินหัวหน้างาน (Manager Review)"
        description={selected ? `${selected.name} (${selected.position})` : undefined}
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setSelected(null)}>
              ยกเลิก
            </Button>
            <Button
              variant="primary"
              leftIcon={<CheckCircle2 className="h-4 w-4" />}
              onClick={handleSave}
            >
              บันทึกคะแนน
            </Button>
          </>
        }
      >
        <Input
          label="คะแนนประเมินโดยหัวหน้างาน (เต็ม 5.0)"
          type="number"
          step="0.1"
          min={1}
          max={5}
          value={score}
          onChange={(e) => setScore(e.target.value)}
        />
      </Modal>
    </div>
  );
}

export function MssTeamCompetencyPanel({
  team,
  onChange,
  onNotify,
}: {
  team: MssTeamMember[];
  onChange: (team: MssTeamMember[]) => void;
  onNotify: (msg: string) => void;
}) {
  const handleBoost = (m: MssTeamMember) => {
    const next = Math.min(100, m.skillReadiness + 5);
    onChange(team.map((row) => (row.id === m.id ? { ...row, skillReadiness: next } : row)));
    onNotify(`อัปเดตผลประเมินความพร้อมทักษะของ ${m.name} เป็น ${next}% แล้ว`);
  };

  return (
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[28%]">รหัส / พนักงานในทีม</TableHead>
            <TableHead className="w-[26%]">ความพร้อมทักษะประจำตำแหน่ง</TableHead>
            <TableHead className="w-[22%] text-center">ระดับความพร้อม</TableHead>
            <TableHead className="w-[24%] text-center">จัดการ</TableHead>
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
                <Tooltip className="block w-full" content={`ความพร้อมสมรรถนะรวม ${m.skillReadiness}%`}>
                  <div className="space-y-1.5">
                    <div className="text-right text-xs font-semibold text-[#1E293B]">
                      {m.skillReadiness}%
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#EEF2F6]">
                      <div
                        className={`h-full rounded-full ${
                          m.skillReadiness >= 85 ? "bg-emerald-500" : "bg-[#2563EB]"
                        }`}
                        style={{ width: `${m.skillReadiness}%` }}
                      />
                    </div>
                  </div>
                </Tooltip>
              </TableCell>
              <TableCell className="text-center">
                <Tooltip
                  content={
                    m.skillReadiness >= 85
                      ? "ผ่านเกณฑ์สมรรถนะหลักครบถ้วน"
                      : "ยังมีทักษะบางรายการที่ต้องพัฒนาต่อ"
                  }
                >
                  <Badge variant={m.skillReadiness >= 85 ? "success" : "warning"} dot>
                    {m.skillReadiness >= 85 ? "ผ่านเกณฑ์" : "กำลังปิด Gap"}
                  </Badge>
                </Tooltip>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center">
                  <Tooltip content="บันทึกผลการประเมินทักษะรอบใหม่ (+5% Demo)">
                    <Button
                      size="sm"
                      variant="outline"
                      leftIcon={<ClipboardCheck className="h-3.5 w-3.5" />}
                      onClick={() => handleBoost(m)}
                      className="w-[120px] justify-center"
                    >
                      อัปเดตทักษะ
                    </Button>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function MssTeamIdpPanel({
  team,
  onChange,
  onNotify,
}: {
  team: MssTeamMember[];
  onChange: (team: MssTeamMember[]) => void;
  onNotify: (msg: string) => void;
}) {
  const handleApproveIdp = (m: MssTeamMember) => {
    onChange(
      team.map((row) => (row.id === m.id ? { ...row, idpStatus: "approved" } : row))
    );
    onNotify(`อนุมัติแผนพัฒนา IDP ของ ${m.name} เรียบร้อยแล้ว`);
  };

  return (
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[28%]">รหัส / พนักงานในทีม</TableHead>
            <TableHead className="w-[26%]">ความคืบหน้าแผน IDP</TableHead>
            <TableHead className="w-[22%] text-center">สถานะแผน IDP</TableHead>
            <TableHead className="w-[24%] text-center">อนุมัติแผน</TableHead>
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
                <Tooltip className="block w-full" content={`ความคืบหน้าแผน IDP ${m.idpProgress}%`}>
                  <div className="space-y-1.5">
                    <div className="text-right text-xs font-semibold text-[#1E293B]">
                      {m.idpProgress}%
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#EEF2F6]">
                      <div
                        className={`h-full rounded-full ${
                          m.idpProgress === 100 ? "bg-emerald-500" : "bg-[#2563EB]"
                        }`}
                        style={{ width: `${m.idpProgress}%` }}
                      />
                    </div>
                  </div>
                </Tooltip>
              </TableCell>
              <TableCell className="text-center">
                <Tooltip
                  content={
                    m.idpStatus === "pending"
                      ? "พนักงานส่งแผน IDP แล้ว รอหัวหน้างานพิจารณาอนุมัติ"
                      : m.idpStatus === "completed"
                        ? "ดำเนินกิจกรรมตามแผน IDP ครบ 100% แล้ว"
                        : "อนุมัติแผนแล้ว อยู่ระหว่างติดตามความคืบหน้า"
                  }
                >
                  <Badge
                    variant={
                      m.idpStatus === "completed"
                        ? "success"
                        : m.idpStatus === "approved"
                          ? "primary"
                          : "warning"
                    }
                    dot
                  >
                    {m.idpStatus === "completed"
                      ? "สำเร็จตามแผน"
                      : m.idpStatus === "approved"
                        ? "อนุมัติแล้ว"
                        : "รออนุมัติแผน"}
                  </Badge>
                </Tooltip>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center">
                  {m.idpStatus === "pending" ? (
                    <Tooltip content="อนุมัติแผนพัฒนา IDP ให้ลูกทีมเริ่มดำเนินการ">
                      <Button
                        size="sm"
                        variant="primary"
                        leftIcon={<ThumbsUp className="h-3.5 w-3.5" />}
                        onClick={() => handleApproveIdp(m)}
                        className="w-[104px] justify-center"
                      >
                        อนุมัติแผน
                      </Button>
                    </Tooltip>
                  ) : (
                    <span className="inline-flex w-[104px] items-center justify-center text-xs font-medium text-emerald-600">
                      อนุมัติแล้ว
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
