export type PermissionAction = "view" | "create" | "edit" | "delete" | "approve" | "export";

export interface PermissionActionDef {
  key: PermissionAction;
  label: string;
  labelTh: string;
  hint: string;
}

export interface HrdModuleDef {
  id: string;
  code: string;
  name: string;
}

export interface RoleDefinition {
  id: string;
  code: string;
  name: string;
  description: string;
  isSystem: boolean; // Default roles (Admin, Manager, Employee) cannot be deleted
  isProtectedAdmin?: boolean; // Cannot be deactivated or stripped of RBAC
  active: boolean;
  usersCount: number;
  permissions: Record<string, PermissionAction[]>;
}

export interface UserRoleMappingItem {
  id: string;
  employeeCode: string;
  employeeName: string;
  email: string;
  position: string;
  department: string;
  roleId: string;
  assignedDate: string;
  status: "active" | "suspended";
}

export type AuditActionType =
  | "ROLE_CREATED"
  | "ROLE_COPIED"
  | "ROLE_UPDATED"
  | "ROLE_TOGGLED"
  | "PERMISSION_CHANGED"
  | "USER_ASSIGNED";

export interface RbacAuditLogItem {
  id: string;
  timestamp: string;
  actorName: string;
  actionType: AuditActionType;
  target: string;
  detail: string;
}

export const PERMISSION_ACTIONS: PermissionActionDef[] = [
  { key: "view", label: "View", labelTh: "ดูข้อมูล", hint: "สิทธิ์ในการเข้าถึงและดูข้อมูลในโมดูล" },
  { key: "create", label: "Create", labelTh: "สร้าง", hint: "สิทธิ์ในการเพิ่มรายการหรือสร้างข้อมูลใหม่" },
  { key: "edit", label: "Edit", labelTh: "แก้ไข", hint: "สิทธิ์ในการปรับปรุงหรือแก้ไขข้อมูลที่มีอยู่" },
  { key: "delete", label: "Delete", labelTh: "ลบ", hint: "สิทธิ์ในการลบรายการออกจากระบบ" },
  { key: "approve", label: "Approve", labelTh: "อนุมัติ", hint: "สิทธิ์ในการอนุมัติคำขอ แผนพัฒนา หรือผลการประเมิน" },
  { key: "export", label: "Export", labelTh: "ส่งออก", hint: "สิทธิ์ในการดาวน์โหลดรายงาน CSV / PDF" },
];

export const HRD_MODULES_FOR_RBAC: HrdModuleDef[] = [
  { id: "m01", code: "01", name: "แดชบอร์ด HRD (Dashboard)" },
  { id: "m02", code: "02", name: "ประเมินผลการปฏิบัติงาน (PMS)" },
  { id: "m03", code: "03", name: "การจัดการฝึกอบรม (Training)" },
  { id: "m04", code: "04", name: "ระบบเรียนรู้ออนไลน์ (LMS)" },
  { id: "m05", code: "05", name: "สมรรถนะและทักษะ (Competency)" },
  { id: "m06", code: "06", name: "แผนพัฒนารายบุคคล (IDP)" },
  { id: "m07", code: "07", name: "เส้นทางสายอาชีพ (Career Path)" },
  { id: "m08", code: "08", name: "Talent และผู้สืบทอดตำแหน่ง" },
  { id: "m09", code: "09", name: "รายงาน HRD (Reports)" },
  { id: "m10", code: "10", name: "ตั้งค่าระบบและสิทธิ์ (Settings & RBAC)" },
];

const ALL_ACTIONS: PermissionAction[] = ["view", "create", "edit", "delete", "approve", "export"];

function buildFullPerms(): Record<string, PermissionAction[]> {
  const map: Record<string, PermissionAction[]> = {};
  HRD_MODULES_FOR_RBAC.forEach((m) => {
    map[m.id] = [...ALL_ACTIONS];
  });
  return map;
}

export const INITIAL_ROLES: RoleDefinition[] = [
  {
    id: "role-admin",
    code: "ROLE-ADMIN",
    name: "Admin (ผู้ดูแลระบบ HRD)",
    description: "สิทธิ์เต็มทุกโมดูลในระบบ HRD รวมการตั้งค่าข้อมูลหลักและจัดการสิทธิ์ผู้ใช้งาน",
    isSystem: true,
    isProtectedAdmin: true,
    active: true,
    usersCount: 3,
    permissions: buildFullPerms(),
  },
  {
    id: "role-manager",
    code: "ROLE-MGR",
    name: "Manager (หัวหน้างาน)",
    description: "ดูแลผลการประเมิน อนุมัติคำขออบรม ติดตาม IDP และประเมินสมรรถนะลูกทีมในสังกัด",
    isSystem: true,
    active: true,
    usersCount: 28,
    permissions: {
      m01: ["view"],
      m02: ["view", "create", "edit", "approve"],
      m03: ["view", "approve"],
      m04: ["view"],
      m05: ["view", "edit"],
      m06: ["view", "edit", "approve"],
      m07: ["view", "edit"],
      m08: ["view", "create"],
      m09: ["view", "export"],
      m10: [],
    },
  },
  {
    id: "role-employee",
    code: "ROLE-EMP",
    name: "Employee (พนักงาน)",
    description: "เข้าใช้งานบริการตนเอง (ESS) เรียน LMS ส่งคำขออบรม ดูผลประเมิน และอัปเดต IDP ตนเอง",
    isSystem: true,
    active: true,
    usersCount: 445,
    permissions: {
      m01: ["view"],
      m02: ["view", "edit"],
      m03: ["view", "create"],
      m04: ["view"],
      m05: ["view"],
      m06: ["view", "create", "edit"],
      m07: ["view"],
      m08: [],
      m09: [],
      m10: [],
    },
  },
  {
    id: "role-hrd-officer",
    code: "ROLE-HRD",
    name: "HRD Officer (เจ้าหน้าที่พัฒนาบุคลากร)",
    description: "จัดการหลักสูตรฝึกอบรม คอร์ส LMS คลังข้อสอบ ใบประกาศนียบัตร และรายงาน HRD",
    isSystem: false,
    active: true,
    usersCount: 6,
    permissions: {
      m01: ["view", "export"],
      m02: ["view", "create", "edit"],
      m03: ["view", "create", "edit", "delete", "approve", "export"],
      m04: ["view", "create", "edit", "delete", "export"],
      m05: ["view", "create", "edit"],
      m06: ["view", "edit"],
      m07: ["view", "edit"],
      m08: ["view"],
      m09: ["view", "export"],
      m10: ["view"],
    },
  },
];

export const INITIAL_USER_ROLE_MAPPINGS: UserRoleMappingItem[] = [
  {
    id: "UM-01",
    employeeCode: "EMP-00102",
    employeeName: "พิมพ์ชนก วัฒนากูล",
    email: "pimchanok.w@company.co.th",
    position: "HRD Manager",
    department: "ฝ่ายพัฒนาทรัพยากรบุคคล (HRD)",
    roleId: "role-admin",
    assignedDate: "01 ม.ค. 2569",
    status: "active",
  },
  {
    id: "UM-02",
    employeeCode: "EMP-00215",
    employeeName: "ธนกร ศิริสวัสดิ์",
    email: "thanakorn.s@company.co.th",
    position: "Engineering Team Lead",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    roleId: "role-manager",
    assignedDate: "01 ม.ค. 2569",
    status: "active",
  },
  {
    id: "UM-03",
    employeeCode: "EMP-1045",
    employeeName: "ปวีณา เลิศศิริ",
    email: "paweena.l@company.co.th",
    position: "HR Business Partner",
    department: "ฝ่ายทรัพยากรบุคคล",
    roleId: "role-hrd-officer",
    assignedDate: "15 ก.พ. 2569",
    status: "active",
  },
  {
    id: "UM-04",
    employeeCode: "EMP-1024",
    employeeName: "ณัฐพล เจริญสุข",
    email: "nattapol.c@company.co.th",
    position: "Senior Software Engineer",
    department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
    roleId: "role-employee",
    assignedDate: "01 ม.ค. 2569",
    status: "active",
  },
  {
    id: "UM-05",
    employeeCode: "EMP-1088",
    employeeName: "ศิริพร รัตนวงศ์",
    email: "siriporn.r@company.co.th",
    position: "Key Account Manager",
    department: "ฝ่ายขายและการตลาด",
    roleId: "role-manager",
    assignedDate: "10 มี.ค. 2569",
    status: "active",
  },
];

export const INITIAL_RBAC_AUDIT_LOGS: RbacAuditLogItem[] = [
  {
    id: "AUD-01",
    timestamp: "27 พ.ย. 2569 10:15",
    actorName: "พิมพ์ชนก วัฒนากูล",
    actionType: "PERMISSION_CHANGED",
    target: "HRD Officer (ROLE-HRD)",
    detail: "เพิ่มสิทธิ์ Export ในโมดูล 09 รายงาน HRD",
  },
  {
    id: "AUD-02",
    timestamp: "26 พ.ย. 2569 16:40",
    actorName: "พิมพ์ชนก วัฒนากูล",
    actionType: "USER_ASSIGNED",
    target: "ปวีณา เลิศศิริ (EMP-1045)",
    detail: "เปลี่ยนบทบาทเป็น HRD Officer (เจ้าหน้าที่พัฒนาบุคลากร)",
  },
  {
    id: "AUD-03",
    timestamp: "25 พ.ย. 2569 09:20",
    actorName: "พิมพ์ชนก วัฒนากูล",
    actionType: "ROLE_CREATED",
    target: "HRD Officer (ROLE-HRD)",
    detail: "สร้างบทบาทใหม่สำหรับทีมเจ้าหน้าที่พัฒนาบุคลากร",
  },
];
