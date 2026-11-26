export type LmsLevel = "Beginner" | "Intermediate" | "Advanced";

export interface LmsCourseItem {
  id: string;
  code: string;
  title: string;
  category: string;
  instructor: string;
  level: LmsLevel;
  lessonsCount: number;
  durationMinutes: number;
  enrolledCount: number;
  completionRate: number;
  rating: number;
  published: boolean;
  summary: string;
}

export type LessonContentType = "Video" | "Document" | "Interactive" | "Quiz";

export interface LmsLessonItem {
  id: string;
  courseId: string;
  code: string;
  order: number;
  title: string;
  moduleTitle: string;
  contentType: LessonContentType;
  durationMinutes: number;
  mandatory: boolean;
  published: boolean;
}

export type MaterialFileType = "PDF" | "MP4" | "SCORM" | "PPTX";

export interface LmsMaterialItem {
  id: string;
  code: string;
  title: string;
  courseTitle: string;
  fileType: MaterialFileType;
  fileSize: string;
  downloads: number;
  uploadedBy: string;
  updatedAt: string;
  active: boolean;
}

export const LMS_CATEGORY_OPTIONS = [
  { value: "all", label: "ทุกหมวดหมู่" },
  { value: "Digital & AI", label: "Digital & AI" },
  { value: "Leadership", label: "Leadership" },
  { value: "Compliance", label: "Compliance & PDPA" },
  { value: "Data & Analytics", label: "Data & Analytics" },
  { value: "Soft Skills", label: "Soft Skills" },
];

export const INITIAL_LMS_COURSES: LmsCourseItem[] = [
  {
    id: "LMS-01",
    code: "LMS-AI-101",
    title: "Generative AI Essentials for Everyday Work",
    category: "Digital & AI",
    instructor: "ดร.ภาณุพงศ์ รัตนชัย",
    level: "Beginner",
    lessonsCount: 8,
    durationMinutes: 145,
    enrolledCount: 214,
    completionRate: 84,
    rating: 4.9,
    published: true,
    summary: "พื้นฐานการใช้ AI ช่วยร่างเอกสาร สรุปประชุม วิเคราะห์ข้อมูล และแนวทางใช้งานอย่างปลอดภัยในองค์กร",
  },
  {
    id: "LMS-02",
    code: "LMS-CMP-201",
    title: "PDPA & Information Security Compliance 2569",
    category: "Compliance",
    instructor: "คุณวรเมธ ศรีสวัสดิ์",
    level: "Beginner",
    lessonsCount: 6,
    durationMinutes: 90,
    enrolledCount: 468,
    completionRate: 93,
    rating: 4.7,
    published: true,
    summary: "หลักสูตรบังคับประจำปีว่าด้วยการคุ้มครองข้อมูลส่วนบุคคลและแนวทางป้องกันภัยไซเบอร์สำหรับพนักงานทุกคน",
  },
  {
    id: "LMS-03",
    code: "LMS-LDR-301",
    title: "Situational Leadership & Coaching Conversations",
    category: "Leadership",
    instructor: "อ.นภาพร วัฒนสินธ์",
    level: "Intermediate",
    lessonsCount: 10,
    durationMinutes: 210,
    enrolledCount: 86,
    completionRate: 71,
    rating: 4.8,
    published: true,
    summary: "เทคนิคการโค้ชชิ่ง การให้ Feedback เชิงสร้างสรรค์ และการปรับสไตล์การนำทีมตามความพร้อมของพนักงาน",
  },
  {
    id: "LMS-04",
    code: "LMS-DAT-204",
    title: "Power BI & Business Dashboard Storytelling",
    category: "Data & Analytics",
    instructor: "ดร.ภาณุพงศ์ รัตนชัย",
    level: "Intermediate",
    lessonsCount: 12,
    durationMinutes: 260,
    enrolledCount: 128,
    completionRate: 66,
    rating: 4.9,
    published: true,
    summary: "ออกแบบแดชบอร์ดและเล่าเรื่องด้วยข้อมูลสำหรับฝ่ายบริหาร พร้อมชุดข้อมูลตัวอย่างให้ฝึกปฏิบัติจริง",
  },
  {
    id: "LMS-05",
    code: "LMS-SFT-105",
    title: "Effective Cross-Functional Communication",
    category: "Soft Skills",
    instructor: "อ.ปิยะวัฒน์ เกียรติสกุล",
    level: "Beginner",
    lessonsCount: 5,
    durationMinutes: 75,
    enrolledCount: 152,
    completionRate: 88,
    rating: 4.6,
    published: true,
    summary: "ศิลปะการสื่อสารประสานงานข้ามแผนก การสรุปประเด็นอย่างกระชับ และการจัดการความขัดแย้งเชิงบวก",
  },
  {
    id: "LMS-06",
    code: "LMS-DAT-401",
    title: "Applied Machine Learning for Enterprise Operations",
    category: "Data & Analytics",
    instructor: "สถาบันพัฒนาผู้นำและองค์กร (TLD)",
    level: "Advanced",
    lessonsCount: 14,
    durationMinutes: 320,
    enrolledCount: 34,
    completionRate: 48,
    rating: 4.8,
    published: false,
    summary: "การประยุกต์ใช้โมเดลพยากรณ์และจัดกลุ่มข้อมูลในกระบวนการปฏิบัติงานจริง (กำลังตรวจทานเนื้อหาก่อนเผยแพร่)",
  },
];

export const INITIAL_LMS_LESSONS: LmsLessonItem[] = [
  {
    id: "LES-01",
    courseId: "LMS-01",
    code: "LES-101-01",
    order: 1,
    title: "ทำความรู้จัก Generative AI และบทบาทในที่ทำงานยุคใหม่",
    moduleTitle: "Module 1: พื้นฐาน AI",
    contentType: "Video",
    durationMinutes: 18,
    mandatory: true,
    published: true,
  },
  {
    id: "LES-02",
    courseId: "LMS-01",
    code: "LES-101-02",
    order: 2,
    title: "โครงสร้าง Prompt ที่มีประสิทธิภาพ (Role – Context – Output)",
    moduleTitle: "Module 1: พื้นฐาน AI",
    contentType: "Video",
    durationMinutes: 22,
    mandatory: true,
    published: true,
  },
  {
    id: "LES-03",
    courseId: "LMS-01",
    code: "LES-101-03",
    order: 3,
    title: "คู่มือ Prompt Templates สำหรับงานเอกสารและอีเมลองค์กร",
    moduleTitle: "Module 2: ประยุกต์ใช้งานจริง",
    contentType: "Document",
    durationMinutes: 15,
    mandatory: true,
    published: true,
  },
  {
    id: "LES-04",
    courseId: "LMS-01",
    code: "LES-101-04",
    order: 4,
    title: "Workshop จำลอง: สรุปข้อมูลประชุมและจัดทำ Action Plan",
    moduleTitle: "Module 2: ประยุกต์ใช้งานจริง",
    contentType: "Interactive",
    durationMinutes: 25,
    mandatory: true,
    published: true,
  },
  {
    id: "LES-05",
    courseId: "LMS-01",
    code: "LES-101-05",
    order: 5,
    title: "แบบทดสอบวัดความเข้าใจท้ายคอร์ส (เกณฑ์ผ่าน 80%)",
    moduleTitle: "Module 3: ประเมินผล",
    contentType: "Quiz",
    durationMinutes: 15,
    mandatory: true,
    published: true,
  },
  {
    id: "LES-06",
    courseId: "LMS-02",
    code: "LES-201-01",
    order: 1,
    title: "หลักการสำคัญของ พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)",
    moduleTitle: "Module 1: กฎหมาย PDPA",
    contentType: "Video",
    durationMinutes: 20,
    mandatory: true,
    published: true,
  },
  {
    id: "LES-07",
    courseId: "LMS-02",
    code: "LES-201-02",
    order: 2,
    title: "กรณีศึกษา Phishing Email และการป้องกันข้อมูลรั่วไหล",
    moduleTitle: "Module 2: ความปลอดภัยไซเบอร์",
    contentType: "Interactive",
    durationMinutes: 25,
    mandatory: true,
    published: true,
  },
  {
    id: "LES-08",
    courseId: "LMS-03",
    code: "LES-301-01",
    order: 1,
    title: "กรอบแนวคิด Situational Leadership II สำหรับหัวหน้างาน",
    moduleTitle: "Module 1: ภาวะผู้นำตามสถานการณ์",
    contentType: "Video",
    durationMinutes: 24,
    mandatory: true,
    published: true,
  },
];

export const INITIAL_LMS_MATERIALS: LmsMaterialItem[] = [
  {
    id: "MAT-01",
    code: "MAT-69-001",
    title: "Enterprise Prompt Engineering Playbook 2569",
    courseTitle: "Generative AI Essentials for Everyday Work",
    fileType: "PDF",
    fileSize: "4.8 MB",
    downloads: 186,
    uploadedBy: "ดร.ภาณุพงศ์ รัตนชัย",
    updatedAt: "20 พ.ย. 2569",
    active: true,
  },
  {
    id: "MAT-02",
    code: "MAT-69-002",
    title: "วิดีโอบรรยาย: PDPA Compliance Checklist (HD 1080p)",
    courseTitle: "PDPA & Information Security Compliance 2569",
    fileType: "MP4",
    fileSize: "142 MB",
    downloads: 412,
    uploadedBy: "คุณวรเมธ ศรีสวัสดิ์",
    updatedAt: "15 พ.ย. 2569",
    active: true,
  },
  {
    id: "MAT-03",
    code: "MAT-69-003",
    title: "SCORM Package: Phishing Simulation Interactive Lab",
    courseTitle: "PDPA & Information Security Compliance 2569",
    fileType: "SCORM",
    fileSize: "28.4 MB",
    downloads: 398,
    uploadedBy: "ทีม HRD Digital Learning",
    updatedAt: "14 พ.ย. 2569",
    active: true,
  },
  {
    id: "MAT-04",
    code: "MAT-69-004",
    title: "สไลด์ประกอบการสอน: Coaching & GROW Model Canvas",
    courseTitle: "Situational Leadership & Coaching Conversations",
    fileType: "PPTX",
    fileSize: "11.2 MB",
    downloads: 74,
    uploadedBy: "อ.นภาพร วัฒนสินธ์",
    updatedAt: "10 พ.ย. 2569",
    active: true,
  },
  {
    id: "MAT-05",
    code: "MAT-69-005",
    title: "ชุดไฟล์ตัวอย่าง Power BI Dataset & KPI Templates",
    courseTitle: "Power BI & Business Dashboard Storytelling",
    fileType: "PDF",
    fileSize: "6.5 MB",
    downloads: 115,
    uploadedBy: "ดร.ภาณุพงศ์ รัตนชัย",
    updatedAt: "8 พ.ย. 2569",
    active: true,
  },
  {
    id: "MAT-06",
    code: "MAT-69-006",
    title: "คู่มือการสื่อสารข้ามแผนกและแบบฝึกหัด Role-play",
    courseTitle: "Effective Cross-Functional Communication",
    fileType: "PDF",
    fileSize: "3.2 MB",
    downloads: 94,
    uploadedBy: "อ.ปิยะวัฒน์ เกียรติสกุล",
    updatedAt: "2 พ.ย. 2569",
    active: false,
  },
];
