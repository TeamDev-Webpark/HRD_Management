"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Briefcase,
  Building2,
  CheckCircle2,
  Database,
  FolderOpen,
  Lock,
  RefreshCw,
  Users,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  InfoHint,
  SearchBar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
} from "@/components/ui";
import {
  HRM_DEPARTMENTS_REF,
  HRM_EMPLOYEES_REF,
  HRM_POSITIONS_REF,
} from "@/data/mock/hrmReference";

type HrmTabKey = "employees" | "departments" | "positions";
const VALID_TABS: HrmTabKey[] = ["employees", "departments", "positions"];

const TAB_META: Record<HrmTabKey, { title: string; subtitle: string; hint: string }> = {
  employees: {
    title: "ทะเบียนพนักงานอ้างอิงจาก HRM (Read-Only)",
    subtitle: "ข้อมูลพนักงานหลักที่ซิงค์จากระบบ HRM เพื่อใช้อ้างอิงร่วมกันทุกโมดูลในระบบ HRD",
    hint: "ระบบ HRD อ่านข้อมูลพนักงานจาก HRM แบบ Read-Only ไม่ต้องกรอกซ้ำซ้อนและอัปเดตตรงกันเสมอ",
  },
  departments: {
    title: "โครงสร้างองค์กรและแผนก (HRM Organization)",
    subtitle: "รายชื่อฝ่ายงาน สาขา หัวหน้าหน่วยงาน และรหัส Cost Center ที่ซิงค์มาจากระบบ HRM",
    hint: "ใช้เป็นโครงสร้างอ้างอิงสำหรับจัดสรรงบประมาณอบรม รายงานรายแผนก และสิทธิ์การเข้าถึง",
  },
  positions: {
    title: "ตำแหน่งงานและ Job Grade (HRM Positions)",
    subtitle: "ทะเบียนตำแหน่งงาน ระดับ Job Grade และกรอบอัตรากำลังที่เชื่อมต่อกับ Competency & Career Path",
    hint: "ตำแหน่งและ Job Grade จาก HRM ถูกนำไปใช้ผูกสมรรถนะประจำตำแหน่งและขั้นบันไดสายอาชีพ",
  },
};

export function HrmReferenceWorkspace() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as HrmTabKey | null;
  const activeTab: HrmTabKey =
    tabParam && VALID_TABS.includes(tabParam) ? tabParam : "employees";

  const [search, setSearch] = useState("");
  const [lastSynced, setLastSynced] = useState("27 พ.ย. 2569 09:00 น.");
  const [syncing, setSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      setLastSynced(`27 พ.ย. 2569 ${hh}:${mm} น.`);
      setSyncing(false);
      setToastMessage("ซิงค์ข้อมูลพนักงาน โครงสร้างแผนก และตำแหน่งจากระบบ HRM สำเร็จแล้ว");
      setTimeout(() => setToastMessage(null), 3200);
    }, 400);
  };

  const filteredEmployees = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return HRM_EMPLOYEES_REF;
    return HRM_EMPLOYEES_REF.filter(
      (e) =>
        e.employeeCode.toLowerCase().includes(q) ||
        e.name.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q) ||
        e.position.toLowerCase().includes(q)
    );
  }, [search]);

  const filteredDepts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return HRM_DEPARTMENTS_REF;
    return HRM_DEPARTMENTS_REF.filter(
      (d) =>
        d.code.toLowerCase().includes(q) ||
        d.name.toLowerCase().includes(q) ||
        d.headName.toLowerCase().includes(q)
    );
  }, [search]);

  const filteredPositions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return HRM_POSITIONS_REF;
    return HRM_POSITIONS_REF.filter(
      (p) =>
        p.code.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.department.toLowerCase().includes(q) ||
        p.jobGrade.toLowerCase().includes(q)
    );
  }, [search]);

  const totalHeadcount = HRM_DEPARTMENTS_REF.reduce((a, d) => a + d.headcount, 0);
  const kpiCards = [
    {
      label: "พนักงานทั้งหมด (HRM)",
      value: `${totalHeadcount} คน`,
      sub: "ซิงค์จากฐานข้อมูลกลาง HRM",
      icon: <Users className="h-5 w-5" />,
      color: "bg-[#EEF4FF] text-[#2563EB]",
    },
    {
      label: "ฝ่ายงาน / แผนกหลัก",
      value: `${HRM_DEPARTMENTS_REF.length} แผนก`,
      sub: "ครอบคลุมสำนักงานใหญ่และสาขา",
      icon: <Building2 className="h-5 w-5" />,
      color: "bg-[#DCFCE7] text-[#16A34A]",
    },
    {
      label: "ตำแหน่งงานอ้างอิง",
      value: `${HRM_POSITIONS_REF.length} ตำแหน่งหลัก`,
      sub: "เชื่อมกับ Job Grade & Career Path",
      icon: <Briefcase className="h-5 w-5" />,
      color: "bg-[#F3E8FF] text-[#7C3AED]",
    },
    {
      label: "สถานะการเชื่อมต่อ HRM",
      value: "เชื่อมต่อปกติ",
      sub: `ซิงค์ล่าสุด ${lastSynced}`,
      icon: <Database className="h-5 w-5" />,
      color: "bg-[#FEF3C7] text-[#D97706]",
    },
  ];

  const meta = TAB_META[activeTab];

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold text-[#1E293B]">{meta.title}</h1>
            <InfoHint content={meta.hint} />
            <Tooltip content="ข้อมูลชุดนี้ดึงมาจากระบบ HRM เพื่อใช้อ้างอิงเท่านั้น (แก้ไขได้ที่ระบบ HRM)">
              <Badge variant="neutral">
                <Lock className="mr-1 inline h-3 w-3" /> Read-Only
              </Badge>
            </Tooltip>
          </div>
          <p className="text-sm text-[#64748B]">{meta.subtitle}</p>
        </div>

        <Tooltip content="ดึงข้อมูลพนักงาน แผนก และตำแหน่งล่าสุดจากระบบ HRM (Mock Sync)">
          <Button
            variant="primary"
            leftIcon={<RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />}
            onClick={handleSync}
            disabled={syncing}
          >
            {syncing ? "กำลังซิงค์..." : "ซิงค์ข้อมูลจาก HRM"}
          </Button>
        </Tooltip>
      </div>

      {/* 4 White KPI Cards with Hover Tooltips */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((kpi) => (
          <Tooltip
            key={kpi.label}
            className="block w-full"
            title={kpi.label}
            content={`${kpi.value} — ${kpi.sub}`}
          >
            <Card className="flex items-start justify-between gap-3 p-5 transition-colors hover:border-[#DCE6F5]">
              <div className="min-w-0">
                <div className="text-xs font-medium text-[#64748B]">{kpi.label}</div>
                <div className="mt-1.5 text-2xl font-bold tracking-tight text-[#1E293B]">
                  {kpi.value}
                </div>
                <div className="mt-1 text-xs text-[#94A3B8]">{kpi.sub}</div>
              </div>
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${kpi.color}`}
              >
                {kpi.icon}
              </div>
            </Card>
          </Tooltip>
        ))}
      </div>

      {toastMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700 shadow-xs">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <Card className="space-y-4 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="ค้นหารหัส, ชื่อพนักงาน, แผนก หรือตำแหน่งงาน..."
            className="w-full sm:w-80"
          />
          <span className="text-xs text-[#64748B]">ซิงค์ข้อมูลล่าสุดเมื่อ: {lastSynced}</span>
        </div>

        {activeTab === "employees" &&
          (filteredEmployees.length === 0 ? (
            <EmptyState
              icon={<FolderOpen className="h-6 w-6" />}
              title="ไม่พบข้อมูลพนักงาน"
              description="ลองปรับคำค้นหาใหม่"
            />
          ) : (
            <TableContainer>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[24%]">รหัส / ชื่อพนักงาน</TableHead>
                    <TableHead className="w-[24%]">ตำแหน่งและแผนก</TableHead>
                    <TableHead className="w-[10%] text-center">Grade</TableHead>
                    <TableHead className="w-[18%]">ผู้บังคับบัญชา</TableHead>
                    <TableHead className="w-[12%] text-center">วันเริ่มงาน</TableHead>
                    <TableHead className="w-[12%] text-center">สถานะ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((emp) => (
                    <TableRow key={emp.id}>
                      <TableCell>
                        <span className="inline-block rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                          {emp.employeeCode}
                        </span>
                        <div className="mt-1 font-semibold text-[#1E293B]">{emp.name}</div>
                        <div className="text-xs text-[#64748B]">{emp.email}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-[#1E293B]">{emp.position}</div>
                        <div className="text-xs text-[#64748B]">{emp.department}</div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Tooltip content={`ระดับตำแหน่ง ${emp.jobGrade} (${emp.employmentType})`}>
                          <Badge variant="primary">{emp.jobGrade}</Badge>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="text-xs font-medium text-[#475569]">
                        {emp.managerName}
                      </TableCell>
                      <TableCell className="text-center text-xs text-[#64748B]">
                        {emp.startDate}
                      </TableCell>
                      <TableCell className="text-center">
                        <Tooltip
                          content={
                            emp.status === "active"
                              ? "พนักงานปฏิบัติงานปกติ (ซิงค์จาก HRM)"
                              : "อยู่ระหว่างช่วงทดลองงาน (Probation)"
                          }
                        >
                          <Badge variant={emp.status === "active" ? "success" : "warning"} dot>
                            {emp.status === "active" ? "ปฏิบัติงาน" : "ทดลองงาน"}
                          </Badge>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ))}

        {activeTab === "departments" && (
          <TableContainer>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[28%]">รหัส / ชื่อแผนก</TableHead>
                  <TableHead className="w-[22%]">สาขา / สถานที่</TableHead>
                  <TableHead className="w-[20%]">หัวหน้าหน่วยงาน</TableHead>
                  <TableHead className="w-[14%] text-center">Cost Center</TableHead>
                  <TableHead className="w-[16%] text-center">จำนวนพนักงาน</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDepts.map((dept) => (
                  <TableRow key={dept.id}>
                    <TableCell>
                      <span className="inline-block rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                        {dept.code}
                      </span>
                      <div className="mt-1 font-semibold text-[#1E293B]">{dept.name}</div>
                    </TableCell>
                    <TableCell className="text-xs text-[#475569]">{dept.branch}</TableCell>
                    <TableCell className="text-sm font-medium text-[#1E293B]">
                      {dept.headName}
                    </TableCell>
                    <TableCell className="text-center">
                      <Tooltip content="รหัสศูนย์ต้นทุนสำหรับตัดงบประมาณฝึกอบรมของแผนก">
                        <Badge variant="neutral">{dept.costCenter}</Badge>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="text-center font-semibold text-[#2563EB]">
                      {dept.headcount} คน
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {activeTab === "positions" && (
          <TableContainer>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[28%]">รหัส / ตำแหน่งงาน</TableHead>
                  <TableHead className="w-[24%]">แผนกต้นสังกัด</TableHead>
                  <TableHead className="w-[12%] text-center">Job Grade</TableHead>
                  <TableHead className="w-[16%] text-center">กลุ่มระดับ</TableHead>
                  <TableHead className="w-[20%] text-center">อัตรากำลัง (จริง / แผน)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPositions.map((pos) => (
                  <TableRow key={pos.id}>
                    <TableCell>
                      <span className="inline-block rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                        {pos.code}
                      </span>
                      <div className="mt-1 font-semibold text-[#1E293B]">{pos.title}</div>
                    </TableCell>
                    <TableCell className="text-xs text-[#475569]">{pos.department}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="primary">{pos.jobGrade}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Tooltip content={`กลุ่มระดับตำแหน่ง ${pos.levelGroup} ตามโครงสร้าง HRM`}>
                        <Badge variant="neutral">{pos.levelGroup}</Badge>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="text-center font-semibold text-[#1E293B]">
                      {pos.filledCount} / {pos.plannedHeadcount} อัตรา
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>
    </div>
  );
}
