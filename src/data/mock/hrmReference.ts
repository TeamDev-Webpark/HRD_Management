export interface HrmEmployeeRef {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  branch: string;
  department: string;
  position: string;
  jobGrade: string;
  managerName: string;
  employmentType: "พนักงานประจำ" | "สัญญาจ้าง";
  startDate: string;
  status: "active" | "probation";
}

export interface HrmDepartmentRef {
  id: string;
  code: string;
  name: string;
  branch: string;
  headName: string;
  headcount: number;
  costCenter: string;
  status: "active";
}

export interface HrmPositionRef {
  id: string;
  code: string;
  title: string;
  department: string;
  jobGrade: string;
  levelGroup: "Executive" | "Management" | "Senior" | "Officer";
  filledCount: number;
  plannedHeadcount: number;
}

export const HRM_EMPLOYEES_REF: HrmEmployeeRef[] = [
  {
    id: "EMP-1",
    employeeCode: "EMP-00102",
    name: "พิมพ์ชนก วัฒนากูล",
    email: "pimchanok.w@company.co.th",
    branch: "สำนักงานใหญ่ (กรุงเทพฯ)",
    department: "ฝ่ายพัฒนาทรัพยากรบุคคล (HRD)",
    position: "HRD Manager",
    jobGrade: "JG-08",
    managerName: "สมชาย กิตติศักดิ์ (VP People)",
    employmentType: "พนักงานประจำ",
    startDate: "15 ม.ค. 2562",
    status: "active",
  },
  {
    id: "EMP-2",
    employeeCode: "EMP-00215",
    name: "ธนกร ศิริสวัสดิ์",
    email: "thanakorn.s@company.co.th",
    branch: "สำนักงานใหญ่ (กรุงเทพฯ)",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    position: "Engineering Team Lead",
    jobGrade: "JG-07",
    managerName: "วีระชัย วงศ์วานิช (VP Engineering)",
    employmentType: "พนักงานประจำ",
    startDate: "01 มิ.ย. 2563",
    status: "active",
  },
  {
    id: "EMP-3",
    employeeCode: "EMP-1024",
    name: "ณัฐพล เจริญสุข",
    email: "nattapol.c@company.co.th",
    branch: "สำนักงานใหญ่ (กรุงเทพฯ)",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    position: "Senior Software Engineer",
    jobGrade: "JG-06",
    managerName: "ธนกร ศิริสวัสดิ์",
    employmentType: "พนักงานประจำ",
    startDate: "10 เม.ย. 2565",
    status: "active",
  },
  {
    id: "EMP-4",
    employeeCode: "EMP-1045",
    name: "ปวีณา เลิศศิริ",
    email: "paweena.l@company.co.th",
    branch: "สำนักงานใหญ่ (กรุงเทพฯ)",
    department: "ฝ่ายทรัพยากรบุคคล",
    position: "HR Business Partner",
    jobGrade: "JG-06",
    managerName: "พิมพ์ชนก วัฒนากูล",
    employmentType: "พนักงานประจำ",
    startDate: "01 ก.ย. 2564",
    status: "active",
  },
  {
    id: "EMP-5",
    employeeCode: "EMP-1088",
    name: "ศิริพร รัตนวงศ์",
    email: "siriporn.r@company.co.th",
    branch: "สำนักงานใหญ่ (กรุงเทพฯ)",
    department: "ฝ่ายขายและการตลาด",
    position: "Key Account Manager",
    jobGrade: "JG-06",
    managerName: "วราภรณ์ สุขสวัสดิ์",
    employmentType: "พนักงานประจำ",
    startDate: "20 ก.พ. 2566",
    status: "active",
  },
  {
    id: "EMP-6",
    employeeCode: "EMP-1142",
    name: "กานต์สินี วงศ์สุวรรณ",
    email: "kantsinee.w@company.co.th",
    branch: "สำนักงานใหญ่ (กรุงเทพฯ)",
    department: "ฝ่ายวิศวกรรมข้อมูลและกลยุทธ์",
    position: "Data Analyst",
    jobGrade: "JG-05",
    managerName: "วีระชัย วงศ์วานิช",
    employmentType: "พนักงานประจำ",
    startDate: "01 ต.ค. 2569",
    status: "probation",
  },
];

export const HRM_DEPARTMENTS_REF: HrmDepartmentRef[] = [
  {
    id: "DEP-1",
    code: "DEPT-ENG",
    name: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    branch: "สำนักงานใหญ่ (กรุงเทพฯ)",
    headName: "วีระชัย วงศ์วานิช",
    headcount: 118,
    costCenter: "CC-1001",
    status: "active",
  },
  {
    id: "DEP-2",
    code: "DEPT-HR",
    name: "ฝ่ายทรัพยากรบุคคลและพัฒนาองค์กร",
    branch: "สำนักงานใหญ่ (กรุงเทพฯ)",
    headName: "พิมพ์ชนก วัฒนากูล",
    headcount: 34,
    costCenter: "CC-2001",
    status: "active",
  },
  {
    id: "DEP-3",
    code: "DEPT-COM",
    name: "ฝ่ายขายและการตลาด",
    branch: "สำนักงานใหญ่ (กรุงเทพฯ)",
    headName: "วราภรณ์ สุขสวัสดิ์",
    headcount: 96,
    costCenter: "CC-3001",
    status: "active",
  },
  {
    id: "DEP-4",
    code: "DEPT-OPS",
    name: "ฝ่ายปฏิบัติการและบริการ",
    branch: "ศูนย์ปฏิบัติการ (บางนา)",
    headName: "สุรชัย มั่นคง",
    headcount: 142,
    costCenter: "CC-4001",
    status: "active",
  },
  {
    id: "DEP-5",
    code: "DEPT-DATA",
    name: "ฝ่ายวิศวกรรมข้อมูลและกลยุทธ์",
    branch: "สำนักงานใหญ่ (กรุงเทพฯ)",
    headName: "อภิชาติ ธรรมาภิบาล",
    headcount: 28,
    costCenter: "CC-1005",
    status: "active",
  },
];

export const HRM_POSITIONS_REF: HrmPositionRef[] = [
  {
    id: "POS-1",
    code: "POS-ENG-08",
    title: "Engineering Manager",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    jobGrade: "JG-08",
    levelGroup: "Management",
    filledCount: 3,
    plannedHeadcount: 3,
  },
  {
    id: "POS-2",
    code: "POS-ENG-06",
    title: "Senior Software Engineer",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    jobGrade: "JG-06",
    levelGroup: "Senior",
    filledCount: 24,
    plannedHeadcount: 28,
  },
  {
    id: "POS-3",
    code: "POS-HR-08",
    title: "HRD Manager",
    department: "ฝ่ายทรัพยากรบุคคลและพัฒนาองค์กร",
    jobGrade: "JG-08",
    levelGroup: "Management",
    filledCount: 1,
    plannedHeadcount: 1,
  },
  {
    id: "POS-4",
    code: "POS-COM-06",
    title: "Key Account Manager",
    department: "ฝ่ายขายและการตลาด",
    jobGrade: "JG-06",
    levelGroup: "Senior",
    filledCount: 12,
    plannedHeadcount: 14,
  },
  {
    id: "POS-5",
    code: "POS-OPS-05",
    title: "Operations Supervisor",
    department: "ฝ่ายปฏิบัติการและบริการ",
    jobGrade: "JG-05",
    levelGroup: "Officer",
    filledCount: 18,
    plannedHeadcount: 20,
  },
];
