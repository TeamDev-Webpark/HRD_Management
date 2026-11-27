export interface MssTeamMember {
  id: string;
  employeeCode: string;
  name: string;
  position: string;
  jobGrade: string;
  kpiProgress: number;
  selfScore: number;
  managerScore: number | null;
  skillReadiness: number;
  idpProgress: number;
  idpStatus: "pending" | "approved" | "completed";
  lmsProgress: number;
  trainingHours: number;
  talentNominated: boolean;
}

export interface MssTrainingApprovalItem {
  id: string;
  code: string;
  employeeCode: string;
  employeeName: string;
  courseName: string;
  dateRange: string;
  cost: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
}

export const MSS_MANAGER_PROFILE = {
  name: "ธนกร ศิริสวัสดิ์",
  position: "Engineering Team Lead",
  department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
  teamName: "Core Platform Engineering",
};

export const INITIAL_MSS_TEAM: MssTeamMember[] = [
  {
    id: "TM-01",
    employeeCode: "EMP-1024",
    name: "ณัฐพล เจริญสุข",
    position: "Senior Software Engineer",
    jobGrade: "JG-06",
    kpiProgress: 88,
    selfScore: 4.6,
    managerScore: 4.5,
    skillReadiness: 92,
    idpProgress: 80,
    idpStatus: "approved",
    lmsProgress: 85,
    trainingHours: 24,
    talentNominated: true,
  },
  {
    id: "TM-02",
    employeeCode: "EMP-1052",
    name: "ภูมิพัฒน์ อินทรักษา",
    position: "Tech Lead",
    jobGrade: "JG-07",
    kpiProgress: 92,
    selfScore: 4.7,
    managerScore: null,
    skillReadiness: 88,
    idpProgress: 35,
    idpStatus: "pending",
    lmsProgress: 100,
    trainingHours: 32,
    talentNominated: true,
  },
  {
    id: "TM-03",
    employeeCode: "EMP-1104",
    name: "กิตติพงศ์ วัฒนชัย",
    position: "Backend Developer",
    jobGrade: "JG-05",
    kpiProgress: 74,
    selfScore: 4.0,
    managerScore: null,
    skillReadiness: 75,
    idpProgress: 50,
    idpStatus: "pending",
    lmsProgress: 60,
    trainingHours: 18,
    talentNominated: false,
  },
  {
    id: "TM-04",
    employeeCode: "EMP-1119",
    name: "นภัสสร พงษ์เจริญ",
    position: "Frontend Developer",
    jobGrade: "JG-05",
    kpiProgress: 85,
    selfScore: 4.3,
    managerScore: 4.4,
    skillReadiness: 85,
    idpProgress: 100,
    idpStatus: "completed",
    lmsProgress: 95,
    trainingHours: 30,
    talentNominated: false,
  },
];

export const INITIAL_MSS_APPROVALS: MssTrainingApprovalItem[] = [
  {
    id: "APR-01",
    code: "REQ-TRN-01",
    employeeCode: "EMP-1024",
    employeeName: "ณัฐพล เจริญสุข",
    courseName: "Leadership for New Managers & Coaching (รุ่นที่ 3)",
    dateRange: "10–11 ธ.ค. 2569",
    cost: 12000,
    reason: "ปิด Gap ทักษะ Leadership ตามแผน IDP เตรียมขึ้น Tech Lead",
    status: "pending",
  },
  {
    id: "APR-02",
    code: "REQ-TRN-02",
    employeeCode: "EMP-1104",
    employeeName: "กิตติพงศ์ วัฒนชัย",
    courseName: "Cloud Security & Microservices Architecture",
    dateRange: "18–19 ธ.ค. 2569",
    cost: 15000,
    reason: "เพิ่มทักษะความปลอดภัยระบบ Backend สำหรับโปรเจกต์ Q1/2570",
    status: "pending",
  },
  {
    id: "APR-03",
    code: "REQ-TRN-03",
    employeeCode: "EMP-1119",
    employeeName: "นภัสสร พงษ์เจริญ",
    courseName: "Practical Generative AI for Engineering Teams",
    dateRange: "16 ธ.ค. 2569",
    cost: 8500,
    reason: "ประยุกต์ใช้ AI ช่วยเพิ่มความเร็วในการพัฒนา Frontend",
    status: "approved",
  },
];
