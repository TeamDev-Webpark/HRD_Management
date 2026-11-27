"use client";

import { useMemo, useState } from "react";
import { FolderOpen, Pencil, Plus, Trash2 } from "lucide-react";
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
  QuestionBankItem,
  QuestionDifficulty,
  QuestionType,
} from "@/data/mock/lmsAssessment";

interface QuestionBankPanelProps {
  items: QuestionBankItem[];
  onChange: (items: QuestionBankItem[]) => void;
  onNotify: (message: string) => void;
}

const PAGE_SIZE = 5;

const DIFFICULTY_META: Record<
  QuestionDifficulty,
  { label: string; variant: "success" | "warning" | "danger"; hint: string }
> = {
  easy: { label: "ระดับง่าย", variant: "success", hint: "วัดความเข้าใจพื้นฐานและคำนิยามสำคัญ" },
  medium: { label: "ระดับกลาง", variant: "warning", hint: "วัดการประยุกต์ใช้ในสถานการณ์ทำงานจริง" },
  hard: { label: "ระดับยาก", variant: "danger", hint: "วัดการวิเคราะห์เชิงลึกและการตัดสินใจ" },
};

export function QuestionBankPanel({ items, onChange, onNotify }: QuestionBankPanelProps) {
  const [search, setSearch] = useState("");
  const [diffFilter, setDiffFilter] = useState<"all" | QuestionDifficulty>("all");
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<QuestionBankItem | null>(null);

  const [question, setQuestion] = useState("");
  const [courseTitle, setCourseTitle] = useState("Generative AI Essentials for Everyday Work");
  const [category, setCategory] = useState("Digital & AI");
  const [type, setType] = useState<QuestionType>("Multiple Choice");
  const [difficulty, setDifficulty] = useState<QuestionDifficulty>("medium");
  const [correctAnswer, setCorrectAnswer] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchDiff = diffFilter === "all" || item.difficulty === diffFilter;
      const matchQuery =
        !q ||
        item.code.toLowerCase().includes(q) ||
        item.question.toLowerCase().includes(q) ||
        item.courseTitle.toLowerCase().includes(q);
      return matchDiff && matchQuery;
    });
  }, [items, search, diffFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const openCreate = () => {
    setEditingId(null);
    setQuestion("");
    setCourseTitle("Generative AI Essentials for Everyday Work");
    setCategory("Digital & AI");
    setType("Multiple Choice");
    setDifficulty("medium");
    setCorrectAnswer("");
    setModalOpen(true);
  };

  const openEdit = (item: QuestionBankItem) => {
    setEditingId(item.id);
    setQuestion(item.question);
    setCourseTitle(item.courseTitle);
    setCategory(item.category);
    setType(item.type);
    setDifficulty(item.difficulty);
    setCorrectAnswer(item.correctAnswer);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!question.trim()) return;
    if (editingId) {
      onChange(
        items.map((item) =>
          item.id === editingId
            ? {
                ...item,
                question: question.trim(),
                courseTitle: courseTitle.trim() || item.courseTitle,
                category,
                type,
                difficulty,
                correctAnswer: correctAnswer.trim() || item.correctAnswer,
              }
            : item
        )
      );
      onNotify("อัปเดตข้อสอบในคลังเรียบร้อยแล้ว");
    } else {
      const created: QuestionBankItem = {
        id: `QB-${Date.now()}`,
        code: `QB-NEW-${String(items.length + 1).padStart(3, "0")}`,
        question: question.trim(),
        courseTitle: courseTitle.trim() || "หลักสูตรออนไลน์",
        category,
        type,
        difficulty,
        correctAnswer: correctAnswer.trim() || "คำตอบที่ถูกต้อง",
        active: true,
      };
      onChange([created, ...items]);
      setPage(1);
      onNotify("เพิ่มคำถามใหม่เข้าคลังข้อสอบแล้ว");
    }
    setModalOpen(false);
  };

  const toggleActive = (id: string) => {
    onChange(items.map((i) => (i.id === id ? { ...i, active: !i.active } : i)));
    onNotify("อัปเดตสถานะข้อสอบในคลังแล้ว");
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    onChange(items.filter((i) => i.id !== deleteTarget.id));
    onNotify(`ลบข้อสอบ ${deleteTarget.code} แล้ว`);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <SearchBar
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="ค้นหาคำถาม รหัส หรือชื่อคอร์ส..."
            containerClassName="w-full sm:w-64"
          />
          <Select
            value={diffFilter}
            onChange={(v) => {
              setDiffFilter(v as "all" | QuestionDifficulty);
              setPage(1);
            }}
            options={[
              { value: "all", label: "ทุกระดับความยาก" },
              { value: "easy", label: "ระดับง่าย" },
              { value: "medium", label: "ระดับกลาง" },
              { value: "hard", label: "ระดับยาก" },
            ]}
            className="w-full sm:w-44"
          />
        </div>

        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={openCreate}>
          เพิ่มคำถามเข้าคลัง
        </Button>
      </div>

      {paged.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="ไม่พบคำถามในคลังข้อสอบ"
          description="ลองปรับคำค้นหาหรือระดับความยาก"
        />
      ) : (
        <>
          <TableContainer className="rounded-xl border border-[#EEF2F6]">
            <Table>
              <TableHeader className="bg-[#F8FAFC]">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-5">รหัส / คำถามและเฉลย</TableHead>
                  <TableHead className="w-36 text-center">รูปแบบ</TableHead>
                  <TableHead className="w-28 text-center">ความยาก</TableHead>
                  <TableHead className="w-24 text-center">ใช้งาน</TableHead>
                  <TableHead className="w-24 pr-5 text-center">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((item) => {
                  const diff = DIFFICULTY_META[item.difficulty];
                  return (
                    <TableRow key={item.id} className={!item.active ? "opacity-60" : ""}>
                      <TableCell className="py-3.5 pl-5">
                        <span className="rounded-md bg-[#F3F0FF] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#7C6CF6]">
                          {item.code}
                        </span>
                        <p className="mt-1 font-semibold text-[#1E293B]">{item.question}</p>
                        <p className="mt-0.5 text-xs text-[#94A3B8]">
                          {item.courseTitle} • เฉลย: <span className="text-[#1CA388]">{item.correctAnswer}</span>
                        </p>
                      </TableCell>
                      <TableCell className="py-3.5 text-center">
                        <Badge variant="neutral">{item.type}</Badge>
                      </TableCell>
                      <TableCell className="py-3.5 text-center">
                        <Tooltip title={diff.label} content={diff.hint}>
                          <Badge variant={diff.variant} className="cursor-help">
                            {diff.label}
                          </Badge>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="py-3.5 text-center">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={item.active}
                          onClick={() => toggleActive(item.id)}
                          className={`relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors ${
                            item.active ? "bg-[#22B89A]" : "bg-[#CBD5E1]"
                          }`}
                        >
                          <span
                            className={`inline-block h-4.5 w-4.5 rounded-full bg-white shadow-xs transition-transform ${
                              item.active ? "translate-x-5.5" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </TableCell>
                      <TableCell className="py-3.5 pr-5 text-center">
                        <div className="inline-flex items-center gap-1">
                          <Tooltip content="แก้ไขคำถาม">
                            <button
                              type="button"
                              onClick={() => openEdit(item)}
                              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[#64748B] hover:bg-[#EFF6FF] hover:text-[#2563EB]"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                          </Tooltip>
                          <Tooltip content="ลบคำถาม">
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(item)}
                              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[#64748B] hover:bg-red-50 hover:text-[#DC2626]"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </Tooltip>
                        </div>
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

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "แก้ไขคำถามในคลังข้อสอบ" : "เพิ่มคำถามใหม่เข้าคลังข้อสอบ"}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              ยกเลิก
            </Button>
            <Button disabled={!question.trim()} onClick={handleSave}>
              {editingId ? "บันทึกการแก้ไข" : "เพิ่มเข้าคลัง"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="โจทย์คำถาม"
            placeholder="ระบุคำถามที่ต้องการใช้สุ่มออกข้อสอบ"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
          <Input
            label="หลักสูตรที่เกี่ยวข้อง"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="รูปแบบคำถาม"
              value={type}
              onChange={(v) => setType(v as QuestionType)}
              options={[
                { value: "Multiple Choice", label: "ปรนัย (Multiple Choice)" },
                { value: "True/False", label: "ถูก / ผิด (True/False)" },
                { value: "Scenario", label: "กรณีศึกษา (Scenario)" },
              ]}
            />
            <Select
              label="ระดับความยาก"
              value={difficulty}
              onChange={(v) => setDifficulty(v as QuestionDifficulty)}
              options={[
                { value: "easy", label: "ระดับง่าย" },
                { value: "medium", label: "ระดับกลาง" },
                { value: "hard", label: "ระดับยาก" },
              ]}
            />
          </div>
          <Input
            label="คำตอบที่ถูกต้อง (เฉลย)"
            placeholder="ระบุเฉลยที่ถูกต้อง"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
          />
        </div>
      </Modal>

      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="ยืนยันการลบคำถาม"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              ยกเลิก
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              ยืนยันลบ
            </Button>
          </>
        }
      >
        <p className="text-sm text-[#334155]">
          ต้องการลบคำถาม <strong className="text-[#1E293B]">{deleteTarget?.code}</strong> ออกจากคลังใช่หรือไม่?
        </p>
      </Modal>
    </div>
  );
}
