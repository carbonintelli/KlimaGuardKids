import Link from "next/link";
import { Shield, Sparkles, Globe2, Bot, MapPin, Gamepad2 } from "lucide-react";
import { Logo } from "@/components/Logo";
import { PoweredBySustainow } from "@/components/SustainowWordmark";
import { Abbr } from "@/components/Abbr";
import { CITY_COUNT, CITY_TIER_COUNTS, COUNTRIES } from "@/lib/countries";
import { INDIA_REGIONS } from "@/lib/india-regions";
import { TRUSTED_SOURCES } from "@/lib/sources";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <section className="text-center">
        <div className="mb-6 flex flex-col items-center gap-3">
          <Logo size={140} />
          <PoweredBySustainow logoHeight={16} />
        </div>
        <p className="inline-flex items-center gap-2 rounded-full bg-ocean/10 px-4 py-1 text-sm font-bold text-ocean">
          <Sparkles className="h-4 w-4" />
          Open Source · Agentic AI · India Regional Intelligence
        </p>
        <h1 className="mt-6 text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
          Help every child{" "}
          <span className="text-ocean">see climate coming</span> — and stay
          healthy
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-ink/70">
          KlimaGuard Kids connects trusted climate data with health, nutrition,
          and disease intelligence through eight cooperating AI agents — including
          dedicated India agents that measure child health impact across {INDIA_REGIONS.length}
          regional climate zones.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/play"
            className="rounded-full bg-leaf px-8 py-4 text-lg font-bold text-white shadow-lg hover:opacity-90 transition-opacity"
          >
            Kids play missions
          </Link>
          <Link
            href="/india"
            className="rounded-full bg-gradient-to-r from-saffron to-ocean px-8 py-4 text-lg font-bold text-white shadow-lg hover:opacity-90 transition-opacity"
          >
            India impact dashboard
          </Link>
          <Link
            href="/dashboard"
            className="rounded-full bg-ocean px-8 py-4 text-lg font-bold text-white shadow-lg hover:bg-sky-600 transition-colors"
          >
            Global dashboard
          </Link>
          <Link
            href="/pitch"
            className="rounded-full border-2 border-ocean px-8 py-4 text-lg font-bold text-ocean hover:bg-ocean/5 transition-colors"
          >
            Learn how it works
          </Link>
        </div>
      </section>

      <section className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Feature
          icon={Bot}
          title="8 AI agents"
          text="Climate, health, nutrition, disease, natural medicine, India regional, India impact, and synthesis."
        />
        <Feature
          icon={MapPin}
          title={`${INDIA_REGIONS.length} India regions`}
          text={
            <>
              Tier 1–3 metros to district centres —{" "}
              <Abbr of="CHIS" showExpansion /> measures heat, air, waterborne,
              vector, and nutrition burden for children.
            </>
          }        />
        <Feature
          icon={Globe2}
          title="Global coverage"
          text={`Demo registry covers ${COUNTRIES.length} countries and ${CITY_COUNT} Tier 1–3 cities (${CITY_TIER_COUNTS[1]} / ${CITY_TIER_COUNTS[2]} / ${CITY_TIER_COUNTS[3]}), grounded by ${TRUSTED_SOURCES.length} validated sources.`}
        />
        <Feature
          icon={Gamepad2}
          title="Age-based play"
          text="Ages 5–8 earn stars, 9–12 earn points, and teens earn Impact XP — with badges and climate-powered missions."
        />
        <Feature
          icon={Shield}
          title="Open source"
          text="MIT licensed with transparent measurement formulas. Contribute regions, agents, and data sources."
        />
      </section>

      <section className="mt-20 rounded-3xl bg-white/80 border border-sky-100 p-8 shadow-lg">
        <h2 className="text-2xl font-extrabold text-ink text-center">
          How agentic AI works here
        </h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-4 text-center text-sm">
          {[
            ["1", "Climate Agent", "Open-Meteo live feed"],
            ["2", "Health + Disease", "Risk mapping & profiles"],
            ["3", "India Agents", "Regional context + Child Health Impact Score"],
            ["4", "Synthesis", "Child guidance by age"],
          ].map(([step, name, desc]) => (
            <li key={step} className="rounded-2xl bg-sky-50 p-4">
              <span className="text-2xl font-extrabold text-ocean">{step}</span>
              <p className="mt-2 font-bold text-ink">{name}</p>
              <p className="mt-1 text-ink/60">{desc}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16 rounded-3xl bg-gradient-to-r from-saffron/90 to-ocean p-8 text-white text-center">
        <h2 className="text-xl font-extrabold">
          Measuring child health impact from climate change in India
        </h2>
        <p className="mt-3 max-w-2xl mx-auto text-white/90 text-sm">
          The India Child Health Impact Agent computes a transparent{" "}
          <Abbr of="CHIS" showExpansion /> (0–100) across five dimensions —
          helping communities, schools, and health workers anticipate and act
          before hospitals fill.
        </p>
        <Link
          href="/india"
          className="mt-6 inline-block rounded-full bg-white px-6 py-3 font-bold text-ocean hover:bg-sky-50"
        >
          Explore India dashboard
        </Link>
      </section>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
      <Icon className="h-8 w-8 text-ocean" />
      <h3 className="mt-4 font-extrabold text-ink">{title}</h3>
      <p className="mt-2 text-sm text-ink/70">{text}</p>
    </div>
  );
}
