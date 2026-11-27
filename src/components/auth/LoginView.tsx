"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  ShieldCheck,
  Target,
} from "lucide-react";
import { Badge, Button, Input, Modal, Tooltip } from "@/components/ui";
import { useLayout } from "@/context/LayoutContext";
import { DEMO_USERS, ROLE_HOME_ROUTE } from "@/data/mock/layout";
import type { RoleKey } from "@/types/hrd";

const QUICK_ACCOUNTS: {
  role: RoleKey;
  label: string;
  sublabel: string;
  hint: string;
  dotColor: string;
}[] = [
  {
    role: "admin",
    label: "Admin",
    sublabel: "ผู้ดูแลระบบ HRD",
    hint: "สิทธิ์จัดการระบบ HRD ทั้งหมด ตั้งค่า และอนุมัติรายการ",
    dotColor: "bg-[#2563EB]",
  },
  {
    role: "manager",
    label: "Manager",
    sublabel: "หัวหน้างาน",
    hint: "ติดตามผลงานทีม อนุมัติอบรม และดูแลแผนพัฒนา IDP ของทีม",
    dotColor: "bg-[#22B89A]",
  },
  {
    role: "employee",
    label: "Employee",
    sublabel: "พนักงาน",
    hint: "ดูผลประเมิน หลักสูตรอบรม แผนพัฒนา และใบประกาศนียบัตรของตนเอง",
    dotColor: "bg-[#8B7CF6]",
  },
];

export function LoginView() {
  const router = useRouter();
  const { setRole } = useLayout();

  const [selectedRole, setSelectedRole] = useState<RoleKey>("admin");
  const [email, setEmail] = useState(DEMO_USERS.admin.email);
  const [password, setPassword] = useState("••••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [forgotOpen, setForgotOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const handleSelectQuickRole = (roleKey: RoleKey) => {
    setSelectedRole(roleKey);
    setEmail(DEMO_USERS[roleKey].email);
    setPassword("hrd-demo-2026");
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("กรุณากรอกอีเมลองค์กรและรหัสผ่านให้ครบถ้วน");
      return;
    }

    setError(null);
    setLoading(true);
    setRole(selectedRole);

    setTimeout(() => {
      router.push(ROLE_HOME_ROUTE[selectedRole]);
    }, 350);
  };

  const handleSendReset = () => {
    if (!resetEmail.trim()) return;
    setResetSent(true);
    setTimeout(() => {
      setResetSent(false);
      setForgotOpen(false);
      setResetEmail("");
    }, 1800);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F9FC] p-4 sm:p-6 lg:p-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-[#EEF2F6] bg-white hrd-card-shadow lg:grid-cols-12">
        {/* Left Brand Showcase Panel (Clean White-Blue Gradient) */}
        <div className="relative hidden flex-col justify-between bg-gradient-to-br from-[#EFF6FF] via-[#F7FAFF] to-white p-10 lg:col-span-5 lg:flex border-r border-[#EEF2F6]">
          <div>
            {/* Brand Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white p-1.5 shadow-xs ring-1 ring-[#EEF2F6]">
                <img
                  src="/logo.png"
                  alt="HRD Management Logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-[#1E293B]">
                  HRD Management
                </span>
                <p className="text-[11px] font-medium text-[#64748B]">Enterprise People Dev</p>
              </div>
            </div>

            <div className="mt-10 space-y-3">
              <Badge variant="primary">Demo Version • HRM Connected</Badge>
              <h1 className="text-2xl font-bold leading-snug text-[#1E293B]">
                ระบบบริหารและพัฒนา
                <br />
                ทรัพยากรบุคคลครบวงจร
              </h1>
              <p className="text-sm leading-relaxed text-[#64748B]">
                เชื่อมโยงข้อมูลพนักงานและโครงสร้างองค์กรจาก HRM เดิม เพื่อวางแผนฝึกอบรม ประเมินผล พัฒนาทักษะ และสร้างผู้สืบทอดตำแหน่งในที่เดียว
              </p>
            </div>

            {/* Clean Feature Highlights */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3.5 rounded-2xl bg-white/90 p-3.5 shadow-2xs ring-1 ring-[#EEF2F6]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1E293B]">Training &amp; LMS</p>
                  <p className="text-xs text-[#94A3B8]">วางแผนอบรม จัดการงบ และเรียนออนไลน์</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 rounded-2xl bg-white/90 p-3.5 shadow-2xs ring-1 ring-[#EEF2F6]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ECFAF5] text-[#1CA388]">
                  <Target className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1E293B]">Performance &amp; Skill Gap</p>
                  <p className="text-xs text-[#94A3B8]">ประเมิน KPI / OKR และวิเคราะห์ช่องว่างทักษะ</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 rounded-2xl bg-white/90 p-3.5 shadow-2xs ring-1 ring-[#EEF2F6]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F3F0FF] text-[#7C6CF6]">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1E293B]">IDP, Career &amp; Talent</p>
                  <p className="text-xs text-[#94A3B8]">แผนพัฒนารายบุคคล 9-Box และผู้สืบทอดตำแหน่ง</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-2 text-xs text-[#94A3B8]">
            <ShieldCheck className="h-4 w-4 text-[#22B89A]" />
            <span>รองรับ Role &amp; Permission และ SSO ร่วมกับระบบ HRM</span>
          </div>
        </div>

        {/* Right Login Form Panel */}
        <div className="flex flex-col justify-center p-7 sm:p-10 lg:col-span-7 lg:p-12">
          {/* Mobile Brand Header */}
          <div className="mb-6 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white p-1 shadow-xs ring-1 ring-[#EEF2F6]">
              <img
                src="/logo.png"
                alt="HRD Management Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <span className="text-lg font-bold text-[#1E293B]">HRD Management</span>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#1E293B]">เข้าสู่ระบบ</h2>
            <p className="mt-1 text-sm text-[#64748B]">
              กรอกอีเมลองค์กรหรือรหัสพนักงาน เพื่อเข้าใช้งานระบบ HRD Management
            </p>
          </div>

          {/* Quick Demo Role Accounts */}
          <div className="mt-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              เลือกบัญชีทดสอบด่วน (Demo Accounts)
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              {QUICK_ACCOUNTS.map((acc) => {
                const active = selectedRole === acc.role;
                return (
                  <Tooltip key={acc.role} title={`${acc.label} (${acc.sublabel})`} content={acc.hint}>
                    <button
                      type="button"
                      onClick={() => handleSelectQuickRole(acc.role)}
                      className={`flex w-full flex-col items-start rounded-xl border px-3 py-2.5 text-left transition-all cursor-pointer ${
                        active
                          ? "border-[#2563EB] bg-[#EFF6FF] ring-2 ring-[#2563EB]/15"
                          : "border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#CBD5E1] hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className={`h-2 w-2 rounded-full ${acc.dotColor}`} />
                        <span
                          className={`text-xs font-bold ${
                            active ? "text-[#2563EB]" : "text-[#1E293B]"
                          }`}
                        >
                          {acc.label}
                        </span>
                      </div>
                      <span className="mt-0.5 truncate text-[11px] text-[#64748B]">
                        {acc.sublabel}
                      </span>
                    </button>
                  </Tooltip>
                );
              })}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-medium text-[#DC2626]">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-email" className="text-sm font-medium text-[#1E293B]">
                อีเมลองค์กร / รหัสพนักงาน
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  id="login-email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.co.th หรือ EMP-00102"
                  className="h-11 w-full rounded-xl border border-[#E2E8F0] bg-white pl-10 pr-4 text-[15px] text-[#1E293B] placeholder:text-[#94A3B8] transition-colors hover:border-[#CBD5E1] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/15"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="login-password" className="text-sm font-medium text-[#1E293B]">
                  รหัสผ่าน
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email);
                    setForgotOpen(true);
                  }}
                  className="text-xs font-medium text-[#2563EB] hover:text-[#1D4ED8] cursor-pointer"
                >
                  ลืมรหัสผ่าน?
                </button>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="กรอกรหัสผ่าน"
                  className="h-11 w-full rounded-xl border border-[#E2E8F0] bg-white pl-10 pr-11 text-[15px] text-[#1E293B] placeholder:text-[#94A3B8] transition-colors hover:border-[#CBD5E1] focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-[#94A3B8] hover:text-[#1E293B] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="inline-flex items-center gap-2 text-xs text-[#64748B] cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]/20 accent-[#2563EB]"
                />
                จดจำการเข้าสู่ระบบบนอุปกรณ์นี้
              </label>
              <span className="text-xs text-[#94A3B8]">
                เข้าใช้งานในชื่อ <strong className="text-[#1E293B]">{DEMO_USERS[selectedRole].name}</strong>
              </span>
            </div>

            <Button
              type="submit"
              size="lg"
              loading={loading}
              rightIcon={<ArrowRight className="h-4.5 w-4.5" />}
              className="mt-2 w-full"
            >
              เข้าสู่ระบบ HRD
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-[#94A3B8]">
            Demo Mode • สามารถกดเข้าสู่ระบบได้ทันทีด้วยบัญชีทดสอบที่เลือกด้านบน
          </p>
        </div>
      </div>

      {/* Forgot Password Demo Modal */}
      <Modal
        open={forgotOpen}
        onClose={() => setForgotOpen(false)}
        title="รีเซ็ตรหัสผ่าน (Forgot Password)"
        description="ระบุอีเมลองค์กรที่ผูกกับระบบ HRM เพื่อรับลิงก์ตั้งรหัสผ่านใหม่"
        size="sm"
        footer={
          resetSent ? undefined : (
            <>
              <Button variant="outline" onClick={() => setForgotOpen(false)}>
                ยกเลิก
              </Button>
              <Button disabled={!resetEmail.trim()} onClick={handleSendReset}>
                ส่งลิงก์รีเซ็ต
              </Button>
            </>
          )
        }
      >
        {resetSent ? (
          <div className="flex flex-col items-center py-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ECFAF5] text-[#1CA388]">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <p className="mt-3 text-sm font-semibold text-[#1E293B]">ส่งลิงก์รีเซ็ตรหัสผ่านแล้ว</p>
            <p className="mt-1 text-xs text-[#64748B]">
              กรุณาตรวจสอบกล่องข้อความที่ {resetEmail} (Demo Mode)
            </p>
          </div>
        ) : (
          <Input
            label="อีเมลองค์กร"
            type="email"
            placeholder="name@company.co.th"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            required
          />
        )}
      </Modal>
    </div>
  );
}
