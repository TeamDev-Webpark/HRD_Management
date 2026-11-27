export type CareerTrackType = "Management" | "Specialist" | "Dual";
export type CareerReadinessStatus = "ready-now" | "developing" | "exploring";

export interface JobFamilyItem {
  id: string;
  code: string;
  name: string;
  nameEn: string;
  departmentScope: string;
  positionsCount: number;
  employeesCount: number;
  description: string;
  active: boolean;
}

export interface CareerPathItem {
  id: string;
  code: string;
  jobFamilyName: string;
  trackName: string;
  trackType: CareerTrackType;
  steps: string[];
  minYearsToTop: number;
  active: boolean;
}

export interface CareerRequirementItem {
  id: string;
  code: string;
  fromPosition: string;
  toPosition: string;
  jobFamilyName: string;
  minTenureYears: number;
  minPerfGrade: string;
  requiredSkills: string;
  requiredCert: string;
}

export interface EmployeeCareerPlanItem {
  id: string;
  code: string;
  employeeCode: string;
  employeeName: string;
  department: string;
  currentPosition: string;
  targetPosition: string;
  trackType: CareerTrackType;
  timeframe: string;
  readiness: number;
  mentorName: string;
  status: CareerReadinessStatus;
}

export const INITIAL_JOB_FAMILIES: JobFamilyItem[] = [
  {
    id: "JF-01",
    code: "JF-TECH",
    name: "เทคโนโลยีและวิศวกรรมซอฟต์แวร์",
    nameEn: "Technology & Software Engineering",
    departmentScope: "ฝ่ายวิศวกรรมซอฟต์แวร์, ฝ่ายโครงสร้างพื้นฐานไอที",
    positionsCount: 12,
    employeesCount: 118,
    description: "ครอบคลุมสายงานพัฒนาซอฟต์แวร์ สถาปัตยกรรมระบบ Cloud และความปลอดภัยไซเบอร์",
    active: true,
  },
  {
    id: "JF-02",
    code: "JF-HR",
    name: "บริหารและพัฒนาทรัพยากรบุคคล",
    nameEn: "People & Organization (HR)",
    departmentScope: "ฝ่ายทรัพยากรบุคคล, ฝ่ายพัฒนาทรัพยากรบุคคล",
    positionsCount: 7,
    employeesCount: 34,
    description: "สายงาน HRM, HRBP, การพัฒนาบุคลากร (HRD) และ People Analytics",
    active: true,
  },
  {
    id: "JF-03",
    code: "JF-COM",
    name: "การขายและการตลาดเชิงพาณิชย์",
    nameEn: "Commercial & Key Accounts",
    departmentScope: "ฝ่ายขายและการตลาด",
    positionsCount: 9,
    employeesCount: 96,
    description: "สายงานบริหารลูกค้ารายใหญ่ พัฒนาธุรกิจ และการตลาดดิจิทัล",
    active: true,
  },
  {
    id: "JF-04",
    code: "JF-OPS",
    name: "ปฏิบัติการและส่งมอบบริการ",
    nameEn: "Operations & Service Delivery",
    departmentScope: "ฝ่ายปฏิบัติการและบริการ",
    positionsCount: 10,
    employeesCount: 142,
    description: "สายงานบริหารการส่งมอบบริการ ศูนย์ปฏิบัติการ และควบคุมมาตรฐาน SLA",
    active: true,
  },
  {
    id: "JF-05",
    code: "JF-DATA",
    name: "ข้อมูลและปัญญาประดิษฐ์",
    nameEn: "Data & AI Analytics",
    departmentScope: "ฝ่ายวิศวกรรมข้อมูลและกลยุทธ์",
    positionsCount: 6,
    employeesCount: 28,
    description: "สายงานวิเคราะห์ข้อมูลธุรกิจ Data Engineering และประยุกต์ใช้ AI",
    active: true,
  },
];

export const INITIAL_CAREER_PATHS: CareerPathItem[] = [
  {
    id: "CP-01",
    code: "CP-TECH-M",
    jobFamilyName: "เทคโนโลยีและวิศวกรรมซอฟต์แวร์",
    trackName: "Engineering Management Track",
    trackType: "Management",
    steps: [
      "Software Engineer (JG-05)",
      "Senior Software Engineer (JG-06)",
      "Engineering Team Lead (JG-07)",
      "Engineering Manager (JG-08)",
      "VP of Engineering (JG-10)",
    ],
    minYearsToTop: 8,
    active: true,
  },
  {
    id: "CP-02",
    code: "CP-TECH-S",
    jobFamilyName: "เทคโนโลยีและวิศวกรรมซอฟต์แวร์",
    trackName: "Principal & Architecture Specialist Track",
    trackType: "Specialist",
    steps: [
      "Software Engineer (JG-05)",
      "Senior Software Engineer (JG-06)",
      "Staff Engineer (JG-07)",
      "Principal Architect (JG-08)",
    ],
    minYearsToTop: 7,
    active: true,
  },
  {
    id: "CP-03",
    code: "CP-HR-D",
    jobFamilyName: "บริหารและพัฒนาทรัพยากรบุคคล",
    trackName: "HR Business Partner & HRD Leadership",
    trackType: "Dual",
    steps: [
      "HR Officer (JG-04)",
      "Senior HR Specialist (JG-05)",
      "HR Business Partner (JG-06)",
      "HRD Manager (JG-08)",
      "People Director (JG-09)",
    ],
    minYearsToTop: 7,
    active: true,
  },
  {
    id: "CP-04",
    code: "CP-COM-M",
    jobFamilyName: "การขายและการตลาดเชิงพาณิชย์",
    trackName: "Enterprise Sales Leadership",
    trackType: "Management",
    steps: [
      "Account Executive (JG-05)",
      "Key Account Manager (JG-06)",
      "Sales Team Lead (JG-07)",
      "Head of Enterprise Sales (JG-09)",
    ],
    minYearsToTop: 6,
    active: true,
  },
];

export const INITIAL_CAREER_REQUIREMENTS: CareerRequirementItem[] = [
  {
    id: "CR-01",
    code: "REQ-01",
    fromPosition: "Senior Software Engineer (JG-06)",
    toPosition: "Engineering Team Lead (JG-07)",
    jobFamilyName: "เทคโนโลยีและวิศวกรรมซอฟต์แวร์",
    minTenureYears: 2,
    minPerfGrade: "เกรด B+ ขึ้นไป (2 รอบติด)",
    requiredSkills: "System Architecture Lv.4, People Leadership Lv.3",
    requiredCert: "AWS Solutions Architect หรือเทียบเท่า",
  },
  {
    id: "CR-02",
    code: "REQ-02",
    fromPosition: "HR Business Partner (JG-06)",
    toPosition: "HRD Manager (JG-08)",
    jobFamilyName: "บริหารและพัฒนาทรัพยากรบุคคล",
    minTenureYears: 3,
    minPerfGrade: "เกรด A / B+ ต่อเนื่อง",
    requiredSkills: "Data & AI Literacy Lv.4, Strategic Decision Lv.4",
    requiredCert: "SHRM-CP หรือ HR Analytics Certificate",
  },
  {
    id: "CR-03",
    code: "REQ-03",
    fromPosition: "Key Account Manager (JG-06)",
    toPosition: "Sales Team Lead (JG-07)",
    jobFamilyName: "การขายและการตลาดเชิงพาณิชย์",
    minTenureYears: 2,
    minPerfGrade: "บรรลุเป้ายอดขาย ≥ 105%",
    requiredSkills: "Customer Focus Lv.4, People Leadership Lv.3",
    requiredCert: "ผ่านหลักสูตร Leadership for New Managers",
  },
  {
    id: "CR-04",
    code: "REQ-04",
    fromPosition: "Operations Supervisor (JG-05)",
    toPosition: "Operations Manager (JG-07)",
    jobFamilyName: "ปฏิบัติการและส่งมอบบริการ",
    minTenureYears: 2,
    minPerfGrade: "เกรด B+ ขึ้นไป",
    requiredSkills: "Agile Delivery Lv.3, Coaching Lv.3",
    requiredCert: "PMP หรือ Lean Six Sigma Green Belt",
  },
];

export const INITIAL_EMPLOYEE_CAREER_PLANS: EmployeeCareerPlanItem[] = [
  {
    id: "ECP-01",
    code: "CPL-69-01",
    employeeCode: "EMP-1024",
    employeeName: "ณัฐพล เจริญสุข",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    currentPosition: "Senior Software Engineer (JG-06)",
    targetPosition: "Engineering Team Lead (JG-07)",
    trackType: "Management",
    timeframe: "ภายใน 12 เดือน",
    readiness: 82,
    mentorName: "ธนกร ศิริสวัสดิ์",
    status: "developing",
  },
  {
    id: "ECP-02",
    code: "CPL-69-02",
    employeeCode: "EMP-1045",
    employeeName: "ปวีณา เลิศศิริ",
    department: "ฝ่ายทรัพยากรบุคคล",
    currentPosition: "HR Business Partner (JG-06)",
    targetPosition: "HRD Manager (JG-08)",
    trackType: "Dual",
    timeframe: "ภายใน 18 เดือน",
    readiness: 90,
    mentorName: "พิมพ์ชนก วัฒนากูล",
    status: "ready-now",
  },
  {
    id: "ECP-03",
    code: "CPL-69-03",
    employeeCode: "EMP-1088",
    employeeName: "ศิริพร รัตนวงศ์",
    department: "ฝ่ายขายและการตลาด",
    currentPosition: "Key Account Manager (JG-06)",
    targetPosition: "Sales Team Lead (JG-07)",
    trackType: "Management",
    timeframe: "ภายใน 6 เดือน",
    readiness: 95,
    mentorName: "วราภรณ์ สุขสวัสดิ์",
    status: "ready-now",
  },
  {
    id: "ECP-04",
    code: "CPL-69-04",
    employeeCode: "EMP-1071",
    employeeName: "อรรถพล แสงทอง",
    department: "ฝ่ายปฏิบัติการและบริการ",
    currentPosition: "Operations Supervisor (JG-05)",
    targetPosition: "Operations Manager (JG-07)",
    trackType: "Management",
    timeframe: "ภายใน 24 เดือน",
    readiness: 55,
    mentorName: "สุรชัย มั่นคง",
    status: "exploring",
  },
  {
    id: "ECP-05",
    code: "CPL-69-05",
    employeeCode: "EMP-1052",
    employeeName: "ภูมิพัฒน์ อินทรักษา",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    currentPosition: "Tech Lead (JG-07)",
    targetPosition: "Principal Architect (JG-08)",
    trackType: "Specialist",
    timeframe: "ภายใน 12 เดือน",
    readiness: 78,
    mentorName: "ธนกร ศิริสวัสดิ์",
    status: "developing",
  },
];
