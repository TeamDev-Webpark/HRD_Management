"use client";

import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Bell,
  Building2,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  GraduationCap,
  LogOut,
  Menu,
  RefreshCw,
  RotateCcw,
  Search,
  Send,
  Target,
  X,
} from "lucide-react";
import { Avatar, Badge, Button, Dropdown, Input, Modal, Select, Tooltip } from "@/components/ui";
import { useDemoStore, type AssignedFormItem } from "@/context/DemoStoreContext";
import { useLayout } from "@/context/LayoutContext";
import { ACTIVE_SIDEBAR_MENUS, ROLE_HOME_ROUTE, ROLE_OPTIONS } from "@/data/mock/layout";
import type { NotificationItem } from "@/types/hrd";

function NotificationCategoryIcon({ category }: { category: NotificationItem["category"] }) {
  if (category === "approval") {
    return (
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFF7ED] text-[#EA580C]">
        <ClipboardCheck className="h-4.5 w-4.5" />
      </div>
    );
  }
  if (category === "performance") {
    return (
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
        <Target className="h-4.5 w-4.5" />
      </div>
    );
  }
  if (category === "training") {
    return (
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F0F9FF] text-[#0284C7]">
        <GraduationCap className="h-4.5 w-4.5" />
      </div>
    );
  }
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F1F5F9] text-[#64748B]">
      <RefreshCw className="h-4.5 w-4.5" />
    </div>
  );
}

export function Topbar() {
  const router = useRouter();
  const pathname = usePathname();

  const currentModule = useMemo(() => {
    const matched = ACTIVE_SIDEBAR_MENUS.find(
      (m) => pathname === m.href || (m.href === "/dashboard" && pathname === "/")
    );
    return matched?.label ?? "แดชบอร์ด HRD";
  }, [pathname]);
  const {
    setMobileMenuOpen,
    currentUser,
    role,
    setRole,
  } = useLayout();

  const {
    notifications: allNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    sendFormToEmployee,
    resetDemoData,
  } = useDemoStore();

  const notifications = useMemo(
    () =>
      allNotifications.filter(
        (n) => !n.targetRoles || n.targetRoles.includes(role)
      ),
    [allNotifications, role]
  );
  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [notiOpen, setNotiOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [sendFormOpen, setSendFormOpen] = useState(false);
  const [formTitle, setFormTitle] = useState("แบบฟอร์มประเมินสมรรถนะและทักษะประจำปี 2569");
  const [formType, setFormType] = useState<AssignedFormItem["type"]>("แบบฟอร์มประเมิน");
  const [formDueDate, setFormDueDate] = useState("20 ธ.ค. 2569");
  const [formDesc, setFormDesc] = useState(
    "กรุณาตรวจสอบรายละเอียดและส่งแบบฟอร์มกลับภายในกำหนดผ่านหน้าบริการตนเอง (ESS)"
  );

  const searchResults = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    const results: { id: string; title: string; subtitle: string; href: string }[] = [];
    ACTIVE_SIDEBAR_MENUS.filter((m) => !m.roles || m.roles.includes(role)).forEach((menu) => {
      if (
        menu.label.toLowerCase().includes(q) ||
        menu.labelEn.toLowerCase().includes(q)
      ) {
        results.push({
          id: menu.id,
          title: menu.label,
          subtitle: menu.labelEn,
          href: menu.children?.[0]?.href ?? menu.href,
        });
      }
      menu.children
        ?.filter((sub) => !sub.roles || sub.roles.includes(role))
        .forEach((sub) => {
          if (
            sub.label.toLowerCase().includes(q) ||
            (sub.group && sub.group.toLowerCase().includes(q))
          ) {
            results.push({
              id: sub.id,
              title: sub.label,
              subtitle: `${menu.label}${sub.group ? ` • ${sub.group}` : ""}`,
              href: sub.href,
            });
          }
        });
    });
    return results.slice(0, 7);
  }, [search, role]);

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-[#DCE4EE] bg-white/95 px-4 shadow-[0_2px_10px_-3px_rgba(15,23,42,0.07)] backdrop-blur-md sm:px-6">
      {/* Left: Mobile Trigger + Module Breadcrumb + Crisp Search Box */}
      <div className="flex flex-1 items-center gap-3.5 min-w-0">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="เปิดเมนูนำทาง"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[#475569] hover:border-[#2563EB] hover:text-[#2563EB] lg:hidden cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Active Module Breadcrumb */}
        <div className="hidden items-center gap-1.5 whitespace-nowrap text-sm xl:flex">
          <span className="font-semibold text-[#64748B]">HRD</span>
          <ChevronRight className="h-4 w-4 text-[#94A3B8]" />
          <span className="font-bold text-[#0F172A]">{currentModule}</span>
          <span className="ml-2 h-5 w-px bg-[#E2E8F0]" aria-hidden="true" />
        </div>

        <div className="relative hidden w-full max-w-sm sm:block">
          <input
            type="text"
            value={search}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 180)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setSearch("");
                setSearchFocused(false);
              }
            }}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาเมนู, หลักสูตร, รายงาน..."
            className="h-10 w-full rounded-xl border border-[#DCE4EE] bg-[#F8FAFC] pl-4 pr-10 text-sm text-[#0F172A] placeholder:text-[#64748B] transition-all focus:border-[#2563EB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
          />
          {search ? (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="ล้างคำค้นหา"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A] cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <Search className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
          )}

          {searchFocused && search.trim().length > 0 && (
            <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 overflow-hidden rounded-2xl border border-[#EEF2F6] bg-white shadow-xl">
              {searchResults.length === 0 ? (
                <div className="px-4 py-4 text-center text-xs text-[#94A3B8]">
                  ไม่พบเมนูหรือหน้าที่ตรงกับ &ldquo;{search}&rdquo;
                </div>
              ) : (
                <ul className="divide-y divide-[#F1F5F9] py-1">
                  {searchResults.map((res) => (
                    <li key={res.id}>
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setSearch("");
                          setSearchFocused(false);
                          router.push(res.href);
                        }}
                        className="flex w-full cursor-pointer items-center justify-between gap-2 px-4 py-2.5 text-left transition-colors hover:bg-[#F7F9FC]"
                      >
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium text-[#1E293B]">
                            {res.title}
                          </div>
                          <div className="truncate text-xs text-[#64748B]">{res.subtitle}</div>
                        </div>
                        <ArrowUpRight className="h-4 w-4 shrink-0 text-[#94A3B8]" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right: Clean Soft Controls + Profile */}
      <div className="flex shrink-0 items-center gap-3">
        {/* Admin / Manager Quick Send Form to Employee */}
        {(role === "admin" || role === "manager") && (
          <Tooltip content="ส่งแบบฟอร์มหรือเอกสารให้พนักงาน (ณัฐพล เจริญสุข) ทำในหน้า ESS พร้อมแจ้งเตือนทันที">
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Send className="h-3.5 w-3.5" />}
              onClick={() => setSendFormOpen(true)}
              className="hidden md:inline-flex"
            >
              ส่งแบบฟอร์ม
            </Button>
          </Tooltip>
        )}

        {/* Notifications */}
        <Dropdown
          open={notiOpen}
          onOpenChange={setNotiOpen}
          panelClassName="w-[380px] max-w-[calc(100vw-2rem)]"
          trigger={
            <button
              type="button"
              aria-label="การแจ้งเตือน"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#DCE4EE] bg-white text-[#475569] shadow-2xs transition-colors hover:border-[#2563EB] hover:bg-[#EFF6FF] hover:text-[#2563EB] cursor-pointer"
            >
              <Bell className="h-4.5 w-4.5" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[#EF4444] px-1 text-[10px] font-bold text-white ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>
          }
        >
          <div className="flex items-center justify-between border-b border-[#F1F5F9] px-5 py-3.5">
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-semibold text-[#1E293B]">การแจ้งเตือน</span>
              {unreadCount > 0 && <Badge variant="primary">{unreadCount} ใหม่</Badge>}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => markAllNotificationsRead(role)}
                className="inline-flex items-center gap-1 text-xs font-medium text-[#2563EB] hover:text-[#1D4ED8] cursor-pointer"
              >
                <CheckCheck className="h-4 w-4" />
                อ่านทั้งหมด
              </button>
            )}
          </div>

          <div className="hrd-scrollbar max-h-80 divide-y divide-[#F1F5F9] overflow-y-auto">
            {notifications.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  markNotificationRead(item.id);
                  setNotiOpen(false);
                  if (item.href) router.push(item.href);
                }}
                className={`flex w-full items-start gap-3.5 px-5 py-3.5 text-left transition-colors hover:bg-[#F7F9FC] cursor-pointer ${
                  !item.read ? "bg-[#EFF6FF]/40" : ""
                }`}
              >
                <NotificationCategoryIcon category={item.category} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={`text-sm leading-snug ${
                        !item.read ? "font-semibold text-[#1E293B]" : "font-medium text-[#334155]"
                      }`}
                    >
                      {item.title}
                    </p>
                    {!item.read && (
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#2563EB]" />
                    )}
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-[#64748B]">{item.message}</p>
                  <span className="mt-1.5 block text-[11px] text-[#94A3B8]">{item.timestamp}</span>
                </div>
              </button>
            ))}
          </div>
        </Dropdown>

        <span className="hidden h-6 w-px bg-[#E2E8F0] sm:block" aria-hidden="true" />

        {/* User Profile */}
        <Dropdown
          open={profileOpen}
          onOpenChange={setProfileOpen}
          panelClassName="w-80 max-w-[calc(100vw-2rem)]"
          trigger={
            <button
              type="button"
              className="flex items-center gap-2.5 rounded-xl border border-[#DCE4EE] bg-white px-2.5 py-1.5 text-left shadow-2xs transition-colors hover:border-[#2563EB] hover:bg-[#F8FAFC] cursor-pointer"
            >
              <Avatar initials={currentUser.initials} size="sm" online />
              <div className="hidden leading-tight sm:block">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold text-[#0F172A]">{currentUser.name}</p>
                  <span className="rounded bg-[#EFF6FF] px-1.5 py-0.5 text-[10px] font-bold uppercase text-[#2563EB]">
                    {currentUser.role}
                  </span>
                </div>
                <p className="text-[11px] text-[#64748B]">{currentUser.position}</p>
              </div>
              <ChevronDown className="hidden h-4 w-4 text-[#64748B] sm:block" />
            </button>
          }
        >
          <div className="border-b border-[#F1F5F9] p-4">
            <div className="flex items-start gap-3">
              <Avatar initials={currentUser.initials} size="lg" online />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-semibold text-[#1E293B]">
                  {currentUser.name}
                </p>
                <p className="truncate text-xs text-[#64748B]">{currentUser.email}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Badge variant="primary">{currentUser.role.toUpperCase()}</Badge>
                  <Badge variant="neutral">{currentUser.employeeCode}</Badge>
                </div>
              </div>
            </div>
            <div className="mt-3 rounded-xl bg-[#F7F9FC] px-3 py-2.5 text-xs text-[#64748B]">
              <div className="flex items-center gap-1.5 font-medium text-[#1E293B]">
                <Building2 className="h-3.5 w-3.5 shrink-0 text-[#2563EB]" />
                <span className="truncate">{currentUser.department}</span>
              </div>
              <p className="mt-0.5 truncate pl-5">{currentUser.branch}</p>
            </div>
          </div>

          <div className="p-3.5">
            <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              สลับบทบาททดสอบ (Demo Role)
            </p>
            <div className="space-y-1">
              {ROLE_OPTIONS.map((opt) => {
                const active = role === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => {
                      setRole(opt.key);
                      setProfileOpen(false);
                      router.push(ROLE_HOME_ROUTE[opt.key]);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors cursor-pointer ${
                      active
                        ? "bg-[#EFF6FF] font-semibold text-[#2563EB]"
                        : "text-[#1E293B] hover:bg-[#F7F9FC]"
                    }`}
                  >
                    <span>
                      {opt.label}{" "}
                      <span className="text-xs font-normal text-[#94A3B8]">({opt.shortLabel})</span>
                    </span>
                    {active && <Check className="h-4 w-4 text-[#2563EB]" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1 border-t border-[#F1F5F9] p-2">
            <button
              type="button"
              onClick={() => {
                resetDemoData();
                setProfileOpen(false);
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-[#475569] transition-colors hover:bg-[#F7F9FC] hover:text-[#1E293B] cursor-pointer"
            >
              <RotateCcw className="h-4 w-4 shrink-0" />
              <span>รีเซ็ตข้อมูล Demo เริ่มต้น</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setProfileOpen(false);
                router.push("/login");
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-[#DC2626] transition-colors hover:bg-red-50 cursor-pointer"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span>ออกจากระบบ</span>
            </button>
          </div>
        </Dropdown>
      </div>

      {/* Quick Send Form / Document to Employee Modal */}
      <Modal
        open={sendFormOpen}
        onClose={() => setSendFormOpen(false)}
        title="ส่งแบบฟอร์ม / เอกสารให้พนักงาน (Live Demo)"
        description="ส่งถึง: ณัฐพล เจริญสุข (EMP-1024) — พนักงานจะเห็นแจ้งเตือนและเปิดทำในหน้า ESS ได้ทันที"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setSendFormOpen(false)}>
              ยกเลิก
            </Button>
            <Button
              variant="primary"
              leftIcon={<Send className="h-4 w-4" />}
              disabled={!formTitle.trim()}
              onClick={() => {
                sendFormToEmployee(formTitle, formType, formDueDate, formDesc);
                setSendFormOpen(false);
              }}
            >
              ส่งให้พนักงานทันที
            </Button>
          </>
        }
      >
        <div className="space-y-3.5">
          <Input
            label="ชื่อแบบฟอร์ม / เอกสาร"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Select
              label="ประเภทเอกสาร"
              value={formType}
              onChange={(v) => setFormType(v as AssignedFormItem["type"])}
              options={[
                { value: "แบบฟอร์มประเมิน", label: "แบบฟอร์มประเมิน" },
                { value: "แบบสำรวจความต้องการอบรม", label: "แบบสำรวจความต้องการอบรม" },
                { value: "เอกสารรับทราบนโยบาย", label: "เอกสารรับทราบนโยบาย" },
              ]}
            />
            <Input
              label="กำหนดส่ง"
              value={formDueDate}
              onChange={(e) => setFormDueDate(e.target.value)}
            />
          </div>
          <Input
            label="คำชี้แจงเพิ่มเติมถึงพนักงาน"
            value={formDesc}
            onChange={(e) => setFormDesc(e.target.value)}
          />
        </div>
      </Modal>
    </header>
  );
}
