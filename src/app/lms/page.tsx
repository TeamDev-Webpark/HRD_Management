import { Suspense } from "react";
import { LmsWorkspace } from "@/components/lms/LmsWorkspace";

export default function LmsPage() {
  return (
    <Suspense fallback={null}>
      <LmsWorkspace />
    </Suspense>
  );
}
