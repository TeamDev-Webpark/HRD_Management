export type QuestionDifficulty = "easy" | "medium" | "hard";
export type QuestionType = "Multiple Choice" | "True/False" | "Scenario";

export interface QuestionBankItem {
  id: string;
  code: string;
  question: string;
  courseTitle: string;
  category: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  correctAnswer: string;
  active: boolean;
}

export interface OnlineAssessmentItem {
  id: string;
  code: string;
  title: string;
  courseTitle: string;
  questionCount: number;
  timeLimitMin: number;
  passingScore: number;
  attemptsCount: number;
  passRate: number;
  active: boolean;
}

export type LearningProgressStatus = "completed" | "in-progress" | "overdue";

export interface LearningProgressItem {
  id: string;
  employeeCode: string;
  employeeName: string;
  department: string;
  courseTitle: string;
  completedLessons: number;
  totalLessons: number;
  progressPct: number;
  examScore: number | null;
  lastActive: string;
  status: LearningProgressStatus;
}

export type CertificateStatus = "valid" | "expiring" | "expired";

export interface LmsCertificateItem {
  id: string;
  certCode: string;
  employeeCode: string;
  employeeName: string;
  department: string;
  position: string;
  courseTitle: string;
  score: number;
  issuedDate: string;
  expiryDate: string;
  status: CertificateStatus;
}

export const INITIAL_QUESTION_BANK: QuestionBankItem[] = [
  {
    id: "QB-01",
    code: "QB-AI-001",
    question: "องค์ประกอบ 4 ส่วนของ Prompt ที่มีประสิทธิภาพ (Role – Context – Task – Format) ช่วยเรื่องใดมากที่สุด?",
    courseTitle: "Generative AI Essentials for Everyday Work",
    category: "Digital & AI",
    type: "Multiple Choice",
    difficulty: "easy",
    correctAnswer: "ลดความกำกวมและได้คำตอบตรงบริบทพร้อมใช้งานทันที",
    active: true,
  },
  {
    id: "QB-02",
    code: "QB-AI-002",
    question: "ก่อนนำข้อมูลแบบสำรวจพนักงานไปให้ AI ช่วยสรุปแนวโน้ม ต้องลบข้อมูลระบุตัวตน (PII) ออกทั้งหมดเสมอ",
    courseTitle: "Generative AI Essentials for Everyday Work",
    category: "Digital & AI",
    type: "True/False",
    difficulty: "easy",
    correctAnswer: "ถูก (True) — ต้องทำ Anonymize ตามนโยบาย AI Governance & PDPA",
    active: true,
  },
  {
    id: "QB-03",
    code: "QB-LDR-001",
    question: "ลูกทีมส่งงานล่าช้าติดต่อกัน 2 สัปดาห์ หัวหน้างานควรใช้แนวทาง GROW Model ขั้นตอนใดเป็นอันดับแรกในการคุย 1-on-1?",
    courseTitle: "Leadership & Coaching for First-Time Managers",
    category: "Leadership",
    type: "Scenario",
    difficulty: "medium",
    correctAnswer: "ตั้งเป้าหมายร่วมกัน (Goal) และรับฟังสถานการณ์จริง (Reality) อย่างเปิดใจ",
    active: true,
  },
  {
    id: "QB-04",
    code: "QB-CMP-001",
    question: "หากพบเหตุข้อมูลส่วนบุคคลรั่วไหล องค์กรต้องประเมินและแจ้งสำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล (สคส.) ภายในกี่ชั่วโมง?",
    courseTitle: "PDPA & Information Security Compliance 2569",
    category: "Compliance",
    type: "Multiple Choice",
    difficulty: "medium",
    correctAnswer: "ภายใน 72 ชั่วโมงนับแต่ทราบเหตุ",
    active: true,
  },
  {
    id: "QB-05",
    code: "QB-DAT-001",
    question: "เมื่อต้องนำเสนอแนวโน้มชั่วโมงฝึกอบรมรายเดือนตลอด 12 เดือน ควรเลือกกราฟชนิดใดเพื่อให้ผู้บริหารเข้าใจเร็วที่สุด?",
    courseTitle: "HR & Business Data Storytelling with Power BI",
    category: "Data & Analytics",
    type: "Multiple Choice",
    difficulty: "hard",
    correctAnswer: "กราฟแท่งหรือกราฟเส้น (Bar / Line Chart) เรียงตามแกนเวลาพร้อมเส้นเป้าหมาย",
    active: true,
  },
  {
    id: "QB-06",
    code: "QB-PMS-001",
    question: "ข้อใดคือความแตกต่างสำคัญระหว่าง Output และ Outcome ในการตั้ง Key Results (OKR)?",
    courseTitle: "OKR & Goal Alignment Mastery",
    category: "Performance",
    type: "Scenario",
    difficulty: "hard",
    correctAnswer: "Output คือกิจกรรมที่ทำเสร็จ ส่วน Outcome คือผลลัพธ์เชิงธุรกิจที่วัดค่าได้จริง",
    active: false,
  },
];

export const INITIAL_ONLINE_ASSESSMENTS: OnlineAssessmentItem[] = [
  {
    id: "ASM-01",
    code: "EXAM-AI-101",
    title: "แบบทดสอบวัดผลปลายภาค: Generative AI Essentials",
    courseTitle: "Generative AI Essentials for Everyday Work",
    questionCount: 20,
    timeLimitMin: 30,
    passingScore: 80,
    attemptsCount: 214,
    passRate: 88,
    active: true,
  },
  {
    id: "ASM-02",
    code: "EXAM-CMP-201",
    title: "แบบทดสอบภาคบังคับ: PDPA & Cybersecurity 2569",
    courseTitle: "PDPA & Information Security Compliance 2569",
    questionCount: 25,
    timeLimitMin: 35,
    passingScore: 80,
    attemptsCount: 468,
    passRate: 94,
    active: true,
  },
  {
    id: "ASM-03",
    code: "EXAM-LDR-301",
    title: "ประเมินทักษะการโค้ชชิ่งและ SBI Feedback",
    courseTitle: "Leadership & Coaching for First-Time Managers",
    questionCount: 15,
    timeLimitMin: 25,
    passingScore: 80,
    attemptsCount: 86,
    passRate: 79,
    active: true,
  },
  {
    id: "ASM-04",
    code: "EXAM-DAT-204",
    title: "ทดสอบการออกแบบแดชบอร์ดและ Data Storytelling",
    courseTitle: "HR & Business Data Storytelling with Power BI",
    questionCount: 20,
    timeLimitMin: 40,
    passingScore: 75,
    attemptsCount: 112,
    passRate: 82,
    active: true,
  },
  {
    id: "ASM-05",
    code: "EXAM-PMS-102",
    title: "แบบทดสอบความเข้าใจ OKR & Goal Alignment",
    courseTitle: "OKR & Goal Alignment Mastery",
    questionCount: 15,
    timeLimitMin: 20,
    passingScore: 80,
    attemptsCount: 64,
    passRate: 91,
    active: false,
  },
];

export const INITIAL_LEARNING_PROGRESS: LearningProgressItem[] = [
  {
    id: "PRG-01",
    employeeCode: "EMP-1024",
    employeeName: "ณัฐพล เจริญสุข",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    courseTitle: "PDPA & Information Security Compliance 2569",
    completedLessons: 6,
    totalLessons: 6,
    progressPct: 100,
    examScore: 96,
    lastActive: "18 พ.ย. 2569",
    status: "completed",
  },
  {
    id: "PRG-02",
    employeeCode: "EMP-1088",
    employeeName: "ศิริพร รัตนวงศ์",
    department: "ฝ่ายขายและการตลาด",
    courseTitle: "Generative AI Essentials for Everyday Work",
    completedLessons: 6,
    totalLessons: 8,
    progressPct: 75,
    examScore: null,
    lastActive: "26 พ.ย. 2569",
    status: "in-progress",
  },
  {
    id: "PRG-03",
    employeeCode: "EMP-1045",
    employeeName: "ปวีณา เลิศศิริ",
    department: "ฝ่ายทรัพยากรบุคคล",
    courseTitle: "HR & Business Data Storytelling with Power BI",
    completedLessons: 12,
    totalLessons: 12,
    progressPct: 100,
    examScore: 92,
    lastActive: "22 พ.ย. 2569",
    status: "completed",
  },
  {
    id: "PRG-04",
    employeeCode: "EMP-1071",
    employeeName: "อรรถพล แสงทอง",
    department: "ฝ่ายปฏิบัติการและบริการ",
    courseTitle: "PDPA & Information Security Compliance 2569",
    completedLessons: 2,
    totalLessons: 6,
    progressPct: 33,
    examScore: null,
    lastActive: "10 พ.ย. 2569",
    status: "overdue",
  },
  {
    id: "PRG-05",
    employeeCode: "EMP-1052",
    employeeName: "ภูมิพัฒน์ อินทรักษา",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    courseTitle: "Leadership & Coaching for First-Time Managers",
    completedLessons: 7,
    totalLessons: 10,
    progressPct: 70,
    examScore: null,
    lastActive: "25 พ.ย. 2569",
    status: "in-progress",
  },
  {
    id: "PRG-06",
    employeeCode: "EMP-1033",
    employeeName: "มนัสนันท์ พงษ์ไพศาล",
    department: "ฝ่ายขายและการตลาด",
    courseTitle: "OKR & Goal Alignment Mastery",
    completedLessons: 5,
    totalLessons: 5,
    progressPct: 100,
    examScore: 88,
    lastActive: "21 พ.ย. 2569",
    status: "completed",
  },
];

export const INITIAL_LMS_CERTIFICATES: LmsCertificateItem[] = [
  {
    id: "CRT-01",
    certCode: "CERT-2569-0482",
    employeeCode: "EMP-1024",
    employeeName: "ณัฐพล เจริญสุข",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    position: "Senior Software Engineer",
    courseTitle: "PDPA & Information Security Compliance 2569",
    score: 96,
    issuedDate: "18 พ.ย. 2569",
    expiryDate: "18 พ.ย. 2570",
    status: "valid",
  },
  {
    id: "CRT-02",
    certCode: "CERT-2569-0479",
    employeeCode: "EMP-1045",
    employeeName: "ปวีณา เลิศศิริ",
    department: "ฝ่ายทรัพยากรบุคคล",
    position: "HR Business Partner",
    courseTitle: "HR & Business Data Storytelling with Power BI",
    score: 92,
    issuedDate: "22 พ.ย. 2569",
    expiryDate: "22 พ.ย. 2571",
    status: "valid",
  },
  {
    id: "CRT-03",
    certCode: "CERT-2569-0465",
    employeeCode: "EMP-1033",
    employeeName: "มนัสนันท์ พงษ์ไพศาล",
    department: "ฝ่ายขายและการตลาด",
    position: "Team Lead — Digital Sales",
    courseTitle: "OKR & Goal Alignment Mastery",
    score: 88,
    issuedDate: "21 พ.ย. 2569",
    expiryDate: "21 พ.ย. 2570",
    status: "valid",
  },
  {
    id: "CRT-04",
    certCode: "CERT-2568-0311",
    employeeCode: "EMP-1088",
    employeeName: "ศิริพร รัตนวงศ์",
    department: "ฝ่ายขายและการตลาด",
    position: "Key Account Manager",
    courseTitle: "PDPA & Information Security Compliance 2568",
    score: 90,
    issuedDate: "15 ธ.ค. 2568",
    expiryDate: "15 ธ.ค. 2569",
    status: "expiring",
  },
  {
    id: "CRT-05",
    certCode: "CERT-2568-0198",
    employeeCode: "EMP-1071",
    employeeName: "อรรถพล แสงทอง",
    department: "ฝ่ายปฏิบัติการและบริการ",
    position: "Operations Supervisor",
    courseTitle: "Workplace Safety & Compliance 2568",
    score: 84,
    issuedDate: "10 ต.ค. 2568",
    expiryDate: "10 ต.ค. 2569",
    status: "expired",
  },
];
