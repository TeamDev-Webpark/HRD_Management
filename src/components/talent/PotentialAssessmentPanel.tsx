"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, ClipboardCheck, FolderOpen, Pencil } from "lucide-react";
import {
  Badge,
  Button,
  EmptyState,
  Input,
  Modal,
  SearchBar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
} from "@/components/ui";
import type { PotentialAssessmentItem } from "@/data/mock/talentManagement";

interface PotentialAssessmentPanelProps {
  items: PotentialAssessmentItem[];
  onChange: (items: PotentialAssessmentItem[]) => void;
  onNotify: (message: string) => void;
}

function getPotentialSummary(item: PotentialAssessmentItem) {
  const avg = Number(
    ((item.learningAgility + item.leadershipDrive + item.strategicThinking) / 3).toFixed(2)
  );
  if (avg >= 4.2) return { avg, label: "ศักยภาพสูง (High)", variant: "success" as const };
  if (avg >= 3.5) return { avg, label: "ศักยภาพปานกลาง (Moderate)", variant: "primary" as const };
  return { avg, label: "กำลังพัฒนา (Developing)", variant: "warning" as const };
}

export function PotentialAssessmentPanel({
  items,
  onChange,
  onNotify,
}: PotentialAssessmentPanelProps) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<PotentialAssessmentItem | null>(null);
  const [learning, setLearning] = useState("4.5");
  const [leadership, setLeadership] = useState("4.2");
  const [strategic, setStrategic] = useState("4.0");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.code.toLowerCase().includes(q) ||
        item.employeeName.toLowerCase().includes(q) ||
        item.department.toLowerCase().includes(q) ||
        item.position.toLowerCase().includes(q)
    );
  }, [items, search]);

  const openAssess = (item: PotentialAssessmentItem) => {
    setSelected(item);
    setLearning(String(item.learningAgility));
    setLeadership(String(item.leadershipDrive));
    setStrategic(String(item.strategicThinking));
  };

  const handleSave = () => {
    if (!selected) return;
    const clamp = (v: string) => Math.min(5, Math.max(1, Number(v) || 3));
    onChange(
      items.map((row) =>
        row.id === selected.id
          ? {
              ...row,
              learningAgility: clamp(learning),
              leadershipDrive: clamp(leadership),
              strategicThinking: clamp(strategic),
              assessedDate: "27 พ.ย. 2569",
              status: "assessed",
            }
          : row
      )
    );
    onNotify(`บันทึกผลประเมินศักยภาพของ ${selected.employeeName} เรียบร้อยแล้ว`);
    setSelected(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="ค้นหาชื่อพนักงาน, รหัส หรือแผนก..."
          className="w-full sm:w-80"
        />
        <div className="text-xs text-[#64748B]">
          ประเมินจาก 3 มิติหลัก (คะแนนเต็ม 5.0): Learning Agility, Leadership Drive, Strategic Thinking
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="ไม่พบรายการประเมินศักยภาพ"
          description="ลองปรับคำค้นหาใหม่"
        />
      ) : (
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[24%]">รหัส / พนักงาน</TableHead>
                <TableHead className="w-[12%] text-center">
                  <Tooltip
                    title="Learning Agility"
                    content="ความรวดเร็วในการเรียนรู้สิ่งใหม่ ปรับตัวต่อการเปลี่ยนแปลง และนำบทเรียนมาประยุกต์ใช้"
                  >
                    <span className="cursor-help border-b border-dashed border-[#CBD5E1]">Learning</span>
                  </Tooltip>
                </TableHead>
                <TableHead className="w-[12%] text-center">
                  <Tooltip
                    title="Leadership Drive"
                    content="แรงขับเคลื่อนในการนำทีม สร้างอิทธิพลเชิงบวก และความพร้อมรับผิดชอบบทบาทที่ใหญ่ขึ้น"
                  >
                    <span className="cursor-help border-b border-dashed border-[#CBD5E1]">Leadership</span>
                  </Tooltip>
                </TableHead>
                <TableHead className="w-[12%] text-center">
                  <Tooltip
                    title="Strategic Thinking"
                    content="ความสามารถในการมองภาพรวมระยะยาว เชื่อมโยงข้อมูลธุรกิจ และตัดสินใจเชิงกลยุทธ์"
                  >
                    <span className="cursor-help border-b border-dashed border-[#CBD5E1]">Strategic</span>
                  </Tooltip>
                </TableHead>
                <TableHead className="w-[16%] text-center">สรุปศักยภาพ</TableHead>
                <TableHead className="w-[12%] text-center">สถานะ</TableHead>
                <TableHead className="w-[12%] text-center">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => {
                const summary = getPotentialSummary(item);
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <span className="inline-block rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                        {item.code}
                      </span>
                      <div className="mt-1 font-semibold text-[#1E293B]">{item.employeeName}</div>
                      <div className="text-xs text-[#64748B]">
                        {item.position} • {item.department}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-semibold text-[#1E293B]">
                      {item.learningAgility.toFixed(1)}
                    </TableCell>
                    <TableCell className="text-center font-semibold text-[#1E293B]">
                      {item.leadershipDrive.toFixed(1)}
                    </TableCell>
                    <TableCell className="text-center font-semibold text-[#1E293B]">
                      {item.strategicThinking.toFixed(1)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Tooltip content={`คะแนนศักยภาพเฉลี่ย ${summary.avg} / 5.0`}>
                        <Badge variant={summary.variant}>{summary.avg} • {summary.label.split(" ")[0]}</Badge>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="text-center">
                      <Tooltip
                        content={
                          item.status === "assessed"
                            ? `ประเมินโดย ${item.assessorName} เมื่อ ${item.assessedDate}`
                            : `รอ ${item.assessorName} บันทึกคะแนนประเมินศักยภาพ`
                        }
                      >
                        <Badge variant={item.status === "assessed" ? "success" : "warning"} dot>
                          {item.status === "assessed" ? "ประเมินแล้ว" : "รอประเมิน"}
                        </Badge>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        <Tooltip
                          content={
                            item.status === "pending"
                              ? "บันทึกคะแนนประเมินศักยภาพทั้ง 3 มิติ"
                              : "ปรับปรุงคะแนนประเมินศักยภาพทั้ง 3 มิติ"
                          }
                        >
                          <Button
                            size="sm"
                            variant={item.status === "pending" ? "primary" : "outline"}
                            leftIcon={
                              item.status === "pending" ? (
                                <ClipboardCheck className="h-3.5 w-3.5" />
                              ) : (
                                <Pencil className="h-3.5 w-3.5" />
                              )
                            }
                            onClick={() => openAssess(item)}
                            className="w-[104px] justify-center"
                          >
                            {item.status === "pending" ? "ประเมิน" : "ปรับคะแนน"}
                          </Button>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title="ประเมินศักยภาพ (Potential Assessment)"
        description={
          selected ? `${selected.employeeName} (${selected.position})` : undefined
        }
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setSelected(null)}>
              ยกเลิก
            </Button>
            <Button
              variant="primary"
              leftIcon={<CheckCircle2 className="h-4 w-4" />}
              onClick={handleSave}
            >
              บันทึกคะแนน
            </Button>
          </>
        }
      >
        <div className="space-y-3.5">
          <Input
            label="Learning Agility (1.0 – 5.0)"
            type="number"
            step="0.1"
            min={1}
            max={5}
            value={learning}
            onChange={(e) => setLearning(e.target.value)}
          />
          <Input
            label="Leadership Drive (1.0 – 5.0)"
            type="number"
            step="0.1"
            min={1}
            max={5}
            value={leadership}
            onChange={(e) => setLeadership(e.target.value)}
          />
          <Input
            label="Strategic Thinking (1.0 – 5.0)"
            type="number"
            step="0.1"
            min={1}
            max={5}
            value={strategic}
            onChange={(e) => setStrategic(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}
