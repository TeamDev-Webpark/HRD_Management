"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  Award,
  CalendarCheck2,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  FileSpreadsheet,
  Lock,
  MessageSquare,
  Sliders,
  Star,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { Card, CardContent, InfoHint, StatCard } from "@/components/ui";
import { INITIAL_CHECKINS, INITIAL_GOALS } from "@/data/mock/pmsGoals";
import {
  INITIAL_APPRAISAL_REVIEWS,
  INITIAL_CALIBRATION_LIST,
  INITIAL_FEEDBACK_360,
  INITIAL_PIP_RECORDS,
} from "@/data/mock/pmsReview";
import {
  INITIAL_EVALUATION_CYCLES,
  INITIAL_EVALUATION_TEMPLATES,
} from "@/data/mock/pmsSetup";
import { CalibrationRatingPanel } from "./CalibrationRatingPanel";
import { EvaluationCyclePanel } from "./EvaluationCyclePanel";
import { EvaluationTemplatePanel } from "./EvaluationTemplatePanel";
import { Feedback360Panel } from "./Feedback360Panel";
import { GoalSettingPanel } from "./GoalSettingPanel";
import { PipManagementPanel } from "./PipManagementPanel";
import { ProgressCheckinPanel } from "./ProgressCheckinPanel";
import { SelfManagerReviewPanel } from "./SelfManagerReviewPanel";

type PmsTabKey =
  | "cycles"
  | "templates"
  | "goals"
  | "checkins"
  | "reviews"
  | "feedback360"
  | "calibration"
  | "pip";

const PMS_TABS: {
  key: PmsTabKey;
  label: string;
  labelEn: string;
  description: string;
}[] = [
  {
    key: "cycles",
    label: "รอบการประเมินผล",
    labelEn: "Evaluation Cycles",
    description:
      "กำหนดรอบการประเมินผลการปฏิบัติงานประจำปี กลางปี และทดลองงาน พร้อมติดตามอัตราการส่งผลประเมิน",
  },
  {
    key: "templates",
    label: "แบบฟอร์มและเกณฑ์ประเมิน",
    labelEn: "Evaluation Templates",
    description:
      "จัดการโครงสร้างแบบฟอร์มและสัดส่วนน้ำหนัก KPI / Competency / 360° Feedback แยกตามกลุ่มตำแหน่ง",
  },
  {
    key: "goals",
    label: "เป้าหมาย KPI / OKR / MBO",
    labelEn: "Goal Setting",
    description:
      "กำหนดและอนุมัติเป้าหมายรายบุคคลและทีม เชื่อมโยงกลยุทธ์องค์กรพร้อมอัปเดตความคืบหน้าผลงานจริง",
  },
  {
    key: "checkins",
    label: "ติดตามความคืบหน้า (Check-in)",
    labelEn: "Progress Check-in",
    description:
      "บันทึกการอัปเดตงานระหว่างรอบและผลโค้ชชิ่ง 1-on-1 ระหว่างพนักงานกับหัวหน้างาน",
  },
  {
    key: "reviews",
    label: "ประเมินตนเองและหัวหน้า",
    labelEn: "Self & Manager Review",
    description:
      "ติดตามและกรอกแบบประเมินผลงานปลายรอบทั้งฝั่งพนักงาน (Self-Appraisal) และหัวหน้างาน",
  },
  {
    key: "feedback360",
    label: "ประเมินรอบทิศทาง 360°",
    labelEn: "360° Feedback",
    description:
      "รวบรวมคะแนนประเมินรอบทิศทางจากหัวหน้า เพื่อนร่วมงาน และลูกทีมแบบไม่เปิดเผยตัวตน",
  },
  {
    key: "calibration",
    label: "Calibration และเกรดสุทธิ",
    labelEn: "Calibration & Final Rating",
    description:
      "ปรับสมดุลมาตรฐานการให้คะแนนระหว่างแผนก ตรวจสอบการกระจายเกรด และยืนยันล็อกเกรดสุทธิ",
  },
  {
    key: "pip",
    label: "แผนปรับปรุงผลงาน (PIP)",
    labelEn: "PIP Management",
    description:
      "ติดตามพนักงานในแผนปรับปรุงผลการปฏิบัติงาน 60–90 วัน พร้อมบันทึกผลความคืบหน้าและปิดแผน",
  },
];

export function PerformanceWorkspace() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as PmsTabKey | null;
  const activeMeta = PMS_TABS.find((t) => t.key === tabParam) ?? PMS_TABS[0];
  const activeTab: PmsTabKey = activeMeta.key;

  const [toast, setToast] = useState<string | null>(null);
  const [cycles, setCycles] = useState(INITIAL_EVALUATION_CYCLES);
  const [templates, setTemplates] = useState(INITIAL_EVALUATION_TEMPLATES);
  const [goals, setGoals] = useState(INITIAL_GOALS);
  const [checkins, setCheckins] = useState(INITIAL_CHECKINS);
  const [reviews, setReviews] = useState(INITIAL_APPRAISAL_REVIEWS);
  const [feedback360] = useState(INITIAL_FEEDBACK_360);
  const [calibrations, setCalibrations] = useState(INITIAL_CALIBRATION_LIST);
  const [pipRecords, setPipRecords] = useState(INITIAL_PIP_RECORDS);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  };

  const renderContextualKpis = () => {
    if (activeTab === "cycles") {
      const activeCycles = cycles.filter((c) => c.status === "active");
      const activeEligible = activeCycles.reduce((s, c) => s + c.eligibleEmployees, 0);
      const activeSubmitted = activeCycles.reduce((s, c) => s + c.submittedCount, 0);
      const submitRate = activeEligible
        ? Math.round((activeSubmitted / activeEligible) * 100)
        : 0;
      const upcomingCount = cycles.filter((c) => c.status === "upcoming").length;
      const closedCount = cycles.filter((c) => c.status === "closed").length;

      return (
        <>
          <StatCard
            tone="blue"
            title="รอบประเมินที่เปิดอยู่"
            tooltip="จำนวนรอบการประเมินผลที่กำลังเปิดให้พนักงานและหัวหน้างานดำเนินการ"
            value={`${activeCycles.length}`}
            unit="รอบ"
            icon={<CalendarCheck2 className="h-5 w-5" />}
            footnote={`จากทั้งหมด ${cycles.length} รอบในระบบ`}
          />
          <StatCard
            tone="green"
            title="อัตราการส่งผลประเมิน"
            tooltip={`ส่งผลประเมินแล้ว ${activeSubmitted} จาก ${activeEligible} คน ในรอบที่เปิดอยู่`}
            value={`${submitRate}%`}
            icon={<CheckCircle2 className="h-5 w-5" />}
            progress={{ percent: submitRate, label: "ความคืบหน้ารอบปัจจุบัน" }}
            footnote={`${activeSubmitted}/${activeEligible} คน`}
          />
          <StatCard
            tone="yellow"
            title="รอบที่รอเปิดดำเนินการ"
            tooltip="รอบการประเมินที่ตั้งค่าล่วงหน้าไว้แล้ว รอถึงกำหนดเปิดรอบ"
            value={`${upcomingCount}`}
            unit="รอบ"
            icon={<Clock className="h-5 w-5" />}
            footnote="พร้อมเปิดตามปฏิทิน HRD"
          />
          <StatCard
            tone="purple"
            title="รอบที่ปิดสรุปผลแล้ว"
            tooltip="รอบการประเมินที่ผ่าน Calibration และล็อกคะแนนเรียบร้อยแล้ว"
            value={`${closedCount}`}
            unit="รอบ"
            icon={<Users className="h-5 w-5" />}
            footnote="เชื่อมโยงประวัติผลงาน HRM"
          />
        </>
      );
    }

    if (activeTab === "templates") {
      const activeTemplates = templates.filter((t) => t.active).length;
      const with360 = templates.filter((t) => t.feedback360Weight > 0).length;
      const avgKpi = templates.length
        ? Math.round(templates.reduce((s, t) => s + t.kpiWeight, 0) / templates.length)
        : 0;

      return (
        <>
          <StatCard
            tone="blue"
            title="แบบฟอร์มประเมินทั้งหมด"
            tooltip="จำนวนโครงสร้างแบบฟอร์มประเมินมาตรฐานที่สร้างไว้ในระบบ"
            value={`${templates.length}`}
            unit="แบบฟอร์ม"
            icon={<FileSpreadsheet className="h-5 w-5" />}
            footnote={`เปิดใช้งาน ${activeTemplates} แบบฟอร์ม`}
          />
          <StatCard
            tone="green"
            title="สัดส่วนพร้อมใช้งาน"
            tooltip="แบบฟอร์มที่เปิดใช้งานและสามารถเลือกผูกกับรอบประเมินได้"
            value={`${activeTemplates}/${templates.length}`}
            unit="แบบฟอร์ม"
            icon={<CheckCircle2 className="h-5 w-5" />}
            progress={{
              percent: templates.length ? Math.round((activeTemplates / templates.length) * 100) : 0,
              label: "เปิดใช้งาน",
            }}
            footnote={`${templates.length ? Math.round((activeTemplates / templates.length) * 100) : 0}%`}
          />
          <StatCard
            tone="purple"
            title="น้ำหนัก KPI เฉลี่ย"
            tooltip="ค่าน้ำหนักเฉลี่ยของส่วนเป้าหมายผลงาน (KPI/OKR) เทียบกับสมรรถนะ"
            value={`${avgKpi}%`}
            icon={<Target className="h-5 w-5" />}
            footnote={`สมรรถนะและอื่นๆ เฉลี่ย ${100 - avgKpi}%`}
          />
          <StatCard
            tone="yellow"
            title="รองรับ 360° Feedback"
            tooltip="จำนวนแบบฟอร์มที่มีสัดส่วนคะแนนประเมินรอบทิศทาง 360 องศา"
            value={`${with360}`}
            unit="แบบฟอร์ม"
            icon={<Sliders className="h-5 w-5" />}
            footnote="สำหรับระดับหัวหน้างานและผู้บริหาร"
          />
        </>
      );
    }

    if (activeTab === "goals") {
      const achieved = goals.filter((g) => g.status === "achieved").length;
      const atRisk = goals.filter((g) => g.status === "at-risk").length;
      const pending = goals.filter((g) => g.status === "pending").length;
      const avgProgress = goals.length
        ? Math.round(goals.reduce((s, g) => s + g.progressPct, 0) / goals.length)
        : 0;

      return (
        <>
          <StatCard
            tone="blue"
            title="เป้าหมายทั้งหมดในรอบนี้"
            tooltip="จำนวนเป้าหมาย KPI / OKR / MBO ที่ตั้งไว้ทั้งหมด"
            value={`${goals.length}`}
            unit="เป้าหมาย"
            icon={<Target className="h-5 w-5" />}
            footnote={`รออนุมัติเป้า ${pending} รายการ`}
          />
          <StatCard
            tone="green"
            title="ความคืบหน้าผลงานเฉลี่ย"
            tooltip="เปอร์เซ็นต์ความสำเร็จเฉลี่ยของทุกเป้าหมายในรอบประเมินปัจจุบัน"
            value={`${avgProgress}%`}
            icon={<TrendingUp className="h-5 w-5" />}
            progress={{ percent: avgProgress, label: "ค่าเฉลี่ยรวมทั้งองค์กร" }}
            footnote={`บรรลุแล้ว ${achieved} เป้า`}
          />
          <StatCard
            tone="yellow"
            title="เสี่ยงล่าช้า (At Risk)"
            tooltip="เป้าหมายที่มีความคืบหน้าต่ำกว่าเกณฑ์ ควรติดตามใกล้ชิด"
            value={`${atRisk}`}
            unit="เป้าหมาย"
            icon={<AlertTriangle className="h-5 w-5" />}
            footnote="ควรนัด Check-in ปลดล็อกปัญหา"
          />
          <StatCard
            tone="purple"
            title="บรรลุเป้าหมาย 100%"
            tooltip="จำนวนเป้าหมายที่ทำผลงานได้ครบหรือสูงกว่าเกณฑ์แล้ว"
            value={`${achieved}/${goals.length}`}
            unit="เป้าหมาย"
            icon={<CheckCircle2 className="h-5 w-5" />}
            footnote={`คิดเป็น ${goals.length ? Math.round((achieved / goals.length) * 100) : 0}%`}
          />
        </>
      );
    }

    if (activeTab === "checkins") {
      const waiting = checkins.filter((c) => c.status === "waiting-manager").length;
      const reviewed = checkins.filter((c) => c.status === "reviewed").length;
      const lowConfidence = checkins.filter((c) => c.confidence === "low").length;
      const avgProgress = checkins.length
        ? Math.round(checkins.reduce((s, c) => s + c.overallProgress, 0) / checkins.length)
        : 0;

      return (
        <>
          <StatCard
            tone="blue"
            title="รายการ Check-in ทั้งหมด"
            tooltip="จำนวนรายงานความคืบหน้าระหว่างรอบที่พนักงานส่งเข้ามา"
            value={`${checkins.length}`}
            unit="รายการ"
            icon={<MessageSquare className="h-5 w-5" />}
            footnote={`ความคืบหน้าเฉลี่ย ${avgProgress}%`}
          />
          <StatCard
            tone="yellow"
            title="รอหัวหน้างานตอบกลับ"
            tooltip="รายงาน Check-in ที่รอหัวหน้างานให้ Feedback และโค้ชชิ่ง"
            value={`${waiting}`}
            unit="รายการ"
            icon={<Clock className="h-5 w-5" />}
            footnote="กดปุ่มตอบกลับในตารางได้ทันที"
          />
          <StatCard
            tone="green"
            title="โค้ชชิ่งและตอบกลับแล้ว"
            tooltip="รายการที่หัวหน้างานบันทึกข้อเสนอแนะ 1-on-1 เรียบร้อยแล้ว"
            value={`${reviewed}/${checkins.length}`}
            unit="รายการ"
            icon={<CheckCircle2 className="h-5 w-5" />}
            progress={{
              percent: checkins.length ? Math.round((reviewed / checkins.length) * 100) : 0,
              label: "อัตราการโค้ชชิ่ง",
            }}
            footnote={`${checkins.length ? Math.round((reviewed / checkins.length) * 100) : 0}%`}
          />
          <StatCard
            tone="purple"
            title="ต้องการช่วยปลดล็อก"
            tooltip="พนักงานที่ประเมินความมั่นใจระดับต่ำและระบุอุปสรรคในการทำงาน"
            value={`${lowConfidence}`}
            unit="คน"
            icon={<AlertTriangle className="h-5 w-5" />}
            footnote="ควรนัด 1-on-1 เร่งด่วน"
          />
        </>
      );
    }

    if (activeTab === "reviews") {
      const submitted = reviews.filter((r) => r.status === "submitted").length;
      const waitMgr = reviews.filter((r) => r.status === "waiting-manager").length;
      const waitSelf = reviews.filter((r) => r.status === "waiting-self").length;
      const scored = reviews.filter((r) => r.managerScore !== null);
      const avgScore = scored.length
        ? (scored.reduce((s, r) => s + (r.managerScore ?? 0), 0) / scored.length).toFixed(2)
        : "0.00";
      return (
        <>
          <StatCard
            tone="blue"
            title="แบบประเมินทั้งหมด"
            tooltip="จำนวนพนักงานในรอบประเมินผลงานปัจจุบัน"
            value={`${reviews.length}`}
            unit="คน"
            icon={<ClipboardCheck className="h-5 w-5" />}
            footnote={`รอพนักงานกรอก ${waitSelf} คน`}
          />
          <StatCard
            tone="yellow"
            title="รอหัวหน้าประเมิน"
            tooltip="พนักงานส่ง Self-Appraisal แล้ว รอหัวหน้างานให้คะแนน"
            value={`${waitMgr}`}
            unit="คน"
            icon={<Clock className="h-5 w-5" />}
            footnote="กดปุ่มประเมินในตารางได้ทันที"
          />
          <StatCard
            tone="green"
            title="ส่ง Calibration แล้ว"
            tooltip="ประเมินครบทั้งฝั่งพนักงานและหัวหน้างานเรียบร้อยแล้ว"
            value={`${submitted}/${reviews.length}`}
            unit="คน"
            icon={<CheckCircle2 className="h-5 w-5" />}
            progress={{
              percent: reviews.length ? Math.round((submitted / reviews.length) * 100) : 0,
              label: "อัตราประเมินครบถ้วน",
            }}
            footnote={`${reviews.length ? Math.round((submitted / reviews.length) * 100) : 0}%`}
          />
          <StatCard
            tone="purple"
            title="คะแนนประเมินเฉลี่ย"
            tooltip="คะแนนเฉลี่ยจากหัวหน้างานในรอบปัจจุบัน (เต็ม 5.00)"
            value={avgScore}
            unit="/ 5.00"
            icon={<Star className="h-5 w-5" />}
            footnote="ก่อนเข้าสู่กระบวนการ Calibration"
          />
        </>
      );
    }

    if (activeTab === "feedback360") {
      const completed = feedback360.filter((f) => f.status === "completed").length;
      const totalInv = feedback360.reduce((s, f) => s + f.invitedCount, 0);
      const totalRes = feedback360.reduce((s, f) => s + f.respondedCount, 0);
      const resRate = totalInv ? Math.round((totalRes / totalInv) * 100) : 0;
      const avg = feedback360.length
        ? (feedback360.reduce((s, f) => s + f.avgScore, 0) / feedback360.length).toFixed(1)
        : "0.0";
      return (
        <>
          <StatCard
            tone="blue"
            title="ผู้รับการประเมิน 360°"
            tooltip="จำนวนหัวหน้างานและผู้บริหารที่เข้าสู่รอบประเมิน 360 องศา"
            value={`${feedback360.length}`}
            unit="ท่าน"
            icon={<Users className="h-5 w-5" />}
            footnote={`เก็บผลครบแล้ว ${completed} ท่าน`}
          />
          <StatCard
            tone="purple"
            title="อัตราการตอบกลับ 360°"
            tooltip={`ตอบแบบสอบถามแล้ว ${totalRes} จาก ${totalInv} คำเชิญ`}
            value={`${resRate}%`}
            icon={<CheckCircle2 className="h-5 w-5" />}
            progress={{ percent: resRate, label: "การตอบกลับรวม" }}
            footnote={`${totalRes}/${totalInv} ท่าน`}
          />
          <StatCard
            tone="yellow"
            title="คะแนนเฉลี่ย 360°"
            tooltip="คะแนนเฉลี่ยรวมทุกมิติ (ภาวะผู้นำ, การทำงานร่วมกัน, การสื่อสาร)"
            value={avg}
            unit="/ 5.0"
            icon={<Star className="h-5 w-5" />}
            footnote="ไม่เปิดเผยชื่อผู้ประเมิน"
          />
          <StatCard
            tone="green"
            title="เชื่อมโยงเข้าแบบประเมิน"
            tooltip="น้ำหนักคะแนน 360° ที่นำไปรวมในแบบประเมินระดับหัวหน้างาน"
            value="15%"
            icon={<Sliders className="h-5 w-5" />}
            footnote="ตามแบบฟอร์ม TPL-MGR-01"
          />
        </>
      );
    }

    if (activeTab === "calibration") {
      const locked = calibrations.filter((c) => c.locked).length;
      const gradeA = calibrations.filter((c) => c.finalGrade === "A").length;
      const pipCount = calibrations.filter((c) => c.finalGrade === "PIP").length;
      const avgRaw = calibrations.length
        ? (calibrations.reduce((s, c) => s + c.rawTotal, 0) / calibrations.length).toFixed(2)
        : "0.00";
      return (
        <>
          <StatCard
            tone="blue"
            title="รายการรอ Calibration"
            tooltip="พนักงานที่ส่งผลประเมินเข้าสู่การปรับสมดุลเกรดทั้งหมด"
            value={`${calibrations.length}`}
            unit="คน"
            icon={<Sliders className="h-5 w-5" />}
            footnote={`คะแนนรวมดิบเฉลี่ย ${avgRaw}`}
          />
          <StatCard
            tone="green"
            title="ล็อกเกรดสุทธิแล้ว"
            tooltip="จำนวนพนักงานที่คณะกรรมการยืนยันและล็อกเกรดเรียบร้อยแล้ว"
            value={`${locked}/${calibrations.length}`}
            unit="คน"
            icon={<Lock className="h-5 w-5" />}
            progress={{
              percent: calibrations.length ? Math.round((locked / calibrations.length) * 100) : 0,
              label: "ความคืบหน้า Calibration",
            }}
            footnote={`${calibrations.length ? Math.round((locked / calibrations.length) * 100) : 0}%`}
          />
          <StatCard
            tone="purple"
            title="เกรด A (Outstanding)"
            tooltip="พนักงานผลงานยอดเยี่ยม เตรียมเชื่อมโยงสู่ Talent Pool / 9-Box"
            value={`${gradeA}`}
            unit="คน"
            icon={<Award className="h-5 w-5" />}
            footnote="เกณฑ์โควต้าองค์กร ≤ 20%"
          />
          <StatCard
            tone="yellow"
            title="เกรด PIP (ต้องปรับปรุง)"
            tooltip="พนักงานที่ต้องจัดทำแผนปรับปรุงผลการปฏิบัติงาน (PIP)"
            value={`${pipCount}`}
            unit="คน"
            icon={<AlertTriangle className="h-5 w-5" />}
            footnote="เชื่อมโยงไปหน้า PIP Management"
          />
        </>
      );
    }

    // pip
    const activePip = pipRecords.filter((p) => p.status === "active").length;
    const passedPip = pipRecords.filter((p) => p.status === "passed").length;
    const avgPipProg = pipRecords.length
      ? Math.round(pipRecords.reduce((s, p) => s + p.progressPct, 0) / pipRecords.length)
      : 0;
    return (
      <>
        <StatCard
          tone="blue"
          title="แผน PIP ทั้งหมด"
          tooltip="จำนวนพนักงานที่เข้าสู่แผนปรับปรุงผลการปฏิบัติงาน (PIP)"
          value={`${pipRecords.length}`}
          unit="คน"
          icon={<AlertTriangle className="h-5 w-5" />}
          footnote="ระยะเวลาติดตามมาตรฐาน 60–90 วัน"
        />
        <StatCard
          tone="yellow"
          title="กำลังติดตามผล"
          tooltip="พนักงานที่อยู่ระหว่างการติดตามเป้าหมาย PIP รายสัปดาห์"
          value={`${activePip}`}
          unit="คน"
          icon={<Clock className="h-5 w-5" />}
          footnote="โค้ชชิ่งใกล้ชิดร่วมกับ HRBP"
        />
        <StatCard
          tone="green"
          title="ผ่านเกณฑ์และปิดแผนแล้ว"
          tooltip="พนักงานที่ปรับปรุงผลงานสำเร็จตามตัวชี้วัดและปิดแผน PIP แล้ว"
          value={`${passedPip}`}
          unit="คน"
          icon={<CheckCircle2 className="h-5 w-5" />}
          footnote="กลับสู่รอบประเมินปกติ"
        />
        <StatCard
          tone="purple"
          title="ความคืบหน้าแผนเฉลี่ย"
          tooltip="เปอร์เซ็นต์ความคืบหน้าเฉลี่ยของแผน PIP ทุกรายการ"
          value={`${avgPipProg}%`}
          icon={<TrendingUp className="h-5 w-5" />}
          progress={{ percent: avgPipProg, label: "ค่าเฉลี่ยความสำเร็จ" }}
          footnote={`${avgPipProg}%`}
        />
      </>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#1E293B]">{activeMeta.label}</h2>
            <InfoHint title={activeMeta.labelEn} content={activeMeta.description} />
          </div>
          <p className="text-xs text-[#94A3B8]">{activeMeta.description}</p>
        </div>

        {toast && (
          <div className="inline-flex items-center gap-2 rounded-xl bg-[#ECFAF5] px-3.5 py-2 text-xs font-medium text-[#1CA388] ring-1 ring-emerald-200/80">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {toast}
          </div>
        )}
      </div>

      {/* Row 1: 4 Context-Aware KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {renderContextualKpis()}
      </div>

      {/* Row 2: Active Content Card */}
      <Card className="overflow-hidden">
        <CardContent className="p-5 sm:p-6">
          {activeTab === "cycles" && (
            <EvaluationCyclePanel items={cycles} onChange={setCycles} onNotify={showToast} />
          )}
          {activeTab === "templates" && (
            <EvaluationTemplatePanel
              items={templates}
              onChange={setTemplates}
              onNotify={showToast}
            />
          )}
          {activeTab === "goals" && (
            <GoalSettingPanel items={goals} onChange={setGoals} onNotify={showToast} />
          )}
          {activeTab === "checkins" && (
            <ProgressCheckinPanel items={checkins} onChange={setCheckins} onNotify={showToast} />
          )}
          {activeTab === "reviews" && (
            <SelfManagerReviewPanel items={reviews} onChange={setReviews} onNotify={showToast} />
          )}
          {activeTab === "feedback360" && (
            <Feedback360Panel items={feedback360} onNotify={showToast} />
          )}
          {activeTab === "calibration" && (
            <CalibrationRatingPanel
              items={calibrations}
              onChange={setCalibrations}
              onNotify={showToast}
            />
          )}
          {activeTab === "pip" && (
            <PipManagementPanel items={pipRecords} onChange={setPipRecords} onNotify={showToast} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
