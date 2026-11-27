export type AppraisalStatus = "waiting-self" | "waiting-manager" | "submitted";

export interface AppraisalReviewItem {
  id: string;
  code: string;
  employeeCode: string;
  employeeName: string;
  department: string;
  position: string;
  managerName: string;
  selfScore: number | null;
  managerScore: number | null;
  strengths: string;
  improvements: string;
  status: AppraisalStatus;
}

export type Feedback360Status = "collecting" | "completed";

export interface Feedback360Item {
  id: string;
  code: string;
  employeeCode: string;
  employeeName: string;
  department: string;
  position: string;
  invitedCount: number;
  respondedCount: number;
  avgScore: number;
  leadershipScore: number;
  collaborationScore: number;
  communicationScore: number;
  topHighlight: string;
  status: Feedback360Status;
}

export type FinalGrade = "A" | "B+" | "B" | "C" | "PIP";

export interface CalibrationItem {
  id: string;
  employeeCode: string;
  employeeName: string;
  department: string;
  position: string;
  kpiScore: number;
  compScore: number;
  rawTotal: number;
  suggestedGrade: FinalGrade;
  finalGrade: FinalGrade;
  calibrationNote: string;
  locked: boolean;
}

export type PipStatus = "active" | "passed" | "extended";

export interface PipRecordItem {
  id: string;
  code: string;
  employeeCode: string;
  employeeName: string;
  department: string;
  position: string;
  managerName: string;
  durationDays: number;
  periodLabel: string;
  progressPct: number;
  focusArea: string;
  status: PipStatus;
}

export const INITIAL_APPRAISAL_REVIEWS: AppraisalReviewItem[] = [
  {
    id: "REV-01",
    code: "APR-69-0101",
    employeeCode: "EMP-1024",
    employeeName: "ณัฐพล เจริญสุข",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    position: "Senior Software Engineer",
    managerName: "ธนกร ศิริสวัสดิ์",
    selfScore: 4.5,
    managerScore: 4.65,
    strengths: "ความเชี่ยวชาญด้าน Architecture สูงและส่งมอบระบบได้เสถียรเกินเป้า",
    improvements: "เพิ่มบทบาทการนำเสนองานเชิงกลยุทธ์ต่อผู้บริหาร",
    status: "submitted",
  },
  {
    id: "REV-02",
    code: "APR-69-0102",
    employeeCode: "EMP-1088",
    employeeName: "ศิริพร รัตนวงศ์",
    department: "ฝ่ายขายและการตลาด",
    position: "Key Account Manager",
    managerName: "วราภรณ์ สุขสวัสดิ์",
    selfScore: 4.6,
    managerScore: null,
    strengths: "ปิดยอดขายองค์กรเติบโต 27.4% และสร้างความสัมพันธ์ลูกค้าระดับสูงได้ดี",
    improvements: "จัดทำ Playbook การขายเพื่อถ่ายทอดให้ทีมรุ่นใหม่",
    status: "waiting-manager",
  },
  {
    id: "REV-03",
    code: "APR-69-0103",
    employeeCode: "EMP-1045",
    employeeName: "ปวีณา เลิศศิริ",
    department: "ฝ่ายทรัพยากรบุคคล",
    position: "HR Business Partner",
    managerName: "พิมพ์ชนก วัฒนากูล",
    selfScore: 4.2,
    managerScore: 4.35,
    strengths: "ประสานงานข้ามแผนกได้รวดเร็วและผลักดันคอร์สบังคับได้ตามเป้า",
    improvements: "ต่อยอดทักษะ HR Analytics ด้วย Power BI",
    status: "submitted",
  },
  {
    id: "REV-04",
    code: "APR-69-0104",
    employeeCode: "EMP-1071",
    employeeName: "อรรถพล แสงทอง",
    department: "ฝ่ายปฏิบัติการและบริการ",
    position: "Operations Supervisor",
    managerName: "สุรชัย มั่นคง",
    selfScore: 3.1,
    managerScore: null,
    strengths: "ดูแลหน้างานมีความรับผิดชอบสูงและพร้อมแก้ไขเหตุฉุกเฉิน",
    improvements: "ต้องปรับปรุงการบริหารต้นทุนและการวางแผนรอบจัดส่ง",
    status: "waiting-manager",
  },
  {
    id: "REV-05",
    code: "APR-69-0105",
    employeeCode: "EMP-1052",
    employeeName: "ภูมิพัฒน์ อินทรักษา",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    position: "Tech Lead",
    managerName: "ธนกร ศิริสวัสดิ์",
    selfScore: null,
    managerScore: null,
    strengths: "",
    improvements: "",
    status: "waiting-self",
  },
];

export const INITIAL_FEEDBACK_360: Feedback360Item[] = [
  {
    id: "FB-01",
    code: "360-69-01",
    employeeCode: "EMP-00215",
    employeeName: "ธนกร ศิริสวัสดิ์",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    position: "Engineering Team Lead",
    invitedCount: 6,
    respondedCount: 6,
    avgScore: 4.6,
    leadershipScore: 4.7,
    collaborationScore: 4.6,
    communicationScore: 4.5,
    topHighlight: "รับฟังความเห็นทีมและช่วยปลดล็อกปัญหาเทคนิคได้รวดเร็ว",
    status: "completed",
  },
  {
    id: "FB-02",
    code: "360-69-02",
    employeeCode: "EMP-00102",
    employeeName: "พิมพ์ชนก วัฒนากูล",
    department: "ฝ่ายพัฒนาทรัพยากรบุคคล",
    position: "HRD Manager",
    invitedCount: 8,
    respondedCount: 7,
    avgScore: 4.8,
    leadershipScore: 4.9,
    collaborationScore: 4.8,
    communicationScore: 4.7,
    topHighlight: "สื่อสารวิสัยทัศน์ชัดเจนและสนับสนุนการเติบโตของทีมงาน",
    status: "collecting",
  },
  {
    id: "FB-03",
    code: "360-69-03",
    employeeCode: "EMP-1033",
    employeeName: "มนัสนันท์ พงษ์ไพศาล",
    department: "ฝ่ายขายและการตลาด",
    position: "Team Lead — Digital Sales",
    invitedCount: 5,
    respondedCount: 5,
    avgScore: 4.3,
    leadershipScore: 4.2,
    collaborationScore: 4.5,
    communicationScore: 4.2,
    topHighlight: "ประสานงานกับฝ่ายการตลาดและลูกค้าได้ดีมาก",
    status: "completed",
  },
  {
    id: "FB-04",
    code: "360-69-04",
    employeeCode: "EMP-1071",
    employeeName: "อรรถพล แสงทอง",
    department: "ฝ่ายปฏิบัติการและบริการ",
    position: "Operations Supervisor",
    invitedCount: 6,
    respondedCount: 4,
    avgScore: 3.6,
    leadershipScore: 3.5,
    collaborationScore: 3.8,
    communicationScore: 3.5,
    topHighlight: "ขยันและทุ่มเท แต่ควรเพิ่มการสื่อสารล่วงหน้าเมื่อแผนงานเปลี่ยน",
    status: "collecting",
  },
];

export const INITIAL_CALIBRATION_LIST: CalibrationItem[] = [
  {
    id: "CAL-01",
    employeeCode: "EMP-1024",
    employeeName: "ณัฐพล เจริญสุข",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    position: "Senior Software Engineer",
    kpiScore: 4.7,
    compScore: 4.55,
    rawTotal: 4.64,
    suggestedGrade: "A",
    finalGrade: "A",
    calibrationNote: "ผลงานโดดเด่นต่อเนื่อง เสนอเข้ากลุ่ม High Potential",
    locked: true,
  },
  {
    id: "CAL-02",
    employeeCode: "EMP-1088",
    employeeName: "ศิริพร รัตนวงศ์",
    department: "ฝ่ายขายและการตลาด",
    position: "Key Account Manager",
    kpiScore: 4.8,
    compScore: 4.4,
    rawTotal: 4.64,
    suggestedGrade: "A",
    finalGrade: "A",
    calibrationNote: "ยอดขายทะลุเป้า +27.4% คณะกรรมการเห็นพ้องเกรด A",
    locked: false,
  },
  {
    id: "CAL-03",
    employeeCode: "EMP-1045",
    employeeName: "ปวีณา เลิศศิริ",
    department: "ฝ่ายทรัพยากรบุคคล",
    position: "HR Business Partner",
    kpiScore: 4.35,
    compScore: 4.3,
    rawTotal: 4.33,
    suggestedGrade: "B+",
    finalGrade: "B+",
    calibrationNote: "สม่ำเสมอตามเกณฑ์และช่วยขับเคลื่อนโครงการองค์กร",
    locked: false,
  },
  {
    id: "CAL-04",
    employeeCode: "EMP-1033",
    employeeName: "มนัสนันท์ พงษ์ไพศาล",
    department: "ฝ่ายขายและการตลาด",
    position: "Team Lead — Digital Sales",
    kpiScore: 3.9,
    compScore: 3.8,
    rawTotal: 3.86,
    suggestedGrade: "B",
    finalGrade: "B",
    calibrationNote: "บรรลุเป้าหมายหลักตามมาตรฐาน",
    locked: false,
  },
  {
    id: "CAL-05",
    employeeCode: "EMP-1110",
    employeeName: "วุฒิชัย ธรรมรักษ์",
    department: "ฝ่ายปฏิบัติการและบริการ",
    position: "Site Coordinator",
    kpiScore: 2.35,
    compScore: 2.55,
    rawTotal: 2.43,
    suggestedGrade: "PIP",
    finalGrade: "PIP",
    calibrationNote: "ส่งมอบงานต่ำกว่าเกณฑ์ 2 ไตรมาสติด เข้าแผน PIP 90 วัน",
    locked: false,
  },
];

export const INITIAL_PIP_RECORDS: PipRecordItem[] = [
  {
    id: "PIP-01",
    code: "PIP-69-01",
    employeeCode: "EMP-1110",
    employeeName: "วุฒิชัย ธรรมรักษ์",
    department: "ฝ่ายปฏิบัติการและบริการ",
    position: "Site Coordinator",
    managerName: "สุรชัย มั่นคง",
    durationDays: 90,
    periodLabel: "1 พ.ย. 2569 – 30 ม.ค. 2570",
    progressPct: 45,
    focusArea: "ปรับปรุงความแม่นยำการตรวจรับสินค้าและการส่งรายงานประจำวันให้ตรงเวลา ≥ 95%",
    status: "active",
  },
  {
    id: "PIP-02",
    code: "PIP-69-02",
    employeeCode: "EMP-1119",
    employeeName: "ชญานิศ บุญมี",
    department: "ฝ่ายบัญชีและการเงิน",
    position: "Financial Analyst",
    managerName: "ประเสริฐ กิจเจริญ",
    durationDays: 60,
    periodLabel: "15 ก.ย. – 15 พ.ย. 2569",
    progressPct: 100,
    focusArea: "ลดข้อผิดพลาดในการกระทบยอดบัญชีและปิดงบรายเดือนให้ทันวันที่ 5 ของเดือน",
    status: "passed",
  },
  {
    id: "PIP-03",
    code: "PIP-69-03",
    employeeCode: "EMP-1122",
    employeeName: "ธนพล จันทร์เพ็ญ",
    department: "ฝ่ายขายและการตลาด",
    position: "Sales Executive",
    managerName: "วราภรณ์ สุขสวัสดิ์",
    durationDays: 90,
    periodLabel: "1 ต.ค. – 30 ธ.ค. 2569",
    progressPct: 68,
    focusArea: "เพิ่มอัตราการติดตามลูกค้าใหม่และบันทึก Pipeline ในระบบ CRM ครบ 100%",
    status: "active",
  },
];
