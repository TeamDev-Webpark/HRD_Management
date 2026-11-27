export interface SkillColumnDef {
  key: string;
  code: string;
  label: string;
  shortLabel: string;
  category: "Technical" | "Leadership" | "Digital";
}

export interface SkillCellValue {
  actual: number;
  target: number;
}

export interface SkillMatrixRow {
  id: string;
  employeeCode: string;
  employeeName: string;
  position: string;
  department: string;
  skills: Record<string, SkillCellValue>;
}

export type GapPriority = "high" | "medium" | "low";
export type GapActionStatus = "open" | "in-idp" | "closed";

export interface SkillGapItem {
  id: string;
  code: string;
  employeeCode: string;
  employeeName: string;
  department: string;
  position: string;
  skillName: string;
  targetLevel: number;
  actualLevel: number;
  priority: GapPriority;
  recommendedCourse: string;
  status: GapActionStatus;
}

export type CertStatus = "valid" | "expiring" | "expired";

export interface SkillCertificationItem {
  id: string;
  code: string;
  employeeCode: string;
  employeeName: string;
  department: string;
  certName: string;
  issuer: string;
  skillTag: string;
  issueDate: string;
  expiryDate: string;
  credentialNo: string;
  status: CertStatus;
}

export const SKILL_COLUMNS: SkillColumnDef[] = [
  { key: "cloud", code: "SK-01", label: "Cloud & Cyber Security", shortLabel: "Cloud & Sec", category: "Technical" },
  { key: "dataAi", code: "SK-02", label: "Data Analytics & AI Literacy", shortLabel: "Data & AI", category: "Digital" },
  { key: "leadership", code: "SK-03", label: "People Leadership & Coaching", shortLabel: "Leadership", category: "Leadership" },
  { key: "agile", code: "SK-04", label: "Agile & Project Delivery", shortLabel: "Agile Delivery", category: "Technical" },
  { key: "consulting", code: "SK-05", label: "Customer & Business Consulting", shortLabel: "Consulting", category: "Leadership" },
];

export const INITIAL_SKILL_MATRIX: SkillMatrixRow[] = [
  {
    id: "SM-01",
    employeeCode: "EMP-1024",
    employeeName: "ณัฐพล เจริญสุข",
    position: "Senior Software Engineer",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    skills: {
      cloud: { actual: 4, target: 4 },
      dataAi: { actual: 3, target: 3 },
      leadership: { actual: 2, target: 3 },
      agile: { actual: 4, target: 4 },
      consulting: { actual: 3, target: 3 },
    },
  },
  {
    id: "SM-02",
    employeeCode: "EMP-1045",
    employeeName: "ปวีณา เลิศศิริ",
    position: "HR Business Partner",
    department: "ฝ่ายพัฒนาทรัพยากรบุคคล (HRD)",
    skills: {
      cloud: { actual: 2, target: 2 },
      dataAi: { actual: 3, target: 4 },
      leadership: { actual: 4, target: 4 },
      agile: { actual: 3, target: 3 },
      consulting: { actual: 4, target: 4 },
    },
  },
  {
    id: "SM-03",
    employeeCode: "EMP-1088",
    employeeName: "ศิริพร รัตนวงศ์",
    position: "Key Account Manager",
    department: "ฝ่ายขายและการตลาด",
    skills: {
      cloud: { actual: 2, target: 2 },
      dataAi: { actual: 3, target: 3 },
      leadership: { actual: 3, target: 3 },
      agile: { actual: 2, target: 3 },
      consulting: { actual: 5, target: 4 },
    },
  },
  {
    id: "SM-04",
    employeeCode: "EMP-1071",
    employeeName: "อรรถพล แสงทอง",
    position: "Operations Supervisor",
    department: "ฝ่ายปฏิบัติการและบริการ",
    skills: {
      cloud: { actual: 2, target: 2 },
      dataAi: { actual: 2, target: 3 },
      leadership: { actual: 2, target: 3 },
      agile: { actual: 3, target: 3 },
      consulting: { actual: 3, target: 3 },
    },
  },
  {
    id: "SM-05",
    employeeCode: "EMP-1052",
    employeeName: "ภูมิพัฒน์ อินทรักษา",
    position: "Tech Lead",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    skills: {
      cloud: { actual: 5, target: 4 },
      dataAi: { actual: 4, target: 4 },
      leadership: { actual: 3, target: 4 },
      agile: { actual: 4, target: 4 },
      consulting: { actual: 3, target: 3 },
    },
  },
  {
    id: "SM-06",
    employeeCode: "EMP-1126",
    employeeName: "ชลธิชา นาควัชระ",
    position: "Senior Product Designer",
    department: "ฝ่ายออกแบบผลิตภัณฑ์และ UX",
    skills: {
      cloud: { actual: 2, target: 2 },
      dataAi: { actual: 4, target: 3 },
      leadership: { actual: 3, target: 3 },
      agile: { actual: 4, target: 4 },
      consulting: { actual: 4, target: 4 },
    },
  },
  {
    id: "SM-07",
    employeeCode: "EMP-1135",
    employeeName: "ปิยะพงษ์ สุวรรณโชติ",
    position: "Senior Financial Analyst",
    department: "ฝ่ายการเงินและบัญชี",
    skills: {
      cloud: { actual: 2, target: 2 },
      dataAi: { actual: 4, target: 4 },
      leadership: { actual: 2, target: 3 },
      agile: { actual: 3, target: 3 },
      consulting: { actual: 4, target: 3 },
    },
  },
  {
    id: "SM-08",
    employeeCode: "EMP-1104",
    employeeName: "กิตติพงศ์ วัฒนชัย",
    position: "Backend Developer",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    skills: {
      cloud: { actual: 3, target: 4 },
      dataAi: { actual: 3, target: 3 },
      leadership: { actual: 2, target: 2 },
      agile: { actual: 3, target: 3 },
      consulting: { actual: 2, target: 2 },
    },
  },
];

export const INITIAL_SKILL_GAPS: SkillGapItem[] = [
  {
    id: "SG-01",
    code: "GAP-69-01",
    employeeCode: "EMP-1071",
    employeeName: "อรรถพล แสงทอง",
    department: "ฝ่ายปฏิบัติการและบริการ",
    position: "Operations Supervisor",
    skillName: "People Leadership & Coaching",
    targetLevel: 3,
    actualLevel: 2,
    priority: "high",
    recommendedCourse: "Leadership for New Managers & Coaching",
    status: "open",
  },
  {
    id: "SG-02",
    code: "GAP-69-02",
    employeeCode: "EMP-1045",
    employeeName: "ปวีณา เลิศศิริ",
    department: "ฝ่ายพัฒนาทรัพยากรบุคคล (HRD)",
    position: "HR Business Partner",
    skillName: "Data Analytics & AI Literacy",
    targetLevel: 4,
    actualLevel: 3,
    priority: "high",
    recommendedCourse: "People Analytics with Power BI & GenAI",
    status: "in-idp",
  },
  {
    id: "SG-03",
    code: "GAP-69-03",
    employeeCode: "EMP-1052",
    employeeName: "ภูมิพัฒน์ อินทรักษา",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    position: "Tech Lead",
    skillName: "People Leadership & Coaching",
    targetLevel: 4,
    actualLevel: 3,
    priority: "medium",
    recommendedCourse: "Strategic Tech Leadership & Mentoring",
    status: "open",
  },
  {
    id: "SG-04",
    code: "GAP-69-04",
    employeeCode: "EMP-1024",
    employeeName: "ณัฐพล เจริญสุข",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    position: "Senior Software Engineer",
    skillName: "People Leadership & Coaching",
    targetLevel: 3,
    actualLevel: 2,
    priority: "medium",
    recommendedCourse: "Influencing & Cross-Team Collaboration",
    status: "in-idp",
  },
  {
    id: "SG-05",
    code: "GAP-69-05",
    employeeCode: "EMP-1104",
    employeeName: "กิตติพงศ์ วัฒนชัย",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    position: "Backend Developer",
    skillName: "Cloud & Cyber Security",
    targetLevel: 4,
    actualLevel: 3,
    priority: "high",
    recommendedCourse: "Cloud Security & Microservices Architecture",
    status: "open",
  },
  {
    id: "SG-06",
    code: "GAP-69-06",
    employeeCode: "EMP-1135",
    employeeName: "ปิยะพงษ์ สุวรรณโชติ",
    department: "ฝ่ายการเงินและบัญชี",
    position: "Senior Financial Analyst",
    skillName: "People Leadership & Coaching",
    targetLevel: 3,
    actualLevel: 2,
    priority: "medium",
    recommendedCourse: "Finance Business Partnering & Leadership",
    status: "in-idp",
  },
  {
    id: "SG-07",
    code: "GAP-69-07",
    employeeCode: "EMP-1088",
    employeeName: "ศิริพร รัตนวงศ์",
    department: "ฝ่ายขายและการตลาด",
    position: "Key Account Manager",
    skillName: "Agile & Project Delivery",
    targetLevel: 3,
    actualLevel: 2,
    priority: "low",
    recommendedCourse: "Agile Fundamentals for Business Teams",
    status: "closed",
  },
];

export const INITIAL_SKILL_CERTIFICATIONS: SkillCertificationItem[] = [
  {
    id: "SC-01",
    code: "CRT-69-01",
    employeeCode: "EMP-1024",
    employeeName: "ณัฐพล เจริญสุข",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    certName: "AWS Certified Solutions Architect – Associate",
    issuer: "Amazon Web Services",
    skillTag: "Cloud & Cyber Security",
    issueDate: "15 มี.ค. 2568",
    expiryDate: "15 มี.ค. 2571",
    credentialNo: "AWS-SAA-882419",
    status: "valid",
  },
  {
    id: "SC-02",
    code: "CRT-69-02",
    employeeCode: "EMP-1045",
    employeeName: "ปวีณา เลิศศิริ",
    department: "ฝ่ายพัฒนาทรัพยากรบุคคล (HRD)",
    certName: "SHRM Certified Professional (SHRM-CP)",
    issuer: "SHRM",
    skillTag: "People Leadership & Coaching",
    issueDate: "10 ม.ค. 2567",
    expiryDate: "10 ม.ค. 2570",
    credentialNo: "SHRM-CP-441092",
    status: "expiring",
  },
  {
    id: "SC-03",
    code: "CRT-69-03",
    employeeCode: "EMP-1052",
    employeeName: "ภูมิพัฒน์ อินทรักษา",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    certName: "ISO/IEC 27001 Lead Implementer",
    issuer: "PECB",
    skillTag: "Cloud & Cyber Security",
    issueDate: "05 มิ.ย. 2568",
    expiryDate: "05 มิ.ย. 2571",
    credentialNo: "PECB-27001-1904",
    status: "valid",
  },
  {
    id: "SC-04",
    code: "CRT-69-04",
    employeeCode: "EMP-1088",
    employeeName: "ศิริพร รัตนวงศ์",
    department: "ฝ่ายขายและการตลาด",
    certName: "Microsoft Certified: Power BI Data Analyst",
    issuer: "Microsoft",
    skillTag: "Data Analytics & AI Literacy",
    issueDate: "20 ต.ค. 2567",
    expiryDate: "20 ต.ค. 2569",
    credentialNo: "MS-PL300-77213",
    status: "expired",
  },
  {
    id: "SC-05",
    code: "CRT-69-05",
    employeeCode: "EMP-1071",
    employeeName: "อรรถพล แสงทอง",
    department: "ฝ่ายปฏิบัติการและบริการ",
    certName: "Project Management Professional (PMP)",
    issuer: "PMI",
    skillTag: "Agile & Project Delivery",
    issueDate: "12 ก.พ. 2567",
    expiryDate: "12 ก.พ. 2570",
    credentialNo: "PMI-PMP-319540",
    status: "expiring",
  },
  {
    id: "SC-06",
    code: "CRT-69-06",
    employeeCode: "EMP-1126",
    employeeName: "ชลธิชา นาควัชระ",
    department: "ฝ่ายออกแบบผลิตภัณฑ์และ UX",
    certName: "Nielsen Norman Group UX Certification",
    issuer: "NN/g",
    skillTag: "Customer & Business Consulting",
    issueDate: "01 ส.ค. 2568",
    expiryDate: "ตลอดชีพ",
    credentialNo: "NNG-UXC-55821",
    status: "valid",
  },
  {
    id: "SC-07",
    code: "CRT-69-07",
    employeeCode: "EMP-1135",
    employeeName: "ปิยะพงษ์ สุวรรณโชติ",
    department: "ฝ่ายการเงินและบัญชี",
    certName: "Chartered Financial Analyst (CFA Level II)",
    issuer: "CFA Institute",
    skillTag: "Data Analytics & AI Literacy",
    issueDate: "18 ก.ย. 2568",
    expiryDate: "ตลอดชีพ",
    credentialNo: "CFA-L2-90314",
    status: "valid",
  },
];
