"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  FileText,
  Layers,
  ListChecks,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Card, InfoHint } from "@/components/ui";
import {
  INITIAL_EMPLOYEE_IDPS,
  INITIAL_IDP_ACTIVITIES,
  INITIAL_IDP_EVALUATIONS,
  INITIAL_IDP_TRACKINGS,
  type EmployeeIdpItem,
  type IdpActivityItem,
  type IdpEvaluationItem,
  type IdpTrackingItem,
} from "@/data/mock/idpData";
import { EmployeeIdpPanel } from "./EmployeeIdpPanel";
import { IdpActivitiesPanel } from "./IdpActivitiesPanel";
import { IdpProgressPanel } from "./IdpProgressPanel";
import { IdpEvaluationPanel } from "./IdpEvaluationPanel";

type IdpTabKey = "plans" | "activities" | "tracking" | "evaluation";
const VALID_TABS: IdpTabKey[] = ["plans", "activities", "tracking", "evaluation"];

const TAB_META: Record<IdpTabKey, { title: string; subtitle: string; hint: string }> = {
  plans: {
    title: "แผนพัฒนารายบุคคล (Employee IDP)",
    subtitle: "กำหนดและอนุมัติแผนพัฒนาทักษะรายบุคคลประจำปี เชื่อมโยงจากผลประเมินและช่องว่างทักษะ (Skill Gap)",
    hint: "หัวหน้างานสามารถตรวจสอบเป้าหมายการพัฒนาและกดอนุมัติแผน IDP ได้จากหน้านี้",
  },
  activities: {
    title: "กิจกรรมการพัฒนา (70-20-10 Activities)",
    subtitle: "บริหารจัดการกิจกรรมการเรียนรู้ตามหลัก 70% On-the-Job, 20% Coaching/Mentoring และ 10% Training",
    hint: "สัดส่วน 70-20-10 ช่วยให้การพัฒนาพนักงานเกิดขึ้นได้จริงจากการปฏิบัติงานและมีพี่เลี้ยงดูแล",
  },
  tracking: {
    title: "ติดตามความคืบหน้า IDP (Progress Tracking)",
    subtitle: "ติดตามหลักฐานการพัฒนา รายงานความก้าวหน้า และบันทึกคำแนะนำ (Feedback) จากหัวหน้างานเป็นระยะ",
    hint: "กิจกรรมที่มีความคืบหน้าต่ำกว่าเกณฑ์จะแสดงสถานะ 'ล่าช้ากว่าแผน' เพื่อเร่งติดตามช่วยเหลือ",
  },
  evaluation: {
    title: "ประเมินผลแผนพัฒนา (IDP Evaluation)",
    subtitle: "สรุปผลลัพธ์การพัฒนาปลายรอบ เปรียบเทียบระดับทักษะก่อนและหลังการพัฒนาตามแผน IDP",
    hint: "ระดับทักษะที่เพิ่มขึ้นจะช่วยยืนยันความคุ้มค่าของการพัฒนาและนำไปใช้วางแผน Career Path ต่อ",
  },
};

export function IdpWorkspace() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as IdpTabKey | null;
  const activeTab: IdpTabKey = tabParam && VALID_TABS.includes(tabParam) ? tabParam : "plans";

  const [plans, setPlans] = useState<EmployeeIdpItem[]>(INITIAL_EMPLOYEE_IDPS);
  const [activities, setActivities] = useState<IdpActivityItem[]>(INITIAL_IDP_ACTIVITIES);
  const [trackings, setTrackings] = useState<IdpTrackingItem[]>(INITIAL_IDP_TRACKINGS);
  const [evaluations, setEvaluations] = useState<IdpEvaluationItem[]>(INITIAL_IDP_EVALUATIONS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const kpiCards = useMemo(() => {
    if (activeTab === "activities") {
      const doneCount = activities.filter((a) => a.status === "done").length;
      const ojtCount = activities.filter((a) => a.method === "70-ojt").length;
      const coachingCount = activities.filter((a) => a.method === "20-coaching").length;
      const trainingCount = activities.filter((a) => a.method === "10-training").length;
      return [
        {
          label: "กิจกรรมพัฒนาทั้งหมด",
          value: `${activities.length} รายการ`,
          sub: `ดำเนินการเสร็จแล้ว ${doneCount} รายการ`,
          icon: <ListChecks className="h-5 w-5" />,
          color: "bg-[#EEF4FF] text-[#2563EB]",
        },
        {
          label: "70% On-the-Job",
          value: `${ojtCount} รายการ`,
          sub: "การเรียนรู้จากหน้างานและโปรเจกต์จริง",
          icon: <Layers className="h-5 w-5" />,
          color: "bg-[#DCFCE7] text-[#16A34A]",
        },
        {
          label: "20% Coaching / Mentoring",
          value: `${coachingCount} รายการ`,
          sub: "การโค้ชชิ่งและพี่เลี้ยงโดยผู้เชี่ยวชาญ",
          icon: <Sparkles className="h-5 w-5" />,
          color: "bg-[#FEF3C7] text-[#D97706]",
        },
        {
          label: "10% Formal Training",
          value: `${trainingCount} รายการ`,
          sub: "คอร์สอบรมและบทเรียนออนไลน์ (LMS)",
          icon: <Award className="h-5 w-5" />,
          color: "bg-[#F3E8FF] text-[#7C3AED]",
        },
      ];
    }

    if (activeTab === "tracking") {
      const onTrack = trackings.filter((t) => t.status === "on-track").length;
      const atRisk = trackings.filter((t) => t.status === "at-risk").length;
      const completed = trackings.filter((t) => t.status === "completed").length;
      const avgPct =
        trackings.length > 0
          ? Math.round(trackings.reduce((acc, t) => acc + t.progress, 0) / trackings.length)
          : 0;
      return [
        {
          label: "ความคืบหน้าเฉลี่ย",
          value: `${avgPct}%`,
          sub: `จากรายการติดตามทั้งหมด ${trackings.length} รายการ`,
          icon: <TrendingUp className="h-5 w-5" />,
          color: "bg-[#EEF4FF] text-[#2563EB]",
        },
        {
          label: "บรรลุผลแล้ว",
          value: `${completed} รายการ`,
          sub: "ส่งหลักฐานและรับรองผลครบถ้วน",
          icon: <CheckCircle2 className="h-5 w-5" />,
          color: "bg-[#DCFCE7] text-[#16A34A]",
        },
        {
          label: "ตามแผนที่วางไว้",
          value: `${onTrack} รายการ`,
          sub: "อยู่ระหว่างดำเนินการตามกำหนด",
          icon: <Clock className="h-5 w-5" />,
          color: "bg-[#F3E8FF] text-[#7C3AED]",
        },
        {
          label: "ล่าช้ากว่าแผน (At Risk)",
          value: `${atRisk} รายการ`,
          sub: "ควรเข้าช่วยโค้ชหรือปรับตารางเวลา",
          icon: <AlertTriangle className="h-5 w-5" />,
          color: "bg-[#FEF3C7] text-[#D97706]",
        },
      ];
    }

    if (activeTab === "evaluation") {
      const evaluated = evaluations.filter((e) => e.result !== "pending");
      const achieved = evaluations.filter(
        (e) => e.result === "achieved" || e.result === "exceed"
      ).length;
      const pending = evaluations.filter((e) => e.result === "pending").length;
      const avgGrowth =
        evaluated.length > 0
          ? (
              evaluated.reduce(
                (acc, e) => acc + ((e.afterLevel ?? e.beforeLevel) - e.beforeLevel),
                0
              ) / evaluated.length
            ).toFixed(1)
          : "0.0";
      return [
        {
          label: "ประเมินผลแล้ว",
          value: `${evaluated.length}/${evaluations.length} คน`,
          sub: `รอประเมินปลายรอบ ${pending} คน`,
          icon: <ClipboardCheck className="h-5 w-5" />,
          color: "bg-[#EEF4FF] text-[#2563EB]",
        },
        {
          label: "บรรลุ / สูงกว่าเป้า",
          value: `${achieved} คน`,
          sub: "พัฒนาทักษะได้ตามเป้าหมาย IDP",
          icon: <Award className="h-5 w-5" />,
          color: "bg-[#DCFCE7] text-[#16A34A]",
        },
        {
          label: "ระดับทักษะเพิ่มเฉลี่ย",
          value: `+${avgGrowth} Lv`,
          sub: "เทียบก่อนและหลังเข้าแผน IDP",
          icon: <TrendingUp className="h-5 w-5" />,
          color: "bg-[#F3E8FF] text-[#7C3AED]",
        },
        {
          label: "กำลังพัฒนาต่อเนื่อง",
          value: `${evaluations.filter((e) => e.result === "developing").length} คน`,
          sub: "ต่อยอดแผนในรอบถัดไป",
          icon: <Clock className="h-5 w-5" />,
          color: "bg-[#FEF3C7] text-[#D97706]",
        },
      ];
    }

    const completedCount = plans.filter((p) => p.status === "completed").length;
    const draftCount = plans.filter((p) => p.status === "draft").length;
    const avgProgress =
      plans.length > 0
        ? Math.round(plans.reduce((acc, p) => acc + p.progress, 0) / plans.length)
        : 0;
    return [
      {
        label: "แผน IDP ทั้งหมด",
        value: `${plans.length} แผน`,
        sub: "ประจำรอบพัฒนาปี 2569",
        icon: <FileText className="h-5 w-5" />,
        color: "bg-[#EEF4FF] text-[#2563EB]",
      },
      {
        label: "ความคืบหน้าเฉลี่ย",
        value: `${avgProgress}%`,
        sub: "คำนวณจากทุกแผนที่เปิดใช้งาน",
        icon: <TrendingUp className="h-5 w-5" />,
        color: "bg-[#F3E8FF] text-[#7C3AED]",
      },
      {
        label: "สำเร็จตามแผนแล้ว",
        value: `${completedCount} แผน`,
        sub: "ครบทุกกิจกรรม 100%",
        icon: <CheckCircle2 className="h-5 w-5" />,
        color: "bg-[#DCFCE7] text-[#16A34A]",
      },
      {
        label: "รออนุมัติแผน",
        value: `${draftCount} แผน`,
        sub: "รอหัวหน้างานพิจารณาอนุมัติ",
        icon: <Clock className="h-5 w-5" />,
        color: "bg-[#FEF3C7] text-[#D97706]",
      },
    ];
  }, [activeTab, plans, activities, trackings, evaluations]);

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
          <Card key={kpi.label} className="flex items-start justify-between gap-3 p-5">
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
        ))}
      </div>

      {toastMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700 shadow-xs">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <Card className="p-6">
        {activeTab === "plans" && (
          <EmployeeIdpPanel items={plans} onChange={setPlans} onNotify={notify} />
        )}
        {activeTab === "activities" && (
          <IdpActivitiesPanel items={activities} onChange={setActivities} onNotify={notify} />
        )}
        {activeTab === "tracking" && (
          <IdpProgressPanel items={trackings} onChange={setTrackings} onNotify={notify} />
        )}
        {activeTab === "evaluation" && (
          <IdpEvaluationPanel items={evaluations} onChange={setEvaluations} onNotify={notify} />
        )}
      </Card>
    </div>
  );
}
