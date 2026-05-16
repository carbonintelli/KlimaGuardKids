import type {
  ClimateSnapshot,
  DiseaseInsight,
  DiseaseProfile,
  RiskLevel,
} from "../types";

export function analyzeDiseaseRisks(climate: ClimateSnapshot): DiseaseInsight {
  const maxTemp = Math.max(
    ...climate.forecastDays.slice(0, 5).map((d) => d.tempMaxC)
  );
  const totalRain = climate.forecastDays
    .slice(0, 5)
    .reduce((s, d) => s + d.precipitationMm, 0);
  const humid = climate.humidity > 65;
  const profiles: DiseaseProfile[] = [];
  const conditions: string[] = [];
  const symptoms: string[] = [];
  const prevention: string[] = [];
  const transmissionSummary: string[] = [];
  const precautionarySteps: string[] = [];
  let risk: RiskLevel = "low";

  if (maxTemp >= 38) {
    profiles.push(HEAT_PROFILE);
    conditions.push("Heat exhaustion", "Dehydration");
    symptoms.push("High fever", "Dry mouth", "Confusion or fainting");
    prevention.push(
      "Never leave children in closed vehicles",
      "Schedule outdoor play for cooler hours"
    );
    transmissionSummary.push(
      "Heat illness is not contagious — it spreads when bodies cannot cool fast enough in hot, humid air."
    );
    precautionarySteps.push(
      "Offer small sips of clean water every 15–20 minutes during play",
      "Move play to morning or evening when the sun is weaker"
    );
    risk = "high";
  }

  if (totalRain > 80) {
    profiles.push(DIARRHEAL_PROFILE, LEPTOSPIROSIS_PROFILE);
    conditions.push(
      "Diarrheal disease (contaminated water)",
      "Leptospirosis (floodwater exposure)",
      "Skin infections"
    );
    symptoms.push("Stomach pain", "Diarrhea", "Skin rashes after water contact");
    prevention.push(
      "Handwashing with soap after touching floodwater",
      "Vaccinate per national schedule (cholera where offered)"
    );
    transmissionSummary.push(
      "Germs in dirty floodwater can enter the mouth from unwashed hands, unsafe drinking water, or unwashed food.",
      "Leptospirosis spreads when floodwater carrying animal urine touches cuts on skin or eyes."
    );
    precautionarySteps.push(
      "Boil or treat drinking water; use bottled water if taps are unsafe",
      "Wash hands with soap for 20 seconds before eating and after toilet use",
      "Keep wounds covered and dry; change out of wet clothes quickly"
    );
    risk = elevate(risk, "high");
  }

  if (humid && climate.temperatureC > 20 && totalRain > 20) {
    profiles.push(DENGUE_PROFILE, MALARIA_PROFILE);
    conditions.push("Dengue", "Malaria (in endemic zones)", "Chikungunya");
    symptoms.push("Sudden fever", "Joint pain", "Rash");
    prevention.push(
      "Use insect repellent as locally recommended",
      "Sleep under treated nets in outbreak seasons",
      "Seek care within 24 hours of fever in endemic areas"
    );
    transmissionSummary.push(
      "Mosquitoes bite an infected person, then bite another child — they do not spread person-to-person like a cold.",
      "Standing water in pots, tires, and blocked drains lets mosquitoes breed in just a few days."
    );
    precautionarySteps.push(
      "Empty standing water weekly around home and school",
      "Wear long sleeves at dawn and dusk when mosquitoes are most active",
      "Use bed nets and screens where local programs recommend"
    );
    risk = elevate(risk, "moderate");
  }

  if ((climate.airQualityIndex ?? 0) >= 120) {
    profiles.push(RESPIRATORY_PROFILE);
    conditions.push("Respiratory infections", "Asthma exacerbation");
    symptoms.push("Wheezing", "Persistent cough", "Chest tightness");
    prevention.push(
      "Follow local air quality alerts",
      "Keep rescue inhalers accessible for asthmatic children"
    );
    transmissionSummary.push(
      "Colds and flu spread through tiny droplets when sick people cough, sneeze, or share cups and utensils.",
      "Smoke and dust irritate lungs and make it easier for germs to cause infection."
    );
    precautionarySteps.push(
      "Teach children to cough into elbows, not hands",
      "Keep sick children home until fever-free per local school rules",
      "Ventilate indoor spaces when outdoor air quality improves"
    );
    risk = elevate(risk, "moderate");
  }

  if (profiles.length === 0) {
    profiles.push(ROUTINE_PROFILE);
    conditions.push("Routine childhood illnesses");
    symptoms.push("Mild fever", "Runny nose");
    prevention.push(
      "Complete immunizations",
      "Wash hands before meals",
      "Stay home when sick to protect friends"
    );
    transmissionSummary.push(
      "Common colds spread through touch and shared toys, then hands touching nose or mouth.",
      "Vaccines train the body to fight specific germs before they cause serious illness."
    );
    precautionarySteps.push(
      "Wash hands before snacks and after playground time",
      "Clean high-touch surfaces (toys, door handles) during cold season",
      "Follow your country's child vaccination calendar"
    );
  }

  const uniquePrecautions = [
    ...new Set([
      ...precautionarySteps,
      ...profiles.flatMap((p) => p.precautions),
    ]),
  ];

  return {
    risk,
    conditions,
    symptoms,
    prevention,
    profiles,
    transmissionSummary,
    precautionarySteps: uniquePrecautions,
  };
}

const HEAT_PROFILE: DiseaseProfile = {
  name: "Heat exhaustion & dehydration",
  howItSpreads: [
    "Not spread between people — caused by hot weather, heavy activity, and not drinking enough fluids.",
    "Closed cars and unshaded playgrounds trap heat and raise risk quickly for children.",
  ],
  earlySymptoms: [
    "Very thirsty, dry lips, less urine or dark urine",
    "Headache, tiredness, muscle cramps",
    "Dizziness, nausea, or acting confused (seek help immediately)",
  ],
  precautions: [
    "Dress in light, breathable cotton; use hats and shade",
    "Never leave a child alone in a parked vehicle",
    "Recognize early signs and cool down with shade and water",
  ],
  whenToSeeDoctor:
    "If the child vomits repeatedly, will not drink, has a seizure, or becomes confused or unconscious.",
};

const DIARRHEAL_PROFILE: DiseaseProfile = {
  name: "Diarrheal disease (contaminated water)",
  howItSpreads: [
    "Germs (bacteria, viruses) in unsafe water, food, or on unwashed hands enter the digestive system.",
    "Floods can mix sewage with drinking water and contaminate wells and taps.",
    "One sick child can spread germs to others if hands are not washed after using the toilet.",
  ],
  earlySymptoms: [
    "Loose stools more than three times in 24 hours",
    "Stomach pain, vomiting, mild fever",
    "Signs of dehydration: sunken eyes, dry mouth, no tears when crying",
  ],
  precautions: [
    "Use safe water for drinking, brushing teeth, and preparing formula",
    "Breastfeed infants if possible — breast milk is clean and protective",
    "Prepare ORS (oral rehydration) at home under adult supervision when advised",
  ],
  whenToSeeDoctor:
    "Blood in stool, high fever, signs of dehydration, or diarrhea lasting more than 2 days in young children.",
};

const LEPTOSPIROSIS_PROFILE: DiseaseProfile = {
  name: "Leptospirosis (floodwater)",
  howItSpreads: [
    "Bacteria in water contaminated with urine from infected rats, dogs, or farm animals.",
    "Enters through cuts, scrapes, eyes, or mouth after swimming or wading in floodwater.",
  ],
  earlySymptoms: ["Sudden fever", "Muscle pain, especially in calves", "Red eyes, headache"],
  precautions: [
    "Avoid playing in floodwater; wear boots if contact is unavoidable",
    "Shower and wash with soap after any floodwater exposure",
    "Do not swallow floodwater",
  ],
  whenToSeeDoctor: "Fever within 2 weeks of floodwater contact, especially with muscle pain or red eyes.",
};

const DENGUE_PROFILE: DiseaseProfile = {
  name: "Dengue fever",
  howItSpreads: [
    "Spread by Aedes mosquitoes that bite during the day, often near homes and schools.",
    "Mosquito becomes infected after biting a person with dengue, then passes it to the next bite.",
  ],
  earlySymptoms: [
    "Sudden high fever with headache or pain behind the eyes",
    "Joint and muscle pain, rash, nausea",
  ],
  precautions: [
    "Remove standing water where mosquitoes lay eggs",
    "Use repellents approved for children's age on exposed skin",
    "Seek care early — severe dengue needs hospital monitoring",
  ],
  whenToSeeDoctor:
    "Fever with severe belly pain, vomiting, bleeding gums, or feeling very weak after fever drops.",
};

const MALARIA_PROFILE: DiseaseProfile = {
  name: "Malaria (endemic areas)",
  howItSpreads: [
    "Spread by Anopheles mosquitoes, often biting at night in malaria-endemic regions.",
    "Not spread directly child-to-child; always through an infected mosquito bite.",
  ],
  earlySymptoms: ["Fever with chills and sweating", "Headache", "Tiredness and body aches"],
  precautions: [
    "Use insecticide-treated bed nets every night in endemic zones",
    "Take preventive medicine only if prescribed by a health worker for travel or residence",
    "Test and treat fever promptly in endemic areas",
  ],
  whenToSeeDoctor: "Any fever in a malaria-endemic area within 24 hours — early treatment saves lives.",
};

const RESPIRATORY_PROFILE: DiseaseProfile = {
  name: "Respiratory infections & asthma flare-ups",
  howItSpreads: [
    "Viruses spread through air droplets and close contact with sick people.",
    "Dirty air (smoke, dust, high AQI) irritates airways but does not 'spread' pollution — it worsens symptoms.",
  ],
  earlySymptoms: [
    "Runny nose, cough, mild fever",
    "Wheezing, chest tightness, or fast breathing in asthmatic children",
  ],
  precautions: [
    "Follow local air quality alerts for outdoor play",
    "Keep rescue inhalers and action plans ready for known asthma",
    "Improve indoor air with ventilation when outdoor AQI improves",
  ],
  whenToSeeDoctor:
    "Fast breathing, ribs pulling in with breaths, blue lips, or inhaler not relieving symptoms.",
};

const ROUTINE_PROFILE: DiseaseProfile = {
  name: "Routine childhood illnesses",
  howItSpreads: [
    "Colds and stomach bugs spread through hands, toys, and close play.",
    "Some diseases (measles, chickenpox) spread through the air across a room.",
  ],
  earlySymptoms: ["Mild fever", "Runny nose", "Cough or upset stomach"],
  precautions: [
    "Stay up to date on vaccines",
    "Wash hands before meals and after play",
    "Keep sick children home to protect classmates",
  ],
  whenToSeeDoctor:
    "High fever lasting more than 3 days, trouble breathing, or if the child is much less active than usual.",
};

function elevate(current: RiskLevel, next: RiskLevel): RiskLevel {
  const order: RiskLevel[] = ["low", "moderate", "high", "critical"];
  return order.indexOf(next) > order.indexOf(current) ? next : current;
}
