import type { SelectOption } from "@/components/ui";

export interface TrainingBudgetItem {
  id: string;
  code: string;
  department: string;
  costCenter: string;
  allocated: number;
  spent: number;
  committed: number;
  coursesCount: number;
}

export type TrainerType = "Internal" | "External" | "Institute";

export interface TrainerProviderItem {
  id: string;
  code: string;
  name: string;
  organization: string;
  type: TrainerType;
  specialty: string;
  ratePerDay: number;
  rating: number;
  sessionsTaught: number;
  contact: string;
  active: boolean;
}

export const TRAINER_TYPE_OPTIONS: SelectOption[] = [
  { value: "all", label: "ทุกประเภท" },
  { value: "Internal", label: "วิทยากรภายใน (Internal)" },
  { value: "External", label: "วิทยากรภายนอก (External)" },
  { value: "Institute", label: "สถาบันฝึกอบรม (Institute)" },
];

export const INITIAL_BUDGET_ALLOCATIONS: TrainingBudgetItem[] = [
  {
    id: "BG-01",
    code: "BG-2569-ENG",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    costCenter: "CC-1010",
    allocated: 1200000,
    spent: 780000,
    committed: 200000,
    coursesCount: 14,
  },
  {
    id: "BG-02",
    code: "BG-2569-OPS",
    department: "ฝ่ายปฏิบัติการและบริการ",
    costCenter: "CC-1020",
    allocated: 950000,
    spent: 540000,
    committed: 140000,
    coursesCount: 11,
  },
  {
    id: "BG-03",
    code: "BG-2569-SLS",
    department: "ฝ่ายขายและการตลาด",
    costCenter: "CC-1030",
    allocated: 720000,
    spent: 460000,
    committed: 180000,
    coursesCount: 9,
  },
  {
    id: "BG-04",
    code: "BG-2569-HRD",
    department: "ฝ่ายทรัพยากรบุคคลและธุรการ",
    costCenter: "CC-1040",
    allocated: 330000,
    spent: 210000,
    committed: 40000,
    coursesCount: 6,
  },
  {
    id: "BG-05",
    code: "BG-2569-CORP",
    department: "งบกลางองค์กร (Compliance & Leadership)",
    costCenter: "CC-1000",
    allocated: 600000,
    spent: 420000,
    committed: 150000,
    coursesCount: 8,
  },
];

export const INITIAL_TRAINERS: TrainerProviderItem[] = [
  {
    id: "TR-01",
    code: "TRN-EXT-01",
    name: "ดร.ภาณุพงศ์ รัตนชัย",
    organization: "Data & AI Academy Thailand",
    type: "External",
    specialty: "Data Analytics, Power BI & AI Literacy",
    ratePerDay: 35000,
    rating: 4.9,
    sessionsTaught: 12,
    contact: "panupong@dataacademy.th",
    active: true,
  },
  {
    id: "TR-02",
    code: "TRN-EXT-02",
    name: "อ.นภาพร วัฒนสินธ์",
    organization: "People First Consulting",
    type: "External",
    specialty: "Leadership, Coaching & People Management",
    ratePerDay: 32000,
    rating: 4.8,
    sessionsTaught: 18,
    contact: "napaporn@peoplefirst.co.th",
    active: true,
  },
  {
    id: "TR-03",
    code: "TRN-INT-01",
    name: "คุณวรเมธ ศรีสวัสดิ์",
    organization: "ฝ่ายวิศวกรรมซอฟต์แวร์ (พนักงานภายใน)",
    type: "Internal",
    specialty: "Cloud Security, AWS & Zero Trust",
    ratePerDay: 0,
    rating: 4.9,
    sessionsTaught: 9,
    contact: "worameth.s@company.co.th",
    active: true,
  },
  {
    id: "TR-04",
    code: "TRN-INS-01",
    name: "สถาบันพัฒนาผู้นำและองค์กร (TLD)",
    organization: "Thailand Leadership Development Institute",
    type: "Institute",
    specialty: "Executive Program & Succession Coaching",
    ratePerDay: 55000,
    rating: 4.7,
    sessionsTaught: 6,
    contact: "corporate@tld-institute.org",
    active: true,
  },
  {
    id: "TR-05",
    code: "TRN-EXT-03",
    name: "อ.ปิยะวัฒน์ เกียรติสกุล",
    organization: "B2B Growth Partners",
    type: "External",
    specialty: "Consultative Selling & Key Account",
    ratePerDay: 28000,
    rating: 4.6,
    sessionsTaught: 7,
    contact: "piyawat@b2bgrowth.co.th",
    active: true,
  },
  {
    id: "TR-06",
    code: "TRN-INT-02",
    name: "คุณปาริชาติ ทองดี",
    organization: "ฝ่ายทรัพยากรบุคคล (พนักงานภายใน)",
    type: "Internal",
    specialty: "PDPA Compliance & HR Onboarding",
    ratePerDay: 0,
    rating: 4.8,
    sessionsTaught: 15,
    contact: "parichat.t@company.co.th",
    active: false,
  },
];
