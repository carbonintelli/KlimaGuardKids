import type {
  ChildGuidance,
  ClimateSnapshot,
  DiseaseInsight,
  HealthInsight,
  NaturalMedicineInsight,
  NutritionInsight,
  RiskLevel,
  SynthesisReport,
} from "../types";
import { TRUSTED_SOURCES } from "../sources";
import { maxHealthRisk } from "./health-agent";

export function correlateInsights(
  climate: ClimateSnapshot,
  health: HealthInsight[],
  nutrition: NutritionInsight,
  disease: DiseaseInsight,
  naturalMedicine: NaturalMedicineInsight,
  indiaRegional?: import("../types").IndiaRegionalInsight,
  indiaImpact?: import("../types").IndiaImpactInsight
): string[] {
  const correlations: string[] = [];
  const maxTemp = Math.max(
    ...climate.forecastDays.slice(0, 5).map((d) => d.tempMaxC)
  );
  const rain = climate.forecastDays
    .slice(0, 5)
    .reduce((s, d) => s + d.precipitationMm, 0);

  if (maxTemp >= 35 && nutrition.hydrationLiters >= 2) {
    correlations.push(
      "Climate Agent + Nutrition Agent: Heat forecast correlates with increased hydration needs and appetite changes — coordinate school water breaks with meal timing."
    );
  }

  if (rain > 80 && disease.conditions.some((c) => c.includes("Diarrheal"))) {
    correlations.push(
      "Climate Agent + Disease Agent: Heavy precipitation aligns with waterborne disease risk — prioritize safe water over raw produce until floodwaters recede."
    );
  }

  if (
    (climate.airQualityIndex ?? 0) >= 100 &&
    health.some((h) => h.category === "respiratory")
  ) {
    correlations.push(
      "Climate Agent + Health Agent: Air quality and respiratory alerts overlap — indoor play and mask guidance should be synchronized for asthmatic children."
    );
  }

  if (
    climate.humidity > 70 &&
    disease.conditions.some((c) => c.includes("Dengue"))
  ) {
    correlations.push(
      "Climate Agent + Disease Agent: Humid conditions support vector breeding — community clean-up of standing water reduces both dengue and local flooding from blocked drains."
    );
  }

  if (
    disease.profiles.length > 0 &&
    naturalMedicine.remedies.some((r) => r.forCondition.includes("Diarrhea"))
  ) {
    correlations.push(
      "Disease Agent + Natural Medicine Agent: Waterborne risk detected — ORS and safe fluids from the natural-medicine agent should be prepared at home before symptoms start, under adult supervision."
    );
  }

  if (disease.transmissionSummary.length > 0 && disease.risk !== "low") {
    correlations.push(
      "Disease Agent + Synthesis Agent: Transmission pathways mapped to age-banded child guidance — younger children get picture-based prevention; teens get community action steps."
    );
  }

  if (indiaRegional && indiaImpact) {
    correlations.push(
      `India Regional Agent + Impact Agent: ${indiaRegional.regionName} (${indiaRegional.state}) — CHIS ${indiaImpact.compositeScore}/100 with ${indiaRegional.activeRegionalRisks.length} active regional drivers during ${indiaRegional.inMonsoonSeason ? "monsoon" : "non-monsoon"} season.`
    );

    const topDim = [...indiaImpact.dimensions].sort((a, b) => b.score - a.score)[0];
    if (topDim.score >= 50) {
      correlations.push(
        `India Impact Agent + Health Agent: Primary burden driver "${topDim.name}" (${topDim.score}/100) — ${topDim.childSpecificNote}`
      );
    }

    if (indiaRegional.inMonsoonSeason && disease.conditions.some((c) => c.includes("Diarrheal"))) {
      correlations.push(
        "India Regional Agent + Disease Agent: Monsoon season overlap with waterborne disease risk — activate ASHA/Anganwadi ORS pre-positioning per district disaster plan."
      );
    }
  }

  if (correlations.length === 0) {
    correlations.push(
      "Synthesis Agent: All agents report stable cross-signals. Maintain routine preparedness drills and monitor WHO local advisories."
    );
  }

  return correlations;
}

export function buildChildGuidance(
  overallRisk: RiskLevel,
  health: HealthInsight[],
  nutrition: NutritionInsight,
  disease: DiseaseInsight,
  naturalMedicine: NaturalMedicineInsight,
  climate: ClimateSnapshot,
  disruptionWindow: string
): ChildGuidance[] {
  const topHealth = [...health].sort(
    (a, b) => riskOrder(b.risk) - riskOrder(a.risk)
  )[0];
  const topProfile = disease.profiles[0];
  const climateStory = describeClimateForKids(climate, disruptionWindow);
  const germTips = buildGermTipsByAge(disease, "5-8");
  const germTips912 = buildGermTipsByAge(disease, "9-12");
  const germTips1317 = buildGermTipsByAge(disease, "13-17");
  const naturalYoung = naturalMedicine.remedies
    .slice(0, 2)
    .map((r) => `${r.remedy} — only with a grown-up (${r.adultSupervision.split(".")[0]})`);
  const naturalTeen = naturalMedicine.remedies
    .slice(0, 3)
    .map((r) => `${r.remedy}: ${r.howItHelps}`);

  return [
    {
      ageBand: "5-8",
      emoji: "🌈",
      headline:
        overallRisk === "low"
          ? "Skies look friendly this week!"
          : "Your weather helpers found something to prepare for",
      simpleExplanation: `Between ${disruptionWindow}, the weather may feel different than usual. ${climateStory.simple} Grown-ups and our helper agents are watching — you can be a preparedness superhero!`,
      howClimateAffectsYou: climateStory.forYoung,
      beatingTheDisruption: buildBeatingDisruption("5-8", climate, topHealth, disruptionWindow),
      stayHealthyFromGerms: germTips,
      naturalHelpFromHome: naturalYoung.length
        ? naturalYoung
        : ["Ask a grown-up about safe drinks when it is hot or when your tummy feels upset."],
      prepareToday: [
        "Pack your water bottle in your bag",
        "Learn where your family meets if school closes",
        "Draw a picture of your safe room at home",
        "Practice washing hands like you are making soap bubbles for 20 seconds",
      ],
      askAdultFor: [
        "Help filling your water bottle",
        "Explain the family emergency plan",
        nutrition.hydrationLiters > 2
          ? "Extra water breaks today"
          : "A healthy snack for energy",
        topProfile
          ? `Help you understand: ${topProfile.name}`
          : "Show you how germs spread from hands to mouth",
      ],
      funFact:
        "Children's bodies use water faster than adults when it's hot — that's why your water bottle is your superpower!",
    },
    {
      ageBand: "9-12",
      emoji: "🛡️",
      headline: "Climate readiness briefing",
      simpleExplanation: `Our agents see ${overallRisk} overall risk for ${disruptionWindow}. ${topHealth?.description ?? climateStory.simple} Here is how weather changes can affect you and what you can do.`,
      howClimateAffectsYou: climateStory.forMiddle,
      beatingTheDisruption: buildBeatingDisruption("9-12", climate, topHealth, disruptionWindow),
      stayHealthyFromGerms: germTips912,
      naturalHelpFromHome: naturalMedicine.remedies.slice(0, 3).map(
        (r) =>
          `${r.remedy} — ${r.howItHelps} (${r.cautions[0] ?? "ask an adult first"})`
      ),
      prepareToday: [
        "Check local weather alerts with a caregiver",
        "Review handwashing before meals and after toilet use",
        ...disease.precautionarySteps.slice(0, 2),
        ...(topHealth?.actions.slice(0, 2) ?? []),
      ],
      askAdultFor: [
        "Share school closure or heat-day policies",
        "Safe routes if flooding is possible",
        "Which foods and drinks are safest this week",
        "Where ORS or rehydration packets are kept at home",
      ],
    },
    {
      ageBand: "13-17",
      emoji: "🌍",
      headline: "Anticipatory action for your community",
      simpleExplanation: `Multi-agent synthesis shows ${overallRisk} risk during ${disruptionWindow}. ${nutrition.title}. Focus: ${topHealth?.title ?? "climate stability"}. You can help yourself, younger siblings, and neighbors understand what is happening and how to stay safe.`,
      howClimateAffectsYou: climateStory.forTeen,
      beatingTheDisruption: buildBeatingDisruption("13-17", climate, topHealth, disruptionWindow),
      stayHealthyFromGerms: germTips1317,
      naturalHelpFromHome: naturalTeen,
      prepareToday: [
        "Map cooling centers or safe spaces near you",
        "Help younger siblings hydrate and understand transmission basics",
        "Document local gaps (water, shade at bus stops) for community leaders",
        ...disease.transmissionSummary.slice(0, 1).map((t) => `Share with family: ${t}`),
      ],
      askAdultFor: [
        "Volunteer with local climate-health initiatives",
        "Verify vaccine and ORS availability at home",
        "Discuss mental health if extreme events cause anxiety",
        "Confirm which natural supports are approved by your clinic",
      ],
    },
  ];
}

function describeClimateForKids(
  climate: ClimateSnapshot,
  window: string
): { simple: string; forYoung: string; forMiddle: string; forTeen: string } {
  const maxTemp = Math.max(
    ...climate.forecastDays.slice(0, 5).map((d) => d.tempMaxC)
  );
  const rain = climate.forecastDays
    .slice(0, 5)
    .reduce((s, d) => s + d.precipitationMm, 0);
  const aqi = climate.airQualityIndex ?? 0;
  const parts: string[] = [];

  if (maxTemp >= 35) parts.push("extra hot days");
  if (rain > 60) parts.push("heavy rain or possible flooding");
  if (aqi >= 100) parts.push("hazy or smoky air");

  const summary =
    parts.length > 0
      ? `We expect ${parts.join(", ")} during ${window}.`
      : `Weather should stay fairly normal during ${window}.`;

  return {
    simple: summary,
    forYoung:
      parts.length > 0
        ? `When it is very hot or rainy, your body works harder. You might feel thirstier, tireder, or need to play indoors. That is normal — it means you should drink water, rest, and stay close to a caring adult.`
        : `The air and temperature should feel okay for playing outside with sunscreen and water. Still listen to adults if the sky changes suddenly.`,
    forMiddle: `${summary} Heat makes you lose water through sweat even if you do not feel sweaty. Rain can wash germs into water sources. Bad air makes lungs work harder — especially if you have asthma.`,
    forTeen: `${summary} Climate disruptions shift daily routines: heat stress affects concentration and sports; floods disrupt transport and safe water; poor AQI increases infection and asthma admissions. Anticipatory action (water, shade, clean hands, air-aware schedules) reduces harm before hospitals fill.`,
  };
}

function buildBeatingDisruption(
  ageBand: "5-8" | "9-12" | "13-17",
  climate: ClimateSnapshot,
  topHealth: HealthInsight | undefined,
  window: string
): string[] {
  const maxTemp = Math.max(
    ...climate.forecastDays.slice(0, 5).map((d) => d.tempMaxC)
  );
  const rain = climate.forecastDays
    .slice(0, 5)
    .reduce((s, d) => s + d.precipitationMm, 0);
  const aqi = climate.airQualityIndex ?? 0;
  const tips: string[] = [];

  if (ageBand === "5-8") {
    if (maxTemp >= 32)
      tips.push(
        "Play in the shade like a forest explorer — come inside when grown-ups say it is rest time",
        "Drink water like a little fish — small sips many times"
      );
    if (rain > 60)
      tips.push(
        "Stay away from puddles and fast water — they can hide germs and be deeper than they look",
        "Keep your favorite indoor game ready for rainy days"
      );
    if (aqi >= 100)
      tips.push("Play inside when the sky looks smoky — your lungs will thank you");
    tips.push(
      `Remember: weather changes during ${window} are temporary — your family plan helps you feel safe`
    );
  }

  if (ageBand === "9-12") {
    if (maxTemp >= 32)
      tips.push(
        "Schedule outdoor games before 10am or after 4pm on hot days",
        "Wear light colors and a hat; refill your bottle every hour at school"
      );
    if (rain > 60)
      tips.push(
        "Know your flood-safe route home and an adult's phone number by heart",
        "Help younger kids wash hands after touching wet shoes or flood areas"
      );
    if (aqi >= 100)
      tips.push(
        "Check AQI apps with a caregiver; move PE indoors when air is unhealthy"
      );
    tips.push(
      `Track the ${window} forecast daily — small preparations beat big surprises`
    );
    if (topHealth) tips.push(`Top health tip from agents: ${topHealth.actions[0]}`);
  }

  if (ageBand === "13-17") {
    if (maxTemp >= 32)
      tips.push(
        "Organize buddy checks for hydration at sports practice; watch friends for dizziness",
        "Advocate for shaded bus stops and water stations at school"
      );
    if (rain > 60)
      tips.push(
        "Share verified boil-water advisories in class group chats — stop rumors",
        "Volunteer to clear drains safely with community groups (with adult leads)"
      );
    if (aqi >= 100)
      tips.push(
        "Support indoor alternatives for outdoor clubs when AQI is high; carry masks if health authorities recommend"
      );
    tips.push(
      `During ${window}, combine climate data with health actions: you are old enough to translate alerts for younger siblings`,
      "Climate disruptions feel scary — talking to a trusted adult or counselor is a strength, not a weakness"
    );
  }

  return tips.slice(0, 5);
}

function buildGermTipsByAge(
  disease: DiseaseInsight,
  ageBand: "5-8" | "9-12" | "13-17"
): string[] {
  const spread = disease.transmissionSummary[0] ?? "Germs spread when we touch dirty surfaces then our face.";
  const precaution = disease.precautionarySteps[0] ?? "Wash hands with soap before eating.";

  if (ageBand === "5-8") {
    return [
      "Germs are tiny bugs you cannot see — they jump from hands to mouth when we forget to wash",
      spread.length > 80 ? spread.slice(0, 80) + "…" : spread,
      "Cough and sneeze into your elbow like a superhero cape",
      precaution,
      "If a friend is sick, wave hello instead of sharing snacks today",
    ];
  }

  if (ageBand === "9-12") {
    return [
      spread,
      disease.transmissionSummary[1] ?? "Vaccines train your body before germs attack.",
      ...disease.precautionarySteps.slice(0, 3),
      disease.profiles[0]
        ? `Watch for early signs of ${disease.profiles[0].name}: ${disease.profiles[0].earlySymptoms[0]}`
        : "Tell an adult if fever or diarrhea starts",
    ];
  }

  return [
    ...disease.transmissionSummary,
    ...disease.precautionarySteps.slice(0, 3),
    disease.profiles[0]
      ? `${disease.profiles[0].name} — see a clinician when: ${disease.profiles[0].whenToSeeDoctor}`
      : "Escalate to clinic when dehydration or breathing distress appears",
    "Teach younger children handwashing — you are a peer educator",
  ];
}

function riskOrder(r: RiskLevel): number {
  return { low: 0, moderate: 1, high: 2, critical: 3 }[r];
}

export function computeOverallRisk(
  ...risks: RiskLevel[]
): RiskLevel {
  const order: RiskLevel[] = ["low", "moderate", "high", "critical"];
  let max: RiskLevel = "low";
  for (const r of risks) {
    if (order.indexOf(r) > order.indexOf(max)) max = r;
  }
  return max;
}

export function inferDisruptionWindow(climate: ClimateSnapshot): string {
  const risky = climate.forecastDays.slice(0, 5).filter(
    (d) => d.tempMaxC >= 35 || d.precipitationMm >= 40
  );
  if (risky.length === 0) return "the next 5–7 days";
  const first = risky[0].date;
  const last = risky[risky.length - 1].date;
  return first === last ? first : `${first} to ${last}`;
}

export function assembleReport(
  location: SynthesisReport["location"],
  climate: ClimateSnapshot,
  health: HealthInsight[],
  nutrition: NutritionInsight,
  disease: DiseaseInsight,
  naturalMedicine: NaturalMedicineInsight,
  agents: SynthesisReport["agents"],
  india?: {
    indiaRegional?: SynthesisReport["indiaRegional"];
    indiaImpact?: SynthesisReport["indiaImpact"];
  }
): SynthesisReport {
  const healthRisk = maxHealthRisk(health);
  const indiaImpactRisk = india?.indiaImpact?.risk;
  const overallRisk = indiaImpactRisk
    ? computeOverallRisk(healthRisk, nutrition.risk, disease.risk, indiaImpactRisk)
    : computeOverallRisk(healthRisk, nutrition.risk, disease.risk);
  const disruptionWindow = inferDisruptionWindow(climate);
  const correlations = correlateInsights(
    climate,
    health,
    nutrition,
    disease,
    naturalMedicine,
    india?.indiaRegional,
    india?.indiaImpact
  );

  return {
    location,
    generatedAt: new Date().toISOString(),
    overallRisk,
    disruptionWindow,
    agents,
    climate,
    health,
    nutrition,
    disease,
    naturalMedicine,
    childGuidance: buildChildGuidance(
      overallRisk,
      health,
      nutrition,
      disease,
      naturalMedicine,
      climate,
      disruptionWindow
    ),
    correlations,
    dataProvenance: TRUSTED_SOURCES.map((s) => ({
      ...s,
      lastFetched: new Date().toISOString(),
    })),
    indiaRegional: india?.indiaRegional,
    indiaImpact: india?.indiaImpact,
  };
}
