import type { BadgeVariant } from "@/components/ui/Badge";

export interface ColorSwatch {
  name: string;
  role: string;
  hex: string;
  lightText?: boolean;
  bordered?: boolean;
}

export const DESIGN_PALETTE: ColorSwatch[] = [
  { name: "Primary Blue", role: "ปุ่มหลัก / เมนูที่เลือก", hex: "#2563EB", lightText: true },
  { name: "Light Blue", role: "พื้นหลัง Section เน้น", hex: "#DBEAFE" },
  { name: "Background", role: "พื้นหลังหลักของระบบ", hex: "#F8FAFC", bordered: true },
  { name: "Card / Surface", role: "พื้นผิวการ์ดและตาราง", hex: "#FFFFFF", bordered: true },
  { name: "Border", role: "เส้นแบ่งและขอบ", hex: "#E2E8F0" },
  { name: "Primary Text", role: "หัวข้อและข้อความหลัก", hex: "#1E293B", lightText: true },
  { name: "Secondary Text", role: "คำอธิบายและข้อความรอง", hex: "#64748B", lightText: true },
  { name: "Success", role: "สำเร็จ / อนุมัติแล้ว", hex: "#16A34A", lightText: true },
  { name: "Warning", role: "รอดำเนินการ / เตือน", hex: "#F59E0B", lightText: true },
  { name: "Danger", role: "ข้อผิดพลาด / ปฏิเสธ", hex: "#DC2626", lightText: true },
];

export interface SampleTrainingRow {
  id: string;
  code: string;
  courseName: string;
  category: string;
  department: string;
  hours: number;
  statusLabel: string;
  statusVariant: BadgeVariant;
}

export const SAMPLE_TRAINING_ROWS: SampleTrainingRow[] = [
  {
    id: "1",
    code: "TRN-2026-001",
    courseName: "Leadership for New Managers",
    category: "Leadership",
    department: "ทุกแผนก",
    hours: 12,
    statusLabel: "เปิดรับสมัคร",
    statusVariant: "primary",
  },
  {
    id: "2",
    code: "TRN-2026-002",
    courseName: "Data Analytics for HR Professionals",
    category: "Digital & Data",
    department: "ฝ่ายทรัพยากรบุคคล",
    hours: 6,
    statusLabel: "อนุมัติแล้ว",
    statusVariant: "success",
  },
  {
    id: "3",
    code: "TRN-2026-003",
    courseName: "Effective Communication & Feedback",
    category: "Soft Skill",
    department: "ฝ่ายปฏิบัติการ",
    hours: 6,
    statusLabel: "รออนุมัติ",
    statusVariant: "warning",
  },
  {
    id: "4",
    code: "TRN-2026-004",
    courseName: "PDPA & Information Security Compliance",
    category: "Compliance",
    department: "ทุกแผนก",
    hours: 3,
    statusLabel: "เกินกำหนด",
    statusVariant: "danger",
  },
];

export const SAMPLE_CATEGORY_OPTIONS = [
  { value: "all", label: "ทุกหมวดหมู่" },
  { value: "Leadership", label: "Leadership" },
  { value: "Digital & Data", label: "Digital & Data" },
  { value: "Soft Skill", label: "Soft Skill" },
  { value: "Compliance", label: "Compliance" },
];
