"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  Clock,
  FileCheck2,
  FolderOpen,
  LayoutGrid,
  List,
  Lock,
  PlayCircle,
  Printer,
  RotateCcw,
  Settings,
  ShieldCheck,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  EmptyState,
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
import { useLayout } from "@/context/LayoutContext";
import type {
  CourseCurriculum,
  ElearningCourseCardItem,
  LessonChapter,
} from "@/data/mock/elearningCurriculum";
import { ElearningEditorModal } from "./ElearningEditorModal";
import { LessonVideoPlayer, type ChapterQuizCompletionResult } from "./LessonVideoPlayer";

type Stage = { type: "chapter"; index: number } | { type: "exam" } | { type: "certificate" };

interface ElearningClassroomPanelProps {
  courses: ElearningCourseCardItem[];
  onChange: (courses: ElearningCourseCardItem[]) => void;
  onNotify: (message: string) => void;
}

export function ElearningClassroomPanel({
  courses,
  onChange,
  onNotify,
}: ElearningClassroomPanelProps) {
  const { currentUser, role } = useLayout();
  const canManage = role === "admin" || role === "manager";

  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [editingCourse, setEditingCourse] = useState<ElearningCourseCardItem | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "not-started" | "passed">("all");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [stage, setStage] = useState<Stage>({ type: "chapter", index: 0 });
  const [completedChapters, setCompletedChapters] = useState<Set<string>>(new Set());
  const [checkedTakeaway, setCheckedTakeaway] = useState<Record<string, boolean>>({});
  const [chapterQuizResults, setChapterQuizResults] = useState<
    Record<string, ChapterQuizCompletionResult>
  >({});
  const [retakeCounter, setRetakeCounter] = useState<Record<string, number>>({});
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [examResult, setExamResult] = useState<{ score: number; passed: boolean } | null>(null);

  const categoryOptions = useMemo(() => {
    const cats = Array.from(new Set(courses.map((c) => c.category)));
    return [
      { value: "all", label: "ทุกหมวดหมู่" },
      ...cats.map((cat) => ({ value: cat, label: cat })),
    ];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    const q = search.trim().toLowerCase();
    return courses.filter((c) => {
      const isPassed = Boolean(c.myRecord?.status === "completed" && c.myRecord.passed);
      const matchCat = categoryFilter === "all" || c.category === categoryFilter;
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "passed" && isPassed) ||
        (statusFilter === "not-started" && !isPassed);
      const matchQuery =
        !q ||
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.curriculum.instructor.toLowerCase().includes(q);
      return matchCat && matchStatus && matchQuery;
    });
  }, [courses, search, categoryFilter, statusFilter]);

  const activeCourse = courses.find((c) => c.id === activeCourseId) ?? null;

  const handleCurriculumSaved = (updated: CourseCurriculum) => {
    if (!editingCourse) return;
    onChange(
      courses.map((c) => (c.id === editingCourse.id ? { ...c, curriculum: updated } : c))
    );
    onNotify(`บันทึกโครงสร้างบทเรียนและข้อสอบ "${editingCourse.name}" เรียบร้อยแล้ว`);
  };

  const enterClassroom = (course: ElearningCourseCardItem, mode: "learn" | "certificate" = "learn") => {
    const alreadyPassed = course.myRecord?.status === "completed" && course.myRecord.passed;
    setActiveCourseId(course.id);
    if (mode === "certificate" && alreadyPassed) {
      setCompletedChapters(new Set(course.curriculum.chapters.map((ch) => ch.id)));
      setCheckedTakeaway(Object.fromEntries(course.curriculum.chapters.map((ch) => [ch.id, true])));
      setExamResult({ score: course.myRecord?.score ?? 100, passed: true });
      setStage({ type: "certificate" });
    } else {
      setCompletedChapters(new Set());
      setCheckedTakeaway({});
      setChapterQuizResults({});
      setRetakeCounter({});
      setExamResult(null);
      setStage({ type: "chapter", index: 0 });
    }
    setAnswers({});
  };

  /* ==================== CLASSROOM MODE ==================== */
  if (activeCourse) {
    const curriculum = activeCourse.curriculum;
    const totalChapters = curriculum.chapters.length;
    const doneChapters = curriculum.chapters.filter((ch) => completedChapters.has(ch.id)).length;
    const allChaptersDone = doneChapters === totalChapters;
    const progressPct = Math.round(
      ((doneChapters + (examResult?.passed ? 1 : 0)) / (totalChapters + 1)) * 100
    );

    const checkpointSummary = (() => {
      let totalCp = 0;
      let correctCp = 0;
      const breakdown = curriculum.chapters.map((ch) => {
        const res = chapterQuizResults[ch.id];
        const chTotal = ch.videoCheckpoints?.length ? ch.videoCheckpoints.length : 1;
        totalCp += chTotal;
        const chCorrect = res ? res.correctCount : 0;
        correctCp += chCorrect;
        return {
          chapterId: ch.id,
          total: chTotal,
          correct: chCorrect,
          passed: res ? res.correctCount === chTotal : false,
        };
      });
      const scorePct = totalCp > 0 ? Math.round((correctCp / totalCp) * 100) : 100;
      return {
        totalCp,
        correctCp,
        scorePct,
        isPassed: totalCp === 0 || scorePct >= 80,
        breakdown,
      };
    })();

    const handleRetakeCourse = () => {
      setCompletedChapters(new Set());
      setChapterQuizResults({});
      setCheckedTakeaway({});
      setRetakeCounter((prev) => {
        const next = { ...prev };
        curriculum.chapters.forEach((ch) => {
          next[ch.id] = (next[ch.id] || 0) + 1;
        });
        return next;
      });
      setAnswers({});
      setExamResult(null);
      setStage({ type: "chapter", index: 0 });
      onNotify("รีเซ็ตบทเรียนและคำถามทั้งหมดแล้ว เริ่มเรียนใหม่ตั้งแต่บทที่ 1");
    };

    const markChapterComplete = (chapter: LessonChapter, idx: number) => {
      if (!checkedTakeaway[chapter.id]) {
        onNotify("กรุณาติ๊กยืนยันความเข้าใจท้ายบทเรียนก่อนไปบทถัดไป");
        return;
      }
      const nextSet = new Set(completedChapters);
      nextSet.add(chapter.id);
      setCompletedChapters(nextSet);

      if (idx + 1 < totalChapters) {
        setStage({ type: "chapter", index: idx + 1 });
      } else {
        setStage({ type: "exam" });
      }
    };

    const handleSubmitExam = () => {
      if (!checkpointSummary.isPassed) {
        onNotify("คะแนนคำถามระหว่างคลิปไม่ถึง 80% กรุณากดเริ่มเรียนใหม่และสอบแก้ตัว");
        return;
      }
      if (Object.keys(answers).length < curriculum.questions.length) {
        onNotify(`กรุณาตอบคำถามให้ครบทั้ง ${curriculum.questions.length} ข้อก่อนส่ง`);
        return;
      }
      let correct = 0;
      curriculum.questions.forEach((q, idx) => {
        if (answers[idx] === q.answerIndex) correct++;
      });
      const score = Math.round((correct / curriculum.questions.length) * 100);
      const passed = score >= 80;
      setExamResult({ score, passed });

      onChange(
        courses.map((c) =>
          c.id === activeCourse.id
            ? {
                ...c,
                myRecord: {
                  status: "completed",
                  completedDate: "วันนี้",
                  expiryDate: "1 ปีถัดไป",
                  score,
                  passed,
                },
              }
            : c
        )
      );

      onNotify(
        passed
          ? `สอบผ่านด้วยคะแนน ${score}/100! ปลดล็อกใบรับรอง E-Certificate แล้ว`
          : `ได้คะแนน ${score}/100 (เกณฑ์ผ่าน 80%) กรุณาทบทวนและสอบใหม่`
      );
    };

    return (
      <div className="space-y-4">
        {/* Top Classroom Bar */}
        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[#EEF2F6] bg-white p-4 sm:flex-row sm:items-center sm:p-5 hrd-card-shadow">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveCourseId(null)}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1 text-xs font-semibold text-[#334155] transition-colors hover:border-[#BFDBFE] hover:bg-[#EFF6FF] hover:text-[#2563EB]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                ออกจากห้องเรียน
              </button>
              <span className="rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                {activeCourse.code}
              </span>
              <Badge variant="primary">{activeCourse.standardLabel}</Badge>
              {examResult?.passed && (
                <Badge variant="success" dot>
                  สอบผ่านแล้ว ({examResult.score}%)
                </Badge>
              )}
              {canManage && (
                <button
                  type="button"
                  onClick={() => setEditingCourse(activeCourse)}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] px-2.5 py-1 text-xs font-semibold text-[#2563EB] transition-colors hover:bg-[#2563EB] hover:text-white"
                >
                  <Settings className="h-3.5 w-3.5" />
                  จัดการบทเรียน & ข้อสอบ
                </button>
              )}
            </div>
            <h3 className="text-base font-bold text-[#1E293B] sm:text-lg">{activeCourse.name}</h3>
            <p className="text-xs text-[#64748B]">
              ผู้สอน: <strong className="text-[#1E293B]">{curriculum.instructor}</strong> • ผู้เรียน:{" "}
              <strong className="text-[#1E293B]">{currentUser.name}</strong> ({currentUser.position})
            </p>
          </div>

          <div className="w-full space-y-1.5 sm:w-56">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[#64748B]">ความคืบหน้าการเรียน</span>
              <span className="font-bold tabular-nums text-[#2563EB]">{progressPct}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#EEF2F6]">
              <div
                className="h-full rounded-full bg-[#22B89A] transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-[11px] text-[#94A3B8]">
              เรียนจบ {doneChapters}/{totalChapters} บทเรียน{" "}
              {examResult?.passed ? "• สอบผ่านแล้ว" : "• รอสอบปลายภาค"}
            </p>
          </div>
        </div>

        {/* Split Classroom Layout */}
        <div className="grid items-start gap-4 lg:grid-cols-12">
          {/* Left: Sequential Curriculum Outline */}
          <Card className="space-y-4 p-4 sm:p-5 lg:col-span-4">
            <div className="space-y-2 border-b border-[#F1F5F9] pb-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-[#1E293B]">โครงสร้างหลักสูตร</h4>
                <span className="rounded-full bg-[#F4F6FA] px-2.5 py-0.5 text-[11px] font-semibold text-[#64748B]">
                  {doneChapters}/{totalChapters} บทเรียน
                </span>
              </div>
              <p className="rounded-xl bg-[#F8FAFC] px-3 py-2 text-[11px] leading-relaxed text-[#64748B]">
                เรียนตามลำดับทีละบท ตอบคำถามระหว่างคลิป และติ๊กยืนยันความเข้าใจท้ายบทเพื่อปลดล็อกบทถัดไป
              </p>
            </div>

            <div className="space-y-1.5">
              {curriculum.chapters.map((ch, idx) => {
                const isDone = completedChapters.has(ch.id);
                const isUnlocked = idx === 0 || completedChapters.has(curriculum.chapters[idx - 1].id);
                const isCurrent = stage.type === "chapter" && stage.index === idx;
                const cleanTitle = ch.title.replace(/^บทที่\s*\d+\s*:\s*/, "");

                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => {
                      if (!isUnlocked) {
                        onNotify(`กรุณาเรียนและกดบันทึกจบบทที่ ${idx} ก่อนปลดล็อกบทที่ ${idx + 1}`);
                        return;
                      }
                      setStage({ type: "chapter", index: idx });
                    }}
                    className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                      !isUnlocked
                        ? "cursor-not-allowed bg-[#F8FAFC] opacity-60"
                        : isCurrent
                          ? "cursor-pointer bg-[#EFF6FF] text-[#2563EB]"
                          : "cursor-pointer hover:bg-[#F8FAFC]"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        isDone
                          ? "bg-[#22B89A] text-white"
                          : isCurrent
                            ? "bg-[#2563EB] text-white"
                            : "border border-[#E2E8F0] bg-white text-[#94A3B8]"
                      }`}
                    >
                      {isDone ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : !isUnlocked ? (
                        <Lock className="h-3 w-3" />
                      ) : (
                        idx + 1
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-xs font-semibold leading-snug ${
                          isCurrent ? "text-[#2563EB]" : "text-[#1E293B]"
                        }`}
                      >
                        {cleanTitle}
                      </p>
                      <p className="mt-0.5 text-[11px] text-[#94A3B8]">
                        {!isUnlocked
                          ? `ล็อกอยู่ — จบบทที่ ${idx} เพื่อปลดล็อก`
                          : isDone
                            ? `เรียนจบแล้ว • ${ch.durationMin} นาที`
                            : `${ch.clauseRef} • ${ch.durationMin} นาที`}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Exam & Certificate Steps */}
            <div className="space-y-1.5 border-t border-[#F1F5F9] pt-3">
              <button
                type="button"
                onClick={() => {
                  if (!allChaptersDone) {
                    onNotify(`กรุณาเรียนให้ครบทั้ง ${totalChapters} บทก่อนเข้าสู่ห้องสอบปลายภาค`);
                    return;
                  }
                  setStage({ type: "exam" });
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                  !allChaptersDone
                    ? "cursor-not-allowed bg-[#F8FAFC] opacity-60"
                    : stage.type === "exam"
                      ? "cursor-pointer bg-[#EFF6FF] text-[#2563EB]"
                      : "cursor-pointer hover:bg-[#F8FAFC]"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    examResult?.passed
                      ? "bg-[#22B89A] text-white"
                      : stage.type === "exam"
                        ? "bg-[#2563EB] text-white"
                        : "border border-[#E2E8F0] bg-white text-[#94A3B8]"
                  }`}
                >
                  {examResult?.passed ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : !allChaptersDone ? (
                    <Lock className="h-3 w-3" />
                  ) : (
                    <FileCheck2 className="h-3.5 w-3.5" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-[#1E293B]">แบบทดสอบวัดผลปลายภาค</p>
                  <p className="text-[11px] text-[#94A3B8]">
                    {examResult?.passed
                      ? `สอบผ่านแล้ว (${examResult.score}%)`
                      : `${curriculum.questions.length} ข้อ • เกณฑ์ผ่าน 80%`}
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!examResult?.passed) {
                    onNotify("ต้องสอบปลายภาคผ่านเกณฑ์ 80% ขึ้นไปก่อนจึงจะเปิดใบรับรองได้");
                    return;
                  }
                  setStage({ type: "certificate" });
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                  !examResult?.passed
                    ? "cursor-not-allowed bg-[#F8FAFC] opacity-60"
                    : stage.type === "certificate"
                      ? "cursor-pointer bg-[#ECFAF5] text-[#1CA388]"
                      : "cursor-pointer hover:bg-[#F8FAFC]"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    examResult?.passed
                      ? "bg-[#22B89A] text-white"
                      : "border border-[#E2E8F0] bg-white text-[#94A3B8]"
                  }`}
                >
                  {examResult?.passed ? <Award className="h-3.5 w-3.5" /> : <Lock className="h-3 w-3" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-[#1E293B]">ใบรับรองการอบรม (E-Certificate)</p>
                  <p className="text-[11px] text-[#94A3B8]">
                    {examResult?.passed ? "คลิกเพื่อดูและพิมพ์ใบรับรอง" : "ปลดล็อกเมื่อสอบผ่าน ≥ 80%"}
                  </p>
                </div>
              </button>
            </div>
          </Card>

          {/* Right: Active Stage */}
          <Card className="space-y-5 p-5 sm:p-6 lg:col-span-8">
            {stage.type === "chapter" &&
              (() => {
                const chapter = curriculum.chapters[stage.index];
                const isChecked = Boolean(checkedTakeaway[chapter.id]);
                return (
                  <div className="space-y-5">
                    <div className="space-y-1.5 rounded-xl border border-[#DBEAFE] bg-[#EFF6FF]/60 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <Badge variant="primary">{chapter.clauseRef}</Badge>
                        <span className="font-medium text-[#64748B]">
                          บทที่ {stage.index + 1} จาก {totalChapters} • {chapter.durationMin} นาที
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-[#1E293B]">{chapter.title}</h4>
                    </div>

                    <LessonVideoPlayer
                      key={`${chapter.id}-${retakeCounter[chapter.id] || 0}`}
                      courseCode={activeCourse.code}
                      instructor={curriculum.instructor}
                      chapter={chapter}
                      chapterIndex={stage.index}
                      totalChapters={totalChapters}
                      onVideoCompleted={(result) => {
                        if (result) {
                          setChapterQuizResults((prev) => ({ ...prev, [chapter.id]: result }));
                        }
                        setCheckedTakeaway((prev) => ({ ...prev, [chapter.id]: true }));
                      }}
                    />

                    {/* Objectives & Case Study */}
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1.5 rounded-xl border border-[#EEF2F6] bg-[#F8FAFC] p-4">
                        <p className="text-xs font-bold text-[#2563EB]">วัตถุประสงค์ของบทเรียนนี้</p>
                        <ul className="list-disc space-y-1 pl-4 text-xs text-[#334155]">
                          {chapter.objectives.map((obj, i) => (
                            <li key={i}>{obj}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-1.5 rounded-xl border border-[#EEF2F6] bg-[#F8FAFC] p-4">
                        <p className="text-xs font-bold text-[#2563EB]">กรณีศึกษาจากหน้างานจริง</p>
                        <p className="text-xs text-[#334155]">{chapter.caseStudy.scenario}</p>
                        <p className="text-xs font-semibold text-[#1CA388]">
                          ✓ แนวทางที่ถูก: {chapter.caseStudy.goodPractice}
                        </p>
                      </div>
                    </div>

                    {/* Takeaway Checkbox */}
                    <label
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors ${
                        isChecked
                          ? "border-[#22B89A]/50 bg-[#ECFAF5]/60"
                          : "border-[#F5B73B]/60 bg-[#FEF9EC]/70"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) =>
                          setCheckedTakeaway((prev) => ({ ...prev, [chapter.id]: e.target.checked }))
                        }
                        className="mt-0.5 h-4 w-4 accent-[#2563EB]"
                      />
                      <div className="space-y-0.5">
                        <span className="block text-xs font-bold text-[#1E293B] sm:text-sm">
                          {chapter.takeaway}
                        </span>
                        <span className="block text-xs text-[#64748B]">
                          {isChecked
                            ? "ยืนยันความเข้าใจแล้ว สามารถกดปุ่มด้านล่างเพื่อไปบทถัดไปได้"
                            : "ดูวิดีโอให้จบหรือติ๊กช่องนี้เพื่อปลดล็อกปุ่มไปบทถัดไป"}
                        </span>
                      </div>
                    </label>

                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#F1F5F9] pt-4">
                      {stage.index > 0 ? (
                        <Button
                          variant="outline"
                          onClick={() => setStage({ type: "chapter", index: stage.index - 1 })}
                        >
                          ← บทก่อนหน้า
                        </Button>
                      ) : (
                        <div />
                      )}
                      <Button
                        variant={isChecked ? "primary" : "outline"}
                        onClick={() => markChapterComplete(chapter, stage.index)}
                        rightIcon={<ArrowRight className="h-4 w-4" />}
                      >
                        {stage.index + 1 < totalChapters
                          ? "บันทึกเรียนจบบทนี้ & ไปบทถัดไป"
                          : "บันทึกจบบทสุดท้าย & เข้าสู่ห้องสอบ"}
                      </Button>
                    </div>
                  </div>
                );
              })()}

            {stage.type === "exam" && (
              <div className="space-y-5">
                {/* Checkpoint Summary Card */}
                <div
                  className={`space-y-3 rounded-2xl border p-4 ${
                    checkpointSummary.isPassed
                      ? "border-[#22B89A]/40 bg-[#ECFAF5]/50"
                      : "border-red-200 bg-red-50/70"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-[#1E293B]">
                        {checkpointSummary.isPassed
                          ? "ผลการตอบคำถามระหว่างคลิป: ผ่านเกณฑ์เรียบร้อย"
                          : "ผลการตอบคำถามระหว่างคลิป: ไม่ผ่านเกณฑ์ (ต่ำกว่า 80%)"}
                      </h4>
                      <p className="text-xs text-[#64748B]">
                        ตอบถูก {checkpointSummary.correctCp} จาก {checkpointSummary.totalCp} ข้อ (
                        {checkpointSummary.scorePct}%)
                      </p>
                    </div>
                    <Badge variant={checkpointSummary.isPassed ? "success" : "danger"} dot>
                      {checkpointSummary.isPassed ? "ผ่านเกณฑ์คำถามในคลิป" : "ต้องสอบแก้ตัว"}
                    </Badge>
                  </div>

                  {!checkpointSummary.isPassed && (
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-red-200/70 pt-3">
                      <div className="flex flex-wrap gap-1.5">
                        {checkpointSummary.breakdown.map((b, i) => (
                          <Badge key={b.chapterId} variant={b.passed ? "success" : "danger"}>
                            บทที่ {i + 1}: {b.correct}/{b.total}
                          </Badge>
                        ))}
                      </div>
                      <Button
                        size="sm"
                        variant="danger"
                        leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
                        onClick={handleRetakeCourse}
                      >
                        เริ่มเรียนใหม่และสอบแก้ตัวทุกบทเรียน
                      </Button>
                    </div>
                  )}
                </div>

                {/* Final Exam Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F1F5F9] pb-3">
                  <div>
                    <h4 className="text-base font-bold text-[#1E293B]">
                      แบบทดสอบประเมินผลปลายภาค
                    </h4>
                    <p className="text-xs text-[#64748B]">
                      ตอบแล้ว {Object.keys(answers).length}/{curriculum.questions.length} ข้อ • เกณฑ์ผ่าน 80%
                    </p>
                  </div>
                  {examResult && (
                    <Badge variant={examResult.passed ? "success" : "danger"} dot>
                      คะแนน {examResult.score}/100 ({examResult.passed ? "สอบผ่าน" : "ไม่ผ่านเกณฑ์"})
                    </Badge>
                  )}
                </div>

                {examResult?.passed && (
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#22B89A]/40 bg-[#ECFAF5] p-4">
                    <div className="text-xs sm:text-sm">
                      <p className="font-bold text-[#1E293B]">
                        ยินดีด้วย! คุณสอบผ่านด้วยคะแนน {examResult.score}/100 คะแนน
                      </p>
                      <p className="text-xs text-[#64748B]">
                        สามารถเปิดดูและพิมพ์ใบรับรองการผ่านการอบรมออนไลน์ได้ทันที
                      </p>
                    </div>
                    <Button
                      size="sm"
                      leftIcon={<Award className="h-4 w-4" />}
                      onClick={() => setStage({ type: "certificate" })}
                    >
                      ดูใบรับรอง (E-Certificate)
                    </Button>
                  </div>
                )}

                <div className="space-y-3.5">
                  {curriculum.questions.map((q, qIdx) => {
                    const selected = answers[qIdx];
                    const showFeedback = examResult !== null;
                    return (
                      <div
                        key={qIdx}
                        className="space-y-2.5 rounded-xl border border-[#EEF2F6] bg-[#F8FAFC] p-4"
                      >
                        <p className="text-xs font-bold text-[#1E293B] sm:text-sm">{q.question}</p>
                        <div className="space-y-2">
                          {q.choices.map((choice, cIdx) => {
                            const isSelected = selected === cIdx;
                            const isCorrect = q.answerIndex === cIdx;
                            return (
                              <label
                                key={cIdx}
                                className={`flex cursor-pointer items-start gap-2.5 rounded-xl border px-3.5 py-2.5 text-xs transition-colors sm:text-sm ${
                                  showFeedback && isCorrect
                                    ? "border-[#22B89A] bg-[#ECFAF5] font-semibold text-[#1E293B]"
                                    : showFeedback && isSelected && !isCorrect
                                      ? "border-red-300 bg-red-50 text-[#DC2626]"
                                      : isSelected
                                        ? "border-[#2563EB] bg-[#EFF6FF] font-semibold text-[#2563EB]"
                                        : "border-[#E2E8F0] bg-white text-[#334155] hover:bg-[#F8FAFC]"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`exam-q-${qIdx}`}
                                  checked={isSelected}
                                  onChange={() => setAnswers((prev) => ({ ...prev, [qIdx]: cIdx }))}
                                  className="mt-0.5 accent-[#2563EB]"
                                />
                                <span>{choice}</span>
                              </label>
                            );
                          })}
                        </div>
                        {showFeedback && (
                          <p className="rounded-lg border border-[#EEF2F6] bg-white px-3 py-2 text-xs text-[#64748B]">
                            <strong className="text-[#2563EB]">คำอธิบาย:</strong> {q.explanation}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#F1F5F9] pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setStage({ type: "chapter", index: totalChapters - 1 })}
                  >
                    ← กลับไปทบทวนบทเรียน
                  </Button>
                  <Button
                    disabled={!checkpointSummary.isPassed}
                    onClick={handleSubmitExam}
                    leftIcon={<CheckCircle2 className="h-4 w-4" />}
                  >
                    ส่งกระดาษคำตอบ & บันทึกผล
                  </Button>
                </div>
              </div>
            )}

            {stage.type === "certificate" && examResult?.passed && (
              <div className="space-y-5">
                <div className="space-y-4 rounded-2xl border-2 border-[#BFDBFE] bg-gradient-to-b from-[#EFF6FF]/60 via-white to-[#F8FAFC] p-6 text-center sm:p-8">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2563EB] text-white shadow-sm">
                    <Award className="h-6 w-6" />
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[#2563EB]">
                    Certificate of Completion • HRD LMS
                  </p>
                  <h3 className="text-xl font-extrabold text-[#1E293B] sm:text-2xl">
                    ใบรับรองการผ่านการฝึกอบรมออนไลน์
                  </h3>
                  <p className="text-xs text-[#64748B]">ขอมอบใบรับรองฉบับนี้เพื่อแสดงว่า</p>

                  <div className="py-1">
                    <p className="text-lg font-extrabold text-[#2563EB] sm:text-xl">
                      {currentUser.name}
                    </p>
                    <p className="text-xs text-[#64748B]">
                      ตำแหน่ง: {currentUser.position} • {currentUser.department}
                    </p>
                  </div>

                  <p className="text-xs text-[#334155]">
                    ได้ผ่านการศึกษาบทเรียนและสอบผ่านเกณฑ์มาตรฐานในหลักสูตร
                  </p>
                  <div className="inline-block rounded-xl border border-[#DBEAFE] bg-white px-5 py-3 shadow-2xs">
                    <p className="text-base font-bold text-[#1E293B]">{activeCourse.name}</p>
                    <p className="mt-0.5 text-xs text-[#64748B]">
                      รหัส: {activeCourse.code} • หมวด: {activeCourse.standardLabel} • คะแนนสอบ:{" "}
                      <strong className="text-[#1CA388]">{examResult.score}/100</strong>
                    </p>
                  </div>

                  <div className="mx-auto grid max-w-lg grid-cols-3 gap-3 border-t border-[#EEF2F6] pt-4 text-xs text-[#64748B]">
                    <div>
                      <p>ระยะเวลา</p>
                      <strong className="text-[#1E293B]">{activeCourse.durationHours} ชั่วโมง</strong>
                    </div>
                    <div>
                      <p>อายุใบรับรอง</p>
                      <strong className="text-[#1E293B]">{activeCourse.validityMonths} เดือน</strong>
                    </div>
                    <div>
                      <p>วิทยากรผู้รับรอง</p>
                      <strong className="text-[#1E293B]">{curriculum.instructor.split("(")[0]}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Button variant="outline" onClick={() => setActiveCourseId(null)}>
                    ← กลับหน้ารวมคอร์สออนไลน์
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      leftIcon={<Printer className="h-4 w-4" />}
                      onClick={() => window.print()}
                    >
                      พิมพ์ / บันทึก PDF
                    </Button>
                    <Link
                      href="/training?tab=results"
                      className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#1D4ED8]"
                    >
                      ดูประวัติการอบรม
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {editingCourse && (
          <ElearningEditorModal
            open={Boolean(editingCourse)}
            courseName={editingCourse.name}
            initialCurriculum={editingCourse.curriculum}
            onClose={() => setEditingCourse(null)}
            onSaved={handleCurriculumSaved}
          />
        )}
      </div>
    );
  }

  /* ==================== COURSE CATALOG MODE (CLEAN CARD & TABLE) ==================== */
  return (
    <Card className="overflow-hidden">
      <div className="space-y-4 p-5 sm:p-6">
        {/* Clean Toolbar: Search + Category + Status Pills + View Mode */}
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="ค้นหาชื่อคอร์ส รหัส หรือวิทยากร..."
              containerClassName="w-full sm:w-64"
            />
            <Select
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={categoryOptions}
              className="w-full sm:w-44"
            />
            <div className="inline-flex self-start rounded-xl bg-[#F4F6FA] p-1 text-xs sm:self-auto">
              {(
                [
                  { key: "all", label: `ทั้งหมด (${courses.length})` },
                  {
                    key: "not-started",
                    label: `รอเรียน (${courses.filter((c) => !(c.myRecord?.status === "completed" && c.myRecord.passed)).length})`,
                  },
                  {
                    key: "passed",
                    label: `ผ่านแล้ว (${courses.filter((c) => c.myRecord?.status === "completed" && c.myRecord.passed).length})`,
                  },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setStatusFilter(opt.key)}
                  className={`cursor-pointer rounded-lg px-2.5 py-1.5 font-medium transition-all ${
                    statusFilter === opt.key
                      ? "bg-white text-[#1E293B] shadow-2xs"
                      : "text-[#64748B] hover:text-[#1E293B]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="inline-flex self-start rounded-xl bg-[#F4F6FA] p-1 xl:self-auto">
            <Tooltip content="มุมมองการ์ด (เหมาะสำหรับเลือกเรียน)">
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-all ${
                  viewMode === "cards"
                    ? "bg-white text-[#2563EB] shadow-2xs"
                    : "text-[#94A3B8] hover:text-[#1E293B]"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </Tooltip>
            <Tooltip content="มุมมองตาราง (เหมาะสำหรับดูภาพรวม)">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-all ${
                  viewMode === "table"
                    ? "bg-white text-[#2563EB] shadow-2xs"
                    : "text-[#94A3B8] hover:text-[#1E293B]"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </Tooltip>
          </div>
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 ? (
          <EmptyState
            icon={<FolderOpen className="h-6 w-6" />}
            title="ไม่พบคอร์สเรียนออนไลน์ที่ค้นหา"
            description="ลองปรับคำค้นหา หมวดหมู่ หรือสถานะการเรียน"
            action={
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setCategoryFilter("all");
                  setStatusFilter("all");
                }}
              >
                ล้างตัวกรอง
              </Button>
            }
          />
        ) : viewMode === "cards" ? (
          /* Clean, Scannable 3-Column Card Grid */
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredCourses.map((c) => {
              const rec = c.myRecord;
              const isPassed = rec?.status === "completed" && rec.passed;
              const curriculum = c.curriculum;

              return (
                <div
                  key={c.id}
                  className="flex flex-col justify-between rounded-2xl border border-[#EEF2F6] bg-white p-5 transition-all hover:border-[#BFDBFE] hover:shadow-sm"
                >
                  <div className="space-y-3">
                    {/* Row 1: Code + Category + Status */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                          {c.code}
                        </span>
                        <Badge variant="primary">{c.standardLabel}</Badge>
                      </div>
                      {isPassed ? (
                        <Tooltip content={`สอบผ่านเมื่อ ${rec.completedDate ?? "-"} • คะแนน ${rec.score}/100`}>
                          <Badge variant="success" dot className="cursor-help">
                            ผ่านแล้ว {rec.score}%
                          </Badge>
                        </Tooltip>
                      ) : (
                        <Badge variant="neutral">รอเรียน</Badge>
                      )}
                    </div>

                    {/* Row 2: Title + Concise Description */}
                    <div>
                      <h3 className="text-[15px] font-bold leading-snug text-[#1E293B]">
                        {c.name}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#64748B]">
                        {c.description}
                      </p>
                    </div>

                    {/* Row 3: Compact Metadata Bar */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-xl bg-[#F8FAFC] px-3.5 py-2.5 text-xs text-[#64748B]">
                      <span className="inline-flex items-center gap-1 font-medium text-[#334155]">
                        <BookOpen className="h-3.5 w-3.5 text-[#2563EB]" />
                        {curriculum.chapters.length} บทเรียน
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-[#94A3B8]" />
                        {c.durationHours} ชม.
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <FileCheck2 className="h-3.5 w-3.5 text-[#94A3B8]" />
                        สอบ {curriculum.questions.length} ข้อ
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <ShieldCheck className="h-3.5 w-3.5 text-[#22B89A]" />
                        ใบรับรอง {c.validityMonths} ด.
                      </span>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#F1F5F9] pt-3.5">
                    <span className="truncate text-xs text-[#94A3B8]">
                      {curriculum.instructor.split("(")[0].trim()}
                    </span>

                    <div className="flex shrink-0 items-center gap-1.5">
                      {canManage && (
                        <Tooltip content="จัดการบทเรียน ลิงก์วิดีโอ และข้อสอบ">
                          <button
                            type="button"
                            onClick={() => setEditingCourse(c)}
                            aria-label={`จัดการบทเรียน ${c.name}`}
                            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#64748B] transition-colors hover:border-[#BFDBFE] hover:bg-[#EFF6FF] hover:text-[#2563EB]"
                          >
                            <Settings className="h-4 w-4" />
                          </button>
                        </Tooltip>
                      )}
                      {isPassed && (
                        <Tooltip content="เปิดดูและพิมพ์ใบประกาศนียบัตร">
                          <Button
                            size="sm"
                            variant="outline"
                            leftIcon={<Award className="h-3.5 w-3.5 text-[#22B89A]" />}
                            onClick={() => enterClassroom(c, "certificate")}
                          >
                            ใบรับรอง
                          </Button>
                        </Tooltip>
                      )}
                      <Button
                        size="sm"
                        variant="primary"
                        leftIcon={<PlayCircle className="h-3.5 w-3.5" />}
                        onClick={() => enterClassroom(c, "learn")}
                      >
                        {isPassed ? "ทบทวน" : "เริ่มเรียน"}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Clean Table View Matching Approved System Format */
          <TableContainer className="rounded-xl border border-[#EEF2F6]">
            <Table>
              <TableHeader className="bg-[#F8FAFC]">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-5">รหัส / คอร์สออนไลน์</TableHead>
                  <TableHead className="w-32 text-center">หมวดหมู่</TableHead>
                  <TableHead className="w-36 pr-6 text-right">โครงสร้าง</TableHead>
                  <TableHead className="w-32 text-center">สถานะของฉัน</TableHead>
                  <TableHead className="w-48 pr-5 text-center">ดำเนินการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.map((c) => {
                  const rec = c.myRecord;
                  const isPassed = rec?.status === "completed" && rec.passed;
                  return (
                    <TableRow key={c.id}>
                      <TableCell className="py-3.5 pl-5">
                        <span className="rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                          {c.code}
                        </span>
                        <p className="mt-1 font-semibold text-[#1E293B]">{c.name}</p>
                        <p className="text-xs text-[#94A3B8]">
                          ผู้สอน: {c.curriculum.instructor.split("(")[0].trim()} • ใบรับรองอายุ {c.validityMonths} เดือน
                        </p>
                      </TableCell>
                      <TableCell className="py-3.5 text-center">
                        <Badge variant="primary">{c.standardLabel}</Badge>
                      </TableCell>
                      <TableCell className="py-3.5 pr-6 text-right tabular-nums">
                        <p className="font-semibold text-[#1E293B]">
                          {c.curriculum.chapters.length} บทเรียน ({c.durationHours} ชม.)
                        </p>
                        <p className="text-xs text-[#94A3B8]">
                          ข้อสอบ {c.curriculum.questions.length} ข้อ
                        </p>
                      </TableCell>
                      <TableCell className="py-3.5 text-center">
                        {isPassed ? (
                          <Badge variant="success" dot>
                            ผ่านแล้ว {rec.score}%
                          </Badge>
                        ) : (
                          <Badge variant="neutral">รอเรียน</Badge>
                        )}
                      </TableCell>
                      <TableCell className="py-3.5 pr-5 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          {canManage && (
                            <Tooltip content="จัดการบทเรียนและข้อสอบ">
                              <button
                                type="button"
                                onClick={() => setEditingCourse(c)}
                                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[#64748B] hover:bg-[#EFF6FF] hover:text-[#2563EB]"
                              >
                                <Settings className="h-4 w-4" />
                              </button>
                            </Tooltip>
                          )}
                          {isPassed && (
                            <Button
                              size="sm"
                              variant="outline"
                              leftIcon={<Award className="h-3.5 w-3.5 text-[#22B89A]" />}
                              onClick={() => enterClassroom(c, "certificate")}
                            >
                              ใบรับรอง
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="primary"
                            leftIcon={<PlayCircle className="h-3.5 w-3.5" />}
                            onClick={() => enterClassroom(c, "learn")}
                          >
                            {isPassed ? "ทบทวน" : "เริ่มเรียน"}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>

      {editingCourse && (
        <ElearningEditorModal
          open={Boolean(editingCourse)}
          courseName={editingCourse.name}
          initialCurriculum={editingCourse.curriculum}
          onClose={() => setEditingCourse(null)}
          onSaved={handleCurriculumSaved}
        />
      )}
    </Card>
  );
}
