"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, FolderOpen, PlayCircle, Plus } from "lucide-react";
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
  IdpActivityItem,
  IdpActivityStatus,
  IdpMethod,
} from "@/data/mock/idpData";

interface IdpActivitiesPanelProps {
  items: IdpActivityItem[];
  onChange: (items: IdpActivityItem[]) => void;
  onNotify: (message: string) => void;
}

const PAGE_SIZE = 5;

const METHOD_META: Record<
  IdpMethod,
  { label: string; variant: "primary" | "warning" | "success"; hint: string }
> = {
  "70-ojt": {
    label: "70% On-the-Job",
    variant: "primary",
    hint: "เรียนรู้จากการลงมือปฏิบัติจริง โปรเจกต์พิเศษ หรือ Job Rotation",
  },
  "20-coaching": {
    label: "20% Coaching",
    variant: "warning",
    hint: "เรียนรู้จากการโค้ชชิ่ง พี่เลี้ยง (Mentoring) และรับ Feedback",
  },
  "10-training": {
    label: "10% Training",
    variant: "success",
    hint: "เรียนรู้ผ่านหลักสูตรฝึกอบรม คอร์สออนไลน์ (LMS) หรือสัมมนา",
  },
};

const STATUS_META: Record<
  IdpActivityStatus,
  { label: string; variant: "neutral" | "primary" | "success" }
> = {
  planned: { label: "วางแผนแล้ว", variant: "neutral" },
  "in-progress": { label: "กำลังดำเนินการ", variant: "primary" },
  done: { label: "เสร็จสิ้น", variant: "success" },
};

export function IdpActivitiesPanel({
  items,
  onChange,
  onNotify,
}: IdpActivitiesPanelProps) {
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState<"all" | IdpMethod>("all");
  const [page, setPage] = useState(1);

  const [addOpen, setAddOpen] = useState(false);
  const [formEmpName, setFormEmpName] = useState("ณัฐพล เจริญสุข");
  const [formTitle, setFormTitle] = useState("");
  const [formMethod, setFormMethod] = useState<IdpMethod>("70-ojt");
  const [formDueDate, setFormDueDate] = useState("30 ธ.ค. 2569");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      if (methodFilter !== "all" && item.method !== methodFilter) return false;
      if (!q) return true;
      return (
        item.code.toLowerCase().includes(q) ||
        item.employeeName.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.idpCode.toLowerCase().includes(q)
      );
    });
  }, [items, search, methodFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleAdvanceStatus = (item: IdpActivityItem) => {
    const nextStatus: IdpActivityStatus = item.status === "planned" ? "in-progress" : "done";
    const nextProgress = nextStatus === "done" ? 100 : Math.max(item.progress, 50);
    onChange(
      items.map((row) =>
        row.id === item.id ? { ...row, status: nextStatus, progress: nextProgress } : row
      )
    );
    onNotify(
      nextStatus === "done"
        ? `บันทึกกิจกรรม "${item.title}" เสร็จสิ้น 100% แล้ว`
        : `เริ่มดำเนินกิจกรรม "${item.title}" แล้ว`
    );
  };

  const handleAddActivity = () => {
    if (!formTitle.trim()) return;
    const nextNum = String(items.length + 1).padStart(2, "0");
    const created: IdpActivityItem = {
      id: `ACT-${Date.now()}`,
      code: `ACT-69-${nextNum}`,
      idpCode: "IDP-69-01",
      employeeName: formEmpName.trim() || "พนักงานองค์กร",
      department: "ฝ่ายวิศวกรรมซอฟต์แวร์",
      title: formTitle.trim(),
      method: formMethod,
      dueDate: formDueDate.trim() || "30 ธ.ค. 2569",
      progress: 0,
      status: "planned",
    };
    onChange([created, ...items]);
    onNotify(`เพิ่มกิจกรรมพัฒนา "${created.title}" เรียบร้อยแล้ว`);
    setAddOpen(false);
    setFormTitle("");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          <SearchBar
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="ค้นหากิจกรรมพัฒนา, ชื่อพนักงาน หรือรหัส IDP..."
            className="w-full sm:w-80"
          />
          <Select
            aria-label="กรองตามรูปแบบ 70-20-10"
            value={methodFilter}
            onChange={(v) => {
              setMethodFilter(v as "all" | IdpMethod);
              setPage(1);
            }}
            options={[
              { value: "all", label: "รูปแบบ 70-20-10: ทั้งหมด" },
              { value: "70-ojt", label: "70% On-the-Job" },
              { value: "20-coaching", label: "20% Coaching" },
              { value: "10-training", label: "10% Training" },
            ]}
            className="w-52"
          />
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setAddOpen(true)}
        >
          เพิ่มกิจกรรมพัฒนา
        </Button>
      </div>

      {paged.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="ไม่พบกิจกรรมการพัฒนา"
          description="ลองปรับคำค้นหาหรือเพิ่มกิจกรรมใหม่ภายใต้โมเดล 70-20-10"
        />
      ) : (
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[20%]">รหัส / พนักงาน</TableHead>
                <TableHead className="w-[30%]">กิจกรรมพัฒนา</TableHead>
                <TableHead className="w-[14%] text-center">รูปแบบ 70-20-10</TableHead>
                <TableHead className="w-[12%] text-center">กำหนดเสร็จ</TableHead>
                <TableHead className="w-[12%] text-center">สถานะ</TableHead>
                <TableHead className="w-[12%] text-center">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map((item) => {
                const mMeta = METHOD_META[item.method];
                const sMeta = STATUS_META[item.status];
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <span className="inline-block rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                        {item.code}
                      </span>
                      <div className="mt-1 font-semibold text-[#1E293B]">{item.employeeName}</div>
                      <div className="text-xs text-[#64748B]">อ้างอิง {item.idpCode}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-[#1E293B]">{item.title}</div>
                      <div className="mt-1 text-xs text-[#94A3B8]">
                        ความคืบหน้าปัจจุบัน {item.progress}%
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Tooltip content={mMeta.hint}>
                        <Badge variant={mMeta.variant}>{mMeta.label}</Badge>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="text-center text-xs font-medium text-[#475569]">
                      {item.dueDate}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={sMeta.variant} dot>
                        {sMeta.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        {item.status !== "done" ? (
                          <Button
                            size="sm"
                            variant={item.status === "planned" ? "outline" : "primary"}
                            leftIcon={
                              item.status === "planned" ? (
                                <PlayCircle className="h-3.5 w-3.5" />
                              ) : (
                                <CheckCircle2 className="h-3.5 w-3.5" />
                              )
                            }
                            onClick={() => handleAdvanceStatus(item)}
                            className="w-[104px] justify-center"
                          >
                            {item.status === "planned" ? "เริ่มทำ" : "เสร็จสิ้น"}
                          </Button>
                        ) : (
                          <span className="inline-flex w-[104px] items-center justify-center text-xs font-medium text-emerald-600">
                            เสร็จแล้ว
                          </span>
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

      {totalPages > 1 && (
        <Pagination
          currentPage={safePage}
          onPageChange={setPage}
          totalItems={filtered.length}
          pageSize={PAGE_SIZE}
        />
      )}

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="เพิ่มกิจกรรมการพัฒนา (70-20-10)"
        description="ระบุรายละเอียดกิจกรรมพัฒนาเพื่อผูกเข้ากับแผน IDP ของพนักงาน"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              ยกเลิก
            </Button>
            <Button
              variant="primary"
              leftIcon={<CheckCircle2 className="h-4 w-4" />}
              onClick={handleAddActivity}
              disabled={!formTitle.trim()}
            >
              บันทึกกิจกรรม
            </Button>
          </>
        }
      >
        <div className="space-y-3.5">
          <Input
            label="ชื่อพนักงาน"
            value={formEmpName}
            onChange={(e) => setFormEmpName(e.target.value)}
          />
          <Input
            label="ชื่อกิจกรรมพัฒนา"
            placeholder="เช่น นำทีมออกแบบ Microservices Architecture"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Select
              label="รูปแบบการเรียนรู้ (70-20-10)"
              value={formMethod}
              onChange={(v) => setFormMethod(v as IdpMethod)}
              options={[
                { value: "70-ojt", label: "70% On-the-Job" },
                { value: "20-coaching", label: "20% Coaching & Mentoring" },
                { value: "10-training", label: "10% Formal Training" },
              ]}
            />
            <Input
              label="กำหนดเสร็จสิ้น"
              value={formDueDate}
              onChange={(e) => setFormDueDate(e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
