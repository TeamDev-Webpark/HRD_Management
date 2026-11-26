"use client";

import { useMemo, useState } from "react";
import { CalendarDays, FolderOpen, MapPin, Pencil, Plus, Video } from "lucide-react";
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
import type { SessionStatus, TrainingSessionItem } from "@/data/mock/trainingOperations";

interface TrainingSessionPanelProps {
  items: TrainingSessionItem[];
  onChange: (items: TrainingSessionItem[]) => void;
  onNotify: (message: string) => void;
}

const PAGE_SIZE = 5;

const SESSION_STATUS_META: Record<
  SessionStatus,
  { label: string; variant: "primary" | "warning" | "success" | "danger"; hint: string }
> = {
  open: { label: "เปิดรับสมัคร", variant: "primary", hint: "พนักงานสามารถลงทะเบียนเข้าร่วมรุ่นนี้ได้" },
  ongoing: { label: "กำลังอบรม", variant: "warning", hint: "อยู่ระหว่างดำเนินการเรียนการสอนและเช็คชื่อ" },
  completed: { label: "เสร็จสิ้น", variant: "success", hint: "จัดอบรมครบตามกำหนดและสรุปผลเรียบร้อยแล้ว" },
  cancelled: { label: "ยกเลิกรุ่น", variant: "danger", hint: "ยกเลิกการจัดอบรมรุ่นนี้และแจ้งผู้ลงทะเบียนแล้ว" },
};

const MODE_BADGE: Record<
  TrainingSessionItem["deliveryMode"],
  { variant: "primary" | "success" | "neutral"; hint: string }
> = {
  Onsite: { variant: "primary", hint: "จัดอบรมในห้องเรียนหรือสถานที่จริง" },
  Online: { variant: "success", hint: "จัดอบรมออนไลน์แบบสดผ่าน Microsoft Teams / Zoom" },
  Hybrid: { variant: "neutral", hint: "รองรับทั้งเข้าห้องอบรมจริงและเรียนออนไลน์พร้อมกัน" },
};

export function TrainingSessionPanel({ items, onChange, onNotify }: TrainingSessionPanelProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | SessionStatus>("all");
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [courseTitle, setCourseTitle] = useState("");
  const [batchName, setBatchName] = useState("รุ่นที่ 1 / 2569");
  const [trainerName, setTrainerName] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [timeRange, setTimeRange] = useState("09:00 – 16:00 น.");
  const [location, setLocation] = useState("");
  const [deliveryMode, setDeliveryMode] = useState<TrainingSessionItem["deliveryMode"]>("Onsite");
  const [capacity, setCapacity] = useState("30");
  const [status, setStatus] = useState<SessionStatus>("open");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchStatus = statusFilter === "all" || item.status === statusFilter;
      const matchQuery =
        !q ||
        item.code.toLowerCase().includes(q) ||
        item.courseTitle.toLowerCase().includes(q) ||
        item.trainerName.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q);
      return matchStatus && matchQuery;
    });
  }, [items, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const openCreate = () => {
    setEditingId(null);
    setCourseTitle("");
    setBatchName("รุ่นที่ 1 / 2569");
    setTrainerName("ดร.ภาณุพงศ์ รัตนชัย");
    setDateRange("18–19 ธ.ค. 2569");
    setTimeRange("09:00 – 16:00 น.");
    setLocation("ห้องอบรม Innovation Hall ชั้น 8");
    setDeliveryMode("Onsite");
    setCapacity("30");
    setStatus("open");
    setModalOpen(true);
  };

  const openEdit = (item: TrainingSessionItem) => {
    setEditingId(item.id);
    setCourseTitle(item.courseTitle);
    setBatchName(item.batchName);
    setTrainerName(item.trainerName);
    setDateRange(item.dateRange);
    setTimeRange(item.timeRange);
    setLocation(item.location);
    setDeliveryMode(item.deliveryMode);
    setCapacity(String(item.capacity));
    setStatus(item.status);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!courseTitle.trim()) return;
    if (editingId) {
      onChange(
        items.map((item) =>
          item.id === editingId
            ? {
                ...item,
                courseTitle: courseTitle.trim(),
                batchName: batchName.trim() || item.batchName,
                trainerName: trainerName.trim() || item.trainerName,
                dateRange: dateRange.trim() || item.dateRange,
                timeRange: timeRange.trim() || item.timeRange,
                location: location.trim() || item.location,
                deliveryMode,
                capacity: Math.max(1, Number(capacity) || 1),
                status,
              }
            : item
        )
      );
      onNotify(`อัปเดตรุ่นฝึกอบรม "${courseTitle.trim()}" เรียบร้อยแล้ว`);
    } else {
      const nextNum = String(items.length + 1).padStart(2, "0");
      const created: TrainingSessionItem = {
        id: `SES-${Date.now()}`,
        code: `SES-2569-${nextNum}`,
        courseTitle: courseTitle.trim(),
        batchName: batchName.trim() || "รุ่นที่ 1 / 2569",
        trainerName: trainerName.trim() || "วิทยากรภายใน",
        dateRange: dateRange.trim() || "รอระบุวันที่",
        timeRange: timeRange.trim() || "09:00 – 16:00 น.",
        location: location.trim() || "ห้องประชุมสำนักงานใหญ่",
        deliveryMode,
        enrolled: 0,
        capacity: Math.max(1, Number(capacity) || 30),
        status,
      };
      onChange([created, ...items]);
      setPage(1);
      onNotify(`เปิดรุ่นฝึกอบรม "${created.courseTitle}" (${created.code}) แล้ว`);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <SearchBar
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="ค้นหารหัสรุ่น หลักสูตร หรือวิทยากร..."
            containerClassName="w-full sm:w-64"
          />
          <Select
            value={statusFilter}
            onChange={(v) => {
              setStatusFilter(v as "all" | SessionStatus);
              setPage(1);
            }}
            options={[
              { value: "all", label: "ทุกสถานะรุ่นอบรม" },
              { value: "open", label: "เปิดรับสมัคร" },
              { value: "ongoing", label: "กำลังอบรม" },
              { value: "completed", label: "เสร็จสิ้น" },
              { value: "cancelled", label: "ยกเลิกรุ่น" },
            ]}
            className="w-full sm:w-48"
          />
        </div>

        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={openCreate}>
          เปิดรุ่นฝึกอบรมใหม่
        </Button>
      </div>

      {/* Table */}
      {paged.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="ไม่พบรุ่นฝึกอบรมที่ค้นหา"
          description="ลองปรับคำค้นหาหรือเปลี่ยนตัวกรองสถานะ"
          action={
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
                setPage(1);
              }}
            >
              ล้างตัวกรอง
            </Button>
          }
        />
      ) : (
        <>
          <TableContainer className="rounded-xl border border-[#EEF2F6]">
            <Table>
              <TableHeader className="bg-[#F8FAFC]">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-5">รหัสรุ่น / หลักสูตร</TableHead>
                  <TableHead className="w-28 text-center">รูปแบบ</TableHead>
                  <TableHead className="w-52">วันเวลา & สถานที่</TableHead>
                  <TableHead className="w-44 px-4">จำนวนที่นั่ง</TableHead>
                  <TableHead className="w-36 text-center">สถานะ</TableHead>
                  <TableHead className="w-24 pr-5 text-center">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((item) => {
                  const st = SESSION_STATUS_META[item.status];
                  const mode = MODE_BADGE[item.deliveryMode];
                  const seatPct = item.capacity
                    ? Math.min(100, Math.round((item.enrolled / item.capacity) * 100))
                    : 0;
                  const seatsLeft = Math.max(0, item.capacity - item.enrolled);

                  return (
                    <TableRow key={item.id}>
                      <TableCell className="py-3.5 pl-5">
                        <span className="rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                          {item.code}
                        </span>
                        <p className="mt-1 font-semibold text-[#1E293B]">{item.courseTitle}</p>
                        <p className="text-xs text-[#94A3B8]">
                          {item.batchName} • วิทยากร: {item.trainerName}
                        </p>
                      </TableCell>
                      <TableCell className="py-3.5 text-center">
                        <Tooltip title={`รูปแบบ ${item.deliveryMode}`} content={mode.hint}>
                          <Badge variant={mode.variant} className="cursor-help">
                            {item.deliveryMode}
                          </Badge>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="py-3.5">
                        <p className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1E293B]">
                          <CalendarDays className="h-3.5 w-3.5 text-[#2563EB]" />
                          {item.dateRange}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[#94A3B8]">
                          {item.deliveryMode === "Online" ? (
                            <Video className="h-3.5 w-3.5 shrink-0 text-[#22B89A]" />
                          ) : (
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#94A3B8]" />
                          )}
                          <span className="truncate max-w-[180px]">{item.location}</span>
                        </p>
                      </TableCell>
                      <TableCell className="py-3.5 px-4">
                        <Tooltip
                          className="block w-full"
                          content={`ลงทะเบียนแล้ว ${item.enrolled} จาก ${item.capacity} ที่นั่ง (ว่าง ${seatsLeft} ที่นั่ง)`}
                        >
                          <div className="w-full space-y-1.5 cursor-help">
                            <div className="flex items-center justify-between gap-2 text-xs tabular-nums">
                              <span className="font-semibold text-[#1E293B]">
                                {item.enrolled}/{item.capacity} คน
                              </span>
                              <span className="text-[#94A3B8]">{seatPct}%</span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-[#EEF2F6]">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  seatPct >= 100
                                    ? "bg-[#F5B73B]"
                                    : seatPct >= 75
                                      ? "bg-[#2563EB]"
                                      : "bg-[#22B89A]"
                                }`}
                                style={{ width: `${seatPct}%` }}
                              />
                            </div>
                          </div>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="py-3.5 text-center">
                        <Tooltip title={`สถานะ: ${st.label}`} content={st.hint}>
                          <Badge variant={st.variant} dot className="cursor-help">
                            {st.label}
                          </Badge>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="py-3.5 pr-5 text-center">
                        <Tooltip content="แก้ไขรายละเอียดรุ่นอบรม">
                          <button
                            type="button"
                            onClick={() => openEdit(item)}
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

          <Pagination
            currentPage={currentPage}
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </>
      )}

      {/* Create / Edit Session Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "แก้ไขรายละเอียดรุ่นฝึกอบรม" : "เปิดรุ่นฝึกอบรมใหม่"}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              ยกเลิก
            </Button>
            <Button disabled={!courseTitle.trim()} onClick={handleSave}>
              {editingId ? "บันทึกการแก้ไข" : "เปิดรุ่นอบรม"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="ชื่อหลักสูตร"
            placeholder="เช่น Generative AI & Prompt Engineering for Work"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            required
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="ชื่อรุ่น (Batch)"
              value={batchName}
              onChange={(e) => setBatchName(e.target.value)}
            />
            <Input
              label="วิทยากรผู้สอน"
              value={trainerName}
              onChange={(e) => setTrainerName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="วันที่จัดอบรม"
              placeholder="เช่น 18–19 ธ.ค. 2569"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            />
            <Input
              label="ช่วงเวลา"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            />
          </div>
          <Input
            label="สถานที่ / ช่องทางออนไลน์"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Select
              label="รูปแบบการอบรม"
              value={deliveryMode}
              onChange={(v) => setDeliveryMode(v as TrainingSessionItem["deliveryMode"])}
              options={[
                { value: "Onsite", label: "Onsite (ห้องเรียน)" },
                { value: "Online", label: "Online (สดออนไลน์)" },
                { value: "Hybrid", label: "Hybrid (ผสมผสาน)" },
              ]}
            />
            <Input
              label="จำนวนรับ (คน)"
              type="number"
              min={1}
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
            />
            <Select
              label="สถานะรุ่น"
              value={status}
              onChange={(v) => setStatus(v as SessionStatus)}
              options={[
                { value: "open", label: "เปิดรับสมัคร" },
                { value: "ongoing", label: "กำลังอบรม" },
                { value: "completed", label: "เสร็จสิ้น" },
                { value: "cancelled", label: "ยกเลิกรุ่น" },
              ]}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
