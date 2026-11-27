"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { Card, InfoHint, Tooltip } from "@/components/ui";
import { useDemoStore } from "@/context/DemoStoreContext";
import { MSS_MANAGER_PROFILE } from "@/data/mock/mssData";
import {
  MssTeamCompetencyPanel,
  MssTeamIdpPanel,
  MssTeamOverviewPanel,
  MssTeamPerformancePanel,
} from "./MssPanelsPart1";
import {
  MssTeamLmsPanel,
  MssTeamTalentPanel,
  MssTrainingApprovalsPanel,
} from "./MssPanelsPart2";

type MssTabKey =
  | "team"
  | "performance"
  | "competency"
  | "idp"
  | "approvals"
  | "lms"
  | "talent";

const VALID_TABS: MssTabKey[] = [
  "team",
  "performance",
  "competency",
  "idp",
  "approvals",
  "lms",
  "talent",
];

const TAB_META: Record<MssTabKey, { title: string; subtitle: string; hint: string }> = {
  team: {
    title: "บริการตนเองหัวหน้างาน (MSS — ภาพรวมทีมของฉัน)",
    subtitle: `ดูแลทีม ${MSS_MANAGER_PROFILE.teamName} (${MSS_MANAGER_PROFILE.department}) โดย ${MSS_MANAGER_PROFILE.name}`,
    hint: "มุมมองรวมสำหรับหัวหน้างานในการติดตามผลงาน ทักษะ แผน IDP ชั่วโมงอบรม และ Talent ของลูกทีม",
  },
  performance: {
    title: "ประเมินผลงานทีม (Team Performance Review)",
    subtitle: "เปรียบเทียบคะแนนประเมินตนเองของลูกทีมและบันทึกคะแนนประเมินโดยหัวหน้างาน",
    hint: "คลิกปุ่ม 'ประเมิน' เพื่อบันทึกคะแนน Manager Score เต็ม 5.0",
  },
  competency: {
    title: "สมรรถนะและทักษะทีม (Team Competency)",
    subtitle: "ติดตามระดับความพร้อมสมรรถนะของสมาชิกแต่ละคนและอัปเดตผลประเมินทักษะรอบใหม่",
    hint: "ใช้ระบุสมาชิกที่ยังมี Skill Gap เพื่อจัดสรรงานหรือส่งเข้าอบรมได้ตรงจุด",
  },
  idp: {
    title: "ติดตามและอนุมัติ IDP ทีม (Team IDP Approval)",
    subtitle: "ตรวจสอบแผนพัฒนารายบุคคลของลูกทีมและกดอนุมัติแผนเพื่อให้เริ่มดำเนินการ",
    hint: "รายการที่มีสถานะ 'รออนุมัติแผน' สามารถกดอนุมัติได้ทันทีจากตารางนี้",
  },
  approvals: {
    title: "อนุมัติคำขอฝึกอบรม (Training Request Approvals)",
    subtitle: "พิจารณาอนุมัติหรือปฏิเสธคำขอลงทะเบียนฝึกอบรมของลูกทีมพร้อมงบประมาณ",
    hint: "คำขอที่อนุมัติแล้วจะส่งต่อไปยังฝ่าย HRD เพื่อยืนยันที่นั่งอบรมโดยอัตโนมัติ",
  },
  lms: {
    title: "ผลเรียน LMS ของทีม (Team LMS Progress)",
    subtitle: "ติดตามความคืบหน้าการเรียนคอร์สออนไลน์บังคับของสมาชิกในทีมและส่งการแจ้งเตือนได้ทันที",
    hint: "กดปุ่ม 'ส่งแจ้งเตือน' สำหรับลูกทีมที่ยังเรียนไม่ครบ 100%",
  },
  talent: {
    title: "เสนอชื่อเข้า Talent Pool (Team Talent Nomination)",
    subtitle: "หัวหน้างานคัดเลือกและเสนอชื่อลูกทีมที่มีผลงานและศักยภาพโดดเด่นส่งให้ HRD พิจารณารับเข้าสู่ Talent Pool",
    hint: "รายชื่อที่เสนอจะถูกส่งเข้าสู่กระบวนการ Talent Review ใน Module 08",
  },
};

export function MssWorkspace() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as MssTabKey | null;
  const activeTab: MssTabKey = tabParam && VALID_TABS.includes(tabParam) ? tabParam : "team";

  const {
    mssTeam: team,
    mssApprovals: approvals,
    rateTeamMember,
    boostTeamCompetency,
    approveTeamIdp,
    decideTrainingApproval,
    nominateToTalentPool,
    pushNotification,
  } = useDemoStore();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const kpiCards = useMemo(() => {
    const avgKpi = Math.round(team.reduce((a, m) => a + m.kpiProgress, 0) / team.length);
    const pendingReviews = team.filter((m) => m.managerScore === null).length;
    const pendingApprovals =
      approvals.filter((a) => a.status === "pending").length +
      team.filter((m) => m.idpStatus === "pending").length;
    const talentCount = team.filter((m) => m.talentNominated).length;

    return [
      {
        label: "สมาชิกในทีมทั้งหมด",
        value: `${team.length} คน`,
        sub: `ทีม ${MSS_MANAGER_PROFILE.teamName}`,
        icon: <Users className="h-5 w-5" />,
        color: "bg-[#EEF4FF] text-[#2563EB]",
      },
      {
        label: "ความคืบหน้า KPI เฉลี่ยทีม",
        value: `${avgKpi}%`,
        sub: `รอหัวหน้าประเมิน ${pendingReviews} คน`,
        icon: <TrendingUp className="h-5 w-5" />,
        color: "bg-[#DCFCE7] text-[#16A34A]",
      },
      {
        label: "รายการรออนุมัติทั้งหมด",
        value: `${pendingApprovals} รายการ`,
        sub: "รวมคำขออบรมและแผน IDP ของทีม",
        icon: <Clock className="h-5 w-5" />,
        color: "bg-[#FEF3C7] text-[#D97706]",
      },
      {
        label: "เสนอชื่อเข้า Talent Pool",
        value: `${talentCount} คน`,
        sub: "จากสมาชิกในทีมทั้งหมด",
        icon: activeTab === "performance" ? <ClipboardCheck className="h-5 w-5" /> : <Star className="h-5 w-5" />,
        color: "bg-[#F3E8FF] text-[#7C3AED]",
      },
    ];
  }, [team, approvals, activeTab]);

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
        {activeTab === "team" && <MssTeamOverviewPanel team={team} />}
        {activeTab === "performance" && (
          <MssTeamPerformancePanel
            team={team}
            onChange={(nextTeam) => {
              nextTeam.forEach((m) => {
                const prev = team.find((p) => p.id === m.id);
                if (prev && prev.managerScore !== m.managerScore && m.managerScore !== null) {
                  rateTeamMember(m.id, m.managerScore);
                }
              });
            }}
            onNotify={notify}
          />
        )}
        {activeTab === "competency" && (
          <MssTeamCompetencyPanel
            team={team}
            onChange={(nextTeam) => {
              nextTeam.forEach((m) => {
                const prev = team.find((p) => p.id === m.id);
                if (prev && prev.skillReadiness !== m.skillReadiness) {
                  boostTeamCompetency(m.id);
                }
              });
            }}
            onNotify={notify}
          />
        )}
        {activeTab === "idp" && (
          <MssTeamIdpPanel
            team={team}
            onChange={(nextTeam) => {
              nextTeam.forEach((m) => {
                const prev = team.find((p) => p.id === m.id);
                if (prev && prev.idpStatus !== m.idpStatus && m.idpStatus === "approved") {
                  approveTeamIdp(m.id);
                }
              });
            }}
            onNotify={notify}
          />
        )}
        {activeTab === "approvals" && (
          <MssTrainingApprovalsPanel
            items={approvals}
            onChange={(nextApprovals) => {
              nextApprovals.forEach((a) => {
                const prev = approvals.find((p) => p.id === a.id);
                if (prev && prev.status !== a.status && a.status !== "pending") {
                  decideTrainingApproval(a.id, a.status);
                }
              });
            }}
            onNotify={notify}
          />
        )}
        {activeTab === "lms" && (
          <MssTeamLmsPanel
            team={team}
            onNotify={(msg) => {
              pushNotification({
                title: "แจ้งเตือนเรียนคอร์ส LMS จากหัวหน้างาน",
                message: msg,
                category: "training",
                href: "/ess?tab=lms",
                targetRoles: ["employee"],
              });
              notify(msg);
            }}
          />
        )}
        {activeTab === "talent" && (
          <MssTeamTalentPanel
            team={team}
            onChange={(nextTeam) => {
              nextTeam.forEach((m) => {
                const prev = team.find((p) => p.id === m.id);
                if (prev && !prev.talentNominated && m.talentNominated) {
                  nominateToTalentPool(m.id);
                }
              });
            }}
            onNotify={notify}
          />
        )}
      </Card>
    </div>
  );
}
