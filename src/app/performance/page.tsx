import { Suspense } from "react";
import { PerformanceWorkspace } from "@/components/performance/PerformanceWorkspace";

export default function PerformancePage() {
  return (
    <Suspense fallback={null}>
      <PerformanceWorkspace />
    </Suspense>
  );
}
