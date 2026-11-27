import { Suspense } from "react";
import { TalentWorkspace } from "@/components/talent/TalentWorkspace";

export default function TalentPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-[#64748B]">กำลังโหลดข้อมูล Talent Management...</div>}>
      <TalentWorkspace />
    </Suspense>
  );
}
