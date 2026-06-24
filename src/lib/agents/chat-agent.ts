import type {
  AgeBand,
  ChatAction,
  ChatMessage,
  ChatResponse,
  ConsultantSlot,
  SynthesisReport,
} from "../types";
import { getConsultantSlots } from "../consultant-scheduler";
import { PRIVACY_NOTICE } from "../privacy-guard";

type Topic =
  | "greeting"
  | "climate"
  | "heat"
  | "rain"
  | "air"
  | "water"
  | "germs"
  | "food"
  | "natural"
  | "climate-impact"
  | "worried"
  | "emergency"
  | "consultant"
  | "general";

interface MatchedTopic {
  topic: Topic;
  confidence: number;
  consultantTopic?: string;
}

function detectTopic(message: string): MatchedTopic {
  const lower = message.toLowerCase();

  const rules: { topic: Topic; patterns: RegExp[]; consultantTopic?: string }[] = [
    {
      topic: "emergency",
      patterns: [
        /\b(?:can't breathe|cannot breathe|fainted|unconscious|severe pain|bleeding heavily|very high fever)\b/,
        /\b(?:911|112|108|emergency)\b/,
      ],
      consultantTopic: "emergency",
    },
    {
      topic: "consultant",
      patterns: [
        /\b(?:talk to (?:a )?doctor|health consultant|schedule (?:a )?call|book (?:a )?appointment)\b/,
      ],
      consultantTopic: "default",
    },
    {
      topic: "worried",
      patterns: [
        /\b(?:scared|worried|anxious|stress|climate anxiety|afraid)\b/,
      ],
      consultantTopic: "mental",
    },
    {
      topic: "climate-impact",
      patterns: [
        /\b(?:climate change|global warming|why is (?:the )?weather changing|planet getting hotter|environment)\b/,
      ],
      consultantTopic: "heat",
    },
    {
      topic: "heat",
      patterns: [/\b(?:hot|heat|sunburn|sweat|dehydrat|heatwave|heat wave)\b/],
      consultantTopic: "heat",
    },
    {
      topic: "rain",
      patterns: [/\b(?:rain|flood|monsoon|storm|cyclone|puddle)\b/],
      consultantTopic: "water",
    },
    {
      topic: "air",
      patterns: [/\b(?:air quality|aqi|smog|pollution|asthma|breathe|lungs)\b/],
      consultantTopic: "respiratory",
    },
    {
      topic: "water",
      patterns: [/\b(?:drink water|hydrat|thirsty|water bottle)\b/],
      consultantTopic: "nutrition",
    },
    {
      topic: "germs",
      patterns: [
        /\b(?:germ|virus|bacteria|dengue|malaria|diarrhea|fever|cough|sick|disease|mosquito|handwash)\b/,
      ],
      consultantTopic: "vector",
    },
    {
      topic: "food",
      patterns: [/\b(?:food|eat|nutrition|snack|meal|hungry|ors)\b/],
      consultantTopic: "nutrition",
    },
    {
      topic: "natural",
      patterns: [/\b(?:home remedy|natural|herb|steam|saline|ginger|turmeric)\b/],
      consultantTopic: "default",
    },
    {
      topic: "climate",
      patterns: [/\b(?:weather|forecast|temperature|climate|today|tomorrow)\b/],
      consultantTopic: "heat",
    },
    {
      topic: "greeting",
      patterns: [
        /^(?:hi|hello|hey|good morning|good afternoon|good evening)\b/,
        /\b(?:who are you|what can you do)\b/,
      ],
    },
  ];

  for (const rule of rules) {
    for (const pattern of rule.patterns) {
      if (pattern.test(lower)) {
        return {
          topic: rule.topic,
          confidence: 1,
          consultantTopic: rule.consultantTopic,
        };
      }
    }
  }

  return { topic: "general", confidence: 0.3, consultantTopic: "default" };
}

function ageTone(ageBand: AgeBand): {
  opener: string;
  emoji: string;
  adultReminder: string;
} {
  if (ageBand === "5-8") {
    return {
      opener: "",
      emoji: "🌈",
      adultReminder: " Ask a grown-up if you are not sure!",
    };
  }
  if (ageBand === "9-12") {
    return {
      opener: "",
      emoji: "🛡️",
      adultReminder: " Check with a caregiver for anything serious.",
    };
  }
  return {
    opener: "",
    emoji: "🌍",
    adultReminder: " Escalate to a clinician when symptoms are severe.",
  };
}

function formatForAge(ageBand: AgeBand, parts: string[]): string {
  const tone = ageTone(ageBand);
  const body = parts.filter(Boolean).join(" ");

  if (ageBand === "5-8") {
    const sentences = body.split(/(?<=[.!?])\s+/).slice(0, 4);
    return `${tone.emoji} ${sentences.join(" ")}${tone.adultReminder}`;
  }

  if (ageBand === "9-12") {
    return `${tone.emoji} ${body}${tone.adultReminder}`;
  }

  return `${tone.emoji} ${body}${tone.adultReminder}`;
}

function guidanceForBand(
  report: SynthesisReport | undefined,
  ageBand: AgeBand
): { text: string; citations: string[] } | null {
  if (!report) return null;
  const guidance = report.childGuidance.find((g) => g.ageBand === ageBand);
  if (!guidance) return null;

  return {
    text: `${guidance.howClimateAffectsYou} ${guidance.beatingTheDisruption[0] ?? ""}`.trim(),
    citations: [
      `Child guidance (${ageBand})`,
      `Overall risk: ${report.overallRisk}`,
      report.disruptionWindow,
    ],
  };
}

function climateContext(report: SynthesisReport | undefined): string {
  if (!report) {
    return "I can give general tips, but run a location analysis first for weather-smart answers where you live.";
  }

  const maxTemp = Math.max(
    ...report.climate.forecastDays.slice(0, 5).map((d) => d.tempMaxC)
  );
  const rain = report.climate.forecastDays
    .slice(0, 5)
    .reduce((s, d) => s + d.precipitationMm, 0);
  const aqi = report.climate.airQualityIndex ?? 0;

  return `For ${report.location.city}, agents see ${report.overallRisk} risk during ${report.disruptionWindow}. Forecast highs around ${maxTemp.toFixed(0)}°C, ~${rain.toFixed(0)} mm rain in 5 days, AQI ~${aqi}.`;
}

function buildAnswer(params: {
  topic: MatchedTopic;
  ageBand: AgeBand;
  message: string;
  report?: SynthesisReport;
}): { content: string; citations: string[]; action: ChatAction; consultantTopic: string } {
  const { topic, ageBand, report } = params;
  const matched = topic;
  const citations: string[] = [];
  const guidance = guidanceForBand(report, ageBand);
  const ctx = climateContext(report);

  if (guidance) {
    citations.push(...guidance.citations);
  }
  if (report) {
    citations.push("Climate Data Agent", "Health Risk Agent", "Synthesis Agent");
  }

  switch (matched.topic) {
    case "greeting":
      return {
        content: formatForAge(ageBand, [
          ageBand === "5-8"
            ? "Hi friend! I am your KlimaGuard health helper. You can ask about weather, staying healthy, germs, food, and how climate affects kids."
            : ageBand === "9-12"
              ? "Hello! I answer health and climate questions using trusted agent data for your area. Try asking about heat, air quality, germs, or hydration."
              : "Hello. I provide climate-health preparedness guidance grounded in live agent analysis. Ask about local risks, disease prevention, nutrition, or scheduling a consultant call.",
        ]),
        citations: ["Chat Agent"],
        action: "none",
        consultantTopic: "default",
      };

    case "heat": {
      const heatInsight = report?.health.find((h) => h.category === "heat");
      const hydration = report?.nutrition.hydrationLiters;
      const tips =
        ageBand === "5-8"
          ? [
              "When it is very hot, your body needs extra water — sip like a little fish!",
              heatInsight
                ? `Our helpers say: ${heatInsight.actions[0]}`
                : "Play in the shade and rest when grown-ups say so.",
              hydration
                ? `Try to drink about ${hydration} liters of safe water today with help from an adult.`
                : "Keep your water bottle full!",
            ]
          : ageBand === "9-12"
            ? [
                ctx,
                heatInsight?.description ?? "Heat makes you lose water faster than you think.",
                heatInsight?.actions[0] ?? "Schedule outdoor play before 10am or after 4pm.",
                hydration
                  ? `Hydration target: ~${hydration} L/day in current conditions.`
                  : "Refill your bottle every hour on hot days.",
              ]
            : [
                ctx,
                heatInsight
                  ? `${heatInsight.title}: ${heatInsight.description}`
                  : "Heat stress raises dehydration and heat illness risk.",
                guidance?.text ?? "",
                "Watch peers for dizziness; advocate for shade and water at school.",
              ];
      return {
        content: formatForAge(ageBand, tips),
        citations,
        action: heatInsight && ["high", "critical"].includes(heatInsight.risk)
          ? "schedule-consultant"
          : "consult-caregiver",
        consultantTopic: "heat",
      };
    }

    case "rain": {
      const waterInsight = report?.health.find((h) => h.category === "water");
      const profile = report?.disease.profiles.find((p) =>
        p.name.toLowerCase().includes("diarr")
      );
      const tips =
        ageBand === "5-8"
          ? [
              "Rain can make puddles fun but also carry germs. Stay away from flood water!",
              waterInsight?.actions[0] ?? "Wash hands after playing in wet areas.",
              "Keep a cozy indoor game ready for rainy days.",
            ]
          : [
              ctx,
              waterInsight?.description ??
                "Heavy rain can contaminate water and increase waterborne illness risk.",
              profile
                ? `Watch for ${profile.name}: tell an adult if ${profile.earlySymptoms[0]?.toLowerCase()}.`
                : "Use boiled or bottled water if authorities advise.",
              report?.disease.precautionarySteps[0] ?? "Clear standing water near home safely with adults.",
            ];
      return {
        content: formatForAge(ageBand, tips),
        citations,
        action: waterInsight && ["high", "critical"].includes(waterInsight.risk)
          ? "schedule-consultant"
          : "consult-caregiver",
        consultantTopic: "water",
      };
    }

    case "air": {
      const resp = report?.health.find((h) => h.category === "respiratory");
      const tips =
        ageBand === "5-8"
          ? [
              "When air looks smoky or hazy, play inside — your lungs are still growing!",
              resp?.actions[0] ?? "Ask a grown-up if outdoor play is okay today.",
            ]
          : [
              ctx,
              resp
                ? `${resp.title}: ${resp.description}`
                : "Poor air quality makes breathing harder, especially with asthma.",
              resp?.actions[0] ?? "Move PE indoors when AQI is unhealthy.",
            ];
      return {
        content: formatForAge(ageBand, tips),
        citations,
        action: resp && ["high", "critical"].includes(resp.risk)
          ? "schedule-consultant"
          : "none",
        consultantTopic: "respiratory",
      };
    }

    case "water":
    case "food": {
      const nutrition = report?.nutrition;
      const tips =
        ageBand === "5-8"
          ? [
              nutrition
                ? `Drink safe water — about ${nutrition.hydrationLiters} big cups worth with adult help!`
                : "Water is your superpower on hot days!",
              nutrition?.recommendedFoods[0]
                ? `Good foods now: ${nutrition.recommendedFoods[0]}`
                : "Eat fruits and veggies when you can.",
            ]
          : [
              nutrition
                ? `${nutrition.title}. ${nutrition.description}`
                : "Hydration and safe food matter more during climate stress.",
              nutrition
                ? `Target ~${nutrition.hydrationLiters} L hydration. Foods: ${nutrition.recommendedFoods.slice(0, 2).join(", ")}.`
                : "Avoid raw street food if water safety is uncertain.",
            ];
      return {
        content: formatForAge(ageBand, tips),
        citations,
        action: "consult-caregiver",
        consultantTopic: "nutrition",
      };
    }

    case "germs": {
      const disease = report?.disease;
      const profile = disease?.profiles[0];
      const germTips =
        report?.childGuidance.find((g) => g.ageBand === ageBand)
          ?.stayHealthyFromGerms ?? disease?.precautionarySteps ?? [];

      const tips =
        ageBand === "5-8"
          ? [
              "Germs are tiny bugs you cannot see — they travel from hands to mouth!",
              germTips[0] ?? "Wash hands with soap before eating.",
              profile
                ? `If you feel sick like ${profile.name}, tell a grown-up right away.`
                : "Tell an adult if you have fever or tummy trouble.",
            ]
          : [
              disease?.transmissionSummary[0] ??
                "Many climate-linked illnesses spread through water, mosquitoes, or close contact.",
              ...germTips.slice(0, 2),
              profile
                ? `${profile.name} — see a doctor when: ${profile.whenToSeeDoctor}`
                : "Escalate if dehydration or breathing problems appear.",
            ];
      return {
        content: formatForAge(ageBand, tips),
        citations,
        action:
          disease && ["high", "critical"].includes(disease.risk)
            ? "schedule-consultant"
            : "consult-caregiver",
        consultantTopic: "vector",
      };
    }

    case "natural": {
      const remedies = report?.naturalMedicine.remedies.slice(0, 2) ?? [];
      const tips =
        ageBand === "5-8"
          ? [
              "Some home helpers can soothe you — but only with a grown-up!",
              remedies[0]
                ? `${remedies[0].remedy}: ${remedies[0].adultSupervision}`
                : "Never take medicine without an adult.",
              "These are not replacements for vaccines or doctor visits.",
            ]
          : [
              "Natural supports are for comfort under supervision — not diagnosis or prescription.",
              ...remedies.map(
                (r) =>
                  `${r.remedy} (${r.forCondition}): ${r.howItHelps}. Supervision: ${r.adultSupervision}`
              ),
              report?.naturalMedicine.generalCautions[0] ??
                "Confirm with your clinic before relying on home remedies.",
            ];
      return {
        content: formatForAge(ageBand, tips),
        citations,
        action: "consult-caregiver",
        consultantTopic: "default",
      };
    }

    case "climate-impact": {
      const indiaNote = report?.indiaImpact
        ? `In your region, the Child Health Impact Score is ${report.indiaImpact.compositeScore}/100 (${report.indiaImpact.compositeLabel}).`
        : "";
      const tips =
        ageBand === "5-8"
          ? [
              "Earth's weather is changing — sometimes hotter rains and stronger storms.",
              "That is why we drink water, wash hands, and listen to weather helpers!",
              indiaNote,
            ].filter(Boolean)
          : ageBand === "9-12"
            ? [
                "Climate change means more extreme heat, floods, and sometimes worse air — which affects children's health.",
                ctx,
                indiaNote,
                guidance?.text ?? "Small daily actions (water, shade, clean hands) reduce harm.",
              ].filter(Boolean)
            : [
                "Climate change shifts disease patterns, nutrition stress, and emergency loads on health systems — children are among the most exposed.",
                ctx,
                indiaNote,
                report?.correlations[0] ?? "",
                "Anticipatory action at home and school beats reactive hospital visits.",
              ].filter(Boolean);
      return {
        content: formatForAge(ageBand, tips),
        citations,
        action: "none",
        consultantTopic: "heat",
      };
    }

    case "worried": {
      const mental = report?.health.find((h) => h.category === "mental");
      const tips =
        ageBand === "5-8"
          ? [
              "It is okay to feel scared when weather is loud or different.",
              "Hug a trusted adult and talk about your family safety plan.",
              "Deep breaths: smell the flowers, blow out the candles!",
            ]
          : [
              mental?.description ??
                "Climate events can cause real anxiety — that is a normal response.",
              "Talk to a parent, teacher, or counselor; limit scary unverified news.",
              "Helping younger kids hydrate or prepare can turn worry into action.",
            ];
      return {
        content: formatForAge(ageBand, tips),
        citations,
        action: "schedule-consultant",
        consultantTopic: "mental",
      };
    }

    case "emergency":
      return {
        content: formatForAge(ageBand, [
          ageBand === "5-8"
            ? "This sounds serious — find a grown-up RIGHT NOW!"
            : "This may be an emergency. Tell a caregiver immediately and call your local emergency number if needed.",
          "I cannot provide emergency medical care in chat.",
          "A health consultant can follow up after you are safe.",
        ]),
        citations: ["Safeguarding policy"],
        action: "schedule-consultant",
        consultantTopic: "emergency",
      };

    case "consultant":
      return {
        content: formatForAge(ageBand, [
          "I can help you find a time to talk with a child health consultant about climate and wellness questions.",
          "Pick a slot below — a caring adult should join the call for children under 13.",
        ]),
        citations: ["Consultant scheduling"],
        action: "schedule-consultant",
        consultantTopic: matched.consultantTopic ?? "default",
      };

    default:
      return {
        content: formatForAge(ageBand, [
          guidance?.text ??
            "I specialize in kids' health and how climate affects it — try asking about heat, rain, air quality, germs, food, or feelings about weather.",
          ctx,
          report?.childGuidance.find((g) => g.ageBand === ageBand)?.askAdultFor[0] ??
            "Ask a caring adult when unsure.",
        ]),
        citations,
        action: "consult-caregiver",
        consultantTopic: matched.consultantTopic ?? "default",
      };
  }
}

function newMessageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function generateChatResponse(params: {
  sessionId: string;
  message: string;
  ageBand: AgeBand;
  countryCode: string;
  report?: SynthesisReport;
}): ChatResponse {
  const topic = detectTopic(params.message);
  const answer = buildAnswer({
    topic,
    ageBand: params.ageBand,
    message: params.message,
    report: params.report,
  });

  const showConsultant =
    answer.action === "schedule-consultant" || topic.topic === "consultant";

  const consultantSlots: ConsultantSlot[] | undefined = showConsultant
    ? getConsultantSlots({
        countryCode: params.countryCode,
        topic: answer.consultantTopic,
      })
    : undefined;

  const assistantMessage: ChatMessage = {
    id: newMessageId(),
    role: "assistant",
    content: answer.content,
    timestamp: new Date().toISOString(),
    citations: answer.citations,
    actionSuggested: answer.action,
  };

  return {
    message: assistantMessage,
    privacyNotice: PRIVACY_NOTICE,
    consultantAvailable: Boolean(consultantSlots?.length),
    consultantSlots,
    sessionId: params.sessionId,
    reportContextUsed: Boolean(params.report),
  };
}

export function starterPrompts(ageBand: AgeBand): string[] {
  if (ageBand === "5-8") {
    return [
      "Why is it so hot today?",
      "How do germs spread?",
      "What should I drink when it is hot?",
      "Why does climate change matter for kids?",
    ];
  }
  if (ageBand === "9-12") {
    return [
      "How does heavy rain affect my health?",
      "What is air quality and why should I care?",
      "How can I stay safe from dengue?",
      "Can I talk to a health consultant?",
    ];
  }
  return [
    "How is climate change impacting child health in my region?",
    "What precautions should I take during heat waves?",
    "When should I escalate symptoms to a clinic?",
    "Schedule a call with a health consultant",
  ];
}
