import type { RiskLevel } from "@/lib/types";
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  MinusCircle,
} from "lucide-react";

const config: Record<
  RiskLevel,
  {
    styles: string;
    label: string;
    Icon: typeof CheckCircle2;
  }
> = {
  low: {
    styles: "bg-leaf/20 text-green-800 border-green-300",
    label: "Low risk",
    Icon: CheckCircle2,
  },
  moderate: {
    styles: "bg-sun/30 text-amber-900 border-amber-300",
    label: "Moderate risk",
    Icon: MinusCircle,
  },
  high: {
    styles: "bg-coral/20 text-rose-900 border-rose-300",
    label: "High risk",
    Icon: AlertTriangle,
  },
  critical: {
    styles: "bg-red-600 text-white border-red-700",
    label: "Critical risk",
    Icon: AlertOctagon,
  },
};

export function RiskBadge({ level, label }: { level: RiskLevel; label?: string }) {
  const { styles, label: defaultLabel, Icon } = config[level];
  const text = label ?? defaultLabel;

  return (
    <span
      role="status"
      aria-label={`Risk level: ${text}`}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-xs font-bold uppercase tracking-wide ${styles}`}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{text}</span>
    </span>
  );
}
