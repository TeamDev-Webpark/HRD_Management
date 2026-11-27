import { Suspense } from "react";
import { EssWorkspace } from "@/components/ess/EssWorkspace";

export default function EssPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-[#64748B]">กำลังโหลดบริการตนเองพนักงาน...</div>}>
      <EssWorkspace />
    </Suspense>
  );
}
