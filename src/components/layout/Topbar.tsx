"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  Building2,
  Check,
  CheckCheck,
  ChevronDown,
  ClipboardCheck,
  GraduationCap,
  LogOut,
  Menu,
  RefreshCw,
  Search,
  Target,
  X,
} from "lucide-react";
import { Avatar, Badge, Dropdown } from "@/components/ui";
import { useLayout } from "@/context/LayoutContext";
import { ROLE_OPTIONS } from "@/data/mock/layout";
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
  const {
    setMobileMenuOpen,
    currentUser,
    role,
    setRole,
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  } = useLayout();

  const [search, setSearch] = useState("");
  const [notiOpen, setNotiOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-[#EEF2F6] bg-white px-4 sm:px-6">
      {/* Left: Mobile Trigger + Clean Soft Search Box (matching minimal reference) */}
      <div className="flex flex-1 items-center gap-3">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="เปิดเมนูนำทาง"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F4F6FA] text-[#64748B] hover:text-[#1E293B] lg:hidden cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative hidden w-full max-w-sm sm:block">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาพนักงาน, หลักสูตร หรือรายงาน..."
            className="h-11 w-full rounded-xl bg-[#F4F6FA] pl-4 pr-10 text-sm text-[#1E293B] placeholder:text-[#94A3B8] transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
          />
          {search ? (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="ล้างคำค้นหา"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#1E293B] cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <Search className="pointer-events-none absolute right-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[#94A3B8]" />
          )}
        </div>
      </div>

      {/* Right: Clean Soft Controls + Profile */}
      <div className="flex shrink-0 items-center gap-3">
        {/* Notifications */}
        <Dropdown
          open={notiOpen}
          onOpenChange={setNotiOpen}
          panelClassName="w-[380px] max-w-[calc(100vw-2rem)]"
          trigger={
            <button
              type="button"
              aria-label="การแจ้งเตือน"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#F4F6FA] text-[#64748B] transition-colors hover:bg-[#EFF6FF] hover:text-[#2563EB] cursor-pointer"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[#2563EB] px-1 text-[10px] font-semibold text-white ring-2 ring-white">
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
                onClick={markAllAsRead}
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
                onClick={() => markAsRead(item.id)}
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

        {/* User Profile */}
        <Dropdown
          open={profileOpen}
          onOpenChange={setProfileOpen}
          panelClassName="w-80 max-w-[calc(100vw-2rem)]"
          trigger={
            <button
              type="button"
              className="flex items-center gap-3 rounded-xl px-2 py-1.5 text-left transition-colors hover:bg-[#F7F9FC] cursor-pointer"
            >
              <Avatar initials={currentUser.initials} size="md" online />
              <div className="hidden leading-tight sm:block">
                <p className="text-sm font-semibold text-[#1E293B]">{currentUser.name}</p>
                <p className="text-xs text-[#94A3B8]">{currentUser.roleLabel}</p>
              </div>
              <ChevronDown className="hidden h-4 w-4 text-[#94A3B8] sm:block" />
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
                    onClick={() => setRole(opt.key)}
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

          <div className="border-t border-[#F1F5F9] p-2">
            <button
              type="button"
              onClick={() => {
                setProfileOpen(false);
                router.push("/login");
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-[#DC2626] transition-colors hover:bg-red-50 cursor-pointer"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span>ออกจากระบบ</span>
            </button>
          </div>
        </Dropdown>
      </div>
    </header>
  );
}
