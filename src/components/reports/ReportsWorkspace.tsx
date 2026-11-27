"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  Award,
  BarChart3,
  BookOpenCheck,
  CheckCircle2,
  Clock,
  Download,
  FileSpreadsheet,
  FileText,
  GraduationCap,
  PieChart,
  Printer,
  ShieldAlert,
  Star,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { Button, Card, InfoHint, Modal, Select, Tooltip } from "@/components/ui";
import {
  downloadCsv,
  PERF_REPORT_ROWS,
  TRAINING_BUDGET_ROWS,
  TRAINING_HISTORY_ROWS,
  TRAINING_REPORT_ROWS,
} from "@/data/mock/hrdReportsPart1";
import {
  CERTIFICATE_REPORT_ROWS,
  IDP_REPORT_ROWS,
  SKILL_GAP_REPORT_ROWS,
  TALENT_SUCCESSION_REPORT_ROWS,
} from "@/data/mock/hrdReportsPart2";
import { PerformanceReportPanel } from "./PerformanceReportPanel";
import { TrainingSummaryReportPanel } from "./TrainingSummaryReportPanel";
import { TrainingHistoryReportPanel } from "./TrainingHistoryReportPanel";
import { TrainingBudgetReportPanel } from "./TrainingBudgetReportPanel";
import { SkillGapReportPanel } from "./SkillGapReportPanel";
import { IdpReportPanel } from "./IdpReportPanel";
import { TalentSuccessionReportPanel } from "./TalentSuccessionReportPanel";
import { CertificateReportPanel } from "./CertificateReportPanel";

type ReportTabKey =
  | "performance"
  | "training"
  | "history"
  | "budget"
  | "skill-gap"
  | "idp"
  | "talent-succession"
  | "certificates";

const VALID_TABS: ReportTabKey[] = [
  "performance",
  "training",
  "history",
  "budget",
  "skill-gap",
  "idp",
  "talent-succession",
  "certificates",
];

const TAB_META: Record<ReportTabKey, { title: string; subtitle: string; hint: string }> = {
  performance: {
    title: "รายงานผลประเมินผลงาน (Performance Report)",
    subtitle: "สรุปผลการประเมินผลงานรายแผนก การกระจายเกรด A / B / C และจำนวนผู้เข้าแผนปรับปรุงผลงาน (PIP)",
    hint: "ใช้สำหรับผู้บริหารและ HRD ตรวจสอบภาพรวมผลการประเมินประจำรอบและส่งออกเป็นไฟล์ CSV ได้ทันที",
  },
  training: {
    title: "รายงานสรุปการฝึกอบรม (Training Report)",
    subtitle: "สรุปจำนวนรุ่นฝึกอบรม ผู้ลงทะเบียน อัตราการเรียนจบ อัตราผ่านเกณฑ์ และคะแนนความพึงพอใจรายหลักสูตร",
    hint: "ช่วยประเมินประสิทธิผลของหลักสูตรฝึกอบรมและวางแผนปรับปรุงหลักสูตรในปีถัดไป",
  },
  history: {
    title: "รายงานประวัติการอบรม (Training History Report)",
    subtitle: "ตรวจสอบชั่วโมงการอบรมสะสมรายบุคคลเทียบกับเกณฑ์เป้าหมายประจำปี (30 ชม./ปี) พร้อมหลักสูตรล่าสุด",
    hint: "แสดงสถานะ 'ครบเกณฑ์ชั่วโมง / กำลังสะสม / ต่ำกว่าเกณฑ์' เพื่อติดตามให้พนักงานอบรมครบตามนโยบาย",
  },
  budget: {
    title: "รายงานงบประมาณฝึกอบรม (Training Budget Report)",
    subtitle: "ติดตามการเบิกจ่ายงบประมาณฝึกอบรมรายแผนก แยกงบจัดสรร ใช้จ่ายจริง จองงบไว้รอจัดอบรม และงบคงเหลือ",
    hint: "แสดงอัตราการใช้งบประมาณและต้นทุนการอบรมเฉลี่ยต่อหัวของแต่ละแผนกอย่างโปร่งใส",
  },
  "skill-gap": {
    title: "รายงานช่องว่างทักษะ (Skill Gap Report)",
    subtitle: "วิเคราะห์ภาพรวมช่องว่างทักษะรายแผนก ทักษะที่ขาดมากที่สุด และอัตราการปิด Gap หลังการพัฒนา",
    hint: "ใช้วางแผนจัดสรรงบประมาณฝึกอบรมและหลักสูตร Upskill / Reskill ให้ตรงจุดที่สุด",
  },
  idp: {
    title: "รายงานความคืบหน้า IDP (IDP Report)",
    subtitle: "ติดตามจำนวนแผน IDP ความคืบหน้าเฉลี่ย และอัตราการบรรลุเป้าหมายการพัฒนารายแผนก",
    hint: "ช่วยให้ผู้บริหารเห็นภาพรวมความคืบหน้าการพัฒนาบุคลากรตามแผน 70-20-10",
  },
  "talent-succession": {
    title: "รายงาน Talent & Succession Coverage",
    subtitle: "สรุปจำนวนกลุ่ม Talent / HiPo ความครอบคลุมผู้สืบทอดตำแหน่งสำคัญ และความเสี่ยงการลาออกรายแผนก",
    hint: "แผนกที่มีความครอบคลุมต่ำกว่า 80% จะแสดงสถานะ 'ต้องเสริม' เพื่อวางแผนสร้างผู้สืบทอดเพิ่ม",
  },
  certificates: {
    title: "รายงานใบประกาศนียบัตรและใบรับรอง (Certificate Report)",
    subtitle: "สรุปจำนวนใบประกาศนียบัตรจาก LMS ภายในและใบรับรองวิชาชีพภายนอก พร้อมติดตามสถานะใกล้หมดอายุ",
    hint: "ใช้ตรวจสอบความสอดคล้องด้านใบรับรองวิชาชีพและการวางแผนต่ออายุล่วงหน้า",
  },
};

export function ReportsWorkspace() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as ReportTabKey | null;
  const activeTab: ReportTabKey =
    tabParam && VALID_TABS.includes(tabParam) ? tabParam : "performance";

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<"csv" | "pdf">("csv");
  const [exportPeriod, setExportPeriod] = useState("fy2569");

  const notify = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const handleRunExport = () => {
    if (exportFormat === "pdf") {
      setExportOpen(false);
      notify("เปิดหน้าต่างพิมพ์รายงานสรุปผู้บริหาร (PDF Print Preview) แล้ว");
      if (typeof window !== "undefined") {
        setTimeout(() => window.print(), 200);
      }
      return;
    }

    downloadCsv(
      `hrd-executive-summary-${exportPeriod}.csv`,
      ["หมวดรายงาน", "ตัวชี้วัดหลัก", "ค่าปัจจุบัน"],
      [
        ["Performance", "อัตราประเมินครบถ้วน", "97%"],
        ["Training", "ผู้เรียนจบหลักสูตรรวม", "439 คน"],
        ["Training Budget", "งบจัดสรรรวม", "3,800,000 บาท"],
        ["Skill Gap", "อัตราการปิดช่องว่างทักษะ", "59%"],
        ["IDP", "ความคืบหน้าเฉลี่ยทั้งองค์กร", "80%"],
        ["Talent & Succession", "ความครอบคลุมตำแหน่งสำคัญ", "76%"],
        ["Certificates", "ใบรับรองที่ใช้งานได้ทั้งหมด", "416 ใบ"],
      ]
    );
    setExportOpen(false);
    notify("ดาวน์โหลดชุดรายงานสรุปผู้บริหาร HRD (CSV) เรียบร้อยแล้ว");
  };

  const kpiCards = useMemo(() => {
    if (activeTab === "skill-gap") {
      const totalGaps = SKILL_GAP_REPORT_ROWS.reduce((a, r) => a + r.totalGaps, 0);
      const critGaps = SKILL_GAP_REPORT_ROWS.reduce((a, r) => a + r.criticalGaps, 0);
      const closedGaps = SKILL_GAP_REPORT_ROWS.reduce((a, r) => a + r.closedGaps, 0);
      const closeRate = Math.round((closedGaps / totalGaps) * 100);
      return [
        {
          label: "ช่องว่างทักษะทั้งหมด",
          value: `${totalGaps} รายการ`,
          sub: "รวบรวมจาก 5 ฝ่ายงานหลัก",
          icon: <AlertTriangle className="h-5 w-5" />,
          color: "bg-[#EEF4FF] text-[#2563EB]",
        },
        {
          label: "Gap ระดับเร่งด่วน",
          value: `${critGaps} รายการ`,
          sub: "ต้องเร่งจัดอบรมและบรรจุเข้า IDP",
          icon: <ShieldAlert className="h-5 w-5" />,
          color: "bg-[#FEF3C7] text-[#D97706]",
        },
        {
          label: "ปิด Gap สำเร็จแล้ว",
          value: `${closedGaps} รายการ`,
          sub: "พัฒนาทักษะผ่านเกณฑ์เป้าหมาย",
          icon: <CheckCircle2 className="h-5 w-5" />,
          color: "bg-[#DCFCE7] text-[#16A34A]",
        },
        {
          label: "อัตราการปิด Gap",
          value: `${closeRate}%`,
          sub: "เทียบกับจำนวน Gap ทั้งหมดในรอบปี",
          icon: <TrendingUp className="h-5 w-5" />,
          color: "bg-[#F3E8FF] text-[#7C3AED]",
        },
      ];
    }

    if (activeTab === "idp") {
      const totalPlans = IDP_REPORT_ROWS.reduce((a, r) => a + r.totalPlans, 0);
      const completedPlans = IDP_REPORT_ROWS.reduce((a, r) => a + r.completedPlans, 0);
      const avgProgress = Math.round(
        IDP_REPORT_ROWS.reduce((a, r) => a + r.avgProgress, 0) / IDP_REPORT_ROWS.length
      );
      const avgAchieved = Math.round(
        IDP_REPORT_ROWS.reduce((a, r) => a + r.achievedRate, 0) / IDP_REPORT_ROWS.length
      );
      return [
        {
          label: "แผน IDP รวมทั้งองค์กร",
          value: `${totalPlans} แผน`,
          sub: "ประจำรอบพัฒนาปี 2569",
          icon: <FileText className="h-5 w-5" />,
          color: "bg-[#EEF4FF] text-[#2563EB]",
        },
        {
          label: "ดำเนินการเสร็จสิ้น",
          value: `${completedPlans} แผน`,
          sub: `คิดเป็น ${Math.round((completedPlans / totalPlans) * 100)}% ของแผนทั้งหมด`,
          icon: <CheckCircle2 className="h-5 w-5" />,
          color: "bg-[#DCFCE7] text-[#16A34A]",
        },
        {
          label: "ความคืบหน้าเฉลี่ย",
          value: `${avgProgress}%`,
          sub: "เฉลี่ยจากทุกฝ่ายงาน",
          icon: <TrendingUp className="h-5 w-5" />,
          color: "bg-[#F3E8FF] text-[#7C3AED]",
        },
        {
          label: "อัตราบรรลุเป้าหมาย",
          value: `${avgAchieved}%`,
          sub: "หลังประเมินผลแผน IDP ปลายรอบ",
          icon: <Award className="h-5 w-5" />,
          color: "bg-[#FEF3C7] text-[#D97706]",
        },
      ];
    }

    if (activeTab === "talent-succession") {
      const talents = TALENT_SUCCESSION_REPORT_ROWS.reduce((a, r) => a + r.talentCount, 0);
      const hipos = TALENT_SUCCESSION_REPORT_ROWS.reduce((a, r) => a + r.hipoCount, 0);
      const keyPos = TALENT_SUCCESSION_REPORT_ROWS.reduce((a, r) => a + r.keyPositions, 0);
      const covered = TALENT_SUCCESSION_REPORT_ROWS.reduce((a, r) => a + r.coveredPositions, 0);
      const readyNow = TALENT_SUCCESSION_REPORT_ROWS.reduce(
        (a, r) => a + r.readyNowSuccessors,
        0
      );
      return [
        {
          label: "Talent Pool ทั้งองค์กร",
          value: `${talents} คน`,
          sub: `เป็นกลุ่ม HiPo จำนวน ${hipos} คน`,
          icon: <Users className="h-5 w-5" />,
          color: "bg-[#EEF4FF] text-[#2563EB]",
        },
        {
          label: "ความครอบคลุมตำแหน่งสำคัญ",
          value: `${Math.round((covered / keyPos) * 100)}%`,
          sub: `ครอบคลุม ${covered} จาก ${keyPos} ตำแหน่งสำคัญ`,
          icon: <CheckCircle2 className="h-5 w-5" />,
          color: "bg-[#DCFCE7] text-[#16A34A]",
        },
        {
          label: "ผู้สืบทอดพร้อมทันที",
          value: `${readyNow} คน`,
          sub: "กลุ่ม Ready Now ที่พร้อมรับตำแหน่ง",
          icon: <Star className="h-5 w-5" />,
          color: "bg-[#F3E8FF] text-[#7C3AED]",
        },
        {
          label: "Talent เสี่ยงลาออกสูง",
          value: `${TALENT_SUCCESSION_REPORT_ROWS.reduce((a, r) => a + r.highFlightRisk, 0)} คน`,
          sub: "ต้องติดตามแผน Retention อย่างใกล้ชิด",
          icon: <ShieldAlert className="h-5 w-5" />,
          color: "bg-[#FEF3C7] text-[#D97706]",
        },
      ];
    }

    if (activeTab === "certificates") {
      const issued = CERTIFICATE_REPORT_ROWS.reduce((a, r) => a + r.issuedCount, 0);
      const valid = CERTIFICATE_REPORT_ROWS.reduce((a, r) => a + r.validCount, 0);
      const expiring = CERTIFICATE_REPORT_ROWS.reduce((a, r) => a + r.expiringCount, 0);
      const expired = CERTIFICATE_REPORT_ROWS.reduce((a, r) => a + r.expiredCount, 0);
      return [
        {
          label: "ใบรับรองที่ออกทั้งหมด",
          value: `${issued} ใบ`,
          sub: "รวม LMS ภายในและวิชาชีพภายนอก",
          icon: <Award className="h-5 w-5" />,
          color: "bg-[#EEF4FF] text-[#2563EB]",
        },
        {
          label: "ใช้งานได้ปกติ",
          value: `${valid} ใบ`,
          sub: `คิดเป็น ${Math.round((valid / issued) * 100)}% ของใบรับรองทั้งหมด`,
          icon: <CheckCircle2 className="h-5 w-5" />,
          color: "bg-[#DCFCE7] text-[#16A34A]",
        },
        {
          label: "ใกล้หมดอายุ",
          value: `${expiring} ใบ`,
          sub: "ควรวางแผนต่ออายุล่วงหน้า 90 วัน",
          icon: <Clock className="h-5 w-5" />,
          color: "bg-[#FEF3C7] text-[#D97706]",
        },
        {
          label: "หมดอายุแล้ว",
          value: `${expired} ใบ`,
          sub: "รอการสอบต่ออายุ (Renewal)",
          icon: <AlertTriangle className="h-5 w-5" />,
          color: "bg-[#F3E8FF] text-[#7C3AED]",
        },
      ];
    }

    if (activeTab === "training") {
      const totalSessions = TRAINING_REPORT_ROWS.reduce((a, r) => a + r.sessionsCount, 0);
      const totalCompleted = TRAINING_REPORT_ROWS.reduce((a, r) => a + r.completed, 0);
      const avgPass = Math.round(
        TRAINING_REPORT_ROWS.reduce((a, r) => a + r.passRate, 0) / TRAINING_REPORT_ROWS.length
      );
      const avgSat = (
        TRAINING_REPORT_ROWS.reduce((a, r) => a + r.avgSatisfaction, 0) /
        TRAINING_REPORT_ROWS.length
      ).toFixed(1);
      return [
        {
          label: "รุ่นอบรมที่จัดทั้งหมด",
          value: `${totalSessions} รุ่น`,
          sub: `ครอบคลุม ${TRAINING_REPORT_ROWS.length} หลักสูตรหลัก`,
          icon: <GraduationCap className="h-5 w-5" />,
          color: "bg-[#EEF4FF] text-[#2563EB]",
        },
        {
          label: "ผู้เรียนจบหลักสูตร",
          value: `${totalCompleted} คน`,
          sub: "ผ่านการเช็คชื่อและแบบทดสอบครบ",
          icon: <BookOpenCheck className="h-5 w-5" />,
          color: "bg-[#DCFCE7] text-[#16A34A]",
        },
        {
          label: "อัตราผ่านเกณฑ์เฉลี่ย",
          value: `${avgPass}%`,
          sub: "คำนวณจากทุกหลักสูตรในปี 2569",
          icon: <TrendingUp className="h-5 w-5" />,
          color: "bg-[#F3E8FF] text-[#7C3AED]",
        },
        {
          label: "ความพึงพอใจเฉลี่ย",
          value: `${avgSat} / 5.0`,
          sub: "จากแบบประเมินหลังจบการอบรม",
          icon: <Star className="h-5 w-5" />,
          color: "bg-[#FEF3C7] text-[#D97706]",
        },
      ];
    }

    if (activeTab === "history") {
      const metCount = TRAINING_HISTORY_ROWS.filter((r) => r.status === "met").length;
      const behindCount = TRAINING_HISTORY_ROWS.filter((r) => r.status === "behind").length;
      const totalHours = TRAINING_HISTORY_ROWS.reduce((a, r) => a + r.totalHours, 0);
      const avgHours = Math.round(totalHours / TRAINING_HISTORY_ROWS.length);
      return [
        {
          label: "ชั่วโมงอบรมเฉลี่ย",
          value: `${avgHours} ชม./คน`,
          sub: "เป้าหมายประจำปี 30 ชม./คน",
          icon: <Clock className="h-5 w-5" />,
          color: "bg-[#EEF4FF] text-[#2563EB]",
        },
        {
          label: "ครบเกณฑ์ชั่วโมงแล้ว",
          value: `${metCount}/${TRAINING_HISTORY_ROWS.length} คน`,
          sub: "สะสมครบ 30 ชั่วโมงขึ้นไป",
          icon: <CheckCircle2 className="h-5 w-5" />,
          color: "bg-[#DCFCE7] text-[#16A34A]",
        },
        {
          label: "ชั่วโมงอบรมสะสมรวม",
          value: `${totalHours} ชม.`,
          sub: "รวมจากกลุ่มตัวอย่างในรายงาน",
          icon: <BarChart3 className="h-5 w-5" />,
          color: "bg-[#F3E8FF] text-[#7C3AED]",
        },
        {
          label: "ต่ำกว่าเกณฑ์เป้าหมาย",
          value: `${behindCount} คน`,
          sub: "ควรแจ้งเตือนลงทะเบียนอบรมเพิ่ม",
          icon: <Users className="h-5 w-5" />,
          color: "bg-[#FEF3C7] text-[#D97706]",
        },
      ];
    }

    if (activeTab === "budget") {
      const totalAlloc = TRAINING_BUDGET_ROWS.reduce((a, r) => a + r.allocated, 0);
      const totalSpent = TRAINING_BUDGET_ROWS.reduce((a, r) => a + r.spent, 0);
      const totalReserved = TRAINING_BUDGET_ROWS.reduce((a, r) => a + r.reserved, 0);
      const remaining = totalAlloc - totalSpent - totalReserved;
      const utilPct = Math.round(((totalSpent + totalReserved) / totalAlloc) * 100);
      return [
        {
          label: "งบจัดสรรรวมทั้งหมด",
          value: `฿${(totalAlloc / 1000000).toFixed(2)}M`,
          sub: "งบประมาณฝึกอบรมประจำปี 2569",
          icon: <Wallet className="h-5 w-5" />,
          color: "bg-[#EEF4FF] text-[#2563EB]",
        },
        {
          label: "ใช้จ่ายจริงแล้ว",
          value: `฿${(totalSpent / 1000000).toFixed(2)}M`,
          sub: `เบิกจ่ายแล้ว ${Math.round((totalSpent / totalAlloc) * 100)}% ของงบรวม`,
          icon: <PieChart className="h-5 w-5" />,
          color: "bg-[#F3E8FF] text-[#7C3AED]",
        },
        {
          label: "จองงบไว้รอจัดอบรม",
          value: `฿${(totalReserved / 1000).toLocaleString("th-TH")}K`,
          sub: `รวมอัตราการใช้งบ ${utilPct}%`,
          icon: <Clock className="h-5 w-5" />,
          color: "bg-[#FEF3C7] text-[#D97706]",
        },
        {
          label: "งบประมาณคงเหลือ",
          value: `฿${(remaining / 1000).toLocaleString("th-TH")}K`,
          sub: "พร้อมจัดสรรสำหรับรุ่นอบรมเพิ่มเติม",
          icon: <CheckCircle2 className="h-5 w-5" />,
          color: "bg-[#DCFCE7] text-[#16A34A]",
        },
      ];
    }

    const totalHeadcount = PERF_REPORT_ROWS.reduce((a, r) => a + r.headcount, 0);
    const totalEval = PERF_REPORT_ROWS.reduce((a, r) => a + r.evaluatedCount, 0);
    const totalGradeA = PERF_REPORT_ROWS.reduce((a, r) => a + r.gradeA, 0);
    const avgScore = (
      PERF_REPORT_ROWS.reduce((a, r) => a + r.avgScore, 0) / PERF_REPORT_ROWS.length
    ).toFixed(2);
    return [
      {
        label: "อัตราประเมินครบถ้วน",
        value: `${Math.round((totalEval / totalHeadcount) * 100)}%`,
        sub: `ประเมินแล้ว ${totalEval} จาก ${totalHeadcount} คน`,
        icon: <CheckCircle2 className="h-5 w-5" />,
        color: "bg-[#DCFCE7] text-[#16A34A]",
      },
      {
        label: "คะแนนประเมินเฉลี่ย",
        value: `${avgScore} / 5.0`,
        sub: "ภาพรวมทุกฝ่ายงานในองค์กร",
        icon: <TrendingUp className="h-5 w-5" />,
        color: "bg-[#EEF4FF] text-[#2563EB]",
      },
      {
        label: "พนักงานเกรด A",
        value: `${totalGradeA} คน`,
        sub: `คิดเป็น ${Math.round((totalGradeA / totalEval) * 100)}% ของผู้ประเมิน`,
        icon: <Award className="h-5 w-5" />,
        color: "bg-[#F3E8FF] text-[#7C3AED]",
      },
      {
        label: "ผู้เข้าแผน PIP",
        value: `${PERF_REPORT_ROWS.reduce((a, r) => a + r.pipCount, 0)} คน`,
        sub: "อยู่ระหว่างติดตามแผนปรับปรุงผลงาน",
        icon: <Users className="h-5 w-5" />,
        color: "bg-[#FEF3C7] text-[#D97706]",
      },
    ];
  }, [activeTab]);

  const meta = TAB_META[activeTab];

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#1E293B]">{meta.title}</h1>
            <InfoHint content={meta.hint} />
          </div>
          <p className="text-sm text-[#64748B]">{meta.subtitle}</p>
        </div>

        <Tooltip content="ศูนย์ส่งออกรายงานสรุปผู้บริหาร (รองรับ Excel CSV และ PDF Print)">
          <Button
            variant="primary"
            leftIcon={<Download className="h-4 w-4" />}
            onClick={() => setExportOpen(true)}
          >
            ศูนย์ส่งออกรายงาน
          </Button>
        </Tooltip>
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
        {activeTab === "performance" && (
          <PerformanceReportPanel rows={PERF_REPORT_ROWS} onNotify={notify} />
        )}
        {activeTab === "training" && (
          <TrainingSummaryReportPanel rows={TRAINING_REPORT_ROWS} onNotify={notify} />
        )}
        {activeTab === "history" && (
          <TrainingHistoryReportPanel rows={TRAINING_HISTORY_ROWS} onNotify={notify} />
        )}
        {activeTab === "budget" && (
          <TrainingBudgetReportPanel rows={TRAINING_BUDGET_ROWS} onNotify={notify} />
        )}
        {activeTab === "skill-gap" && (
          <SkillGapReportPanel rows={SKILL_GAP_REPORT_ROWS} onNotify={notify} />
        )}
        {activeTab === "idp" && <IdpReportPanel rows={IDP_REPORT_ROWS} onNotify={notify} />}
        {activeTab === "talent-succession" && (
          <TalentSuccessionReportPanel
            rows={TALENT_SUCCESSION_REPORT_ROWS}
            onNotify={notify}
          />
        )}
        {activeTab === "certificates" && (
          <CertificateReportPanel rows={CERTIFICATE_REPORT_ROWS} onNotify={notify} />
        )}
      </Card>

      {/* Enterprise Export Center Modal */}
      <Modal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        title="ศูนย์ส่งออกรายงาน HRD (Export Center)"
        description="เลือกรูปแบบไฟล์และช่วงเวลาที่ต้องการส่งออกรายงานสรุปผู้บริหาร"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setExportOpen(false)}>
              ยกเลิก
            </Button>
            <Button
              variant="primary"
              leftIcon={
                exportFormat === "pdf" ? (
                  <Printer className="h-4 w-4" />
                ) : (
                  <FileSpreadsheet className="h-4 w-4" />
                )
              }
              onClick={handleRunExport}
            >
              {exportFormat === "pdf" ? "พิมพ์ / บันทึก PDF" : "ดาวน์โหลด CSV"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="รูปแบบไฟล์ส่งออก (Export Format)"
            value={exportFormat}
            onChange={(v) => setExportFormat(v as "csv" | "pdf")}
            options={[
              { value: "csv", label: "Excel CSV (UTF-8 ภาษาไทยสมบูรณ์)" },
              { value: "pdf", label: "PDF Executive Summary (Print View)" },
            ]}
          />
          <Select
            label="ช่วงเวลาข้อมูล (Reporting Period)"
            value={exportPeriod}
            onChange={setExportPeriod}
            options={[
              { value: "fy2569", label: "ประจำปีงบประมาณ 2569 (ทั้งปี)" },
              { value: "q4-2569", label: "ไตรมาส 4 / 2569" },
              { value: "h2-2569", label: "ครึ่งปีหลัง (H2 / 2569)" },
            ]}
          />
        </div>
      </Modal>
    </div>
  );
}
