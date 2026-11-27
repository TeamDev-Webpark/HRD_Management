"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  FileText,
  Maximize2,
  Pause,
  Play,
  Settings,
  Subtitles,
  Volume2,
  VolumeX,
} from "lucide-react";
import type { LessonChapter, VideoCheckpoint } from "@/data/mock/elearningCurriculum";
import { parseVideoSource } from "./videoUtils";

export function formatMmSs(sec: number): string {
  const safe = Math.max(0, Math.floor(sec));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

interface VideoScene {
  title: string;
  subtitle: string;
  points: string[];
  narration: string;
  badge: string;
}

export const VIDEO_QUALITY_OPTIONS = [
  { id: "720p", label: "720p (HD คมชัดสูงสุด)", ytQuality: "hd720" },
  { id: "480p", label: "480p (มาตรฐาน)", ytQuality: "large" },
  { id: "360p", label: "360p (ประหยัดข้อมูล)", ytQuality: "medium" },
  { id: "240p", label: "240p (ความคมชัดขั้นต่ำ)", ytQuality: "small" },
] as const;

export type VideoQualityOption = (typeof VIDEO_QUALITY_OPTIONS)[number]["id"];

export interface ChapterQuizCompletionResult {
  passed: boolean;
  correctCount: number;
  totalCount: number;
  checkpointResults: Record<string, { choice: number; isCorrect: boolean }>;
}

export function LessonVideoPlayer({
  courseCode,
  instructor,
  chapter,
  chapterIndex,
  totalChapters,
  onCheckpointAnswered,
  onVideoCompleted,
}: {
  courseCode: string;
  instructor: string;
  chapter: LessonChapter;
  chapterIndex: number;
  totalChapters: number;
  onCheckpointAnswered?: (result: ChapterQuizCompletionResult) => void;
  onVideoCompleted?: (result?: ChapterQuizCompletionResult) => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const scenes = useMemo<VideoScene[]>(() => {
    const list: VideoScene[] = [
      {
        badge: `บทนำ • ${chapter.clauseRef}`,
        title: chapter.title,
        subtitle: "วัตถุประสงค์การเรียนรู้ประจำบท",
        points: chapter.objectives,
        narration: `ยินดีต้อนรับสู่ ${chapter.title} โดย ${instructor} ในบทนี้เราจะเรียนรู้วัตถุประสงค์หลักทั้ง ${chapter.objectives.length} ข้อ`,
      },
    ];

    for (const art of chapter.articles) {
      const pts = art.bullets && art.bullets.length > 0 ? art.bullets : art.paragraphs;
      list.push({
        badge: `เนื้อหาหลัก • ${chapter.clauseRef}`,
        title: art.heading,
        subtitle: art.paragraphs[0] ?? chapter.title,
        points: pts.slice(0, 4),
        narration: art.paragraphs.join(" "),
      });
    }

    list.push({
      badge: "กรณีศึกษาหน้างานจริง (Case Study)",
      title: "ตัวอย่างสถานการณ์และแนวทางปฏิบัติที่ถูกต้อง",
      subtitle: `สถานการณ์: ${chapter.caseStudy.scenario}`,
      points: [
        `✓ แนวทางที่ถูกต้อง: ${chapter.caseStudy.goodPractice}`,
        `✗ ข้อห้ามปฏิบัติ: ${chapter.caseStudy.badPractice}`,
        ...chapter.guidelines.slice(0, 2).map((g) => `• ${g}`),
      ],
      narration: `กรณีศึกษาหน้างาน: ${chapter.caseStudy.scenario} แนวทางที่ถูกต้องคือ ${chapter.caseStudy.goodPractice}`,
    });

    return list;
  }, [chapter, instructor]);

  const checkpoints = useMemo<VideoCheckpoint[]>(() => {
    if (chapter.videoCheckpoints && chapter.videoCheckpoints.length > 0) {
      return [...chapter.videoCheckpoints].sort((a, b) => a.timeSec - b.timeSec);
    }
    return [
      {
        id: `auto-cp-${chapter.id}-1`,
        timeSec: 10,
        question: `ข้อใดคือแนวทางปฏิบัติที่ถูกต้องจากกรณีศึกษาของ ${chapter.title.replace(/^บทที่\s*\d+\s*:\s*/, "")}?`,
        choices: [
          chapter.caseStudy.goodPractice,
          chapter.caseStudy.badPractice,
          "ข้ามขั้นตอนการตรวจสอบเพื่อประหยัดเวลา",
        ],
        answerIndex: 0,
        explanation: chapter.caseStudy.goodPractice,
      },
    ];
  }, [chapter]);

  const videoSource = useMemo(() => parseVideoSource(chapter.videoUrl), [chapter.videoUrl]);
  const isEmbedVideo = Boolean(videoSource?.embedUrl);
  const isDirectVideo = Boolean(videoSource?.directUrl);
  const isSimulated = !videoSource;

  const simulatedTotalSec = useMemo(() => {
    const maxCp = checkpoints.reduce((m, c) => Math.max(m, c.timeSec), 0);
    return Math.max(28, maxCp + 8);
  }, [checkpoints]);

  const [playing, setPlaying] = useState(false);
  const [currentSec, setCurrentSec] = useState(0);
  const [videoDuration, setVideoDuration] = useState(simulatedTotalSec);
  const [muted, setMuted] = useState(false);
  const [quality, setQuality] = useState<VideoQualityOption>("720p");
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [qualityToast, setQualityToast] = useState<string | null>(null);
  const [showCaptions, setShowCaptions] = useState(true);
  const [showTranscript, setShowTranscript] = useState(false);

  const [answeredCheckpointIds, setAnsweredCheckpointIds] = useState<Set<string>>(new Set());
  const [checkpointResults, setCheckpointResults] = useState<
    Record<string, { choice: number; isCorrect: boolean }>
  >({});
  const [activeCheckpoint, setActiveCheckpoint] = useState<VideoCheckpoint | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

  const maxWatchedSecRef = useRef<number>(0);
  const qualityToastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const effectiveDuration = isDirectVideo ? Math.max(1, videoDuration) : simulatedTotalSec;

  const completeVideo = (
    latestResults: Record<string, { choice: number; isCorrect: boolean }> = checkpointResults
  ) => {
    setPlaying(false);
    const correctCount = Object.values(latestResults).filter((r) => r.isCorrect).length;
    const totalCount = checkpoints.length;
    onVideoCompleted?.({
      passed: totalCount === 0 || correctCount === totalCount,
      correctCount,
      totalCount,
      checkpointResults: latestResults,
    });
  };

  useEffect(() => {
    if (!showQualityMenu) return;
    const close = () => setShowQualityMenu(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [showQualityMenu]);

  useEffect(() => {
    if (!playing || isDirectVideo || activeCheckpoint) return;
    const interval = setInterval(() => {
      setCurrentSec((prev) => {
        const next = prev + 0.5;
        maxWatchedSecRef.current = Math.max(maxWatchedSecRef.current, next);
        const hit = checkpoints.find(
          (cp) => !answeredCheckpointIds.has(cp.id) && prev < cp.timeSec && next >= cp.timeSec
        );
        if (hit) {
          setPlaying(false);
          setActiveCheckpoint(hit);
          setSelectedChoice(null);
          return hit.timeSec;
        }
        if (next >= simulatedTotalSec) {
          completeVideo();
          return simulatedTotalSec;
        }
        return next;
      });
    }, 500);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, isDirectVideo, activeCheckpoint, checkpoints, answeredCheckpointIds, simulatedTotalSec]);

  const applyQuality = (q: VideoQualityOption) => {
    setQuality(q);
    setShowQualityMenu(false);
    if (qualityToastTimerRef.current) clearTimeout(qualityToastTimerRef.current);
    setQualityToast(`ปรับความคมชัดเป็น ${q} แล้ว`);
    qualityToastTimerRef.current = setTimeout(() => setQualityToast(null), 1500);
  };

  const handleSaveAndResume = () => {
    if (!activeCheckpoint || selectedChoice === null) return;
    const isCorrect = selectedChoice === activeCheckpoint.answerIndex;
    const nextResults = {
      ...checkpointResults,
      [activeCheckpoint.id]: { choice: selectedChoice, isCorrect },
    };
    setCheckpointResults(nextResults);
    const correctCount = Object.values(nextResults).filter((r) => r.isCorrect).length;
    const totalCount = checkpoints.length;
    onCheckpointAnswered?.({
      passed: totalCount === 0 || correctCount === totalCount,
      correctCount,
      totalCount,
      checkpointResults: nextResults,
    });
    setAnsweredCheckpointIds((prev) => {
      const next = new Set(prev);
      next.add(activeCheckpoint.id);
      return next;
    });
    setActiveCheckpoint(null);
    setSelectedChoice(null);
    if (isDirectVideo && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
    setPlaying(true);
  };

  const togglePlayPause = () => {
    if (activeCheckpoint) return;
    if (!playing && currentSec >= effectiveDuration) {
      setCurrentSec(0);
      maxWatchedSecRef.current = 0;
      if (isDirectVideo && videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
      setPlaying(true);
      return;
    }
    if (isDirectVideo && videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    } else {
      setPlaying((p) => !p);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const overallPct = Math.min(100, Math.round((currentSec / effectiveDuration) * 100));
  const safeSceneIdx = Math.min(
    scenes.length - 1,
    Math.floor((currentSec / effectiveDuration) * scenes.length)
  );
  const currentScene = scenes[safeSceneIdx] ?? scenes[0];

  return (
    <div className="space-y-3">
      {/* Video Frame */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#0F172A] shadow-sm"
      >
        {qualityToast && (
          <div className="pointer-events-none absolute right-4 top-4 z-30 flex items-center gap-1.5 rounded-xl bg-slate-900/90 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-blue-400/40">
            <Settings className="h-3.5 w-3.5 text-[#3B82F6]" />
            <span>{qualityToast}</span>
          </div>
        )}

        {isDirectVideo && videoSource?.directUrl ? (
          <div
            onClick={togglePlayPause}
            className="relative flex aspect-video w-full cursor-pointer items-center justify-center bg-black select-none"
          >
            <video
              ref={videoRef}
              src={videoSource.directUrl}
              playsInline
              controls={false}
              disablePictureInPicture
              controlsList="nodownload nofullscreen noremoteplayback"
              className="pointer-events-none h-full w-full object-contain"
              onLoadedMetadata={(e) => {
                const dur = e.currentTarget.duration;
                if (Number.isFinite(dur) && dur > 0) setVideoDuration(dur);
              }}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onTimeUpdate={(e) => {
                const t = e.currentTarget.currentTime;
                setCurrentSec(t);
                maxWatchedSecRef.current = Math.max(maxWatchedSecRef.current, t);
                const due = checkpoints.find(
                  (cp) => !answeredCheckpointIds.has(cp.id) && t >= cp.timeSec && currentSec < cp.timeSec + 2
                );
                if (due) {
                  setPlaying(false);
                  e.currentTarget.pause();
                  setActiveCheckpoint(due);
                  setSelectedChoice(null);
                }
              }}
              onSeeking={(e) => {
                if (e.currentTarget.currentTime > maxWatchedSecRef.current + 1) {
                  e.currentTarget.currentTime = maxWatchedSecRef.current;
                  setCurrentSec(maxWatchedSecRef.current);
                }
              }}
              onEnded={() => completeVideo()}
            />
            {!playing && !activeCheckpoint && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#2563EB] shadow-xl transition-transform hover:scale-105">
                  <Play className="ml-1 h-7 w-7 fill-current" />
                </div>
              </div>
            )}
          </div>
        ) : isEmbedVideo && videoSource?.embedUrl ? (
          <div className="relative aspect-video w-full bg-black">
            <iframe
              ref={iframeRef}
              src={videoSource.embedUrl}
              title={chapter.title}
              className="h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          /* Built-in Interactive Slide-Video Player */
          <div className="relative flex min-h-[330px] w-full flex-col justify-between bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#172554] p-5 sm:aspect-video sm:p-6 select-none">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/20 px-2.5 py-0.5 font-semibold text-blue-200">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      playing ? "animate-pulse bg-[#22B89A]" : "bg-[#F5B73B]"
                    }`}
                  />
                  {courseCode} • บทที่ {chapterIndex + 1}/{totalChapters}
                </span>
                <span className="hidden rounded-md bg-white/10 px-2 py-0.5 text-[11px] text-slate-300 sm:inline">
                  {currentScene.badge}
                </span>
              </div>
              <span className="rounded-md bg-black/35 px-2.5 py-0.5 font-mono text-[11px] text-[#F5B73B] tabular-nums">
                คำถามระหว่างคลิป: {answeredCheckpointIds.size}/{checkpoints.length} ข้อ
              </span>
            </div>

            <div onClick={togglePlayPause} className="my-auto cursor-pointer py-4">
              <div className="mx-auto max-w-2xl space-y-3">
                <h3 className="text-base font-bold leading-snug text-white sm:text-xl">
                  {currentScene.title}
                </h3>
                <p className="line-clamp-2 text-xs leading-relaxed text-blue-100/85 sm:text-sm">
                  {currentScene.subtitle}
                </p>
                <ul className="space-y-1.5 rounded-xl border border-white/10 bg-white/5 p-3.5 text-xs text-slate-100 sm:text-sm">
                  {currentScene.points.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2 leading-relaxed">
                      <span className="mt-0.5 font-bold text-[#3B82F6]">▸</span>
                      <span className="line-clamp-2">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {!playing && !activeCheckpoint && (
                <div className="mt-4 flex justify-center">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#2563EB] px-4 py-1.5 text-xs font-semibold text-white shadow-lg transition-colors hover:bg-[#1D4ED8]">
                    <Play className="h-3.5 w-3.5 fill-current" />
                    {currentSec >= effectiveDuration
                      ? "เล่นวิดีโอซ้ำอีกครั้ง"
                      : currentSec > 0
                        ? "เล่นวิดีโอต่อ"
                        : "คลิกเพื่อเริ่มเล่นวิดีโอบทเรียน"}
                  </span>
                </div>
              )}
            </div>

            {showCaptions && (
              <div className="rounded-lg bg-black/65 px-3.5 py-2 text-center text-xs leading-relaxed text-amber-100">
                <span className="font-semibold text-white">{instructor.split(" ")[0]}:</span>{" "}
                &ldquo;{currentScene.narration}&rdquo;
              </div>
            )}
          </div>
        )}

        {/* In-Video Pop-up Checkpoint Quiz Overlay */}
        {activeCheckpoint && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-xs">
            <div className="max-h-full w-full max-w-xl space-y-3.5 overflow-y-auto rounded-2xl border border-blue-400/40 bg-[#0F172A] p-5 text-white shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/40 bg-blue-500/20 px-3 py-0.5 text-xs font-semibold text-blue-200">
                  ⏸ คำถามคั่นระหว่างดูวิดีโอ (นาทีที่ {formatMmSs(activeCheckpoint.timeSec)})
                </span>
                <span className="text-[11px] text-slate-400">
                  ตอบคำถามเพื่อบันทึกและดูวิดีโอต่อ
                </span>
              </div>

              <p className="text-sm font-bold leading-snug text-white sm:text-base">
                {activeCheckpoint.question}
              </p>

              <div className="space-y-2">
                {activeCheckpoint.choices.map((choice, cIdx) => {
                  const isSelected = selectedChoice === cIdx;
                  return (
                    <label
                      key={cIdx}
                      className={`flex cursor-pointer items-start gap-2.5 rounded-xl border px-3.5 py-2.5 text-xs transition-colors sm:text-sm ${
                        isSelected
                          ? "border-[#3B82F6] bg-[#2563EB]/25 font-semibold text-blue-100"
                          : "border-slate-700 bg-slate-800/80 text-slate-200 hover:bg-slate-800"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`cp-${activeCheckpoint.id}`}
                        checked={isSelected}
                        onChange={() => setSelectedChoice(cIdx)}
                        className="mt-0.5 accent-[#3B82F6]"
                      />
                      <span>{choice}</span>
                    </label>
                  );
                })}
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  disabled={selectedChoice === null}
                  onClick={handleSaveAndResume}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white shadow-md transition-colors hover:bg-[#1D4ED8] disabled:opacity-40 sm:text-sm"
                >
                  บันทึกคำตอบและดูต่อ
                  <Play className="h-3.5 w-3.5 fill-current" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Timeline Bar with Checkpoint Dots */}
        <div className="relative h-2 w-full select-none overflow-visible border-b border-slate-800 bg-slate-900">
          <div
            className="h-full bg-[#3B82F6] transition-all duration-150"
            style={{ width: `${overallPct}%` }}
          />
          {checkpoints.map((cp) => {
            const leftPct = Math.min(97, Math.max(3, (cp.timeSec / effectiveDuration) * 100));
            const isAnswered = answeredCheckpointIds.has(cp.id);
            return (
              <div
                key={cp.id}
                style={{ left: `${leftPct}%` }}
                title={`จุดถามคำถาม: นาทีที่ ${formatMmSs(cp.timeSec)} (${isAnswered ? "ตอบแล้ว" : "รอตอบ"})`}
                className="pointer-events-none absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
              >
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full border-2 border-white text-[9px] font-bold shadow-md ${
                    isAnswered ? "bg-[#22B89A] text-white" : "bg-[#F5B73B] text-slate-900"
                  }`}
                >
                  {isAnswered ? "✓" : "?"}
                </span>
              </div>
            );
          })}
        </div>

        {/* Clean Single-Row Player Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-white px-4 py-2.5 text-xs">
          <div className="flex items-center gap-2">
            {!isEmbedVideo && (
              <button
                type="button"
                onClick={togglePlayPause}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#2563EB] px-3.5 py-1.5 font-semibold text-white transition-colors hover:bg-[#1D4ED8]"
              >
                {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                {playing ? "หยุดชั่วคราว" : "เล่นวิดีโอ"}
              </button>
            )}

            {isDirectVideo && (
              <button
                type="button"
                onClick={() => {
                  if (videoRef.current) videoRef.current.muted = !muted;
                  setMuted(!muted);
                }}
                className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-1.5 font-medium text-[#334155] hover:bg-[#F8FAFC]"
              >
                {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                {muted ? "ปิดเสียง" : "เสียง"}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <span className="font-mono text-xs font-semibold tabular-nums text-[#475569]">
              {formatMmSs(currentSec)} / {formatMmSs(effectiveDuration)}
            </span>

            {/* Quality Selector (240p - 720p) */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowQualityMenu((v) => !v);
                }}
                className={`inline-flex cursor-pointer items-center gap-1 rounded-lg border px-2.5 py-1.5 font-semibold transition-colors ${
                  showQualityMenu
                    ? "border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]"
                    : "border-[#E2E8F0] bg-white text-[#475569] hover:bg-[#F8FAFC]"
                }`}
                title="ปรับความละเอียดวิดีโอ (240p – 720p)"
              >
                <Settings className="h-3.5 w-3.5" />
                {quality}
                <ChevronDown className="h-3 w-3 text-[#94A3B8]" />
              </button>

              {showQualityMenu && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-full right-0 z-40 mb-2 w-52 rounded-xl border border-[#E2E8F0] bg-white p-1.5 shadow-xl"
                >
                  <div className="mb-1 flex items-center justify-between border-b border-[#F1F5F9] px-2.5 py-1 text-[11px] font-semibold text-[#64748B]">
                    <span>ความละเอียดวิดีโอ</span>
                    <span className="font-mono text-[10px] text-[#2563EB]">240p–720p</span>
                  </div>
                  {VIDEO_QUALITY_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => applyQuality(opt.id)}
                      className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs font-medium ${
                        quality === opt.id
                          ? "bg-[#EFF6FF] font-semibold text-[#2563EB]"
                          : "text-[#334155] hover:bg-[#F8FAFC]"
                      }`}
                    >
                      <span>{opt.label}</span>
                      {quality === opt.id && <Check className="h-3.5 w-3.5" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-1.5 font-medium text-[#475569] hover:bg-[#F8FAFC]"
              title="ขยายเต็มหน้าจอ"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">เต็มจอ</span>
            </button>

            {isSimulated && (
              <button
                type="button"
                onClick={() => setShowCaptions((c) => !c)}
                className={`inline-flex cursor-pointer items-center gap-1 rounded-lg border px-2.5 py-1.5 font-medium transition-colors ${
                  showCaptions
                    ? "border-[#BFDBFE] bg-[#EFF6FF] text-[#2563EB]"
                    : "border-[#E2E8F0] bg-white text-[#64748B] hover:bg-[#F8FAFC]"
                }`}
              >
                <Subtitles className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">คำบรรยาย</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Collapsible Handout Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#EEF2F6] bg-[#F8FAFC] px-3.5 py-2.5 text-xs">
        <span className="text-[#64748B]">
          วิดีโอจะหยุดพักอัตโนมัติเมื่อถึงจุด <strong className="text-[#C68A12]">?</strong> บนแถบเวลา เพื่อถามคำถามและป้องกันการกอข้าม
        </span>
        <button
          type="button"
          onClick={() => setShowTranscript((v) => !v)}
          className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 font-semibold text-[#2563EB] hover:underline"
        >
          <FileText className="h-3.5 w-3.5" />
          {showTranscript ? "ซ่อนเอกสารสรุป" : "ดูเอกสารสรุปประกอบวิดีโอ"}
        </button>
      </div>

      {showTranscript && (
        <div className="space-y-3 rounded-xl border border-[#EEF2F6] bg-white p-4 text-xs sm:text-sm">
          <p className="font-bold text-[#1E293B]">เอกสารสรุปประกอบวิดีโอ (Handout)</p>
          {chapter.articles.map((art, aIdx) => (
            <div key={aIdx} className="space-y-1.5 border-b border-[#F1F5F9] pb-3 last:border-b-0 last:pb-0">
              <p className="font-semibold text-[#2563EB]">{art.heading}</p>
              {art.paragraphs.map((p, pIdx) => (
                <p key={pIdx} className="leading-relaxed text-[#334155]">
                  {p}
                </p>
              ))}
              {art.bullets && art.bullets.length > 0 && (
                <ul className="list-disc space-y-1 pl-5 text-[#64748B]">
                  {art.bullets.map((b, bIdx) => (
                    <li key={bIdx}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
