"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, InfoHint, Tooltip } from "@/components/ui";
import {
  MONTHLY_TRAINING_BARS,
  PERFORMANCE_DONUT_SLICES,
  QUARTERLY_TRAINING_BARS,
} from "@/data/mock/dashboardCharts";
import {
  IDP_PROGRESS_DATA,
  PERFORMANCE_OVERVIEW_DATA,
  SKILL_GAP_ITEMS,
} from "@/data/mock/dashboardOverview";

interface DashboardChartsRowProps {
  totalHours: number;
  department: string;
  period: string;
  scale: number;
}

const IDP_TRACK_COLORS = [
  {
    bar: "#3B82F6",
    track: "#EFF6FF",
    text: "text-[#2563EB]",
    hint: "เรียนรู้จากการทำงานจริง / โปรเจกต์ / Job Rotation",
  },
  {
    bar: "#8B7CF6",
    track: "#F3F0FF",
    text: "text-[#7C6CF6]",
    hint: "เรียนรู้ผ่านโค้ชชิ่ง พี่เลี้ยง และการรับ Feedback",
  },
  {
    bar: "#22B89A",
    track: "#ECFAF5",
    text: "text-[#1CA388]",
    hint: "อบรมในห้อง สัมมนา และเรียนออนไลน์ (LMS)",
  },
];

const GRADE_EXPLANATIONS: Record<string, string> = {
  A: "ดีเยี่ยม • สูงกว่าเป้าโดดเด่น (4.50–5.00)",
  "B+": "ดีมาก • สูงกว่าเป้าสม่ำเสมอ (3.75–4.49)",
  B: "ตามเป้า • บรรลุมาตรฐานงาน (3.00–3.74)",
  C: "ต้องพัฒนา • ต่ำกว่าเป้าบางด้าน (2.25–2.99)",
  PIP: "แผนปรับปรุงผลงาน • ติดตามใกล้ชิด",
};

export function DashboardChartsRow({
  totalHours,
  department,
  period,
  scale,
}: DashboardChartsRowProps) {
  const [range, setRange] = useState<"monthly" | "quarterly">("monthly");
  const [hoveredGrade, setHoveredGrade] = useState<string | null>(null);

  // Dynamically scale bar data & target according to active Branch + Department filter
  const { barData, maxTotal, targetValue, yTicks } = useMemo(() => {
    const raw = range === "monthly" ? MONTHLY_TRAINING_BARS : QUARTERLY_TRAINING_BARS;
    const scaled = raw.map((point) => ({
      label: point.label,
      classroomHours: Math.max(20, Math.round(point.classroomHours * scale)),
      lmsHours: Math.max(15, Math.round(point.lmsHours * scale)),
    }));

    const baseMax = range === "monthly" ? 3000 : 5600;
    const baseTarget = range === "monthly" ? 2400 : 4500;
    const scaledMax = Math.max(200, Math.round((baseMax * scale) / 50) * 50);
    const scaledTarget = Math.max(150, Math.round((baseTarget * scale) / 50) * 50);
    const ticks = [scaledMax, Math.round(scaledMax * 0.66), Math.round(scaledMax * 0.33)];

    return {
      barData: scaled,
      maxTotal: scaledMax,
      targetValue: scaledTarget,
      yTicks: ticks,
    };
  }, [range, scale]);

  const targetPctFromBottom = Math.round((targetValue / maxTotal) * 100);

  // Dynamically scale Performance Donut counts
  const scaledDonutSlices = useMemo(
    () =>
      PERFORMANCE_DONUT_SLICES.map((slice) => ({
        ...slice,
        count: Math.max(1, Math.round(slice.count * scale)),
      })),
    [scale]
  );

  const totalEvaluated = useMemo(
    () => scaledDonutSlices.reduce((sum, s) => sum + s.count, 0),
    [scaledDonutSlices]
  );

  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  let cumulativePercent = 0;
  const activeSlice = scaledDonutSlices.find((s) => s.grade === hoveredGrade) ?? null;

  // Dynamically filter & scale Skill Gap headcounts
  const visibleSkillGaps = useMemo(() => {
    const filtered =
      department === "all"
        ? SKILL_GAP_ITEMS
        : SKILL_GAP_ITEMS.filter(
            (item) => item.departmentKey === department || item.departmentKey === "all"
          );
    return filtered.map((item) => ({
      ...item,
      affectedEmployees: Math.max(4, Math.round(item.affectedEmployees * scale)),
    }));
  }, [department, scale]);

  // Dynamically scale IDP counts
  const idp = useMemo(() => {
    const completedPlans = Math.max(4, Math.round(IDP_PROGRESS_DATA.completedPlans * scale));
    const inProgressPlans = Math.max(6, Math.round(IDP_PROGRESS_DATA.inProgressPlans * scale));
    const notStartedPlans = Math.max(2, Math.round(IDP_PROGRESS_DATA.notStartedPlans * scale));
    const totalPlans = completedPlans + inProgressPlans + notStartedPlans;
    const periodBoost = period === "2026-q4" ? 2.1 : period === "2026-q1" ? -3.4 : 0;
    const overallPercent = Number(
      Math.min(98, Math.max(45, IDP_PROGRESS_DATA.overallPercent + periodBoost)).toFixed(1)
    );

    const tracks = IDP_PROGRESS_DATA.tracks.map((track) => {
      const completed = Math.max(3, Math.round(track.completed * scale));
      const total = Math.max(completed + 1, Math.round(track.total * scale));
      const percent = Number(((completed / total) * 100).toFixed(1));
      return { ...track, completed, total, percent };
    });

    return {
      overallPercent,
      totalPlans,
      completedPlans,
      inProgressPlans,
      notStartedPlans,
      tracks,
    };
  }, [scale, period]);

  const completedPct = Math.round((idp.completedPlans / idp.totalPlans) * 100);
  const inProgressPct = Math.round((idp.inProgressPlans / idp.totalPlans) * 100);
  const notStartedPct = Math.max(0, 100 - completedPct - inProgressPct);

  const formatTick = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `${n}`;

  return (
    <div className="space-y-4">
      {/* Analytics Row 1: Stacked Bar (8 cols) | Performance Donut (4 cols) */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* Stacked Column Chart */}
        <Card className="xl:col-span-8">
          <CardContent className="p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-semibold text-[#1E293B]">
                    แนวโน้มชั่วโมงฝึกอบรมและเรียนออนไลน์ (Training + LMS)
                  </h3>
                  <InfoHint
                    title="ชั่วโมงการเรียนรู้รวม"
                    content="ซ้อน Classroom (ฟ้า) + LMS (เขียว) เทียบเส้นเป้า (เหลือง)"
                  />
                </div>
                <p className="mt-0.5 text-xs text-[#64748B]">
                  สะสมรวม{" "}
                  <span className="tabular-nums text-sm font-bold text-[#2563EB]">
                    {new Intl.NumberFormat("th-TH").format(totalHours)} ชม.
                  </span>{" "}
                  <span className="text-[#94A3B8]">
                    • เป้า {targetValue.toLocaleString()} ชม./
                    {range === "monthly" ? "เดือน" : "ไตรมาส"}
                  </span>
                </p>
              </div>

              <div className="inline-flex self-start rounded-lg bg-[#F4F6FA] p-0.5">
                <button
                  type="button"
                  onClick={() => setRange("monthly")}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
                    range === "monthly"
                      ? "bg-white text-[#1E293B] shadow-2xs"
                      : "text-[#94A3B8] hover:text-[#64748B]"
                  }`}
                >
                  รายเดือน
                </button>
                <button
                  type="button"
                  onClick={() => setRange("quarterly")}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
                    range === "quarterly"
                      ? "bg-white text-[#1E293B] shadow-2xs"
                      : "text-[#94A3B8] hover:text-[#64748B]"
                  }`}
                >
                  รายไตรมาส
                </button>
              </div>
            </div>

            {/* Compact Legend */}
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-medium text-[#64748B]">
              <Tooltip content="อบรมในห้อง / Workshop / Hybrid">
                <span className="inline-flex items-center gap-1.5 cursor-help">
                  <span className="h-2.5 w-2.5 rounded-[3px] bg-[#3B82F6]" />
                  Classroom
                </span>
              </Tooltip>
              <Tooltip content="คอร์สเรียนออนไลน์ด้วยตนเองบน LMS">
                <span className="inline-flex items-center gap-1.5 cursor-help">
                  <span className="h-2.5 w-2.5 rounded-[3px] bg-[#22B89A]" />
                  LMS ออนไลน์
                </span>
              </Tooltip>
              <Tooltip content={`เป้าหมายขั้นต่ำ ${targetValue.toLocaleString()} ชม.`}>
                <span className="inline-flex items-center gap-1.5 cursor-help">
                  <span className="w-3.5 border-t-2 border-dashed border-[#F5B73B]" />
                  เป้าหมาย
                </span>
              </Tooltip>
            </div>

            {/* Compact Stacked Column Plot */}
            <div className="mt-4 flex gap-3">
              <div className="hidden h-44 flex-col justify-between pb-6 text-right text-[11px] font-medium text-[#94A3B8] sm:flex">
                {yTicks.map((tick) => (
                  <span key={tick} className="tabular-nums">
                    {formatTick(tick)}
                  </span>
                ))}
                <span>0</span>
              </div>

              <div className="relative flex-1">
                <div className="pointer-events-none absolute inset-x-0 top-0 bottom-6 flex flex-col justify-between">
                  {[0, 1, 2, 3].map((idx) => (
                    <div key={idx} className="w-full border-t border-dashed border-[#EEF2F6]" />
                  ))}
                </div>

                {/* Warm Yellow Target Line */}
                <div
                  className="pointer-events-none absolute inset-x-0 z-10 border-t-2 border-dashed border-[#F5B73B]"
                  style={{ bottom: `calc(${targetPctFromBottom}% * 0.85 + 24px)` }}
                >
                  <span className="absolute right-0 -top-4.5 rounded bg-[#FEF9EC] px-1.5 py-0.5 text-[10px] font-semibold text-[#C68A12] ring-1 ring-[#FDE68A]">
                    เป้า {targetValue.toLocaleString()}
                  </span>
                </div>

                <div className="relative flex h-44 items-end justify-around gap-2.5 pt-1">
                  {barData.map((point) => {
                    const total = point.classroomHours + point.lmsHours;
                    const diff = total - targetValue;
                    const classroomPct = Math.round((point.classroomHours / maxTotal) * 100);
                    const lmsPct = Math.round((point.lmsHours / maxTotal) * 100);

                    return (
                      <Tooltip
                        key={point.label}
                        className="flex h-full flex-1 flex-col items-center justify-end"
                        title={`${point.label} • รวม ${total.toLocaleString()} ชม.`}
                        content={
                          <div className="space-y-0.5">
                            <p className="text-blue-200">
                              Classroom: {point.classroomHours.toLocaleString()} ชม.
                            </p>
                            <p className="text-emerald-200">
                              LMS: {point.lmsHours.toLocaleString()} ชม.
                            </p>
                            <p className={diff >= 0 ? "text-emerald-300" : "text-amber-200"}>
                              {diff >= 0
                                ? `เกินเป้า +${diff.toLocaleString()} ชม.`
                                : `ต่ำกว่าเป้า ${diff.toLocaleString()} ชม.`}
                            </p>
                          </div>
                        }
                      >
                        <div className="group flex h-full w-full flex-col items-center justify-end cursor-pointer">
                          <div className="flex h-full w-full items-end justify-center pb-1.5">
                            <div className="flex h-full w-6 flex-col justify-end sm:w-8">
                              <div
                                className="w-full rounded-t-md bg-[#22B89A] transition-all duration-300 group-hover:bg-[#1CA388]"
                                style={{ height: `${lmsPct}%` }}
                              />
                              <div
                                className="mt-0.5 w-full rounded-b-xs bg-[#3B82F6] transition-all duration-300 group-hover:bg-[#2563EB]"
                                style={{ height: `${classroomPct}%` }}
                              />
                            </div>
                          </div>
                          <span className="mt-1 text-[11px] font-medium text-[#64748B] group-hover:text-[#1E293B]">
                            {point.label}
                          </span>
                        </div>
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compact 100% Performance Rating Donut */}
        <Card className="xl:col-span-4">
          <CardContent className="flex h-full flex-col justify-between p-5">
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-semibold text-[#1E293B]">
                  สัดส่วนผลการปฏิบัติงาน (PMS)
                </h3>
                <InfoHint
                  title="ผลประเมิน PMS"
                  content="สัดส่วนเกรด A–PIP ของพนักงานที่ประเมินแล้ว (เต็ม 5.0)"
                />
              </div>
              <p className="mt-0.5 text-xs text-[#94A3B8]">
                {PERFORMANCE_OVERVIEW_DATA.cycleName} • {totalEvaluated} คน
              </p>
            </div>

            <div className="my-2.5 flex items-center justify-center">
              <div className="relative flex h-36 w-36 items-center justify-center">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 160 160">
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="none"
                    stroke="#F1F5F9"
                    strokeWidth="20"
                  />
                  {scaledDonutSlices.map((slice) => {
                    const dashLength = (slice.percent / 100) * circumference;
                    const dashOffset = -(cumulativePercent / 100) * circumference;
                    cumulativePercent += slice.percent;
                    const isFocused = hoveredGrade === slice.grade;

                    return (
                      <circle
                        key={slice.grade}
                        cx="80"
                        cy="80"
                        r={radius}
                        fill="none"
                        stroke={slice.color}
                        strokeWidth={isFocused ? 23 : 20}
                        strokeDasharray={`${Math.max(0, dashLength - 1.5)} ${circumference}`}
                        strokeDashoffset={dashOffset}
                        onMouseEnter={() => setHoveredGrade(slice.grade)}
                        onMouseLeave={() => setHoveredGrade(null)}
                        className="cursor-pointer transition-all duration-200"
                      />
                    );
                  })}
                </svg>

                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                  {activeSlice ? (
                    <>
                      <span
                        className="tabular-nums text-xl font-bold"
                        style={{ color: activeSlice.color }}
                      >
                        {activeSlice.percent}%
                      </span>
                      <span className="text-[11px] font-medium text-[#64748B]">
                        เกรด {activeSlice.grade} ({activeSlice.count})
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="tabular-nums text-xl font-bold text-[#1E293B]">
                        {PERFORMANCE_OVERVIEW_DATA.averageScore}
                      </span>
                      <span className="text-[11px] font-medium text-[#94A3B8]">เฉลี่ย / 5.0</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              {scaledDonutSlices.map((slice) => (
                <Tooltip
                  key={slice.grade}
                  className="block w-full"
                  content={GRADE_EXPLANATIONS[slice.grade]}
                >
                  <div
                    onMouseEnter={() => setHoveredGrade(slice.grade)}
                    onMouseLeave={() => setHoveredGrade(null)}
                    className={`flex w-full items-center justify-between rounded-md px-1.5 py-0.5 text-xs transition-colors cursor-help ${
                      hoveredGrade === slice.grade ? "bg-[#F4F6FA]" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-[3px]"
                        style={{ backgroundColor: slice.color }}
                      />
                      <span className="font-semibold text-[#1E293B] w-7">{slice.grade}</span>
                      <span className="truncate text-[#64748B]">{slice.label}</span>
                    </div>
                    <span className="shrink-0 tabular-nums font-semibold text-[#1E293B]">
                      {slice.count}{" "}
                      <span className="font-normal text-[#94A3B8]">({slice.percent}%)</span>
                    </span>
                  </div>
                </Tooltip>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Row 2: Compact Skill Gap (6 cols) | Compact IDP (6 cols) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Compact Skill Gap */}
        <Card>
          <CardContent className="p-5">
            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-semibold text-[#1E293B]">
                  ช่องว่างทักษะสำคัญ (Skill Gap)
                </h3>
                <InfoHint
                  title="สเกลทักษะ 0–5"
                  content="1=พื้นฐาน • 3=ทำได้เอง • 5=เชี่ยวชาญ/สอนได้"
                />
              </div>
              <div className="flex items-center gap-3.5 text-xs font-medium text-[#64748B]">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-[3px] bg-[#3B82F6]" />
                  ปัจจุบัน
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-3 w-0.5 rounded-full bg-[#334155]" />
                  เป้าหมาย
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {visibleSkillGaps.map((item) => {
                const currentPct = (item.currentLevel / 5) * 100;
                const targetPct = (item.targetLevel / 5) * 100;
                const gapValue = (item.targetLevel - item.currentLevel).toFixed(1);

                return (
                  <Tooltip
                    key={item.id}
                    className="block w-full"
                    title={`${item.skillName} (${item.category})`}
                    content={`ปัจจุบัน ${item.currentLevel} / เป้า ${item.targetLevel} (ขาด ${gapValue}) • พนักงาน ${item.affectedEmployees} คน`}
                  >
                    <div className="space-y-1.5 rounded-lg px-1.5 py-1 -mx-1.5 transition-colors hover:bg-[#F7F9FC] cursor-help">
                      <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
                        <div className="min-w-0 truncate">
                          <span className="font-medium text-[#1E293B]">{item.skillName}</span>
                          <span className="ml-1.5 text-xs text-[#94A3B8]">
                            ({item.affectedEmployees} คน)
                          </span>
                        </div>
                        <div className="flex shrink-0 items-center gap-2 text-xs">
                          <span className="tabular-nums text-[#64748B]">
                            <strong className="text-[#2563EB]">{item.currentLevel}</strong> /{" "}
                            <strong className="text-[#1E293B]">{item.targetLevel}</strong>
                          </span>
                          <span className="rounded-full bg-[#FEF9EC] px-2 py-0.5 text-[11px] font-semibold text-[#C68A12] tabular-nums">
                            ขาด {gapValue}
                          </span>
                        </div>
                      </div>

                      <div className="relative flex h-4 items-center">
                        <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-[#F1F5F9]">
                          <div
                            className="h-full rounded-full bg-[#3B82F6] transition-all duration-300"
                            style={{ width: `${currentPct}%` }}
                          />
                        </div>

                        <div
                          className="pointer-events-none absolute top-0 bottom-0 w-1 -translate-x-1/2 rounded-full bg-[#334155] ring-2 ring-white"
                          style={{ left: `${targetPct}%` }}
                        />
                      </div>
                    </div>
                  </Tooltip>
                );
              })}

              <div className="flex justify-between pt-0.5 text-[11px] font-medium text-[#94A3B8] tabular-nums">
                <span>0</span>
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compact IDP Progress */}
        <Card>
          <CardContent className="flex h-full flex-col gap-4 p-5">
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-semibold text-[#1E293B]">
                    ความคืบหน้าแผนพัฒนา (IDP)
                  </h3>
                  <InfoHint
                    title="แผนพัฒนารายบุคคล (IDP)"
                    content="แผนพัฒนาทักษะรายบุคคลตามหลักการเรียนรู้ 70-20-10"
                  />
                </div>
                <Tooltip content="ความคืบหน้าเฉลี่ยของแผน IDP ทั้งองค์กร">
                  <span className="tabular-nums text-xl font-bold text-[#1CA388] cursor-help">
                    {idp.overallPercent}%
                  </span>
                </Tooltip>
              </div>

              <div className="mt-3">
                <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-[#F1F5F9]">
                  <div className="h-full bg-[#22B89A]" style={{ width: `${completedPct}%` }} />
                  <div className="h-full bg-[#8B7CF6]" style={{ width: `${inProgressPct}%` }} />
                  <div className="h-full bg-[#E2E8F0]" style={{ width: `${notStartedPct}%` }} />
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2.5">
                  <Tooltip
                    className="block w-full"
                    content={`ทำครบและผ่านประเมินแล้ว ${idp.completedPlans} แผน`}
                  >
                    <div className="w-full rounded-xl bg-[#ECFAF5] px-3 py-2 cursor-help">
                      <span className="text-[11px] font-medium text-[#1CA388]">สำเร็จแล้ว</span>
                      <p className="tabular-nums text-base font-bold text-[#1E293B]">
                        {idp.completedPlans}{" "}
                        <span className="text-[11px] font-normal text-[#64748B]">
                          ({completedPct}%)
                        </span>
                      </p>
                    </div>
                  </Tooltip>

                  <Tooltip
                    className="block w-full"
                    content={`อยู่ระหว่างดำเนินกิจกรรม ${idp.inProgressPlans} แผน`}
                  >
                    <div className="w-full rounded-xl bg-[#F3F0FF] px-3 py-2 cursor-help">
                      <span className="text-[11px] font-medium text-[#7C6CF6]">กำลังพัฒนา</span>
                      <p className="tabular-nums text-base font-bold text-[#1E293B]">
                        {idp.inProgressPlans}{" "}
                        <span className="text-[11px] font-normal text-[#64748B]">
                          ({inProgressPct}%)
                        </span>
                      </p>
                    </div>
                  </Tooltip>

                  <Tooltip
                    className="block w-full"
                    content={`สร้างแผนแล้วแต่ยังไม่เริ่ม ${idp.notStartedPlans} แผน`}
                  >
                    <div className="w-full rounded-xl bg-[#F7F9FC] px-3 py-2 cursor-help">
                      <span className="text-[11px] font-medium text-[#64748B]">ยังไม่เริ่ม</span>
                      <p className="tabular-nums text-base font-bold text-[#1E293B]">
                        {idp.notStartedPlans}{" "}
                        <span className="text-[11px] font-normal text-[#64748B]">
                          ({notStartedPct}%)
                        </span>
                      </p>
                    </div>
                  </Tooltip>
                </div>
              </div>
            </div>

            <div className="space-y-3 border-t border-[#F1F5F9] pt-3.5">
              <div className="flex items-center gap-1.5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                  กรอบการเรียนรู้ 70-20-10
                </p>
                <InfoHint content="70% งานจริง • 20% โค้ชชิ่ง • 10% อบรม/คอร์ส" />
              </div>

              {idp.tracks.map((track, idx) => {
                const palette = IDP_TRACK_COLORS[idx] ?? IDP_TRACK_COLORS[0];
                return (
                  <Tooltip
                    key={track.label}
                    className="block w-full"
                    title={track.ratio}
                    content={palette.hint}
                  >
                    <div className="space-y-1.5 rounded-lg px-1.5 py-0.5 -mx-1.5 transition-colors hover:bg-[#F7F9FC] cursor-help">
                      <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="truncate font-medium text-[#1E293B]">{track.label}</span>
                          <span className="hidden rounded bg-[#F4F6FA] px-1.5 py-0.5 text-[10px] font-medium text-[#64748B] sm:inline">
                            {track.ratio}
                          </span>
                        </div>
                        <span className={`shrink-0 tabular-nums text-xs font-semibold ${palette.text}`}>
                          {track.completed}/{track.total} ({track.percent}%)
                        </span>
                      </div>
                      <div
                        className="h-2 w-full overflow-hidden rounded-full"
                        style={{ backgroundColor: palette.track }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{ width: `${track.percent}%`, backgroundColor: palette.bar }}
                        />
                      </div>
                    </div>
                  </Tooltip>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
