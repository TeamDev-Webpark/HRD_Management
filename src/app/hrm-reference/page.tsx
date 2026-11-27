import { Suspense } from "react";
import { HrmReferenceWorkspace } from "@/components/hrm/HrmReferenceWorkspace";

export default function HrmReferencePage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-[#64748B]">กำลังโหลดข้อมูลอ้างอิงจาก HRM...</div>}>
      <HrmReferenceWorkspace />
    </Suspense>
  );
}
