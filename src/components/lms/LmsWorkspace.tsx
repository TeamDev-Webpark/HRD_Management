"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Download,
  FileArchive,
  HelpCircle,
  Layers,
  MonitorPlay,
  PlayCircle,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, InfoHint, StatCard } from "@/components/ui";
import { INITIAL_ELEARNING_COURSES } from "@/data/mock/elearningCurriculum";
import {
  INITIAL_LEARNING_PROGRESS,
  INITIAL_LMS_CERTIFICATES,
  INITIAL_ONLINE_ASSESSMENTS,
  INITIAL_QUESTION_BANK,
} from "@/data/mock/lmsAssessment";
import {
  INITIAL_LMS_COURSES,
  INITIAL_LMS_LESSONS,
  INITIAL_LMS_MATERIALS,
} from "@/data/mock/lmsCourses";
import { CertificateManagementPanel } from "./CertificateManagementPanel";
import { ElearningClassroomPanel } from "./ElearningClassroomPanel";
import { LearningProgressPanel } from "./LearningProgressPanel";
import { LmsLessonsPanel } from "./LmsLessonsPanel";
import { LmsMaterialsPanel } from "./LmsMaterialsPanel";
import { OnlineAssessmentPanel } from "./OnlineAssessmentPanel";
import { QuestionBankPanel } from "./QuestionBankPanel";

type LmsTabKey =
  | "courses"
  | "lessons"
  | "materials"
  | "questions"
  | "assessments"
  | "progress"
  | "certificates";

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
  {
    key: "questions",
    label: "คลังข้อสอบ",
    labelEn: "Question Bank",
    description: "รวบรวมและจัดการโจทย์คำถามมาตรฐาน แบ่งตามหมวดหมู่ รูปแบบ และระดับความยากสำหรับสุ่มออกข้อสอบ",
  },
  {
    key: "assessments",
    label: "แบบทดสอบออนไลน์",
    labelEn: "Online Assessment",
    description: "กำหนดชุดข้อสอบ จำนวนข้อ เวลาสอบ เกณฑ์คะแนนผ่าน และติดตามอัตราการสอบผ่านแต่ละหลักสูตร",
  },
  {
    key: "progress",
    label: "ความก้าวหน้าการเรียน",
    labelEn: "Learning Progress",
    description: "ติดตามสถานะการเข้าเรียนรายบุคคล บทเรียนที่เรียนจบ คะแนนสอบ และแจ้งเตือนคอร์สที่เกินกำหนด",
  },
  {
    key: "certificates",
    label: "จัดการใบประกาศนียบัตร",
    labelEn: "Certificate Management",
    description: "ตรวจสอบทะเบียนใบรับรองที่ออกให้พนักงาน วันหมดอายุ ดูตัวอย่าง และออกใบรับรองเพิ่มเติม",
  },
];

export function LmsWorkspace() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as LmsTabKey | null;
  const activeMeta = LMS_TABS.find((t) => t.key === tabParam) ?? LMS_TABS[0];
  const activeTab: LmsTabKey = activeMeta.key;

  const [toast, setToast] = useState<string | null>(null);
  const [elearningCourses, setElearningCourses] = useState(INITIAL_ELEARNING_COURSES);
  const [catalogCourses] = useState(INITIAL_LMS_COURSES);
  const [lessons, setLessons] = useState(INITIAL_LMS_LESSONS);
  const [materials, setMaterials] = useState(INITIAL_LMS_MATERIALS);
  const [questions, setQuestions] = useState(INITIAL_QUESTION_BANK);
  const [assessments, setAssessments] = useState(INITIAL_ONLINE_ASSESSMENTS);
  const [progressList] = useState(INITIAL_LEARNING_PROGRESS);
  const [certificates, setCertificates] = useState(INITIAL_LMS_CERTIFICATES);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const renderContextualKpis = () => {
    if (activeTab === "courses") {
      const passedCount = elearningCourses.filter(
        (c) => c.myRecord?.status === "completed" && c.myRecord.passed
      ).length;
      const remainingCount = elearningCourses.length - passedCount;
      const totalHours = elearningCourses.reduce((s, c) => s + c.durationHours, 0);
      const pct = elearningCourses.length
        ? Math.round((passedCount / elearningCourses.length) * 100)
        : 0;
      return (
        <>
          <StatCard
            tone="blue"
            title="หลักสูตรออนไลน์ทั้งหมด"
            tooltip="คอร์ส E-Learning ทั้งหมดที่เปิดให้เข้าเรียนและสอบรับใบรับรอง"
            value={`${elearningCourses.length}`}
            unit="หลักสูตร"
            icon={<MonitorPlay className="h-5 w-5" />}
            footnote={`เวลารวม ${totalHours} ชั่วโมง`}
          />
          <StatCard
            tone="green"
            title="เรียนและสอบผ่านแล้ว"
            tooltip="จำนวนหลักสูตรที่คุณเรียนครบทุกบทและสอบผ่านเกณฑ์ 80% แล้ว"
            value={`${passedCount}/${elearningCourses.length}`}
            unit="หลักสูตร"
            icon={<Award className="h-5 w-5" />}
            progress={{ percent: pct, label: "ความคืบหน้าของฉัน" }}
            footnote={`${pct}%`}
          />
          <StatCard
            tone="yellow"
            title="รอเรียน / รอสอบ"
            tooltip="หลักสูตรออนไลน์ที่ยังไม่ได้เริ่มเรียนหรือยังสอบไม่ผ่านเกณฑ์"
            value={`${remainingCount}`}
            unit="หลักสูตร"
            icon={<Clock className="h-5 w-5" />}
            footnote="เกณฑ์สอบผ่าน ≥ 80% พร้อม E-Certificate"
          />
          <StatCard
            tone="purple"
            title="บทเรียนพร้อมคลิปโต้ตอบ"
            tooltip="จำนวนบทเรียนรวมจากทุกหลักสูตรที่มีจุดถามคำถามระหว่างคลิป"
            value={`${elearningCourses.reduce((s, c) => s + c.curriculum.chapters.length, 0)}`}
            unit="บทเรียน"
            icon={<BookOpen className="h-5 w-5" />}
            footnote="ป้องกันการกอข้ามคลิปอัตโนมัติ"
          />
        </>
      );
    }

    if (activeTab === "lessons") {
      const mandatoryCount = lessons.filter((l) => l.mandatory).length;
      const videoCount = lessons.filter((l) => l.contentType === "Video").length;
      const publishedCount = lessons.filter((l) => l.published).length;
      const totalMins = lessons.reduce((s, l) => s + l.durationMinutes, 0);
      return (
        <>
          <StatCard
            tone="blue"
            title="บทเรียนในระบบทั้งหมด"
            tooltip="จำนวนบทเรียนที่จัดโครงสร้างไว้ในทุกคอร์สออนไลน์"
            value={`${lessons.length}`}
            unit="บทเรียน"
            icon={<Layers className="h-5 w-5" />}
            footnote={`เผยแพร่อยู่ ${publishedCount} บทเรียน`}
          />
          <StatCard
            tone="purple"
            title="บทเรียนวิดีโอบรรยาย"
            tooltip="บทเรียนรูปแบบวิดีโอ On-Demand รองรับการติดตามเวลาเรียนจริง"
            value={`${videoCount}`}
            unit="คลิป"
            icon={<PlayCircle className="h-5 w-5" />}
            footnote={`เวลารวมทุกบท ${totalMins} นาที`}
          />
          <StatCard
            tone="green"
            title="บทเรียนบังคับเรียน"
            tooltip="บทเรียนที่กำหนดเงื่อนไขให้ผู้เรียนต้องเรียนครบก่อนรับใบรับรอง"
            value={`${mandatoryCount}/${lessons.length}`}
            unit="บทเรียน"
            icon={<CheckCircle2 className="h-5 w-5" />}
            footnote="เชื่อมเงื่อนไขออก E-Certificate"
          />
          <StatCard
            tone="yellow"
            title="เวลาเรียนเฉลี่ยต่อบท"
            tooltip="ความยาวเฉลี่ยของแต่ละบทเรียนในระบบ LMS"
            value={`${lessons.length ? Math.round(totalMins / lessons.length) : 0}`}
            unit="นาที / บท"
            icon={<Clock className="h-5 w-5" />}
            footnote="ออกแบบแบบ Micro-learning อ่านง่าย"
          />
        </>
      );
    }

    if (activeTab === "materials") {
      const activeFiles = materials.filter((m) => m.active).length;
      const totalDownloads = materials.reduce((s, m) => s + m.downloads, 0);
      const pdfCount = materials.filter((m) => m.fileType === "PDF" || m.fileType === "PPTX").length;
      const mediaCount = materials.length - pdfCount;
      return (
        <>
          <StatCard
            tone="blue"
            title="สื่อการเรียนรู้ทั้งหมด"
            tooltip="จำนวนไฟล์เอกสาร วิดีโอ สไลด์ และ SCORM ทั้งหมดในคลังสื่อ"
            value={`${materials.length}`}
            unit="ไฟล์"
            icon={<FileArchive className="h-5 w-5" />}
            footnote={`เปิดให้ดาวน์โหลด ${activeFiles} ไฟล์`}
          />
          <StatCard
            tone="green"
            title="ยอดดาวน์โหลดสะสม"
            tooltip="จำนวนครั้งที่พนักงานดาวน์โหลดหรือเปิดใช้งานสื่อประกอบการเรียน"
            value={totalDownloads.toLocaleString()}
            unit="ครั้ง"
            icon={<Download className="h-5 w-5" />}
            footnote="อัปเดตสถิติทันทีเมื่อมีการดาวน์โหลด"
          />
          <StatCard
            tone="yellow"
            title="เอกสาร & สไลด์ (PDF/PPTX)"
            tooltip="คู่มือประกอบการเรียนและสไลด์นำเสนอสำหรับดาวน์โหลด"
            value={`${pdfCount}`}
            unit="ไฟล์"
            icon={<BookOpen className="h-5 w-5" />}
            footnote="พร้อมดาวน์โหลดอ่านออฟไลน์"
          />
          <StatCard
            tone="purple"
            title="วิดีโอ & SCORM Lab"
            tooltip="สื่อมัลติมีเดีย MP4 และชุดสื่อโต้ตอบมาตรฐาน SCORM"
            value={`${mediaCount}`}
            unit="ไฟล์"
            icon={<PlayCircle className="h-5 w-5" />}
            footnote="รองรับการสตรีมและโต้ตอบบนเว็บ"
          />
        </>
      );
    }

    if (activeTab === "questions") {
      const activeQ = questions.filter((q) => q.active).length;
      const scenarioCount = questions.filter((q) => q.type === "Scenario").length;
      const hardCount = questions.filter((q) => q.difficulty === "hard").length;
      return (
        <>
          <StatCard
            tone="blue"
            title="คำถามในคลังทั้งหมด"
            tooltip="จำนวนข้อสอบมาตรฐานที่พร้อมดึงไปสุ่มสร้างแบบทดสอบออนไลน์"
            value={`${questions.length}`}
            unit="ข้อ"
            icon={<HelpCircle className="h-5 w-5" />}
            footnote={`เปิดใช้งาน ${activeQ} ข้อ`}
          />
          <StatCard
            tone="green"
            title="พร้อมสุ่มออกข้อสอบ"
            tooltip="สัดส่วนคำถามที่เปิดใช้งานอยู่ในปัจจุบัน"
            value={`${activeQ}/${questions.length}`}
            unit="ข้อ"
            icon={<CheckCircle2 className="h-5 w-5" />}
            progress={{
              percent: questions.length ? Math.round((activeQ / questions.length) * 100) : 0,
              label: "สถานะเปิดใช้งาน",
            }}
            footnote={`${questions.length ? Math.round((activeQ / questions.length) * 100) : 0}%`}
          />
          <StatCard
            tone="purple"
            title="ข้อสอบกรณีศึกษา (Scenario)"
            tooltip="คำถามเชิงสถานการณ์จริงเพื่อวัดการประยุกต์ใช้ในงาน"
            value={`${scenarioCount}`}
            unit="ข้อ"
            icon={<BookOpen className="h-5 w-5" />}
            footnote="เน้นการวิเคราะห์แก้ปัญหา"
          />
          <StatCard
            tone="yellow"
            title="คำถามระดับยาก"
            tooltip="จำนวนข้อสอบระดับสูงสำหรับหลักสูตรเฉพาะทางและหัวหน้างาน"
            value={`${hardCount}`}
            unit="ข้อ"
            icon={<AlertTriangle className="h-5 w-5" />}
            footnote="ช่วยคัดกรองระดับความเชี่ยวชาญ"
          />
        </>
      );
    }

    if (activeTab === "assessments") {
      const activeExams = assessments.filter((a) => a.active).length;
      const totalAttempts = assessments.reduce((s, a) => s + a.attemptsCount, 0);
      const avgPassRate = assessments.length
        ? Math.round(assessments.reduce((s, a) => s + a.passRate, 0) / assessments.length)
        : 0;
      return (
        <>
          <StatCard
            tone="blue"
            title="ชุดแบบทดสอบทั้งหมด"
            tooltip="จำนวนแบบทดสอบวัดผลออนไลน์ที่สร้างไว้ในระบบ LMS"
            value={`${assessments.length}`}
            unit="ชุด"
            icon={<ClipboardCheck className="h-5 w-5" />}
            footnote={`เปิดให้เข้าสอบ ${activeExams} ชุด`}
          />
          <StatCard
            tone="purple"
            title="จำนวนการเข้าสอบสะสม"
            tooltip="ยอดการทำแบบทดสอบทั้งหมดของพนักงานทุกหลักสูตร"
            value={totalAttempts.toLocaleString()}
            unit="ครั้ง"
            icon={<TrendingUp className="h-5 w-5" />}
            footnote="ตรวจคะแนนอัตโนมัติทันที"
          />
          <StatCard
            tone="green"
            title="อัตราการสอบผ่านเฉลี่ย"
            tooltip="เปอร์เซ็นต์ผู้เข้าสอบที่ผ่านเกณฑ์คะแนนมาตรฐานเฉลี่ยทุกชุด"
            value={`${avgPassRate}%`}
            icon={<CheckCircle2 className="h-5 w-5" />}
            progress={{ percent: avgPassRate, label: "อัตราผ่านเกณฑ์" }}
            footnote={`${avgPassRate}%`}
          />
          <StatCard
            tone="yellow"
            title="เกณฑ์ผ่านมาตรฐาน"
            tooltip="คะแนนขั้นต่ำที่ใช้เป็นมาตรฐานกลางในการออกใบรับรอง"
            value="80%"
            icon={<Award className="h-5 w-5" />}
            footnote="ปรับเกณฑ์แยกแต่ละชุดได้"
          />
        </>
      );
    }

    if (activeTab === "progress") {
      const completed = progressList.filter((p) => p.status === "completed").length;
      const inProgress = progressList.filter((p) => p.status === "in-progress").length;
      const overdue = progressList.filter((p) => p.status === "overdue").length;
      const avgPct = progressList.length
        ? Math.round(progressList.reduce((s, p) => s + p.progressPct, 0) / progressList.length)
        : 0;
      return (
        <>
          <StatCard
            tone="blue"
            title="ความคืบหน้าเฉลี่ยรวม"
            tooltip="เปอร์เซ็นต์การเรียนจบบทเรียนเฉลี่ยของพนักงานทั้งหมดในรายการ"
            value={`${avgPct}%`}
            icon={<TrendingUp className="h-5 w-5" />}
            progress={{ percent: avgPct, label: "ความคืบหน้ารวม" }}
            footnote={`${progressList.length} รายการ`}
          />
          <StatCard
            tone="green"
            title="เรียนจบและสอบผ่าน"
            tooltip="พนักงานที่เรียนครบทุกบทและผ่านแบบทดสอบเรียบร้อยแล้ว"
            value={`${completed}`}
            unit="รายการ"
            icon={<CheckCircle2 className="h-5 w-5" />}
            footnote="บันทึกเข้าประวัติ HRD แล้ว"
          />
          <StatCard
            tone="purple"
            title="กำลังเรียนอยู่"
            tooltip="พนักงานที่อยู่ระหว่างการศึกษาบทเรียนตามกำหนด"
            value={`${inProgress}`}
            unit="รายการ"
            icon={<Clock className="h-5 w-5" />}
            footnote="เข้าเรียนต่อเนื่องตามแผน"
          />
          <StatCard
            tone="yellow"
            title="เกินกำหนดเวลา"
            tooltip="คอร์สบังคับที่เลยกำหนดเรียนครบ ควรส่งแจ้งเตือนติดตาม"
            value={`${overdue}`}
            unit="รายการ"
            icon={<AlertTriangle className="h-5 w-5" />}
            footnote="กดปุ่มเตือนเรียนในตารางได้ทันที"
          />
        </>
      );
    }

    // certificates
    const validCount = certificates.filter((c) => c.status === "valid").length;
    const expiringCount = certificates.filter((c) => c.status === "expiring").length;
    const expiredCount = certificates.filter((c) => c.status === "expired").length;
    return (
      <>
        <StatCard
          tone="blue"
          title="ใบประกาศนียบัตรทั้งหมด"
          tooltip="จำนวนใบประกาศนียบัตรทั้งหมดที่ออกผ่านระบบ LMS"
          value={`${certificates.length}`}
          unit="ใบ"
          icon={<Award className="h-5 w-5" />}
          footnote="พร้อมรหัสตรวจสอบและพิมพ์ PDF"
        />
        <StatCard
          tone="green"
          title="ยังใช้งานได้ (Valid)"
          tooltip="ใบรับรองที่ยังมีผลบังคับใช้ตามอายุที่กำหนด"
          value={`${validCount}`}
          unit="ใบ"
          icon={<CheckCircle2 className="h-5 w-5" />}
          footnote={`คิดเป็น ${certificates.length ? Math.round((validCount / certificates.length) * 100) : 0}%`}
        />
        <StatCard
          tone="yellow"
          title="ใกล้หมดอายุ (≤ 30 วัน)"
          tooltip="ใบรับรองที่ใกล้ครบกำหนดต่ออายุ ควรแจ้งเตือนพนักงานล่วงหน้า"
          value={`${expiringCount}`}
          unit="ใบ"
          icon={<Clock className="h-5 w-5" />}
          footnote="ระบบแจ้งเตือนอัตโนมัติ"
        />
        <StatCard
          tone="purple"
          title="หมดอายุแล้ว"
          tooltip="ใบรับรองที่ครบกำหนดอายุแล้ว ต้องลงทะเบียนสอบทบทวนใหม่"
          value={`${expiredCount}`}
          unit="ใบ"
          icon={<AlertTriangle className="h-5 w-5" />}
          footnote="ส่งลิงก์สอบต่ออายุได้ทันที"
        />
      </>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#1E293B]">{activeMeta.label}</h2>
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

      {/* Row 1: 4 Context-Aware KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {renderContextualKpis()}
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
            {activeTab === "questions" && (
              <QuestionBankPanel items={questions} onChange={setQuestions} onNotify={showToast} />
            )}
            {activeTab === "assessments" && (
              <OnlineAssessmentPanel
                items={assessments}
                onChange={setAssessments}
                onNotify={showToast}
              />
            )}
            {activeTab === "progress" && (
              <LearningProgressPanel items={progressList} onNotify={showToast} />
            )}
            {activeTab === "certificates" && (
              <CertificateManagementPanel
                items={certificates}
                onChange={setCertificates}
                onNotify={showToast}
              />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
