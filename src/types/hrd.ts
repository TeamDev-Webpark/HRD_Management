export type RoleKey = "admin" | "manager" | "employee";

export interface DemoUser {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  initials: string;
  role: RoleKey;
  roleLabel: string;
  company: string;
  branch: string;
  department: string;
  position: string;
  jobGrade: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  category: "approval" | "training" | "performance" | "system";
  read: boolean;
}

export interface SidebarSubMenuItem {
  id: string;
  label: string;
  href: string;
  tabKey: string;
  group?: string;
}

export interface SidebarMenuItem {
  id: string;
  label: string;
  labelEn: string;
  href: string;
  icon: "dashboard" | "performance" | "training" | "lms" | "competency" | "idp" | "career" | "talent" | "reports" | "settings" | "palette";
  moduleCode?: string;
  children?: SidebarSubMenuItem[];
}

export interface DashboardKpiDataset {
  totalEmployees: number;
  employeeDelta: string;
  activeDepartments: number;
  trainingCompletionRate: number;
  completionDelta: string;
  completionTarget: number;
  totalTrainingHours: number;
  avgHoursPerEmployee: number;
  hoursDelta: string;
  budgetUsed: number;
  budgetAllocated: number;
  budgetRemainingLabel: string;
}
