import type { ReactNode } from "react";
import { InfoHint } from "./Tooltip";

export type StatCardTone = "blue" | "green" | "purple" | "yellow";

interface StatCardProps {
  title: string;
  subtitle?: string;
  tooltip?: string;
  value: string;
  unit?: string;
  icon: ReactNode;
  featured?: boolean;
  tone?: StatCardTone;
  trend?: {
    label: string;
    direction: "up" | "down" | "neutral";
  };
  progress?: {
    percent: number;
    label: string;
  };
  footnote?: string;
  onClick?: () => void;
  active?: boolean;
}

const ICON_TONE_CLASSES: Record<StatCardTone, string> = {
  blue: "bg-[#EFF6FF] text-[#2563EB]",
  green: "bg-[#ECFAF5] text-[#1CA388]",
  purple: "bg-[#F3F0FF] text-[#7C6CF6]",
  yellow: "bg-[#FEF9EC] text-[#D99B16]",
};

const PROGRESS_TONE_CLASSES: Record<StatCardTone, { track: string; bar: string }> = {
  blue: { track: "bg-[#EFF6FF]", bar: "bg-[#3B82F6]" },
  green: { track: "bg-[#ECFAF5]", bar: "bg-[#22B89A]" },
  purple: { track: "bg-[#F3F0FF]", bar: "bg-[#8B7CF6]" },
  yellow: { track: "bg-[#FEF9EC]", bar: "bg-[#F5B73B]" },
};

export function StatCard({
  title,
  tooltip,
  value,
  unit,
  icon,
  featured = false,
  tone = "blue",
  trend,
  progress,
  footnote,
  onClick,
  active = false,
}: StatCardProps) {
  if (featured) {
    return (
      <div className="flex flex-col justify-between rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#3B82F6] p-4.5 text-white shadow-[0_10px_24px_-6px_rgba(37,99,235,0.28)] transition-transform duration-200 hover:-translate-y-0.5">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#2563EB] shadow-xs">
            {icon}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-1.5">
              <span className="tabular-nums text-2xl font-bold leading-none text-white">
                {value}
              </span>
              {unit && <span className="text-xs font-medium text-blue-100">{unit}</span>}
            </div>
            <div className="mt-1 flex items-center gap-1">
              <p className="truncate text-xs font-medium text-blue-100">{title}</p>
              {tooltip && <InfoHint title={title} content={tooltip} light />}
            </div>
          </div>
        </div>

        {(trend || footnote) && (
          <div className="mt-3 flex items-center justify-between gap-2 text-[11px] text-blue-100/90">
            <span>{trend?.label ?? footnote}</span>
            {trend && footnote && <span className="opacity-80">{footnote}</span>}
          </div>
        )}
      </div>
    );
  }

  const progressStyle = PROGRESS_TONE_CLASSES[tone];

  const interactiveProps = onClick
    ? {
        role: "button" as const,
        tabIndex: 0,
        onClick,
        onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
          }
        },
      }
    : {};

  return (
    <div
      {...interactiveProps}
      className={`flex flex-col justify-between rounded-2xl border bg-white p-4.5 hrd-card-shadow transition-all duration-200 hover:-translate-y-0.5 ${
        onClick ? "cursor-pointer" : ""
      } ${
        active
          ? "border-[#2563EB] ring-2 ring-[#2563EB]/15"
          : "border-[#EEF2F6] hover:border-[#BFDBFE]"
      }`}
    >
      <div className="flex items-center gap-3.5">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${ICON_TONE_CLASSES[tone]}`}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-1.5">
            <span className="tabular-nums text-2xl font-bold leading-none text-[#1E293B]">
              {value}
            </span>
            {unit && <span className="text-xs font-medium text-[#64748B]">{unit}</span>}
          </div>
          <div className="mt-1 flex items-center gap-1">
            <p className="truncate text-xs font-medium text-[#64748B]">{title}</p>
            {tooltip && <InfoHint title={title} content={tooltip} />}
          </div>
        </div>
      </div>

      {progress ? (
        <div className="mt-3 space-y-1">
          <div className={`h-1.5 w-full overflow-hidden rounded-full ${progressStyle.track}`}>
            <div
              className={`h-full rounded-full transition-all duration-300 ${progressStyle.bar}`}
              style={{ width: `${Math.min(100, Math.max(0, progress.percent))}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#94A3B8]">
            <span className="truncate">{progress.label}</span>
            {footnote && <span className="shrink-0 font-medium text-[#64748B]">{footnote}</span>}
          </div>
        </div>
      ) : (trend || footnote) ? (
        <div className="mt-3 flex items-center justify-between gap-2 text-[11px]">
          {trend && (
            <span
              className={
                trend.direction === "up"
                  ? "font-medium text-[#1CA388]"
                  : trend.direction === "down"
                    ? "font-medium text-[#DC2626]"
                    : "text-[#64748B]"
              }
            >
              {trend.label}
            </span>
          )}
          {footnote && <span className="text-[#94A3B8]">{footnote}</span>}
        </div>
      ) : null}
    </div>
  );
}
