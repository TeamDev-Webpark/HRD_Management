"use client";

import { useState } from "react";
import {
  Award,
  BellRing,
  CheckCircle2,
  ChevronRight,
  Pencil,
  QrCode,
  Save,
} from "lucide-react";
import {
  Badge,
  Button,
  Input,
  Modal,
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
import {
  WORKFLOW_CHAIN_OPTIONS,
  type CertificateConfig,
  type WorkflowRule,
} from "@/data/mock/hrdSettings";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}

function ToggleSwitch({ checked, onChange, label, description }: ToggleSwitchProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-[#F7F9FC] px-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-[#1E293B]">{label}</p>
        {description && <p className="text-xs text-[#94A3B8]">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
          checked ? "bg-[#2563EB]" : "bg-[#CBD5E1]"
        }`}
      >
        <span
          className={`inline-block h-4.5 w-4.5 rounded-full bg-white shadow-xs transition-transform ${
            checked ? "translate-x-5.5" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

interface CertificateSettingsPanelProps {
  config: CertificateConfig;
  onChange: (config: CertificateConfig) => void;
  onNotify: (message: string) => void;
}

export function CertificateSettingsPanel({
  config,
  onChange,
  onNotify,
}: CertificateSettingsPanelProps) {
  const [draft, setDraft] = useState<CertificateConfig>(config);

  const handleSave = () => {
    onChange(draft);
    onNotify("บันทึกการตั้งค่าใบประกาศนียบัตรเรียบร้อยแล้ว");
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-bold text-[#1E293B]">
            ตั้งค่าใบประกาศนียบัตร (Certificate Settings)
          </h3>
          <p className="mt-0.5 text-xs text-[#94A3B8]">
            กำหนดรูปแบบรหัสใบรับรอง เกณฑ์การออกอัตโนมัติ และข้อมูลผู้ลงนามบนใบประกาศนียบัตร
          </p>
        </div>
        <Button size="sm" leftIcon={<Save className="h-4 w-4" />} onClick={handleSave}>
          บันทึกการตั้งค่า
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Left: Form Settings */}
        <div className="space-y-4 xl:col-span-7">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="คำนำหน้ารหัส (Certificate Prefix)"
              value={draft.prefix}
              onChange={(e) => setDraft({ ...draft, prefix: e.target.value })}
              helperText={`ตัวอย่างรหัส: ${draft.prefix}00482`}
            />
            <Input
              label="คะแนนสอบผ่านขั้นต่ำ (%)"
              type="number"
              value={draft.minPassScore}
              onChange={(e) => setDraft({ ...draft, minPassScore: Number(e.target.value) })}
              helperText="ใช้สำหรับการออกใบรับรองอัตโนมัติบน LMS"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="อายุใบรับรองมาตรฐาน (เดือน)"
              type="number"
              value={draft.validityMonths}
              onChange={(e) => setDraft({ ...draft, validityMonths: Number(e.target.value) })}
            />
            <Input
              label="แจ้งเตือนก่อนหมดอายุ (วัน)"
              type="number"
              value={draft.expiryReminderDays}
              onChange={(e) => setDraft({ ...draft, expiryReminderDays: Number(e.target.value) })}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="ชื่อผู้ลงนาม (Signatory Name)"
              value={draft.signatoryName}
              onChange={(e) => setDraft({ ...draft, signatoryName: e.target.value })}
            />
            <Input
              label="ตำแหน่งผู้ลงนาม"
              value={draft.signatoryTitle}
              onChange={(e) => setDraft({ ...draft, signatoryTitle: e.target.value })}
            />
          </div>

          <div className="space-y-2.5 pt-1">
            <ToggleSwitch
              checked={draft.autoIssue}
              onChange={(v) => setDraft({ ...draft, autoIssue: v })}
              label="ออกใบประกาศนียบัตรอัตโนมัติเมื่อเรียนจบ"
              description="สร้างไฟล์ PDF และส่งเข้าเมนู My Certificates ของพนักงานทันทีที่ผ่านเกณฑ์"
            />
            <ToggleSwitch
              checked={draft.showQrVerify}
              onChange={(v) => setDraft({ ...draft, showQrVerify: v })}
              label="แสดง QR Code สำหรับตรวจสอบความถูกต้อง"
              description="ให้หัวหน้างานหรือหน่วยงานภายนอกสแกนยืนยันใบรับรองได้"
            />
          </div>
        </div>

        {/* Right: Live Mini Certificate Preview */}
        <div className="xl:col-span-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
            ตัวอย่างใบประกาศนียบัตร (Live Preview)
          </p>
          <div className="relative overflow-hidden rounded-2xl border-2 border-[#DBEAFE] bg-gradient-to-br from-white via-[#F8FAFC] to-[#EFF6FF] p-6 text-center shadow-xs">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#2563EB] text-white shadow-xs">
              <Award className="h-6 w-6" />
            </div>
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-widest text-[#2563EB]">
              Certificate of Completion
            </p>
            <h4 className="mt-1.5 text-base font-bold text-[#1E293B]">ณัฐพล เจริญสุข</h4>
            <p className="mt-1 text-xs text-[#64748B]">
              ผ่านการอบรมหลักสูตร Data Analytics for HR Professionals
            </p>
            <p className="mt-2 font-mono text-[11px] font-semibold text-[#2563EB]">
              {draft.prefix}00482
            </p>

            <div className="mt-5 flex items-end justify-between border-t border-[#E2E8F0] pt-4 text-left">
              <div>
                <p className="text-xs font-semibold text-[#1E293B]">
                  {draft.signatoryName || "ผู้ลงนาม"}
                </p>
                <p className="text-[11px] text-[#64748B]">
                  {draft.signatoryTitle || "ตำแหน่ง"}
                </p>
              </div>
              {draft.showQrVerify && (
                <Tooltip content="QR Code ยืนยันใบรับรอง">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#1E293B]">
                    <QrCode className="h-6 w-6" />
                  </div>
                </Tooltip>
              )}
            </div>

            <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-[#64748B]">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#22B89A]" />
              เกณฑ์ผ่าน {draft.minPassScore}% • อายุรับรอง {draft.validityMonths} เดือน
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface WorkflowSettingsPanelProps {
  rules: WorkflowRule[];
  onChange: (rules: WorkflowRule[]) => void;
  onNotify: (message: string) => void;
}

const WORKFLOW_CODE_TONES = [
  "bg-[#EFF6FF] text-[#2563EB]",
  "bg-[#ECFAF5] text-[#1CA388]",
  "bg-[#F3F0FF] text-[#7C6CF6]",
  "bg-[#FEF9EC] text-[#C68A12]",
];

export function WorkflowSettingsPanel({ rules, onChange, onNotify }: WorkflowSettingsPanelProps) {
  const [editing, setEditing] = useState<WorkflowRule | null>(null);
  const [draftSteps, setDraftSteps] = useState("");
  const [draftSla, setDraftSla] = useState("3");
  const [draftEscalate, setDraftEscalate] = useState(true);

  const openEdit = (rule: WorkflowRule) => {
    setEditing(rule);
    setDraftSteps(rule.steps);
    setDraftSla(String(rule.slaDays));
    setDraftEscalate(rule.autoEscalate);
  };

  const handleSaveEdit = () => {
    if (!editing) return;
    onChange(
      rules.map((r) =>
        r.id === editing.id
          ? {
              ...r,
              steps: draftSteps,
              slaDays: Math.max(1, Number(draftSla) || 1),
              autoEscalate: draftEscalate,
            }
          : r
      )
    );
    onNotify(`อัปเดต Workflow "${editing.moduleName}" เรียบร้อยแล้ว`);
    setEditing(null);
  };

  const toggleActive = (rule: WorkflowRule) => {
    onChange(rules.map((r) => (r.id === rule.id ? { ...r, active: !r.active } : r)));
    onNotify(`${rule.active ? "ปิดใช้งาน" : "เปิดใช้งาน"} "${rule.moduleName}" แล้ว`);
  };

  return (
    <div className="space-y-4">
      <TableContainer className="rounded-xl border border-[#EEF2F6]">
        <Table>
          <TableHeader className="bg-[#F8FAFC]">
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-5">รหัส / รายการ Workflow</TableHead>
              <TableHead>สายการอนุมัติ</TableHead>
              <TableHead className="w-36 text-center">SLA</TableHead>
              <TableHead className="w-24 text-center">ใช้งาน</TableHead>
              <TableHead className="w-24 pr-5 text-center">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.map((rule) => {
              const stepNodes = rule.steps.split("→").map((s) => s.trim());

              return (
                <TableRow key={rule.id} className={!rule.active ? "opacity-60" : ""}>
                  <TableCell className="py-3.5 pl-5">
                    <span className="rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                      {rule.code}
                    </span>
                    <p className="mt-1 font-semibold text-[#1E293B]">{rule.moduleName}</p>
                    <p className="text-xs text-[#94A3B8]">{rule.description}</p>
                  </TableCell>

                  <TableCell className="py-3.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {stepNodes.map((node, stepIdx) => (
                        <div key={`${rule.id}-${stepIdx}`} className="inline-flex items-center gap-1.5">
                          {stepIdx > 0 && <ChevronRight className="h-3.5 w-3.5 text-[#CBD5E1]" />}
                          <span className="inline-flex items-center gap-1 rounded-lg bg-[#F7F9FC] px-2.5 py-1 text-xs font-medium text-[#334155] ring-1 ring-[#EEF2F6]">
                            <span className="text-[11px] font-bold text-[#2563EB]">
                              {stepIdx + 1}.
                            </span>
                            {node}
                          </span>
                        </div>
                      ))}
                    </div>
                  </TableCell>

                  <TableCell className="py-3.5 text-center whitespace-nowrap">
                    <div className="inline-flex items-center gap-2">
                      <Badge variant="neutral" className="tabular-nums font-semibold text-[#1E293B]">
                        {rule.slaDays} วันทำการ
                      </Badge>
                      {rule.autoEscalate && (
                        <Tooltip content="เปิดแจ้งเตือนอัตโนมัติเมื่อเกินกำหนด SLA">
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#EFF6FF] text-[#2563EB] cursor-help">
                            <BellRing className="h-3.5 w-3.5" />
                          </span>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="py-3.5 text-center">
                    <Tooltip
                      content={rule.active ? "กำลังเปิดใช้งาน (คลิกเพื่อปิด)" : "ปิดใช้งานอยู่ (คลิกเพื่อเปิด)"}
                    >
                      <button
                        type="button"
                        role="switch"
                        aria-checked={rule.active}
                        onClick={() => toggleActive(rule)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                          rule.active ? "bg-[#22B89A]" : "bg-[#CBD5E1]"
                        }`}
                      >
                        <span
                          className={`inline-block h-4.5 w-4.5 rounded-full bg-white shadow-xs transition-transform ${
                            rule.active ? "translate-x-5.5" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </Tooltip>
                  </TableCell>

                  <TableCell className="py-3.5 pr-5 text-center">
                    <Tooltip content="ตั้งค่าสายอนุมัติและ SLA">
                      <button
                        type="button"
                        onClick={() => openEdit(rule)}
                        aria-label={`แก้ไข ${rule.moduleName}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#EFF6FF] hover:text-[#2563EB] cursor-pointer"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Focused Edit Workflow Modal */}
      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title={`ตั้งค่า Workflow — ${editing?.moduleName ?? ""}`}
        description={editing ? `${editing.code} • ${editing.description}` : undefined}
        footer={
          <>
            <Button variant="outline" onClick={() => setEditing(null)}>
              ยกเลิก
            </Button>
            <Button leftIcon={<Save className="h-4 w-4" />} onClick={handleSaveEdit}>
              บันทึกการตั้งค่า
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="สายการอนุมัติ (อ้างอิง Reporting Line จาก HRM)"
            value={draftSteps}
            onChange={setDraftSteps}
            options={WORKFLOW_CHAIN_OPTIONS}
          />
          <Input
            label="ระยะเวลาอนุมัติมาตรฐาน (SLA วันทำการ)"
            type="number"
            min={1}
            max={30}
            value={draftSla}
            onChange={(e) => setDraftSla(e.target.value)}
            helperText="จำนวนวันทำการที่ผู้อนุมัติต้องพิจารณาคำขอ"
          />
          <ToggleSwitch
            checked={draftEscalate}
            onChange={setDraftEscalate}
            label="แจ้งเตือนอัตโนมัติเมื่อเกินกำหนด SLA"
            description="ส่ง Notification เตือนผู้อนุมัติและ HRD Admin เมื่อคำขอค้างเกินเวลาที่กำหนด"
          />
        </div>
      </Modal>
    </div>
  );
}
