export type GoalFramework = "KPI" | "OKR" | "MBO";
export type GoalStatus = "on-track" | "at-risk" | "achieved" | "pending";

export interface GoalItem {
  id: string;
  code: string;
  title: string;
  framework: GoalFramework;
  ownerName: string;
  employeeCode: string;
  department: string;
  weight: number;
  targetLabel: string;
  actualLabel: string;
  progressPct: number;
  dueDate: string;
  status: GoalStatus;
}

export type ConfidenceLevel = "high" | "medium" | "low";
export type CheckinStatus = "waiting-manager" | "reviewed";

export interface ProgressCheckinItem {
  id: string;
  code: string;
  employeeCode: string;
  employeeName: string;
  department: string;
  managerName: string;
  periodLabel: string;
  submittedDate: string;
  overallProgress: number;
  confidence: ConfidenceLevel;
  employeeUpdate: string;
  managerFeedback: string;
  status: CheckinStatus;
}

export const INITIAL_GOALS: GoalItem[] = [
  {
    id: "GL-01",
    code: "OKR-69-01",
    title: "ลดระยะเวลาการอนุมัติคำขอฝึกอบรมและลงทะเบียนเฉลี่ยเหลือไม่เกิน 2 วันทำการ",
    framework: "OKR",
    ownerName: "พิมพ์ชนก วัฒนากูล",
    employeeCode: "EMP-00102",
    department: "ฝ่ายพัฒนาทรัพยากรบุคคล",
    weight: 30,
    targetLabel: "≤ 2 วันทำการ",
    actualLabel: "2.1 วันทำการ",
    progressPct: 92,
    dueDate: "31 ธ.ค. 2569",
    status: "on-track",
  },
  {
    id: "GL-02",
    code: "KPI-69-02",
    title: "เพิ่มอัตราการปิดการขายลูกค้าองค์กร (B2B Enterprise) เติบโต 25% เทียบปีก่อน",
    framework: "KPI",
    ownerName: "ศิริพร รัตนวงศ์",
    employeeCode: "EMP-1088",
    department: "ฝ่ายขายและการตลาด",
    weight: 40,
    targetLabel: "+25% YoY",
    actualLabel: "+27.4% YoY",
    progressPct: 100,
    dueDate: "31 ธ.ค. 2569",
    status: "achieved",
  },
  {
    id: "GL-03",
    code: "OKR-69-03",
    title: "ยกระดับความเสถียรของระบบ HR Core & API Uptime ให้ไม่ต่ำกว่า 99.9%",
    framework: "OKR",
    ownerName: "ณัฐพล เจริญสุข",
    employeeCode: "EMP-1024",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    weight: 35,
    targetLabel: "99.90% Uptime",
    actualLabel: "99.94% Uptime",
    progressPct: 100,
    dueDate: "31 ธ.ค. 2569",
    status: "achieved",
  },
  {
    id: "GL-04",
    code: "MBO-69-04",
    title: "จัดทำแผนลดต้นทุนการปฏิบัติงานคลังสินค้าและบริการลง 12% ภายในไตรมาส 4",
    framework: "MBO",
    ownerName: "อรรถพล แสงทอง",
    employeeCode: "EMP-1071",
    department: "ฝ่ายปฏิบัติการและบริการ",
    weight: 25,
    targetLabel: "ลดต้นทุน 12%",
    actualLabel: "ลดได้ 6.5%",
    progressPct: 54,
    dueDate: "31 ธ.ค. 2569",
    status: "at-risk",
  },
  {
    id: "GL-05",
    code: "KPI-69-05",
    title: "ผลักดันอัตราการเรียนจบหลักสูตรบังคับ PDPA & Security ให้ครบ 95% ทั้งองค์กร",
    framework: "KPI",
    ownerName: "ปวีณา เลิศศิริ",
    employeeCode: "EMP-1045",
    department: "ฝ่ายทรัพยากรบุคคล",
    weight: 20,
    targetLabel: "95% Completion",
    actualLabel: "93% Completion",
    progressPct: 96,
    dueDate: "15 ธ.ค. 2569",
    status: "on-track",
  },
  {
    id: "GL-06",
    code: "OKR-69-06",
    title: "สร้าง Automated Data Pipeline สำหรับแดชบอร์ดผู้บริหารลดงานทำรายงานมือ 60%",
    framework: "OKR",
    ownerName: "ภูมิพัฒน์ อินทรักษา",
    employeeCode: "EMP-1052",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    weight: 30,
    targetLabel: "ลดเวลาทำรายงาน 60%",
    actualLabel: "รอหัวหน้าอนุมัติเป้า",
    progressPct: 20,
    dueDate: "31 ธ.ค. 2569",
    status: "pending",
  },
];

export const INITIAL_CHECKINS: ProgressCheckinItem[] = [
  {
    id: "CHK-01",
    code: "CHK-69-Q4-01",
    employeeCode: "EMP-1071",
    employeeName: "อรรถพล แสงทอง",
    department: "ฝ่ายปฏิบัติการและบริการ",
    managerName: "สุรชัย มั่นคง",
    periodLabel: "Check-in ไตรมาส 4 / 2569",
    submittedDate: "26 พ.ย. 2569",
    overallProgress: 54,
    confidence: "low",
    employeeUpdate: "ต้นทุนค่าขนส่งปรับตัวสูงขึ้นช่วงปลายปี ทำให้แผนลดต้นทุน 12% ล่าช้ากว่าเป้าหมาย ต้องการปรึกษาเรื่องการรวมรอบจัดส่ง",
    managerFeedback: "",
    status: "waiting-manager",
  },
  {
    id: "CHK-02",
    code: "CHK-69-Q4-02",
    employeeCode: "EMP-1052",
    employeeName: "ภูมิพัฒน์ อินทรักษา",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    managerName: "ธนกร ศิริสวัสดิ์",
    periodLabel: "Check-in ไตรมาส 4 / 2569",
    submittedDate: "25 พ.ย. 2569",
    overallProgress: 72,
    confidence: "medium",
    employeeUpdate: "เชื่อมต่อข้อมูลจาก HRM สำเร็จแล้ว เหลือการปรับจูนแดชบอร์ดฝั่งฝ่ายขาย คาดว่าเสร็จทันกลางเดือน ธ.ค.",
    managerFeedback: "",
    status: "waiting-manager",
  },
  {
    id: "CHK-03",
    code: "CHK-69-Q4-03",
    employeeCode: "EMP-1024",
    employeeName: "ณัฐพล เจริญสุข",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    managerName: "ธนกร ศิริสวัสดิ์",
    periodLabel: "Check-in ไตรมาส 4 / 2569",
    submittedDate: "23 พ.ย. 2569",
    overallProgress: 96,
    confidence: "high",
    employeeUpdate: "ระบบ API Uptime อยู่ที่ 99.94% และลดเวลาโหลดหน้าจอลงได้ 35% พร้อมถ่ายทอดความรู้ให้ทีมรุ่นน้อง",
    managerFeedback: "ผลงานยอดเยี่ยมมาก แนะนำให้จัด Knowledge Sharing 1 ชม. ในทีมเพื่อสะสมคะแนน Competency Leadership",
    status: "reviewed",
  },
  {
    id: "CHK-04",
    code: "CHK-69-Q4-04",
    employeeCode: "EMP-1088",
    employeeName: "ศิริพร รัตนวงศ์",
    department: "ฝ่ายขายและการตลาด",
    managerName: "วราภรณ์ สุขสวัสดิ์",
    periodLabel: "Check-in ไตรมาส 4 / 2569",
    submittedDate: "21 พ.ย. 2569",
    overallProgress: 100,
    confidence: "high",
    employeeUpdate: "ปิดยอดขายลูกค้าองค์กรทะลุเป้า 27.4% แล้ว กำลังเตรียมแผนขยายบัญชีลูกค้าหลักสำหรับปี 2570",
    managerFeedback: "บรรลุเป้าก่อนกำหนดอย่างโดดเด่น เสนอชื่อเข้ากลุ่ม Talent Pool รอบปลายปีนี้",
    status: "reviewed",
  },
  {
    id: "CHK-05",
    code: "CHK-69-Q4-05",
    employeeCode: "EMP-1045",
    employeeName: "ปวีณา เลิศศิริ",
    department: "ฝ่ายทรัพยากรบุคคล",
    managerName: "พิมพ์ชนก วัฒนากูล",
    periodLabel: "Check-in ไตรมาส 4 / 2569",
    submittedDate: "20 พ.ย. 2569",
    overallProgress: 94,
    confidence: "high",
    employeeUpdate: "ติดตามคอร์สบังคับ PDPA ได้แล้ว 93% เหลือพนักงานกลุ่มหน้างานอีก 14 คนที่กำลังส่งแจ้งเตือนรอบสุดท้าย",
    managerFeedback: "ดำเนินงานได้รวดเร็วมาก ฝากประสานหัวหน้าฝ่ายปฏิบัติการช่วยจัดรอบเรียนกลุ่มเล็กเพิ่มเติม",
    status: "reviewed",
  },
];
