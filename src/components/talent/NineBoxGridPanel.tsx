"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, SlidersHorizontal, Sparkles } from "lucide-react";
import { Badge, Button, Modal, Select, Tooltip } from "@/components/ui";
import type { NineBoxScore, TalentPoolItem } from "@/data/mock/talentManagement";

interface NineBoxGridPanelProps {
  items: TalentPoolItem[];
  onChange: (items: TalentPoolItem[]) => void;
  onNotify: (message: string) => void;
}

interface BoxDef {
  id: number;
  perf: NineBoxScore;
  pot: NineBoxScore;
  title: string;
  subtitle: string;
  actionHint: string;
  tone: string;
  activeRing: string;
}

// Ordered top-to-bottom (Potential 3 -> 1), left-to-right (Performance 1 -> 3)
const NINE_BOXES: BoxDef[] = [
  { id: 7, perf: 1, pot: 3, title: "Enigma", subtitle: "ศักยภาพสูง • ผลงานต้องเร่ง", actionHint: "ค้นหาสาเหตุที่ผลงานยังไม่ถึงเป้า เช่น บทบาทไม่ตรงถนัด และช่วยโค้ชใกล้ชิด", tone: "bg-amber-50/70 border-amber-200", activeRing: "ring-amber-400" },
  { id: 8, perf: 2, pot: 3, title: "High Potential", subtitle: "ศักยภาพสูง • ผลงานดี", actionHint: "มอบหมายโปรเจกต์ท้าทายและพี่เลี้ยงผู้บริหารเพื่อเร่งผลงานสู่ระดับ Star", tone: "bg-blue-50/70 border-blue-200", activeRing: "ring-blue-500" },
  { id: 9, perf: 3, pot: 3, title: "Star (Top Talent)", subtitle: "ศักยภาพสูง • ผลงานโดดเด่น", actionHint: "กลุ่มผู้นำอนาคต ควรบรรจุเข้าแผนผู้สืบทอดตำแหน่ง (Succession) และดูแลการรักษาตัว", tone: "bg-emerald-50/80 border-emerald-200", activeRing: "ring-emerald-500" },
  { id: 4, perf: 1, pot: 2, title: "Dilemma", subtitle: "ศักยภาพกลาง • ผลงานต้องปรับ", actionHint: "ตั้งเป้าหมายระยะสั้นให้ชัดเจนและวางแผนพัฒนาทักษะเฉพาะจุด", tone: "bg-rose-50/50 border-rose-200", activeRing: "ring-rose-400" },
  { id: 5, perf: 2, pot: 2, title: "Core Player", subtitle: "กำลังหลักขององค์กร", actionHint: "พัฒนาทักษะเชิงลึกอย่างต่อเนื่องและสร้างความผูกพันในทีม", tone: "bg-slate-50 border-slate-200", activeRing: "ring-slate-400" },
  { id: 6, perf: 3, pot: 2, title: "High Performer", subtitle: "ผลงานยอดเยี่ยม • เชี่ยวชาญงาน", actionHint: "ให้รางวัลตามผลงานและส่งเสริมการเป็น Mentor ถ่ายทอดความรู้ให้ทีม", tone: "bg-blue-50/60 border-blue-200", activeRing: "ring-blue-400" },
  { id: 1, perf: 1, pot: 1, title: "Underperformer", subtitle: "ต้องเข้าแผน PIP / โค้ชใกล้ชิด", actionHint: "เข้าสู่แผนปรับปรุงผลงาน (PIP) หรือทบทวนความเหมาะสมของตำแหน่ง", tone: "bg-rose-50/70 border-rose-200", activeRing: "ring-rose-500" },
  { id: 2, perf: 2, pot: 1, title: "Effective", subtitle: "ปฏิบัติงานได้ตามมาตรฐาน", actionHint: "รักษาเสถียรภาพผลงานและเสริมทักษะใหม่ตามการเปลี่ยนแปลงของงาน", tone: "bg-slate-50 border-slate-200", activeRing: "ring-slate-400" },
  { id: 3, perf: 3, pot: 1, title: "Trusted Pro", subtitle: "ผู้เชี่ยวชาญเฉพาะทางที่เชื่อถือได้", actionHint: "ส่งเสริมการเติบโตสาย Specialist และรักษาความเชี่ยวชาญเฉพาะทางไว้กับองค์กร", tone: "bg-amber-50/60 border-amber-200", activeRing: "ring-amber-400" },
];

export function NineBoxGridPanel({ items, onChange, onNotify }: NineBoxGridPanelProps) {
  const [selectedBoxId, setSelectedBoxId] = useState<number | null>(9);
  const [editingTalent, setEditingTalent] = useState<TalentPoolItem | null>(null);
  const [formPerf, setFormPerf] = useState<string>("3");
  const [formPot, setFormPot] = useState<string>("3");

  const activeBox = useMemo(
    () => NINE_BOXES.find((b) => b.id === selectedBoxId) ?? null,
    [selectedBoxId]
  );

  const visibleTalents = useMemo(() => {
    if (!activeBox) return items;
    return items.filter(
      (t) => t.performance === activeBox.perf && t.potential === activeBox.pot
    );
  }, [items, activeBox]);

  const openAdjust = (item: TalentPoolItem) => {
    setEditingTalent(item);
    setFormPerf(String(item.performance));
    setFormPot(String(item.potential));
  };

  const handleSavePosition = () => {
    if (!editingTalent) return;
    const perf = Number(formPerf) as NineBoxScore;
    const pot = Number(formPot) as NineBoxScore;
    onChange(
      items.map((row) =>
        row.id === editingTalent.id ? { ...row, performance: perf, potential: pot } : row
      )
    );
    const targetBox = NINE_BOXES.find((b) => b.perf === perf && b.pot === pot);
    if (targetBox) setSelectedBoxId(targetBox.id);
    onNotify(
      `ย้ายตำแหน่ง 9-Box ของ ${editingTalent.employeeName} ไปที่ ${targetBox?.title ?? "กล่องใหม่"} แล้ว`
    );
    setEditingTalent(null);
  };

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
      {/* Left: Clean 3x3 Interactive Matrix */}
      <div className="space-y-3 lg:col-span-7">
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#EEF2F6] bg-[#F8FAFC] px-3.5 py-2 text-xs">
          <div className="text-[#475569]">
            <span className="font-semibold text-[#1E293B]">วิธีอ่านระดับ:</span> มุมขวาบน{" "}
            <span className="font-bold text-emerald-700">B9 (Star) = สูงสุด</span> • มุมซ้ายล่าง{" "}
            <span className="font-semibold text-rose-600">B1 = ต่ำสุด</span>
          </div>
          {selectedBoxId !== null && (
            <button
              type="button"
              onClick={() => setSelectedBoxId(null)}
              className="cursor-pointer text-xs font-semibold text-[#2563EB] hover:underline"
            >
              แสดงทั้งหมด ({items.length} คน)
            </button>
          )}
        </div>

        <div className="flex gap-2.5">
          {/* Y-Axis Labels (Potential High -> Low) */}
          <div className="hidden w-16 shrink-0 flex-col justify-between py-4 text-right text-[11px] font-semibold text-[#64748B] sm:flex">
            <div>
              <div>ศักยภาพสูง</div>
              <div className="text-[10px] font-normal text-[#94A3B8]">(ระดับ 3)</div>
            </div>
            <div>
              <div>ศักยภาพกลาง</div>
              <div className="text-[10px] font-normal text-[#94A3B8]">(ระดับ 2)</div>
            </div>
            <div>
              <div>ศักยภาพต่ำ</div>
              <div className="text-[10px] font-normal text-[#94A3B8]">(ระดับ 1)</div>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <div className="grid grid-cols-3 gap-3">
              {NINE_BOXES.map((box) => {
                const count = items.filter(
                  (t) => t.performance === box.perf && t.potential === box.pot
                ).length;
                const isSelected = selectedBoxId === box.id;

                return (
                  <Tooltip
                    key={box.id}
                    className="block w-full"
                    title={`Box ${box.id}: ${box.title} (${count} คน)`}
                    content={box.actionHint}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedBoxId(isSelected ? null : box.id)}
                      className={`flex h-28 w-full cursor-pointer flex-col justify-between rounded-2xl border p-3.5 text-left transition-all ${box.tone} ${
                        isSelected ? `ring-2 ${box.activeRing} shadow-xs` : "hover:brightness-[0.98]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-[#1E293B]">{box.title}</span>
                        <span className="rounded-md bg-white/80 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#64748B]">
                          B{box.id}
                        </span>
                      </div>
                      <div className="flex items-end justify-between gap-2">
                        <span className="line-clamp-1 text-[11px] text-[#64748B]">{box.subtitle}</span>
                        <span className="shrink-0 rounded-lg bg-white px-2 py-0.5 text-sm font-bold text-[#1E293B] shadow-2xs">
                          {count}
                        </span>
                      </div>
                    </button>
                  </Tooltip>
                );
              })}
            </div>

            <div className="grid grid-cols-3 text-center text-[11px] font-semibold text-[#64748B]">
              <span>ผลงานต่ำ (ระดับ 1)</span>
              <span>ผลงานกลาง (ระดับ 2)</span>
              <span>ผลงานสูง (ระดับ 3) →</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Focused List of Talents in Selected Box */}
      <div className="rounded-2xl border border-[#EEF2F6] bg-[#FAFCFF] p-5 lg:col-span-5">
        <div className="flex items-center justify-between border-b border-[#EEF2F6] pb-3.5">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#2563EB]" />
              <h3 className="text-sm font-bold text-[#1E293B]">
                {activeBox ? `Box ${activeBox.id}: ${activeBox.title}` : "พนักงานทั้งหมดใน 9-Box"}
              </h3>
            </div>
            <p className="mt-0.5 text-xs text-[#64748B]">
              {activeBox ? activeBox.subtitle : "คลิกเลือกกล่องด้านซ้ายเพื่อกรองดูเฉพาะกลุ่ม"}
            </p>
          </div>
          <Badge variant="primary">{visibleTalents.length} คน</Badge>
        </div>

        <div className="mt-4 space-y-2.5">
          {visibleTalents.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-white p-6 text-center text-xs text-[#94A3B8]">
              ยังไม่มีพนักงานในกล่องนี้
            </div>
          ) : (
            visibleTalents.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-[#EEF2F6] bg-white p-3.5"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-[#F3F0FF] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#7C6CF6]">
                      {t.employeeCode}
                    </span>
                    <span className="truncate text-sm font-semibold text-[#1E293B]">
                      {t.employeeName}
                    </span>
                  </div>
                  <div className="mt-0.5 truncate text-xs text-[#64748B]">
                    {t.position} • {t.department}
                  </div>
                </div>
                <Tooltip content="ปรับตำแหน่ง Performance / Potential ใน 9-Box">
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<SlidersHorizontal className="h-3.5 w-3.5" />}
                    onClick={() => openAdjust(t)}
                  >
                    ย้ายกล่อง
                  </Button>
                </Tooltip>
              </div>
            ))
          )}
        </div>
      </div>

      <Modal
        open={Boolean(editingTalent)}
        onClose={() => setEditingTalent(null)}
        title="ปรับตำแหน่ง 9-Box Grid"
        description={
          editingTalent ? `${editingTalent.employeeName} (${editingTalent.position})` : undefined
        }
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setEditingTalent(null)}>
              ยกเลิก
            </Button>
            <Button
              variant="primary"
              leftIcon={<CheckCircle2 className="h-4 w-4" />}
              onClick={handleSavePosition}
            >
              บันทึกตำแหน่ง
            </Button>
          </>
        }
      >
        <div className="space-y-3.5">
          <Select
            label="ระดับผลงาน (Performance — แกนนอน)"
            value={formPerf}
            onChange={setFormPerf}
            options={[
              { value: "3", label: "3 — สูง (High Performance)" },
              { value: "2", label: "2 — ปานกลาง (Moderate)" },
              { value: "1", label: "1 — ต่ำ (Low)" },
            ]}
          />
          <Select
            label="ระดับศักยภาพ (Potential — แกนตั้ง)"
            value={formPot}
            onChange={setFormPot}
            options={[
              { value: "3", label: "3 — สูง (High Potential)" },
              { value: "2", label: "2 — ปานกลาง (Moderate)" },
              { value: "1", label: "1 — ต่ำ (Low)" },
            ]}
          />
        </div>
      </Modal>
    </div>
  );
}
