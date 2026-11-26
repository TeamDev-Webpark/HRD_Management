export interface MonthlyBarPoint {
  label: string;
  classroomHours: number;
  lmsHours: number;
}

export const MONTHLY_TRAINING_BARS: MonthlyBarPoint[] = [
  { label: "ม.ค.", classroomHours: 1420, lmsHours: 880 },
  { label: "ก.พ.", classroomHours: 1180, lmsHours: 760 },
  { label: "มี.ค.", classroomHours: 1560, lmsHours: 1020 },
  { label: "เม.ย.", classroomHours: 1380, lmsHours: 940 },
  { label: "พ.ค.", classroomHours: 1620, lmsHours: 1120 },
  { label: "มิ.ย.", classroomHours: 1210, lmsHours: 850 },
  { label: "ก.ค.", classroomHours: 980, lmsHours: 740 },
  { label: "ส.ค.", classroomHours: 1510, lmsHours: 1050 },
];

export const QUARTERLY_TRAINING_BARS: MonthlyBarPoint[] = [
  { label: "ไตรมาส 1", classroomHours: 2850, lmsHours: 1920 },
  { label: "ไตรมาส 2", classroomHours: 2680, lmsHours: 1840 },
  { label: "ไตรมาส 3", classroomHours: 2350, lmsHours: 1690 },
  { label: "ไตรมาส 4", classroomHours: 2940, lmsHours: 2180 },
];

export interface PerformanceDonutSlice {
  grade: string;
  label: string;
  count: number;
  percent: number;
  color: string;
}

// Soft Editorial 4-Color Harmony (equal visual weight & calm luminance)
export const PERFORMANCE_DONUT_SLICES: PerformanceDonutSlice[] = [
  { grade: "A", label: "ดีเยี่ยม (Exceeds)", count: 68, percent: 16, color: "#22B89A" },
  { grade: "B+", label: "ดีมาก (Above Target)", count: 145, percent: 34, color: "#3B82F6" },
  { grade: "B", label: "ตามเป้า (Meets Target)", count: 166, percent: 39, color: "#A78BFA" },
  { grade: "C", label: "ต้องพัฒนาเพิ่มเติม", count: 38, percent: 9, color: "#F5B73B" },
  { grade: "PIP", label: "แผนปรับปรุง (PIP)", count: 9, percent: 2, color: "#F87171" },
];

export interface TalentSpotlightItem {
  id: string;
  initials: string;
  name: string;
  role: string;
  code: string;
  isReadyNow: boolean;
  avatarBg: string;
  avatarText: string;
  departmentKey: string;
}

export const TALENT_SPOTLIGHT_LIST: TalentSpotlightItem[] = [
  {
    id: "TL-01",
    initials: "ณจ",
    name: "ณัฐพล เจริญสุข",
    role: "Senior Frontend Dev",
    code: "Ready Now",
    isReadyNow: true,
    avatarBg: "bg-[#EFF6FF]",
    avatarText: "text-[#2563EB]",
    departmentKey: "eng",
  },
  {
    id: "TL-02",
    initials: "สก",
    name: "สุภาพร กิตติคุณ",
    role: "Key Account Manager",
    code: "Ready Now",
    isReadyNow: true,
    avatarBg: "bg-[#ECFAF5]",
    avatarText: "text-[#1CA388]",
    departmentKey: "sales",
  },
  {
    id: "TL-03",
    initials: "กว",
    name: "กฤติน วงศ์สุวรรณ",
    role: "Operations Supervisor",
    code: "1–2 Years",
    isReadyNow: false,
    avatarBg: "bg-[#F3F0FF]",
    avatarText: "text-[#7C6CF6]",
    departmentKey: "ops",
  },
  {
    id: "TL-04",
    initials: "วศ",
    name: "วรเมธ ศรีสวัสดิ์",
    role: "Cloud Solutions Lead",
    code: "Ready Now",
    isReadyNow: true,
    avatarBg: "bg-[#FEF9EC]",
    avatarText: "text-[#D99B16]",
    departmentKey: "eng",
  },
  {
    id: "TL-05",
    initials: "ปท",
    name: "ปาริชาติ ทองดี",
    role: "HRBP Specialist",
    code: "1–2 Years",
    isReadyNow: false,
    avatarBg: "bg-[#EFF6FF]",
    avatarText: "text-[#2563EB]",
    departmentKey: "hr",
  },
];
