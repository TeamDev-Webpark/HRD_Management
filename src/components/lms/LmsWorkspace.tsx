"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Award,
  CheckCircle2,
  FileArchive,
  Layers,
  MonitorPlay,
} from "lucide-react";
import { Card, CardContent, InfoHint, StatCard } from "@/components/ui";
import { INITIAL_ELEARNING_COURSES } from "@/data/mock/elearningCurriculum";
import {
  INITIAL_LMS_COURSES,
  INITIAL_LMS_LESSONS,
  INITIAL_LMS_MATERIALS,
} from "@/data/mock/lmsCourses";
import { ElearningClassroomPanel } from "./ElearningClassroomPanel";
import { LmsLessonsPanel } from "./LmsLessonsPanel";
import { LmsMaterialsPanel } from "./LmsMaterialsPanel";

type LmsTabKey = "courses" | "lessons" | "materials";

const LMS_TABS: {
  key: LmsTabKey;
  label: string;
  labelEn: string;
  description: string;
}[] = [
  {
    key: "courses",
    label: "ห้องเรียนออนไลน์ (E-Learning)",
    labelEn: "Online Classroom",
    description:
      "เรียนผ่านวิดีโอแบบโต้ตอบพร้อมจุดถามคำถามระหว่างคลิป สอบวัดผลปลายภาค และรับใบรับรอง E-Certificate ทันที",
  },
  {
    key: "lessons",
    label: "จัดการบทเรียน",
    labelEn: "Lesson Management",
    description: "วางโครงสร้างลำดับบทเรียน วิดีโอบรรยาย เอกสาร เวิร์กช็อป และแบบทดสอบประจำคอร์ส",
  },
  {
    key: "materials",
    label: "สื่อการเรียนรู้",
    labelEn: "Learning Materials",
    description: "คลังไฟล์ประกอบการเรียน PDF, วิดีโอ MP4, สไลด์ และชุดสื่อโต้ตอบ SCORM",
  },
];

export function LmsWorkspace() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as LmsTabKey | null;
  const activeMeta = LMS_TABS.find((t) => t.key === tabParam) ?? LMS_TABS[0];
  const activeTab: LmsTabKey = activeMeta.key;

  const [toast, setToast] = useState<string | null>(null);
  const [elearningCourses, setElearningCourses] = useState(INITIAL_ELEARNING_COURSES);
  const [catalogCourses] = useState(INITIAL_LMS_COURSES);
  const [lessons, setLessons] = useState(INITIAL_LMS_LESSONS);
  const [materials, setMaterials] = useState(INITIAL_LMS_MATERIALS);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const goToTab = (tab: LmsTabKey) => {
    router.push(`/lms?tab=${tab}`);
  };

  const passedCount = elearningCourses.filter(
    (c) => c.myRecord?.status === "completed" && c.myRecord.passed
  ).length;
  const remainingCount = elearningCourses.length - passedCount;
  const totalDownloads = materials.reduce((s, m) => s + m.downloads, 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#1E293B]">{activeMeta.label}</h2>
            <span className="rounded-md bg-[#EFF6FF] px-2 py-0.5 text-[11px] font-medium text-[#2563EB]">
              {activeMeta.labelEn}
            </span>
            <InfoHint title={activeMeta.labelEn} content={activeMeta.description} />
          </div>
          <p className="text-xs text-[#94A3B8]">{activeMeta.description}</p>
        </div>

        {toast && (
          <div className="inline-flex items-center gap-2 rounded-xl bg-[#ECFAF5] px-3.5 py-2 text-xs font-medium text-[#1CA388] ring-1 ring-emerald-200/80">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {toast}
          </div>
        )}
      </div>

      {/* Row 1: 4 Clean White Clickable KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          tone="blue"
          title="หลักสูตรออนไลน์ทั้งหมด"
          tooltip="คอร์ส E-Learning ที่พร้อมเข้าเรียนและสอบรับใบรับรอง (คลิกเพื่อเปิดห้องเรียนออนไลน์)"
          value={`${elearningCourses.length}`}
          unit="หลักสูตร"
          icon={<MonitorPlay className="h-5 w-5" />}
          footnote={`รอเรียน / รอสอบ ${remainingCount} หลักสูตร`}
          active={activeTab === "courses"}
          onClick={() => goToTab("courses")}
        />
        <StatCard
          tone="green"
          title="เรียนและสอบผ่านแล้ว"
          tooltip="จำนวนหลักสูตรที่เรียนครบทุกบท สอบผ่านเกณฑ์ 80% และได้รับใบรับรอง E-Certificate แล้ว"
          value={`${passedCount}/${elearningCourses.length}`}
          unit="หลักสูตร"
          icon={<Award className="h-5 w-5" />}
          progress={{
            percent: elearningCourses.length
              ? Math.round((passedCount / elearningCourses.length) * 100)
              : 0,
            label: "ความคืบหน้าของฉัน",
          }}
          footnote={`${elearningCourses.length ? Math.round((passedCount / elearningCourses.length) * 100) : 0}%`}
          onClick={() => goToTab("courses")}
        />
        <StatCard
          tone="purple"
          title="บทเรียนในระบบ"
          tooltip="จำนวนบทเรียนที่จัดโครงสร้างไว้ทั้งหมด (คลิกเพื่อจัดการบทเรียน)"
          value={`${lessons.length}`}
          unit="บทเรียน"
          icon={<Layers className="h-5 w-5" />}
          footnote={`บังคับเรียน ${lessons.filter((l) => l.mandatory).length} บทเรียน`}
          active={activeTab === "lessons"}
          onClick={() => goToTab("lessons")}
        />
        <StatCard
          tone="yellow"
          title="คลังสื่อการเรียนรู้"
          tooltip={`เอกสาร วิดีโอ สไลด์ และ SCORM ทั้งหมด ${materials.length} ไฟล์ (คลิกเพื่อเปิดคลังสื่อ)`}
          value={`${materials.length}`}
          unit="ไฟล์"
          icon={<FileArchive className="h-5 w-5" />}
          footnote={`ดาวน์โหลดรวม ${totalDownloads.toLocaleString()} ครั้ง`}
          active={activeTab === "materials"}
          onClick={() => goToTab("materials")}
        />
      </div>

      {/* Row 2: Active Content */}
      {activeTab === "courses" ? (
        <ElearningClassroomPanel
          courses={elearningCourses}
          onChange={setElearningCourses}
          onNotify={showToast}
        />
      ) : (
        <Card className="overflow-hidden">
          <CardContent className="p-5 sm:p-6">
            {activeTab === "lessons" && (
              <LmsLessonsPanel
                lessons={lessons}
                courses={catalogCourses}
                onChange={setLessons}
                onNotify={showToast}
              />
            )}
            {activeTab === "materials" && (
              <LmsMaterialsPanel
                items={materials}
                courses={catalogCourses}
                onChange={setMaterials}
                onNotify={showToast}
              />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
