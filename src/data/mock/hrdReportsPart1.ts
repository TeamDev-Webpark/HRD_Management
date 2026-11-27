export interface PerformanceReportRow {
  id: string;
  deptCode: string;
  department: string;
  cycle: string;
  headcount: number;
  evaluatedCount: number;
  avgScore: number;
  gradeA: number;
  gradeB: number;
  gradeC: number;
  pipCount: number;
}

export interface TrainingSummaryReportRow {
  id: string;
  courseCode: string;
  courseName: string;
  category: "Leadership" | "Technical" | "Digital & AI" | "Soft Skills";
  sessionsCount: number;
  enrolled: number;
  completed: number;
  passRate: number;
  avgSatisfaction: number;
}

export type HoursComplianceStatus = "met" | "in-progress" | "behind";

export interface TrainingHistoryReportRow {
  id: string;
  employeeCode: string;
  employeeName: string;
  position: string;
  department: string;
  totalCourses: number;
  totalHours: number;
  targetHours: number;
  lastCourse: string;
  lastAttendedDate: string;
  status: HoursComplianceStatus;
}

export interface TrainingBudgetReportRow {
  id: string;
  deptCode: string;
  department: string;
  headcount: number;
  allocated: number;
  spent: number;
  reserved: number; // จองงบไว้รอจัดอบรม
}

export const PERF_REPORT_ROWS: PerformanceReportRow[] = [
  {
    id: "PR-01",
    deptCode: "DEPT-ENG",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    cycle: "ประเมินผลปี 2569",
    headcount: 118,
    evaluatedCount: 116,
    avgScore: 4.24,
    gradeA: 28,
    gradeB: 72,
    gradeC: 14,
    pipCount: 2,
  },
  {
    id: "PR-02",
    deptCode: "DEPT-HR",
    department: "ฝ่ายทรัพยากรบุคคลและพัฒนาองค์กร",
    cycle: "ประเมินผลปี 2569",
    headcount: 34,
    evaluatedCount: 34,
    avgScore: 4.38,
    gradeA: 10,
    gradeB: 22,
    gradeC: 2,
    pipCount: 0,
  },
  {
    id: "PR-03",
    deptCode: "DEPT-COM",
    department: "ฝ่ายขายและการตลาด",
    cycle: "ประเมินผลปี 2569",
    headcount: 96,
    evaluatedCount: 91,
    avgScore: 4.05,
    gradeA: 20,
    gradeB: 54,
    gradeC: 14,
    pipCount: 3,
  },
  {
    id: "PR-04",
    deptCode: "DEPT-OPS",
    department: "ฝ่ายปฏิบัติการและบริการ",
    cycle: "ประเมินผลปี 2569",
    headcount: 142,
    evaluatedCount: 135,
    avgScore: 3.92,
    gradeA: 18,
    gradeB: 84,
    gradeC: 29,
    pipCount: 4,
  },
  {
    id: "PR-05",
    deptCode: "DEPT-DATA",
    department: "ฝ่ายวิศวกรรมข้อมูลและกลยุทธ์",
    cycle: "ประเมินผลปี 2569",
    headcount: 28,
    evaluatedCount: 28,
    avgScore: 4.31,
    gradeA: 9,
    gradeB: 16,
    gradeC: 3,
    pipCount: 0,
  },
];

export const TRAINING_REPORT_ROWS: TrainingSummaryReportRow[] = [
  {
    id: "TR-01",
    courseCode: "CRS-LD-01",
    courseName: "Leadership for New Managers & Coaching",
    category: "Leadership",
    sessionsCount: 4,
    enrolled: 84,
    completed: 80,
    passRate: 95,
    avgSatisfaction: 4.8,
  },
  {
    id: "TR-02",
    courseCode: "CRS-AI-02",
    courseName: "Practical Generative AI & Data Analytics",
    category: "Digital & AI",
    sessionsCount: 6,
    enrolled: 165,
    completed: 152,
    passRate: 92,
    avgSatisfaction: 4.9,
  },
  {
    id: "TR-03",
    courseCode: "CRS-TC-03",
    courseName: "Cloud Security & Microservices Architecture",
    category: "Technical",
    sessionsCount: 3,
    enrolled: 58,
    completed: 51,
    passRate: 88,
    avgSatisfaction: 4.6,
  },
  {
    id: "TR-04",
    courseCode: "CRS-SS-04",
    courseName: "Cross-Functional Communication & Negotiation",
    category: "Soft Skills",
    sessionsCount: 5,
    enrolled: 120,
    completed: 114,
    passRate: 95,
    avgSatisfaction: 4.7,
  },
  {
    id: "TR-05",
    courseCode: "CRS-LD-05",
    courseName: "Strategic Decision Making for Supervisors",
    category: "Leadership",
    sessionsCount: 2,
    enrolled: 46,
    completed: 42,
    passRate: 91,
    avgSatisfaction: 4.5,
  },
];

export const TRAINING_HISTORY_ROWS: TrainingHistoryReportRow[] = [
  {
    id: "TH-01",
    employeeCode: "EMP-1024",
    employeeName: "ณัฐพล เจริญสุข",
    position: "Senior Software Engineer",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    totalCourses: 5,
    totalHours: 36,
    targetHours: 30,
    lastCourse: "Cloud Security & Microservices Architecture",
    lastAttendedDate: "18 พ.ย. 2569",
    status: "met",
  },
  {
    id: "TH-02",
    employeeCode: "EMP-1045",
    employeeName: "ปวีณา เลิศศิริ",
    position: "HR Business Partner",
    department: "ฝ่ายทรัพยากรบุคคล",
    totalCourses: 6,
    totalHours: 42,
    targetHours: 30,
    lastCourse: "Practical Generative AI & Data Analytics",
    lastAttendedDate: "15 พ.ย. 2569",
    status: "met",
  },
  {
    id: "TH-03",
    employeeCode: "EMP-1088",
    employeeName: "ศิริพร รัตนวงศ์",
    position: "Key Account Manager",
    department: "ฝ่ายขายและการตลาด",
    totalCourses: 3,
    totalHours: 24,
    targetHours: 30,
    lastCourse: "Cross-Functional Communication & Negotiation",
    lastAttendedDate: "10 พ.ย. 2569",
    status: "in-progress",
  },
  {
    id: "TH-04",
    employeeCode: "EMP-1071",
    employeeName: "อรรถพล แสงทอง",
    position: "Operations Supervisor",
    department: "ฝ่ายปฏิบัติการและบริการ",
    totalCourses: 2,
    totalHours: 14,
    targetHours: 30,
    lastCourse: "Leadership for New Managers & Coaching",
    lastAttendedDate: "02 พ.ย. 2569",
    status: "behind",
  },
  {
    id: "TH-05",
    employeeCode: "EMP-1052",
    employeeName: "ภูมิพัฒน์ อินทรักษา",
    position: "Tech Lead",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    totalCourses: 4,
    totalHours: 32,
    targetHours: 30,
    lastCourse: "Strategic Decision Making for Supervisors",
    lastAttendedDate: "12 พ.ย. 2569",
    status: "met",
  },
];

export const TRAINING_BUDGET_ROWS: TrainingBudgetReportRow[] = [
  {
    id: "TB-01",
    deptCode: "DEPT-ENG",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    headcount: 118,
    allocated: 1200000,
    spent: 840000,
    reserved: 180000,
  },
  {
    id: "TB-02",
    deptCode: "DEPT-HR",
    department: "ฝ่ายทรัพยากรบุคคลและพัฒนาองค์กร",
    headcount: 34,
    allocated: 450000,
    spent: 340000,
    reserved: 60000,
  },
  {
    id: "TB-03",
    deptCode: "DEPT-COM",
    department: "ฝ่ายขายและการตลาด",
    headcount: 96,
    allocated: 850000,
    spent: 560000,
    reserved: 150000,
  },
  {
    id: "TB-04",
    deptCode: "DEPT-OPS",
    department: "ฝ่ายปฏิบัติการและบริการ",
    headcount: 142,
    allocated: 780000,
    spent: 490000,
    reserved: 110000,
  },
  {
    id: "TB-05",
    deptCode: "DEPT-DATA",
    department: "ฝ่ายวิศวกรรมข้อมูลและกลยุทธ์",
    headcount: 28,
    allocated: 520000,
    spent: 410000,
    reserved: 75000,
  },
];

export function downloadCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const escape = (val: string | number) => `"${String(val).replace(/"/g, '""')}"`;
  const csvBody = [
    headers.map(escape).join(","),
    ...rows.map((r) => r.map(escape).join(",")),
  ].join("\r\n");
  const blob = new Blob(["\uFEFF" + csvBody], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
