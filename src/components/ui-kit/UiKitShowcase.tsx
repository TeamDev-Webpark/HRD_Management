"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Download,
  FolderOpen,
  GraduationCap,
  Palette,
  Plus,
  Trash2,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  EmptyState,
  Input,
  Modal,
  SearchBar,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import {
  DESIGN_PALETTE,
  SAMPLE_CATEGORY_OPTIONS,
  SAMPLE_TRAINING_ROWS,
} from "@/data/mock/uiKitPreview";

export function UiKitShowcase() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseHours, setCourseHours] = useState("6");
  const [savedNotice, setSavedNotice] = useState(false);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return SAMPLE_TRAINING_ROWS.filter((row) => {
      const matchCategory = category === "all" || row.category === category;
      const matchQuery =
        !q ||
        row.code.toLowerCase().includes(q) ||
        row.courseName.toLowerCase().includes(q) ||
        row.department.toLowerCase().includes(q);
      return matchCategory && matchQuery;
    });
  }, [search, category]);

  const handleSaveDemo = () => {
    setModalOpen(false);
    setSavedNotice(true);
    setCourseTitle("");
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-8">
        {/* Top Header */}
        <div className="flex flex-col gap-5 rounded-2xl border border-[#E2E8F0] bg-white p-7 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#2563EB] text-white shadow-xs">
              <GraduationCap className="h-7 w-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="primary">Phase 0 – Step 0.1</Badge>
                <Badge variant="success" dot>
                  Design System &amp; UI Kit
                </Badge>
              </div>
              <h1 className="mt-2 text-2xl font-bold leading-snug text-[#1E293B] sm:text-[28px]">
                HRD Management System — UI Kit Preview
              </h1>
              <p className="mt-1.5 text-[15px] text-[#64748B]">
                แนวคิด Clean, Modern, Minimal &amp; Professional (ขาว-ฟ้า) โปร่ง สบายตา และใช้เป็นมาตรฐานเดียวกันทุก Module
              </p>
            </div>
          </div>

          <Button
            size="lg"
            leftIcon={<Plus className="h-5 w-5" />}
            onClick={() => setModalOpen(true)}
          >
            ทดสอบเปิด Modal
          </Button>
        </div>

        {savedNotice && (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3.5 text-[15px] font-medium text-[#16A34A]">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            บันทึกข้อมูลตัวอย่างสำเร็จ (Demo Modal Interaction)
          </div>
        )}

        {/* 1. Color Palette */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2.5">
              <Palette className="h-5 w-5 text-[#2563EB]" />
              1. Color Palette (ชุดสีมาตรฐาน)
            </CardTitle>
            <CardDescription>
              ใช้สีขาวเป็นพื้นผิวหลัก สีฟ้าเป็นสีเน้น และสีเทาอ่อนสำหรับเส้นแบ่งเพื่อความสบายตา
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {DESIGN_PALETTE.map((swatch) => (
                <div
                  key={swatch.name}
                  className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white"
                >
                  <div
                    className={`flex h-20 items-end justify-between px-3.5 py-2.5 ${
                      swatch.bordered ? "border-b border-[#E2E8F0]" : ""
                    }`}
                    style={{ backgroundColor: swatch.hex }}
                  >
                    <span
                      className={`font-mono text-[13px] font-semibold ${
                        swatch.lightText ? "text-white" : "text-[#1E293B]"
                      }`}
                    >
                      {swatch.hex}
                    </span>
                  </div>
                  <div className="px-3.5 py-3">
                    <p className="text-sm font-semibold text-[#1E293B]">{swatch.name}</p>
                    <p className="mt-0.5 text-xs text-[#64748B]">{swatch.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 2. Typography & Status Badges */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>2. Typography (Noto Sans Thai + Inter)</CardTitle>
              <CardDescription>
                ฟอนต์ Noto Sans Thai คู่กับ Inter สะอาดตา อ่านง่ายทั้งภาษาไทยและอังกฤษ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#94A3B8]">
                  Page Title • 28px Bold
                </span>
                <p className="mt-0.5 text-[28px] font-bold leading-snug text-[#1E293B]">
                  การบริหารและพัฒนาทรัพยากรบุคคล (HRD)
                </p>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-[#94A3B8]">
                  Section Heading • 18px SemiBold
                </span>
                <p className="mt-0.5 text-lg font-semibold text-[#1E293B]">
                  แผนฝึกอบรมประจำปี (Annual Training Plan)
                </p>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-[#94A3B8]">
                  Body Text • 15px Regular
                </span>
                <p className="mt-0.5 text-[15px] leading-relaxed text-[#1E293B]">
                  ข้อความเนื้อหาหลักอ่านง่าย ชัดเจน มีระยะห่างบรรทัดเหมาะสมสำหรับข้อมูลตารางและฟอร์ม
                </p>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-[#94A3B8]">
                  Secondary / Caption • 13px Regular
                </span>
                <p className="mt-0.5 text-[13px] text-[#64748B]">
                  อัปเดตล่าสุดเมื่อ 26 พ.ย. 2569 • เชื่อมโยงข้อมูลพนักงานจาก HRM
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Buttons &amp; Status Badges</CardTitle>
              <CardDescription>ปุ่มกดมาตรฐานและป้ายสถานะสีตามความหมาย</CardDescription>
            </CardHeader>
            <CardContent className="space-y-7">
              <div>
                <p className="mb-3 text-sm font-semibold text-[#64748B]">Button Variants</p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
                    สร้างรายการ
                  </Button>
                  <Button variant="secondary" leftIcon={<Download className="h-4 w-4" />}>
                    ส่งออกรายงาน
                  </Button>
                  <Button variant="outline">ยกเลิก</Button>
                  <Button variant="ghost">ดูเพิ่มเติม</Button>
                  <Button variant="danger" leftIcon={<Trash2 className="h-4 w-4" />}>
                    ลบข้อมูล
                  </Button>
                  <Button variant="primary" loading>
                    กำลังบันทึก
                  </Button>
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-semibold text-[#64748B]">Button Sizes</p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">ขนาดเล็ก (SM)</Button>
                  <Button size="md">ขนาดปกติ (MD)</Button>
                  <Button size="lg">ขนาดใหญ่ (LG)</Button>
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-semibold text-[#64748B]">Status Badges</p>
                <div className="flex flex-wrap items-center gap-2.5">
                  <Badge variant="primary" dot>
                    กำลังดำเนินการ
                  </Badge>
                  <Badge variant="success" dot>
                    อนุมัติแล้ว
                  </Badge>
                  <Badge variant="warning" dot>
                    รออนุมัติ
                  </Badge>
                  <Badge variant="danger" dot>
                    เกินกำหนด
                  </Badge>
                  <Badge variant="neutral">ฉบับร่าง</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 4. Form Inputs */}
        <Card>
          <CardHeader>
            <CardTitle>4. Form Components (Input &amp; Select)</CardTitle>
            <CardDescription>
              ตัวอย่างฟอร์มจัดกลุ่มเป็นระเบียบ โปร่งตา รองรับ Helper Text และ Error State
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <Input
                label="ชื่อหลักสูตร (Course Name)"
                placeholder="เช่น Leadership for New Managers"
                required
                helperText="ระบุชื่อหลักสูตรภาษาไทยหรืออังกฤษ"
              />
              <Select
                label="หมวดหมู่หลักสูตร (Category)"
                options={SAMPLE_CATEGORY_OPTIONS.filter((o) => o.value !== "all")}
                defaultValue="Leadership"
                required
              />
              <Input
                label="จำนวนชั่วโมงอบรม"
                type="number"
                defaultValue="0"
                error="กรุณาระบุจำนวนชั่วโมงมากกว่า 0 ชั่วโมง"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* 5. Interactive Table + Search + Filter + Empty State */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>5. Data Table, Search Bar &amp; Filter</CardTitle>
                <CardDescription>
                  ตารางแสดงผลโปร่ง อ่านง่าย ไม่อัดแน่น ลองค้นหาหรือกรองหมวดหมู่เพื่อทดสอบ Empty State
                </CardDescription>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <SearchBar
                  value={search}
                  onChange={setSearch}
                  placeholder="ค้นหารหัส / ชื่อหลักสูตร..."
                  containerClassName="w-full sm:w-72"
                />
                <Select
                  value={category}
                  onChange={setCategory}
                  options={SAMPLE_CATEGORY_OPTIONS}
                  className="w-full sm:w-52"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredRows.length === 0 ? (
              <EmptyState
                icon={<FolderOpen className="h-7 w-7" />}
                title="ไม่พบข้อมูลที่ตรงกับเงื่อนไข"
                description="ลองเปลี่ยนคำค้นหา หรือล้างตัวกรองเพื่อดูรายการทั้งหมดอีกครั้ง"
                action={
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearch("");
                      setCategory("all");
                    }}
                  >
                    ล้างตัวกรองทั้งหมด
                  </Button>
                }
              />
            ) : (
              <TableContainer>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>รหัสหลักสูตร</TableHead>
                      <TableHead>ชื่อหลักสูตร</TableHead>
                      <TableHead>หมวดหมู่</TableHead>
                      <TableHead>กลุ่มเป้าหมาย</TableHead>
                      <TableHead className="text-right">ชั่วโมง</TableHead>
                      <TableHead>สถานะ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-mono text-sm font-semibold text-[#2563EB]">
                          {row.code}
                        </TableCell>
                        <TableCell className="font-medium text-[#1E293B]">
                          {row.courseName}
                        </TableCell>
                        <TableCell className="text-[#64748B]">{row.category}</TableCell>
                        <TableCell className="text-[#64748B]">{row.department}</TableCell>
                        <TableCell className="text-right font-medium">
                          {row.hours} ชม.
                        </TableCell>
                        <TableCell>
                          <Badge variant={row.statusVariant} dot>
                            {row.statusLabel}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
          <CardFooter>
            <span className="text-sm text-[#64748B]">
              แสดง {filteredRows.length} จากทั้งหมด {SAMPLE_TRAINING_ROWS.length} รายการ (Mock Data)
            </span>
            <span className="text-sm text-[#64748B]">
              ขั้นถัดไป: <strong className="text-[#1E293B]">Step 0.2 – Main Layout Shell</strong>
            </span>
          </CardFooter>
        </Card>
      </div>

      {/* Interactive Modal Demo */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="ตัวอย่างหน้าต่าง Modal (เพิ่มหลักสูตร)"
        description="ทดสอบการเปิด/ปิด Modal (กดปุ่มปิด, คลิกพื้นหลัง หรือกด Esc)"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              ยกเลิก
            </Button>
            <Button onClick={handleSaveDemo}>บันทึกตัวอย่าง</Button>
          </>
        }
      >
        <div className="space-y-5">
          <Input
            label="ชื่อหลักสูตร"
            placeholder="ระบุชื่อหลักสูตร..."
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            required
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Select
              label="หมวดหมู่"
              options={SAMPLE_CATEGORY_OPTIONS.filter((o) => o.value !== "all")}
              defaultValue="Leadership"
            />
            <Input
              label="จำนวนชั่วโมง"
              type="number"
              value={courseHours}
              onChange={(e) => setCourseHours(e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
