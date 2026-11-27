import { Suspense } from "react";
import { CompetencyWorkspace } from "@/components/competency/CompetencyWorkspace";

export default function CompetencyPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-[#64748B]">กำลังโหลดข้อมูลสมรรถนะ...</div>}>
      <CompetencyWorkspace />
    </Suspense>
  );
}
