"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  Award,
  Briefcase,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  FileCheck2,
  Grid3x3,
  ShieldAlert,
  Sparkles,
  Star,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import { Card, InfoHint, Tooltip } from "@/components/ui";
import {
  INITIAL_POTENTIAL_ASSESSMENTS,
  INITIAL_TALENT_POOL,
  INITIAL_TALENT_REVIEWS,
  type PotentialAssessmentItem,
  type TalentPoolItem,
  type TalentReviewItem,
} from "@/data/mock/talentManagement";
import {
  INITIAL_KEY_POSITIONS,
  INITIAL_READINESS_ASSESSMENTS,
  INITIAL_SUCCESSION_PLANS,
  INITIAL_SUCCESSORS,
  type KeyPositionItem,
  type ReadinessAssessmentItem,
  type SuccessionPlanItem,
  type SuccessorItem,
} from "@/data/mock/successionData";
import { TalentPoolPanel } from "./TalentPoolPanel";
import { PotentialAssessmentPanel } from "./PotentialAssessmentPanel";
import { NineBoxGridPanel } from "./NineBoxGridPanel";
import { TalentReviewPanel } from "./TalentReviewPanel";
import { KeyPositionsPanel } from "./KeyPositionsPanel";
import { SuccessorsPanel } from "./SuccessorsPanel";
import { ReadinessAssessmentPanel } from "./ReadinessAssessmentPanel";
import { SuccessionPlanPanel } from "./SuccessionPlanPanel";

type TalentTabKey =
  | "pool"
  | "potential"
  | "ninebox"
  | "review"
  | "key-positions"
  | "successors"
  | "readiness"
  | "succession-plan";

const VALID_TABS: TalentTabKey[] = [
  "pool",
  "potential",
  "ninebox",
  "review",
  "key-positions",
  "successors",
  "readiness",
  "succession-plan",
];

const TAB_META: Record<TalentTabKey, { title: string; subtitle: string; hint: string }> = {
  pool: {
    title: "ทะเบียน Talent Pool",
    subtitle: "รวบรวมและติดตามพนักงานกลุ่มผู้มีศักยภาพสูง (HiPo / Key Talent) พร้อมความเสี่ยงการลาออกและตำแหน่งเป้าหมาย",
    hint: "ใช้สำหรับวางแผนรักษาบุคลากรสำคัญ (Retention) และเตรียมความพร้อมสู่ตำแหน่งผู้นำ",
  },
  potential: {
    title: "ประเมินศักยภาพ (Potential Assessment)",
    subtitle: "ประเมินศักยภาพการเติบโตใน 3 มิติหลัก ได้แก่ Learning Agility, Leadership Drive และ Strategic Thinking",
    hint: "คะแนนเฉลี่ยตั้งแต่ 4.2 ขึ้นไปจัดอยู่ในกลุ่มศักยภาพสูง (High Potential)",
  },
  ninebox: {
    title: "ตาราง 9-Box Grid (Performance × Potential)",
    subtitle: "จัดกลุ่มพนักงานตามผลงานและศักยภาพแบบ Interactive คลิกเลือกแต่ละกล่องเพื่อดูรายชื่อหรือปรับย้ายตำแหน่งได้ทันที",
    hint: "กล่องมุมขวาบน (Box 9: Star) คือกลุ่มผู้มีผลงานโดดเด่นและศักยภาพสูงที่เป็นเป้าหมายหลักของ Succession Plan",
  },
  review: {
    title: "ทบทวน Talent Review (Committee Review)",
    subtitle: "บันทึกและอนุมัติมติคณะกรรมการบริหารบุคลากร เช่น Fast-Track Promotion, Retention Plan หรือ Executive Mentoring",
    hint: "กด 'อนุมัติมติ' เพื่อยืนยันแผนการพัฒนาและการรักษาบุคลากรประจำรอบ Talent Review",
  },
  "key-positions": {
    title: "ตำแหน่งสำคัญขององค์กร (Key Positions)",
    subtitle: "ระบุตำแหน่งงานหลักที่ส่งผลต่อกลยุทธ์องค์กร ระดับความเสี่ยงตำแหน่งว่าง และจำนวนผู้สืบทอดที่รองรับอยู่",
    hint: "ตำแหน่งระดับ 1 (วิกฤตสูงสุด) ควรมีผู้สืบทอดรองรับอย่างน้อย 2 คน เพื่อลดความเสี่ยงธุรกิจหยุดชะงัก",
  },
  successors: {
    title: "ผู้สืบทอดตำแหน่ง (Successors)",
    subtitle: "จับคู่ผู้สืบทอดตำแหน่งตัวหลัก (อันดับ 1) และสำรอง (อันดับ 2) พร้อมระดับความพร้อมและสถานะการรับรอง",
    hint: "รองรับการเสนอชื่อผู้สืบทอดใหม่และกดยืนยันรับรองเข้าแผนการสืบทอดตำแหน่ง",
  },
  readiness: {
    title: "ประเมินความพร้อมผู้สืบทอด (Readiness Assessment)",
    subtitle: "ประเมินความพร้อม 3 ด้าน (Leadership, Experience, Skill Match) เพื่อจัดกลุ่ม พร้อมทันที / 1–2 ปี / 3+ ปี",
    hint: "คะแนนเฉลี่ย ≥ 85% = พร้อมรับตำแหน่งทันที, 70–84% = พร้อมใน 1–2 ปี, ต่ำกว่า 70% = พัฒนาระยะยาว 3+ ปี",
  },
  "succession-plan": {
    title: "แผนการสืบทอดตำแหน่ง (Succession Plan)",
    subtitle: "ติดตามแผนพัฒนาและส่งมอบงานสำคัญของแต่ละตำแหน่งหลัก พร้อมผู้สืบทอดตัวหลักและสำรอง",
    hint: "ใช้ติดตามความคืบหน้าการเตรียมความพร้อมก่อนการโอนย้ายหรือเลื่อนระดับจริง",
  },
};

export function TalentWorkspace() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as TalentTabKey | null;
  const activeTab: TalentTabKey = tabParam && VALID_TABS.includes(tabParam) ? tabParam : "pool";

  const [pool, setPool] = useState<TalentPoolItem[]>(INITIAL_TALENT_POOL);
  const [potentials, setPotentials] = useState<PotentialAssessmentItem[]>(
    INITIAL_POTENTIAL_ASSESSMENTS
  );
  const [reviews, setReviews] = useState<TalentReviewItem[]>(INITIAL_TALENT_REVIEWS);

  const [keyPositions, setKeyPositions] = useState<KeyPositionItem[]>(INITIAL_KEY_POSITIONS);
  const [successors, setSuccessors] = useState<SuccessorItem[]>(INITIAL_SUCCESSORS);
  const [readinessList, setReadinessList] = useState<ReadinessAssessmentItem[]>(
    INITIAL_READINESS_ASSESSMENTS
  );
  const [successionPlans, setSuccessionPlans] = useState<SuccessionPlanItem[]>(
    INITIAL_SUCCESSION_PLANS
  );

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const kpiCards = useMemo(() => {
    if (activeTab === "key-positions") {
      const critical = keyPositions.filter((k) => k.criticality === "critical").length;
      const covered = keyPositions.filter((k) => k.status === "covered").length;
      const atRisk = keyPositions.filter((k) => k.status !== "covered").length;
      return [
        {
          label: "ตำแหน่งสำคัญทั้งหมด",
          value: `${keyPositions.length} ตำแหน่ง`,
          sub: `ระดับวิกฤตสูงสุด ${critical} ตำแหน่ง`,
          icon: <Briefcase className="h-5 w-5" />,
          color: "bg-[#EEF4FF] text-[#2563EB]",
        },
        {
          label: "มีผู้สืบทอดครบแล้ว",
          value: `${covered} ตำแหน่ง`,
          sub: "ความเสี่ยงขาดช่วงต่ำ",
          icon: <CheckCircle2 className="h-5 w-5" />,
          color: "bg-[#DCFCE7] text-[#16A34A]",
        },
        {
          label: "เสี่ยงขาดช่วง / ว่าง",
          value: `${atRisk} ตำแหน่ง`,
          sub: "ควรเร่งสรรหาหรือพัฒนาผู้สืบทอด",
          icon: <ShieldAlert className="h-5 w-5" />,
          color: "bg-[#FEF3C7] text-[#D97706]",
        },
        {
          label: "อัตราความครอบคลุม",
          value: `${keyPositions.length > 0 ? Math.round((covered / keyPositions.length) * 100) : 0}%`,
          sub: "สัดส่วนตำแหน่งที่มีผู้สืบทอดครบ",
          icon: <TrendingUp className="h-5 w-5" />,
          color: "bg-[#F3E8FF] text-[#7C3AED]",
        },
      ];
    }

    if (activeTab === "successors") {
      const readyNow = successors.filter((s) => s.readiness === "ready-now").length;
      const confirmed = successors.filter((s) => s.status === "confirmed").length;
      const pending = successors.filter((s) => s.status === "nominated").length;
      return [
        {
          label: "ผู้สืบทอดทั้งหมด",
          value: `${successors.length} คน`,
          sub: `ยืนยันรับรองแล้ว ${confirmed} คน`,
          icon: <Users className="h-5 w-5" />,
          color: "bg-[#EEF4FF] text-[#2563EB]",
        },
        {
          label: "พร้อมรับตำแหน่งทันที",
          value: `${readyNow} คน`,
          sub: "ระดับความพร้อมสูงสุด (Ready Now)",
          icon: <UserCheck className="h-5 w-5" />,
          color: "bg-[#DCFCE7] text-[#16A34A]",
        },
        {
          label: "พร้อมใน 1–2 ปี",
          value: `${successors.filter((s) => s.readiness === "1-2-years").length} คน`,
          sub: "อยู่ระหว่างพัฒนาเสริมประสบการณ์",
          icon: <TrendingUp className="h-5 w-5" />,
          color: "bg-[#F3E8FF] text-[#7C3AED]",
        },
        {
          label: "รอรับรองรายชื่อ",
          value: `${pending} คน`,
          sub: "รอคณะกรรมการยืนยันตัวเลือก",
          icon: <Clock className="h-5 w-5" />,
          color: "bg-[#FEF3C7] text-[#D97706]",
        },
      ];
    }

    if (activeTab === "readiness") {
      const readyNow = readinessList.filter((r) => r.readiness === "ready-now").length;
      const avgAll =
        readinessList.length > 0
          ? Math.round(
              readinessList.reduce(
                (acc, r) =>
                  acc + (r.leadershipScore + r.experienceScore + r.skillMatchScore) / 3,
                0
              ) / readinessList.length
            )
          : 0;
      return [
        {
          label: "ประเมินความพร้อมแล้ว",
          value: `${readinessList.length} คน`,
          sub: "ประเมินครบทั้ง 3 มิติหลัก",
          icon: <ClipboardCheck className="h-5 w-5" />,
          color: "bg-[#EEF4FF] text-[#2563EB]",
        },
        {
          label: "ความพร้อมเฉลี่ยรวม",
          value: `${avgAll}%`,
          sub: "เกณฑ์พร้อมทันทีคือ ≥ 85%",
          icon: <TrendingUp className="h-5 w-5" />,
          color: "bg-[#F3E8FF] text-[#7C3AED]",
        },
        {
          label: "ผ่านเกณฑ์พร้อมทันที",
          value: `${readyNow} คน`,
          sub: "คะแนนเฉลี่ย 85% ขึ้นไป",
          icon: <CheckCircle2 className="h-5 w-5" />,
          color: "bg-[#DCFCE7] text-[#16A34A]",
        },
        {
          label: "ต้องพัฒนาต่อเนื่อง",
          value: `${readinessList.length - readyNow} คน`,
          sub: "กลุ่ม 1–2 ปี และ 3+ ปี",
          icon: <Clock className="h-5 w-5" />,
          color: "bg-[#FEF3C7] text-[#D97706]",
        },
      ];
    }

    if (activeTab === "succession-plan") {
      const completed = successionPlans.filter((p) => p.status === "completed").length;
      const reviewNeeded = successionPlans.filter((p) => p.status === "review-needed").length;
      const avgPct =
        successionPlans.length > 0
          ? Math.round(
              successionPlans.reduce((acc, p) => acc + p.progress, 0) / successionPlans.length
            )
          : 0;
      return [
        {
          label: "แผนการสืบทอดทั้งหมด",
          value: `${successionPlans.length} แผน`,
          sub: "ครอบคลุมตำแหน่งสำคัญหลัก",
          icon: <FileCheck2 className="h-5 w-5" />,
          color: "bg-[#EEF4FF] text-[#2563EB]",
        },
        {
          label: "ความคืบหน้าเฉลี่ย",
          value: `${avgPct}%`,
          sub: "ของแผนพัฒนาและส่งมอบงานทั้งหมด",
          icon: <TrendingUp className="h-5 w-5" />,
          color: "bg-[#F3E8FF] text-[#7C3AED]",
        },
        {
          label: "พร้อมส่งมอบแล้ว",
          value: `${completed} แผน`,
          sub: "ดำเนินการครบ 100%",
          icon: <CheckCircle2 className="h-5 w-5" />,
          color: "bg-[#DCFCE7] text-[#16A34A]",
        },
        {
          label: "ควรทบทวนแผน",
          value: `${reviewNeeded} แผน`,
          sub: "ความคืบหน้าต่ำกว่าเกณฑ์เป้าหมาย",
          icon: <AlertTriangle className="h-5 w-5" />,
          color: "bg-[#FEF3C7] text-[#D97706]",
        },
      ];
    }

    if (activeTab === "potential") {
      const assessed = potentials.filter((p) => p.status === "assessed");
      const pending = potentials.filter((p) => p.status === "pending").length;
      const highPot = potentials.filter(
        (p) => (p.learningAgility + p.leadershipDrive + p.strategicThinking) / 3 >= 4.2
      ).length;
      const avgScore =
        potentials.length > 0
          ? (
              potentials.reduce(
                (acc, p) =>
                  acc + (p.learningAgility + p.leadershipDrive + p.strategicThinking) / 3,
                0
              ) / potentials.length
            ).toFixed(2)
          : "0.00";
      return [
        {
          label: "ประเมินศักยภาพแล้ว",
          value: `${assessed.length}/${potentials.length} คน`,
          sub: `รอประเมินอีก ${pending} คน`,
          icon: <ClipboardCheck className="h-5 w-5" />,
          color: "bg-[#EEF4FF] text-[#2563EB]",
        },
        {
          label: "กลุ่มศักยภาพสูง (High)",
          value: `${highPot} คน`,
          sub: "คะแนนเฉลี่ย 3 มิติ ≥ 4.2 / 5.0",
          icon: <Sparkles className="h-5 w-5" />,
          color: "bg-[#DCFCE7] text-[#16A34A]",
        },
        {
          label: "คะแนนศักยภาพเฉลี่ย",
          value: `${avgScore} / 5.0`,
          sub: "ภาพรวมผู้เข้าประเมินทั้งหมด",
          icon: <Award className="h-5 w-5" />,
          color: "bg-[#F3E8FF] text-[#7C3AED]",
        },
        {
          label: "รอการประเมิน",
          value: `${pending} คน`,
          sub: "รอหัวหน้างานบันทึกคะแนน",
          icon: <Clock className="h-5 w-5" />,
          color: "bg-[#FEF3C7] text-[#D97706]",
        },
      ];
    }

    if (activeTab === "ninebox") {
      const stars = pool.filter((p) => p.performance === 3 && p.potential === 3).length;
      const highPot = pool.filter((p) => p.potential === 3).length;
      const highPerf = pool.filter((p) => p.performance === 3).length;
      return [
        {
          label: "กลุ่ม Star (Box 9)",
          value: `${stars} คน`,
          sub: "ผลงานสูง + ศักยภาพสูง",
          icon: <Star className="h-5 w-5" />,
          color: "bg-[#DCFCE7] text-[#16A34A]",
        },
        {
          label: "ศักยภาพสูง (แถวบน)",
          value: `${highPot} คน`,
          sub: "Box 7, 8 และ 9 รวมกัน",
          icon: <Sparkles className="h-5 w-5" />,
          color: "bg-[#EEF4FF] text-[#2563EB]",
        },
        {
          label: "ผลงานโดดเด่น (คอลัมน์ขวา)",
          value: `${highPerf} คน`,
          sub: "Box 3, 6 และ 9 รวมกัน",
          icon: <Award className="h-5 w-5" />,
          color: "bg-[#F3E8FF] text-[#7C3AED]",
        },
        {
          label: "จำนวนคนใน 9-Box",
          value: `${pool.length} คน`,
          sub: "คลิกแต่ละกล่องเพื่อดูรายชื่อ",
          icon: <Grid3x3 className="h-5 w-5" />,
          color: "bg-[#FEF3C7] text-[#D97706]",
        },
      ];
    }

    if (activeTab === "review") {
      const approved = reviews.filter((r) => r.status === "approved").length;
      const pending = reviews.filter((r) => r.status === "pending").length;
      return [
        {
          label: "วาระ Talent Review",
          value: `${reviews.length} รายการ`,
          sub: "ประจำรอบ Talent Review 2569",
          icon: <ClipboardCheck className="h-5 w-5" />,
          color: "bg-[#EEF4FF] text-[#2563EB]",
        },
        {
          label: "อนุมัติมติแล้ว",
          value: `${approved} รายการ`,
          sub: "พร้อมส่งต่อดำเนินการพัฒนา/เลื่อนระดับ",
          icon: <CheckCircle2 className="h-5 w-5" />,
          color: "bg-[#DCFCE7] text-[#16A34A]",
        },
        {
          label: "รอมติคณะกรรมการ",
          value: `${pending} รายการ`,
          sub: "รอการพิจารณาอนุมัติ",
          icon: <Clock className="h-5 w-5" />,
          color: "bg-[#FEF3C7] text-[#D97706]",
        },
        {
          label: "อัตราผ่านการอนุมัติ",
          value: `${reviews.length > 0 ? Math.round((approved / reviews.length) * 100) : 0}%`,
          sub: "ของวาระทั้งหมดในรอบนี้",
          icon: <Award className="h-5 w-5" />,
          color: "bg-[#F3E8FF] text-[#7C3AED]",
        },
      ];
    }

    const hipoCount = pool.filter((p) => p.tier === "HiPo").length;
    const highRisk = pool.filter((p) => p.retentionRisk === "high").length;
    const nominated = pool.filter((p) => p.status === "nominated").length;
    return [
      {
        label: "Talent Pool ทั้งหมด",
        value: `${pool.length} คน`,
        sub: "บุคลากรศักยภาพสูงขององค์กร",
        icon: <Users className="h-5 w-5" />,
        color: "bg-[#EEF4FF] text-[#2563EB]",
      },
      {
        label: "กลุ่ม HiPo (Top Tier)",
        value: `${hipoCount} คน`,
        sub: "พร้อมพัฒนาสู่ผู้นำระดับสูง",
        icon: <Star className="h-5 w-5" />,
        color: "bg-[#DCFCE7] text-[#16A34A]",
      },
      {
        label: "เสี่ยงลาออกสูง (High Risk)",
        value: `${highRisk} คน`,
        sub: "ควรวางแผน Retention เร่งด่วน",
        icon: <ShieldAlert className="h-5 w-5" />,
        color: "bg-[#FEF3C7] text-[#D97706]",
      },
      {
        label: "รอรับเข้า Pool",
        value: `${nominated} คน`,
        sub: "อยู่ระหว่างรอยืนยันสถานะ",
        icon: <AlertTriangle className="h-5 w-5" />,
        color: "bg-[#F3E8FF] text-[#7C3AED]",
      },
    ];
  }, [
    activeTab,
    pool,
    potentials,
    reviews,
    keyPositions,
    successors,
    readinessList,
    successionPlans,
  ]);

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
        {activeTab === "pool" && (
          <TalentPoolPanel items={pool} onChange={setPool} onNotify={notify} />
        )}
        {activeTab === "potential" && (
          <PotentialAssessmentPanel
            items={potentials}
            onChange={setPotentials}
            onNotify={notify}
          />
        )}
        {activeTab === "ninebox" && (
          <NineBoxGridPanel items={pool} onChange={setPool} onNotify={notify} />
        )}
        {activeTab === "review" && (
          <TalentReviewPanel items={reviews} onChange={setReviews} onNotify={notify} />
        )}
        {activeTab === "key-positions" && (
          <KeyPositionsPanel items={keyPositions} onChange={setKeyPositions} onNotify={notify} />
        )}
        {activeTab === "successors" && (
          <SuccessorsPanel items={successors} onChange={setSuccessors} onNotify={notify} />
        )}
        {activeTab === "readiness" && (
          <ReadinessAssessmentPanel
            items={readinessList}
            onChange={setReadinessList}
            onNotify={notify}
          />
        )}
        {activeTab === "succession-plan" && (
          <SuccessionPlanPanel
            items={successionPlans}
            onChange={setSuccessionPlans}
            onNotify={notify}
          />
        )}
      </Card>
    </div>
  );
}
