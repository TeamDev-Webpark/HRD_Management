"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Compass,
  FileText,
  GraduationCap,
  Pencil,
  Send,
  Target,
  TrendingUp,
} from "lucide-react";
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
import type { AssignedFormItem } from "@/context/DemoStoreContext";
import {
  ESS_EMPLOYEE_PROFILE,
  type EssGoalItem,
  type EssIdpActivity,
  type EssSkillItem,
} from "@/data/mock/essData";

export function EssOverviewPanel({
  assignedForms,
  onSubmitForm,
}: {
  assignedForms: AssignedFormItem[];
  onSubmitForm: (formId: string, note: string) => void;
}) {
  const [activeForm, setActiveForm] = useState<AssignedFormItem | null>(null);
  const [responseNote, setResponseNote] = useState("");
  // Structured fields by form type
  const [evalScore1, setEvalScore1] = useState(4);
  const [evalScore2, setEvalScore2] = useState(4);
  const [evalScore3, setEvalScore3] = useState(5);
  const [surveyTopic, setSurveyTopic] = useState("Generative AI & Data Analytics");
  const [surveyFormat, setSurveyFormat] = useState("Online Live");
  const [policyAccepted, setPolicyAccepted] = useState(false);

  const openFormModal = (frm: AssignedFormItem) => {
    setActiveForm(frm);
    setResponseNote("");
    setEvalScore1(4);
    setEvalScore2(4);
    setEvalScore3(5);
    setSurveyTopic("Generative AI & Data Analytics");
    setSurveyFormat("Online Live");
    setPolicyAccepted(false);
  };

  const handleConfirmSubmit = () => {
    if (!activeForm) return;
    let summary = responseNote.trim();
    if (activeForm.type === "แบบฟอร์มประเมิน") {
      const avg = ((evalScore1 + evalScore2 + evalScore3) / 3).toFixed(2);
      summary = `คะแนนประเมินตนเองเฉลี่ย ${avg}/5.0 (KPI: ${evalScore1}, คุณภาพงาน: ${evalScore2}, ทีมเวิร์ก: ${evalScore3})${summary ? ` • ${summary}` : ""}`;
    } else if (activeForm.type === "แบบสำรวจความต้องการอบรม") {
      summary = `หัวข้อที่สนใจ: ${surveyTopic} (รูปแบบ: ${surveyFormat})${summary ? ` • ${summary}` : ""}`;
    } else {
      summary = `ยืนยันอ่านและรับทราบนโยบายแล้ว${summary ? ` • ${summary}` : ""}`;
    }
    onSubmitForm(activeForm.id, summary);
    setActiveForm(null);
  };

  const canSubmitForm =
    activeForm?.type === "เอกสารรับทราบนโยบาย" ? policyAccepted : true;

  const quickLinks = [
    {
      title: "อัปเดตความคืบหน้า KPI / OKR",
      desc: "มี 1 เป้าหมายที่รอประเมินตนเองรอบปลายปี",
      href: "/ess?tab=performance",
      icon: <Target className="h-5 w-5 text-[#2563EB]" />,
      bg: "bg-[#EEF4FF]",
    },
    {
      title: "ติดตามแผนพัฒนา IDP ของฉัน",
      desc: "กำลังดำเนินกิจกรรม 70-20-10 อยู่ 2 รายการ",
      href: "/ess?tab=idp",
      icon: <TrendingUp className="h-5 w-5 text-emerald-600" />,
      bg: "bg-[#DCFCE7]",
    },
    {
      title: "ลงทะเบียนอบรมและเรียน LMS",
      desc: `สะสมแล้ว ${ESS_EMPLOYEE_PROFILE.trainingHoursDone}/${ESS_EMPLOYEE_PROFILE.trainingHoursTarget} ชม. (ขาดอีก 6 ชม.)`,
      href: "/ess?tab=training",
      icon: <GraduationCap className="h-5 w-5 text-purple-600" />,
      bg: "bg-[#F3E8FF]",
    },
    {
      title: "ดูเส้นทางอาชีพและใบรับรอง",
      desc: `เป้าหมายถัดไป: ${ESS_EMPLOYEE_PROFILE.nextTargetRole}`,
      href: "/ess?tab=career",
      icon: <Compass className="h-5 w-5 text-amber-600" />,
      bg: "bg-[#FEF3C7]",
    },
  ];

  return (
    <div className="space-y-5">
      {/* Personal Profile Banner */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[#EEF2F6] bg-[#FAFCFF] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#2563EB] text-lg font-bold text-white shadow-xs">
            ณจ
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold text-[#1E293B]">{ESS_EMPLOYEE_PROFILE.name}</h2>
              <span className="rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                {ESS_EMPLOYEE_PROFILE.employeeCode}
              </span>
              <Badge variant="primary">{ESS_EMPLOYEE_PROFILE.jobGrade}</Badge>
            </div>
            <p className="mt-0.5 text-sm text-[#64748B]">
              {ESS_EMPLOYEE_PROFILE.position} • {ESS_EMPLOYEE_PROFILE.department}
            </p>
            <p className="mt-0.5 text-xs text-[#94A3B8]">
              หัวหน้างานโดยตรง: {ESS_EMPLOYEE_PROFILE.managerName}
            </p>
          </div>
        </div>
        <Tooltip
          title="ความพร้อมสู่ตำแหน่งถัดไป"
          content={`ประเมินจากผล KPI, สมรรถนะประจำตำแหน่ง และแผนพัฒนา IDP เทียบเกณฑ์ ${ESS_EMPLOYEE_PROFILE.nextTargetRole}`}
        >
          <div className="flex cursor-help items-center gap-2">
            <Award className="h-5 w-5 text-emerald-600" />
            <div className="text-right">
              <div className="text-xs text-[#64748B]">ความพร้อมสู่ตำแหน่งถัดไป</div>
              <div className="text-base font-bold text-emerald-700">
                {ESS_EMPLOYEE_PROFILE.careerReadiness}%
              </div>
            </div>
          </div>
        </Tooltip>
      </div>

      {/* Live Assigned Forms / Documents from Admin */}
      <div className="space-y-3 rounded-2xl border border-[#DBEAFE] bg-[#F8FAFF] p-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FileText className="h-4.5 w-4.5 text-[#2563EB]" />
            <h3 className="text-sm font-bold text-[#1E293B]">
              แบบฟอร์มและเอกสารที่ได้รับมอบหมายจาก HRD / Admin
            </h3>
          </div>
          <Badge variant="primary">
            รอดำเนินการ {assignedForms.filter((f) => f.status === "pending").length} รายการ
          </Badge>
        </div>

        <div className="space-y-2.5">
          {assignedForms.map((frm) => (
            <div
              key={frm.id}
              className="flex flex-col gap-3 rounded-xl border border-[#EEF2F6] bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                    {frm.code}
                  </span>
                  <Badge variant="neutral">{frm.type}</Badge>
                  <Badge variant={frm.status === "submitted" ? "success" : "warning"} dot>
                    {frm.status === "submitted" ? "ส่งแล้ว" : "รอดำเนินการ"}
                  </Badge>
                </div>
                <div className="mt-1.5 text-sm font-semibold text-[#1E293B]">{frm.title}</div>
                <div className="mt-0.5 text-xs text-[#64748B]">
                  ผู้ส่ง: {frm.senderName} • กำหนดส่ง: {frm.dueDate}
                </div>
                {frm.status === "submitted" && frm.submittedNote && (
                  <div className="mt-1 text-xs font-medium text-emerald-700">
                    บันทึกที่ส่งแล้ว: &ldquo;{frm.submittedNote}&rdquo; ({frm.submittedAt})
                  </div>
                )}
              </div>
              <div className="shrink-0">
                {frm.status === "pending" ? (
                  <Tooltip content="เปิดกรอกข้อมูลและส่งแบบฟอร์มกลับไปยังฝ่าย HRD / Admin">
                    <Button
                      size="sm"
                      variant="primary"
                      leftIcon={<Send className="h-3.5 w-3.5" />}
                      onClick={() => openFormModal(frm)}
                    >
                      เปิดทำแบบฟอร์ม
                    </Button>
                  </Tooltip>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" /> ส่งเรียบร้อย
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {quickLinks.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="group flex items-center justify-between gap-4 rounded-2xl border border-[#EEF2F6] bg-white p-4 transition-all hover:border-[#2563EB]/40 hover:bg-[#FAFCFF]"
          >
            <div className="flex items-center gap-3.5">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.bg}`}>
                {item.icon}
              </div>
              <div>
                <div className="text-sm font-semibold text-[#1E293B] group-hover:text-[#2563EB]">
                  {item.title}
                </div>
                <div className="mt-0.5 text-xs text-[#64748B]">{item.desc}</div>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-[#94A3B8] transition-transform group-hover:translate-x-1 group-hover:text-[#2563EB]" />
          </Link>
        ))}
      </div>

      <Modal
        open={Boolean(activeForm)}
        onClose={() => setActiveForm(null)}
        title={activeForm?.title ?? "ทำแบบฟอร์ม"}
        description={activeForm?.description}
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setActiveForm(null)}>
              ยกเลิก
            </Button>
            <Button
              variant="primary"
              leftIcon={<Send className="h-4 w-4" />}
              disabled={!canSubmitForm}
              onClick={handleConfirmSubmit}
            >
              ส่งแบบฟอร์มกลับ HRD
            </Button>
          </>
        }
      >
        {activeForm && (
          <div className="space-y-4">
            <div className="rounded-xl border border-[#EEF2F6] bg-[#F8FAFC] p-3 text-xs text-[#475569]">
              ประเภท: <strong>{activeForm.type}</strong> • ผู้ส่ง:{" "}
              <strong>{activeForm.senderName}</strong> • กำหนดส่ง:{" "}
              <strong>{activeForm.dueDate}</strong>
            </div>

            {activeForm.type === "แบบฟอร์มประเมิน" && (
              <div className="space-y-3 rounded-xl border border-[#EEF2F6] bg-white p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1E293B]">
                    ให้คะแนนประเมินตนเองรายหัวข้อ (1–5 คะแนน)
                  </span>
                  <Badge variant="primary">
                    เฉลี่ย {((evalScore1 + evalScore2 + evalScore3) / 3).toFixed(2)} / 5.0
                  </Badge>
                </div>
                {[
                  { label: "1. ความสำเร็จตามเป้าหมาย KPI / OKR", val: evalScore1, set: setEvalScore1 },
                  { label: "2. คุณภาพงาน ความรับผิดชอบ และความตรงต่อเวลา", val: evalScore2, set: setEvalScore2 },
                  { label: "3. การสื่อสารและการทำงานร่วมกับทีม", val: evalScore3, set: setEvalScore3 },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex flex-wrap items-center justify-between gap-2 border-t border-[#F1F5F9] pt-2.5"
                  >
                    <span className="text-xs font-medium text-[#334155]">{row.label}</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => row.set(n)}
                          className={`h-7 w-7 cursor-pointer rounded-lg text-xs font-bold transition-colors ${
                            row.val === n
                              ? "bg-[#2563EB] text-white"
                              : "border border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] hover:border-[#2563EB]"
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeForm.type === "แบบสำรวจความต้องการอบรม" && (
              <div className="space-y-3 rounded-xl border border-[#EEF2F6] bg-white p-4">
                <Input
                  label="หัวข้อ / ทักษะที่ต้องการเข้าอบรม"
                  value={surveyTopic}
                  onChange={(e) => setSurveyTopic(e.target.value)}
                />
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-[#334155]">
                    รูปแบบการอบรมที่สะดวก
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["Classroom", "Online Live", "E-Learning (LMS)"].map((fmt) => (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() => setSurveyFormat(fmt)}
                        className={`cursor-pointer rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors ${
                          surveyFormat === fmt
                            ? "border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]"
                            : "border-[#E2E8F0] bg-white text-[#64748B] hover:bg-[#F8FAFC]"
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeForm.type === "เอกสารรับทราบนโยบาย" && (
              <div className="space-y-3 rounded-xl border border-[#EEF2F6] bg-white p-4">
                <p className="text-xs leading-relaxed text-[#475569]">
                  เอกสารฉบับนี้ระบุแนวทางปฏิบัติและมาตรฐานการพัฒนาบุคลากรขององค์กรประจำปี 2569
                  กรุณาตรวจสอบรายละเอียดและติ๊กยืนยันด้านล่างเพื่อบันทึกการรับทราบในระบบ
                </p>
                <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-blue-100 bg-blue-50/50 p-3 text-xs font-semibold text-[#1E40AF]">
                  <input
                    type="checkbox"
                    checked={policyAccepted}
                    onChange={(e) => setPolicyAccepted(e.target.checked)}
                    className="h-4 w-4 accent-[#2563EB]"
                  />
                  <span>ข้าพเจ้าได้อ่านและรับทราบนโยบาย/เอกสารฉบับนี้ครบถ้วนแล้ว</span>
                </label>
              </div>
            )}

            <Input
              label="สรุปผลงานเด่น / ข้อคิดเห็นเพิ่มเติม (ไม่บังคับ)"
              placeholder="กรอกรายละเอียดเพิ่มเติม..."
              value={responseNote}
              onChange={(e) => setResponseNote(e.target.value)}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}

export function EssPerformancePanel({
  goals,
  onUpdateGoal,
}: {
  goals: EssGoalItem[];
  onUpdateGoal: (goalId: string, progress: number, selfScore: number) => void;
}) {
  const [selected, setSelected] = useState<EssGoalItem | null>(null);
  const [formProgress, setFormProgress] = useState("80");
  const [formScore, setFormScore] = useState("4.5");

  const openEdit = (g: EssGoalItem) => {
    setSelected(g);
    setFormProgress(String(g.progress));
    setFormScore(String(g.selfScore ?? 4.0));
  };

  const handleSave = () => {
    if (!selected) return;
    const pct = Math.min(100, Math.max(0, Number(formProgress) || 0));
    const score = Math.min(5, Math.max(1, Number(formScore) || 4));
    onUpdateGoal(selected.id, pct, score);
    setSelected(null);
  };

  return (
    <div className="space-y-4">
      <TableContainer>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[34%]">รหัส / เป้าหมาย KPI & OKR</TableHead>
              <TableHead className="w-[10%] text-center">น้ำหนัก</TableHead>
              <TableHead className="w-[18%]">ความคืบหน้า</TableHead>
              <TableHead className="w-[14%] text-center">ประเมินตนเอง</TableHead>
              <TableHead className="w-[12%] text-center">สถานะ</TableHead>
              <TableHead className="w-[12%] text-center">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {goals.map((g) => (
              <TableRow key={g.id}>
                <TableCell>
                  <span className="inline-block rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                    {g.code}
                  </span>
                  <div className="mt-1 font-semibold text-[#1E293B]">{g.title}</div>
                  <div className="text-xs text-[#64748B]">เป้าหมาย: {g.target}</div>
                </TableCell>
                <TableCell className="text-center font-semibold text-[#334155]">
                  {g.weight}%
                </TableCell>
                <TableCell>
                  <Tooltip className="block w-full" content={`ความคืบหน้าปัจจุบัน ${g.progress}%`}>
                    <div className="space-y-1.5">
                      <div className="text-right text-xs font-semibold text-[#1E293B]">
                        {g.progress}%
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-[#EEF2F6]">
                        <div
                          className={`h-full rounded-full ${
                            g.progress >= 100 ? "bg-emerald-500" : "bg-[#2563EB]"
                          }`}
                          style={{ width: `${g.progress}%` }}
                        />
                      </div>
                    </div>
                  </Tooltip>
                </TableCell>
                <TableCell className="text-center font-semibold text-[#2563EB]">
                  {g.selfScore !== null ? `${g.selfScore.toFixed(1)} / 5.0` : "รอประเมิน"}
                </TableCell>
                <TableCell className="text-center">
                  <Tooltip
                    content={
                      g.status === "completed"
                        ? "บรรลุเป้าหมาย 100% เรียบร้อยแล้ว"
                        : g.status === "on-track"
                          ? "ดำเนินงานได้ตามแผนที่กำหนดไว้"
                          : "ความคืบหน้ายังต่ำกว่าเกณฑ์ ควรเร่งติดตามให้ทันรอบประเมิน"
                    }
                  >
                    <Badge
                      variant={
                        g.status === "completed"
                          ? "success"
                          : g.status === "on-track"
                            ? "primary"
                            : "warning"
                      }
                      dot
                    >
                      {g.status === "completed"
                        ? "สำเร็จแล้ว"
                        : g.status === "on-track"
                          ? "ตามแผน"
                          : "เร่งติดตาม"}
                    </Badge>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center">
                    <Tooltip content="อัปเดตความคืบหน้าและให้คะแนนประเมินตนเอง">
                      <Button
                        size="sm"
                        variant="outline"
                        leftIcon={<Pencil className="h-3.5 w-3.5" />}
                        onClick={() => openEdit(g)}
                        className="w-[100px] justify-center"
                      >
                        อัปเดต
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
        title="อัปเดตความคืบหน้าและประเมินตนเอง"
        description={selected?.title}
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
              บันทึกผล
            </Button>
          </>
        }
      >
        <div className="space-y-3.5">
          <Input
            label="ความคืบหน้า (0–100%)"
            type="number"
            min={0}
            max={100}
            value={formProgress}
            onChange={(e) => setFormProgress(e.target.value)}
          />
          <Input
            label="คะแนนประเมินตนเอง (1.0 – 5.0)"
            type="number"
            step="0.1"
            min={1}
            max={5}
            value={formScore}
            onChange={(e) => setFormScore(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}

export function EssSkillsPanel({ skills }: { skills: EssSkillItem[] }) {
  return (
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[38%]">รหัส / สมรรถนะและทักษะ</TableHead>
            <TableHead className="w-[14%] text-center">ประเภท</TableHead>
            <TableHead className="w-[18%] text-center">เป้าหมาย → ระดับปัจจุบัน</TableHead>
            <TableHead className="w-[14%] text-center">Gap</TableHead>
            <TableHead className="w-[16%] text-center">ประเมินล่าสุด</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {skills.map((s) => {
            const gap = s.actualLevel - s.targetLevel;
            return (
              <TableRow key={s.id}>
                <TableCell>
                  <span className="inline-block rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                    {s.code}
                  </span>
                  <div className="mt-1 font-semibold text-[#1E293B]">{s.name}</div>
                </TableCell>
                <TableCell className="text-center">
                  <Tooltip
                    content={
                      s.type === "Core"
                        ? "สมรรถนะหลักที่พนักงานทุกคนในองค์กรต้องมี"
                        : s.type === "Managerial"
                          ? "สมรรถนะด้านภาวะผู้นำและการบริหารจัดการ"
                          : "สมรรถนะเฉพาะทางตามสายงานและตำแหน่ง"
                    }
                  >
                    <Badge
                      variant={
                        s.type === "Core" ? "primary" : s.type === "Managerial" ? "warning" : "success"
                      }
                    >
                      {s.type}
                    </Badge>
                  </Tooltip>
                </TableCell>
                <TableCell className="text-center font-semibold">
                  <Tooltip
                    content={`ระดับเป้าหมายประจำตำแหน่ง Lv.${s.targetLevel} / ระดับที่ประเมินได้จริง Lv.${s.actualLevel}`}
                  >
                    <span className="cursor-help">
                      <span className="text-[#64748B]">Lv.{s.targetLevel}</span>
                      <span className="mx-1.5 text-[#CBD5E1]">→</span>
                      <span className={gap < 0 ? "text-rose-600" : "text-emerald-600"}>
                        Lv.{s.actualLevel}
                      </span>
                    </span>
                  </Tooltip>
                </TableCell>
                <TableCell className="text-center">
                  {gap < 0 ? (
                    <Tooltip content="ยังต่ำกว่าเกณฑ์ตำแหน่ง ควรพัฒนาเพิ่มเติมผ่านแผน IDP หรือคอร์ส LMS">
                      <Badge variant="danger">{gap} ระดับ</Badge>
                    </Tooltip>
                  ) : gap === 0 ? (
                    <Tooltip content="ผ่านเกณฑ์มาตรฐานประจำตำแหน่งเรียบร้อยแล้ว">
                      <Badge variant="success">ตามเกณฑ์</Badge>
                    </Tooltip>
                  ) : (
                    <Tooltip content={`สูงกว่าเกณฑ์เป้าหมายตำแหน่ง +${gap} ระดับ`}>
                      <Badge variant="primary">+{gap} ระดับ</Badge>
                    </Tooltip>
                  )}
                </TableCell>
                <TableCell className="text-center text-xs text-[#64748B]">
                  {s.lastAssessed}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function EssIdpPanel({
  items,
  onComplete,
}: {
  items: EssIdpActivity[];
  onComplete: (activityId: string, title: string) => void;
}) {
  const handleMarkDone = (item: EssIdpActivity) => {
    onComplete(item.id, item.title);
  };

  return (
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[34%]">รหัส / กิจกรรมพัฒนา (IDP)</TableHead>
            <TableHead className="w-[16%] text-center">รูปแบบ 70-20-10</TableHead>
            <TableHead className="w-[18%]">ความคืบหน้า</TableHead>
            <TableHead className="w-[12%] text-center">กำหนดเสร็จ</TableHead>
            <TableHead className="w-[10%] text-center">สถานะ</TableHead>
            <TableHead className="w-[10%] text-center">จัดการ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <span className="inline-block rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                  {item.code}
                </span>
                <div className="mt-1 font-semibold text-[#1E293B]">{item.title}</div>
              </TableCell>
              <TableCell className="text-center">
                <Tooltip
                  content={
                    item.method.startsWith("70%")
                      ? "เรียนรู้จากการลงมือปฏิบัติจริงในงานและโปรเจกต์"
                      : item.method.startsWith("20%")
                        ? "เรียนรู้จากการโค้ชชิ่งและพี่เลี้ยง (Mentoring)"
                        : "เรียนรู้ผ่านหลักสูตรฝึกอบรมและคอร์ส LMS"
                  }
                >
                  <Badge variant="primary">{item.method}</Badge>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Tooltip className="block w-full" content={`ความคืบหน้ากิจกรรม ${item.progress}%`}>
                  <div className="space-y-1.5">
                    <div className="text-right text-xs font-semibold text-[#1E293B]">
                      {item.progress}%
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#EEF2F6]">
                      <div
                        className={`h-full rounded-full ${
                          item.progress === 100 ? "bg-emerald-500" : "bg-[#2563EB]"
                        }`}
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                </Tooltip>
              </TableCell>
              <TableCell className="text-center text-xs text-[#64748B]">{item.dueDate}</TableCell>
              <TableCell className="text-center">
                <Tooltip
                  content={
                    item.status === "done"
                      ? "ดำเนินกิจกรรมพัฒนาเสร็จสมบูรณ์แล้ว"
                      : "อยู่ระหว่างดำเนินการตามแผน IDP"
                  }
                >
                  <Badge variant={item.status === "done" ? "success" : "primary"} dot>
                    {item.status === "done" ? "เสร็จสิ้น" : "กำลังทำ"}
                  </Badge>
                </Tooltip>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center">
                  {item.status !== "done" ? (
                    <Tooltip content="ยืนยันว่าทำกิจกรรมพัฒนาชิ้นนี้เสร็จสมบูรณ์ 100% แล้ว">
                      <Button
                        size="sm"
                        variant="primary"
                        leftIcon={<CheckCircle2 className="h-3.5 w-3.5" />}
                        onClick={() => handleMarkDone(item)}
                        className="w-[100px] justify-center"
                      >
                        เสร็จสิ้น
                      </Button>
                    </Tooltip>
                  ) : (
                    <span className="inline-flex w-[100px] items-center justify-center text-xs font-medium text-emerald-600">
                      สำเร็จแล้ว
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
