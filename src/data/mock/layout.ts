import type { DemoUser, NotificationItem, RoleKey, SidebarMenuItem } from "@/types/hrd";

/**
 * Incremental Sidebar Menu:
 * แสดงเฉพาะเมนูที่พัฒนาเสร็จแล้วเท่านั้น และจะค่อยๆ เพิ่มโมดูลใหม่ทีละ Step
 */
export const ACTIVE_SIDEBAR_MENUS: SidebarMenuItem[] = [
  {
    id: "hrd-dashboard",
    moduleCode: "01",
    label: "แดชบอร์ด HRD",
    labelEn: "HRD Dashboard",
    href: "/dashboard",
    icon: "dashboard",
  },
  {
    id: "hrd-training",
    moduleCode: "03",
    label: "การจัดการฝึกอบรม",
    labelEn: "Training Management",
    href: "/training",
    icon: "training",
    children: [
      { id: "trn-needs", label: "สำรวจความต้องการอบรม", href: "/training?tab=needs", tabKey: "needs", group: "วางแผนและหลักสูตร" },
      { id: "trn-catalog", label: "คลังหลักสูตร", href: "/training?tab=catalog", tabKey: "catalog", group: "วางแผนและหลักสูตร" },
      { id: "trn-annual", label: "แผนฝึกอบรมประจำปี", href: "/training?tab=annual-plan", tabKey: "annual-plan", group: "วางแผนและหลักสูตร" },
      { id: "trn-budget", label: "งบประมาณฝึกอบรม", href: "/training?tab=budget", tabKey: "budget", group: "งบประมาณและวิทยากร" },
      { id: "trn-trainers", label: "วิทยากรและสถาบัน", href: "/training?tab=trainers", tabKey: "trainers", group: "งบประมาณและวิทยากร" },
      { id: "trn-sessions", label: "รุ่นฝึกอบรม", href: "/training?tab=sessions", tabKey: "sessions", group: "ดำเนินการและสรุปผล" },
      { id: "trn-enrollments", label: "ลงทะเบียนและอนุมัติ", href: "/training?tab=enrollments", tabKey: "enrollments", group: "ดำเนินการและสรุปผล" },
      { id: "trn-attendance", label: "เช็คชื่อเข้าอบรม", href: "/training?tab=attendance", tabKey: "attendance", group: "ดำเนินการและสรุปผล" },
      { id: "trn-results", label: "ผลการอบรมและประวัติ", href: "/training?tab=results", tabKey: "results", group: "ดำเนินการและสรุปผล" },
    ],
  },
  {
    id: "hrd-lms",
    moduleCode: "04",
    label: "ระบบเรียนรู้ออนไลน์",
    labelEn: "LMS",
    href: "/lms",
    icon: "lms",
    children: [
      { id: "lms-courses", label: "คอร์สเรียนออนไลน์", href: "/lms?tab=courses", tabKey: "courses" },
      { id: "lms-lessons", label: "จัดการบทเรียน", href: "/lms?tab=lessons", tabKey: "lessons" },
      { id: "lms-materials", label: "สื่อการเรียนรู้", href: "/lms?tab=materials", tabKey: "materials" },
    ],
  },
  {
    id: "hrd-settings",
    moduleCode: "10",
    label: "ตั้งค่าระบบ HRD",
    labelEn: "HRD Settings",
    href: "/settings",
    icon: "settings",
  },
  {
    id: "ui-kit",
    label: "UI Kit & Design System",
    labelEn: "Component Preview",
    href: "/ui-kit",
    icon: "palette",
  },
];

export const DEMO_USERS: Record<RoleKey, DemoUser> = {
  admin: {
    id: "USR-001",
    employeeCode: "EMP-00102",
    name: "พิมพ์ชนก วัฒนากูล",
    email: "pimchanok.w@company.co.th",
    initials: "พว",
    role: "admin",
    roleLabel: "Admin (ผู้ดูแลระบบ HRD)",
    company: "บริษัท เอนเตอร์ไพรส์ เทค จำกัด (มหาชน)",
    branch: "สำนักงานใหญ่ (กรุงเทพฯ)",
    department: "ฝ่ายพัฒนาทรัพยากรบุคคล (HRD)",
    position: "HRD Manager",
    jobGrade: "JG-08",
  },
  manager: {
    id: "USR-002",
    employeeCode: "EMP-00215",
    name: "ธนกร ศิริสวัสดิ์",
    email: "thanakorn.s@company.co.th",
    initials: "ธศ",
    role: "manager",
    roleLabel: "Manager (หัวหน้างาน)",
    company: "บริษัท เอนเตอร์ไพรส์ เทค จำกัด (มหาชน)",
    branch: "สำนักงานใหญ่ (กรุงเทพฯ)",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    position: "Engineering Team Lead",
    jobGrade: "JG-07",
  },
  employee: {
    id: "USR-003",
    employeeCode: "EMP-00489",
    name: "ณัฐพล เจริญสุข",
    email: "nattapol.c@company.co.th",
    initials: "ณจ",
    role: "employee",
    roleLabel: "Employee (พนักงาน)",
    company: "บริษัท เอนเตอร์ไพรส์ เทค จำกัด (มหาชน)",
    branch: "สำนักงานใหญ่ (กรุงเทพฯ)",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    position: "Senior Frontend Developer",
    jobGrade: "JG-05",
  },
};

export const ROLE_OPTIONS: { key: RoleKey; label: string; shortLabel: string }[] = [
  { key: "admin", label: "Admin", shortLabel: "ผู้ดูแลระบบ" },
  { key: "manager", label: "Manager", shortLabel: "หัวหน้างาน" },
  { key: "employee", label: "Employee", shortLabel: "พนักงาน" },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "NOTI-001",
    title: "คำขอลงทะเบียนอบรมรออนุมัติ (3 รายการ)",
    message: "หลักสูตร Leadership for New Managers รุ่นที่ 2/2569 มีผู้สมัครรอการพิจารณา",
    timestamp: "10 นาทีที่แล้ว",
    category: "approval",
    read: false,
  },
  {
    id: "NOTI-002",
    title: "รอบการประเมินผลงาน Mid-Year 2026",
    message: "พนักงานส่ง Progress Check-in แล้ว 82% ครบกำหนดภายในวันที่ 15 มิ.ย.",
    timestamp: "1 ชั่วโมงที่แล้ว",
    category: "performance",
    read: false,
  },
  {
    id: "NOTI-003",
    title: "แจ้งเตือนรอบอบรมที่กำลังจะมาถึง",
    message: "Data Analytics for HR Professionals จะเริ่มอบรมในวันพุธ เวลา 09:00 น.",
    timestamp: "เมื่อวานนี้",
    category: "training",
    read: true,
  },
  {
    id: "NOTI-004",
    title: "ซิงค์ข้อมูลพนักงานจาก HRM สำเร็จ",
    message: "อัปเดตทะเบียนพนักงาน 482 คน และ 12 แผนกเรียบร้อยแล้ว (Mock Sync)",
    timestamp: "2 วันที่แล้ว",
    category: "system",
    read: true,
  },
];
