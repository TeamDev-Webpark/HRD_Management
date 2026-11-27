import { Suspense } from "react";
import { MssWorkspace } from "@/components/mss/MssWorkspace";

export default function MssPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-[#64748B]">กำลังโหลดบริการตนเองหัวหน้างาน...</div>}>
      <MssWorkspace />
    </Suspense>
  );
}
