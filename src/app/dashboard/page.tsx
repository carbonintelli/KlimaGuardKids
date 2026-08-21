import { Suspense } from "react";
import DashboardClient from "./DashboardClient";

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-10 text-ink/70">
          Loading dashboard…
        </div>
      }
    >
      <DashboardClient />
    </Suspense>
  );
}
