"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  FolderOpen,
  Layers,
  Plus,
  Trophy,
} from "lucide-react";
import {
  Badge,
  Button,
  EmptyState,
  Input,
  Modal,
  SearchBar,
  Select,
  Tooltip,
} from "@/components/ui";
import type { CareerPathItem, CareerTrackType } from "@/data/mock/careerPathData";

interface CareerLadderPanelProps {
  items: CareerPathItem[];
  onChange: (items: CareerPathItem[]) => void;
  onNotify: (message: string) => void;
}

const TRACK_META: Record<
  CareerTrackType,
  {
    label: string;
    shortLabel: string;
    variant: "primary" | "success" | "warning";
    hint: string;
    dotColor: string;
  }
> = {
  Management: {
    label: "Management Track",
    shortLabel: "Management",
    variant: "primary",
    hint: "สายบริหารทีมและผู้จัดการหน่วยงาน",
    dotColor: "bg-[#2563EB]",
  },
  Specialist: {
    label: "Specialist Track",
    shortLabel: "Specialist",
    variant: "success",
    hint: "สายผู้เชี่ยวชาญเฉพาะทางระดับสูง (Individual Contributor)",
    dotColor: "bg-emerald-500",
  },
  Dual: {
    label: "Dual Track",
    shortLabel: "Dual Track",
    variant: "warning",
    hint: "รองรับการเติบโตสลับได้ทั้งสายผู้เชี่ยวชาญและสายบริหาร",
    dotColor: "bg-amber-500",
  },
};

function parseStep(raw: string): { title: string; grade: string | null } {
  const match = raw.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  if (match) {
    return { title: match[1].trim(), grade: match[2].trim() };
  }
  return { title: raw.trim(), grade: null };
}

export function CareerLadderPanel({ items, onChange, onNotify }: CareerLadderPanelProps) {
  const [search, setSearch] = useState("");
  const [familyFilter, setFamilyFilter] = useState("all");
  const [trackFilter, setTrackFilter] = useState<"all" | CareerTrackType>("all");
  const [selectedId, setSelectedId] = useState<string>(items[0]?.id ?? "");

  const [addOpen, setAddOpen] = useState(false);
  const [formFamily, setFormFamily] = useState("เทคโนโลยีและวิศวกรรมซอฟต์แวร์");
  const [formTrackName, setFormTrackName] = useState("");
  const [formTrackType, setFormTrackType] = useState<CareerTrackType>("Specialist");
  const [formStepsText, setFormStepsText] = useState(
    "Junior Analyst (JG-04), Senior Analyst (JG-06), Lead Data Scientist (JG-07)"
  );

  const familyOptions = useMemo(() => {
    const families = Array.from(new Set(items.map((i) => i.jobFamilyName)));
    return [
      { value: "all", label: "กลุ่มสายงาน: ทั้งหมด" },
      ...families.map((f) => ({ value: f, label: f })),
    ];
  }, [items]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      if (familyFilter !== "all" && item.jobFamilyName !== familyFilter) return false;
      if (trackFilter !== "all" && item.trackType !== trackFilter) return false;
      if (!q) return true;
      return (
        item.code.toLowerCase().includes(q) ||
        item.trackName.toLowerCase().includes(q) ||
        item.jobFamilyName.toLowerCase().includes(q) ||
        item.steps.some((s) => s.toLowerCase().includes(q))
      );
    });
  }, [items, search, familyFilter, trackFilter]);

  const activeItem = useMemo(
    () => filtered.find((item) => item.id === selectedId) ?? filtered[0] ?? null,
    [filtered, selectedId]
  );

  const handleAddPath = () => {
    if (!formTrackName.trim()) return;
    const parsedSteps = formStepsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const created: CareerPathItem = {
      id: `CP-${Date.now()}`,
      code: `CP-NEW-0${items.length + 1}`,
      jobFamilyName: formFamily,
      trackName: formTrackName.trim(),
      trackType: formTrackType,
      steps:
        parsedSteps.length > 0
          ? parsedSteps
          : ["Officer (JG-04)", "Senior (JG-06)", "Manager (JG-08)"],
      minYearsToTop: Math.max(4, parsedSteps.length * 2),
      active: true,
    };
    onChange([created, ...items]);
    setSelectedId(created.id);
    onNotify(`เพิ่มเส้นทางความก้าวหน้า "${created.trackName}" เรียบร้อยแล้ว`);
    setAddOpen(false);
    setFormTrackName("");
  };

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="ค้นหาเส้นทางสายอาชีพ, กลุ่มสายงาน หรือชื่อตำแหน่ง..."
            className="w-full sm:w-72"
          />
          <Select
            aria-label="กรองตามกลุ่มสายงาน"
            value={familyFilter}
            onChange={setFamilyFilter}
            options={familyOptions}
            className="w-56"
          />
          <Select
            aria-label="กรองตามสายการเติบโต"
            value={trackFilter}
            onChange={(v) => setTrackFilter(v as "all" | CareerTrackType)}
            options={[
              { value: "all", label: "สายการเติบโต: ทั้งหมด" },
              { value: "Management", label: "Management Track" },
              { value: "Specialist", label: "Specialist Track" },
              { value: "Dual", label: "Dual Track" },
            ]}
            className="w-48"
          />
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setAddOpen(true)}
        >
          เพิ่มเส้นทางอาชีพ
        </Button>
      </div>

      {filtered.length === 0 || !activeItem ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="ไม่พบเส้นทางสายอาชีพ"
          description="ลองปรับคำค้นหาหรือเพิ่มเส้นทางความก้าวหน้าใหม่"
        />
      ) : (
        /* Master-Detail Split Layout: Clean, Calm & Enterprise-Scalable */
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
          {/* Left: Scrollable Track Selector List (handles 50+ tracks cleanly) */}
          <div className="space-y-2 lg:col-span-5">
            <div className="px-1 text-xs font-semibold text-[#64748B]">
              เลือกเส้นทางเพื่อดูลำดับขั้น ({filtered.length} เส้นทาง)
            </div>
            <div className="hrd-scrollbar max-h-[520px] space-y-2 overflow-y-auto pr-1">
              {filtered.map((item) => {
                const isSelected = item.id === activeItem.id;
                const tMeta = TRACK_META[item.trackType];

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className={`group flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border p-3.5 text-left transition-all ${
                      isSelected
                        ? "border-[#2563EB] bg-[#EFF6FF]/60 shadow-2xs"
                        : "border-[#EEF2F6] bg-white hover:border-[#CBD5E1] hover:bg-[#F8FAFC]"
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="inline-block rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[10.5px] font-semibold text-[#7C6CF6]">
                          {item.code}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#64748B]">
                          <span className={`h-1.5 w-1.5 rounded-full ${tMeta.dotColor}`} />
                          {tMeta.shortLabel}
                        </span>
                      </div>
                      <div
                        className={`mt-1.5 truncate text-sm font-semibold ${
                          isSelected ? "text-[#1D4ED8]" : "text-[#1E293B]"
                        }`}
                      >
                        {item.trackName}
                      </div>
                      <div className="mt-0.5 truncate text-xs text-[#64748B]">
                        {item.jobFamilyName} • {item.steps.length} ระดับ (~{item.minYearsToTop} ปี)
                      </div>
                    </div>
                    <ChevronRight
                      className={`h-4 w-4 shrink-0 transition-transform ${
                        isSelected
                          ? "translate-x-0.5 text-[#2563EB]"
                          : "text-[#CBD5E1] group-hover:text-[#64748B]"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Focused Vertical Career Ladder Detail */}
          <div className="rounded-2xl border border-[#EEF2F6] bg-[#FAFCFF] p-6 lg:sticky lg:top-20 lg:col-span-7">
            {(() => {
              const tMeta = TRACK_META[activeItem.trackType];
              const parsedSteps = activeItem.steps.map(parseStep);

              return (
                <div className="space-y-6">
                  {/* Focused Track Header */}
                  <div className="flex flex-col gap-3 border-b border-[#EEF2F6] pb-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-block rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                          {activeItem.code}
                        </span>
                        <Tooltip content={tMeta.hint}>
                          <Badge variant={tMeta.variant}>{tMeta.label}</Badge>
                        </Tooltip>
                      </div>
                      <h3 className="mt-2 text-lg font-bold text-[#1E293B]">
                        {activeItem.trackName}
                      </h3>
                      <p className="mt-0.5 text-xs text-[#64748B]">
                        กลุ่มสายงาน: {activeItem.jobFamilyName}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-1 text-xs font-medium text-[#475569]">
                        <Layers className="h-3.5 w-3.5 text-[#64748B]" />
                        {activeItem.steps.length} ระดับ
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-1 text-xs font-medium text-[#475569]">
                        <Clock className="h-3.5 w-3.5 text-[#64748B]" />
                        ~{activeItem.minYearsToTop} ปี
                      </span>
                    </div>
                  </div>

                  {/* Clean Vertical Stepper */}
                  <div className="relative pl-4">
                    <div
                      aria-hidden="true"
                      className="absolute top-4 bottom-4 left-[31px] w-[2px] bg-[#E2E8F0]"
                    />
                    <ol className="space-y-3">
                      {parsedSteps.map((step, idx) => {
                        const isFirst = idx === 0;
                        const isLast = idx === parsedSteps.length - 1;

                        return (
                          <li key={`${activeItem.id}-${idx}`} className="relative flex items-center gap-4">
                            <div
                              className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ring-4 ring-[#FAFCFF] ${
                                isLast
                                  ? "bg-[#2563EB] text-white"
                                  : isFirst
                                    ? "border-2 border-[#CBD5E1] bg-white text-[#64748B]"
                                    : "border-2 border-[#93C5FD] bg-white text-[#2563EB]"
                              }`}
                            >
                              {isLast ? <Trophy className="h-3.5 w-3.5" /> : idx + 1}
                            </div>

                            <div
                              className={`flex flex-1 items-center justify-between gap-3 rounded-xl border px-4 py-3 ${
                                isLast
                                  ? "border-blue-200 bg-blue-50/50"
                                  : "border-[#EEF2F6] bg-white"
                              }`}
                            >
                              <div className="min-w-0">
                                <div className="text-sm font-semibold text-[#1E293B]">
                                  {step.title}
                                </div>
                                <div className="text-[11px] text-[#94A3B8]">
                                  {isFirst
                                    ? "ระดับเริ่มต้นของเส้นทาง"
                                    : isLast
                                      ? "เป้าหมายสูงสุดของเส้นทางนี้"
                                      : `ขั้นพัฒนาที่ ${idx + 1}`}
                                </div>
                              </div>
                              {step.grade && (
                                <span
                                  className={`shrink-0 rounded-md px-2.5 py-1 font-mono text-xs font-semibold ${
                                    isLast
                                      ? "bg-white text-[#2563EB]"
                                      : "bg-[#F1F5F9] text-[#475569]"
                                  }`}
                                >
                                  {step.grade}
                                </span>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="เพิ่มเส้นทางความก้าวหน้า (Career Path)"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              ยกเลิก
            </Button>
            <Button
              variant="primary"
              leftIcon={<CheckCircle2 className="h-4 w-4" />}
              onClick={handleAddPath}
              disabled={!formTrackName.trim()}
            >
              บันทึกเส้นทาง
            </Button>
          </>
        }
      >
        <div className="space-y-3.5">
          <Input
            label="ชื่อเส้นทางสายอาชีพ (Track Name)"
            placeholder="เช่น Data Science Specialist Track"
            value={formTrackName}
            onChange={(e) => setFormTrackName(e.target.value)}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              label="กลุ่มสายงาน"
              value={formFamily}
              onChange={(e) => setFormFamily(e.target.value)}
            />
            <Select
              label="รูปแบบสายการเติบโต"
              value={formTrackType}
              onChange={(v) => setFormTrackType(v as CareerTrackType)}
              options={[
                { value: "Management", label: "Management Track" },
                { value: "Specialist", label: "Specialist Track" },
                { value: "Dual", label: "Dual Track" },
              ]}
            />
          </div>
          <Input
            label="ลำดับตำแหน่ง (คั่นด้วยเครื่องหมายจุลภาค ,)"
            value={formStepsText}
            onChange={(e) => setFormStepsText(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}
