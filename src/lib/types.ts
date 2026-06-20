export type RiskLevel = "low" | "moderate" | "high" | "critical";

export type AgentId =
  | "climate"
  | "health"
  | "nutrition"
  | "disease"
  | "natural-medicine"
  | "india-regional"
  | "india-impact"
  | "synthesis";

export interface DataSource {
  id: string;
  name: string;
  url: string;
  authenticated: boolean;
  lastFetched?: string;
}

export interface AgentStatus {
  id: AgentId;
  name: string;
  role: string;
  status: "idle" | "fetching" | "analyzing" | "complete" | "error";
  source: DataSource;
  summary?: string;
}

export interface ClimateSnapshot {
  temperatureC: number;
  humidity: number;
  precipitationMm: number;
  windSpeedKmh: number;
  heatIndex?: number;
  airQualityIndex?: number;
  forecastDays: ForecastDay[];
}

export interface ForecastDay {
  date: string;
  tempMaxC: number;
  tempMinC: number;
  precipitationMm: number;
  weatherCode: number;
}

export interface HealthInsight {
  category: "heat" | "respiratory" | "vector" | "water" | "mental";
  risk: RiskLevel;
  title: string;
  description: string;
  actions: string[];
}

export interface NutritionInsight {
  risk: RiskLevel;
  title: string;
  description: string;
  foodSecurityNote: string;
  hydrationLiters: number;
  recommendedFoods: string[];
  avoid: string[];
}

export interface DiseaseProfile {
  name: string;
  howItSpreads: string[];
  earlySymptoms: string[];
  precautions: string[];
  whenToSeeDoctor: string;
}

export interface DiseaseInsight {
  risk: RiskLevel;
  conditions: string[];
  symptoms: string[];
  prevention: string[];
  profiles: DiseaseProfile[];
  transmissionSummary: string[];
  precautionarySteps: string[];
}

export interface NaturalRemedy {
  forCondition: string;
  remedy: string;
  howItHelps: string;
  adultSupervision: string;
  cautions: string[];
  evidenceNote: string;
}

export interface NaturalMedicineInsight {
  risk: RiskLevel;
  remedies: NaturalRemedy[];
  generalCautions: string[];
}

export interface ChildGuidance {
  headline: string;
  emoji: string;
  ageBand: "5-8" | "9-12" | "13-17";
  simpleExplanation: string;
  howClimateAffectsYou: string;
  beatingTheDisruption: string[];
  stayHealthyFromGerms: string[];
  naturalHelpFromHome: string[];
  prepareToday: string[];
  askAdultFor: string[];
  funFact?: string;
}

export interface IndiaRegion {
  id: string;
  name: string;
  state: string;
  city: string;
  lat: number;
  lon: number;
  climateZone:
    | "semi-arid"
    | "coastal-tropical"
    | "humid-subtropical"
    | "tropical-savanna"
    | "arid";
  childPopulationShare: number;
  primaryRisks: string[];
  monsoonMonths: number[];
}

export interface IndiaRegionalInsight {
  regionId: string;
  regionName: string;
  state: string;
  climateZone: IndiaRegion["climateZone"];
  risk: RiskLevel;
  childPopulationShare: number;
  inMonsoonSeason: boolean;
  zoneDescription: string;
  seasonalNotes: string[];
  activeRegionalRisks: string[];
  regionalActions: string[];
  contextSummary: string;
}

export interface ImpactDimension {
  id: string;
  name: string;
  score: number;
  unit: string;
  trend: "rising" | "stable" | "easing";
  methodology: string;
  childSpecificNote: string;
}

export interface IndiaImpactInsight {
  risk: RiskLevel;
  compositeScore: number;
  compositeLabel: string;
  dimensions: ImpactDimension[];
  projectedBurden: string[];
  measurementNotes: string[];
  recommendations: string[];
  comparedToNationalBaseline: string;
  healthAgentAlignment: string;
}

export interface SynthesisReport {
  location: { country: string; countryCode: string; city: string; lat: number; lon: number };
  generatedAt: string;
  overallRisk: RiskLevel;
  disruptionWindow: string;
  agents: AgentStatus[];
  climate: ClimateSnapshot;
  health: HealthInsight[];
  nutrition: NutritionInsight;
  disease: DiseaseInsight;
  naturalMedicine: NaturalMedicineInsight;
  childGuidance: ChildGuidance[];
  correlations: string[];
  dataProvenance: DataSource[];
  indiaRegional?: IndiaRegionalInsight;
  indiaImpact?: IndiaImpactInsight;
}

export interface CountryOption {
  code: string;
  name: string;
  flag: string;
}
