import Link from "next/link";
import {
  Target,
  Users,
  Cpu,
  HeartHandshake,
  TrendingUp,
  Lock,
} from "lucide-react";

export default function PitchPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <p className="text-sm font-bold text-ocean uppercase tracking-widest">
        Climate × Children&apos;s Health
      </p>
      <h1 className="mt-2 text-4xl font-extrabold text-ink leading-tight">
        KlimaGuard Kids
      </h1>
      <p className="mt-2 text-xl text-ink/70 font-semibold">
        Agentic early-warning intelligence that helps every child prepare for
        climate disruptions to health, food, and wellbeing.
      </p>

      <div className="mt-8 rounded-3xl bg-ocean/10 border border-ocean/20 p-6">
        <p className="text-sm font-bold text-ocean">Mission</p>
        <p className="mt-2 text-lg font-semibold text-ink">
          Open Source · Global · Child-centred climate health preparedness
        </p>
      </div>

      <Section icon={Target} title="Problem">
        <p>
          Climate change is not a future threat for children — it is reshaping
          health today. Heatwaves, floods, air pollution, vector-borne disease,
          and food insecurity compound fastest in low- and middle-income
          countries. Yet most climate tools speak to policymakers, not to the
          2.4 billion children who need anticipatory, age-appropriate guidance
          their families and schools can act on within days, not seasons.
        </p>
      </Section>

      <Section icon={Cpu} title="Solution — Agentic AI platform">
        <p>
          KlimaGuard Kids deploys nine cooperating AI agents that ingest
          authenticated public feeds (Open-Meteo weather & air quality, aligned
          with WHO safeguarding principles), correlate signals across health,
          nutrition, and disease domains, and output inference-ready briefings
          plus child-facing preparedness cards for ages 5–17.
        </p>
        <ul className="mt-4 list-disc pl-6 space-y-2 text-ink/80">
          <li>
            <strong>Climate Data Agent</strong> — live 7-day forecast, heat
            index, AQI
          </li>
          <li>
            <strong>Health Risk Agent</strong> — heat stress, respiratory, flood,
            vector alerts
          </li>
          <li>
            <strong>Nutrition Agent</strong> — hydration targets, food safety,
            scarcity patterns
          </li>
          <li>
            <strong>Disease Agent</strong> — transmission pathways, precautions,
            and illness profiles
          </li>
          <li>
            <strong>Natural Medicine Agent</strong> — evidence-tagged supportive
            remedies under caregiver supervision
          </li>
          <li>
            <strong>Synthesis Agent</strong> — orchestrated cross-correlation +
            age-banded climate & health guidance
          </li>
          <li>
            <strong>India Regional Context Agent</strong> — monsoon cycles and
            zone-specific child vulnerability across 12 regions
          </li>
          <li>
            <strong>India Child Health Impact Agent</strong> — CHIS score (0–100)
            across five transparent dimensions
          </li>
          <li>
            <strong>Kids Health Chat Agent</strong> — age-banded Q&A with
            privacy safeguards and consultant scheduling
          </li>
        </ul>
      </Section>

      <Section icon={Users} title="Who we serve">
        <p>
          Children, caregivers, teachers, community health workers, and local
          authorities worldwide — starting with 20 demo cities and extensible to
          any coordinates via API. Languages and offline modes are on the
          roadmap; architecture is Open Source (MIT) for local adaptation.
        </p>
      </Section>

      <Section icon={HeartHandshake} title="Impact & SDG alignment">
        <ul className="list-disc pl-6 space-y-2 text-ink/80">
          <li>SDG 3 — Good health: anticipatory action for climate-sensitive risks</li>
          <li>SDG 13 — Climate action: child-centred early warning</li>
          <li>SDG 2 — Zero hunger: nutrition & food security inference</li>
          <li>SDG 4 — Quality education: school-ready heat/flood guidance</li>
        </ul>
      </Section>

      <Section icon={TrendingUp} title="Traction & prototype">
        <p>
          Functional web prototype with live Open-Meteo integration, nine-agent
          orchestration API, India CHIS dashboard, kids health chat, global
          country selector, and product overview. Ready for field pilots with
          ministries of health and education partners.
        </p>
      </Section>

      <Section icon={Lock} title="Safeguarding & data ethics">
        <p>
          No child accounts required for demo. Location is country/city level
          only. Agents cite provenance. Future work: COPPA/GDPR-K compliance,
          local language models hosted in-region, and partnership with national
          meteorological services for authenticated enterprise feeds.
        </p>
      </Section>

      <section className="mt-12 text-center">
        <Link
          href="/dashboard"
          className="inline-block rounded-full bg-ocean px-8 py-4 font-extrabold text-white shadow-lg hover:bg-sky-600"
        >
          Try the live demo
        </Link>
      </section>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="flex items-center gap-2 text-xl font-extrabold text-ink">
        <Icon className="h-6 w-6 text-ocean" />
        {title}
      </h2>
      <div className="mt-4 text-ink/80 leading-relaxed">{children}</div>
    </section>
  );
}
