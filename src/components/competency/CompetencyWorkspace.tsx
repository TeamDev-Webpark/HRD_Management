"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  Award,
  BookOpenCheck,
  Briefcase,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Grid2x2,
  Layers,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { Card, InfoHint } from "@/components/ui";
import {
  INITIAL_COMPETENCY_ASSESSMENTS,
  INITIAL_COMPETENCY_DICTIONARY,
  INITIAL_POSITION_COMPETENCIES,
  type CompetencyAssessmentItem,
  type CompetencyDictItem,
  type PositionCompetencyItem,
} from "@/data/mock/competencyFramework";
import {
  INITIAL_SKILL_CERTIFICATIONS,
  INITIAL_SKILL_GAPS,
  INITIAL_SKILL_MATRIX,
  SKILL_COLUMNS,
  type SkillCertificationItem,
  type SkillGapItem,
  type SkillMatrixRow,
} from "@/data/mock/skillAnalytics";
import { CompetencyDictionaryPanel } from "./CompetencyDictionaryPanel";
import { PositionCompetencyPanel } from "./PositionCompetencyPanel";
import { CompetencyAssessmentPanel } from "./CompetencyAssessmentPanel";
import { SkillMatrixPanel } from "./SkillMatrixPanel";
import { SkillGapPanel } from "./SkillGapPanel";
import { SkillCertificationPanel } from "./SkillCertificationPanel";

type CompetencyTabKey =
  | "dictionary"
  | "positions"
  | "assessments"
  | "matrix"
  | "gap"
  | "certifications";

const VALID_TABS: CompetencyTabKey[] = [
  "dictionary",
  "positions",
  "assessments",
  "matrix",
  "gap",
  "certifications",
];

const TAB_META: Record<CompetencyTabKey, { title: string; subtitle: string; hint: string }> = {
  dictionary: {
    title: "คลังสมรรถนะ (Competency Library)",
    subtitle: "กำหนดคลังสมรรถนะกลางขององค์กร แบ่งตาม Core, Managerial และ Functional พร้อมระดับความชำนาญ",
    hint: "คลังสมรรถนะกลางใช้เป็นมาตรฐานในการผูกเข้ากับตำแหน่งงาน การประเมิน และแผนพัฒนา IDP",
  },
  positions: {
    title: "สมรรถนะประจำตำแหน่ง (Position Competency)",
    subtitle: "กำหนดรายการสมรรถนะและระดับเป้าหมาย (Target Level) ที่คาดหวังสำหรับแต่ละตำแหน่งงาน",
    hint: "ระบุระดับเป้าหมาย Lv.1–Lv.5 และทำเครื่องหมาย Critical สำหรับสมรรถนะจำเป็นของตำแหน่ง",
  },
  assessments: {
    title: "การประเมินสมรรถนะ (Competency Assessment)",
    subtitle: "บันทึกผลประเมินสมรรถนะรายบุคคล เปรียบเทียบระดับเป้าหมายกับระดับจริงเพื่อค้นหา Skill Gap",
    hint: "ผลต่างติดลบ (Gap) จะถูกนำไปใช้วิเคราะห์ Skill Gap และแนะนำหลักสูตรพัฒนาในขั้นถัดไป",
  },
  matrix: {
    title: "ตารางทักษะองค์กร (Skill Matrix)",
    subtitle: "มุมมองภาพรวมทักษะของพนักงานแต่ละคนเทียบกับเป้าหมายตำแหน่ง สามารถคลิกที่ช่องระดับเพื่อปรับปรุงข้อมูลได้ทันที",
    hint: "สีเขียว = ผ่านเกณฑ์, สีน้ำเงิน = สูงกว่าเกณฑ์, สีแดง = มีช่องว่างทักษะที่ต้องพัฒนา",
  },
  gap: {
    title: "วิเคราะห์ช่องว่างทักษะ (Skill Gap Analysis)",
    subtitle: "จัดลำดับความสำคัญของช่องว่างทักษะ พร้อมหลักสูตรแนะนำและส่งต่อไปยังแผนพัฒนารายบุคคล (IDP)",
    hint: "คลิก 'ส่งเข้า IDP' เพื่อเชื่อมโยงช่องว่างทักษะเข้าสู่แผนพัฒนาของพนักงาน",
  },
  certifications: {
    title: "ประวัติใบรับรองทักษะ (Skill Certification History)",
    subtitle: "จัดเก็บทะเบียนใบรับรองวิชาชีพและทักษะเฉพาะทาง พร้อมแจ้งเตือนใบรับรองใกล้หมดอายุและบันทึกการต่ออายุ",
    hint: "รองรับการเพิ่มใบรับรองใหม่และกดต่ออายุสำหรับใบรับรองที่ใกล้หมดอายุหรือหมดอายุแล้ว",
  },
};

export function CompetencyWorkspace() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as CompetencyTabKey | null;
  const activeTab: CompetencyTabKey =
    tabParam && VALID_TABS.includes(tabParam) ? tabParam : "dictionary";

  const [dictionary, setDictionary] = useState<CompetencyDictItem[]>(INITIAL_COMPETENCY_DICTIONARY);
  const [positions, setPositions] = useState<PositionCompetencyItem[]>(
    INITIAL_POSITION_COMPETENCIES
  );
  const [assessments, setAssessments] = useState<CompetencyAssessmentItem[]>(
    INITIAL_COMPETENCY_ASSESSMENTS
  );
  const [skillMatrix, setSkillMatrix] = useState<SkillMatrixRow[]>(INITIAL_SKILL_MATRIX);
  const [skillGaps, setSkillGaps] = useState<SkillGapItem[]>(INITIAL_SKILL_GAPS);
  const [certifications, setCertifications] = useState<SkillCertificationItem[]>(
    INITIAL_SKILL_CERTIFICATIONS
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const kpiCards = useMemo(() => {
    if (activeTab === "matrix") {
      let totalCells = 0;
      let metCells = 0;
      let exceedCells = 0;
      let gapCells = 0;
      skillMatrix.forEach((row) => {
        SKILL_COLUMNS.forEach((col) => {
          const cell = row.skills[col.key];
          if (!cell) return;
          totalCells += 1;
          if (cell.actual >= cell.target) metCells += 1;
          if (cell.actual > cell.target) exceedCells += 1;
          if (cell.actual < cell.target) gapCells += 1;
        });
      });
      const readinessRate = totalCells > 0 ? Math.round((metCells / totalCells) * 100) : 0;
      return [
        {
          label: "พนักงานใน Skill Matrix",
          value: `${skillMatrix.length} คน`,
          sub: `ติดตาม ${SKILL_COLUMNS.length} ทักษะหลักขององค์กร`,
          icon: <Grid2x2 className="h-5 w-5" />,
          color: "bg-[#EEF4FF] text-[#2563EB]",
        },
        {
          label: "อัตราความพร้อมรวม",
          value: `${readinessRate}%`,
          sub: `ผ่านเกณฑ์ ${metCells} จาก ${totalCells} ช่องทักษะ`,
          icon: <CheckCircle2 className="h-5 w-5" />,
          color: "bg-[#DCFCE7] text-[#16A34A]",
        },
        {
          label: "ทักษะที่ยังมี Gap",
          value: `${gapCells} ช่อง`,
          sub: "ต่ำกว่าระดับเป้าหมายตำแหน่ง",
          icon: <AlertTriangle className="h-5 w-5" />,
          color: "bg-[#FEF3C7] text-[#D97706]",
        },
        {
          label: "ทักษะสูงกว่าเกณฑ์",
          value: `${exceedCells} ช่อง`,
          sub: "มีศักยภาพเป็น Mentor / วิทยากร",
          icon: <Sparkles className="h-5 w-5" />,
          color: "bg-[#F3E8FF] text-[#7C3AED]",
        },
      ];
    }

    if (activeTab === "gap") {
      const openCount = skillGaps.filter((g) => g.status === "open").length;
      const inIdpCount = skillGaps.filter((g) => g.status === "in-idp").length;
      const closedCount = skillGaps.filter((g) => g.status === "closed").length;
      const highPriority = skillGaps.filter((g) => g.priority === "high" && g.status !== "closed").length;
      return [
        {
          label: "ช่องว่างทักษะทั้งหมด",
          value: `${skillGaps.length} รายการ`,
          sub: `รอวางแผนพัฒนา ${openCount} รายการ`,
          icon: <AlertTriangle className="h-5 w-5" />,
          color: "bg-[#EEF4FF] text-[#2563EB]",
        },
        {
          label: "ระดับเร่งด่วน (High)",
          value: `${highPriority} รายการ`,
          sub: "ควรบรรจุเข้าแผนพัฒนาทันที",
          icon: <ShieldAlert className="h-5 w-5" />,
          color: "bg-[#FEF3C7] text-[#D97706]",
        },
        {
          label: "ส่งเข้าแผน IDP แล้ว",
          value: `${inIdpCount} รายการ`,
          sub: "อยู่ระหว่างติดตามการพัฒนา",
          icon: <TrendingUp className="h-5 w-5" />,
          color: "bg-[#F3E8FF] text-[#7C3AED]",
        },
        {
          label: "ปิด Gap สำเร็จ",
          value: `${closedCount} รายการ`,
          sub: "ผ่านเกณฑ์ระดับเป้าหมายแล้ว",
          icon: <CheckCircle2 className="h-5 w-5" />,
          color: "bg-[#DCFCE7] text-[#16A34A]",
        },
      ];
    }

    if (activeTab === "certifications") {
      const validCount = certifications.filter((c) => c.status === "valid").length;
      const expiringCount = certifications.filter((c) => c.status === "expiring").length;
      const expiredCount = certifications.filter((c) => c.status === "expired").length;
      return [
        {
          label: "ใบรับรองทั้งหมด",
          value: `${certifications.length} รายการ`,
          sub: "บันทึกในทะเบียนประวัติทักษะ",
          icon: <Award className="h-5 w-5" />,
          color: "bg-[#EEF4FF] text-[#2563EB]",
        },
        {
          label: "ใบรับรองที่ใช้งานได้",
          value: `${validCount} รายการ`,
          sub: "ยังไม่หมดอายุและยืนยันแล้ว",
          icon: <CheckCircle2 className="h-5 w-5" />,
          color: "bg-[#DCFCE7] text-[#16A34A]",
        },
        {
          label: "ใกล้หมดอายุ",
          value: `${expiringCount} รายการ`,
          sub: "ควรวางแผนต่ออายุล่วงหน้า",
          icon: <Clock className="h-5 w-5" />,
          color: "bg-[#FEF3C7] text-[#D97706]",
        },
        {
          label: "หมดอายุแล้ว",
          value: `${expiredCount} รายการ`,
          sub: "รอการสอบต่ออายุ (Renewal)",
          icon: <ShieldAlert className="h-5 w-5" />,
          color: "bg-[#F3E8FF] text-[#7C3AED]",
        },
      ];
    }

    if (activeTab === "positions") {
      const uniquePositions = new Set(positions.map((p) => p.positionId)).size;
      const criticalCount = positions.filter((p) => p.critical).length;
      const avgTarget =
        positions.length > 0
          ? (positions.reduce((acc, p) => acc + p.targetLevel, 0) / positions.length).toFixed(1)
          : "0.0";
      return [
        {
          label: "รายการผูกสมรรถนะ",
          value: `${positions.length} รายการ`,
          sub: `ครอบคลุม ${uniquePositions} ตำแหน่งงานหลัก`,
          icon: <Briefcase className="h-5 w-5" />,
          color: "bg-[#EEF4FF] text-[#2563EB]",
        },
        {
          label: "สมรรถนะสำคัญ (Critical)",
          value: `${criticalCount} รายการ`,
          sub: "ต้องผ่านเกณฑ์ก่อนเลื่อนระดับ",
          icon: <ShieldAlert className="h-5 w-5" />,
          color: "bg-[#FEF3C7] text-[#D97706]",
        },
        {
          label: "ระดับเป้าหมายเฉลี่ย",
          value: `Lv.${avgTarget}`,
          sub: "จากระดับความชำนาญสูงสุด Lv.5",
          icon: <Target className="h-5 w-5" />,
          color: "bg-[#F3E8FF] text-[#7C3AED]",
        },
        {
          label: "Functional Competency",
          value: `${positions.filter((p) => p.type === "Functional").length} รายการ`,
          sub: "ทักษะเฉพาะทางตามสายงาน",
          icon: <Sparkles className="h-5 w-5" />,
          color: "bg-[#DCFCE7] text-[#16A34A]",
        },
      ];
    }

    if (activeTab === "assessments") {
      const assessedList = assessments.filter((a) => a.status === "assessed" && a.actualLevel !== null);
      const pendingCount = assessments.filter((a) => a.status === "pending").length;
      const gapCount = assessedList.filter((a) => (a.actualLevel ?? 0) < a.targetLevel).length;
      const meetRate =
        assessedList.length > 0
          ? Math.round(((assessedList.length - gapCount) / assessedList.length) * 100)
          : 0;
      return [
        {
          label: "ประเมินเสร็จแล้ว",
          value: `${assessedList.length}/${assessments.length} รายการ`,
          sub: `รอประเมินอีก ${pendingCount} รายการ`,
          icon: <ClipboardCheck className="h-5 w-5" />,
          color: "bg-[#EEF4FF] text-[#2563EB]",
        },
        {
          label: "อัตราผ่านเกณฑ์ตำแหน่ง",
          value: `${meetRate}%`,
          sub: "ประเมินได้ตั้งแต่ระดับเป้าหมายขึ้นไป",
          icon: <CheckCircle2 className="h-5 w-5" />,
          color: "bg-[#DCFCE7] text-[#16A34A]",
        },
        {
          label: "พบช่องว่างทักษะ (Gap)",
          value: `${gapCount} รายการ`,
          sub: "ต่ำกว่าระดับเป้าหมายที่กำหนด",
          icon: <AlertTriangle className="h-5 w-5" />,
          color: "bg-[#FEF3C7] text-[#D97706]",
        },
        {
          label: "ระดับจริงเฉลี่ย",
          value:
            assessedList.length > 0
              ? `Lv.${(
                  assessedList.reduce((acc, a) => acc + (a.actualLevel ?? 0), 0) / assessedList.length
                ).toFixed(1)}`
              : "—",
          sub: "จากรายการที่ประเมินแล้วทั้งหมด",
          icon: <TrendingUp className="h-5 w-5" />,
          color: "bg-[#F3E8FF] text-[#7C3AED]",
        },
      ];
    }

    const activeCount = dictionary.filter((d) => d.active).length;
    const coreCount = dictionary.filter((d) => d.type === "Core").length;
    const managerialCount = dictionary.filter((d) => d.type === "Managerial").length;
    const functionalCount = dictionary.filter((d) => d.type === "Functional").length;
    return [
      {
        label: "สมรรถนะทั้งหมดในคลัง",
        value: `${dictionary.length} รายการ`,
        sub: `เปิดใช้งานอยู่ ${activeCount} รายการ`,
        icon: <Layers className="h-5 w-5" />,
        color: "bg-[#EEF4FF] text-[#2563EB]",
      },
      {
        label: "Core Competency",
        value: `${coreCount} รายการ`,
        sub: "สมรรถนะหลักร่วมกันทั้งองค์กร",
        icon: <BookOpenCheck className="h-5 w-5" />,
        color: "bg-[#DCFCE7] text-[#16A34A]",
      },
      {
        label: "Managerial Competency",
        value: `${managerialCount} รายการ`,
        sub: "สมรรถนะด้านภาวะผู้นำและการบริหาร",
        icon: <Target className="h-5 w-5" />,
        color: "bg-[#FEF3C7] text-[#D97706]",
      },
      {
        label: "Functional Competency",
        value: `${functionalCount} รายการ`,
        sub: "สมรรถนะเฉพาะทางตามสายอาชีพ",
        icon: <Sparkles className="h-5 w-5" />,
        color: "bg-[#F3E8FF] text-[#7C3AED]",
      },
    ];
  }, [activeTab, dictionary, positions, assessments, skillMatrix, skillGaps, certifications]);

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
        {activeTab === "dictionary" && (
          <CompetencyDictionaryPanel
            items={dictionary}
            onChange={setDictionary}
            onNotify={notify}
          />
        )}
        {activeTab === "positions" && (
          <PositionCompetencyPanel
            items={positions}
            dictionary={dictionary}
            onChange={setPositions}
            onNotify={notify}
          />
        )}
        {activeTab === "assessments" && (
          <CompetencyAssessmentPanel
            items={assessments}
            onChange={setAssessments}
            onNotify={notify}
          />
        )}
        {activeTab === "matrix" && (
          <SkillMatrixPanel
            rows={skillMatrix}
            onChange={setSkillMatrix}
            onNotify={notify}
          />
        )}
        {activeTab === "gap" && (
          <SkillGapPanel
            items={skillGaps}
            onChange={setSkillGaps}
            onNotify={notify}
          />
        )}
        {activeTab === "certifications" && (
          <SkillCertificationPanel
            items={certifications}
            onChange={setCertifications}
            onNotify={notify}
          />
        )}
      </Card>
    </div>
  );
}
