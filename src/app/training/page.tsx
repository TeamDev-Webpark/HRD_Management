import { Suspense } from "react";
import { TrainingWorkspace } from "@/components/training/TrainingWorkspace";

export default function TrainingPage() {
  return (
    <Suspense fallback={null}>
      <TrainingWorkspace />
    </Suspense>
  );
}
