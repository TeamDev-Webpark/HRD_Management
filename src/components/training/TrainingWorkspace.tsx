"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Award,
  BookOpen,
  CalendarClock,
  CalendarRange,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  UserCheck,
  UserPlus,
  Wallet,
} from "lucide-react";
import { Card, CardContent, InfoHint, StatCard } from "@/components/ui";
import {
  INITIAL_ATTENDANCE,
  INITIAL_ENROLLMENTS,
  INITIAL_TRAINING_RESULTS,
  INITIAL_TRAINING_SESSIONS,
} from "@/data/mock/trainingOperations";
import {
  INITIAL_ANNUAL_PLAN,
  INITIAL_COURSE_CATALOG,
  INITIAL_TRAINING_NEEDS,
} from "@/data/mock/trainingPlanning";
import { INITIAL_BUDGET_ALLOCATIONS, INITIAL_TRAINERS } from "@/data/mock/trainingResources";
import { AnnualPlanPanel } from "./AnnualPlanPanel";
import { CourseCatalogPanel } from "./CourseCatalogPanel";
import { TrainerProviderPanel } from "./TrainerProviderPanel";
import { TrainingAttendancePanel } from "./TrainingAttendancePanel";
import { TrainingBudgetPanel } from "./TrainingBudgetPanel";
import { TrainingEnrollmentPanel } from "./TrainingEnrollmentPanel";
import { TrainingNeedsPanel } from "./TrainingNeedsPanel";
import { TrainingResultsPanel } from "./TrainingResultsPanel";
import { TrainingSessionPanel } from "./TrainingSessionPanel";

type TrainingTabKey =
  | "needs"
  | "catalog"
  | "annual-plan"
  | "budget"
  | "trainers"
  | "sessions"
  | "enrollments"
  | "attendance"
  | "results";

const TRAINING_TABS: {
  key: TrainingTabKey;
  label: string;
  labelEn: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    key: "needs",
    label: "สำรวจความต้องการอบรม",
    labelEn: "Training Needs (TNA)",
    description: "รวบรวมและพิจารณาคำขอฝึกอบรมจาก Skill Gap, IDP และหัวหน้างาน",
    icon: ClipboardList,
  },
  {
    key: "catalog",
    label: "คลังหลักสูตร",
    labelEn: "Course Catalog",
    description: "จัดการรายการหลักสูตรมาตรฐานขององค์กร ทั้ง In-House, Public, Workshop และ LMS",
    icon: BookOpen,
  },
  {
    key: "annual-plan",
    label: "แผนฝึกอบรมประจำปี",
    labelEn: "Annual Training Plan",
    description: "วางแผนรอบการจัดอบรมและจัดสรรงบประมาณรายไตรมาส (Q1–Q4)",
    icon: CalendarRange,
  },
  {
    key: "budget",
    label: "งบประมาณฝึกอบรม",
    labelEn: "Training Budget",
    description: "จัดสรรและติดตามการใช้งบประมาณฝึกอบรมแยกตามแผนกและ Cost Center",
    icon: Wallet,
  },
  {
    key: "trainers",
    label: "วิทยากรและสถาบัน",
    labelEn: "Trainer & Provider",
    description: "ทะเบียนวิทยากรภายใน วิทยากรภายนอก และสถาบันฝึกอบรมพร้อมคะแนนประเมิน",
    icon: UserCheck,
  },
  {
    key: "sessions",
    label: "รุ่นฝึกอบรม",
    labelEn: "Training Sessions",
    description: "จัดการกำหนดการเปิดรุ่น สถานที่/ออนไลน์ จำนวนที่นั่ง และสถานะการจัดอบรม",
    icon: CalendarClock,
  },
  {
    key: "enrollments",
    label: "ลงทะเบียนและอนุมัติ",
    labelEn: "Enrollment & Approval",
    description: "พิจารณาคำขอลงทะเบียนเข้าอบรมของพนักงานตามสายการอนุมัติ HRM",
    icon: UserPlus,
  },
  {
    key: "attendance",
    label: "เช็คชื่อเข้าอบรม",
    labelEn: "Attendance Tracking",
    description: "บันทึกเวลาเข้าอบรม มาสาย หรือขาดอบรมรายรุ่นแบบเรียลไทม์",
    icon: ClipboardCheck,
  },
  {
    key: "results",
    label: "ผลการอบรมและประวัติ",
    labelEn: "Training Results & History",
    description: "บันทึกคะแนน Pre/Post-test ความพึงพอใจ ใบรับรอง และประวัติการอบรมพนักงาน",
    icon: Award,
  },
];

export function TrainingWorkspace() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as TrainingTabKey | null;
  const activeMeta = TRAINING_TABS.find((t) => t.key === tabParam) ?? TRAINING_TABS[0];
  const activeTab: TrainingTabKey = activeMeta.key;

  const goToTab = (tab: TrainingTabKey) => {
    router.push(`/training?tab=${tab}`);
  };

  const [toast, setToast] = useState<string | null>(null);

  const [needs, setNeeds] = useState(INITIAL_TRAINING_NEEDS);
  const [courses, setCourses] = useState(INITIAL_COURSE_CATALOG);
  const [plans, setPlans] = useState(INITIAL_ANNUAL_PLAN);
  const [budgets, setBudgets] = useState(INITIAL_BUDGET_ALLOCATIONS);
  const [trainers, setTrainers] = useState(INITIAL_TRAINERS);
  const [sessions, setSessions] = useState(INITIAL_TRAINING_SESSIONS);
  const [enrollments, setEnrollments] = useState(INITIAL_ENROLLMENTS);
  const [attendance, setAttendance] = useState(INITIAL_ATTENDANCE);
  const [results, setResults] = useState(INITIAL_TRAINING_RESULTS);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  };

  const pendingNeeds = needs.filter((n) => n.status === "pending").length;
  const activeCourses = courses.filter((c) => c.active).length;
  const openSessions = sessions.filter((s) => s.status === "open" || s.status === "ongoing").length;
  const pendingEnrollments = enrollments.filter((e) => e.status === "pending").length;
  const totalAllocatedBudget = budgets.reduce((sum, b) => sum + b.allocated, 0);
  const totalUsedBudget = budgets.reduce((sum, b) => sum + b.spent + b.committed, 0);
  const budgetPct = totalAllocatedBudget
    ? Math.round((totalUsedBudget / totalAllocatedBudget) * 100)
    : 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#1E293B]">
              {activeMeta.label}
            </h2>
            <span className="rounded-md bg-[#EFF6FF] px-2 py-0.5 text-[11px] font-medium text-[#2563EB]">
              {activeMeta.labelEn}
            </span>
            <InfoHint
              title={activeMeta.labelEn}
              content={activeMeta.description}
            />
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

      {/* Row 1: 4 Clean White Clickable KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          tone="blue"
          title="คำขอ TNA / ลงทะเบียน"
          tooltip={`คำขอความต้องการอบรมรอพิจารณา ${pendingNeeds} รายการ • คำขอลงทะเบียนรออนุมัติ ${pendingEnrollments} รายการ (คลิกเพื่อไปที่หน้าพิจารณา)`}
          value={`${pendingNeeds + pendingEnrollments}`}
          unit="รอดำเนินการ"
          icon={<ClipboardList className="h-5 w-5" />}
          footnote={`TNA ${pendingNeeds} • ลงทะเบียน ${pendingEnrollments}`}
          active={activeTab === "needs" || activeTab === "enrollments"}
          onClick={() => goToTab(activeTab === "needs" ? "enrollments" : "needs")}
        />
        <StatCard
          tone="yellow"
          title="คลังหลักสูตรทั้งหมด"
          tooltip="หลักสูตรมาตรฐานทั้งหมดที่พร้อมเปิดสอนในองค์กร (คลิกเพื่อเปิดคลังหลักสูตร)"
          value={`${courses.length}`}
          unit="หลักสูตร"
          icon={<BookOpen className="h-5 w-5" />}
          footnote={`เปิดใช้งาน ${activeCourses} หลักสูตร`}
          active={activeTab === "catalog"}
          onClick={() => goToTab("catalog")}
        />
        <StatCard
          tone="purple"
          title="รุ่นอบรมที่เปิดดำเนินการ"
          tooltip={`กำลังเปิดรับสมัครหรือกำลังอบรม ${openSessions} รุ่น จากทั้งหมด ${sessions.length} รุ่น (คลิกเพื่อไปที่หน้ารุ่นฝึกอบรม)`}
          value={`${openSessions}/${sessions.length}`}
          unit="รุ่น"
          icon={<CalendarClock className="h-5 w-5" />}
          footnote={`วิทยากร ${trainers.filter((t) => t.active).length}/${trainers.length} พร้อมสอน`}
          active={activeTab === "sessions"}
          onClick={() => goToTab("sessions")}
        />
        <StatCard
          tone="green"
          title="งบประมาณฝึกอบรมปี 2569"
          tooltip={`เบิกจ่ายและจองงบไว้แล้ว ฿${totalUsedBudget.toLocaleString()} จาก ฿${totalAllocatedBudget.toLocaleString()} (คลิกเพื่อดูรายละเอียดงบประมาณ)`}
          value={`฿${(totalAllocatedBudget / 1_000_000).toFixed(2)}M`}
          icon={<Wallet className="h-5 w-5" />}
          progress={{
            percent: budgetPct,
            label: `เบิกจ่ายและจองงบไว้แล้ว`,
          }}
          footnote={`${budgetPct}%`}
          active={activeTab === "budget"}
          onClick={() => goToTab("budget")}
        />
      </div>

      {/* Row 2: Active Page Card */}
      <Card className="overflow-hidden">
        <CardContent className="p-5 sm:p-6">
          {activeTab === "needs" && (
            <TrainingNeedsPanel items={needs} onChange={setNeeds} onNotify={showToast} />
          )}
          {activeTab === "catalog" && (
            <CourseCatalogPanel items={courses} onChange={setCourses} onNotify={showToast} />
          )}
          {activeTab === "annual-plan" && (
            <AnnualPlanPanel items={plans} onChange={setPlans} onNotify={showToast} />
          )}
          {activeTab === "budget" && (
            <TrainingBudgetPanel items={budgets} onChange={setBudgets} onNotify={showToast} />
          )}
          {activeTab === "trainers" && (
            <TrainerProviderPanel items={trainers} onChange={setTrainers} onNotify={showToast} />
          )}
          {activeTab === "sessions" && (
            <TrainingSessionPanel items={sessions} onChange={setSessions} onNotify={showToast} />
          )}
          {activeTab === "enrollments" && (
            <TrainingEnrollmentPanel
              items={enrollments}
              sessions={sessions}
              onChange={setEnrollments}
              onNotify={showToast}
            />
          )}
          {activeTab === "attendance" && (
            <TrainingAttendancePanel
              records={attendance}
              sessions={sessions}
              onChange={setAttendance}
              onNotify={showToast}
            />
          )}
          {activeTab === "results" && (
            <TrainingResultsPanel items={results} onChange={setResults} onNotify={showToast} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
