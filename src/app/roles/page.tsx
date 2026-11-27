import { Suspense } from "react";
import { RbacWorkspace } from "@/components/rbac/RbacWorkspace";

export default function RolesPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-[#64748B]">กำลังโหลดระบบจัดการสิทธิ์และบทบาท...</div>}>
      <RbacWorkspace />
    </Suspense>
  );
}
