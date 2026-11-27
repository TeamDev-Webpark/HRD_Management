export type IdpPlanStatus = "draft" | "approved" | "in-progress" | "completed";
export type IdpMethod = "70-ojt" | "20-coaching" | "10-training";
export type IdpActivityStatus = "planned" | "in-progress" | "done";
export type IdpTrackStatus = "on-track" | "at-risk" | "completed";
export type IdpEvalResult = "exceed" | "achieved" | "developing" | "pending";

export interface EmployeeIdpItem {
  id: string;
  code: string;
  employeeCode: string;
  employeeName: string;
  position: string;
  department: string;
  cycle: string;
  focusGoal: string;
  managerName: string;
  activitiesCount: number;
  progress: number;
  status: IdpPlanStatus;
}

export interface IdpActivityItem {
  id: string;
  code: string;
  idpCode: string;
  employeeName: string;
  department: string;
  title: string;
  method: IdpMethod;
  dueDate: string;
  progress: number;
  status: IdpActivityStatus;
}

export interface IdpTrackingItem {
  id: string;
  code: string;
  employeeName: string;
  department: string;
  activityTitle: string;
  updatedDate: string;
  progress: number;
  evidenceNote: string;
  managerFeedback: string;
  status: IdpTrackStatus;
}

export interface IdpEvaluationItem {
  id: string;
  code: string;
  employeeCode: string;
  employeeName: string;
  position: string;
  department: string;
  focusGoal: string;
  beforeLevel: number;
  afterLevel: number | null;
  evaluatorName: string;
  evaluatedDate: string;
  result: IdpEvalResult;
}

export const INITIAL_EMPLOYEE_IDPS: EmployeeIdpItem[] = [
  {
    id: "IDP-01",
    code: "IDP-69-01",
    employeeCode: "EMP-1024",
    employeeName: "ณัฐพล เจริญสุข",
    position: "Senior Software Engineer",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    cycle: "IDP 2569",
    focusGoal: "ยกระดับภาวะผู้นำและทักษะการสื่อสารข้ามทีมเพื่อเตรียมขึ้น Tech Lead",
    managerName: "ธนกร ศิริสวัสดิ์",
    activitiesCount: 4,
    progress: 75,
    status: "in-progress",
  },
  {
    id: "IDP-02",
    code: "IDP-69-02",
    employeeCode: "EMP-1045",
    employeeName: "ปวีณา เลิศศิริ",
    position: "HR Business Partner",
    department: "ฝ่ายทรัพยากรบุคคล",
    cycle: "IDP 2569",
    focusGoal: "พัฒนาทักษะ People Analytics & Generative AI สำหรับวิเคราะห์ข้อมูล HR",
    managerName: "พิมพ์ชนก วัฒนากูล",
    activitiesCount: 3,
    progress: 85,
    status: "in-progress",
  },
  {
    id: "IDP-03",
    code: "IDP-69-03",
    employeeCode: "EMP-1071",
    employeeName: "อรรถพล แสงทอง",
    position: "Operations Supervisor",
    department: "ฝ่ายปฏิบัติการและบริการ",
    cycle: "IDP 2569",
    focusGoal: "เสริมทักษะ People Leadership & Coaching สำหรับหัวหน้างานระดับต้น",
    managerName: "สุรชัย มั่นคง",
    activitiesCount: 3,
    progress: 40,
    status: "approved",
  },
  {
    id: "IDP-04",
    code: "IDP-69-04",
    employeeCode: "EMP-1088",
    employeeName: "ศิริพร รัตนวงศ์",
    position: "Key Account Manager",
    department: "ฝ่ายขายและการตลาด",
    cycle: "IDP 2569",
    focusGoal: "ประยุกต์ใช้ Agile Project Delivery เพื่อบริหารโครงการลูกค้าองค์กร",
    managerName: "วราภรณ์ สุขสวัสดิ์",
    activitiesCount: 3,
    progress: 100,
    status: "completed",
  },
  {
    id: "IDP-05",
    code: "IDP-69-05",
    employeeCode: "EMP-1052",
    employeeName: "ภูมิพัฒน์ อินทรักษา",
    position: "Tech Lead",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    cycle: "IDP 2569",
    focusGoal: "วางแผนกลยุทธ์เทคโนโลยีและการตัดสินใจด้วยข้อมูลระดับผู้จัดการ",
    managerName: "ธนกร ศิริสวัสดิ์",
    activitiesCount: 2,
    progress: 20,
    status: "draft",
  },
];

export const INITIAL_IDP_ACTIVITIES: IdpActivityItem[] = [
  {
    id: "ACT-01",
    code: "ACT-69-01",
    idpCode: "IDP-69-01",
    employeeName: "ณัฐพล เจริญสุข",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    title: "เป็น Project Lead ดูแลโปรเจกต์ย้ายระบบ Auth ข้าม 3 ทีม",
    method: "70-ojt",
    dueDate: "30 ธ.ค. 2569",
    progress: 80,
    status: "in-progress",
  },
  {
    id: "ACT-02",
    code: "ACT-69-02",
    idpCode: "IDP-69-02",
    employeeName: "ปวีณา เลิศศิริ",
    department: "ฝ่ายทรัพยากรบุคคล",
    title: "อบรมหลักสูตร People Analytics with Power BI & GenAI",
    method: "10-training",
    dueDate: "15 พ.ย. 2569",
    progress: 100,
    status: "done",
  },
  {
    id: "ACT-03",
    code: "ACT-69-03",
    idpCode: "IDP-69-03",
    employeeName: "อรรถพล แสงทอง",
    department: "ฝ่ายปฏิบัติการและบริการ",
    title: "Shadowing & 1-on-1 Coaching การบริหารทีมกับผู้จัดการฝ่าย",
    method: "20-coaching",
    dueDate: "20 ธ.ค. 2569",
    progress: 45,
    status: "in-progress",
  },
  {
    id: "ACT-04",
    code: "ACT-69-04",
    idpCode: "IDP-69-04",
    employeeName: "ศิริพร รัตนวงศ์",
    department: "ฝ่ายขายและการตลาด",
    title: "นำ Sprint Review มาใช้ในการติดตามส่งมอบงานลูกค้า Enterprise",
    method: "70-ojt",
    dueDate: "10 พ.ย. 2569",
    progress: 100,
    status: "done",
  },
  {
    id: "ACT-05",
    code: "ACT-69-05",
    idpCode: "IDP-69-05",
    employeeName: "ภูมิพัฒน์ อินทรักษา",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    title: "Executive Mentoring ด้าน Tech Strategy กับ CTO เดือนละ 1 ครั้ง",
    method: "20-coaching",
    dueDate: "31 ม.ค. 2570",
    progress: 15,
    status: "planned",
  },
];

export const INITIAL_IDP_TRACKINGS: IdpTrackingItem[] = [
  {
    id: "TRK-01",
    code: "TRK-69-01",
    employeeName: "ณัฐพล เจริญสุข",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    activityTitle: "เป็น Project Lead ดูแลโปรเจกต์ย้ายระบบ Auth ข้าม 3 ทีม",
    updatedDate: "22 พ.ย. 2569",
    progress: 80,
    evidenceNote: "ส่งมอบ Phase 1 สำเร็จตามกำหนดและจัด Sprint Retrospective ครบ 4 รอบ",
    managerFeedback: "สื่อสารชัดเจนขึ้นมาก แนะนำเพิ่มการสรุปความเสี่ยงให้ผู้บริหารสั้นกระชับ",
    status: "on-track",
  },
  {
    id: "TRK-02",
    code: "TRK-69-02",
    employeeName: "ปวีณา เลิศศิริ",
    department: "ฝ่ายทรัพยากรบุคคล",
    activityTitle: "อบรมหลักสูตร People Analytics with Power BI & GenAI",
    updatedDate: "18 พ.ย. 2569",
    progress: 100,
    evidenceNote: "สอบผ่าน 92% และสร้าง Dashboard วิเคราะห์ Turnover ของฝ่าย HR ใช้งานจริงแล้ว",
    managerFeedback: "นำความรู้มาประยุกต์ใช้กับงานจริงได้รวดเร็วและมีคุณภาพสูง",
    status: "completed",
  },
  {
    id: "TRK-03",
    code: "TRK-69-03",
    employeeName: "อรรถพล แสงทอง",
    department: "ฝ่ายปฏิบัติการและบริการ",
    activityTitle: "Shadowing & 1-on-1 Coaching การบริหารทีมกับผู้จัดการฝ่าย",
    updatedDate: "15 พ.ย. 2569",
    progress: 45,
    evidenceNote: "เข้าพบ Coach ไปแล้ว 2 จาก 6 ครั้ง เนื่องจากติดช่วงงานปฏิบัติการหนาแน่น",
    managerFeedback: "ควรจัดตารางเวลาล่วงหน้าให้แน่นอนเพื่อไม่ให้ล่าช้ากว่าแผน Q4",
    status: "at-risk",
  },
  {
    id: "TRK-04",
    code: "TRK-69-04",
    employeeName: "ศิริพร รัตนวงศ์",
    department: "ฝ่ายขายและการตลาด",
    activityTitle: "นำ Sprint Review มาใช้ในการติดตามส่งมอบงานลูกค้า Enterprise",
    updatedDate: "12 พ.ย. 2569",
    progress: 100,
    evidenceNote: "นำร่องกับลูกค้า 3 ราย คะแนนความพึงพอใจการส่งมอบเพิ่มเป็น 4.8/5",
    managerFeedback: "เป็นตัวอย่างที่ดีมาก สามารถขยายผลให้ทีมขายอื่นนำไปใช้ต่อได้",
    status: "completed",
  },
];

export const INITIAL_IDP_EVALUATIONS: IdpEvaluationItem[] = [
  {
    id: "EVL-01",
    code: "EVL-69-01",
    employeeCode: "EMP-1088",
    employeeName: "ศิริพร รัตนวงศ์",
    position: "Key Account Manager",
    department: "ฝ่ายขายและการตลาด",
    focusGoal: "Agile Project Delivery สำหรับโครงการลูกค้าองค์กร",
    beforeLevel: 2,
    afterLevel: 4,
    evaluatorName: "วราภรณ์ สุขสวัสดิ์",
    evaluatedDate: "20 พ.ย. 2569",
    result: "exceed",
  },
  {
    id: "EVL-02",
    code: "EVL-69-02",
    employeeCode: "EMP-1045",
    employeeName: "ปวีณา เลิศศิริ",
    position: "HR Business Partner",
    department: "ฝ่ายทรัพยากรบุคคล",
    focusGoal: "People Analytics & Generative AI",
    beforeLevel: 3,
    afterLevel: 4,
    evaluatorName: "พิมพ์ชนก วัฒนากูล",
    evaluatedDate: "21 พ.ย. 2569",
    result: "achieved",
  },
  {
    id: "EVL-03",
    code: "EVL-69-03",
    employeeCode: "EMP-1024",
    employeeName: "ณัฐพล เจริญสุข",
    position: "Senior Software Engineer",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    focusGoal: "People Leadership & Cross-Team Collaboration",
    beforeLevel: 2,
    afterLevel: null,
    evaluatorName: "ธนกร ศิริสวัสดิ์",
    evaluatedDate: "รอประเมินปลายรอบ",
    result: "pending",
  },
  {
    id: "EVL-04",
    code: "EVL-69-04",
    employeeCode: "EMP-1071",
    employeeName: "อรรถพล แสงทอง",
    position: "Operations Supervisor",
    department: "ฝ่ายปฏิบัติการและบริการ",
    focusGoal: "People Leadership & Coaching",
    beforeLevel: 2,
    afterLevel: 2,
    evaluatorName: "สุรชัย มั่นคง",
    evaluatedDate: "19 พ.ย. 2569",
    result: "developing",
  },
];
