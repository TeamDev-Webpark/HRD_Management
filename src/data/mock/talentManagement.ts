export type TalentTier = "HiPo" | "Key Talent" | "Emerging Talent" | "Core Performer";
export type RetentionRisk = "low" | "medium" | "high";
export type NineBoxScore = 1 | 2 | 3; // 1 = Low, 2 = Moderate, 3 = High
export type TalentPoolStatus = "active" | "nominated" | "on-watch";
export type PotentialStatus = "assessed" | "pending";
export type TalentReviewStatus = "pending" | "approved" | "deferred";

export interface TalentPoolItem {
  id: string;
  code: string;
  employeeCode: string;
  employeeName: string;
  position: string;
  department: string;
  tier: TalentTier;
  performance: NineBoxScore;
  potential: NineBoxScore;
  retentionRisk: RetentionRisk;
  targetNextRole: string;
  status: TalentPoolStatus;
}

export interface PotentialAssessmentItem {
  id: string;
  code: string;
  employeeCode: string;
  employeeName: string;
  position: string;
  department: string;
  learningAgility: number;
  leadershipDrive: number;
  strategicThinking: number;
  assessorName: string;
  assessedDate: string;
  status: PotentialStatus;
}

export interface TalentReviewItem {
  id: string;
  code: string;
  employeeCode: string;
  employeeName: string;
  position: string;
  department: string;
  boxLabel: string;
  proposedAction: string;
  committeeNote: string;
  reviewCycle: string;
  status: TalentReviewStatus;
}

export const INITIAL_TALENT_POOL: TalentPoolItem[] = [
  {
    id: "TL-01",
    code: "TLT-69-01",
    employeeCode: "EMP-1024",
    employeeName: "ณัฐพล เจริญสุข",
    position: "Senior Software Engineer",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    tier: "HiPo",
    performance: 3,
    potential: 3,
    retentionRisk: "medium",
    targetNextRole: "Engineering Team Lead",
    status: "active",
  },
  {
    id: "TL-02",
    code: "TLT-69-02",
    employeeCode: "EMP-1045",
    employeeName: "ปวีณา เลิศศิริ",
    position: "HR Business Partner",
    department: "ฝ่ายพัฒนาทรัพยากรบุคคล (HRD)",
    tier: "HiPo",
    performance: 3,
    potential: 3,
    retentionRisk: "low",
    targetNextRole: "HRD Manager",
    status: "active",
  },
  {
    id: "TL-03",
    code: "TLT-69-03",
    employeeCode: "EMP-1126",
    employeeName: "ชลธิชา นาควัชระ",
    position: "Senior Product Designer",
    department: "ฝ่ายออกแบบผลิตภัณฑ์และ UX",
    tier: "HiPo",
    performance: 3,
    potential: 3,
    retentionRisk: "high",
    targetNextRole: "Head of Product Design",
    status: "on-watch",
  },
  {
    id: "TL-04",
    code: "TLT-69-04",
    employeeCode: "EMP-1088",
    employeeName: "ศิริพร รัตนวงศ์",
    position: "Key Account Manager",
    department: "ฝ่ายขายและการตลาด",
    tier: "Key Talent",
    performance: 3,
    potential: 2,
    retentionRisk: "high",
    targetNextRole: "Sales Team Lead",
    status: "on-watch",
  },
  {
    id: "TL-05",
    code: "TLT-69-05",
    employeeCode: "EMP-1052",
    employeeName: "ภูมิพัฒน์ อินทรักษา",
    position: "Tech Lead",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    tier: "Key Talent",
    performance: 2,
    potential: 3,
    retentionRisk: "low",
    targetNextRole: "Principal System Architect",
    status: "active",
  },
  {
    id: "TL-06",
    code: "TLT-69-06",
    employeeCode: "EMP-1135",
    employeeName: "ปิยะพงษ์ สุวรรณโชติ",
    position: "Senior Financial Analyst",
    department: "ฝ่ายการเงินและบัญชี",
    tier: "Key Talent",
    performance: 3,
    potential: 2,
    retentionRisk: "low",
    targetNextRole: "Finance Manager",
    status: "active",
  },
  {
    id: "TL-07",
    code: "TLT-69-07",
    employeeCode: "EMP-1142",
    employeeName: "กานต์สินี วงศ์สุวรรณ",
    position: "Data Analyst",
    department: "ฝ่ายวิศวกรรมข้อมูลและกลยุทธ์",
    tier: "Emerging Talent",
    performance: 2,
    potential: 3,
    retentionRisk: "low",
    targetNextRole: "Senior Data Scientist",
    status: "active",
  },
  {
    id: "TL-08",
    code: "TLT-69-08",
    employeeCode: "EMP-1119",
    employeeName: "นภัสสร พงษ์เจริญ",
    position: "Frontend Developer",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    tier: "Emerging Talent",
    performance: 2,
    potential: 2,
    retentionRisk: "low",
    targetNextRole: "Senior Frontend Engineer",
    status: "active",
  },
  {
    id: "TL-09",
    code: "TLT-69-09",
    employeeCode: "EMP-1071",
    employeeName: "อรรถพล แสงทอง",
    position: "Operations Supervisor",
    department: "ฝ่ายปฏิบัติการและบริการ",
    tier: "Emerging Talent",
    performance: 2,
    potential: 2,
    retentionRisk: "medium",
    targetNextRole: "Operations Manager",
    status: "nominated",
  },
  {
    id: "TL-10",
    code: "TLT-69-10",
    employeeCode: "EMP-1104",
    employeeName: "กิตติพงศ์ วัฒนชัย",
    position: "Backend Developer",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    tier: "Core Performer",
    performance: 1,
    potential: 3,
    retentionRisk: "medium",
    targetNextRole: "Senior Backend Engineer",
    status: "nominated",
  },
  {
    id: "TL-11",
    code: "TLT-69-11",
    employeeCode: "EMP-1064",
    employeeName: "วีรยุทธ พิทักษ์กุล",
    position: "Senior DevOps Specialist",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    tier: "Core Performer",
    performance: 3,
    potential: 1,
    retentionRisk: "low",
    targetNextRole: "Cloud Infrastructure Specialist",
    status: "active",
  },
  {
    id: "TL-12",
    code: "TLT-69-12",
    employeeCode: "EMP-1091",
    employeeName: "สุภาวดี มณีรัตน์",
    position: "Customer Success Specialist",
    department: "ฝ่ายปฏิบัติการและบริการ",
    tier: "Core Performer",
    performance: 2,
    potential: 1,
    retentionRisk: "low",
    targetNextRole: "Senior Customer Success",
    status: "active",
  },
];

export const INITIAL_POTENTIAL_ASSESSMENTS: PotentialAssessmentItem[] = [
  {
    id: "PA-01",
    code: "POT-69-01",
    employeeCode: "EMP-1024",
    employeeName: "ณัฐพล เจริญสุข",
    position: "Senior Software Engineer",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    learningAgility: 4.8,
    leadershipDrive: 4.4,
    strategicThinking: 4.5,
    assessorName: "ธนกร ศิริสวัสดิ์",
    assessedDate: "20 พ.ย. 2569",
    status: "assessed",
  },
  {
    id: "PA-02",
    code: "POT-69-02",
    employeeCode: "EMP-1045",
    employeeName: "ปวีณา เลิศศิริ",
    position: "HR Business Partner",
    department: "ฝ่ายพัฒนาทรัพยากรบุคคล (HRD)",
    learningAgility: 4.7,
    leadershipDrive: 4.6,
    strategicThinking: 4.4,
    assessorName: "พิมพ์ชนก วัฒนากูล",
    assessedDate: "19 พ.ย. 2569",
    status: "assessed",
  },
  {
    id: "PA-03",
    code: "POT-69-03",
    employeeCode: "EMP-1126",
    employeeName: "ชลธิชา นาควัชระ",
    position: "Senior Product Designer",
    department: "ฝ่ายออกแบบผลิตภัณฑ์และ UX",
    learningAgility: 4.9,
    leadershipDrive: 4.5,
    strategicThinking: 4.6,
    assessorName: "อภิชาติ ธรรมาภิบาล",
    assessedDate: "21 พ.ย. 2569",
    status: "assessed",
  },
  {
    id: "PA-04",
    code: "POT-69-04",
    employeeCode: "EMP-1088",
    employeeName: "ศิริพร รัตนวงศ์",
    position: "Key Account Manager",
    department: "ฝ่ายขายและการตลาด",
    learningAgility: 4.1,
    leadershipDrive: 3.9,
    strategicThinking: 3.7,
    assessorName: "วราภรณ์ สุขสวัสดิ์",
    assessedDate: "18 พ.ย. 2569",
    status: "assessed",
  },
  {
    id: "PA-05",
    code: "POT-69-05",
    employeeCode: "EMP-1052",
    employeeName: "ภูมิพัฒน์ อินทรักษา",
    position: "Tech Lead",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    learningAgility: 4.6,
    leadershipDrive: 4.2,
    strategicThinking: 4.5,
    assessorName: "ธนกร ศิริสวัสดิ์",
    assessedDate: "20 พ.ย. 2569",
    status: "assessed",
  },
  {
    id: "PA-06",
    code: "POT-69-06",
    employeeCode: "EMP-1135",
    employeeName: "ปิยะพงษ์ สุวรรณโชติ",
    position: "Senior Financial Analyst",
    department: "ฝ่ายการเงินและบัญชี",
    learningAgility: 4.0,
    leadershipDrive: 3.8,
    strategicThinking: 4.3,
    assessorName: "รัตนาภรณ์ กิจเจริญ",
    assessedDate: "17 พ.ย. 2569",
    status: "assessed",
  },
  {
    id: "PA-07",
    code: "POT-69-07",
    employeeCode: "EMP-1071",
    employeeName: "อรรถพล แสงทอง",
    position: "Operations Supervisor",
    department: "ฝ่ายปฏิบัติการและบริการ",
    learningAgility: 3.6,
    leadershipDrive: 3.5,
    strategicThinking: 3.2,
    assessorName: "สุรชัย มั่นคง",
    assessedDate: "รอประเมิน",
    status: "pending",
  },
  {
    id: "PA-08",
    code: "POT-69-08",
    employeeCode: "EMP-1119",
    employeeName: "นภัสสร พงษ์เจริญ",
    position: "Frontend Developer",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    learningAgility: 4.2,
    leadershipDrive: 3.6,
    strategicThinking: 3.8,
    assessorName: "ธนกร ศิริสวัสดิ์",
    assessedDate: "รอประเมิน",
    status: "pending",
  },
];

export const INITIAL_TALENT_REVIEWS: TalentReviewItem[] = [
  {
    id: "TR-01",
    code: "REV-69-01",
    employeeCode: "EMP-1024",
    employeeName: "ณัฐพล เจริญสุข",
    position: "Senior Software Engineer",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    boxLabel: "Star (Box 9)",
    proposedAction: "Fast-Track Promotion + Executive Mentoring",
    committeeNote: "ผลงานโดดเด่นต่อเนื่อง 2 ปี แนะนำบรรจุเข้าแผนเลื่อนระดับ Q1/2570",
    reviewCycle: "Talent Review 2569",
    status: "approved",
  },
  {
    id: "TR-02",
    code: "REV-69-02",
    employeeCode: "EMP-1088",
    employeeName: "ศิริพร รัตนวงศ์",
    position: "Key Account Manager",
    department: "ฝ่ายขายและการตลาด",
    boxLabel: "High Performer (Box 6)",
    proposedAction: "Retention Package + Stretch Project",
    committeeNote: "มีความเสี่ยงลาออกสูง ควรเสนอ Retention Plan และมอบหมายดูแลบัญชีกลยุทธ์",
    reviewCycle: "Talent Review 2569",
    status: "pending",
  },
  {
    id: "TR-03",
    code: "REV-69-03",
    employeeCode: "EMP-1045",
    employeeName: "ปวีณา เลิศศิริ",
    position: "HR Business Partner",
    department: "ฝ่ายพัฒนาทรัพยากรบุคคล (HRD)",
    boxLabel: "Star (Box 9)",
    proposedAction: "Successor Designation (HRD Manager)",
    committeeNote: "พร้อมรับบทบาทผู้สืบทอดตำแหน่งอันดับ 1 ภายใน 12–18 เดือน",
    reviewCycle: "Talent Review 2569",
    status: "approved",
  },
  {
    id: "TR-04",
    code: "REV-69-04",
    employeeCode: "EMP-1126",
    employeeName: "ชลธิชา นาควัชระ",
    position: "Senior Product Designer",
    department: "ฝ่ายออกแบบผลิตภัณฑ์และ UX",
    boxLabel: "Star (Box 9)",
    proposedAction: "Retention Bonus + Design Leadership Track",
    committeeNote: "เป็นบุคลากรหลักด้าน UX ที่มีตลาดต้องการสูง แนะนำเสนอโครงการ Design System Lead",
    reviewCycle: "Talent Review 2569",
    status: "pending",
  },
  {
    id: "TR-05",
    code: "REV-69-05",
    employeeCode: "EMP-1052",
    employeeName: "ภูมิพัฒน์ อินทรักษา",
    position: "Tech Lead",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    boxLabel: "High Potential (Box 8)",
    proposedAction: "Cross-Department Architecture Assignment",
    committeeNote: "ศักยภาพเชิงกลยุทธ์สูง แนะนำให้ดูแลโครงการปรับสถาปัตยกรรมองค์กร",
    reviewCycle: "Talent Review 2569",
    status: "pending",
  },
  {
    id: "TR-06",
    code: "REV-69-06",
    employeeCode: "EMP-1135",
    employeeName: "ปิยะพงษ์ สุวรรณโชติ",
    position: "Senior Financial Analyst",
    department: "ฝ่ายการเงินและบัญชี",
    boxLabel: "High Performer (Box 6)",
    proposedAction: "Finance Business Partnering Rotation",
    committeeNote: "ผลงานวิเคราะห์งบประมาณแม่นยำสูง แนะนำหมุนเวียนงานร่วมกับฝ่ายกลยุทธ์ 6 เดือน",
    reviewCycle: "Talent Review 2569",
    status: "approved",
  },
];
