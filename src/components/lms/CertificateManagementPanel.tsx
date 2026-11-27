"use client";

import { useMemo, useState } from "react";
import { Award, Eye, FolderOpen, Plus, Printer } from "lucide-react";
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
  CertificateStatus,
  LmsCertificateItem,
} from "@/data/mock/lmsAssessment";

interface CertificateManagementPanelProps {
  items: LmsCertificateItem[];
  onChange: (items: LmsCertificateItem[]) => void;
  onNotify: (message: string) => void;
}

const PAGE_SIZE = 5;

const CERT_STATUS_META: Record<
  CertificateStatus,
  { label: string; variant: "success" | "warning" | "danger"; hint: string }
> = {
  valid: { label: "ใช้งานได้", variant: "success", hint: "ใบรับรองยังมีผลบังคับใช้ตามมาตรฐานองค์กร" },
  expiring: { label: "ใกล้หมดอายุ", variant: "warning", hint: "จะหมดอายุภายใน 30 วัน ควรแจ้งพนักงานเรียนทบทวน" },
  expired: { label: "หมดอายุแล้ว", variant: "danger", hint: "ใบรับรองหมดอายุแล้ว ต้องลงทะเบียนสอบต่ออายุใหม่" },
};

export function CertificateManagementPanel({
  items,
  onChange,
  onNotify,
}: CertificateManagementPanelProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | CertificateStatus>("all");
  const [page, setPage] = useState(1);

  const [previewCert, setPreviewCert] = useState<LmsCertificateItem | null>(null);
  const [issueModalOpen, setIssueModalOpen] = useState(false);

  const [empName, setEmpName] = useState("");
  const [empCode, setEmpCode] = useState("EMP-1130");
  const [department, setDepartment] = useState("ฝ่ายวิศวกรรมซอฟต์แวร์");
  const [courseTitle, setCourseTitle] = useState("Generative AI Essentials for Everyday Work");
  const [score, setScore] = useState("92");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchStatus = statusFilter === "all" || item.status === statusFilter;
      const matchQuery =
        !q ||
        item.certCode.toLowerCase().includes(q) ||
        item.employeeName.toLowerCase().includes(q) ||
        item.courseTitle.toLowerCase().includes(q);
      return matchStatus && matchQuery;
    });
  }, [items, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleIssue = () => {
    if (!empName.trim()) return;
    const created: LmsCertificateItem = {
      id: `CRT-${Date.now()}`,
      certCode: `CERT-2569-${String(485 + items.length)}`,
      employeeCode: empCode.trim() || "EMP-1130",
      employeeName: empName.trim(),
      department: department.trim() || "ฝ่ายพัฒนาทรัพยากรบุคคล",
      position: "พนักงาน",
      courseTitle: courseTitle.trim() || "หลักสูตรออนไลน์",
      score: Math.min(100, Math.max(80, Number(score) || 90)),
      issuedDate: "วันนี้",
      expiryDate: "1 ปีถัดไป",
      status: "valid",
    };
    onChange([created, ...items]);
    setEmpName("");
    setPage(1);
    setIssueModalOpen(false);
    onNotify(`ออกใบประกาศนียบัตร ${created.certCode} ให้ "${created.employeeName}" แล้ว`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <SearchBar
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="ค้นหารหัสใบรับรอง ชื่อพนักงาน หรือคอร์ส..."
            containerClassName="w-full sm:w-64"
          />
          <Select
            value={statusFilter}
            onChange={(v) => {
              setStatusFilter(v as "all" | CertificateStatus);
              setPage(1);
            }}
            options={[
              { value: "all", label: "ทุกสถานะใบรับรอง" },
              { value: "valid", label: "ใช้งานได้" },
              { value: "expiring", label: "ใกล้หมดอายุ" },
              { value: "expired", label: "หมดอายุแล้ว" },
            ]}
            className="w-full sm:w-44"
          />
        </div>

        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setIssueModalOpen(true)}>
          ออกใบประกาศนียบัตร
        </Button>
      </div>

      {paged.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="ไม่พบใบประกาศนียบัตรที่ค้นหา"
          description="ลองปรับคำค้นหาหรือตัวกรองสถานะ"
        />
      ) : (
        <>
          <TableContainer className="rounded-xl border border-[#EEF2F6]">
            <Table>
              <TableHeader className="bg-[#F8FAFC]">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-5">รหัสใบรับรอง / ผู้ได้รับ</TableHead>
                  <TableHead>หลักสูตรที่ผ่านการรับรอง</TableHead>
                  <TableHead className="w-24 text-center">คะแนน</TableHead>
                  <TableHead className="w-40 text-center">วันที่ออก / หมดอายุ</TableHead>
                  <TableHead className="w-32 text-center">สถานะ</TableHead>
                  <TableHead className="w-28 pr-5 text-center">ดูใบรับรอง</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((item) => {
                  const st = CERT_STATUS_META[item.status];
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="py-3.5 pl-5">
                        <span className="rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                          {item.certCode}
                        </span>
                        <p className="mt-1 font-semibold text-[#1E293B]">{item.employeeName}</p>
                        <p className="text-xs text-[#94A3B8]">
                          {item.employeeCode} • {item.department}
                        </p>
                      </TableCell>
                      <TableCell className="py-3.5 font-medium text-[#1E293B]">
                        {item.courseTitle}
                      </TableCell>
                      <TableCell className="py-3.5 text-center tabular-nums font-bold text-[#1CA388]">
                        {item.score}%
                      </TableCell>
                      <TableCell className="py-3.5 text-center text-xs">
                        <p className="font-medium text-[#1E293B]">{item.issuedDate}</p>
                        <p className="text-[#94A3B8]">หมดอายุ {item.expiryDate}</p>
                      </TableCell>
                      <TableCell className="py-3.5 text-center">
                        <Tooltip title={`สถานะ: ${st.label}`} content={st.hint}>
                          <Badge variant={st.variant} dot className="cursor-help">
                            {st.label}
                          </Badge>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="py-3.5 pr-5 text-center">
                        <Tooltip content="เปิดดูตัวอย่างและพิมพ์ใบประกาศนียบัตร">
                          <Button
                            size="sm"
                            variant="outline"
                            leftIcon={<Eye className="h-3.5 w-3.5 text-[#2563EB]" />}
                            onClick={() => setPreviewCert(item)}
                          >
                            ดูใบรับรอง
                          </Button>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <Pagination
            currentPage={currentPage}
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </>
      )}

      {/* Certificate Preview Modal */}
      <Modal
        open={Boolean(previewCert)}
        onClose={() => setPreviewCert(null)}
        size="lg"
        title={`ตัวอย่างใบประกาศนียบัตร — ${previewCert?.certCode ?? ""}`}
        footer={
          <>
            <Button variant="outline" onClick={() => setPreviewCert(null)}>
              ปิดหน้าต่าง
            </Button>
            <Button leftIcon={<Printer className="h-4 w-4" />} onClick={() => window.print()}>
              พิมพ์ / บันทึก PDF
            </Button>
          </>
        }
      >
        {previewCert && (
          <div className="space-y-4 rounded-2xl border-2 border-[#BFDBFE] bg-gradient-to-b from-[#EFF6FF]/60 via-white to-[#F8FAFC] p-6 text-center sm:p-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2563EB] text-white">
              <Award className="h-6 w-6" />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#2563EB]">
              Certificate of Completion • HRD LMS
            </p>
            <h3 className="text-xl font-extrabold text-[#1E293B]">
              ใบประกาศนียบัตรผ่านการอบรมออนไลน์
            </h3>
            <p className="text-xs text-[#64748B]">ขอมอบให้ไว้เพื่อแสดงว่า</p>
            <div>
              <p className="text-lg font-extrabold text-[#2563EB]">{previewCert.employeeName}</p>
              <p className="text-xs text-[#64748B]">
                {previewCert.position} • {previewCert.department}
              </p>
            </div>
            <div className="inline-block rounded-xl border border-[#DBEAFE] bg-white px-5 py-3">
              <p className="text-sm font-bold text-[#1E293B]">{previewCert.courseTitle}</p>
              <p className="mt-0.5 text-xs text-[#64748B]">
                เลขที่: {previewCert.certCode} • คะแนนสอบ:{" "}
                <strong className="text-[#1CA388]">{previewCert.score}/100</strong>
              </p>
            </div>
            <p className="text-xs text-[#94A3B8]">
              ออกให้เมื่อ {previewCert.issuedDate} • มีผลถึง {previewCert.expiryDate}
            </p>
          </div>
        )}
      </Modal>

      {/* Issue Certificate Modal */}
      <Modal
        open={issueModalOpen}
        onClose={() => setIssueModalOpen(false)}
        title="ออกใบประกาศนียบัตรเพิ่มเติม"
        footer={
          <>
            <Button variant="outline" onClick={() => setIssueModalOpen(false)}>
              ยกเลิก
            </Button>
            <Button disabled={!empName.trim()} onClick={handleIssue}>
              ยืนยันออกใบรับรอง
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input
              label="รหัสพนักงาน"
              value={empCode}
              onChange={(e) => setEmpCode(e.target.value)}
            />
            <div className="sm:col-span-2">
              <Input
                label="ชื่อ–นามสกุลพนักงาน"
                placeholder="เช่น กิตติศักดิ์ วงศ์สุวรรณ"
                value={empName}
                onChange={(e) => setEmpName(e.target.value)}
                required
              />
            </div>
          </div>
          <Input
            label="แผนก"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <Input
                label="หลักสูตรที่ผ่านการรับรอง"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
              />
            </div>
            <Input
              label="คะแนนสอบ (%)"
              type="number"
              min={80}
              max={100}
              value={score}
              onChange={(e) => setScore(e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
