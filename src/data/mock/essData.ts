export interface EssGoalItem {
  id: string;
  code: string;
  title: string;
  weight: number;
  target: string;
  progress: number;
  selfScore: number | null;
  status: "on-track" | "completed" | "needs-attention";
}

export interface EssSkillItem {
  id: string;
  code: string;
  name: string;
  type: "Core" | "Managerial" | "Functional";
  targetLevel: number;
  actualLevel: number;
  lastAssessed: string;
}

export interface EssIdpActivity {
  id: string;
  code: string;
  title: string;
  method: "70% On-the-Job" | "20% Coaching" | "10% Training";
  dueDate: string;
  progress: number;
  status: "planned" | "in-progress" | "done";
}

export interface EssTrainingItem {
  id: string;
  code: string;
  courseName: string;
  dateRange: string;
  format: "Classroom" | "Online Live";
  hours: number;
  seatsLeft: number;
  enrolled: boolean;
  approvalStatus?: "pending" | "approved";
}

export interface EssLmsCourseItem {
  id: string;
  code: string;
  title: string;
  category: string;
  lessonsDone: number;
  totalLessons: number;
  progress: number;
  dueDate: string;
}

export interface EssCertificateItem {
  id: string;
  code: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  credentialNo: string;
  source: "LMS ภายใน" | "ภายนอก";
}

export const ESS_EMPLOYEE_PROFILE = {
  employeeCode: "EMP-1024",
  name: "ณัฐพล เจริญสุข",
  position: "Senior Software Engineer",
  department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
  jobGrade: "JG-06",
  managerName: "ธนกร ศิริสวัสดิ์",
  nextTargetRole: "Engineering Team Lead (JG-07)",
  careerReadiness: 82,
  trainingHoursDone: 24,
  trainingHoursTarget: 30,
};

export const INITIAL_ESS_GOALS: EssGoalItem[] = [
  {
    id: "EG-01",
    code: "KPI-01",
    title: "ลดเวลา Response Time ของ Core API ลง 30%",
    weight: 40,
    target: "≤ 180 ms (P95)",
    progress: 85,
    selfScore: 4.5,
    status: "on-track",
  },
  {
    id: "EG-02",
    code: "KPI-02",
    title: "ส่งมอบโปรเจกต์ปรับปรุงระบบ Auth ข้าม 3 ทีมตามกำหนด",
    weight: 35,
    target: "Go-live ภายใน Q4/2569",
    progress: 100,
    selfScore: 4.8,
    status: "completed",
  },
  {
    id: "EG-03",
    code: "KPI-03",
    title: "โค้ชชิ่งและทำ Code Review ให้ Junior Developer ในทีม",
    weight: 25,
    target: "อย่างน้อย 2 รอบ/สัปดาห์",
    progress: 65,
    selfScore: null,
    status: "needs-attention",
  },
];

export const INITIAL_ESS_SKILLS: EssSkillItem[] = [
  {
    id: "ES-01",
    code: "FC-01",
    name: "สถาปัตยกรรมระบบและความปลอดภัยไซเบอร์",
    type: "Functional",
    targetLevel: 4,
    actualLevel: 4,
    lastAssessed: "20 พ.ย. 2569",
  },
  {
    id: "ES-02",
    code: "FC-02",
    name: "การวิเคราะห์ข้อมูลและ AI Literacy",
    type: "Functional",
    targetLevel: 3,
    actualLevel: 3,
    lastAssessed: "20 พ.ย. 2569",
  },
  {
    id: "ES-03",
    code: "MC-01",
    name: "ภาวะผู้นำและการโค้ชชิ่งทีมงาน",
    type: "Managerial",
    targetLevel: 3,
    actualLevel: 2,
    lastAssessed: "20 พ.ย. 2569",
  },
  {
    id: "ES-04",
    code: "CC-02",
    name: "การสื่อสารและการทำงานร่วมกันข้ามสายงาน",
    type: "Core",
    targetLevel: 3,
    actualLevel: 4,
    lastAssessed: "20 พ.ย. 2569",
  },
];

export const INITIAL_ESS_IDP: EssIdpActivity[] = [
  {
    id: "EIDP-01",
    code: "ACT-01",
    title: "เป็น Project Lead ดูแลโปรเจกต์ย้ายระบบ Auth ข้าม 3 ทีม",
    method: "70% On-the-Job",
    dueDate: "30 ธ.ค. 2569",
    progress: 80,
    status: "in-progress",
  },
  {
    id: "EIDP-02",
    code: "ACT-02",
    title: "1-on-1 Leadership Coaching กับ Engineering Manager เดือนละ 2 ครั้ง",
    method: "20% Coaching",
    dueDate: "30 ธ.ค. 2569",
    progress: 60,
    status: "in-progress",
  },
  {
    id: "EIDP-03",
    code: "ACT-03",
    title: "เรียนคอร์ส Leadership for New Managers & Coaching",
    method: "10% Training",
    dueDate: "15 พ.ย. 2569",
    progress: 100,
    status: "done",
  },
];

export const INITIAL_ESS_TRAININGS: EssTrainingItem[] = [
  {
    id: "ETRN-01",
    code: "SES-69-08",
    courseName: "Leadership for New Managers & Coaching (รุ่นที่ 3)",
    dateRange: "10–11 ธ.ค. 2569",
    format: "Classroom",
    hours: 12,
    seatsLeft: 6,
    enrolled: false,
  },
  {
    id: "ETRN-02",
    code: "SES-69-09",
    courseName: "Practical Generative AI for Engineering Teams",
    dateRange: "16 ธ.ค. 2569",
    format: "Online Live",
    hours: 6,
    seatsLeft: 14,
    enrolled: true,
    approvalStatus: "approved",
  },
  {
    id: "ETRN-03",
    code: "SES-69-10",
    courseName: "Executive Presentation & Stakeholder Communication",
    dateRange: "22 ธ.ค. 2569",
    format: "Classroom",
    hours: 6,
    seatsLeft: 9,
    enrolled: false,
  },
];

export const INITIAL_ESS_LMS_COURSES: EssLmsCourseItem[] = [
  {
    id: "ELMS-01",
    code: "LMS-101",
    title: "Modern Leadership & Team Coaching Essentials",
    category: "Leadership",
    lessonsDone: 4,
    totalLessons: 5,
    progress: 80,
    dueDate: "15 ธ.ค. 2569",
  },
  {
    id: "ELMS-02",
    code: "LMS-102",
    title: "Data-Driven Decision Making & GenAI Literacy",
    category: "Digital & AI",
    lessonsDone: 6,
    totalLessons: 6,
    progress: 100,
    dueDate: "จบหลักสูตรแล้ว",
  },
  {
    id: "ELMS-03",
    code: "LMS-103",
    title: "Enterprise Cloud Security & PDPA Compliance",
    category: "Technical",
    lessonsDone: 2,
    totalLessons: 6,
    progress: 33,
    dueDate: "30 ธ.ค. 2569",
  },
];

export const INITIAL_ESS_CERTIFICATES: EssCertificateItem[] = [
  {
    id: "ECERT-01",
    code: "CERT-2569-01",
    title: "Data-Driven Decision Making & GenAI Literacy",
    issuer: "HRD Management Academy (LMS)",
    issueDate: "12 พ.ย. 2569",
    expiryDate: "ตลอดชีพ",
    credentialNo: "HRD-LMS-690218",
    source: "LMS ภายใน",
  },
  {
    id: "ECERT-02",
    code: "CERT-2568-02",
    title: "AWS Certified Solutions Architect – Associate",
    issuer: "Amazon Web Services",
    issueDate: "15 มี.ค. 2568",
    expiryDate: "15 มี.ค. 2571",
    credentialNo: "AWS-SAA-882419",
    source: "ภายนอก",
  },
];
