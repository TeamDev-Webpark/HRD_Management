import { Suspense } from "react";
import { CareerWorkspace } from "@/components/career/CareerWorkspace";

export default function CareerPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-[#64748B]">กำลังโหลดข้อมูลเส้นทางสายอาชีพ...</div>}>
      <CareerWorkspace />
    </Suspense>
  );
}
