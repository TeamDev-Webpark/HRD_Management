"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Award,
  BookOpen,
  CalendarClock,
  CalendarRange,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Clock,
  Star,
  UserCheck,
  UserPlus,
  Users,
  UserX,
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
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as TrainingTabKey | null;
  const activeMeta = TRAINING_TABS.find((t) => t.key === tabParam) ?? TRAINING_TABS[0];
  const activeTab: TrainingTabKey = activeMeta.key;

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

  // Context-aware KPI calculations per active sub-page
  const renderContextualKpis = () => {
    if (activeTab === "needs") {
      const pending = needs.filter((n) => n.status === "pending").length;
      const approved = needs.filter((n) => n.status === "approved").length;
      const totalHeadcount = needs.reduce((s, n) => s + n.targetHeadcount, 0);
      const totalEstBudget = needs.reduce((s, n) => s + n.estimatedBudget, 0);
      return (
        <>
          <StatCard
            tone="blue"
            title="คำขอความต้องการอบรม"
            tooltip="จำนวนหัวข้อที่แผนกต่างๆ เสนอเข้ามาทั้งหมดในรอบปีงบประมาณ"
            value={`${needs.length}`}
            unit="คำขอ"
            icon={<ClipboardList className="h-5 w-5" />}
            footnote={`กลุ่มเป้าหมายรวม ${totalHeadcount.toLocaleString()} คน`}
          />
          <StatCard
            tone="yellow"
            title="รอการพิจารณา"
            tooltip="คำขอที่รอฝ่าย HRD ตรวจสอบความเหมาะสมและงบประมาณ"
            value={`${pending}`}
            unit="รายการ"
            icon={<Clock className="h-5 w-5" />}
            footnote="ควรพิจารณาภายใน 3 วันทำการ"
          />
          <StatCard
            tone="green"
            title="อนุมัติเข้าสู่แผนแล้ว"
            tooltip="คำขอที่ผ่านการอนุมัติและพร้อมบรรจุในแผนฝึกอบรมประจำปี"
            value={`${approved}`}
            unit="รายการ"
            icon={<CheckCircle2 className="h-5 w-5" />}
            footnote={`คิดเป็น ${needs.length ? Math.round((approved / needs.length) * 100) : 0}% ของคำขอทั้งหมด`}
          />
          <StatCard
            tone="purple"
            title="งบประมาณที่เสนอรวม"
            tooltip="งบประมาณประเมินเบื้องต้นรวมจากทุกคำขอความต้องการอบรม"
            value={`฿${totalEstBudget.toLocaleString()}`}
            icon={<Wallet className="h-5 w-5" />}
            footnote={`เฉลี่ย ฿${totalHeadcount ? Math.round(totalEstBudget / totalHeadcount).toLocaleString() : 0} / คน`}
          />
        </>
      );
    }

    if (activeTab === "catalog") {
      const activeCount = courses.filter((c) => c.active).length;
      const inHouseCount = courses.filter((c) => c.courseType === "In-House" || c.courseType === "Workshop").length;
      const avgHours = courses.length
        ? Math.round(courses.reduce((s, c) => s + c.durationHours, 0) / courses.length)
        : 0;
      const avgCost = courses.length
        ? Math.round(courses.reduce((s, c) => s + c.costPerSession, 0) / courses.length)
        : 0;
      return (
        <>
          <StatCard
            tone="blue"
            title="คลังหลักสูตรทั้งหมด"
            tooltip="รายการหลักสูตรมาตรฐานทั้งหมดที่ลงทะเบียนในระบบ"
            value={`${courses.length}`}
            unit="หลักสูตร"
            icon={<BookOpen className="h-5 w-5" />}
            footnote={`เปิดใช้งาน ${activeCount} หลักสูตร`}
          />
          <StatCard
            tone="green"
            title="หลักสูตรพร้อมเปิดสอน"
            tooltip="หลักสูตรที่เปิดสถานะใช้งาน สามารถนำไปบรรจุแผนและเปิดรุ่นได้"
            value={`${activeCount}/${courses.length}`}
            unit="หลักสูตร"
            icon={<CheckCircle2 className="h-5 w-5" />}
            progress={{
              percent: courses.length ? Math.round((activeCount / courses.length) * 100) : 0,
              label: "สัดส่วนพร้อมใช้งาน",
            }}
            footnote={`${courses.length ? Math.round((activeCount / courses.length) * 100) : 0}%`}
          />
          <StatCard
            tone="purple"
            title="In-House & Workshop"
            tooltip="หลักสูตรที่จัดอบรมภายในองค์กรและเวิร์กช็อปฝึกปฏิบัติ"
            value={`${inHouseCount}`}
            unit="หลักสูตร"
            icon={<Users className="h-5 w-5" />}
            footnote={`เฉลี่ย ${avgHours} ชั่วโมง / หลักสูตร`}
          />
          <StatCard
            tone="yellow"
            title="งบประมาณเฉลี่ยต่อรุ่น"
            tooltip="ค่าใช้จ่ายมาตรฐานเฉลี่ยต่อการจัดอบรม 1 รุ่น"
            value={`฿${avgCost.toLocaleString()}`}
            icon={<Wallet className="h-5 w-5" />}
            footnote="ใช้เป็นฐานคำนวณแผนประจำปี"
          />
        </>
      );
    }

    if (activeTab === "annual-plan") {
      const totalSessions = plans.reduce((s, p) => s + p.sessions, 0);
      const totalTarget = plans.reduce((s, p) => s + p.targetParticipants, 0);
      const completed = plans.filter((p) => p.status === "completed").length;
      const totalPlanBudget = plans.reduce((s, p) => s + p.budgetAllocated, 0);
      const pct = plans.length ? Math.round((completed / plans.length) * 100) : 0;
      return (
        <>
          <StatCard
            tone="blue"
            title="รายการแผนประจำปี 2569"
            tooltip="จำนวนหลักสูตรที่บรรจุในแผนฝึกอบรมประจำปีทั้ง 4 ไตรมาส"
            value={`${plans.length}`}
            unit="รายการ"
            icon={<CalendarRange className="h-5 w-5" />}
            footnote={`รวม ${totalSessions} รุ่นอบรม`}
          />
          <StatCard
            tone="purple"
            title="ผู้เรียนเป้าหมายตามแผน"
            tooltip="จำนวนพนักงานเป้าหมายที่จะเข้าอบรมตามแผนประจำปี"
            value={`${totalTarget.toLocaleString()}`}
            unit="คน"
            icon={<Users className="h-5 w-5" />}
            footnote={`เฉลี่ย ${totalSessions ? Math.round(totalTarget / totalSessions) : 0} คน / รุ่น`}
          />
          <StatCard
            tone="green"
            title="ดำเนินการเสร็จสิ้นแล้ว"
            tooltip="สัดส่วนแผนฝึกอบรมที่จัดอบรมครบและปิดแผนเรียบร้อยแล้ว"
            value={`${completed}/${plans.length}`}
            unit="รายการ"
            icon={<CheckCircle2 className="h-5 w-5" />}
            progress={{ percent: pct, label: "ความคืบหน้าแผนทั้งปี" }}
            footnote={`${pct}%`}
          />
          <StatCard
            tone="yellow"
            title="งบประมาณตามแผนรวม"
            tooltip="งบประมาณที่จัดสรรไว้สำหรับแผนฝึกอบรมทั้ง 4 ไตรมาส"
            value={`฿${totalPlanBudget.toLocaleString()}`}
            icon={<Wallet className="h-5 w-5" />}
            footnote="ครอบคลุม Q1 – Q4 / 2569"
          />
        </>
      );
    }

    if (activeTab === "budget") {
      const totalAllocated = budgets.reduce((s, b) => s + b.allocated, 0);
      const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
      const totalCommitted = budgets.reduce((s, b) => s + b.committed, 0);
      const remaining = Math.max(0, totalAllocated - totalSpent - totalCommitted);
      const usedPct = totalAllocated
        ? Math.round(((totalSpent + totalCommitted) / totalAllocated) * 100)
        : 0;
      return (
        <>
          <StatCard
            tone="blue"
            title="งบจัดสรรทั้งหมด"
            tooltip="งบประมาณฝึกอบรมที่ได้รับอนุมัติประจำปีงบประมาณ 2569"
            value={`฿${(totalAllocated / 1_000_000).toFixed(2)}M`}
            icon={<Wallet className="h-5 w-5" />}
            footnote={`จัดสรรให้ ${budgets.length} แผนก / Cost Center`}
          />
          <StatCard
            tone="green"
            title="เบิกจ่ายจริงแล้ว"
            tooltip="ยอดค่าใช้จ่ายฝึกอบรมที่เบิกจ่ายและปิดบัญชีเรียบร้อยแล้ว"
            value={`฿${(totalSpent / 1_000_000).toFixed(2)}M`}
            icon={<CheckCircle2 className="h-5 w-5" />}
            footnote={`${totalAllocated ? Math.round((totalSpent / totalAllocated) * 100) : 0}% ของงบทั้งหมด`}
          />
          <StatCard
            tone="purple"
            title="จองงบไว้รอจัดอบรม"
            tooltip="งบที่กันไว้สำหรับหลักสูตรที่อนุมัติแล้วแต่ยังไม่ถึงวันจ่ายเงิน"
            value={`฿${totalCommitted.toLocaleString()}`}
            icon={<Clock className="h-5 w-5" />}
            footnote={`${totalAllocated ? Math.round((totalCommitted / totalAllocated) * 100) : 0}% ของงบทั้งหมด`}
          />
          <StatCard
            tone="yellow"
            title="งบประมาณคงเหลือ"
            tooltip="วงเงินคงเหลือที่สามารถจัดสรรให้คำขอหรือหลักสูตรใหม่ได้"
            value={`฿${remaining.toLocaleString()}`}
            icon={<Wallet className="h-5 w-5" />}
            progress={{ percent: usedPct, label: "ใช้และจองงบไปแล้ว" }}
            footnote={`${usedPct}%`}
          />
        </>
      );
    }

    if (activeTab === "trainers") {
      const activeCount = trainers.filter((t) => t.active).length;
      const internalCount = trainers.filter((t) => t.type === "Internal").length;
      const externalCount = trainers.length - internalCount;
      const avgRating = trainers.length
        ? (trainers.reduce((s, t) => s + t.rating, 0) / trainers.length).toFixed(1)
        : "0.0";
      return (
        <>
          <StatCard
            tone="blue"
            title="วิทยากรและสถาบันทั้งหมด"
            tooltip="จำนวนวิทยากรภายใน วิทยากรภายนอก และสถาบันพันธมิตรในทะเบียน"
            value={`${trainers.length}`}
            unit="รายการ"
            icon={<UserCheck className="h-5 w-5" />}
            footnote={`พร้อมรับเชิญสอน ${activeCount} รายการ`}
          />
          <StatCard
            tone="green"
            title="วิทยากรภายในองค์กร"
            tooltip="พนักงานผู้เชี่ยวชาญภายในที่ขึ้นทะเบียนเป็นวิทยากร (Internal Trainer)"
            value={`${internalCount}`}
            unit="ท่าน"
            icon={<Users className="h-5 w-5" />}
            footnote="ไม่มีค่าใช้จ่ายวิทยากรภายนอก"
          />
          <StatCard
            tone="purple"
            title="วิทยากรภายนอก & สถาบัน"
            tooltip="ผู้เชี่ยวชาญอิสระและสถาบันฝึกอบรมพันธมิตรภายนอก"
            value={`${externalCount}`}
            unit="รายการ"
            icon={<BookOpen className="h-5 w-5" />}
            footnote="รองรับหลักสูตรเฉพาะทางและใบรับรอง"
          />
          <StatCard
            tone="yellow"
            title="คะแนนประเมินเฉลี่ย"
            tooltip="คะแนนความพึงพอใจของผู้เรียนต่อวิทยากรทั้งหมด (เต็ม 5.0)"
            value={avgRating}
            unit="/ 5.0"
            icon={<Star className="h-5 w-5" />}
            footnote="เกณฑ์มาตรฐานองค์กร ≥ 4.5"
          />
        </>
      );
    }

    if (activeTab === "sessions") {
      const openCount = sessions.filter((s) => s.status === "open" || s.status === "ongoing").length;
      const completedCount = sessions.filter((s) => s.status === "completed").length;
      const totalEnrolled = sessions.reduce((s, item) => s + item.enrolled, 0);
      const totalCap = sessions.reduce((s, item) => s + item.capacity, 0);
      const fillPct = totalCap ? Math.round((totalEnrolled / totalCap) * 100) : 0;
      return (
        <>
          <StatCard
            tone="blue"
            title="รุ่นฝึกอบรมทั้งหมด"
            tooltip="จำนวนรุ่นฝึกอบรมที่กำหนดตารางจัดอบรมทั้งหมด"
            value={`${sessions.length}`}
            unit="รุ่น"
            icon={<CalendarClock className="h-5 w-5" />}
            footnote={`กำลังเปิดรับ / อบรมอยู่ ${openCount} รุ่น`}
          />
          <StatCard
            tone="purple"
            title="ผู้ลงทะเบียนรวม"
            tooltip={`ลงทะเบียนแล้ว ${totalEnrolled} ที่นั่ง จากความจุทั้งหมด ${totalCap} ที่นั่ง`}
            value={`${totalEnrolled}/${totalCap}`}
            unit="ที่นั่ง"
            icon={<Users className="h-5 w-5" />}
            progress={{ percent: fillPct, label: "อัตราการใช้ที่นั่ง" }}
            footnote={`${fillPct}%`}
          />
          <StatCard
            tone="green"
            title="รุ่นที่อบรมเสร็จสิ้น"
            tooltip="รุ่นฝึกอบรมที่จัดเสร็จสมบูรณ์และสรุปผลเรียบร้อยแล้ว"
            value={`${completedCount}`}
            unit="รุ่น"
            icon={<CheckCircle2 className="h-5 w-5" />}
            footnote={`ว่างรอเปิดรับเพิ่ม ${Math.max(0, totalCap - totalEnrolled)} ที่นั่ง`}
          />
          <StatCard
            tone="yellow"
            title="รูปแบบ Onsite / Online"
            tooltip="สัดส่วนรุ่นอบรมในห้องเรียนเทียบกับออนไลน์และ Hybrid"
            value={`${sessions.filter((s) => s.deliveryMode !== "Online").length}/${sessions.filter((s) => s.deliveryMode === "Online").length}`}
            unit="รุ่น"
            icon={<BookOpen className="h-5 w-5" />}
            footnote="Onsite-Hybrid / Live Online"
          />
        </>
      );
    }

    if (activeTab === "enrollments") {
      const pending = enrollments.filter((e) => e.status === "pending").length;
      const approved = enrollments.filter((e) => e.status === "approved").length;
      const rejected = enrollments.filter((e) => e.status === "rejected").length;
      return (
        <>
          <StatCard
            tone="blue"
            title="คำขอลงทะเบียนทั้งหมด"
            tooltip="จำนวนพนักงานที่ยื่นคำขอลงทะเบียนเข้าร่วมรุ่นฝึกอบรม"
            value={`${enrollments.length}`}
            unit="รายการ"
            icon={<UserPlus className="h-5 w-5" />}
            footnote="อ้างอิงสายอนุมัติจาก HRM"
          />
          <StatCard
            tone="yellow"
            title="รออนุมัติสิทธิ์"
            tooltip="คำขอลงทะเบียนที่รอหัวหน้างานหรือ HRD อนุมัติ"
            value={`${pending}`}
            unit="รายการ"
            icon={<Clock className="h-5 w-5" />}
            footnote="กดอนุมัติ/ปฏิเสธได้ทันทีในตาราง"
          />
          <StatCard
            tone="green"
            title="อนุมัติและยืนยันที่นั่ง"
            tooltip="พนักงานที่ได้รับการยืนยันสิทธิ์เข้าร่วมอบรมเรียบร้อยแล้ว"
            value={`${approved}`}
            unit="รายการ"
            icon={<CheckCircle2 className="h-5 w-5" />}
            footnote={`อัตราอนุมัติ ${enrollments.length ? Math.round((approved / enrollments.length) * 100) : 0}%`}
          />
          <StatCard
            tone="purple"
            title="ไม่อนุมัติ"
            tooltip="คำขอที่ไม่ได้รับอนุมัติในรอบนี้"
            value={`${rejected}`}
            unit="รายการ"
            icon={<UserX className="h-5 w-5" />}
            footnote="แจ้งเหตุผลกลับไปยังพนักงานแล้ว"
          />
        </>
      );
    }

    if (activeTab === "attendance") {
      const present = attendance.filter((a) => a.status === "present").length;
      const late = attendance.filter((a) => a.status === "late").length;
      const absent = attendance.filter((a) => a.status === "absent").length;
      const rate = attendance.length ? Math.round(((present + late) / attendance.length) * 100) : 0;
      return (
        <>
          <StatCard
            tone="blue"
            title="อัตราการเข้าร่วมอบรม"
            tooltip="สัดส่วนผู้เข้าอบรมจริง (รวมเข้าตรงเวลาและมาสาย) จากรายชื่อทั้งหมด"
            value={`${rate}%`}
            icon={<ClipboardCheck className="h-5 w-5" />}
            progress={{ percent: rate, label: "การเข้าร่วมรวมทุกรุ่น" }}
            footnote={`${present + late}/${attendance.length} คน`}
          />
          <StatCard
            tone="green"
            title="เข้าอบรมตรงเวลา"
            tooltip="จำนวนผู้เรียนที่เช็คอินเข้าห้องอบรมก่อนเวลาเริ่ม"
            value={`${present}`}
            unit="คน"
            icon={<UserCheck className="h-5 w-5" />}
            footnote="ลงเวลาครบตามเกณฑ์"
          />
          <StatCard
            tone="yellow"
            title="มาสาย"
            tooltip="จำนวนผู้เรียนที่เช็คอินช้ากว่าเวลาเริ่มอบรมเกิน 15 นาที"
            value={`${late}`}
            unit="คน"
            icon={<Clock className="h-5 w-5" />}
            footnote="นับชั่วโมงอบรมตามเวลาจริง"
          />
          <StatCard
            tone="purple"
            title="ขาดอบรม"
            tooltip="ผู้ลงทะเบียนที่ไม่ได้เข้าร่วมการอบรมในรอบนี้"
            value={`${absent}`}
            unit="คน"
            icon={<UserX className="h-5 w-5" />}
            footnote="แจ้งหัวหน้างานเพื่อติดตามผล"
          />
        </>
      );
    }

    // results
    const passed = results.filter((r) => r.status === "passed").length;
    const certIssued = results.filter((r) => r.certificateIssued).length;
    const ratedItems = results.filter((r) => r.satisfaction > 0);
    const avgSat = ratedItems.length
      ? (ratedItems.reduce((s, r) => s + r.satisfaction, 0) / ratedItems.length).toFixed(1)
      : "0.0";
    const passRate = results.length ? Math.round((passed / results.length) * 100) : 0;
    return (
      <>
        <StatCard
          tone="blue"
          title="ประวัติการอบรมทั้งหมด"
          tooltip="จำนวนรายการบันทึกผลและประวัติการฝึกอบรมของพนักงาน"
          value={`${results.length}`}
          unit="รายการ"
          icon={<Award className="h-5 w-5" />}
          footnote="เชื่อมโยงเข้าโปรไฟล์พนักงาน HRM"
        />
        <StatCard
          tone="green"
          title="ผ่านเกณฑ์การอบรม"
          tooltip="ผู้เรียนที่สอบ Post-test ผ่านเกณฑ์มาตรฐาน 80% ขึ้นไป"
          value={`${passed}/${results.length}`}
          unit="รายการ"
          icon={<CheckCircle2 className="h-5 w-5" />}
          progress={{ percent: passRate, label: "อัตราการสอบผ่าน" }}
          footnote={`${passRate}%`}
        />
        <StatCard
          tone="purple"
          title="ออกใบรับรองแล้ว"
          tooltip="จำนวนใบประกาศนียบัตรที่ออกให้ผู้ผ่านการอบรมเรียบร้อยแล้ว"
          value={`${certIssued}`}
          unit="ใบ"
          icon={<Award className="h-5 w-5" />}
          footnote="พร้อมดาวน์โหลดในเมนูพนักงาน"
        />
        <StatCard
          tone="yellow"
          title="ความพึงพอใจเฉลี่ย"
          tooltip="คะแนนประเมินความพึงพอใจหลังอบรมเฉลี่ยทุกรุ่น (เต็ม 5.0)"
          value={avgSat}
          unit="/ 5.0"
          icon={<Star className="h-5 w-5" />}
          footnote="ประเมินจากผู้เรียนที่อบรมเสร็จแล้ว"
        />
      </>
    );
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#0F172A]">{activeMeta.label}</h2>
            <InfoHint title={activeMeta.labelEn} content={activeMeta.description} />
          </div>
          <p className="mt-0.5 text-xs text-[#64748B]">{activeMeta.description}</p>
        </div>

        {toast && (
          <div className="inline-flex items-center gap-2 rounded-xl bg-[#ECFAF5] px-3.5 py-2 text-xs font-medium text-[#1CA388] ring-1 ring-emerald-200/80">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {toast}
          </div>
        )}
      </div>

      {/* Row 1: 4 Context-Aware KPI Cards tailored to the active sub-page */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {renderContextualKpis()}
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
