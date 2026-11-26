"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { DEMO_USERS, INITIAL_NOTIFICATIONS } from "@/data/mock/layout";
import type { DemoUser, NotificationItem, RoleKey } from "@/types/hrd";

interface LayoutContextValue {
  sidebarCollapsed: boolean;
  toggleSidebarCollapsed: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  role: RoleKey;
  setRole: (role: RoleKey) => void;
  currentUser: DemoUser;
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const LayoutContext = createContext<LayoutContextValue | null>(null);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [role, setRole] = useState<RoleKey>("admin");
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const value = useMemo<LayoutContextValue>(() => {
    const unreadCount = notifications.filter((item) => !item.read).length;

    return {
      sidebarCollapsed,
      toggleSidebarCollapsed: () => setSidebarCollapsed((prev) => !prev),
      mobileMenuOpen,
      setMobileMenuOpen,
      role,
      setRole,
      currentUser: DEMO_USERS[role],
      notifications,
      unreadCount,
      markAsRead: (id: string) =>
        setNotifications((prev) =>
          prev.map((item) => (item.id === id ? { ...item, read: true } : item))
        ),
      markAllAsRead: () =>
        setNotifications((prev) => prev.map((item) => ({ ...item, read: true }))),
    };
  }, [sidebarCollapsed, mobileMenuOpen, role, notifications]);

  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
}

export function useLayout() {
  const ctx = useContext(LayoutContext);
  if (!ctx) {
    throw new Error("useLayout must be used within LayoutProvider");
  }
  return ctx;
}
