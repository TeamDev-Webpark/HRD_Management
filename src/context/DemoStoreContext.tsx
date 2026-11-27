"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { INITIAL_NOTIFICATIONS } from "@/data/mock/layout";
import {
  ESS_EMPLOYEE_PROFILE,
  INITIAL_ESS_GOALS,
  INITIAL_ESS_IDP,
  INITIAL_ESS_TRAININGS,
  type EssGoalItem,
  type EssIdpActivity,
  type EssTrainingItem,
} from "@/data/mock/essData";
import {
  INITIAL_MSS_APPROVALS,
  INITIAL_MSS_TEAM,
  MSS_MANAGER_PROFILE,
  type MssTeamMember,
  type MssTrainingApprovalItem,
} from "@/data/mock/mssData";
import {
  INITIAL_TALENT_POOL,
  type TalentPoolItem,
} from "@/data/mock/talentManagement";
import type { NotificationItem, RoleKey } from "@/types/hrd";

export interface AssignedFormItem {
  id: string;
  code: string;
  title: string;
  type: "แบบฟอร์มประเมิน" | "แบบสำรวจความต้องการอบรม" | "เอกสารรับทราบนโยบาย";
  senderName: string;
  targetEmployeeName: string;
  dueDate: string;
  description: string;
  status: "pending" | "submitted";
  submittedNote?: string;
  submittedAt?: string;
}

const INITIAL_ASSIGNED_FORMS: AssignedFormItem[] = [
  {
    id: "FRM-01",
    code: "FORM-69-01",
    title: "แบบฟอร์มประเมินตนเองรอบปลายปี 2569 (Self-Assessment)",
    type: "แบบฟอร์มประเมิน",
    senderName: "พิมพ์ชนก วัฒนากูล (HRD Admin)",
    targetEmployeeName: ESS_EMPLOYEE_PROFILE.name,
    dueDate: "15 ธ.ค. 2569",
    description: "กรุณากรอกสรุปผลงานเด่นและประเมินตนเองตามเป้าหมาย KPI ประจำปี 2569",
    status: "pending",
  },
];

interface PersistedDemoState {
  notifications: NotificationItem[];
  essGoals: EssGoalItem[];
  essIdp: EssIdpActivity[];
  essTrainings: EssTrainingItem[];
  mssTeam: MssTeamMember[];
  mssApprovals: MssTrainingApprovalItem[];
  talentPool: TalentPoolItem[];
  assignedForms: AssignedFormItem[];
}

const STORAGE_KEY = "hrd_management_live_demo_v1";

interface DemoStoreValue extends PersistedDemoState {
  pushNotification: (
    item: Omit<NotificationItem, "id" | "timestamp" | "read">
  ) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (role: RoleKey) => void;

  // ESS actions (auto-sync to MSS & Notifications)
  updateEssGoal: (goalId: string, progress: number, selfScore: number) => void;
  completeEssIdp: (activityId: string) => void;
  enrollEssTraining: (trainingId: string) => void;
  submitAssignedForm: (formId: string, note: string) => void;

  // MSS actions (auto-sync to ESS, Talent Pool & Notifications)
  rateTeamMember: (memberId: string, managerScore: number) => void;
  boostTeamCompetency: (memberId: string) => void;
  approveTeamIdp: (memberId: string) => void;
  decideTrainingApproval: (
    approvalId: string,
    decision: "approved" | "rejected"
  ) => void;
  nominateToTalentPool: (memberId: string) => void;

  // Admin actions (auto-sync to ESS & Talent Pool)
  sendFormToEmployee: (
    title: string,
    type: AssignedFormItem["type"],
    dueDate: string,
    description: string
  ) => void;
  setTalentPool: (items: TalentPoolItem[]) => void;

  // Demo reset
  resetDemoData: () => void;
}

const DemoStoreContext = createContext<DemoStoreValue | null>(null);

function getDefaultState(): PersistedDemoState {
  return {
    notifications: INITIAL_NOTIFICATIONS,
    essGoals: INITIAL_ESS_GOALS,
    essIdp: INITIAL_ESS_IDP,
    essTrainings: INITIAL_ESS_TRAININGS,
    mssTeam: INITIAL_MSS_TEAM,
    mssApprovals: INITIAL_MSS_APPROVALS,
    talentPool: INITIAL_TALENT_POOL,
    assignedForms: INITIAL_ASSIGNED_FORMS,
  };
}

function formatNowTime(): string {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  return `เมื่อสักครู่ (${hh}:${mm} น.)`;
}

export function DemoStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedDemoState>(getDefaultState);
  const [hydrated, setHydrated] = useState(false);

  // Load persisted state on client mount
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PersistedDemoState>;
        setState((prev) => ({
          notifications: parsed.notifications ?? prev.notifications,
          essGoals: parsed.essGoals ?? prev.essGoals,
          essIdp: parsed.essIdp ?? prev.essIdp,
          essTrainings: parsed.essTrainings ?? prev.essTrainings,
          mssTeam: parsed.mssTeam ?? prev.mssTeam,
          mssApprovals: parsed.mssApprovals ?? prev.mssApprovals,
          talentPool: parsed.talentPool ?? prev.talentPool,
          assignedForms: parsed.assignedForms ?? prev.assignedForms,
        }));
      }
    } catch {
      // ignore corrupted storage
    } finally {
      setHydrated(true);
    }
  }, []);

  // Persist changes to localStorage
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota errors
    }
  }, [state, hydrated]);

  const pushNotification = useCallback(
    (item: Omit<NotificationItem, "id" | "timestamp" | "read">) => {
      const created: NotificationItem = {
        ...item,
        id: `NOTI-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: formatNowTime(),
        read: false,
      };
      setState((prev) => ({
        ...prev,
        notifications: [created, ...prev.notifications],
      }));
    },
    []
  );

  const markNotificationRead = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  }, []);

  const markAllNotificationsRead = useCallback((role: RoleKey) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        !n.targetRoles || n.targetRoles.includes(role) ? { ...n, read: true } : n
      ),
    }));
  }, []);

  // ESS -> MSS: Update Goal & Self-Score
  const updateEssGoal = useCallback(
    (goalId: string, progress: number, selfScore: number) => {
      setState((prev) => {
        const nextGoals = prev.essGoals.map((g) =>
          g.id === goalId
            ? {
                ...g,
                progress,
                selfScore,
                status:
                  progress >= 100
                    ? ("completed" as const)
                    : progress >= 70
                      ? ("on-track" as const)
                      : ("needs-attention" as const),
              }
            : g
        );
        const avgKpi = Math.round(
          nextGoals.reduce((a, g) => a + g.progress, 0) / nextGoals.length
        );
        const scored = nextGoals.filter((g) => g.selfScore !== null);
        const avgSelf =
          scored.length > 0
            ? Number(
                (
                  scored.reduce((a, g) => a + (g.selfScore ?? 0), 0) /
                  scored.length
                ).toFixed(1)
              )
            : 4.5;

        const nextTeam = prev.mssTeam.map((m) =>
          m.employeeCode === ESS_EMPLOYEE_PROFILE.employeeCode
            ? { ...m, kpiProgress: avgKpi, selfScore: avgSelf }
            : m
        );

        const noti: NotificationItem = {
          id: `NOTI-${Date.now()}`,
          title: `${ESS_EMPLOYEE_PROFILE.name} อัปเดตผล KPI & ประเมินตนเอง`,
          message: `ความคืบหน้า KPI เฉลี่ย ${avgKpi}% • คะแนนประเมินตนเอง ${avgSelf}/5.0`,
          timestamp: formatNowTime(),
          category: "performance",
          read: false,
          href: "/mss?tab=performance",
          targetRoles: ["manager", "admin"],
        };

        return {
          ...prev,
          essGoals: nextGoals,
          mssTeam: nextTeam,
          notifications: [noti, ...prev.notifications],
        };
      });
    },
    []
  );

  // ESS -> MSS: Complete IDP Activity
  const completeEssIdp = useCallback((activityId: string) => {
    setState((prev) => {
      const targetAct = prev.essIdp.find((a) => a.id === activityId);
      const nextIdp = prev.essIdp.map((a) =>
        a.id === activityId ? { ...a, progress: 100, status: "done" as const } : a
      );
      const avgIdp = Math.round(
        nextIdp.reduce((a, i) => a + i.progress, 0) / nextIdp.length
      );
      const nextTeam = prev.mssTeam.map((m) =>
        m.employeeCode === ESS_EMPLOYEE_PROFILE.employeeCode
          ? {
              ...m,
              idpProgress: avgIdp,
              idpStatus: avgIdp === 100 ? ("completed" as const) : m.idpStatus,
            }
          : m
      );
      const noti: NotificationItem = {
        id: `NOTI-${Date.now()}`,
        title: `${ESS_EMPLOYEE_PROFILE.name} ทำกิจกรรม IDP เสร็จสิ้น`,
        message: `กิจกรรม "${targetAct?.title ?? "IDP"}" เสร็จสมบูรณ์ (ภาพรวม IDP ${avgIdp}%)`,
        timestamp: formatNowTime(),
        category: "performance",
        read: false,
        href: "/mss?tab=idp",
        targetRoles: ["manager", "admin"],
      };
      return {
        ...prev,
        essIdp: nextIdp,
        mssTeam: nextTeam,
        notifications: [noti, ...prev.notifications],
      };
    });
  }, []);

  // ESS -> MSS: Enroll in Training -> Creates Live Approval Request in MSS
  const enrollEssTraining = useCallback((trainingId: string) => {
    setState((prev) => {
      const target = prev.essTrainings.find((t) => t.id === trainingId);
      if (!target || target.enrolled) return prev;

      const nextTrainings = prev.essTrainings.map((t) =>
        t.id === trainingId
          ? {
              ...t,
              enrolled: true,
              seatsLeft: Math.max(0, t.seatsLeft - 1),
              approvalStatus: "pending" as const,
            }
          : t
      );

      const newApproval: MssTrainingApprovalItem = {
        id: `APR-${Date.now()}`,
        code: `REQ-TRN-0${prev.mssApprovals.length + 1}`,
        employeeCode: ESS_EMPLOYEE_PROFILE.employeeCode,
        employeeName: ESS_EMPLOYEE_PROFILE.name,
        courseName: target.courseName,
        dateRange: target.dateRange,
        cost: target.hours * 1000,
        reason: "พนักงานส่งคำขอลงทะเบียนผ่านระบบ ESS เพื่อพัฒนาทักษะตามแผนปี 2569",
        status: "pending",
      };

      const noti: NotificationItem = {
        id: `NOTI-${Date.now()}`,
        title: `คำขอลงทะเบียนอบรมใหม่จาก ${ESS_EMPLOYEE_PROFILE.name}`,
        message: `หลักสูตร "${target.courseName}" (${target.dateRange}) รอหัวหน้างานอนุมัติ`,
        timestamp: formatNowTime(),
        category: "approval",
        read: false,
        href: "/mss?tab=approvals",
        targetRoles: ["manager", "admin"],
      };

      return {
        ...prev,
        essTrainings: nextTrainings,
        mssApprovals: [newApproval, ...prev.mssApprovals],
        notifications: [noti, ...prev.notifications],
      };
    });
  }, []);

  // ESS -> Admin: Submit Assigned Form / Document
  const submitAssignedForm = useCallback((formId: string, note: string) => {
    setState((prev) => {
      const target = prev.assignedForms.find((f) => f.id === formId);
      if (!target) return prev;

      const nextForms = prev.assignedForms.map((f) =>
        f.id === formId
          ? {
              ...f,
              status: "submitted" as const,
              submittedNote: note.trim() || "ส่งข้อมูลเรียบร้อยแล้ว",
              submittedAt: formatNowTime(),
            }
          : f
      );

      const noti: NotificationItem = {
        id: `NOTI-${Date.now()}`,
        title: `${ESS_EMPLOYEE_PROFILE.name} ส่งแบบฟอร์มเรียบร้อยแล้ว`,
        message: `ส่ง "${target.title}" แล้ว — หมายเหตุ: ${note.trim() || "ครบถ้วน"}`,
        timestamp: formatNowTime(),
        category: "performance",
        read: false,
        href: "/performance?tab=reviews",
        targetRoles: ["admin", "manager"],
      };

      return {
        ...prev,
        assignedForms: nextForms,
        notifications: [noti, ...prev.notifications],
      };
    });
  }, []);

  // MSS -> ESS: Rate Team Member
  const rateTeamMember = useCallback((memberId: string, managerScore: number) => {
    setState((prev) => {
      const member = prev.mssTeam.find((m) => m.id === memberId);
      const nextTeam = prev.mssTeam.map((m) =>
        m.id === memberId ? { ...m, managerScore } : m
      );
      const noti: NotificationItem = {
        id: `NOTI-${Date.now()}`,
        title: "หัวหน้างานบันทึกผลประเมินผลงานของคุณแล้ว",
        message: `${MSS_MANAGER_PROFILE.name} ให้คะแนนประเมิน ${member?.name ?? ""} เท่ากับ ${managerScore.toFixed(1)} / 5.0`,
        timestamp: formatNowTime(),
        category: "performance",
        read: false,
        href: "/ess?tab=performance",
        targetRoles: ["employee", "admin"],
      };
      return {
        ...prev,
        mssTeam: nextTeam,
        notifications: [noti, ...prev.notifications],
      };
    });
  }, []);

  // MSS: Boost Team Competency
  const boostTeamCompetency = useCallback((memberId: string) => {
    setState((prev) => ({
      ...prev,
      mssTeam: prev.mssTeam.map((m) =>
        m.id === memberId
          ? { ...m, skillReadiness: Math.min(100, m.skillReadiness + 5) }
          : m
      ),
    }));
  }, []);

  // MSS -> ESS: Approve Team IDP
  const approveTeamIdp = useCallback((memberId: string) => {
    setState((prev) => {
      const member = prev.mssTeam.find((m) => m.id === memberId);
      const nextTeam = prev.mssTeam.map((m) =>
        m.id === memberId ? { ...m, idpStatus: "approved" as const } : m
      );
      const noti: NotificationItem = {
        id: `NOTI-${Date.now()}`,
        title: `อนุมัติแผนพัฒนา IDP ของ ${member?.name ?? "พนักงาน"} แล้ว`,
        message: `${MSS_MANAGER_PROFILE.name} อนุมัติแผน IDP เรียบร้อย สามารถเริ่มทำกิจกรรมได้เลย`,
        timestamp: formatNowTime(),
        category: "approval",
        read: false,
        href: "/ess?tab=idp",
        targetRoles: ["employee", "admin"],
      };
      return {
        ...prev,
        mssTeam: nextTeam,
        notifications: [noti, ...prev.notifications],
      };
    });
  }, []);

  // MSS -> ESS: Decide Training Approval (Syncs directly back to ESS!)
  const decideTrainingApproval = useCallback(
    (approvalId: string, decision: "approved" | "rejected") => {
      setState((prev) => {
        const req = prev.mssApprovals.find((a) => a.id === approvalId);
        if (!req) return prev;

        const nextApprovals = prev.mssApprovals.map((a) =>
          a.id === approvalId ? { ...a, status: decision } : a
        );

        const nextEssTrainings = prev.essTrainings.map((t) =>
          t.courseName === req.courseName
            ? {
                ...t,
                enrolled: decision === "approved",
                approvalStatus: decision === "approved" ? ("approved" as const) : undefined,
              }
            : t
        );

        const noti: NotificationItem = {
          id: `NOTI-${Date.now()}`,
          title:
            decision === "approved"
              ? `คำขออบรม "${req.courseName}" ได้รับการอนุมัติแล้ว`
              : `คำขออบรม "${req.courseName}" ไม่ได้รับการอนุมัติ`,
          message: `พิจารณาโดย ${MSS_MANAGER_PROFILE.name} (${req.employeeName})`,
          timestamp: formatNowTime(),
          category: "training",
          read: false,
          href: "/ess?tab=training",
          targetRoles: ["employee", "admin"],
        };

        return {
          ...prev,
          mssApprovals: nextApprovals,
          essTrainings: nextEssTrainings,
          notifications: [noti, ...prev.notifications],
        };
      });
    },
    []
  );

  // MSS -> Admin Talent Pool: Nominate Team Member
  const nominateToTalentPool = useCallback((memberId: string) => {
    setState((prev) => {
      const member = prev.mssTeam.find((m) => m.id === memberId);
      if (!member) return prev;

      const nextTeam = prev.mssTeam.map((m) =>
        m.id === memberId ? { ...m, talentNominated: true } : m
      );

      const alreadyInPool = prev.talentPool.some(
        (t) => t.employeeCode === member.employeeCode
      );
      const nextPool: TalentPoolItem[] = alreadyInPool
        ? prev.talentPool
        : [
            {
              id: `TL-${Date.now()}`,
              code: `TLT-69-0${prev.talentPool.length + 1}`,
              employeeCode: member.employeeCode,
              employeeName: member.name,
              position: member.position,
              department: MSS_MANAGER_PROFILE.department,
              tier: "Emerging Talent",
              performance: member.kpiProgress >= 85 ? 3 : 2,
              potential: 3,
              retentionRisk: "low",
              targetNextRole: "Senior Specialist / Team Lead",
              status: "nominated",
            },
            ...prev.talentPool,
          ];

      const noti: NotificationItem = {
        id: `NOTI-${Date.now()}`,
        title: `เสนอชื่อ ${member.name} เข้าสู่ Talent Pool`,
        message: `${MSS_MANAGER_PROFILE.name} เสนอชื่อจากทีม ${MSS_MANAGER_PROFILE.teamName} รอ HRD ยืนยันรับเข้า Pool`,
        timestamp: formatNowTime(),
        category: "approval",
        read: false,
        href: "/talent?tab=pool",
        targetRoles: ["admin"],
      };

      return {
        ...prev,
        mssTeam: nextTeam,
        talentPool: nextPool,
        notifications: [noti, ...prev.notifications],
      };
    });
  }, []);

  // Admin -> ESS: Send Document / Evaluation Form to Employee
  const sendFormToEmployee = useCallback(
    (
      title: string,
      type: AssignedFormItem["type"],
      dueDate: string,
      description: string
    ) => {
      setState((prev) => {
        const created: AssignedFormItem = {
          id: `FRM-${Date.now()}`,
          code: `FORM-69-0${prev.assignedForms.length + 1}`,
          title: title.trim(),
          type,
          senderName: "พิมพ์ชนก วัฒนากูล (HRD Admin)",
          targetEmployeeName: ESS_EMPLOYEE_PROFILE.name,
          dueDate: dueDate.trim() || "20 ธ.ค. 2569",
          description:
            description.trim() || "กรุณาตรวจสอบรายละเอียดและกดส่งแบบฟอร์มผ่านระบบ ESS",
          status: "pending",
        };

        const noti: NotificationItem = {
          id: `NOTI-${Date.now()}`,
          title: `ได้รับ${type}ใหม่จาก HRD`,
          message: `"${created.title}" — กำหนดส่งภายใน ${created.dueDate}`,
          timestamp: formatNowTime(),
          category: "performance",
          read: false,
          href: "/ess?tab=overview",
          targetRoles: ["employee", "admin"],
        };

        return {
          ...prev,
          assignedForms: [created, ...prev.assignedForms],
          notifications: [noti, ...prev.notifications],
        };
      });
    },
    []
  );

  const setTalentPool = useCallback((items: TalentPoolItem[]) => {
    setState((prev) => ({ ...prev, talentPool: items }));
  }, []);

  const resetDemoData = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setState(getDefaultState());
  }, []);

  const value = useMemo<DemoStoreValue>(
    () => ({
      ...state,
      pushNotification,
      markNotificationRead,
      markAllNotificationsRead,
      updateEssGoal,
      completeEssIdp,
      enrollEssTraining,
      submitAssignedForm,
      rateTeamMember,
      boostTeamCompetency,
      approveTeamIdp,
      decideTrainingApproval,
      nominateToTalentPool,
      sendFormToEmployee,
      setTalentPool,
      resetDemoData,
    }),
    [
      state,
      pushNotification,
      markNotificationRead,
      markAllNotificationsRead,
      updateEssGoal,
      completeEssIdp,
      enrollEssTraining,
      submitAssignedForm,
      rateTeamMember,
      boostTeamCompetency,
      approveTeamIdp,
      decideTrainingApproval,
      nominateToTalentPool,
      sendFormToEmployee,
      setTalentPool,
      resetDemoData,
    ]
  );

  return (
    <DemoStoreContext.Provider value={value}>
      {children}
    </DemoStoreContext.Provider>
  );
}

export function useDemoStore() {
  const ctx = useContext(DemoStoreContext);
  if (!ctx) {
    throw new Error("useDemoStore must be used within DemoStoreProvider");
  }
  return ctx;
}
