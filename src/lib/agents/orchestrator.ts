import type { AgentStatus, SynthesisReport } from "../types";
import { TRUSTED_SOURCES } from "../sources";
import { fetchClimateData } from "./climate-agent";
import { analyzeHealthRisks } from "./health-agent";
import { analyzeNutrition } from "./nutrition-agent";
import { analyzeDiseaseRisks } from "./disease-agent";
import { analyzeNaturalMedicine } from "./natural-medicine-agent";
import { assembleReport } from "./synthesis-agent";

function sourceFor(id: string) {
  return TRUSTED_SOURCES.find((s) => s.id === id) ?? TRUSTED_SOURCES[0];
}

export async function runAgentPipeline(params: {
  country: string;
  countryCode: string;
  city: string;
  lat: number;
  lon: number;
}): Promise<SynthesisReport> {
  const agents: AgentStatus[] = [
    {
      id: "climate",
      name: "Climate Data Agent",
      role: "Fetches authenticated Open-Meteo weather & air quality feeds",
      status: "fetching",
      source: sourceFor("open-meteo"),
    },
    {
      id: "health",
      name: "Health Risk Agent",
      role: "Maps climate signals to child health stressors (WHO-aligned)",
      status: "idle",
      source: sourceFor("who-guidance"),
    },
    {
      id: "nutrition",
      name: "Nutrition & Food Security Agent",
      role: "Infers hydration, food safety, and scarcity patterns",
      status: "idle",
      source: sourceFor("unicef-climate"),
    },
    {
      id: "disease",
      name: "Disease Outlook Agent",
      role: "Transmission pathways, precautions, and illness profiles",
      status: "idle",
      source: sourceFor("who-guidance"),
    },
    {
      id: "natural-medicine",
      name: "Natural Medicine Agent",
      role: "Evidence-tagged supportive remedies under caregiver supervision",
      status: "idle",
      source: sourceFor("who-traditional-medicine"),
    },
    {
      id: "synthesis",
      name: "Synthesis & Guidance Agent",
      role: "Orchestrates cross-agent correlation and age-banded child guidance",
      status: "idle",
      source: sourceFor("unicef-climate"),
    },
  ];

  let climate;
  try {
    climate = await fetchClimateData(params.lat, params.lon);
    agents[0].status = "complete";
    agents[0].summary = `Live feed: ${climate.temperatureC}°C, ${climate.forecastDays.length}-day forecast`;
  } catch (e) {
    agents[0].status = "error";
    agents[0].summary = e instanceof Error ? e.message : "Climate fetch failed";
    throw e;
  }

  agents[1].status = "analyzing";
  agents[2].status = "analyzing";
  agents[3].status = "analyzing";

  const [health, nutrition, disease] = await Promise.all([
    Promise.resolve(analyzeHealthRisks(climate)),
    Promise.resolve(analyzeNutrition(climate)),
    Promise.resolve(analyzeDiseaseRisks(climate)),
  ]);

  agents[1].status = "complete";
  agents[1].summary = `${health.length} health signal(s) identified`;
  agents[2].status = "complete";
  agents[2].summary = nutrition.title;
  agents[3].status = "complete";
  agents[3].summary = `${disease.profiles.length} disease profile(s), ${disease.transmissionSummary.length} transmission note(s)`;

  agents[4].status = "analyzing";
  const naturalMedicine = analyzeNaturalMedicine(disease);
  agents[4].status = "complete";
  agents[4].summary = `${naturalMedicine.remedies.length} supportive remedy(ies) matched to conditions`;

  agents[5].status = "analyzing";
  const report = assembleReport(
    {
      country: params.country,
      countryCode: params.countryCode,
      city: params.city,
      lat: params.lat,
      lon: params.lon,
    },
    climate,
    health,
    nutrition,
    disease,
    naturalMedicine,
    agents
  );

  const finalAgents = agents.map((a) =>
    a.id === "synthesis"
      ? {
          ...a,
          status: "complete" as const,
          summary: `${report.correlations.length} cross-agent correlation(s); ${report.childGuidance.length} age bands`,
        }
      : a
  );

  return { ...report, agents: finalAgents };
}
