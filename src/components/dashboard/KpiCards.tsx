import {
  Bell,
  Globe2,
  MapPinned,
  Users,
  type LucideIcon,
} from "lucide-react";

const TONE = {
  blue: {
    value: "text-sky-600",
    icon: "bg-sky-50 text-sky-600",
  },
  green: {
    value: "text-emerald-600",
    icon: "bg-emerald-50 text-emerald-600",
  },
  purple: {
    value: "text-violet-600",
    icon: "bg-violet-50 text-violet-600",
  },
  red: {
    value: "text-rose-600",
    icon: "bg-rose-50 text-rose-600",
  },
} as const;

const ICONS: LucideIcon[] = [Globe2, MapPinned, Users, Bell];

export function KpiCardGrid({
  items,
}: {
  items: {
    id: string;
    label: string;
    value: string;
    tone: keyof typeof TONE;
  }[];
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item, i) => {
        const tone = TONE[item.tone];
        const Icon = ICONS[i % ICONS.length];
        return (
          <article
            key={item.id}
            className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/80"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-ink/45">
                  {item.label}
                </p>
                <p
                  className={`mt-2 text-3xl font-extrabold tracking-tight ${tone.value}`}
                >
                  {item.value}
                </p>
              </div>
              <span
                className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${tone.icon}`}
              >
                <Icon className="h-5 w-5" aria-hidden />
              </span>
            </div>
          </article>
        );
      })}
    </div>
  );
}
