"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Award,
  Briefcase,
  CheckCircle2,
  Compass,
  GitBranch,
  Layers,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { Card, InfoHint, Tooltip } from "@/components/ui";
import {
  INITIAL_CAREER_PATHS,
  INITIAL_CAREER_REQUIREMENTS,
  INITIAL_EMPLOYEE_CAREER_PLANS,
  INITIAL_JOB_FAMILIES,
  type CareerPathItem,
  type CareerRequirementItem,
  type EmployeeCareerPlanItem,
  type JobFamilyItem,
} from "@/data/mock/careerPathData";
import { JobFamilyPanel } from "./JobFamilyPanel";
import { CareerLadderPanel } from "./CareerLadderPanel";
import { CareerRequirementsPanel } from "./CareerRequirementsPanel";
import { EmployeeCareerPlanPanel } from "./EmployeeCareerPlanPanel";

type CareerTabKey = "families" | "paths" | "requirements" | "plans";
const VALID_TABS: CareerTabKey[] = ["families", "paths", "requirements", "plans"];

const TAB_META: Record<CareerTabKey, { title: string; subtitle: string; hint: string }> = {
  families: {
    title: "กลุ่มสายงาน (Job Family)",
    subtitle: "จัดหมวดหมู่กลุ่มสายงานหลักขององค์กร เพื่อใช้เป็นโครงสร้างอ้างอิงสำหรับ Career Path และสมรรถนะ",
    hint: "กลุ่มสายงานช่วยจัดกลุ่มตำแหน่งที่มีลักษณะงานและทักษะใกล้เคียงกันให้ง่ายต่อการวางเส้นทางเติบโต",
  },
  paths: {
    title: "เส้นทางความก้าวหน้า (Career Path)",
    subtitle: "กำหนดขั้นบันไดการเติบโตของแต่ละกลุ่มสายงาน รองรับทั้ง Management Track, Specialist Track และ Dual Track",
    hint: "พนักงานสามารถเห็นลำดับขั้นตำแหน่งถัดไปได้อย่างโปร่งใสทั้งสายบริหารและสายผู้เชี่ยวชาญ",
  },
  requirements: {
    title: "เกณฑ์การเลื่อนระดับ (Career Requirements)",
    subtitle: "กำหนดคุณสมบัติขั้นต่ำในการเลื่อนระดับ ได้แก่ อายุงาน เกรดประเมินผล สมรรถนะ และใบรับรองบังคับ",
    hint: "ใช้เป็นมาตรฐานกลางในการประเมินความพร้อมของพนักงานก่อนพิจารณาเลื่อนตำแหน่ง",
  },
  plans: {
    title: "แผนเส้นทางอาชีพพนักงาน (Employee Career Plan)",
    subtitle: "ติดตามเป้าหมายตำแหน่งถัดไป เปอร์เซ็นต์ความพร้อม ระยะเวลาเป้าหมาย และพี่เลี้ยงดูแลของพนักงานแต่ละคน",
    hint: "พนักงานที่มีความพร้อม ≥ 90% จะถูกจัดสถานะ 'พร้อมเลื่อนระดับ' เพื่อนำไปพิจารณาร่วมกับ Talent & Succession",
  },
};

export function CareerWorkspace() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as CareerTabKey | null;
  const activeTab: CareerTabKey = tabParam && VALID_TABS.includes(tabParam) ? tabParam : "families";

  const [families, setFamilies] = useState<JobFamilyItem[]>(INITIAL_JOB_FAMILIES);
  const [paths, setPaths] = useState<CareerPathItem[]>(INITIAL_CAREER_PATHS);
  const [requirements, setRequirements] = useState<CareerRequirementItem[]>(
    INITIAL_CAREER_REQUIREMENTS
  );
  const [plans, setPlans] = useState<EmployeeCareerPlanItem[]>(INITIAL_EMPLOYEE_CAREER_PLANS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const kpiCards = useMemo(() => {
    if (activeTab === "paths") {
      const mgmtCount = paths.filter((p) => p.trackType === "Management").length;
      const specCount = paths.filter((p) => p.trackType === "Specialist").length;
      const avgSteps =
        paths.length > 0
          ? (paths.reduce((acc, p) => acc + p.steps.length, 0) / paths.length).toFixed(1)
          : "0";
      return [
        {
          label: "เส้นทางอาชีพทั้งหมด",
          value: `${paths.length} เส้นทาง`,
          sub: "ครอบคลุมสายงานหลักขององค์กร",
          icon: <GitBranch className="h-5 w-5" />,
          color: "bg-[#EEF4FF] text-[#2563EB]",
        },
        {
          label: "Management Track",
          value: `${mgmtCount} เส้นทาง`,
          sub: "สายบริหารทีมและผู้จัดการ",
          icon: <Briefcase className="h-5 w-5" />,
          color: "bg-[#F3E8FF] text-[#7C3AED]",
        },
        {
          label: "Specialist Track",
          value: `${specCount} เส้นทาง`,
          sub: "สายผู้เชี่ยวชาญเฉพาะทาง",
          icon: <Sparkles className="h-5 w-5" />,
          color: "bg-[#DCFCE7] text-[#16A34A]",
        },
        {
          label: "จำนวนขั้นเฉลี่ย",
          value: `${avgSteps} ระดับ`,
          sub: "ต่อ 1 เส้นทางความก้าวหน้า",
          icon: <TrendingUp className="h-5 w-5" />,
          color: "bg-[#FEF3C7] text-[#D97706]",
        },
      ];
    }

    if (activeTab === "requirements") {
      const avgTenure =
        requirements.length > 0
          ? (
              requirements.reduce((acc, r) => acc + r.minTenureYears, 0) / requirements.length
            ).toFixed(1)
          : "0";
      return [
        {
          label: "เกณฑ์เลื่อนระดับที่กำหนด",
          value: `${requirements.length} เส้นทาง`,
          sub: "มาตรฐานกลางในการพิจารณาเลื่อนขั้น",
          icon: <ShieldCheck className="h-5 w-5" />,
          color: "bg-[#EEF4FF] text-[#2563EB]",
        },
        {
          label: "อายุงานขั้นต่ำเฉลี่ย",
          value: `${avgTenure} ปี`,
          sub: "ระยะเวลาสะสมประสบการณ์ในระดับเดิม",
          icon: <Layers className="h-5 w-5" />,
          color: "bg-[#F3E8FF] text-[#7C3AED]",
        },
        {
          label: "อ้างอิงเกรดประเมิน",
          value: "100%",
          sub: "เชื่อมโยงผลประเมิน PMS ทุกตำแหน่ง",
          icon: <Award className="h-5 w-5" />,
          color: "bg-[#DCFCE7] text-[#16A34A]",
        },
        {
          label: "กำหนดใบรับรองบังคับ",
          value: `${requirements.length} รายการ`,
          sub: "ต้องผ่านหลักสูตร/ใบรับรองตามเกณฑ์",
          icon: <CheckCircle2 className="h-5 w-5" />,
          color: "bg-[#FEF3C7] text-[#D97706]",
        },
      ];
    }

    if (activeTab === "plans") {
      const readyCount = plans.filter((p) => p.status === "ready-now").length;
      const devCount = plans.filter((p) => p.status === "developing").length;
      const avgReadiness =
        plans.length > 0
          ? Math.round(plans.reduce((acc, p) => acc + p.readiness, 0) / plans.length)
          : 0;
      return [
        {
          label: "แผนเส้นทางอาชีพทั้งหมด",
          value: `${plans.length} คน`,
          sub: "พนักงานที่วางเป้าหมายตำแหน่งถัดไป",
          icon: <Compass className="h-5 w-5" />,
          color: "bg-[#EEF4FF] text-[#2563EB]",
        },
        {
          label: "พร้อมเลื่อนระดับแล้ว",
          value: `${readyCount} คน`,
          sub: "ความพร้อมตั้งแต่ 90% ขึ้นไป",
          icon: <CheckCircle2 className="h-5 w-5" />,
          color: "bg-[#DCFCE7] text-[#16A34A]",
        },
        {
          label: "ความพร้อมเฉลี่ย",
          value: `${avgReadiness}%`,
          sub: "คำนวณเทียบกับเกณฑ์ Career Requirements",
          icon: <TrendingUp className="h-5 w-5" />,
          color: "bg-[#F3E8FF] text-[#7C3AED]",
        },
        {
          label: "กำลังเตรียมความพร้อม",
          value: `${devCount} คน`,
          sub: "อยู่ระหว่างพัฒนาตามแผน IDP",
          icon: <Sparkles className="h-5 w-5" />,
          color: "bg-[#FEF3C7] text-[#D97706]",
        },
      ];
    }

    const totalPositions = families.reduce((acc, f) => acc + f.positionsCount, 0);
    const totalEmployees = families.reduce((acc, f) => acc + f.employeesCount, 0);
    const activeFamilies = families.filter((f) => f.active).length;
    return [
      {
        label: "กลุ่มสายงานทั้งหมด",
        value: `${families.length} กลุ่ม`,
        sub: `เปิดใช้งาน ${activeFamilies} กลุ่มสายงาน`,
        icon: <Briefcase className="h-5 w-5" />,
        color: "bg-[#EEF4FF] text-[#2563EB]",
      },
      {
        label: "ตำแหน่งงานที่จัดกลุ่ม",
        value: `${totalPositions} ตำแหน่ง`,
        sub: "เชื่อมโยงเข้าโครงสร้างสายอาชีพแล้ว",
        icon: <Layers className="h-5 w-5" />,
        color: "bg-[#F3E8FF] text-[#7C3AED]",
      },
      {
        label: "พนักงานในโครงสร้าง",
        value: `${totalEmployees} คน`,
        sub: "ครอบคลุมทุกฝ่ายงานหลัก",
        icon: <Users className="h-5 w-5" />,
        color: "bg-[#DCFCE7] text-[#16A34A]",
      },
      {
        label: "เส้นทางอาชีพที่ผูกไว้",
        value: `${paths.length} เส้นทาง`,
        sub: "รองรับ Management & Specialist",
        icon: <GitBranch className="h-5 w-5" />,
        color: "bg-[#FEF3C7] text-[#D97706]",
      },
    ];
  }, [activeTab, families, paths, requirements, plans]);

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
        {activeTab === "families" && (
          <JobFamilyPanel items={families} onChange={setFamilies} onNotify={notify} />
        )}
        {activeTab === "paths" && (
          <CareerLadderPanel items={paths} onChange={setPaths} onNotify={notify} />
        )}
        {activeTab === "requirements" && (
          <CareerRequirementsPanel
            items={requirements}
            onChange={setRequirements}
            onNotify={notify}
          />
        )}
        {activeTab === "plans" && (
          <EmployeeCareerPlanPanel items={plans} onChange={setPlans} onNotify={notify} />
        )}
      </Card>
    </div>
  );
}
