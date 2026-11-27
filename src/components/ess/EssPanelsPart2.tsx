"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Award,
  CheckCircle2,
  ExternalLink,
  Eye,
  GraduationCap,
  PlayCircle,
  Trophy,
} from "lucide-react";
import {
  Badge,
  Button,
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
import {
  ESS_EMPLOYEE_PROFILE,
  type EssCertificateItem,
  type EssLmsCourseItem,
  type EssTrainingItem,
} from "@/data/mock/essData";

export function EssTrainingPanel({
  items,
  onEnroll,
}: {
  items: EssTrainingItem[];
  onEnroll: (trainingId: string, courseName: string) => void;
}) {
  const handleEnroll = (item: EssTrainingItem) => {
    onEnroll(item.id, item.courseName);
  };

  return (
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[34%]">รหัส / รุ่นฝึกอบรมที่เปิดรับสมัคร</TableHead>
            <TableHead className="w-[14%] text-center">รูปแบบ</TableHead>
            <TableHead className="w-[16%] text-center">วันที่อบรม / ชั่วโมง</TableHead>
            <TableHead className="w-[12%] text-center">ที่นั่งคงเหลือ</TableHead>
            <TableHead className="w-[12%] text-center">สถานะ</TableHead>
            <TableHead className="w-[12%] text-center">จัดการ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <span className="inline-block rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                  {item.code}
                </span>
                <div className="mt-1 font-semibold text-[#1E293B]">{item.courseName}</div>
              </TableCell>
              <TableCell className="text-center">
                <Tooltip
                  content={
                    item.format === "Classroom"
                      ? "อบรมแบบห้องเรียน ณ สถานที่จัดอบรมขององค์กร"
                      : "อบรมออนไลน์แบบสดผ่านระบบ Video Conference"
                  }
                >
                  <Badge variant={item.format === "Classroom" ? "primary" : "success"}>
                    {item.format}
                  </Badge>
                </Tooltip>
              </TableCell>
              <TableCell className="text-center text-xs">
                <div className="font-semibold text-[#1E293B]">{item.dateRange}</div>
                <div className="text-[#94A3B8]">{item.hours} ชั่วโมง</div>
              </TableCell>
              <TableCell className="text-center font-semibold text-[#334155]">
                {item.seatsLeft} ที่นั่ง
              </TableCell>
              <TableCell className="text-center">
                {item.enrolled ? (
                  <Tooltip
                    content={
                      item.approvalStatus === "approved"
                        ? "หัวหน้างานอนุมัติคำขอลงทะเบียนอบรมเรียบร้อยแล้ว"
                        : "ส่งคำขอแล้ว อยู่ระหว่างรอหัวหน้างานพิจารณาอนุมัติ"
                    }
                  >
                    <Badge variant={item.approvalStatus === "approved" ? "success" : "warning"} dot>
                      {item.approvalStatus === "approved" ? "อนุมัติแล้ว" : "รออนุมัติ"}
                    </Badge>
                  </Tooltip>
                ) : (
                  <Tooltip content="รุ่นอบรมนี้ยังเปิดรับสมัคร สามารถกดลงทะเบียนได้">
                    <Badge variant="neutral">เปิดรับสมัคร</Badge>
                  </Tooltip>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center">
                  {!item.enrolled ? (
                    <Tooltip content="ส่งคำขอลงทะเบียนเข้าอบรมให้หัวหน้างานพิจารณา">
                      <Button
                        size="sm"
                        variant="primary"
                        leftIcon={<GraduationCap className="h-3.5 w-3.5" />}
                        onClick={() => handleEnroll(item)}
                        className="w-[104px] justify-center"
                      >
                        ลงทะเบียน
                      </Button>
                    </Tooltip>
                  ) : (
                    <span className="inline-flex w-[104px] items-center justify-center text-xs font-medium text-emerald-600">
                      สมัครแล้ว
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

export function EssLmsPanel({ courses }: { courses: EssLmsCourseItem[] }) {
  return (
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[34%]">รหัส / คอร์สออนไลน์ของฉัน</TableHead>
            <TableHead className="w-[14%] text-center">หมวดหมู่</TableHead>
            <TableHead className="w-[22%]">ความคืบหน้าการเรียน</TableHead>
            <TableHead className="w-[16%] text-center">กำหนดเรียนจบ</TableHead>
            <TableHead className="w-[14%] text-center">เข้าเรียน</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((c) => (
            <TableRow key={c.id}>
              <TableCell>
                <span className="inline-block rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                  {c.code}
                </span>
                <div className="mt-1 font-semibold text-[#1E293B]">{c.title}</div>
                <div className="text-xs text-[#64748B]">
                  เรียนจบแล้ว {c.lessonsDone}/{c.totalLessons} บทเรียน
                </div>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="primary">{c.category}</Badge>
              </TableCell>
              <TableCell>
                <Tooltip
                  className="block w-full"
                  content={`เรียนจบแล้ว ${c.lessonsDone} จาก ${c.totalLessons} บทเรียน (${c.progress}%)`}
                >
                  <div className="space-y-1.5">
                    <div className="text-right text-xs font-semibold text-[#1E293B]">
                      {c.progress}%
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#EEF2F6]">
                      <div
                        className={`h-full rounded-full ${
                          c.progress === 100 ? "bg-emerald-500" : "bg-[#2563EB]"
                        }`}
                        style={{ width: `${c.progress}%` }}
                      />
                    </div>
                  </div>
                </Tooltip>
              </TableCell>
              <TableCell className="text-center text-xs font-medium text-[#475569]">
                {c.dueDate}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center">
                  <Tooltip content="เปิดเข้าสู่ห้องเรียนวิดีโอ LMS เพื่อเรียนต่อหรือทบทวนบทเรียน">
                    <Link href="/lms?tab=courses">
                      <Button
                        size="sm"
                        variant={c.progress === 100 ? "outline" : "primary"}
                        leftIcon={
                          c.progress === 100 ? (
                            <ExternalLink className="h-3.5 w-3.5" />
                          ) : (
                            <PlayCircle className="h-3.5 w-3.5" />
                          )
                        }
                        className="w-[104px] justify-center"
                      >
                        {c.progress === 100 ? "ทบทวน" : "เรียนต่อ"}
                      </Button>
                    </Link>
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

export function EssCertificatesPanel({ certs }: { certs: EssCertificateItem[] }) {
  const [preview, setPreview] = useState<EssCertificateItem | null>(null);

  return (
    <div className="space-y-4">
      <TableContainer>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[34%]">รหัส / ชื่อใบประกาศนียบัตร</TableHead>
              <TableHead className="w-[22%]">สถาบันผู้ออก / เลขที่</TableHead>
              <TableHead className="w-[14%] text-center">แหล่งที่มา</TableHead>
              <TableHead className="w-[16%] text-center">วันที่ออก / หมดอายุ</TableHead>
              <TableHead className="w-[14%] text-center">ดูใบรับรอง</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {certs.map((cert) => (
              <TableRow key={cert.id}>
                <TableCell>
                  <span className="inline-block rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                    {cert.code}
                  </span>
                  <div className="mt-1 font-semibold text-[#1E293B]">{cert.title}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-medium text-[#334155]">{cert.issuer}</div>
                  <div className="font-mono text-xs text-[#94A3B8]">{cert.credentialNo}</div>
                </TableCell>
                <TableCell className="text-center">
                  <Tooltip
                    content={
                      cert.source === "LMS ภายใน"
                        ? "ออกให้โดยระบบ LMS ภายในองค์กรอัตโนมัติหลังสอบผ่าน"
                        : "ใบรับรองวิชาชีพจากสถาบันภายนอกที่รับรองในประวัติทักษะ"
                    }
                  >
                    <Badge variant={cert.source === "LMS ภายใน" ? "primary" : "success"}>
                      {cert.source}
                    </Badge>
                  </Tooltip>
                </TableCell>
                <TableCell className="text-center text-xs">
                  <div className="font-semibold text-[#1E293B]">{cert.issueDate}</div>
                  <div className="text-[#94A3B8]">หมดอายุ: {cert.expiryDate}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center">
                    <Tooltip content="เปิดดูตัวอย่างใบประกาศนียบัตรดิจิทัลและเลขที่อ้างอิง">
                      <Button
                        size="sm"
                        variant="outline"
                        leftIcon={<Eye className="h-3.5 w-3.5" />}
                        onClick={() => setPreview(cert)}
                        className="w-[100px] justify-center"
                      >
                        เปิดดู
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
        open={Boolean(preview)}
        onClose={() => setPreview(null)}
        title="ตัวอย่างใบประกาศนียบัตร (E-Certificate)"
        size="md"
        footer={
          <Button variant="primary" onClick={() => setPreview(null)}>
            ปิดหน้าต่าง
          </Button>
        }
      >
        {preview && (
          <div className="rounded-2xl border-2 border-[#DBEAFE] bg-gradient-to-br from-[#F8FAFF] to-white p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF4FF] text-[#2563EB]">
              <Award className="h-6 w-6" />
            </div>
            <div className="mt-3 text-xs font-semibold uppercase tracking-widest text-[#2563EB]">
              Certificate of Achievement
            </div>
            <div className="mt-2 text-lg font-bold text-[#1E293B]">
              {ESS_EMPLOYEE_PROFILE.name}
            </div>
            <p className="mt-1 text-xs text-[#64748B]">ได้ผ่านการรับรองหลักสูตร / คุณวุฒิ</p>
            <div className="mt-2 text-base font-bold text-[#2563EB]">{preview.title}</div>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 border-t border-[#EEF2F6] pt-4 text-xs text-[#64748B]">
              <span>ผู้ออก: {preview.issuer}</span>
              <span>เลขที่: {preview.credentialNo}</span>
              <span>วันที่ออก: {preview.issueDate}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export function EssCareerPanel() {
  const ladder = [
    { title: "Software Engineer", grade: "JG-05", state: "completed" },
    { title: "Senior Software Engineer", grade: "JG-06", state: "current" },
    { title: "Engineering Team Lead", grade: "JG-07", state: "target" },
    { title: "Engineering Manager", grade: "JG-08", state: "future" },
  ];

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-[#EEF2F6] bg-[#FAFCFF] p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EEF2F6] pb-4">
          <div>
            <div className="text-sm font-bold text-[#1E293B]">
              เส้นทางสายอาชีพของคุณ: Engineering Management Track
            </div>
            <div className="mt-0.5 text-xs text-[#64748B]">
              พี่เลี้ยงดูแลเส้นทางอาชีพ (Mentor): {ESS_EMPLOYEE_PROFILE.managerName}
            </div>
          </div>
          <Tooltip
            title="เปอร์เซ็นต์ความพร้อม"
            content="ประเมินเทียบกับเกณฑ์ Career Requirements ของตำแหน่ง Engineering Team Lead (JG-07)"
          >
            <Badge variant="primary">ความพร้อม {ESS_EMPLOYEE_PROFILE.careerReadiness}%</Badge>
          </Tooltip>
        </div>

        <div className="mt-5 space-y-3">
          {ladder.map((step, idx) => (
            <div
              key={step.grade}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                step.state === "current"
                  ? "border-[#2563EB] bg-[#EFF6FF]/70"
                  : step.state === "target"
                    ? "border-emerald-200 bg-emerald-50/50"
                    : "border-[#EEF2F6] bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                    step.state === "completed"
                      ? "bg-emerald-500 text-white"
                      : step.state === "current"
                        ? "bg-[#2563EB] text-white"
                        : step.state === "target"
                          ? "border-2 border-emerald-500 bg-white text-emerald-700"
                          : "border-2 border-[#CBD5E1] bg-white text-[#94A3B8]"
                  }`}
                >
                  {step.state === "completed" ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : idx === ladder.length - 1 ? (
                    <Trophy className="h-3.5 w-3.5" />
                  ) : (
                    idx + 1
                  )}
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#1E293B]">{step.title}</div>
                  <div className="text-xs text-[#64748B]">
                    {step.state === "current"
                      ? "ตำแหน่งปัจจุบันของคุณ"
                      : step.state === "target"
                        ? "ตำแหน่งเป้าหมายถัดไป (ภายใน 12 เดือน)"
                        : step.state === "completed"
                          ? "ผ่านมาแล้ว"
                          : "เป้าหมายระยะยาว"}
                  </div>
                </div>
              </div>
              <span className="rounded-md bg-[#F1F5F9] px-2.5 py-1 font-mono text-xs font-semibold text-[#475569]">
                {step.grade}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
