export type CompetencyType = "Core" | "Managerial" | "Functional";

export interface CompetencyDictItem {
  id: string;
  code: string;
  name: string;
  nameEn: string;
  type: CompetencyType;
  maxLevel: number;
  mappedPositions: number;
  description: string;
  active: boolean;
}

export interface PositionCompetencyItem {
  id: string;
  positionId: string;
  positionTitle: string;
  department: string;
  jobGrade: string;
  competencyCode: string;
  competencyName: string;
  type: CompetencyType;
  targetLevel: number;
  critical: boolean;
}

export type AssessmentStatus = "assessed" | "pending";

export interface CompetencyAssessmentItem {
  id: string;
  code: string;
  employeeCode: string;
  employeeName: string;
  department: string;
  position: string;
  competencyName: string;
  type: CompetencyType;
  targetLevel: number;
  actualLevel: number | null;
  assessorName: string;
  assessedDate: string;
  status: AssessmentStatus;
}

export const POSITION_OPTIONS = [
  { value: "POS-01", label: "Senior Software Engineer (JG-06)" },
  { value: "POS-02", label: "Engineering Team Lead (JG-07)" },
  { value: "POS-03", label: "HR Business Partner (JG-06)" },
  { value: "POS-04", label: "Key Account Manager (JG-06)" },
  { value: "POS-05", label: "Operations Supervisor (JG-05)" },
];

export const INITIAL_COMPETENCY_DICTIONARY: CompetencyDictItem[] = [
  {
    id: "CMP-01",
    code: "CC-01",
    name: "การมุ่งเน้นลูกค้าและคุณภาพงาน",
    nameEn: "Customer & Quality Focus",
    type: "Core",
    maxLevel: 5,
    mappedPositions: 24,
    description: "เข้าใจความต้องการลูกค้าภายในและภายนอก ส่งมอบผลงานได้มาตรฐานและพัฒนาคุณภาพต่อเนื่อง",
    active: true,
  },
  {
    id: "CMP-02",
    code: "CC-02",
    name: "การสื่อสารและการทำงานร่วมกันข้ามสายงาน",
    nameEn: "Cross-Functional Collaboration",
    type: "Core",
    maxLevel: 5,
    mappedPositions: 24,
    description: "สื่อสารชัดเจน รับฟังความเห็นต่าง และประสานงานกับทีมอื่นเพื่อบรรลุเป้าหมายองค์กรร่วมกัน",
    active: true,
  },
  {
    id: "CMP-03",
    code: "MC-01",
    name: "ภาวะผู้นำและการโค้ชชิ่งทีมงาน",
    nameEn: "People Leadership & Coaching",
    type: "Managerial",
    maxLevel: 5,
    mappedPositions: 10,
    description: "สร้างแรงจูงใจ ให้ Feedback เชิงสร้างสรรค์ และวางแผนพัฒนาศักยภาพลูกทีมได้อย่างเป็นระบบ",
    active: true,
  },
  {
    id: "CMP-04",
    code: "MC-02",
    name: "การคิดเชิงกลยุทธ์และการตัดสินใจด้วยข้อมูล",
    nameEn: "Strategic & Data-Driven Decision",
    type: "Managerial",
    maxLevel: 5,
    mappedPositions: 8,
    description: "วิเคราะห์ข้อมูลธุรกิจและแนวโน้มตลาดเพื่อกำหนดทิศทางและจัดลำดับความสำคัญได้อย่างแม่นยำ",
    active: true,
  },
  {
    id: "CMP-05",
    code: "FC-01",
    name: "สถาปัตยกรรมระบบและความปลอดภัยไซเบอร์",
    nameEn: "System Architecture & Cloud Security",
    type: "Functional",
    maxLevel: 5,
    mappedPositions: 6,
    description: "ออกแบบระบบที่ขยายตัวได้ดี มีเสถียรภาพสูง และเป็นไปตามมาตรฐานความปลอดภัยข้อมูล",
    active: true,
  },
  {
    id: "CMP-06",
    code: "FC-02",
    name: "การวิเคราะห์ข้อมูลและ AI Literacy",
    nameEn: "Data Analytics & AI Literacy",
    type: "Functional",
    maxLevel: 5,
    mappedPositions: 15,
    description: "ประยุกต์ใช้เครื่องมือวิเคราะห์ข้อมูล Power BI และ Generative AI เพื่อเพิ่มประสิทธิภาพงาน",
    active: true,
  },
];

export const INITIAL_POSITION_COMPETENCIES: PositionCompetencyItem[] = [
  {
    id: "PC-01",
    positionId: "POS-01",
    positionTitle: "Senior Software Engineer",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    jobGrade: "JG-06",
    competencyCode: "FC-01",
    competencyName: "สถาปัตยกรรมระบบและความปลอดภัยไซเบอร์",
    type: "Functional",
    targetLevel: 4,
    critical: true,
  },
  {
    id: "PC-02",
    positionId: "POS-01",
    positionTitle: "Senior Software Engineer",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    jobGrade: "JG-06",
    competencyCode: "FC-02",
    competencyName: "การวิเคราะห์ข้อมูลและ AI Literacy",
    type: "Functional",
    targetLevel: 3,
    critical: true,
  },
  {
    id: "PC-03",
    positionId: "POS-01",
    positionTitle: "Senior Software Engineer",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    jobGrade: "JG-06",
    competencyCode: "CC-02",
    competencyName: "การสื่อสารและการทำงานร่วมกันข้ามสายงาน",
    type: "Core",
    targetLevel: 3,
    critical: false,
  },
  {
    id: "PC-04",
    positionId: "POS-02",
    positionTitle: "Engineering Team Lead",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    jobGrade: "JG-07",
    competencyCode: "MC-01",
    competencyName: "ภาวะผู้นำและการโค้ชชิ่งทีมงาน",
    type: "Managerial",
    targetLevel: 4,
    critical: true,
  },
  {
    id: "PC-05",
    positionId: "POS-02",
    positionTitle: "Engineering Team Lead",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    jobGrade: "JG-07",
    competencyCode: "FC-01",
    competencyName: "สถาปัตยกรรมระบบและความปลอดภัยไซเบอร์",
    type: "Functional",
    targetLevel: 4,
    critical: true,
  },
  {
    id: "PC-06",
    positionId: "POS-03",
    positionTitle: "HR Business Partner",
    department: "ฝ่ายทรัพยากรบุคคล",
    jobGrade: "JG-06",
    competencyCode: "FC-02",
    competencyName: "การวิเคราะห์ข้อมูลและ AI Literacy",
    type: "Functional",
    targetLevel: 4,
    critical: true,
  },
  {
    id: "PC-07",
    positionId: "POS-04",
    positionTitle: "Key Account Manager",
    department: "ฝ่ายขายและการตลาด",
    jobGrade: "JG-06",
    competencyCode: "CC-01",
    competencyName: "การมุ่งเน้นลูกค้าและคุณภาพงาน",
    type: "Core",
    targetLevel: 4,
    critical: true,
  },
  {
    id: "PC-08",
    positionId: "POS-05",
    positionTitle: "Operations Supervisor",
    department: "ฝ่ายปฏิบัติการและบริการ",
    jobGrade: "JG-05",
    competencyCode: "MC-01",
    competencyName: "ภาวะผู้นำและการโค้ชชิ่งทีมงาน",
    type: "Managerial",
    targetLevel: 3,
    critical: true,
  },
];

export const INITIAL_COMPETENCY_ASSESSMENTS: CompetencyAssessmentItem[] = [
  {
    id: "CA-01",
    code: "CAS-69-01",
    employeeCode: "EMP-1024",
    employeeName: "ณัฐพล เจริญสุข",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    position: "Senior Software Engineer",
    competencyName: "สถาปัตยกรรมระบบและความปลอดภัยไซเบอร์",
    type: "Functional",
    targetLevel: 4,
    actualLevel: 4,
    assessorName: "ธนกร ศิริสวัสดิ์",
    assessedDate: "20 พ.ย. 2569",
    status: "assessed",
  },
  {
    id: "CA-02",
    code: "CAS-69-02",
    employeeCode: "EMP-1045",
    employeeName: "ปวีณา เลิศศิริ",
    department: "ฝ่ายทรัพยากรบุคคล",
    position: "HR Business Partner",
    competencyName: "การวิเคราะห์ข้อมูลและ AI Literacy",
    type: "Functional",
    targetLevel: 4,
    actualLevel: 3,
    assessorName: "พิมพ์ชนก วัฒนากูล",
    assessedDate: "19 พ.ย. 2569",
    status: "assessed",
  },
  {
    id: "CA-03",
    code: "CAS-69-03",
    employeeCode: "EMP-1088",
    employeeName: "ศิริพร รัตนวงศ์",
    department: "ฝ่ายขายและการตลาด",
    position: "Key Account Manager",
    competencyName: "การมุ่งเน้นลูกค้าและคุณภาพงาน",
    type: "Core",
    targetLevel: 4,
    actualLevel: 5,
    assessorName: "วราภรณ์ สุขสวัสดิ์",
    assessedDate: "18 พ.ย. 2569",
    status: "assessed",
  },
  {
    id: "CA-04",
    code: "CAS-69-04",
    employeeCode: "EMP-1071",
    employeeName: "อรรถพล แสงทอง",
    department: "ฝ่ายปฏิบัติการและบริการ",
    position: "Operations Supervisor",
    competencyName: "ภาวะผู้นำและการโค้ชชิ่งทีมงาน",
    type: "Managerial",
    targetLevel: 3,
    actualLevel: 2,
    assessorName: "สุรชัย มั่นคง",
    assessedDate: "17 พ.ย. 2569",
    status: "assessed",
  },
  {
    id: "CA-05",
    code: "CAS-69-05",
    employeeCode: "EMP-1052",
    employeeName: "ภูมิพัฒน์ อินทรักษา",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    position: "Tech Lead",
    competencyName: "การคิดเชิงกลยุทธ์และการตัดสินใจด้วยข้อมูล",
    type: "Managerial",
    targetLevel: 4,
    actualLevel: null,
    assessorName: "ธนกร ศิริสวัสดิ์",
    assessedDate: "รอประเมิน",
    status: "pending",
  },
];
