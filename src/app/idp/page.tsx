import { Suspense } from "react";
import { IdpWorkspace } from "@/components/idp/IdpWorkspace";

export default function IdpPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-[#64748B]">กำลังโหลดข้อมูลแผนพัฒนา IDP...</div>}>
      <IdpWorkspace />
    </Suspense>
  );
}
