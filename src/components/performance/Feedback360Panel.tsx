"use client";

import { useMemo, useState } from "react";
import { Eye, FolderOpen, Send, Star } from "lucide-react";
import {
  Badge,
  Button,
  EmptyState,
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
import type { Feedback360Item } from "@/data/mock/pmsReview";

interface Feedback360PanelProps {
  items: Feedback360Item[];
  onNotify: (message: string) => void;
}

export function Feedback360Panel({ items, onNotify }: Feedback360PanelProps) {
  const [search, setSearch] = useState("");
  const [viewing, setViewing] = useState<Feedback360Item | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) =>
        i.code.toLowerCase().includes(q) ||
        i.employeeName.toLowerCase().includes(q) ||
        i.department.toLowerCase().includes(q)
    );
  }, [items, search]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="ค้นหาชื่อผู้รับการประเมิน 360° หรือแผนก..."
          containerClassName="w-full sm:w-72"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="ไม่พบรายการประเมิน 360° Feedback"
          description="ลองปรับคำค้นหาใหม่"
        />
      ) : (
        <TableContainer className="rounded-xl border border-[#EEF2F6]">
          <Table>
            <TableHeader className="bg-[#F8FAFC]">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[24%] pl-5">รหัส / ผู้รับการประเมิน 360°</TableHead>
                <TableHead className="hidden xl:table-cell">จุดแข็ง / ความคิดเห็นเด่น</TableHead>
                <TableHead className="w-48 px-5">อัตราการตอบกลับ</TableHead>
                <TableHead className="w-32 px-4 text-center">คะแนนเฉลี่ย</TableHead>
                <TableHead className="w-36 px-4 text-center">สถานะ</TableHead>
                <TableHead className="w-44 pr-5 text-center">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => {
                const pct = item.invitedCount
                  ? Math.round((item.respondedCount / item.invitedCount) * 100)
                  : 0;
                return (
                  <TableRow key={item.id}>
                    <TableCell className="py-3.5 pl-5">
                      <span className="rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                        {item.code}
                      </span>
                      <p className="mt-1 font-semibold text-[#1E293B]">{item.employeeName}</p>
                      <p className="text-xs text-[#94A3B8]">
                        {item.position} • {item.department}
                      </p>
                    </TableCell>
                    <TableCell className="hidden max-w-sm py-3.5 text-xs leading-relaxed text-[#64748B] xl:table-cell">
                      <p className="line-clamp-2">{item.topHighlight}</p>
                    </TableCell>
                    <TableCell className="py-3.5 px-5">
                      <Tooltip
                        className="block w-full"
                        content={`มีผู้ประเมิน (เพื่อนร่วมงาน/ลูกทีม/หัวหน้า) ตอบแล้ว ${item.respondedCount} จาก ${item.invitedCount} ท่าน`}
                      >
                        <div className="w-full cursor-help space-y-1.5">
                          <div className="flex items-center justify-between gap-2 text-xs tabular-nums">
                            <span className="text-[#64748B]">
                              {item.respondedCount}/{item.invitedCount} ท่าน
                            </span>
                            <span className="font-semibold text-[#1E293B]">{pct}%</span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-[#EEF2F6]">
                            <div
                              className="h-full rounded-full bg-[#8B7CF6]"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="py-3.5 px-4 text-center">
                      <Tooltip content="คะแนนเฉลี่ยรวมทุกมิติ (เต็ม 5.0)">
                        <div className="inline-flex cursor-help items-center gap-1 rounded-full bg-[#FEF9EC] px-2.5 py-0.5 text-xs font-semibold text-[#C68A12]">
                          <Star className="h-3.5 w-3.5 fill-[#F5B73B] text-[#F5B73B]" />
                          <span className="tabular-nums">{item.avgScore.toFixed(1)}</span>
                        </div>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="py-3.5 px-4 text-center">
                      <Badge variant={item.status === "completed" ? "success" : "warning"} dot>
                        {item.status === "completed" ? "ครบถ้วนแล้ว" : "กำลังเก็บผล"}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3.5 pr-5 text-center">
                      <div className="inline-flex items-center justify-center gap-1.5">
                        <Tooltip content="ดูสรุปคะแนน 360° รายมิติ">
                          <Button
                            size="sm"
                            variant="outline"
                            className="whitespace-nowrap"
                            leftIcon={<Eye className="h-3.5 w-3.5 text-[#2563EB]" />}
                            onClick={() => setViewing(item)}
                          >
                            สรุปผล
                          </Button>
                        </Tooltip>
                        {item.status === "collecting" ? (
                          <Tooltip content="ส่งอีเมลเตือนผู้ประเมินที่ยังไม่ตอบกลับ">
                            <button
                              type="button"
                              onClick={() =>
                                onNotify(`ส่งแจ้งเตือนผู้ประเมิน 360° ของ "${item.employeeName}" แล้ว`)
                              }
                              className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-[#64748B] hover:bg-[#EFF6FF] hover:text-[#2563EB]"
                            >
                              <Send className="h-3.5 w-3.5" />
                            </button>
                          </Tooltip>
                        ) : (
                          <span aria-hidden="true" className="h-8 w-8 shrink-0" />
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

      <Modal
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        title={`รายงานผล 360° Feedback — ${viewing?.employeeName ?? ""}`}
        description={viewing ? `${viewing.position} • ตอบกลับแล้ว ${viewing.respondedCount}/${viewing.invitedCount} ท่าน (ไม่เปิดเผยชื่อผู้ตอบ)` : undefined}
        footer={
          <Button variant="outline" onClick={() => setViewing(null)}>
            ปิดหน้าต่าง
          </Button>
        }
      >
        {viewing && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl border border-[#EEF2F6] bg-[#F8FAFC] p-3">
                <p className="text-[11px] text-[#64748B]">ภาวะผู้นำ</p>
                <p className="mt-1 text-lg font-bold text-[#2563EB]">
                  {viewing.leadershipScore.toFixed(1)}
                </p>
              </div>
              <div className="rounded-xl border border-[#EEF2F6] bg-[#F8FAFC] p-3">
                <p className="text-[11px] text-[#64748B]">การทำงานร่วมกัน</p>
                <p className="mt-1 text-lg font-bold text-[#1CA388]">
                  {viewing.collaborationScore.toFixed(1)}
                </p>
              </div>
              <div className="rounded-xl border border-[#EEF2F6] bg-[#F8FAFC] p-3">
                <p className="text-[11px] text-[#64748B]">การสื่อสาร</p>
                <p className="mt-1 text-lg font-bold text-[#7C6CF6]">
                  {viewing.communicationScore.toFixed(1)}
                </p>
              </div>
            </div>
            <div className="rounded-xl border border-[#DBEAFE] bg-[#EFF6FF]/60 p-4 text-xs">
              <p className="font-bold text-[#2563EB]">สรุปความคิดเห็นเด่นจากผู้ร่วมงาน:</p>
              <p className="mt-1 leading-relaxed text-[#334155]">{viewing.topHighlight}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
