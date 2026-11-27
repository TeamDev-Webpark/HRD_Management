export type CycleStatus = "active" | "upcoming" | "closed";

export interface EvaluationCycleItem {
  id: string;
  code: string;
  name: string;
  cycleType: "Mid-Year" | "Annual" | "Probation" | "Quarterly";
  periodLabel: string;
  reviewWindow: string;
  eligibleEmployees: number;
  submittedCount: number;
  kpiWeight: number;
  competencyWeight: number;
  status: CycleStatus;
}

export interface EvaluationTemplateItem {
  id: string;
  code: string;
  name: string;
  targetGroup: string;
  scoringScale: string;
  kpiWeight: number;
  competencyWeight: number;
  feedback360Weight: number;
  usedInCycles: number;
  active: boolean;
  description: string;
}

export const INITIAL_EVALUATION_CYCLES: EvaluationCycleItem[] = [
  {
    id: "CYC-01",
    code: "PMS-2569-H2",
    name: "การประเมินผลการปฏิบัติงานประจำปี 2569 (Annual Appraisal)",
    cycleType: "Annual",
    periodLabel: "1 ม.ค. – 31 ธ.ค. 2569",
    reviewWindow: "1 – 20 ธ.ค. 2569",
    eligibleEmployees: 482,
    submittedCount: 396,
    kpiWeight: 60,
    competencyWeight: 40,
    status: "active",
  },
  {
    id: "CYC-02",
    code: "PMS-2569-PRB",
    name: "การประเมินทดลองงาน 119 วัน (รอบไตรมาส 4/2569)",
    cycleType: "Probation",
    periodLabel: "1 ต.ค. – 31 ธ.ค. 2569",
    reviewWindow: "ประเมินตามวันครบรอบ",
    eligibleEmployees: 24,
    submittedCount: 19,
    kpiWeight: 50,
    competencyWeight: 50,
    status: "active",
  },
  {
    id: "CYC-03",
    code: "PMS-2570-H1",
    name: "การประเมินผลงานกลางปี 2570 (Mid-Year Review)",
    cycleType: "Mid-Year",
    periodLabel: "1 ม.ค. – 30 มิ.ย. 2570",
    reviewWindow: "1 – 15 มิ.ย. 2570",
    eligibleEmployees: 495,
    submittedCount: 0,
    kpiWeight: 60,
    competencyWeight: 40,
    status: "upcoming",
  },
  {
    id: "CYC-04",
    code: "PMS-2569-H1",
    name: "การประเมินผลงานกลางปี 2569 (Mid-Year Review)",
    cycleType: "Mid-Year",
    periodLabel: "1 ม.ค. – 30 มิ.ย. 2569",
    reviewWindow: "1 – 18 มิ.ย. 2569",
    eligibleEmployees: 468,
    submittedCount: 468,
    kpiWeight: 60,
    competencyWeight: 40,
    status: "closed",
  },
  {
    id: "CYC-05",
    code: "PMS-2568-ANN",
    name: "การประเมินผลการปฏิบัติงานประจำปี 2568 (Annual Appraisal)",
    cycleType: "Annual",
    periodLabel: "1 ม.ค. – 31 ธ.ค. 2568",
    reviewWindow: "1 – 20 ธ.ค. 2568",
    eligibleEmployees: 452,
    submittedCount: 452,
    kpiWeight: 60,
    competencyWeight: 40,
    status: "closed",
  },
];

export const INITIAL_EVALUATION_TEMPLATES: EvaluationTemplateItem[] = [
  {
    id: "TPL-01",
    code: "TPL-MGR-01",
    name: "แบบประเมินระดับหัวหน้างานและผู้บริหาร (Manager & Above)",
    targetGroup: "JG-07 ขึ้นไป (Manager / Director)",
    scoringScale: "สเกล 1.00 – 5.00 (เกรด A – PIP)",
    kpiWeight: 50,
    competencyWeight: 35,
    feedback360Weight: 15,
    usedInCycles: 4,
    active: true,
    description: "เน้นผลลัพธ์เป้าหมายองค์กร (OKR/KPI) ภาวะผู้นำ และผลประเมิน 360° จากทีมงาน",
  },
  {
    id: "TPL-02",
    code: "TPL-STF-01",
    name: "แบบประเมินพนักงานปฏิบัติการและวิชาชีพ (Staff / Senior)",
    targetGroup: "JG-03 – JG-06 (Officer – Senior)",
    scoringScale: "สเกล 1.00 – 5.00 (เกรด A – PIP)",
    kpiWeight: 60,
    competencyWeight: 40,
    feedback360Weight: 0,
    usedInCycles: 5,
    active: true,
    description: "ประเมินผลงานตาม KPI รายบุคคลควบคู่กับสมรรถนะหลัก (Core & Functional Competency)",
  },
  {
    id: "TPL-03",
    code: "TPL-SLS-01",
    name: "แบบประเมินฝ่ายขายและพัฒนาธุรกิจ (Sales Target Focus)",
    targetGroup: "ฝ่ายขายและการตลาด (Account / Sales)",
    scoringScale: "สเกล 1.00 – 5.00 (เกรด A – PIP)",
    kpiWeight: 75,
    competencyWeight: 25,
    feedback360Weight: 0,
    usedInCycles: 3,
    active: true,
    description: "ให้น้ำหนักยอดขายและอัตราการรักษาลูกค้าสูงเป็นพิเศษ (75%) พร้อมสมรรถนะการบริการ",
  },
  {
    id: "TPL-04",
    code: "TPL-PRB-01",
    name: "แบบประเมินพนักงานทดลองงาน 119 วัน (Probation)",
    targetGroup: "พนักงานใหม่ทุกระดับ (HRM Probation)",
    scoringScale: "ผ่าน / ขยายเวลา / ไม่ผ่าน (เกณฑ์ ≥ 3.00)",
    kpiWeight: 50,
    competencyWeight: 50,
    feedback360Weight: 0,
    usedInCycles: 4,
    active: true,
    description: "ประเมินการปรับตัว วัฒนธรรมองค์กร และผลงานเบื้องต้นช่วงทดลองงาน 60 และ 119 วัน",
  },
  {
    id: "TPL-05",
    code: "TPL-PIP-01",
    name: "แบบติดตามแผนปรับปรุงผลการปฏิบัติงาน (PIP 90 วัน)",
    targetGroup: "พนักงานในแผน PIP",
    scoringScale: "ผ่านเกณฑ์ / ไม่ผ่านเกณฑ์",
    kpiWeight: 70,
    competencyWeight: 30,
    feedback360Weight: 0,
    usedInCycles: 1,
    active: false,
    description: "แบบฟอร์มเฉพาะสำหรับติดตามเป้าหมายรายสัปดาห์และรายเดือนในช่วงแผนปรับปรุงผลงาน",
  },
];
