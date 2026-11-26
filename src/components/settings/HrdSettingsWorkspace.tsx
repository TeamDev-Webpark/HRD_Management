"use client";

import { useState } from "react";
import {
  Award,
  BookOpen,
  CheckCircle2,
  Compass,
  FolderKanban,
  Gauge,
  GitBranch,
  Layers,
  ShieldAlert,
  Sliders,
} from "lucide-react";
import { Card, CardContent, InfoHint, StatCard, Tooltip } from "@/components/ui";
import { useLayout } from "@/context/LayoutContext";
import {
  INITIAL_CERTIFICATE_CONFIG,
  INITIAL_COMPETENCY_LEVELS,
  INITIAL_COURSE_TYPES,
  INITIAL_DEVELOPMENT_TYPES,
  INITIAL_HRD_CATEGORIES,
  INITIAL_SCORING_CRITERIA,
  INITIAL_SKILL_LEVELS,
  INITIAL_WORKFLOW_RULES,
  SETTINGS_TABS,
  type SettingsTabKey,
} from "@/data/mock/hrdSettings";
import { CertificateSettingsPanel, WorkflowSettingsPanel } from "./CertificateWorkflowPanel";
import { MasterListPanel } from "./MasterListPanel";
import { ScoringCriteriaPanel } from "./ScoringCriteriaPanel";

const TAB_ICON: Record<SettingsTabKey, React.ComponentType<{ className?: string }>> = {
  categories: FolderKanban,
  "course-types": BookOpen,
  "competency-levels": Layers,
  "skill-levels": Gauge,
  scoring: Sliders,
  "development-types": Compass,
  certificates: Award,
  workflows: GitBranch,
};

export function HrdSettingsWorkspace() {
  const { role } = useLayout();
  const [activeTab, setActiveTab] = useState<SettingsTabKey>("categories");
  const [toast, setToast] = useState<string | null>(null);

  const [categories, setCategories] = useState(INITIAL_HRD_CATEGORIES);
  const [courseTypes, setCourseTypes] = useState(INITIAL_COURSE_TYPES);
  const [competencyLevels, setCompetencyLevels] = useState(INITIAL_COMPETENCY_LEVELS);
  const [skillLevels, setSkillLevels] = useState(INITIAL_SKILL_LEVELS);
  const [scoringCriteria, setScoringCriteria] = useState(INITIAL_SCORING_CRITERIA);
  const [developmentTypes, setDevelopmentTypes] = useState(INITIAL_DEVELOPMENT_TYPES);
  const [certConfig, setCertConfig] = useState(INITIAL_CERTIFICATE_CONFIG);
  const [workflows, setWorkflows] = useState(INITIAL_WORKFLOW_RULES);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  };

  const allMasterItems = [
    ...categories,
    ...courseTypes,
    ...competencyLevels,
    ...skillLevels,
    ...developmentTypes,
  ];
  const totalMasterCount = allMasterItems.length + scoringCriteria.length;
  const activeMasterCount =
    allMasterItems.filter((i) => i.active).length + scoringCriteria.filter((i) => i.active).length;
  const activeWorkflowCount = workflows.filter((w) => w.active).length;

  const tabCounts: Partial<Record<SettingsTabKey, number>> = {
    categories: categories.length,
    "course-types": courseTypes.length,
    "competency-levels": competencyLevels.length,
    "skill-levels": skillLevels.length,
    scoring: scoringCriteria.length,
    "development-types": developmentTypes.length,
    workflows: workflows.length,
  };

  const activeTabMeta = SETTINGS_TABS.find((t) => t.key === activeTab) ?? SETTINGS_TABS[0];

  return (
    <div className="space-y-4">
      {/* Compact Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#1E293B]">ตั้งค่าระบบ HRD</h2>
            <InfoHint
              title="ข้อมูลหลักกลาง (HRD Master Settings)"
              content="ค่าตั้งต้นเหล่านี้เชื่อมโยงใช้ร่วมกันใน Training, LMS, PMS, Competency และ IDP"
            />
          </div>
          <p className="text-xs text-[#94A3B8]">
            จัดการหมวดหมู่ ประเภทหลักสูตร ระดับสมรรถนะ/ทักษะ เกณฑ์คะแนน ใบประกาศนียบัตร และ Workflow อนุมัติ
          </p>
        </div>

        {toast && (
          <div className="inline-flex items-center gap-2 rounded-xl bg-[#ECFAF5] px-3.5 py-2 text-xs font-medium text-[#1CA388] ring-1 ring-emerald-200/80">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {toast}
          </div>
        )}
      </div>

      {/* Role Notice (non-admin preview) */}
      {role !== "admin" && (
        <div className="flex items-center gap-2.5 rounded-xl bg-[#FEF9EC] px-4 py-2.5 text-xs text-[#C68A12] ring-1 ring-[#FDE68A]">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>
            กำลังดูในบทบาท <strong className="uppercase">{role}</strong> (Demo) —
            ในระบบจริงหน้าตั้งค่าระบบจำกัดสิทธิ์เฉพาะ <strong>Admin</strong> เท่านั้น
          </span>
        </div>
      )}

      {/* Row 1: 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          tone="blue"
          title="ข้อมูลมาตรฐานทั้งหมด"
          tooltip="รวมหมวดหมู่ ประเภทหลักสูตร ระดับสมรรถนะ ทักษะ เกณฑ์คะแนน และประเภทพัฒนา"
          value={`${totalMasterCount}`}
          unit="รายการ"
          icon={<FolderKanban className="h-5 w-5" />}
          footnote={`เปิดใช้งาน ${activeMasterCount} รายการ`}
        />
        <StatCard
          tone="green"
          title="Workflow อนุมัติ"
          tooltip="เส้นทางอนุมัติคำขอ HRD ที่เปิดใช้งานอยู่"
          value={`${activeWorkflowCount}/${workflows.length}`}
          unit="เส้นทาง"
          icon={<GitBranch className="h-5 w-5" />}
          footnote="เชื่อมสายบังคับบัญชา HRM"
        />
        <StatCard
          tone="purple"
          title="เกณฑ์คะแนน PMS"
          tooltip="จำนวนระดับเกรดมาตรฐานที่ใช้ในการประเมินผลงาน"
          value={`${scoringCriteria.length}`}
          unit="ระดับ"
          icon={<Sliders className="h-5 w-5" />}
          footnote="เกรด A ถึง PIP (เต็ม 5.0)"
        />
        <StatCard
          tone="yellow"
          title="ใบประกาศนียบัตร"
          tooltip="เกณฑ์คะแนนสอบผ่านขั้นต่ำสำหรับออกใบรับรองอัตโนมัติ"
          value={`${certConfig.minPassScore}%`}
          unit="ผ่านเกณฑ์"
          icon={<Award className="h-5 w-5" />}
          footnote={certConfig.autoIssue ? "ออกอัตโนมัติ (เปิด)" : "ออกอัตโนมัติ (ปิด)"}
        />
      </div>

      {/* Row 2: Dedicated Floating Tab Navigation Strip (Separated clearly from page content) */}
      <div className="rounded-2xl border border-[#EEF2F6] bg-white p-2 hrd-card-shadow">
        <nav
          aria-label="หมวดหมู่ตั้งค่า HRD"
          className="hrd-scrollbar flex items-center gap-1.5 overflow-x-auto"
        >
          {SETTINGS_TABS.map((tab) => {
            const Icon = TAB_ICON[tab.key];
            const active = activeTab === tab.key;
            const count = tabCounts[tab.key];

            return (
              <Tooltip key={tab.key} title={tab.labelEn} content={tab.description}>
                <button
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm transition-all cursor-pointer ${
                    active
                      ? "bg-[#2563EB] font-medium text-white shadow-[0_6px_14px_-4px_rgba(37,99,235,0.4)]"
                      : "font-medium text-[#64748B] hover:bg-[#F7F9FC] hover:text-[#1E293B]"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 ${active ? "text-white" : "text-[#94A3B8]"}`}
                  />
                  <span>{tab.label}</span>
                  {count !== undefined && (
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums leading-none ${
                        active ? "bg-white/20 text-white" : "bg-[#F1F5F9] text-[#64748B]"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              </Tooltip>
            );
          })}
        </nav>
      </div>

      {/* Row 3: Distinct Active Page Card */}
      <Card className="overflow-hidden">
        <CardContent className="p-5 sm:p-6">
          {activeTab === "categories" && (
            <MasterListPanel
              title={activeTabMeta.label}
              addLabel="เพิ่มหมวดหมู่"
              items={categories}
              onChange={setCategories}
              onNotify={showToast}
              codePlaceholder="เช่น CAT-AI"
              metaPlaceholder="เช่น 12 หลักสูตร"
            />
          )}

          {activeTab === "course-types" && (
            <MasterListPanel
              title={activeTabMeta.label}
              addLabel="เพิ่มประเภทหลักสูตร"
              items={courseTypes}
              onChange={setCourseTypes}
              onNotify={showToast}
              codePlaceholder="เช่น BOOTCAMP"
              metaPlaceholder="เช่น Onsite / Online"
            />
          )}

          {activeTab === "competency-levels" && (
            <MasterListPanel
              title={activeTabMeta.label}
              addLabel="เพิ่มระดับสมรรถนะ"
              items={competencyLevels}
              onChange={setCompetencyLevels}
              onNotify={showToast}
              codePlaceholder="เช่น LV-6"
              metaPlaceholder="เช่น คะแนน 5.0"
            />
          )}

          {activeTab === "skill-levels" && (
            <MasterListPanel
              title={activeTabMeta.label}
              addLabel="เพิ่มระดับทักษะ"
              items={skillLevels}
              onChange={setSkillLevels}
              onNotify={showToast}
              codePlaceholder="เช่น SK-6"
              metaPlaceholder="เช่น สเกล 5 / 5"
            />
          )}

          {activeTab === "scoring" && (
            <ScoringCriteriaPanel
              items={scoringCriteria}
              onChange={setScoringCriteria}
              onNotify={showToast}
            />
          )}

          {activeTab === "development-types" && (
            <MasterListPanel
              title={activeTabMeta.label}
              addLabel="เพิ่มประเภทการพัฒนา"
              items={developmentTypes}
              onChange={setDevelopmentTypes}
              onNotify={showToast}
              codePlaceholder="เช่น 70-ROTATE"
              metaPlaceholder="เช่น สัดส่วน 70%"
            />
          )}

          {activeTab === "certificates" && (
            <CertificateSettingsPanel
              config={certConfig}
              onChange={setCertConfig}
              onNotify={showToast}
            />
          )}

          {activeTab === "workflows" && (
            <WorkflowSettingsPanel
              rules={workflows}
              onChange={setWorkflows}
              onNotify={showToast}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
