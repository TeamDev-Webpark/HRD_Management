"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Award,
  CheckCircle2,
  Clock,
  Compass,
  GraduationCap,
  Layers,
  MonitorPlay,
  Target,
  TrendingUp,
} from "lucide-react";
import { Card, InfoHint, Tooltip } from "@/components/ui";
import {
  ESS_EMPLOYEE_PROFILE,
  INITIAL_ESS_CERTIFICATES,
  INITIAL_ESS_GOALS,
  INITIAL_ESS_IDP,
  INITIAL_ESS_LMS_COURSES,
  INITIAL_ESS_SKILLS,
  INITIAL_ESS_TRAININGS,
  type EssGoalItem,
  type EssIdpActivity,
  type EssTrainingItem,
} from "@/data/mock/essData";
import {
  EssIdpPanel,
  EssOverviewPanel,
  EssPerformancePanel,
  EssSkillsPanel,
} from "./EssPanelsPart1";
import {
  EssCareerPanel,
  EssCertificatesPanel,
  EssLmsPanel,
  EssTrainingPanel,
} from "./EssPanelsPart2";

type EssTabKey =
  | "overview"
  | "performance"
  | "skills"
  | "idp"
  | "training"
  | "lms"
  | "certificates"
  | "career";

const VALID_TABS: EssTabKey[] = [
  "overview",
  "performance",
  "skills",
  "idp",
  "training",
  "lms",
  "certificates",
  "career",
];

const TAB_META: Record<EssTabKey, { title: string; subtitle: string; hint: string }> = {
  overview: {
    title: "บริการตนเองพนักงาน (ESS — ภาพรวมของฉัน)",
    subtitle: "ศูนย์รวมข้อมูลการพัฒนาส่วนตัว เป้าหมายผลงาน การฝึกอบรม และเส้นทางสายอาชีพของคุณ",
    hint: "พนักงานสามารถจัดการงาน HRD ส่วนตัวได้ครบทั้ง 8 เมนูในพื้นที่บริการตนเองนี้",
  },
  performance: {
    title: "เป้าหมายและผลประเมินของฉัน (My Performance)",
    subtitle: "ติดตามความคืบหน้า KPI / OKR ประจำรอบและบันทึกคะแนนประเมินตนเองส่งให้หัวหน้างาน",
    hint: "คลิกปุ่ม 'อัปเดต' เพื่อปรับ % ความคืบหน้าและคะแนนประเมินตนเอง",
  },
  skills: {
    title: "สมรรถนะและทักษะของฉัน (My Competency & Skills)",
    subtitle: "ตรวจสอบระดับสมรรถนะปัจจุบันของคุณเทียบกับเกณฑ์มาตรฐานประจำตำแหน่ง",
    hint: "ทักษะที่มี Gap ติดลบจะเชื่อมโยงไปยังแผนพัฒนา IDP และคอร์สแนะนำในระบบ",
  },
  idp: {
    title: "แผนพัฒนา IDP ของฉัน (My IDP)",
    subtitle: "ติดตามกิจกรรมการพัฒนาส่วนบุคคลตามหลัก 70-20-10 และบันทึกความสำเร็จของแต่ละกิจกรรม",
    hint: "เมื่อทำกิจกรรมเสร็จแล้วสามารถกดปุ่ม 'เสร็จสิ้น' เพื่ออัปเดตความคืบหน้าทันที",
  },
  training: {
    title: "หลักสูตรและลงทะเบียนอบรม (My Training)",
    subtitle: "เลือกดูรุ่นฝึกอบรมที่เปิดรับสมัคร ส่งคำขอลงทะเบียน และติดตามสถานะการอนุมัติจากหัวหน้างาน",
    hint: "ชั่วโมงอบรมที่ผ่านการอนุมัติและเข้าอบรมครบจะถูกนับสะสมเข้าเกณฑ์ 30 ชม./ปี",
  },
  lms: {
    title: "ห้องเรียนออนไลน์ของฉัน (My LMS Courses)",
    subtitle: "ติดตามคอร์สเรียนออนไลน์ที่ลงทะเบียนไว้และคลิกเข้าสู่ห้องเรียนวิดีโอได้ทันที",
    hint: "เรียนจบครบทุกบทเรียนและผ่านแบบทดสอบเพื่อรับ E-Certificate อัตโนมัติ",
  },
  certificates: {
    title: "ใบประกาศนียบัตรของฉัน (My Certificates)",
    subtitle: "จัดเก็บและเปิดดูใบประกาศนียบัตรจากคอร์ส LMS ภายในและใบรับรองวิชาชีพภายนอกของคุณ",
    hint: "คลิกปุ่ม 'เปิดดู' เพื่อแสดงตัวอย่างใบประกาศนียบัตรดิจิทัล",
  },
  career: {
    title: "เส้นทางสายอาชีพของฉัน (My Career Path)",
    subtitle: "มองเห็นลำดับขั้นตำแหน่งถัดไป เปอร์เซ็นต์ความพร้อม และพี่เลี้ยงดูแลการเติบโตในสายงานของคุณ",
    hint: "วางแผนพัฒนาทักษะให้ครบตามเกณฑ์เพื่อเตรียมพร้อมสู่ตำแหน่งเป้าหมาย",
  },
};

export function EssWorkspace() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as EssTabKey | null;
  const activeTab: EssTabKey = tabParam && VALID_TABS.includes(tabParam) ? tabParam : "overview";

  const [goals, setGoals] = useState<EssGoalItem[]>(INITIAL_ESS_GOALS);
  const [idpItems, setIdpItems] = useState<EssIdpActivity[]>(INITIAL_ESS_IDP);
  const [trainings, setTrainings] = useState<EssTrainingItem[]>(INITIAL_ESS_TRAININGS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const kpiCards = useMemo(() => {
    const avgGoalPct = Math.round(goals.reduce((a, g) => a + g.progress, 0) / goals.length);
    const idpDone = idpItems.filter((i) => i.status === "done").length;
    const enrolledCount = trainings.filter((t) => t.enrolled).length;

    return [
      {
        label: "ความคืบหน้า KPI ของฉัน",
        value: `${avgGoalPct}%`,
        sub: `จากเป้าหมายทั้งหมด ${goals.length} ข้อ`,
        icon: <Target className="h-5 w-5" />,
        color: "bg-[#EEF4FF] text-[#2563EB]",
      },
      {
        label: "ชั่วโมงอบรมสะสมปี 2569",
        value: `${ESS_EMPLOYEE_PROFILE.trainingHoursDone}/${ESS_EMPLOYEE_PROFILE.trainingHoursTarget} ชม.`,
        sub: `ลงทะเบียนอบรมเพิ่มแล้ว ${enrolledCount} รุ่น`,
        icon: <GraduationCap className="h-5 w-5" />,
        color: "bg-[#DCFCE7] text-[#16A34A]",
      },
      {
        label: "แผนพัฒนา IDP ของฉัน",
        value: `${idpDone}/${idpItems.length} รายการ`,
        sub: "กิจกรรมพัฒนา 70-20-10 ที่ทำเสร็จ",
        icon: <TrendingUp className="h-5 w-5" />,
        color: "bg-[#F3E8FF] text-[#7C3AED]",
      },
      {
        label: "ใบรับรอง / ความพร้อมอาชีพ",
        value: `${INITIAL_ESS_CERTIFICATES.length} ใบ • ${ESS_EMPLOYEE_PROFILE.careerReadiness}%`,
        sub: `เป้าหมาย: ${ESS_EMPLOYEE_PROFILE.nextTargetRole}`,
        icon:
          activeTab === "lms" ? (
            <MonitorPlay className="h-5 w-5" />
          ) : activeTab === "skills" ? (
            <Layers className="h-5 w-5" />
          ) : activeTab === "career" ? (
            <Compass className="h-5 w-5" />
          ) : activeTab === "certificates" ? (
            <Award className="h-5 w-5" />
          ) : (
            <Clock className="h-5 w-5" />
          ),
        color: "bg-[#FEF3C7] text-[#D97706]",
      },
    ];
  }, [goals, idpItems, trainings, activeTab]);

  const meta = TAB_META[activeTab];

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-[#1E293B]">{meta.title}</h1>
          <InfoHint content={meta.hint} />
        </div>
        <p className="text-sm text-[#64748B]">{meta.subtitle}</p>
      </div>

      {/* 4 White KPI Cards with Hover Tooltips */}
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
        {activeTab === "overview" && <EssOverviewPanel />}
        {activeTab === "performance" && (
          <EssPerformancePanel goals={goals} onChange={setGoals} onNotify={notify} />
        )}
        {activeTab === "skills" && <EssSkillsPanel skills={INITIAL_ESS_SKILLS} />}
        {activeTab === "idp" && (
          <EssIdpPanel items={idpItems} onChange={setIdpItems} onNotify={notify} />
        )}
        {activeTab === "training" && (
          <EssTrainingPanel items={trainings} onChange={setTrainings} onNotify={notify} />
        )}
        {activeTab === "lms" && <EssLmsPanel courses={INITIAL_ESS_LMS_COURSES} />}
        {activeTab === "certificates" && (
          <EssCertificatesPanel certs={INITIAL_ESS_CERTIFICATES} />
        )}
        {activeTab === "career" && <EssCareerPanel />}
      </Card>
    </div>
  );
}
