export type CriticalityLevel = "critical" | "high" | "medium";
export type VacancyRisk = "low" | "medium" | "high";
export type PositionCoverageStatus = "covered" | "at-risk" | "vacant";
export type ReadinessLevel = "ready-now" | "1-2-years" | "3-plus-years";
export type SuccessorStatus = "confirmed" | "nominated";
export type SuccessionPlanStatus = "active" | "completed" | "review-needed";

export interface KeyPositionItem {
  id: string;
  code: string;
  positionTitle: string;
  department: string;
  jobGrade: string;
  incumbentName: string;
  criticality: CriticalityLevel;
  vacancyRisk: VacancyRisk;
  successorsCount: number;
  status: PositionCoverageStatus;
}

export interface SuccessorItem {
  id: string;
  code: string;
  candidateCode: string;
  candidateName: string;
  currentPosition: string;
  department: string;
  targetKeyPosition: string;
  rank: 1 | 2;
  readiness: ReadinessLevel;
  readinessScore: number;
  status: SuccessorStatus;
}

export interface ReadinessAssessmentItem {
  id: string;
  code: string;
  candidateName: string;
  targetKeyPosition: string;
  department: string;
  leadershipScore: number; // 0-100
  experienceScore: number; // 0-100
  skillMatchScore: number; // 0-100
  readiness: ReadinessLevel;
  assessedDate: string;
}

export interface SuccessionPlanItem {
  id: string;
  code: string;
  keyPosition: string;
  department: string;
  primarySuccessor: string;
  backupSuccessor: string;
  keyMilestone: string;
  targetDate: string;
  progress: number;
  status: SuccessionPlanStatus;
}

export const INITIAL_KEY_POSITIONS: KeyPositionItem[] = [
  {
    id: "KP-01",
    code: "KEY-01",
    positionTitle: "Engineering Manager",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    jobGrade: "JG-08",
    incumbentName: "ธนกร ศิริสวัสดิ์",
    criticality: "critical",
    vacancyRisk: "medium",
    successorsCount: 2,
    status: "covered",
  },
  {
    id: "KP-02",
    code: "KEY-02",
    positionTitle: "HRD Manager",
    department: "ฝ่ายพัฒนาทรัพยากรบุคคล",
    jobGrade: "JG-08",
    incumbentName: "พิมพ์ชนก วัฒนากูล",
    criticality: "critical",
    vacancyRisk: "low",
    successorsCount: 2,
    status: "covered",
  },
  {
    id: "KP-03",
    code: "KEY-03",
    positionTitle: "Head of Enterprise Sales",
    department: "ฝ่ายขายและการตลาด",
    jobGrade: "JG-09",
    incumbentName: "วราภรณ์ สุขสวัสดิ์",
    criticality: "critical",
    vacancyRisk: "high",
    successorsCount: 1,
    status: "at-risk",
  },
  {
    id: "KP-04",
    code: "KEY-04",
    positionTitle: "Operations Manager",
    department: "ฝ่ายปฏิบัติการและบริการ",
    jobGrade: "JG-07",
    incumbentName: "สุรชัย มั่นคง",
    criticality: "high",
    vacancyRisk: "medium",
    successorsCount: 1,
    status: "at-risk",
  },
  {
    id: "KP-05",
    code: "KEY-05",
    positionTitle: "Principal System Architect",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    jobGrade: "JG-08",
    incumbentName: "ยังว่าง (รักษาการ)",
    criticality: "high",
    vacancyRisk: "high",
    successorsCount: 1,
    status: "vacant",
  },
];

export const INITIAL_SUCCESSORS: SuccessorItem[] = [
  {
    id: "SUC-01",
    code: "SUC-69-01",
    candidateCode: "EMP-1024",
    candidateName: "ณัฐพล เจริญสุข",
    currentPosition: "Senior Software Engineer",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    targetKeyPosition: "Engineering Manager",
    rank: 1,
    readiness: "ready-now",
    readinessScore: 92,
    status: "confirmed",
  },
  {
    id: "SUC-02",
    code: "SUC-69-02",
    candidateCode: "EMP-1045",
    candidateName: "ปวีณา เลิศศิริ",
    currentPosition: "HR Business Partner",
    department: "ฝ่ายทรัพยากรบุคคล",
    targetKeyPosition: "HRD Manager",
    rank: 1,
    readiness: "ready-now",
    readinessScore: 90,
    status: "confirmed",
  },
  {
    id: "SUC-03",
    code: "SUC-69-03",
    candidateCode: "EMP-1088",
    candidateName: "ศิริพร รัตนวงศ์",
    currentPosition: "Key Account Manager",
    department: "ฝ่ายขายและการตลาด",
    targetKeyPosition: "Head of Enterprise Sales",
    rank: 1,
    readiness: "1-2-years",
    readinessScore: 78,
    status: "confirmed",
  },
  {
    id: "SUC-04",
    code: "SUC-69-04",
    candidateCode: "EMP-1052",
    candidateName: "ภูมิพัฒน์ อินทรักษา",
    currentPosition: "Tech Lead",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    targetKeyPosition: "Principal System Architect",
    rank: 1,
    readiness: "1-2-years",
    readinessScore: 84,
    status: "nominated",
  },
  {
    id: "SUC-05",
    code: "SUC-69-05",
    candidateCode: "EMP-1071",
    candidateName: "อรรถพล แสงทอง",
    currentPosition: "Operations Supervisor",
    department: "ฝ่ายปฏิบัติการและบริการ",
    targetKeyPosition: "Operations Manager",
    rank: 2,
    readiness: "3-plus-years",
    readinessScore: 62,
    status: "nominated",
  },
];

export const INITIAL_READINESS_ASSESSMENTS: ReadinessAssessmentItem[] = [
  {
    id: "RD-01",
    code: "RDY-69-01",
    candidateName: "ณัฐพล เจริญสุข",
    targetKeyPosition: "Engineering Manager",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    leadershipScore: 90,
    experienceScore: 92,
    skillMatchScore: 94,
    readiness: "ready-now",
    assessedDate: "20 พ.ย. 2569",
  },
  {
    id: "RD-02",
    code: "RDY-69-02",
    candidateName: "ปวีณา เลิศศิริ",
    targetKeyPosition: "HRD Manager",
    department: "ฝ่ายทรัพยากรบุคคล",
    leadershipScore: 88,
    experienceScore: 90,
    skillMatchScore: 92,
    readiness: "ready-now",
    assessedDate: "19 พ.ย. 2569",
  },
  {
    id: "RD-03",
    code: "RDY-69-03",
    candidateName: "ภูมิพัฒน์ อินทรักษา",
    targetKeyPosition: "Principal System Architect",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    leadershipScore: 76,
    experienceScore: 86,
    skillMatchScore: 90,
    readiness: "1-2-years",
    assessedDate: "18 พ.ย. 2569",
  },
  {
    id: "RD-04",
    code: "RDY-69-04",
    candidateName: "อรรถพล แสงทอง",
    targetKeyPosition: "Operations Manager",
    department: "ฝ่ายปฏิบัติการและบริการ",
    leadershipScore: 60,
    experienceScore: 64,
    skillMatchScore: 62,
    readiness: "3-plus-years",
    assessedDate: "17 พ.ย. 2569",
  },
];

export const INITIAL_SUCCESSION_PLANS: SuccessionPlanItem[] = [
  {
    id: "SP-01",
    code: "SPLAN-69-01",
    keyPosition: "Engineering Manager",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    primarySuccessor: "ณัฐพล เจริญสุข",
    backupSuccessor: "ภูมิพัฒน์ อินทรักษา",
    keyMilestone: "รักษาการหัวหน้าทีมโปรเจกต์หลัก + Executive Shadowing 6 เดือน",
    targetDate: "มิ.ย. 2570",
    progress: 85,
    status: "active",
  },
  {
    id: "SP-02",
    code: "SPLAN-69-02",
    keyPosition: "HRD Manager",
    department: "ฝ่ายพัฒนาทรัพยากรบุคคล",
    primarySuccessor: "ปวีณา เลิศศิริ",
    backupSuccessor: "รอระบุผู้สืบทอดสำรอง",
    keyMilestone: "นำเสนอแผนกลยุทธ์ People Analytics ประจำปีต่อคณะกรรมการ",
    targetDate: "มี.ค. 2570",
    progress: 100,
    status: "completed",
  },
  {
    id: "SP-03",
    code: "SPLAN-69-03",
    keyPosition: "Head of Enterprise Sales",
    department: "ฝ่ายขายและการตลาด",
    primarySuccessor: "ศิริพร รัตนวงศ์",
    backupSuccessor: "รอระบุผู้สืบทอดสำรอง",
    keyMilestone: "ดูแลบัญชีลูกค้า Enterprise Top 5 และเข้าโปรแกรม Sales Leadership",
    targetDate: "ธ.ค. 2570",
    progress: 55,
    status: "review-needed",
  },
  {
    id: "SP-04",
    code: "SPLAN-69-04",
    keyPosition: "Principal System Architect",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    primarySuccessor: "ภูมิพัฒน์ อินทรักษา",
    backupSuccessor: "ณัฐพล เจริญสุข",
    keyMilestone: "ออกแบบ Cloud Architecture Blueprint ระดับองค์กร",
    targetDate: "ก.ย. 2570",
    progress: 72,
    status: "active",
  },
];
