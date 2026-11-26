import type { SelectOption } from "@/components/ui";

export type TrainingNeedStatus = "pending" | "approved" | "returned";
export type PriorityLevel = "high" | "medium" | "low";

export interface TrainingNeedItem {
  id: string;
  code: string;
  topic: string;
  category: string;
  department: string;
  requester: string;
  targetHeadcount: number;
  estimatedBudget: number;
  priority: PriorityLevel;
  source: "Skill Gap" | "Manager Request" | "IDP" | "Compliance";
  status: TrainingNeedStatus;
  submittedDate: string;
}

export interface CourseCatalogItem {
  id: string;
  code: string;
  title: string;
  category: string;
  courseType: "In-House" | "Public" | "LMS" | "Workshop";
  durationHours: number;
  costPerSession: number;
  targetAudience: string;
  summary: string;
  active: boolean;
}

export type AnnualPlanStatus = "planned" | "in-progress" | "completed" | "postponed";

export interface AnnualPlanItem {
  id: string;
  code: string;
  courseTitle: string;
  category: string;
  quarter: "Q1" | "Q2" | "Q3" | "Q4";
  department: string;
  sessions: number;
  targetParticipants: number;
  budgetAllocated: number;
  status: AnnualPlanStatus;
}

export const TRAINING_DEPARTMENT_OPTIONS: SelectOption[] = [
  { value: "all", label: "ทุกแผนก" },
  { value: "ฝ่ายวิศวกรรมซอฟต์แวร์", label: "ฝ่ายวิศวกรรมซอฟต์แวร์" },
  { value: "ฝ่ายปฏิบัติการและบริการ", label: "ฝ่ายปฏิบัติการและบริการ" },
  { value: "ฝ่ายขายและการตลาด", label: "ฝ่ายขายและการตลาด" },
  { value: "ฝ่ายทรัพยากรบุคคล", label: "ฝ่ายทรัพยากรบุคคล" },
  { value: "ทุกแผนก (องค์กร)", label: "ทุกแผนก (องค์กร)" },
];

export const TRAINING_CATEGORY_OPTIONS: SelectOption[] = [
  { value: "all", label: "ทุกหมวดหมู่" },
  { value: "Leadership", label: "Leadership & Management" },
  { value: "Digital & Data", label: "Digital & Data Literacy" },
  { value: "Functional", label: "Functional & Technical" },
  { value: "Soft Skill", label: "Soft Skills & Collaboration" },
  { value: "Compliance", label: "Compliance & Safety" },
];

export const COURSE_TYPE_OPTIONS: SelectOption[] = [
  { value: "all", label: "ทุกประเภทหลักสูตร" },
  { value: "In-House", label: "In-House Training" },
  { value: "Public", label: "Public Training" },
  { value: "LMS", label: "E-Learning (LMS)" },
  { value: "Workshop", label: "Hands-on Workshop" },
];

export const INITIAL_TRAINING_NEEDS: TrainingNeedItem[] = [
  {
    id: "TN-01",
    code: "TNA-2569-01",
    topic: "Generative AI & Data Analytics for Productivity",
    category: "Digital & Data",
    department: "ฝ่ายปฏิบัติการและบริการ",
    requester: "กฤติน วงศ์สุวรรณ",
    targetHeadcount: 45,
    estimatedBudget: 120000,
    priority: "high",
    source: "Skill Gap",
    status: "pending",
    submittedDate: "18 พ.ย. 2569",
  },
  {
    id: "TN-02",
    code: "TNA-2569-02",
    topic: "Cloud Security & Zero Trust Architecture",
    category: "Functional",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    requester: "ธนกร ศิริสวัสดิ์",
    targetHeadcount: 30,
    estimatedBudget: 165000,
    priority: "high",
    source: "Manager Request",
    status: "approved",
    submittedDate: "14 พ.ย. 2569",
  },
  {
    id: "TN-03",
    code: "TNA-2569-03",
    topic: "Coaching & Effective Feedback for Team Leads",
    category: "Leadership",
    department: "ทุกแผนก (องค์กร)",
    requester: "พิมพ์ชนก วัฒนากูล",
    targetHeadcount: 35,
    estimatedBudget: 95000,
    priority: "high",
    source: "IDP",
    status: "pending",
    submittedDate: "12 พ.ย. 2569",
  },
  {
    id: "TN-04",
    code: "TNA-2569-04",
    topic: "Consultative B2B Sales & Negotiation",
    category: "Functional",
    department: "ฝ่ายขายและการตลาด",
    requester: "สุภาพร กิตติคุณ",
    targetHeadcount: 28,
    estimatedBudget: 84000,
    priority: "medium",
    source: "Skill Gap",
    status: "approved",
    submittedDate: "09 พ.ย. 2569",
  },
  {
    id: "TN-05",
    code: "TNA-2569-05",
    topic: "PDPA & Cyber Security Refresher 2026",
    category: "Compliance",
    department: "ทุกแผนก (องค์กร)",
    requester: "ปาริชาติ ทองดี",
    targetHeadcount: 482,
    estimatedBudget: 45000,
    priority: "high",
    source: "Compliance",
    status: "approved",
    submittedDate: "05 พ.ย. 2569",
  },
  {
    id: "TN-06",
    code: "TNA-2569-06",
    topic: "Executive Presentation & Storytelling",
    category: "Soft Skill",
    department: "ฝ่ายขายและการตลาด",
    requester: "สุภาพร กิตติคุณ",
    targetHeadcount: 20,
    estimatedBudget: 52000,
    priority: "low",
    source: "Manager Request",
    status: "returned",
    submittedDate: "02 พ.ย. 2569",
  },
];

export const INITIAL_COURSE_CATALOG: CourseCatalogItem[] = [
  {
    id: "CRS-01",
    code: "CRS-LD-101",
    title: "Leadership for New Managers",
    category: "Leadership",
    courseType: "In-House",
    durationHours: 12,
    costPerSession: 68000,
    targetAudience: "หัวหน้างานใหม่ / JG-06 ขึ้นไป",
    summary: "ปูพื้นฐานการบริหารทีม การตั้งเป้าหมาย การมอบหมายงาน และการสื่อสารเชิงบวก",
    active: true,
  },
  {
    id: "CRS-02",
    code: "CRS-DD-204",
    title: "Data Analytics for HR & Business",
    category: "Digital & Data",
    courseType: "Workshop",
    durationHours: 6,
    costPerSession: 45000,
    targetAudience: "HR, Analyst และผู้จัดการแผนก",
    summary: "ฝึกวิเคราะห์ข้อมูลด้วย Dashboard และนำเสนอ Insights เพื่อการตัดสินใจ",
    active: true,
  },
  {
    id: "CRS-03",
    code: "CRS-FN-302",
    title: "Cloud Security & Zero Trust Architecture",
    category: "Functional",
    courseType: "Public",
    durationHours: 16,
    costPerSession: 145000,
    targetAudience: "วิศวกรซอฟต์แวร์ / DevOps",
    summary: "ออกแบบสถาปัตยกรรมความปลอดภัยบน Cloud ตามมาตรฐานองค์กรสมัยใหม่",
    active: true,
  },
  {
    id: "CRS-04",
    code: "CRS-SS-108",
    title: "Effective Communication & Feedback",
    category: "Soft Skill",
    courseType: "In-House",
    durationHours: 6,
    costPerSession: 38000,
    targetAudience: "พนักงานทุกระดับ",
    summary: "เทคนิคการฟังเชิงรุก การให้ Feedback อย่างสร้างสรรค์ และการลดความขัดแย้ง",
    active: true,
  },
  {
    id: "CRS-05",
    code: "CRS-CP-001",
    title: "PDPA & Information Security Compliance",
    category: "Compliance",
    courseType: "LMS",
    durationHours: 3,
    costPerSession: 15000,
    targetAudience: "พนักงานทุกคน (บังคับประจำปี)",
    summary: "หลักสูตรออนไลน์มาตรฐานด้านกฎหมายคุ้มครองข้อมูลส่วนบุคคลและความปลอดภัยไซเบอร์",
    active: true,
  },
  {
    id: "CRS-06",
    code: "CRS-FN-215",
    title: "Consultative B2B Selling Mastery",
    category: "Functional",
    courseType: "Workshop",
    durationHours: 12,
    costPerSession: 72000,
    targetAudience: "ทีมขายและดูแลลูกค้ารายใหญ่",
    summary: "กลยุทธ์การวิเคราะห์ความต้องการลูกค้าองค์กรและการปิดการขายอย่างยั่งยืน",
    active: false,
  },
];

export const INITIAL_ANNUAL_PLAN: AnnualPlanItem[] = [
  {
    id: "AP-01",
    code: "PLN-2569-01",
    courseTitle: "PDPA & Information Security Compliance",
    category: "Compliance",
    quarter: "Q1",
    department: "ทุกแผนก (องค์กร)",
    sessions: 1,
    targetParticipants: 482,
    budgetAllocated: 45000,
    status: "completed",
  },
  {
    id: "AP-02",
    code: "PLN-2569-02",
    courseTitle: "Leadership for New Managers",
    category: "Leadership",
    quarter: "Q2",
    department: "ทุกแผนก (องค์กร)",
    sessions: 2,
    targetParticipants: 50,
    budgetAllocated: 136000,
    status: "completed",
  },
  {
    id: "AP-03",
    code: "PLN-2569-03",
    courseTitle: "Data Analytics for HR & Business",
    category: "Digital & Data",
    quarter: "Q3",
    department: "ฝ่ายทรัพยากรบุคคล",
    sessions: 2,
    targetParticipants: 60,
    budgetAllocated: 90000,
    status: "in-progress",
  },
  {
    id: "AP-04",
    code: "PLN-2569-04",
    courseTitle: "Cloud Security & Zero Trust Architecture",
    category: "Functional",
    quarter: "Q4",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    sessions: 2,
    targetParticipants: 40,
    budgetAllocated: 165000,
    status: "in-progress",
  },
  {
    id: "AP-05",
    code: "PLN-2569-05",
    courseTitle: "Consultative B2B Selling Mastery",
    category: "Functional",
    quarter: "Q4",
    department: "ฝ่ายขายและการตลาด",
    sessions: 1,
    targetParticipants: 30,
    budgetAllocated: 72000,
    status: "planned",
  },
  {
    id: "AP-06",
    code: "PLN-2569-06",
    courseTitle: "Effective Communication & Feedback",
    category: "Soft Skill",
    quarter: "Q4",
    department: "ฝ่ายปฏิบัติการและบริการ",
    sessions: 3,
    targetParticipants: 90,
    budgetAllocated: 114000,
    status: "postponed",
  },
];
