"use client";

import { useMemo, useState } from "react";
import { Award, CheckCircle2, FolderOpen, Plus, RefreshCw } from "lucide-react";
import {
  Badge,
  Button,
  EmptyState,
  Input,
  Modal,
  Pagination,
  SearchBar,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
} from "@/components/ui";
import type {
  CertStatus,
  SkillCertificationItem,
} from "@/data/mock/skillAnalytics";

interface SkillCertificationPanelProps {
  items: SkillCertificationItem[];
  onChange: (items: SkillCertificationItem[]) => void;
  onNotify: (message: string) => void;
}

const PAGE_SIZE = 5;

const CERT_STATUS_META: Record<CertStatus, { label: string; variant: "success" | "warning" | "danger" }> = {
  valid: { label: "ใช้งานได้", variant: "success" },
  expiring: { label: "ใกล้หมดอายุ", variant: "warning" },
  expired: { label: "หมดอายุแล้ว", variant: "danger" },
};

export function SkillCertificationPanel({
  items,
  onChange,
  onNotify,
}: SkillCertificationPanelProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | CertStatus>("all");
  const [page, setPage] = useState(1);

  const [addOpen, setAddOpen] = useState(false);
  const [formEmpName, setFormEmpName] = useState("ณัฐพล เจริญสุข");
  const [formDept, setFormDept] = useState("ฝ่ายวิศวกรรมซอฟต์แวร์");
  const [formCertName, setFormCertName] = useState("");
  const [formIssuer, setFormIssuer] = useState("");
  const [formSkillTag, setFormSkillTag] = useState("Cloud & Cyber Security");
  const [formCredentialNo, setFormCredentialNo] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (!q) return true;
      return (
        item.code.toLowerCase().includes(q) ||
        item.employeeName.toLowerCase().includes(q) ||
        item.certName.toLowerCase().includes(q) ||
        item.issuer.toLowerCase().includes(q) ||
        item.credentialNo.toLowerCase().includes(q)
      );
    });
  }, [items, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleAddCert = () => {
    if (!formCertName.trim() || !formIssuer.trim()) return;
    const nextNum = String(items.length + 1).padStart(2, "0");
    const created: SkillCertificationItem = {
      id: `SC-${Date.now()}`,
      code: `CRT-69-${nextNum}`,
      employeeCode: "EMP-1024",
      employeeName: formEmpName.trim() || "พนักงานองค์กร",
      department: formDept.trim() || "ฝ่ายวิศวกรรมซอฟต์แวร์",
      certName: formCertName.trim(),
      issuer: formIssuer.trim(),
      skillTag: formSkillTag,
      issueDate: "27 พ.ย. 2569",
      expiryDate: "27 พ.ย. 2572",
      credentialNo: formCredentialNo.trim() || `CERT-${Math.floor(100000 + Math.random() * 900000)}`,
      status: "valid",
    };
    onChange([created, ...items]);
    onNotify(`บันทึกใบรับรอง "${created.certName}" เรียบร้อยแล้ว`);
    setAddOpen(false);
    setFormCertName("");
    setFormIssuer("");
    setFormCredentialNo("");
  };

  const handleRenew = (item: SkillCertificationItem) => {
    onChange(
      items.map((row) =>
        row.id === item.id
          ? {
              ...row,
              issueDate: "27 พ.ย. 2569",
              expiryDate: "27 พ.ย. 2572",
              status: "valid",
            }
          : row
      )
    );
    onNotify(`ต่ออายุใบรับรอง "${item.certName}" ของ ${item.employeeName} ถึงปี 2572 แล้ว`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          <SearchBar
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="ค้นหาพนักงาน, ชื่อใบรับรอง, สถาบัน หรือเลขที่ใบรับรอง..."
            className="w-full sm:w-80"
          />
          <Select
            aria-label="กรองตามสถานะใบรับรอง"
            value={statusFilter}
            onChange={(v) => {
              setStatusFilter(v as "all" | CertStatus);
              setPage(1);
            }}
            options={[
              { value: "all", label: "สถานะ: ทั้งหมด" },
              { value: "valid", label: "ใช้งานได้" },
              { value: "expiring", label: "ใกล้หมดอายุ" },
              { value: "expired", label: "หมดอายุแล้ว" },
            ]}
            className="w-44"
          />
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setAddOpen(true)}
        >
          บันทึกใบรับรองใหม่
        </Button>
      </div>

      {paged.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="ไม่พบประวัติใบรับรองทักษะ"
          description="ลองปรับคำค้นหาหรือเพิ่มประวัติใบรับรองวิชาชีพใหม่"
        />
      ) : (
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[22%]">รหัส / พนักงาน</TableHead>
                <TableHead className="w-[28%]">ใบรับรองวิชาชีพ / สถาบัน</TableHead>
                <TableHead className="w-[16%]">หมวดทักษะ</TableHead>
                <TableHead className="w-[12%] text-center">วันหมดอายุ</TableHead>
                <TableHead className="w-[11%] text-center">สถานะ</TableHead>
                <TableHead className="w-[11%] text-center">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map((item) => {
                const sMeta = CERT_STATUS_META[item.status];
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <span className="inline-block rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                        {item.code}
                      </span>
                      <div className="mt-1 font-semibold text-[#1E293B]">{item.employeeName}</div>
                      <div className="text-xs text-[#64748B]">{item.department}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start gap-2">
                        <Award className="mt-0.5 h-4 w-4 shrink-0 text-[#2563EB]" />
                        <div className="min-w-0">
                          <div className="font-semibold text-[#1E293B]">{item.certName}</div>
                          <div className="text-xs text-[#64748B]">
                            {item.issuer} •{" "}
                            <span className="font-mono text-[11px] text-[#94A3B8]">
                              {item.credentialNo}
                            </span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="primary">{item.skillTag}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="text-xs font-semibold text-[#1E293B]">{item.expiryDate}</div>
                      <div className="text-[11px] text-[#94A3B8]">ออกเมื่อ {item.issueDate}</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Tooltip
                        content={
                          item.status === "valid"
                            ? `ใบรับรองใช้งานได้ปกติ ถึงวันที่ ${item.expiryDate}`
                            : item.status === "expiring"
                              ? `ใกล้หมดอายุ (${item.expiryDate}) ควรวางแผนต่ออายุล่วงหน้า`
                              : `หมดอายุแล้วตั้งแต่ ${item.expiryDate} กรุณาดำเนินการต่ออายุ`
                        }
                      >
                        <Badge variant={sMeta.variant} dot>
                          {sMeta.label}
                        </Badge>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        {item.status !== "valid" ? (
                          <Tooltip content="บันทึกการต่ออายุใบรับรองรอบใหม่ (+3 ปี)">
                            <Button
                              size="sm"
                              variant="outline"
                              leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
                              onClick={() => handleRenew(item)}
                              className="w-[96px] justify-center"
                            >
                              ต่ออายุ
                            </Button>
                          </Tooltip>
                        ) : (
                          <span className="inline-flex w-[96px] items-center justify-center text-xs font-medium text-emerald-600">
                            ปกติ
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={safePage}
          onPageChange={setPage}
          totalItems={filtered.length}
          pageSize={PAGE_SIZE}
        />
      )}

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="บันทึกประวัติใบรับรองทักษะใหม่"
        description="เพิ่มใบรับรองวิชาชีพหรือทักษะเฉพาะทางของพนักงานเพื่อเก็บประวัติและติดตามวันหมดอายุ"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              ยกเลิก
            </Button>
            <Button
              variant="primary"
              leftIcon={<CheckCircle2 className="h-4 w-4" />}
              onClick={handleAddCert}
              disabled={!formCertName.trim() || !formIssuer.trim()}
            >
              บันทึกใบรับรอง
            </Button>
          </>
        }
      >
        <div className="space-y-3.5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              label="ชื่อพนักงาน"
              value={formEmpName}
              onChange={(e) => setFormEmpName(e.target.value)}
            />
            <Input
              label="แผนก"
              value={formDept}
              onChange={(e) => setFormDept(e.target.value)}
            />
          </div>
          <Input
            label="ชื่อใบรับรอง (Certification Name)"
            placeholder="เช่น Google Cloud Professional Architect"
            value={formCertName}
            onChange={(e) => setFormCertName(e.target.value)}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              label="สถาบันผู้ออกใบรับรอง"
              placeholder="เช่น Google Cloud / PMI / AWS"
              value={formIssuer}
              onChange={(e) => setFormIssuer(e.target.value)}
            />
            <Input
              label="เลขที่ใบรับรอง (Credential ID)"
              placeholder="เช่น GCP-PRO-99124"
              value={formCredentialNo}
              onChange={(e) => setFormCredentialNo(e.target.value)}
            />
          </div>
          <Select
            label="หมวดทักษะที่เกี่ยวข้อง"
            value={formSkillTag}
            onChange={setFormSkillTag}
            options={[
              { value: "Cloud & Cyber Security", label: "Cloud & Cyber Security" },
              { value: "Data Analytics & AI Literacy", label: "Data Analytics & AI Literacy" },
              { value: "People Leadership & Coaching", label: "People Leadership & Coaching" },
              { value: "Agile & Project Delivery", label: "Agile & Project Delivery" },
              { value: "Customer & Business Consulting", label: "Customer & Business Consulting" },
            ]}
          />
        </div>
      </Modal>
    </div>
  );
}
