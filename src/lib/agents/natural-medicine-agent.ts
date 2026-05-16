import type {
  DiseaseInsight,
  NaturalMedicineInsight,
  NaturalRemedy,
  RiskLevel,
} from "../types";

/** Evidence-informed supportive remedies — always caregiver-supervised for children */
export function analyzeNaturalMedicine(
  disease: DiseaseInsight
): NaturalMedicineInsight {
  const remedies: NaturalRemedy[] = [];
  const conditionText = disease.conditions.join(" ").toLowerCase();

  if (
    conditionText.includes("diarrheal") ||
    conditionText.includes("dehydration")
  ) {
    remedies.push(ORS_REMEDY, RICE_WATER_REMEDY, GINGER_REMEDY);
  }

  if (conditionText.includes("heat") || conditionText.includes("dehydration")) {
    remedies.push(COCONUT_WATER_REMEDY, ORS_REMEDY);
  }

  if (
    conditionText.includes("dengue") ||
    conditionText.includes("malaria") ||
    conditionText.includes("chikungunya")
  ) {
    remedies.push(PAPAYA_LEAF_CAUTION, TULSI_TEA_REMEDY, HYDRATION_HERBS);
  }

  if (
    conditionText.includes("respiratory") ||
    conditionText.includes("asthma")
  ) {
    remedies.push(HONEY_REMEDY, STEAM_INHALATION_REMEDY, TULSI_TEA_REMEDY);
  }

  if (conditionText.includes("routine") || remedies.length === 0) {
    remedies.push(HONEY_REMEDY, TULSI_TEA_REMEDY);
  }

  const unique = dedupeRemedies(remedies);
  const risk = mapDiseaseRiskToRemedyRisk(disease.risk, unique.length);

  return {
    risk,
    remedies: unique.slice(0, 6),
    generalCautions: [
      "Natural supports do not replace vaccines, antibiotics, or hospital care when a doctor advises.",
      "Never give honey to infants under 12 months — risk of infant botulism.",
      "Check allergies (nuts, plants, dairy) before any home preparation.",
      "Use only clean utensils and boiled or safe water for all drinks and washes.",
      "Doses for children must be set by a parent, nurse, or doctor — not guessed from adult recipes.",
    ],
  };
}

const ORS_REMEDY: NaturalRemedy = {
  forCondition: "Diarrhea & dehydration",
  remedy: "Oral rehydration solution (ORS) — WHO formula or pharmacy packets",
  howItHelps:
    "Replaces water and salts lost in diarrhea; helps the body absorb fluids faster than plain water alone.",
  adultSupervision:
    "An adult prepares ORS with exact packet-to-water ratio and offers small frequent sips with a clean cup or spoon.",
  cautions: [
    "Do not add extra sugar or salt to homemade mixes unless trained — wrong ratios can be harmful.",
    "If vomiting continues, seek clinic care for IV fluids.",
  ],
  evidenceNote: "WHO-recommended first-line treatment for child diarrhea worldwide.",
};

const RICE_WATER_REMEDY: NaturalRemedy = {
  forCondition: "Mild diarrhea",
  remedy: "Rice water (strained water from well-cooked rice)",
  howItHelps:
    "Gentle on the stomach; provides some energy and fluid while the gut recovers alongside ORS.",
  adultSupervision:
    "Adult cooks rice in extra clean water, cools the strained liquid, and gives small amounts between ORS sips.",
  cautions: ["Not a full replacement for ORS in moderate or severe diarrhea."],
  evidenceNote: "Traditional supportive fluid used in many regions; combine with ORS when diarrhea is frequent.",
};

const GINGER_REMEDY: NaturalRemedy = {
  forCondition: "Nausea with stomach upset",
  remedy: "Weak ginger tea (small amount of fresh ginger in hot water, cooled)",
  howItHelps: "May ease nausea; encourages sipping fluids when a child feels queasy.",
  adultSupervision:
    "Adult prepares a mild tea; offer only a few spoonfuls for young children and avoid if the child dislikes the taste.",
  cautions: [
    "Avoid large amounts in very young children.",
    "Not for high fever without medical advice.",
  ],
  evidenceNote: "Some studies support ginger for nausea; use as comfort care alongside medical guidance.",
};

const COCONUT_WATER_REMEDY: NaturalRemedy = {
  forCondition: "Heat & mild dehydration",
  remedy: "Fresh coconut water (from a clean, unopened coconut)",
  howItHelps: "Provides fluids and potassium; can supplement water intake during heat.",
  adultSupervision: "Adult ensures the source is hygienic and offers alongside plain water, not instead of ORS when ill.",
  cautions: ["Not sterile enough alone for severe dehydration — use ORS when diarrhea is present."],
  evidenceNote: "Widely used rehydration support in tropical climates; WHO still prioritizes ORS for diarrhea.",
};

const TULSI_TEA_REMEDY: NaturalRemedy = {
  forCondition: "Mild cough & cold comfort",
  remedy: "Holy basil (tulsi) leaf tea — mild, cooled",
  howItHelps: "Traditional remedy for soothing throat irritation and encouraging warm fluid intake.",
  adultSupervision: "Adult brews a weak tea; children sip small amounts while supervised.",
  cautions: ["Avoid if allergic to mint family plants.", "Not for wheezing or asthma attacks — use inhalers as prescribed."],
  evidenceNote: "Used in South Asian home care; limited pediatric trials — comfort care only.",
};

const HONEY_REMEDY: NaturalRemedy = {
  forCondition: "Night cough (children 1 year and older)",
  remedy: "Half teaspoon to 1 teaspoon honey before sleep",
  howItHelps: "Coats the throat and may reduce cough frequency better than some over-the-counter syrups in studies.",
  adultSupervision: "Only for children 12 months and older; adult measures the dose.",
  cautions: ["Never for infants under 12 months.", "Not for diabetic children without doctor advice."],
  evidenceNote: "Supported in pediatric cough guidelines for children over 1 year.",
};

const STEAM_INHALATION_REMEDY: NaturalRemedy = {
  forCondition: "Stuffy nose & congestion",
  remedy: "Warm steam inhalation (adult-supervised) or saline nasal drops",
  howItHelps: "Moist air loosens mucus; saline drops clear nasal passages for easier breathing and sleep.",
  adultSupervision:
    "Adult runs a hot shower steam session or uses pharmacy saline drops — never leave a child alone with hot water bowls.",
  cautions: ["Burn risk from boiling water bowls — use safe methods only."],
  evidenceNote: "Saline drops are standard care; steam is supportive with supervision.",
};

const PAPAYA_LEAF_CAUTION: NaturalRemedy = {
  forCondition: "Dengue fever (supportive only)",
  remedy: "Papaya leaf juice — only if local clinicians approve",
  howItHelps:
    "Some communities use it during dengue; platelet support claims are not proven for all children.",
  adultSupervision:
    "Never start without talking to a doctor or nurse — dengue needs blood tests and hospital care if severe.",
  cautions: [
    "Can interact with other medicines.",
    "Severe dengue requires hospital monitoring, not home juice alone.",
  ],
  evidenceNote: "Mixed clinical evidence; WHO emphasizes medical monitoring for dengue.",
};

const HYDRATION_HERBS: NaturalRemedy = {
  forCondition: "Fever recovery",
  remedy: "Plain water, ORS, and light soups (mung dal, chicken broth as culturally appropriate)",
  howItHelps: "Fever uses extra body water; gentle fluids support recovery alongside prescribed medicines.",
  adultSupervision: "Adult tracks urine color and wet diapers; increases fluids when fever is high.",
  cautions: ["Avoid sugary sodas and energy drinks during fever."],
  evidenceNote: "Fluid support is standard WHO fever and infection care for children.",
};

function dedupeRemedies(remedies: NaturalRemedy[]): NaturalRemedy[] {
  const seen = new Set<string>();
  return remedies.filter((r) => {
    if (seen.has(r.remedy)) return false;
    seen.add(r.remedy);
    return true;
  });
}

function mapDiseaseRiskToRemedyRisk(
  diseaseRisk: RiskLevel,
  count: number
): RiskLevel {
  if (diseaseRisk === "critical" || diseaseRisk === "high") return "moderate";
  if (count >= 4) return "moderate";
  return diseaseRisk === "low" ? "low" : "moderate";
}
