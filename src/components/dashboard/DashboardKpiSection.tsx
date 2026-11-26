"use client";

import { useMemo, useState } from "react";
import { Clock, GraduationCap, RotateCcw, SlidersHorizontal, Users, Wallet, X } from "lucide-react";
import { Select, StatCard, Tooltip } from "@/components/ui";
import {
  BRANCH_SHARE,
  DASHBOARD_BRANCH_OPTIONS,
  DASHBOARD_DEPARTMENT_OPTIONS,
  DASHBOARD_KPI_BY_DEPARTMENT,
  DASHBOARD_PERIOD_PRESETS,
  DEPARTMENT_SCALE,
} from "@/data/mock/dashboardKpi";
import { DashboardBottomRow } from "./DashboardBottomRow";
import { DashboardChartsRow } from "./DashboardChartsRow";

function formatNumber(n: number): string {
  return new Intl.NumberFormat("th-TH").format(Math.round(n));
}

function formatBudgetShort(n: number): string {
  if (n >= 1_000_000) {
    return `฿${(n / 1_000_000).toFixed(2)}M`;
  }
  return `฿${new Intl.NumberFormat("th-TH").format(Math.round(n))}`;
}

export function DashboardKpiSection() {
  const [period, setPeriod] = useState("2026-all");
  const [branch, setBranch] = useState("all");
  const [department, setDepartment] = useState("all");

  const activePeriodPreset =
    DASHBOARD_PERIOD_PRESETS.find((p) => p.value === period) ?? DASHBOARD_PERIOD_PRESETS[0];

  const hasActiveFilter = period !== "2026-all" || branch !== "all" || department !== "all";

  const resetFilters = () => {
    setPeriod("2026-all");
    setBranch("all");
    setDepartment("all");
  };

  const branchShare = BRANCH_SHARE[branch] ?? 1;
  const deptScale = DEPARTMENT_SCALE[department] ?? 1;
  const combinedScale = branchShare * deptScale;

  const stats = useMemo(() => {
    const base = DASHBOARD_KPI_BY_DEPARTMENT[department] ?? DASHBOARD_KPI_BY_DEPARTMENT.all;
    const periodMultiplier = activePeriodPreset.multiplier;

    const totalEmployees = Math.max(8, Math.round(base.totalEmployees * branchShare));
    const hours = Math.max(60, Math.round(base.totalTrainingHours * branchShare * periodMultiplier));
    const avgHours = Number((hours / totalEmployees).toFixed(1));
    const budgetUsed = Math.round(base.budgetUsed * branchShare * periodMultiplier);
    const budgetAllocated = Math.max(
      1,
      Math.round(base.budgetAllocated * branchShare * periodMultiplier)
    );
    const budgetPercent = Math.round((budgetUsed / budgetAllocated) * 1000) / 10;

    // Slight realistic variance across quarters/branches
    const completionAdjust = branch === "hq" ? 1.4 : branch === "cnx" ? -1.1 : branch === "ryg" ? -0.6 : 0;
    const trainingCompletionRate = Number(
      Math.min(99, Math.max(65, base.trainingCompletionRate + completionAdjust)).toFixed(1)
    );

    return {
      ...base,
      totalEmployees,
      hours,
      avgHours,
      budgetUsed,
      budgetAllocated,
      budgetPercent,
      trainingCompletionRate,
    };
  }, [department, branch, branchShare, activePeriodPreset.multiplier]);

  const activeBranchLabel =
    DASHBOARD_BRANCH_OPTIONS.find((o) => o.value === branch)?.label ?? "";
  const activeDeptLabel =
    DASHBOARD_DEPARTMENT_OPTIONS.find((o) => o.value === department)?.label ?? "";

  return (
    <div className="space-y-4">
      {/* Sleek Interactive Filter Toolbar */}
      <div className="rounded-2xl border border-[#EEF2F6] bg-white px-5 py-3.5 hrd-card-shadow">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          {/* Left: Title + 1-Click Period Segmented Pills */}
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-4">
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#2563EB]">
                <SlidersHorizontal className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-base font-bold leading-tight text-[#1E293B]">
                  HRD Dashboard
                </h2>
                <p className="text-[11px] text-[#94A3B8]">
                  {activePeriodPreset.label}
                </p>
              </div>
            </div>

            <div className="hidden h-7 w-px bg-[#EEF2F6] sm:block" />

            {/* 1-Click Quick Period Pills with Month Range Tooltips */}
            <div
              role="group"
              aria-label="เลือกช่วงเวลา"
              className="inline-flex flex-wrap items-center gap-1 rounded-xl bg-[#F4F6FA] p-1"
            >
              {DASHBOARD_PERIOD_PRESETS.map((preset) => {
                const active = period === preset.value;
                return (
                  <Tooltip
                    key={preset.value}
                    title={preset.label}
                    content={preset.tooltip}
                  >
                    <button
                      type="button"
                      onClick={() => setPeriod(preset.value)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                        active
                          ? "bg-[#2563EB] text-white shadow-xs"
                          : "text-[#64748B] hover:bg-white/70 hover:text-[#1E293B]"
                      }`}
                    >
                      {preset.shortLabel}
                    </button>
                  </Tooltip>
                );
              })}
            </div>
          </div>

          {/* Right: Branch + Department Selectors + 1-Click Reset */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Tooltip
              title="ตัวกรองสาขา"
              content="กรองข้อมูล Dashboard ตามสาขา/สำนักงาน (อ้างอิง HRM)"
              className="w-full sm:w-48"
            >
              <Select
                value={branch}
                onChange={setBranch}
                options={DASHBOARD_BRANCH_OPTIONS}
                className="w-full"
              />
            </Tooltip>
            <Tooltip
              title="ตัวกรองแผนก"
              content="กรองข้อมูล Dashboard ตามฝ่าย/แผนก (อ้างอิง HRM)"
              className="w-full sm:w-52"
            >
              <Select
                value={department}
                onChange={setDepartment}
                options={DASHBOARD_DEPARTMENT_OPTIONS}
                className="w-full"
              />
            </Tooltip>
            {hasActiveFilter && (
              <Tooltip content="ล้างตัวกรองทั้งหมดกลับเป็นค่าเริ่มต้น">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 text-xs font-medium text-[#64748B] transition-colors hover:border-[#BFDBFE] hover:bg-[#EFF6FF] hover:text-[#2563EB] cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  รีเซ็ต
                </button>
              </Tooltip>
            )}
          </div>
        </div>

        {/* Active Filter Chips (only visible when filters are applied) */}
        {hasActiveFilter && (
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[#F1F5F9] pt-2.5 text-xs">
            <span className="text-[#94A3B8]">กำลังกรอง:</span>
            {period !== "2026-all" && (
              <button
                type="button"
                onClick={() => setPeriod("2026-all")}
                className="inline-flex items-center gap-1 rounded-full bg-[#EFF6FF] px-2.5 py-0.5 font-medium text-[#2563EB] hover:bg-[#DBEAFE] cursor-pointer"
              >
                ช่วงเวลา: {activePeriodPreset.shortLabel}
                <X className="h-3 w-3" />
              </button>
            )}
            {branch !== "all" && (
              <button
                type="button"
                onClick={() => setBranch("all")}
                className="inline-flex items-center gap-1 rounded-full bg-[#ECFAF5] px-2.5 py-0.5 font-medium text-[#1CA388] hover:bg-emerald-100 cursor-pointer"
              >
                สาขา: {activeBranchLabel}
                <X className="h-3 w-3" />
              </button>
            )}
            {department !== "all" && (
              <button
                type="button"
                onClick={() => setDepartment("all")}
                className="inline-flex items-center gap-1 rounded-full bg-[#F3F0FF] px-2.5 py-0.5 font-medium text-[#7C6CF6] hover:bg-violet-100 cursor-pointer"
              >
                แผนก: {activeDeptLabel}
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Row 1: 4 Compact Hero KPI Cards */}
      <section aria-label="ตัวชี้วัดหลัก HRD">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            tone="blue"
            title="พนักงานทั้งหมด (HRM)"
            tooltip="พนักงานที่ยังปฏิบัติงานอยู่ ดึงตรงจากระบบ HRM"
            value={formatNumber(stats.totalEmployees)}
            unit="คน"
            icon={<Users className="h-5 w-5" />}
            trend={{ label: stats.employeeDelta, direction: "up" }}
            footnote={department === "all" ? `${stats.activeDepartments} แผนก` : "1 แผนก"}
          />

          <StatCard
            tone="yellow"
            title="อัตราการอบรมสำเร็จ"
            tooltip={`สัดส่วนผู้ผ่านอบรมตามแผน (เป้าองค์กร ${stats.completionTarget}%)`}
            value={`${stats.trainingCompletionRate}%`}
            icon={<GraduationCap className="h-5 w-5" />}
            progress={{
              percent: stats.trainingCompletionRate,
              label: `เป้า ${stats.completionTarget}%`,
            }}
            footnote={stats.completionDelta}
          />

          <StatCard
            tone="purple"
            title="ชั่วโมงฝึกอบรมรวม"
            tooltip={`รวม Classroom + LMS เฉลี่ย ${stats.avgHours} ชม./คน`}
            value={formatNumber(stats.hours)}
            unit="ชม."
            icon={<Clock className="h-5 w-5" />}
            trend={{ label: stats.hoursDelta, direction: "up" }}
            footnote={`เฉลี่ย ${stats.avgHours} ชม./คน`}
          />

          <StatCard
            tone="green"
            title="งบประมาณฝึกอบรมที่ใช้"
            tooltip={`ใช้แล้ว ${formatBudgetShort(stats.budgetUsed)} จาก ${formatBudgetShort(stats.budgetAllocated)}`}
            value={formatBudgetShort(stats.budgetUsed)}
            icon={<Wallet className="h-5 w-5" />}
            progress={{
              percent: stats.budgetPercent,
              label: `จาก ${formatBudgetShort(stats.budgetAllocated)}`,
            }}
            footnote={`${stats.budgetPercent}%`}
          />
        </div>
      </section>

      {/* Row 2 & 3: Fully Filter-Reactive HRD Analytics Charts */}
      <DashboardChartsRow
        totalHours={stats.hours}
        department={department}
        period={period}
        scale={combinedScale}
      />

      {/* Row 4: Compact Tabbed Table + Talent Pool */}
      <DashboardBottomRow department={department} />
    </div>
  );
}
