import { Suspense } from "react";
import { ReportsWorkspace } from "@/components/reports/ReportsWorkspace";

export default function ReportsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-[#64748B]">กำลังโหลดรายงาน HRD...</div>}>
      <ReportsWorkspace />
    </Suspense>
  );
}
