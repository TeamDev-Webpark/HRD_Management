import type { BadgeVariant } from "@/components/ui";

export interface PerformanceBand {
  grade: string;
  label: string;
  count: number;
  percent: number;
  barColor: string;
}

export interface SkillGapItem {
  id: string;
  skillName: string;
  category: string;
  currentLevel: number;
  targetLevel: number;
  affectedEmployees: number;
  priority: "high" | "medium" | "low";
  departmentKey: string;
}

export interface IdpTrackItem {
  label: string;
  ratio: string;
  completed: number;
  total: number;
  percent: number;
}

export interface TalentSegment {
  id: string;
  label: string;
  labelEn: string;
  count: number;
  sharePercent: number;
  variant: BadgeVariant;
}

export interface PendingApprovalItem {
  id: string;
  type: "Training" | "IDP" | "Performance";
  typeLabel: string;
  title: string;
  requester: string;
  department: string;
  departmentKey: string;
  submittedAt: string;
  status: "pending" | "approved" | "returned";
}

export interface UpcomingTrainingItem {
  id: string;
  code: string;
  title: string;
  category: string;
  dateLabel: string;
  timeLabel: string;
  mode: "Onsite" | "Online" | "Hybrid";
  location: string;
  trainer: string;
  enrolled: number;
  capacity: number;
  departmentKey: string;
}

export const PERFORMANCE_OVERVIEW_DATA = {
  cycleName: "Mid-Year Performance Review 2026",
  submittedPercent: 88.4,
  averageScore: 3.84,
  maxScore: 5.0,
  evaluatedCount: 426,
  totalEligible: 482,
  bands: [
    { grade: "A", label: "ดีเยี่ยม (Exceeds Expectations)", count: 68, percent: 16, barColor: "#2563EB" },
    { grade: "B+", label: "ดีมาก (Above Target)", count: 145, percent: 34, barColor: "#3B82F6" },
    { grade: "B", label: "ตามเป้าหมาย (Meets Target)", count: 166, percent: 39, barColor: "#60A5FA" },
    { grade: "C", label: "ต้องพัฒนาเพิ่มเติม (Needs Improvement)", count: 38, percent: 9, barColor: "#F59E0B" },
    { grade: "PIP", label: "แผนปรับปรุงผลงาน (PIP)", count: 9, percent: 2, barColor: "#DC2626" },
  ] as PerformanceBand[],
};

export const SKILL_GAP_ITEMS: SkillGapItem[] = [
  {
    id: "SG-01",
    skillName: "Data Literacy & Analytics",
    category: "Digital Skill",
    currentLevel: 2.4,
    targetLevel: 4.0,
    affectedEmployees: 118,
    priority: "high",
    departmentKey: "all",
  },
  {
    id: "SG-02",
    skillName: "People Coaching & Feedback",
    category: "Leadership",
    currentLevel: 2.8,
    targetLevel: 4.0,
    affectedEmployees: 64,
    priority: "high",
    departmentKey: "ops",
  },
  {
    id: "SG-03",
    skillName: "Cloud Architecture & Security",
    category: "Technical",
    currentLevel: 3.1,
    targetLevel: 4.2,
    affectedEmployees: 42,
    priority: "medium",
    departmentKey: "eng",
  },
  {
    id: "SG-04",
    skillName: "Consultative B2B Negotiation",
    category: "Functional",
    currentLevel: 3.0,
    targetLevel: 3.8,
    affectedEmployees: 37,
    priority: "medium",
    departmentKey: "sales",
  },
  {
    id: "SG-05",
    skillName: "HR People Analytics",
    category: "Functional",
    currentLevel: 3.2,
    targetLevel: 4.0,
    affectedEmployees: 16,
    priority: "low",
    departmentKey: "hr",
  },
];

export const IDP_PROGRESS_DATA = {
  overallPercent: 74.2,
  totalPlans: 452,
  completedPlans: 148,
  inProgressPlans: 246,
  notStartedPlans: 58,
  tracks: [
    {
      label: "On-the-Job & Project Assignment",
      ratio: "70% Experience",
      completed: 184,
      total: 240,
      percent: 76.7,
    },
    {
      label: "Coaching & Mentoring",
      ratio: "20% Social",
      completed: 96,
      total: 128,
      percent: 75.0,
    },
    {
      label: "Formal Training & LMS Courses",
      ratio: "10% Formal",
      completed: 112,
      total: 160,
      percent: 70.0,
    },
  ] as IdpTrackItem[],
};

export const TALENT_POOL_DATA = {
  totalTalents: 62,
  talentRatioPercent: 12.9,
  keyPositionsCovered: 14,
  keyPositionsTotal: 18,
  readyNowSuccessors: 19,
  segments: [
    {
      id: "star",
      label: "Star / High Potential",
      labelEn: "พร้อมเติบโตทันที (Ready Now)",
      count: 19,
      sharePercent: 31,
      variant: "primary",
    },
    {
      id: "high-performer",
      label: "High Performer",
      labelEn: "ผลงานโดดเด่นต่อเนื่อง",
      count: 27,
      sharePercent: 43,
      variant: "success",
    },
    {
      id: "emerging",
      label: "Emerging Talent",
      labelEn: "ศักยภาพสูงกำลังพัฒนา (1–2 ปี)",
      count: 16,
      sharePercent: 26,
      variant: "warning",
    },
  ] as TalentSegment[],
};

export const INITIAL_PENDING_APPROVALS: PendingApprovalItem[] = [
  {
    id: "APR-001",
    type: "Training",
    typeLabel: "ลงทะเบียนอบรม",
    title: "ขออนุมัติเข้าอบรม Leadership for New Managers (3 คน)",
    requester: "ธนกร ศิริสวัสดิ์",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    departmentKey: "eng",
    submittedAt: "วันนี้ 10:15 น.",
    status: "pending",
  },
  {
    id: "APR-002",
    type: "IDP",
    typeLabel: "แผนพัฒนา IDP",
    title: "ขออนุมัติแผนพัฒนารายบุคคล ประจำปี 2569",
    requester: "สุภาพร กิตติคุณ",
    department: "ฝ่ายขายและการตลาด",
    departmentKey: "sales",
    submittedAt: "วันนี้ 09:40 น.",
    status: "pending",
  },
  {
    id: "APR-003",
    type: "Training",
    typeLabel: "งบอบรมภายนอก",
    title: "ขออนุมัติอบรม AWS Solutions Architect (฿18,500)",
    requester: "ณัฐพล เจริญสุข",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    departmentKey: "eng",
    submittedAt: "เมื่อวานนี้",
    status: "pending",
  },
  {
    id: "APR-004",
    type: "Performance",
    typeLabel: "ปรับเป้าหมาย KPI",
    title: "ขอปรับน้ำหนักตัวชี้วัด KPI ไตรมาส 4",
    requester: "กฤติน วงศ์สุวรรณ",
    department: "ฝ่ายปฏิบัติการและบริการ",
    departmentKey: "ops",
    submittedAt: "2 วันที่แล้ว",
    status: "pending",
  },
];

export const UPCOMING_TRAININGS: UpcomingTrainingItem[] = [
  {
    id: "SES-001",
    code: "TRN-2026-014",
    title: "Data Analytics for HR Professionals",
    category: "Digital & Data",
    dateLabel: "2 ธ.ค. 2569",
    timeLabel: "09:00 – 16:00 น.",
    mode: "Hybrid",
    location: "ห้องประชุม Sapphire ชั้น 12 / MS Teams",
    trainer: "ดร.ภาณุพงศ์ รัตนชัย (สถาบันภายนอก)",
    enrolled: 26,
    capacity: 30,
    departmentKey: "hr",
  },
  {
    id: "SES-002",
    code: "TRN-2026-015",
    title: "Leadership for New Managers รุ่นที่ 2",
    category: "Leadership",
    dateLabel: "4–5 ธ.ค. 2569",
    timeLabel: "09:00 – 16:30 น.",
    mode: "Onsite",
    location: "ศูนย์ฝึกอบรม อาคาร B ชั้น 5",
    trainer: "อ.นภาพร วัฒนสินธ์",
    enrolled: 24,
    capacity: 25,
    departmentKey: "all",
  },
  {
    id: "SES-003",
    code: "TRN-2026-018",
    title: "Cloud Security & Zero Trust Architecture",
    category: "Technical",
    dateLabel: "9 ธ.ค. 2569",
    timeLabel: "13:00 – 17:00 น.",
    mode: "Online",
    location: "LMS Live Classroom",
    trainer: "คุณวรเมธ ศรีสวัสดิ์ (Internal Trainer)",
    enrolled: 38,
    capacity: 50,
    departmentKey: "eng",
  },
  {
    id: "SES-004",
    code: "TRN-2026-021",
    title: "Consultative Selling & Key Account Strategy",
    category: "Functional",
    dateLabel: "14 ธ.ค. 2569",
    timeLabel: "09:00 – 16:00 น.",
    mode: "Onsite",
    location: "ห้องอบรม Emerald ชั้น 8",
    trainer: "อ.ปิยะวัฒน์ เกียรติสกุล",
    enrolled: 19,
    capacity: 30,
    departmentKey: "sales",
  },
];
