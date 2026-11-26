export type SettingsTabKey =
  | "categories"
  | "course-types"
  | "competency-levels"
  | "skill-levels"
  | "scoring"
  | "development-types"
  | "certificates"
  | "workflows";

export interface SettingsNavTab {
  key: SettingsTabKey;
  label: string;
  labelEn: string;
  description: string;
}

export interface MasterItem {
  id: string;
  code: string;
  name: string;
  nameEn: string;
  description: string;
  meta?: string;
  active: boolean;
}

export interface ScoringCriterion {
  id: string;
  grade: string;
  label: string;
  minScore: number;
  maxScore: number;
  color: string;
  description: string;
  active: boolean;
}

export interface CertificateConfig {
  prefix: string;
  autoIssue: boolean;
  minPassScore: number;
  validityMonths: number;
  expiryReminderDays: number;
  signatoryName: string;
  signatoryTitle: string;
  showQrVerify: boolean;
}

export interface WorkflowRule {
  id: string;
  code: string;
  moduleName: string;
  description: string;
  steps: string;
  slaDays: number;
  autoEscalate: boolean;
  active: boolean;
}

export const SETTINGS_TABS: SettingsNavTab[] = [
  {
    key: "categories",
    label: "หมวดหมู่ HRD",
    labelEn: "HRD Categories",
    description: "หมวดหมู่หลักสำหรับจัดกลุ่มหลักสูตร สมรรถนะ และกิจกรรมพัฒนา",
  },
  {
    key: "course-types",
    label: "ประเภทหลักสูตร",
    labelEn: "Course Types",
    description: "รูปแบบการจัดอบรมและการเรียนรู้ที่รองรับในระบบ",
  },
  {
    key: "competency-levels",
    label: "ระดับสมรรถนะ",
    labelEn: "Competency Levels",
    description: "เกณฑ์ระดับสมรรถนะองค์กร (ระดับ 1–5) สำหรับการประเมินและตำแหน่งงาน",
  },
  {
    key: "skill-levels",
    label: "ระดับทักษะ",
    labelEn: "Skill Levels",
    description: "เกณฑ์ระดับความชำนาญทักษะ (Proficiency 1–5) ใช้คำนวณ Skill Gap",
  },
  {
    key: "scoring",
    label: "เกณฑ์การให้คะแนน",
    labelEn: "Scoring Criteria",
    description: "ช่วงคะแนนและเกรดผลการปฏิบัติงาน (PMS) ประจำรอบประเมิน",
  },
  {
    key: "development-types",
    label: "ประเภทการพัฒนา",
    labelEn: "Development Types",
    description: "ประเภทกิจกรรมพัฒนาตามกรอบ 70-20-10 สำหรับแผน IDP",
  },
  {
    key: "certificates",
    label: "ใบประกาศนียบัตร",
    labelEn: "Certificate Settings",
    description: "รูปแบบรหัสใบรับรอง เงื่อนไขการออกอัตโนมัติ และผู้ลงนาม",
  },
  {
    key: "workflows",
    label: "Workflow อนุมัติ",
    labelEn: "Workflow Settings",
    description: "ลำดับขั้นการอนุมัติและระยะเวลาแจ้งเตือน (SLA) สำหรับคำขอ HRD",
  },
];

export const INITIAL_HRD_CATEGORIES: MasterItem[] = [
  {
    id: "CAT-01",
    code: "CAT-LEAD",
    name: "ภาวะผู้นำและการบริหารจัดการ",
    nameEn: "Leadership & Management",
    description: "พัฒนาทักษะการบริหารทีม การตัดสินใจ และการสื่อสารสำหรับหัวหน้างาน",
    meta: "18 หลักสูตร",
    active: true,
  },
  {
    id: "CAT-02",
    code: "CAT-DIGI",
    name: "ดิจิทัลและข้อมูล",
    nameEn: "Digital & Data Literacy",
    description: "ทักษะ Data Analytics, AI Productivity และเครื่องมือดิจิทัลสมัยใหม่",
    meta: "24 หลักสูตร",
    active: true,
  },
  {
    id: "CAT-03",
    code: "CAT-FUNC",
    name: "ทักษะเฉพาะสายงาน",
    nameEn: "Functional & Technical",
    description: "ความรู้เชิงลึกเฉพาะตำแหน่ง เช่น วิศวกรรมซอฟต์แวร์ การขาย และบัญชี",
    meta: "32 หลักสูตร",
    active: true,
  },
  {
    id: "CAT-04",
    code: "CAT-SOFT",
    name: "ทักษะการสื่อสารและการทำงานร่วมกัน",
    nameEn: "Soft Skills & Collaboration",
    description: "การนำเสนอ การให้ Feedback และการแก้ปัญหาเชิงสร้างสรรค์",
    meta: "15 หลักสูตร",
    active: true,
  },
  {
    id: "CAT-05",
    code: "CAT-COMP",
    name: "กฎหมายและมาตรฐานบังคับ",
    nameEn: "Compliance & Safety",
    description: "PDPA ความปลอดภัยข้อมูล จรรยาบรรณ และความปลอดภัยในการทำงาน",
    meta: "9 หลักสูตร",
    active: true,
  },
];

export const INITIAL_COURSE_TYPES: MasterItem[] = [
  {
    id: "CT-01",
    code: "IN-HOUSE",
    name: "อบรมภายในองค์กร (In-House)",
    nameEn: "In-House Training",
    description: "จัดอบรมเฉพาะพนักงานในองค์กร โดยวิทยากรภายในหรือเชิญวิทยากรภายนอก",
    meta: "Onsite / Hybrid",
    active: true,
  },
  {
    id: "CT-02",
    code: "PUBLIC",
    name: "อบรมภายนอก (Public)",
    nameEn: "Public Training",
    description: "ส่งพนักงานเข้าร่วมสัมมนาหรือหลักสูตรที่จัดโดยสถาบันภายนอก",
    meta: "ใช้งบอบรมภายนอก",
    active: true,
  },
  {
    id: "CT-03",
    code: "LMS",
    name: "เรียนออนไลน์ด้วยตนเอง",
    nameEn: "E-Learning (LMS)",
    description: "บทเรียนวิดีโอและแบบทดสอบออนไลน์ เรียนได้ทุกที่ทุกเวลาผ่านระบบ LMS",
    meta: "ออก Certificate อัตโนมัติ",
    active: true,
  },
  {
    id: "CT-04",
    code: "WORKSHOP",
    name: "เวิร์กช็อปเชิงปฏิบัติการ",
    nameEn: "Hands-on Workshop",
    description: "เน้นฝึกปฏิบัติจริงเป็นกลุ่มย่อยพร้อมกรณีศึกษาขององค์กร",
    meta: "ไม่เกิน 25 คน/รุ่น",
    active: true,
  },
  {
    id: "CT-05",
    code: "CERT-EXAM",
    name: "สอบใบรับรองวิชาชีพ",
    nameEn: "Professional Certification",
    description: "สนับสนุนค่าสอบและเตรียมความพร้อมสำหรับใบรับรองมาตรฐานสากล",
    meta: "ต้องแนบใบรับรอง",
    active: false,
  },
];

export const INITIAL_COMPETENCY_LEVELS: MasterItem[] = [
  {
    id: "CL-1",
    code: "LV-1",
    name: "ระดับ 1 — รับรู้และเข้าใจพื้นฐาน",
    nameEn: "Awareness",
    description: "เข้าใจแนวคิดและคำศัพท์พื้นฐาน ปฏิบัติงานตามคำแนะนำของหัวหน้างานได้",
    meta: "คะแนน 1.0",
    active: true,
  },
  {
    id: "CL-2",
    code: "LV-2",
    name: "ระดับ 2 — ปฏิบัติงานได้ภายใต้การดูแล",
    nameEn: "Developing",
    description: "นำความรู้ไปใช้งานจริงในสถานการณ์ทั่วไปได้ โดยมีพี่เลี้ยงให้คำแนะนำ",
    meta: "คะแนน 2.0",
    active: true,
  },
  {
    id: "CL-3",
    code: "LV-3",
    name: "ระดับ 3 — ปฏิบัติงานได้ด้วยตนเอง",
    nameEn: "Proficient",
    description: "ปฏิบัติงานได้ครบถ้วนสม่ำเสมอตามมาตรฐาน และแก้ไขปัญหาเฉพาะหน้าได้เอง",
    meta: "คะแนน 3.0",
    active: true,
  },
  {
    id: "CL-4",
    code: "LV-4",
    name: "ระดับ 4 — ชำนาญและปรับปรุงกระบวนการ",
    nameEn: "Advanced",
    description: "จัดการงานที่ซับซ้อน ออกแบบแนวทางปรับปรุงงาน และให้คำปรึกษาทีมได้",
    meta: "คะแนน 4.0",
    active: true,
  },
  {
    id: "CL-5",
    code: "LV-5",
    name: "ระดับ 5 — เชี่ยวชาญระดับองค์กร",
    nameEn: "Mastery",
    description: "กำหนดทิศทางกลยุทธ์ สร้างมาตรฐานใหม่ และถ่ายทอดองค์ความรู้ข้ามสายงาน",
    meta: "คะแนน 5.0",
    active: true,
  },
];

export const INITIAL_SKILL_LEVELS: MasterItem[] = [
  {
    id: "SL-1",
    code: "SK-1",
    name: "ระดับ 1 — Beginner (เริ่มต้น)",
    nameEn: "Beginner",
    description: "มีความรู้เบื้องต้น ยังต้องอาศัยคู่มือหรือคำแนะนำในการลงมือทำ",
    meta: "สเกล 1 / 5",
    active: true,
  },
  {
    id: "SL-2",
    code: "SK-2",
    name: "ระดับ 2 — Elementary (พื้นฐาน)",
    nameEn: "Elementary",
    description: "ทำงานย่อยที่ไม่ซับซ้อนได้ แต่ต้องมีการตรวจทานจากผู้เชี่ยวชาญ",
    meta: "สเกล 2 / 5",
    active: true,
  },
  {
    id: "SL-3",
    code: "SK-3",
    name: "ระดับ 3 — Practitioner (ปฏิบัติงานได้เอง)",
    nameEn: "Practitioner",
    description: "ใช้ทักษะในการทำงานประจำวันได้อย่างอิสระและมีคุณภาพตามเป้าหมาย",
    meta: "สเกล 3 / 5",
    active: true,
  },
  {
    id: "SL-4",
    code: "SK-4",
    name: "ระดับ 4 — Advanced (ชำนาญสูง)",
    nameEn: "Advanced",
    description: "แก้ปัญหาเชิงลึกได้รวดเร็ว และสามารถสอนงานสมาชิกในทีมได้",
    meta: "สเกล 4 / 5",
    active: true,
  },
  {
    id: "SL-5",
    code: "SK-5",
    name: "ระดับ 5 — Expert (ผู้เชี่ยวชาญ)",
    nameEn: "Expert",
    description: "เป็นแหล่งอ้างอิงหลักขององค์กร สร้างนวัตกรรมและหลักสูตรถ่ายทอดได้",
    meta: "สเกล 5 / 5",
    active: true,
  },
];

export const INITIAL_SCORING_CRITERIA: ScoringCriterion[] = [
  {
    id: "SC-A",
    grade: "A",
    label: "ดีเยี่ยม (Exceeds Expectations)",
    minScore: 4.5,
    maxScore: 5.0,
    color: "#22B89A",
    description: "ผลงานโดดเด่นเกินเป้าหมายอย่างชัดเจน สร้างคุณค่าเพิ่มให้องค์กร",
    active: true,
  },
  {
    id: "SC-BP",
    grade: "B+",
    label: "ดีมาก (Above Target)",
    minScore: 3.75,
    maxScore: 4.49,
    color: "#3B82F6",
    description: "ผลงานสูงกว่ามาตรฐานที่ตั้งไว้สม่ำเสมอ มีความพร้อมเติบโต",
    active: true,
  },
  {
    id: "SC-B",
    grade: "B",
    label: "ตามเป้าหมาย (Meets Target)",
    minScore: 3.0,
    maxScore: 3.74,
    color: "#A78BFA",
    description: "บรรลุเป้าหมาย KPI และแสดงพฤติกรรมตามสมรรถนะครบถ้วน",
    active: true,
  },
  {
    id: "SC-C",
    grade: "C",
    label: "ต้องพัฒนาเพิ่มเติม (Needs Improvement)",
    minScore: 2.25,
    maxScore: 2.99,
    color: "#F5B73B",
    description: "ผลงานต่ำกว่าเป้าหมายบางส่วน ต้องจัดทำแผน IDP เร่งพัฒนา",
    active: true,
  },
  {
    id: "SC-PIP",
    grade: "PIP",
    label: "แผนปรับปรุงผลงาน (PIP)",
    minScore: 0.0,
    maxScore: 2.24,
    color: "#F87171",
    description: "ต้องเข้าสู่กระบวนการ Performance Improvement Plan 60–90 วัน",
    active: true,
  },
];

export const INITIAL_DEVELOPMENT_TYPES: MasterItem[] = [
  {
    id: "DEV-70-1",
    code: "70-OJT",
    name: "On-the-Job Training & Project Assignment",
    nameEn: "70% Experience",
    description: "เรียนรู้จากการลงมือปฏิบัติจริง มอบหมายโปรเจกต์พิเศษ หรือ Job Rotation",
    meta: "สัดส่วน 70%",
    active: true,
  },
  {
    id: "DEV-20-1",
    code: "20-COACH",
    name: "Coaching & Mentoring",
    nameEn: "20% Social Learning",
    description: "การโค้ชชิ่งแบบ 1-on-1 พี่เลี้ยงสายงาน และการแลกเปลี่ยนเรียนรู้ในทีม",
    meta: "สัดส่วน 20%",
    active: true,
  },
  {
    id: "DEV-10-1",
    code: "10-TRN",
    name: "Formal Training & LMS Courses",
    nameEn: "10% Formal Learning",
    description: "การเข้าอบรมในห้องเรียน สัมมนา และคอร์สออนไลน์ในระบบ LMS",
    meta: "สัดส่วน 10%",
    active: true,
  },
  {
    id: "DEV-10-2",
    code: "10-READ",
    name: "Self-Study & Certification Prep",
    nameEn: "10% Formal Learning",
    description: "ศึกษาด้วยตนเองผ่านบทความ หนังสือ หรือเตรียมสอบใบรับรองวิชาชีพ",
    meta: "สัดส่วน 10%",
    active: true,
  },
];

export const INITIAL_CERTIFICATE_CONFIG: CertificateConfig = {
  prefix: "CERT-HRD-2569-",
  autoIssue: true,
  minPassScore: 80,
  validityMonths: 24,
  expiryReminderDays: 30,
  signatoryName: "พิมพ์ชนก วัฒนากูล",
  signatoryTitle: "HRD Manager",
  showQrVerify: true,
};

export const INITIAL_WORKFLOW_RULES: WorkflowRule[] = [
  {
    id: "WF-01",
    code: "WF-TRN-ENROLL",
    moduleName: "อนุมัติลงทะเบียนฝึกอบรม (ในแผน)",
    description: "คำขอลงทะเบียนหลักสูตรที่อยู่ใน Annual Training Plan",
    steps: "หัวหน้างานโดยตรง → HRD Admin",
    slaDays: 3,
    autoEscalate: true,
    active: true,
  },
  {
    id: "WF-02",
    code: "WF-TRN-BUDGET",
    moduleName: "อนุมัติงบประมาณอบรมภายนอก (Public)",
    description: "คำขออบรมภายนอกที่มีค่าใช้จ่ายเกิน ฿10,000 ต่อรายการ",
    steps: "หัวหน้างาน → HRD Manager → VP HR",
    slaDays: 5,
    autoEscalate: true,
    active: true,
  },
  {
    id: "WF-03",
    code: "WF-IDP-PLAN",
    moduleName: "อนุมัติแผนพัฒนารายบุคคล (IDP)",
    description: "การส่งแผน IDP ประจำปีและการปิดแผนหลังประเมินผล",
    steps: "หัวหน้างานโดยตรง → HRBP / HRD",
    slaDays: 5,
    autoEscalate: false,
    active: true,
  },
  {
    id: "WF-04",
    code: "WF-PMS-KPI",
    moduleName: "อนุมัติเป้าหมายและปรับน้ำหนัก KPI",
    description: "การตั้งเป้าหมายต้นปีและการขอแก้ไข KPI ระหว่างรอบประเมิน",
    steps: "หัวหน้างานโดยตรง → ผู้อำนวยการฝ่าย",
    slaDays: 3,
    autoEscalate: true,
    active: true,
  },
];

export const WORKFLOW_CHAIN_OPTIONS = [
  { value: "หัวหน้างานโดยตรง", label: "1 ขั้น: หัวหน้างานโดยตรง" },
  { value: "หัวหน้างานโดยตรง → HRD Admin", label: "2 ขั้น: หัวหน้างาน → HRD Admin" },
  { value: "หัวหน้างานโดยตรง → HRBP / HRD", label: "2 ขั้น: หัวหน้างาน → HRBP / HRD" },
  { value: "หัวหน้างานโดยตรง → ผู้อำนวยการฝ่าย", label: "2 ขั้น: หัวหน้างาน → ผู้อำนวยการฝ่าย" },
  {
    value: "หัวหน้างาน → HRD Manager → VP HR",
    label: "3 ขั้น: หัวหน้างาน → HRD Manager → VP HR",
  },
];
