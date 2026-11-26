export type SessionStatus = "open" | "ongoing" | "completed" | "cancelled";

export interface TrainingSessionItem {
  id: string;
  code: string;
  courseTitle: string;
  batchName: string;
  trainerName: string;
  dateRange: string;
  timeRange: string;
  location: string;
  deliveryMode: "Onsite" | "Online" | "Hybrid";
  enrolled: number;
  capacity: number;
  status: SessionStatus;
}

export type EnrollmentStatus = "pending" | "approved" | "rejected";

export interface EnrollmentItem {
  id: string;
  code: string;
  employeeCode: string;
  employeeName: string;
  department: string;
  position: string;
  sessionCode: string;
  courseTitle: string;
  sessionDate: string;
  requestDate: string;
  approverName: string;
  status: EnrollmentStatus;
}

export type AttendanceStatus = "present" | "late" | "absent";

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  employeeCode: string;
  employeeName: string;
  department: string;
  position: string;
  checkInTime: string;
  status: AttendanceStatus;
  note: string;
}

export type TrainingResultStatus = "passed" | "failed" | "in-review";

export interface TrainingResultItem {
  id: string;
  code: string;
  employeeCode: string;
  employeeName: string;
  department: string;
  courseTitle: string;
  sessionCode: string;
  completedDate: string;
  trainingHours: number;
  preTestScore: number;
  postTestScore: number;
  satisfaction: number;
  certificateIssued: boolean;
  status: TrainingResultStatus;
}

export const INITIAL_TRAINING_SESSIONS: TrainingSessionItem[] = [
  {
    id: "SES-01",
    code: "SES-2569-01",
    courseTitle: "Generative AI & Prompt Engineering for Work",
    batchName: "รุ่นที่ 1 / 2569",
    trainerName: "ดร.ภาณุพงศ์ รัตนชัย",
    dateRange: "28–29 พ.ย. 2569",
    timeRange: "09:00 – 16:00 น.",
    location: "ห้องประชุม Auditorium ชั้น 12",
    deliveryMode: "Hybrid",
    enrolled: 28,
    capacity: 30,
    status: "open",
  },
  {
    id: "SES-02",
    code: "SES-2569-02",
    courseTitle: "Leadership & Coaching for First-Time Managers",
    batchName: "รุ่นที่ 2 / 2569",
    trainerName: "อ.นภาพร วัฒนสินธ์",
    dateRange: "26–27 พ.ย. 2569",
    timeRange: "09:00 – 16:30 น.",
    location: "ห้องอบรม Executive Room 4A",
    deliveryMode: "Onsite",
    enrolled: 25,
    capacity: 25,
    status: "ongoing",
  },
  {
    id: "SES-03",
    code: "SES-2569-03",
    courseTitle: "Cloud Security & Zero Trust Architecture",
    batchName: "รุ่นที่ 1 / 2569",
    trainerName: "คุณวรเมธ ศรีสวัสดิ์",
    dateRange: "4–5 ธ.ค. 2569",
    timeRange: "09:30 – 16:30 น.",
    location: "Microsoft Teams (Live Online)",
    deliveryMode: "Online",
    enrolled: 18,
    capacity: 25,
    status: "open",
  },
  {
    id: "SES-04",
    code: "SES-2569-04",
    courseTitle: "Consultative Selling & Key Account Management",
    batchName: "รุ่นที่ 1 / 2569",
    trainerName: "อ.ปิยะวัฒน์ เกียรติสกุล",
    dateRange: "12–13 พ.ย. 2569",
    timeRange: "09:00 – 16:00 น.",
    location: "ห้องอบรม Innovation Hall ชั้น 8",
    deliveryMode: "Onsite",
    enrolled: 30,
    capacity: 30,
    status: "completed",
  },
  {
    id: "SES-05",
    code: "SES-2569-05",
    courseTitle: "PDPA & Cybersecurity Awareness 2569",
    batchName: "รุ่นที่ 3 / 2569",
    trainerName: "คุณวรเมธ ศรีสวัสดิ์",
    dateRange: "18 พ.ย. 2569",
    timeRange: "13:00 – 16:00 น.",
    location: "Microsoft Teams (Live Online)",
    deliveryMode: "Online",
    enrolled: 45,
    capacity: 50,
    status: "completed",
  },
  {
    id: "SES-06",
    code: "SES-2569-06",
    courseTitle: "HR Analytics & Workforce Planning",
    batchName: "รุ่นที่ 1 / 2569",
    trainerName: "สถาบันพัฒนาผู้นำและองค์กร (TLD)",
    dateRange: "15–16 ธ.ค. 2569",
    timeRange: "09:00 – 16:00 น.",
    location: "โรงแรมสยาม แกรนด์ (ห้องบอลรูม B)",
    deliveryMode: "Onsite",
    enrolled: 12,
    capacity: 20,
    status: "open",
  },
];

export const INITIAL_ENROLLMENTS: EnrollmentItem[] = [
  {
    id: "ENR-01",
    code: "ENR-69-0101",
    employeeCode: "EMP-1024",
    employeeName: "ณัฐพล เจริญสุข",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    position: "Senior Software Engineer",
    sessionCode: "SES-2569-01",
    courseTitle: "Generative AI & Prompt Engineering for Work",
    sessionDate: "28–29 พ.ย. 2569",
    requestDate: "25 พ.ย. 2569",
    approverName: "ธนกร พิพัฒน์กุล",
    status: "pending",
  },
  {
    id: "ENR-02",
    code: "ENR-69-0102",
    employeeCode: "EMP-1088",
    employeeName: "ศิริพร รัตนวงศ์",
    department: "ฝ่ายขายและการตลาด",
    position: "Key Account Manager",
    sessionCode: "SES-2569-01",
    courseTitle: "Generative AI & Prompt Engineering for Work",
    sessionDate: "28–29 พ.ย. 2569",
    requestDate: "25 พ.ย. 2569",
    approverName: "วราภรณ์ สุขสวัสดิ์",
    status: "pending",
  },
  {
    id: "ENR-03",
    code: "ENR-69-0103",
    employeeCode: "EMP-1102",
    employeeName: "กิตติศักดิ์ วงศ์สุวรรณ",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    position: "DevOps Engineer",
    sessionCode: "SES-2569-03",
    courseTitle: "Cloud Security & Zero Trust Architecture",
    sessionDate: "4–5 ธ.ค. 2569",
    requestDate: "24 พ.ย. 2569",
    approverName: "ธนกร พิพัฒน์กุล",
    status: "pending",
  },
  {
    id: "ENR-04",
    code: "ENR-69-0104",
    employeeCode: "EMP-1045",
    employeeName: "ปวีณา เลิศศิริ",
    department: "ฝ่ายทรัพยากรบุคคล",
    position: "HR Business Partner",
    sessionCode: "SES-2569-06",
    courseTitle: "HR Analytics & Workforce Planning",
    sessionDate: "15–16 ธ.ค. 2569",
    requestDate: "22 พ.ย. 2569",
    approverName: "พิมพ์ชนก วัฒนากูล",
    status: "approved",
  },
  {
    id: "ENR-05",
    code: "ENR-69-0105",
    employeeCode: "EMP-1071",
    employeeName: "อรรถพล แสงทอง",
    department: "ฝ่ายปฏิบัติการและบริการ",
    position: "Operations Supervisor",
    sessionCode: "SES-2569-02",
    courseTitle: "Leadership & Coaching for First-Time Managers",
    sessionDate: "26–27 พ.ย. 2569",
    requestDate: "19 พ.ย. 2569",
    approverName: "สุรชัย มั่นคง",
    status: "approved",
  },
  {
    id: "ENR-06",
    code: "ENR-69-0106",
    employeeCode: "EMP-1119",
    employeeName: "ชญานิศ บุญมี",
    department: "ฝ่ายบัญชีและการเงิน",
    position: "Financial Analyst",
    sessionCode: "SES-2569-03",
    courseTitle: "Cloud Security & Zero Trust Architecture",
    sessionDate: "4–5 ธ.ค. 2569",
    requestDate: "20 พ.ย. 2569",
    approverName: "ประเสริฐ กิจเจริญ",
    status: "rejected",
  },
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: "ATT-01",
    sessionId: "SES-02",
    employeeCode: "EMP-1071",
    employeeName: "อรรถพล แสงทอง",
    department: "ฝ่ายปฏิบัติการและบริการ",
    position: "Operations Supervisor",
    checkInTime: "08:48 น.",
    status: "present",
    note: "เข้าอบรมตรงเวลา",
  },
  {
    id: "ATT-02",
    sessionId: "SES-02",
    employeeCode: "EMP-1033",
    employeeName: "มนัสนันท์ พงษ์ไพศาล",
    department: "ฝ่ายขายและการตลาด",
    position: "Team Lead — Digital Sales",
    checkInTime: "08:55 น.",
    status: "present",
    note: "เข้าอบรมตรงเวลา",
  },
  {
    id: "ATT-03",
    sessionId: "SES-02",
    employeeCode: "EMP-1052",
    employeeName: "ภูมิพัฒน์ อินทรักษา",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    position: "Tech Lead",
    checkInTime: "09:18 น.",
    status: "late",
    note: "ติดประชุมด่วนช่วงเช้า แจ้งล่วงหน้าแล้ว",
  },
  {
    id: "ATT-04",
    sessionId: "SES-02",
    employeeCode: "EMP-1094",
    employeeName: "กัญญารัตน์ ศิริโชค",
    department: "ฝ่ายบัญชีและการเงิน",
    position: "Accounting Supervisor",
    checkInTime: "08:52 น.",
    status: "present",
    note: "เข้าอบรมตรงเวลา",
  },
  {
    id: "ATT-05",
    sessionId: "SES-02",
    employeeCode: "EMP-1110",
    employeeName: "วุฒิชัย ธรรมรักษ์",
    department: "ฝ่ายปฏิบัติการและบริการ",
    position: "Site Coordinator",
    checkInTime: "—",
    status: "absent",
    note: "ลาป่วย (มีใบรับรองแพทย์)",
  },
  {
    id: "ATT-06",
    sessionId: "SES-01",
    employeeCode: "EMP-1024",
    employeeName: "ณัฐพล เจริญสุข",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    position: "Senior Software Engineer",
    checkInTime: "08:50 น.",
    status: "present",
    note: "ลงทะเบียนหน้างานเรียบร้อย",
  },
  {
    id: "ATT-07",
    sessionId: "SES-01",
    employeeCode: "EMP-1088",
    employeeName: "ศิริพร รัตนวงศ์",
    department: "ฝ่ายขายและการตลาด",
    position: "Key Account Manager",
    checkInTime: "08:57 น.",
    status: "present",
    note: "ลงทะเบียนหน้างานเรียบร้อย",
  },
  {
    id: "ATT-08",
    sessionId: "SES-01",
    employeeCode: "EMP-1045",
    employeeName: "ปวีณา เลิศศิริ",
    department: "ฝ่ายทรัพยากรบุคคล",
    position: "HR Business Partner",
    checkInTime: "09:12 น.",
    status: "late",
    note: "เข้าร่วมผ่าน Hybrid Online",
  },
];

export const INITIAL_TRAINING_RESULTS: TrainingResultItem[] = [
  {
    id: "RES-01",
    code: "HIS-69-0201",
    employeeCode: "EMP-1088",
    employeeName: "ศิริพร รัตนวงศ์",
    department: "ฝ่ายขายและการตลาด",
    courseTitle: "Consultative Selling & Key Account Management",
    sessionCode: "SES-2569-04",
    completedDate: "13 พ.ย. 2569",
    trainingHours: 12,
    preTestScore: 68,
    postTestScore: 92,
    satisfaction: 4.9,
    certificateIssued: true,
    status: "passed",
  },
  {
    id: "RES-02",
    code: "HIS-69-0202",
    employeeCode: "EMP-1024",
    employeeName: "ณัฐพล เจริญสุข",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    courseTitle: "PDPA & Cybersecurity Awareness 2569",
    sessionCode: "SES-2569-05",
    completedDate: "18 พ.ย. 2569",
    trainingHours: 3,
    preTestScore: 75,
    postTestScore: 96,
    satisfaction: 4.8,
    certificateIssued: true,
    status: "passed",
  },
  {
    id: "RES-03",
    code: "HIS-69-0203",
    employeeCode: "EMP-1033",
    employeeName: "มนัสนันท์ พงษ์ไพศาล",
    department: "ฝ่ายขายและการตลาด",
    courseTitle: "Consultative Selling & Key Account Management",
    sessionCode: "SES-2569-04",
    completedDate: "13 พ.ย. 2569",
    trainingHours: 12,
    preTestScore: 62,
    postTestScore: 86,
    satisfaction: 4.7,
    certificateIssued: true,
    status: "passed",
  },
  {
    id: "RES-04",
    code: "HIS-69-0204",
    employeeCode: "EMP-1071",
    employeeName: "อรรถพล แสงทอง",
    department: "ฝ่ายปฏิบัติการและบริการ",
    courseTitle: "PDPA & Cybersecurity Awareness 2569",
    sessionCode: "SES-2569-05",
    completedDate: "18 พ.ย. 2569",
    trainingHours: 3,
    preTestScore: 55,
    postTestScore: 72,
    satisfaction: 4.6,
    certificateIssued: false,
    status: "failed",
  },
  {
    id: "RES-05",
    code: "HIS-69-0205",
    employeeCode: "EMP-1045",
    employeeName: "ปวีณา เลิศศิริ",
    department: "ฝ่ายทรัพยากรบุคคล",
    courseTitle: "PDPA & Cybersecurity Awareness 2569",
    sessionCode: "SES-2569-05",
    completedDate: "18 พ.ย. 2569",
    trainingHours: 3,
    preTestScore: 70,
    postTestScore: 88,
    satisfaction: 4.9,
    certificateIssued: true,
    status: "passed",
  },
  {
    id: "RES-06",
    code: "HIS-69-0206",
    employeeCode: "EMP-1052",
    employeeName: "ภูมิพัฒน์ อินทรักษา",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    courseTitle: "Leadership & Coaching for First-Time Managers",
    sessionCode: "SES-2569-02",
    completedDate: "รอสรุปผล",
    trainingHours: 12,
    preTestScore: 72,
    postTestScore: 0,
    satisfaction: 0,
    certificateIssued: false,
    status: "in-review",
  },
];
