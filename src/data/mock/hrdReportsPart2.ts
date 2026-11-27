export interface SkillGapReportRow {
  id: string;
  deptCode: string;
  department: string;
  assessedEmployees: number;
  totalGaps: number;
  criticalGaps: number;
  closedGaps: number;
  topGapSkill: string;
}

export interface IdpReportRow {
  id: string;
  deptCode: string;
  department: string;
  totalPlans: number;
  inProgressPlans: number;
  completedPlans: number;
  avgProgress: number;
  achievedRate: number;
}

export interface TalentSuccessionReportRow {
  id: string;
  deptCode: string;
  department: string;
  talentCount: number;
  hipoCount: number;
  keyPositions: number;
  coveredPositions: number;
  readyNowSuccessors: number;
  highFlightRisk: number;
}

export interface CertificateReportRow {
  id: string;
  certCode: string;
  categoryName: string;
  source: "LMS ภายในองค์กร" | "ใบรับรองวิชาชีพภายนอก";
  issuedCount: number;
  validCount: number;
  expiringCount: number;
  expiredCount: number;
}

export const SKILL_GAP_REPORT_ROWS: SkillGapReportRow[] = [
  {
    id: "SGR-01",
    deptCode: "DEPT-ENG",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    assessedEmployees: 118,
    totalGaps: 34,
    criticalGaps: 8,
    closedGaps: 21,
    topGapSkill: "People Leadership & Coaching",
  },
  {
    id: "SGR-02",
    deptCode: "DEPT-HR",
    department: "ฝ่ายทรัพยากรบุคคลและพัฒนาองค์กร",
    assessedEmployees: 34,
    totalGaps: 12,
    criticalGaps: 3,
    closedGaps: 9,
    topGapSkill: "Data Analytics & AI Literacy",
  },
  {
    id: "SGR-03",
    deptCode: "DEPT-COM",
    department: "ฝ่ายขายและการตลาด",
    assessedEmployees: 96,
    totalGaps: 28,
    criticalGaps: 6,
    closedGaps: 17,
    topGapSkill: "Agile & Project Delivery",
  },
  {
    id: "SGR-04",
    deptCode: "DEPT-OPS",
    department: "ฝ่ายปฏิบัติการและบริการ",
    assessedEmployees: 142,
    totalGaps: 46,
    criticalGaps: 14,
    closedGaps: 22,
    topGapSkill: "People Leadership & Coaching",
  },
  {
    id: "SGR-05",
    deptCode: "DEPT-DATA",
    department: "ฝ่ายวิศวกรรมข้อมูลและกลยุทธ์",
    assessedEmployees: 28,
    totalGaps: 9,
    criticalGaps: 2,
    closedGaps: 7,
    topGapSkill: "Customer & Business Consulting",
  },
];

export const IDP_REPORT_ROWS: IdpReportRow[] = [
  {
    id: "IDPR-01",
    deptCode: "DEPT-ENG",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    totalPlans: 94,
    inProgressPlans: 42,
    completedPlans: 48,
    avgProgress: 81,
    achievedRate: 88,
  },
  {
    id: "IDPR-02",
    deptCode: "DEPT-HR",
    department: "ฝ่ายทรัพยากรบุคคลและพัฒนาองค์กร",
    totalPlans: 32,
    inProgressPlans: 8,
    completedPlans: 24,
    avgProgress: 92,
    achievedRate: 94,
  },
  {
    id: "IDPR-03",
    deptCode: "DEPT-COM",
    department: "ฝ่ายขายและการตลาด",
    totalPlans: 72,
    inProgressPlans: 34,
    completedPlans: 33,
    avgProgress: 74,
    achievedRate: 80,
  },
  {
    id: "IDPR-04",
    deptCode: "DEPT-OPS",
    department: "ฝ่ายปฏิบัติการและบริการ",
    totalPlans: 98,
    inProgressPlans: 54,
    completedPlans: 36,
    avgProgress: 68,
    achievedRate: 75,
  },
  {
    id: "IDPR-05",
    deptCode: "DEPT-DATA",
    department: "ฝ่ายวิศวกรรมข้อมูลและกลยุทธ์",
    totalPlans: 26,
    inProgressPlans: 9,
    completedPlans: 17,
    avgProgress: 86,
    achievedRate: 91,
  },
];

export const TALENT_SUCCESSION_REPORT_ROWS: TalentSuccessionReportRow[] = [
  {
    id: "TSR-01",
    deptCode: "DEPT-ENG",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    talentCount: 18,
    hipoCount: 7,
    keyPositions: 5,
    coveredPositions: 4,
    readyNowSuccessors: 3,
    highFlightRisk: 2,
  },
  {
    id: "TSR-02",
    deptCode: "DEPT-HR",
    department: "ฝ่ายทรัพยากรบุคคลและพัฒนาองค์กร",
    talentCount: 6,
    hipoCount: 3,
    keyPositions: 2,
    coveredPositions: 2,
    readyNowSuccessors: 2,
    highFlightRisk: 0,
  },
  {
    id: "TSR-03",
    deptCode: "DEPT-COM",
    department: "ฝ่ายขายและการตลาด",
    talentCount: 14,
    hipoCount: 5,
    keyPositions: 4,
    coveredPositions: 3,
    readyNowSuccessors: 2,
    highFlightRisk: 3,
  },
  {
    id: "TSR-04",
    deptCode: "DEPT-OPS",
    department: "ฝ่ายปฏิบัติการและบริการ",
    talentCount: 12,
    hipoCount: 3,
    keyPositions: 4,
    coveredPositions: 2,
    readyNowSuccessors: 1,
    highFlightRisk: 1,
  },
  {
    id: "TSR-05",
    deptCode: "DEPT-DATA",
    department: "ฝ่ายวิศวกรรมข้อมูลและกลยุทธ์",
    talentCount: 7,
    hipoCount: 4,
    keyPositions: 2,
    coveredPositions: 2,
    readyNowSuccessors: 1,
    highFlightRisk: 1,
  },
];

export const CERTIFICATE_REPORT_ROWS: CertificateReportRow[] = [
  {
    id: "CR-01",
    certCode: "CERT-LMS-LD",
    categoryName: "ใบประกาศนียบัตรหลักสูตรผู้นำและการโค้ชชิ่ง",
    source: "LMS ภายในองค์กร",
    issuedCount: 128,
    validCount: 128,
    expiringCount: 0,
    expiredCount: 0,
  },
  {
    id: "CR-02",
    certCode: "CERT-LMS-AI",
    categoryName: "ใบประกาศนียบัตร Data Analytics & GenAI Literacy",
    source: "LMS ภายในองค์กร",
    issuedCount: 214,
    validCount: 214,
    expiringCount: 0,
    expiredCount: 0,
  },
  {
    id: "CR-03",
    certCode: "CERT-PRO-CLD",
    categoryName: "ใบรับรองวิชาชีพ Cloud & Cyber Security (AWS / ISO 27001)",
    source: "ใบรับรองวิชาชีพภายนอก",
    issuedCount: 42,
    validCount: 35,
    expiringCount: 5,
    expiredCount: 2,
  },
  {
    id: "CR-04",
    certCode: "CERT-PRO-PM",
    categoryName: "ใบรับรองวิชาชีพการบริหารโครงการ (PMP / Agile)",
    source: "ใบรับรองวิชาชีพภายนอก",
    issuedCount: 31,
    validCount: 24,
    expiringCount: 4,
    expiredCount: 3,
  },
  {
    id: "CR-05",
    certCode: "CERT-PRO-HR",
    categoryName: "ใบรับรองวิชาชีพทรัพยากรบุคคล (SHRM-CP / HRBP)",
    source: "ใบรับรองวิชาชีพภายนอก",
    issuedCount: 18,
    validCount: 15,
    expiringCount: 2,
    expiredCount: 1,
  },
];
