import Link from "next/link";
import { Shield, Lock, Baby, FileWarning } from "lucide-react";

export const metadata = {
  title: "Privacy & child safeguarding — KlimaGuard Kids",
  description:
    "How KlimaGuard Kids handles location data, child safeguarding, and non-diagnostic guidance.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="inline-flex items-center gap-2 rounded-full bg-ocean/10 px-3 py-1 text-sm font-bold text-ocean">
        <Shield className="h-4 w-4" />
        Privacy & safeguarding
      </p>
      <h1 className="mt-4 text-3xl font-extrabold text-ink">
        Privacy, data use, and child safeguarding
      </h1>
      <p className="mt-4 text-ink/70 leading-relaxed">
        KlimaGuard Kids is a community preparedness tool from Sustainow Technologies.
        It is <strong>not</strong> a medical diagnostic or telemedicine service. Always
        consult qualified healthcare providers for clinical decisions.
      </p>

      <section className="mt-10 space-y-6">
        <Article
          icon={<Lock className="h-5 w-5 text-ocean" />}
          title="What we process"
        >
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Country, city, or India region selection (and optional lat/lon) to fetch
              weather and air-quality context.
            </li>
            <li>
              Live climate fields from Open-Meteo (temperature, humidity, precipitation,
              wind, optional AQI).
            </li>
            <li>
              Derived risk scores and age-banded guidance generated on the server for
              each analysis request.
            </li>
          </ul>
        </Article>

        <Article
          icon={<Baby className="h-5 w-5 text-leaf" />}
          title="Children and accounts"
        >
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>No child accounts</strong> are required for the demo. Kids play
              progress (XP, badges, streaks) stays in the browser{" "}
              <code className="rounded bg-sky-50 px-1">localStorage</code> only.
            </li>
            <li>
              We do not intentionally collect names, phone numbers, school IDs, or
              personal health records in the core flow.
            </li>
            <li>
              Location is city/region level for preparedness briefings — not precise
              home tracking of a child.
            </li>
            <li>
              Supervising adults should stay with younger children when using play
              missions or reviewing guidance.
            </li>
          </ul>
        </Article>

        <Article
          icon={<FileWarning className="h-5 w-5 text-saffron" />}
          title="Safeguarding principles"
        >
          <ul className="list-disc pl-5 space-y-2">
            <li>Outputs are educational / anticipatory — not diagnosis or treatment.</li>
            <li>
              Natural-medicine suggestions are supportive only and require caregiver
              oversight.
            </li>
            <li>
              Future account, messaging, or SMS features will require a privacy impact
              assessment and compliance with applicable child-data laws (e.g. COPPA /
              GDPR-K / national rules) before enablement.
            </li>
            <li>
              Security reports: see{" "}
              <Link href="https://github.com/carbonintelli/KlimaGuardKids/blob/main/SECURITY.md" className="text-ocean font-semibold hover:underline">
                SECURITY.md
              </Link>{" "}
              in the repository.
            </li>
          </ul>
        </Article>
      </section>

      <p className="mt-10 text-sm text-ink/60">
        Contact:{" "}
        <a href="mailto:contact@sustainow.in" className="text-ocean hover:underline">
          contact@sustainow.in
        </a>
        {" · "}
        <Link href="/impact" className="text-ocean hover:underline">
          Public impact KPIs
        </Link>
        {" · "}
        <Link href="/" className="text-ocean hover:underline">
          Home
        </Link>
      </p>
    </div>
  );
}

function Article({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-sky-100 bg-white/80 p-6 shadow-sm">
      <h2 className="flex items-center gap-2 text-xl font-extrabold text-ink">
        {icon}
        {title}
      </h2>
      <div className="mt-3 text-ink/75 leading-relaxed">{children}</div>
    </div>
  );
}
