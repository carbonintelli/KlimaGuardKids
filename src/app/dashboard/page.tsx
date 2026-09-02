import { Suspense } from "react";
import DashboardConsole from "./DashboardConsole";

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#eef2f7] text-ink/70">
          Loading dashboard…
        </div>
      }
    >
      <DashboardConsole />
    </Suspense>
  );
}
