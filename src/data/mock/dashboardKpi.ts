import type { SelectOption } from "@/components/ui";
import type { DashboardKpiDataset } from "@/types/hrd";

export interface PeriodPreset {
  value: string;
  label: string;
  shortLabel: string;
  tooltip: string;
  multiplier: number;
}

export const DASHBOARD_PERIOD_PRESETS: PeriodPreset[] = [
  {
    value: "2026-all",
    label: "ปีงบประมาณ 2569",
    shortLabel: "ทั้งปี 2569",
    tooltip: "สรุปข้อมูลสะสมทั้งปี (ม.ค. – ธ.ค. 2569)",
    multiplier: 1,
  },
  {
    value: "2026-q4",
    label: "ไตรมาส 4 / 2569",
    shortLabel: "Q4",
    tooltip: "ไตรมาสที่ 4 (ต.ค. – ธ.ค. 2569)",
    multiplier: 0.28,
  },
  {
    value: "2026-q3",
    label: "ไตรมาส 3 / 2569",
    shortLabel: "Q3",
    tooltip: "ไตรมาสที่ 3 (ก.ค. – ก.ย. 2569)",
    multiplier: 0.24,
  },
  {
    value: "2026-q2",
    label: "ไตรมาส 2 / 2569",
    shortLabel: "Q2",
    tooltip: "ไตรมาสที่ 2 (เม.ย. – มิ.ย. 2569)",
    multiplier: 0.25,
  },
  {
    value: "2026-q1",
    label: "ไตรมาส 1 / 2569",
    shortLabel: "Q1",
    tooltip: "ไตรมาสที่ 1 (ม.ค. – มี.ค. 2569)",
    multiplier: 0.23,
  },
];

export const DASHBOARD_BRANCH_OPTIONS: SelectOption[] = [
  { value: "all", label: "ทุกสาขา (3 สาขา)" },
  { value: "hq", label: "สำนักงานใหญ่ (กรุงเทพฯ)" },
  { value: "cnx", label: "สาขาเชียงใหม่" },
  { value: "ryg", label: "สาขาระยอง" },
];

export const BRANCH_SHARE: Record<string, number> = {
  all: 1,
  hq: 0.64,
  cnx: 0.19,
  ryg: 0.17,
};

export const DASHBOARD_DEPARTMENT_OPTIONS: SelectOption[] = [
  { value: "all", label: "ทุกแผนก (ทั้งองค์กร)" },
  { value: "eng", label: "ฝ่ายวิศวกรรมซอฟต์แวร์" },
  { value: "ops", label: "ฝ่ายปฏิบัติการและบริการ" },
  { value: "sales", label: "ฝ่ายขายและการตลาด" },
  { value: "hr", label: "ฝ่ายทรัพยากรบุคคลและธุรการ" },
];

export const DASHBOARD_KPI_BY_DEPARTMENT: Record<string, DashboardKpiDataset> = {
  all: {
    totalEmployees: 482,
    employeeDelta: "+18 คน จากปีก่อน",
    activeDepartments: 12,
    trainingCompletionRate: 86.4,
    completionDelta: "+4.2% จากไตรมาสก่อน",
    completionTarget: 85,
    totalTrainingHours: 14620,
    avgHoursPerEmployee: 30.3,
    hoursDelta: "+12.5% เทียบเป้าปีนี้",
    budgetUsed: 2450000,
    budgetAllocated: 3200000,
    budgetRemainingLabel: "คงเหลือ ฿750,000",
  },
  eng: {
    totalEmployees: 148,
    employeeDelta: "+9 คน จากปีก่อน",
    activeDepartments: 1,
    trainingCompletionRate: 91.2,
    completionDelta: "+5.8% จากไตรมาสก่อน",
    completionTarget: 85,
    totalTrainingHours: 5240,
    avgHoursPerEmployee: 35.4,
    hoursDelta: "+18.0% เทียบเป้าปีนี้",
    budgetUsed: 980000,
    budgetAllocated: 1200000,
    budgetRemainingLabel: "คงเหลือ ฿220,000",
  },
  ops: {
    totalEmployees: 164,
    employeeDelta: "+4 คน จากปีก่อน",
    activeDepartments: 1,
    trainingCompletionRate: 82.5,
    completionDelta: "+2.1% จากไตรมาสก่อน",
    completionTarget: 85,
    totalTrainingHours: 4380,
    avgHoursPerEmployee: 26.7,
    hoursDelta: "+6.4% เทียบเป้าปีนี้",
    budgetUsed: 680000,
    budgetAllocated: 950000,
    budgetRemainingLabel: "คงเหลือ ฿270,000",
  },
  sales: {
    totalEmployees: 112,
    employeeDelta: "+3 คน จากปีก่อน",
    activeDepartments: 1,
    trainingCompletionRate: 84.8,
    completionDelta: "+3.5% จากไตรมาสก่อน",
    completionTarget: 85,
    totalTrainingHours: 3210,
    avgHoursPerEmployee: 28.7,
    hoursDelta: "+9.1% เทียบเป้าปีนี้",
    budgetUsed: 540000,
    budgetAllocated: 720000,
    budgetRemainingLabel: "คงเหลือ ฿180,000",
  },
  hr: {
    totalEmployees: 58,
    employeeDelta: "+2 คน จากปีก่อน",
    activeDepartments: 1,
    trainingCompletionRate: 94.0,
    completionDelta: "+6.0% จากไตรมาสก่อน",
    completionTarget: 85,
    totalTrainingHours: 1790,
    avgHoursPerEmployee: 30.9,
    hoursDelta: "+14.2% เทียบเป้าปีนี้",
    budgetUsed: 250000,
    budgetAllocated: 330000,
    budgetRemainingLabel: "คงเหลือ ฿80,000",
  },
};

export const DEPARTMENT_SCALE: Record<string, number> = {
  all: 1,
  eng: 0.34,
  ops: 0.31,
  sales: 0.22,
  hr: 0.13,
};
