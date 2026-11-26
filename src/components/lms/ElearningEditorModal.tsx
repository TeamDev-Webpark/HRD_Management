"use client";

import { useRef, useState } from "react";
import {
  Clock,
  Film,
  Plus,
  Save,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { Button, Input, Modal, Tooltip } from "@/components/ui";
import type {
  CourseCurriculum,
  LessonChapter,
  VideoCheckpoint,
} from "@/data/mock/elearningCurriculum";
import { formatMmSs } from "./LessonVideoPlayer";
import { parseVideoSource } from "./videoUtils";

interface ElearningEditorModalProps {
  open: boolean;
  courseName: string;
  initialCurriculum: CourseCurriculum;
  onClose: () => void;
  onSaved: (updated: CourseCurriculum) => void;
}

export function ElearningEditorModal({
  open,
  courseName,
  initialCurriculum,
  onClose,
  onSaved,
}: ElearningEditorModalProps) {
  const [tab, setTab] = useState<"chapters" | "exam">("chapters");
  const [draft, setDraft] = useState<CourseCurriculum>(() =>
    JSON.parse(JSON.stringify(initialCurriculum))
  );
  const [selectedChIdx, setSelectedChIdx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [videoFileName, setVideoFileName] = useState<Record<string, string>>({});
  const [previewCurrentSec, setPreviewCurrentSec] = useState(10);
  const previewVideoRef = useRef<HTMLVideoElement | null>(null);

  const safeChIdx = Math.min(selectedChIdx, Math.max(0, draft.chapters.length - 1));
  const currentChapter = draft.chapters[safeChIdx];

  const updateCurrentChapter = (patch: Partial<LessonChapter>) => {
    setDraft((prev) => ({
      ...prev,
      chapters: prev.chapters.map((ch, i) => (i === safeChIdx ? { ...ch, ...patch } : ch)),
    }));
  };

  const handleVideoFile = (file?: File | null) => {
    if (!file || !currentChapter) return;
    if (!file.type.startsWith("video/") && !/\.(mp4|webm|ogg|mov|m4v)$/i.test(file.name)) {
      return;
    }
    const blobUrl = URL.createObjectURL(file);
    updateCurrentChapter({ videoUrl: blobUrl });
    setVideoFileName((prev) => ({ ...prev, [currentChapter.id]: file.name }));
    setPreviewCurrentSec(0);
  };

  const addChapter = () => {
    const nextNum = draft.chapters.length + 1;
    const newCh: LessonChapter = {
      id: `ch-${Date.now()}`,
      title: `บทที่ ${nextNum}: หัวข้อบทเรียนใหม่`,
      durationMin: 15,
      clauseRef: `บทที่ ${nextNum}`,
      videoUrl: "",
      videoCheckpoints: [
        {
          id: `cp-${Date.now()}`,
          timeSec: 10,
          question: "คำถามตรวจสอบความเข้าใจระหว่างดูคลิป",
          choices: ["ตัวเลือกที่ 1 (คำตอบที่ถูก)", "ตัวเลือกที่ 2", "ตัวเลือกที่ 3"],
          answerIndex: 0,
          explanation: "คำอธิบายเพิ่มเติมสำหรับคำตอบที่ถูกต้อง",
        },
      ],
      objectives: ["เข้าใจเนื้อหาหลักและนำไปประยุกต์ใช้ในงานประจำวันได้"],
      articles: [{ heading: "สรุปเนื้อหาสำคัญ", paragraphs: ["รายละเอียดบทเรียนและแนวทางปฏิบัติ"] }],
      guidelines: ["ปฏิบัติตามมาตรฐานที่กำหนด"],
      caseStudy: {
        scenario: "กรณีศึกษาตัวอย่างจากการทำงานจริง",
        goodPractice: "ปฏิบัติตามขั้นตอนมาตรฐานอย่างครบถ้วน",
        badPractice: "ข้ามขั้นตอนการตรวจสอบ",
      },
      takeaway: `ข้าพเจ้าเข้าใจเนื้อหาบทที่ ${nextNum} และพร้อมนำไปประยุกต์ใช้`,
    };
    setDraft((prev) => ({ ...prev, chapters: [...prev.chapters, newCh] }));
    setSelectedChIdx(draft.chapters.length);
  };

  const removeCurrentChapter = () => {
    if (draft.chapters.length <= 1) return;
    setDraft((prev) => ({
      ...prev,
      chapters: prev.chapters.filter((_, i) => i !== safeChIdx),
    }));
    setSelectedChIdx((prev) => Math.max(0, prev - 1));
  };

  const addCheckpoint = () => {
    if (!currentChapter) return;
    const existing = currentChapter.videoCheckpoints ?? [];
    const defaultSec =
      currentChapter.videoUrl && previewCurrentSec > 0
        ? Math.floor(previewCurrentSec)
        : (existing[existing.length - 1]?.timeSec ?? 0) + 10;

    const nextCp: VideoCheckpoint = {
      id: `cp-${Date.now()}`,
      timeSec: defaultSec,
      question: "คำถามทดสอบความเข้าใจระหว่างดูคลิป?",
      choices: ["ตัวเลือกที่ 1 (คำตอบที่ถูก)", "ตัวเลือกที่ 2", "ตัวเลือกที่ 3"],
      answerIndex: 0,
      explanation: "คำอธิบายเฉลยสำหรับผู้เรียน",
    };

    updateCurrentChapter({
      videoCheckpoints: [...existing, nextCp].sort((a, b) => a.timeSec - b.timeSec),
    });
  };

  const updateCheckpoint = (cpIdx: number, patch: Partial<VideoCheckpoint>) => {
    if (!currentChapter) return;
    const list = [...(currentChapter.videoCheckpoints ?? [])];
    list[cpIdx] = { ...list[cpIdx], ...patch };
    updateCurrentChapter({ videoCheckpoints: list });
  };

  const removeCheckpoint = (cpIdx: number) => {
    if (!currentChapter) return;
    updateCurrentChapter({
      videoCheckpoints: (currentChapter.videoCheckpoints ?? []).filter((_, i) => i !== cpIdx),
    });
  };

  const addQuestion = () => {
    const nextNum = draft.questions.length + 1;
    setDraft((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question: `${nextNum}. คำถามทดสอบวัดผลปลายภาค`,
          choices: ["ตัวเลือกที่ 1 (ถูก)", "ตัวเลือกที่ 2", "ตัวเลือกที่ 3"],
          answerIndex: 0,
          explanation: "คำอธิบายเฉลยข้อสอบ",
        },
      ],
    }));
  };

  const updateQuestion = (idx: number, patch: Partial<CourseCurriculum["questions"][number]>) => {
    setDraft((prev) => ({
      ...prev,
      questions: prev.questions.map((q, i) => (i === idx ? { ...q, ...patch } : q)),
    }));
  };

  const removeQuestion = (idx: number) => {
    if (draft.questions.length <= 1) return;
    setDraft((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== idx),
    }));
  };

  const parsedVideo = currentChapter ? parseVideoSource(currentChapter.videoUrl) : null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={`จัดการบทเรียน & ข้อสอบ — ${courseName}`}
      description="ลากไฟล์วิดีโอมาวาง เลือกลิงก์ YouTube/MP4 และตั้งเวลาจุดพักเพื่อเด้งคำถามระหว่างคลิปได้ทันที"
      footer={
        <div className="flex w-full items-center justify-between gap-2">
          <span className="text-xs text-[#94A3B8]">
            {draft.chapters.length} บทเรียน • ข้อสอบปลายภาค {draft.questions.length} ข้อ
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>
              ยกเลิก
            </Button>
            <Button
              leftIcon={<Save className="h-4 w-4" />}
              onClick={() => {
                onSaved(draft);
                onClose();
              }}
            >
              บันทึกโครงสร้างหลักสูตร
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Main Mode Tabs */}
        <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-[#F4F6FA] p-1 text-xs">
          <button
            type="button"
            onClick={() => setTab("chapters")}
            className={`cursor-pointer rounded-lg py-2 font-semibold transition-all ${
              tab === "chapters"
                ? "bg-[#2563EB] text-white shadow-2xs"
                : "text-[#64748B] hover:text-[#1E293B]"
            }`}
          >
            บทเรียน วิดีโอ & จุดถามคำถาม ({draft.chapters.length} บท)
          </button>
          <button
            type="button"
            onClick={() => setTab("exam")}
            className={`cursor-pointer rounded-lg py-2 font-semibold transition-all ${
              tab === "exam"
                ? "bg-[#2563EB] text-white shadow-2xs"
                : "text-[#64748B] hover:text-[#1E293B]"
            }`}
          >
            ข้อสอบปลายภาค ({draft.questions.length} ข้อ)
          </button>
        </div>

        {tab === "chapters" && currentChapter ? (
          <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-1">
            {/* Chapter Selector Strip */}
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#EEF2F6] bg-[#F8FAFC] p-2.5">
              <div className="flex flex-wrap items-center gap-1.5">
                {draft.chapters.map((ch, idx) => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => {
                      setSelectedChIdx(idx);
                      setPreviewCurrentSec(10);
                    }}
                    className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                      idx === safeChIdx
                        ? "bg-[#2563EB] text-white shadow-2xs"
                        : "border border-[#E2E8F0] bg-white text-[#475569] hover:border-[#BFDBFE] hover:text-[#2563EB]"
                    }`}
                  >
                    บทที่ {idx + 1}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={addChapter}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-dashed border-[#2563EB] bg-white px-3 py-1.5 text-xs font-semibold text-[#2563EB] hover:bg-[#EFF6FF]"
                >
                  <Plus className="h-3.5 w-3.5" />
                  เพิ่มบทใหม่
                </button>
              </div>

              {draft.chapters.length > 1 && (
                <button
                  type="button"
                  onClick={removeCurrentChapter}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-[#DC2626] hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  ลบบทที่ {safeChIdx + 1}
                </button>
              )}
            </div>

            {/* Chapter Basic Info */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
              <div className="sm:col-span-3">
                <Input
                  label={`ชื่อบทเรียน (บทที่ ${safeChIdx + 1})`}
                  value={currentChapter.title}
                  onChange={(e) => updateCurrentChapter({ title: e.target.value })}
                />
              </div>
              <Input
                label="เวลาเรียน (นาที)"
                type="number"
                min={1}
                value={currentChapter.durationMin}
                onChange={(e) =>
                  updateCurrentChapter({ durationMin: Math.max(1, Number(e.target.value) || 1) })
                }
              />
            </div>

            {/* Video Drag-and-Drop + URL + Preview + Checkpoints Card */}
            <div className="overflow-hidden rounded-2xl border border-[#DBEAFE] bg-white">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EFF6FF] bg-[#F8FAFC] px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563EB] text-white">
                    <Film className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-[#1E293B] sm:text-sm">
                        วิดีโอบทเรียน (Drag & Drop หรือวางลิงก์)
                      </h4>
                      {currentChapter.videoUrl ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFAF5] px-2 py-0.5 text-[11px] font-semibold text-[#1CA388]">
                          เชื่อมต่อคลิปแล้ว
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-[#F1F5F9] px-2 py-0.5 text-[11px] font-medium text-[#64748B]">
                          ใช้สไลด์จำลอง
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#64748B]">
                      ลากไฟล์วิดีโอ (.mp4, .webm, .mov) มาวางด้านล่าง หรือวางลิงก์ YouTube / Google Drive
                    </p>
                  </div>
                </div>

                {currentChapter.videoUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      updateCurrentChapter({ videoUrl: "" });
                      setVideoFileName((prev) => {
                        const copy = { ...prev };
                        delete copy[currentChapter.id];
                        return copy;
                      });
                    }}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-red-200 bg-white px-2.5 py-1 text-xs font-semibold text-[#DC2626] hover:bg-red-50"
                  >
                    <X className="h-3.5 w-3.5" />
                    นำคลิปออก
                  </button>
                )}
              </div>

              <div className="space-y-4 p-4">
                {/* Drag & Drop Zone */}
                <label
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files?.[0];
                    handleVideoFile(file);
                  }}
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-5 text-center transition-all ${
                    isDragging
                      ? "border-[#2563EB] bg-[#EFF6FF]"
                      : "border-[#CBD5E1] bg-[#F8FAFC] hover:border-[#2563EB] hover:bg-[#EFF6FF]/40"
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#2563EB] shadow-2xs ring-1 ring-[#EEF2F6]">
                    <UploadCloud className="h-5 w-5" />
                  </div>
                  <p className="mt-2 text-xs font-semibold text-[#1E293B]">
                    {videoFileName[currentChapter.id]
                      ? `ไฟล์ที่เลือก: ${videoFileName[currentChapter.id]}`
                      : "ลากไฟล์วิดีโอมาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์จากเครื่อง"}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[#94A3B8]">
                    รองรับ MP4, WebM, MOV (เล่นตัวอย่างทันทีบนเบราว์เซอร์เพื่อตั้งเวลาคำถามได้)
                  </p>
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/ogg,video/quicktime"
                    className="hidden"
                    onChange={(e) => {
                      handleVideoFile(e.target.files?.[0]);
                      e.target.value = "";
                    }}
                  />
                </label>

                {/* Or Paste Video URL */}
                <Input
                  label="หรือวางลิงก์วิดีโอออนไลน์ (YouTube / Google Drive / MP4 URL)"
                  placeholder="https://www.youtube.com/watch?v=... หรือเว้นว่างเพื่อใช้สไลด์จำลอง"
                  value={currentChapter.videoUrl?.startsWith("blob:") ? "" : (currentChapter.videoUrl ?? "")}
                  onChange={(e) => updateCurrentChapter({ videoUrl: e.target.value })}
                />

                {/* Live Video Preview with Time Scrubbing */}
                {parsedVideo && (
                  <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-[#0F172A] text-white">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 px-3.5 py-2 text-xs">
                      <span className="font-semibold text-blue-300">
                        ตัวอย่างคลิปวิดีโอ ({parsedVideo.providerLabel})
                      </span>
                      <span className="rounded bg-blue-500/20 px-2 py-0.5 font-mono text-[11px] text-blue-200 tabular-nums">
                        {parsedVideo.embedUrl
                          ? "คลิปออนไลน์ (ระบุเวลาด้านล่าง)"
                          : `เวลาปัจจุบัน: ${formatMmSs(previewCurrentSec)} (${Math.floor(previewCurrentSec)} วินาที)`}
                      </span>
                    </div>
                    <div className="bg-black p-2">
                      {parsedVideo.embedUrl ? (
                        <div className="aspect-video max-h-56 w-full overflow-hidden rounded-lg">
                          <iframe
                            src={parsedVideo.embedUrl}
                            title="Video Preview"
                            className="h-full w-full border-0"
                            allowFullScreen
                          />
                        </div>
                      ) : parsedVideo.directUrl ? (
                        <video
                          ref={previewVideoRef}
                          src={parsedVideo.directUrl}
                          controls
                          className="mx-auto max-h-56 w-full rounded-lg bg-black"
                          onTimeUpdate={(e) =>
                            setPreviewCurrentSec(Math.floor(e.currentTarget.currentTime))
                          }
                        />
                      ) : null}
                    </div>
                    <div className="bg-slate-900/80 px-3.5 py-1.5 text-[11px] text-slate-300">
                      เลื่อนแถบเวลาวิดีโอไปยังจุดที่ต้องการ แล้วกดปุ่ม &ldquo;+ เพิ่มจุดพักถามคำถาม&rdquo; ด้านล่างเพื่อดึงเวลานั้นอัตโนมัติ
                    </div>
                  </div>
                )}

                {/* In-Video Checkpoints Section */}
                <div className="space-y-3 border-t border-[#F1F5F9] pt-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="text-xs font-bold text-[#1E293B] sm:text-sm">
                          จุดพักเด้งคำถามระหว่างดูคลิป
                        </h5>
                        <span className="rounded-full bg-[#EFF6FF] px-2 py-0.5 text-[11px] font-semibold text-[#2563EB]">
                          {(currentChapter.videoCheckpoints ?? []).length} จุด
                        </span>
                      </div>
                      <p className="text-[11px] text-[#64748B]">
                        เมื่อผู้เรียนดูคลิปถึงเวลาที่ตั้งไว้ วิดีโอจะหยุดและเด้งคำถามขึ้นมาทันที
                      </p>
                    </div>

                    <Tooltip content="เพิ่มคำถามคั่นกลางตามเวลาปัจจุบันของคลิป (หรือปรับนาที:วินาทีเองได้)">
                      <Button
                        size="sm"
                        leftIcon={<Plus className="h-3.5 w-3.5" />}
                        onClick={addCheckpoint}
                      >
                        เพิ่มจุดพัก{" "}
                        {currentChapter.videoUrl && previewCurrentSec > 0
                          ? `(${formatMmSs(previewCurrentSec)})`
                          : ""}
                      </Button>
                    </Tooltip>
                  </div>

                  {(currentChapter.videoCheckpoints ?? []).length === 0 ? (
                    <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-4 text-center text-xs text-[#64748B]">
                      ยังไม่มีจุดพักถามคำถาม — กดปุ่ม <strong className="text-[#2563EB]">+ เพิ่มจุดพัก</strong> เพื่อตั้งเวลาเด้งคำถามในคลิป
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {(currentChapter.videoCheckpoints ?? []).map((cp, cpIdx) => {
                        const mins = Math.floor(cp.timeSec / 60);
                        const secs = cp.timeSec % 60;
                        return (
                          <div
                            key={cp.id}
                            className="space-y-3 rounded-xl border border-[#DBEAFE] bg-[#F8FAFC] p-3.5"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2E8F0] pb-2.5">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1 rounded-md bg-[#EFF6FF] px-2.5 py-1 text-xs font-bold text-[#2563EB]">
                                  <Clock className="h-3.5 w-3.5" />
                                  จุดที่ {cpIdx + 1} ({formatMmSs(cp.timeSec)})
                                </span>
                                <div className="inline-flex items-center gap-1 rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-1 text-xs">
                                  <span className="text-[11px] text-[#94A3B8]">นาที:</span>
                                  <input
                                    type="number"
                                    min={0}
                                    value={mins}
                                    onChange={(e) => {
                                      const m = Math.max(0, Number(e.target.value) || 0);
                                      updateCheckpoint(cpIdx, { timeSec: m * 60 + secs });
                                    }}
                                    className="h-5 w-10 text-center font-mono text-xs font-bold text-[#1E293B] focus:outline-none"
                                  />
                                  <span className="font-bold text-[#CBD5E1]">:</span>
                                  <span className="text-[11px] text-[#94A3B8]">วินาที:</span>
                                  <input
                                    type="number"
                                    min={0}
                                    max={59}
                                    value={secs}
                                    onChange={(e) => {
                                      const s = Math.min(59, Math.max(0, Number(e.target.value) || 0));
                                      updateCheckpoint(cpIdx, { timeSec: mins * 60 + s });
                                    }}
                                    className="h-5 w-10 text-center font-mono text-xs font-bold text-[#1E293B] focus:outline-none"
                                  />
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => removeCheckpoint(cpIdx)}
                                className="inline-flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-[#DC2626] hover:bg-red-50"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                ลบจุดพัก
                              </button>
                            </div>

                            <Input
                              label="คำถามที่จะเด้งขึ้นเมื่อวิดีโอหยุดพัก"
                              value={cp.question}
                              onChange={(e) => updateCheckpoint(cpIdx, { question: e.target.value })}
                            />

                            <div className="space-y-1.5">
                              <p className="text-xs font-medium text-[#64748B]">
                                ตัวเลือกคำตอบ (คลิกวงกลมหน้าข้อที่ถูกต้อง)
                              </p>
                              {cp.choices.map((chText, cIdx) => (
                                <div key={cIdx} className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name={`cp-ans-${cp.id}`}
                                    checked={cp.answerIndex === cIdx}
                                    onChange={() => updateCheckpoint(cpIdx, { answerIndex: cIdx })}
                                    className="h-4 w-4 cursor-pointer accent-[#22B89A]"
                                  />
                                  <input
                                    type="text"
                                    value={chText}
                                    onChange={(e) => {
                                      const nextChoices = cp.choices.map((c, ci) =>
                                        ci === cIdx ? e.target.value : c
                                      );
                                      updateCheckpoint(cpIdx, { choices: nextChoices });
                                    }}
                                    className="h-9 flex-1 rounded-lg border border-[#E2E8F0] bg-white px-3 text-xs text-[#1E293B] focus:border-[#2563EB] focus:outline-none"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Final Exam Tab */
          <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-1">
            {draft.questions.map((q, qIdx) => (
              <div
                key={qIdx}
                className="space-y-3 rounded-xl border border-[#EEF2F6] bg-[#F8FAFC] p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-md bg-[#F3F0FF] px-2 py-0.5 text-xs font-bold text-[#7C6CF6]">
                    ข้อที่ {qIdx + 1}
                  </span>
                  {draft.questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIdx)}
                      className="inline-flex cursor-pointer items-center gap-1 text-xs text-[#DC2626] hover:underline"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      ลบข้อนี้
                    </button>
                  )}
                </div>

                <Input
                  label="คำถาม"
                  value={q.question}
                  onChange={(e) => updateQuestion(qIdx, { question: e.target.value })}
                />

                <div className="space-y-2">
                  <p className="text-xs font-medium text-[#64748B]">
                    ตัวเลือกคำตอบ (คลิกวงกลมหน้าข้อที่ถูกต้อง)
                  </p>
                  {q.choices.map((choice, cIdx) => (
                    <div key={cIdx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`edit-q-${qIdx}`}
                        checked={q.answerIndex === cIdx}
                        onChange={() => updateQuestion(qIdx, { answerIndex: cIdx })}
                        className="h-4 w-4 accent-[#22B89A]"
                      />
                      <input
                        type="text"
                        value={choice}
                        onChange={(e) => {
                          const nextChoices = q.choices.map((c, ci) =>
                            ci === cIdx ? e.target.value : c
                          );
                          updateQuestion(qIdx, { choices: nextChoices });
                        }}
                        className="h-9 flex-1 rounded-lg border border-[#E2E8F0] bg-white px-3 text-xs text-[#1E293B] focus:border-[#2563EB] focus:outline-none"
                      />
                    </div>
                  ))}
                </div>

                <Input
                  label="คำอธิบายเฉลย"
                  value={q.explanation}
                  onChange={(e) => updateQuestion(qIdx, { explanation: e.target.value })}
                />
              </div>
            ))}

            <Button size="sm" variant="outline" leftIcon={<Plus className="h-4 w-4" />} onClick={addQuestion}>
              เพิ่มข้อสอบปลายภาค
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
