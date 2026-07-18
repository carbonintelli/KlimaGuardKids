import type {
  AgeBand,
  ChildGuidance,
  GameBadge,
  GameMission,
  MissionCategory,
  PlayerProgress,
} from "./types";

export interface AgeGameProfile {
  band: AgeBand;
  label: string;
  tagline: string;
  currencyName: string;
  currencyEmoji: string;
  levelTitles: string[];
  xpPerLevel: number;
  missionCount: number;
  celebration: string;
}

export const AGE_PROFILES: Record<AgeBand, AgeGameProfile> = {
  "5-8": {
    band: "5-8",
    label: "Little Climate Heroes",
    tagline: "Collect stars by helping your body stay safe in wild weather.",
    currencyName: "Stars",
    currencyEmoji: "⭐",
    levelTitles: [
      "Tiny Sprout",
      "Puddle Scout",
      "Shade Buddy",
      "Water Fish",
      "Weather Superstar",
    ],
    xpPerLevel: 12,
    missionCount: 4,
    celebration: "You earned a star!",
  },
  "9-12": {
    band: "9-12",
    label: "Climate Cadets",
    tagline: "Complete missions, earn points, and level up your prep skills.",
    currencyName: "Points",
    currencyEmoji: "⚡",
    levelTitles: [
      "Climate Cadet",
      "Weather Watcher",
      "Prep Pro",
      "Risk Ranger",
      "Guard Captain",
    ],
    xpPerLevel: 25,
    missionCount: 5,
    celebration: "Mission complete — points unlocked!",
  },
  "13-17": {
    band: "13-17",
    label: "Impact Leaders",
    tagline: "Turn climate alerts into action for yourself and your community.",
    currencyName: "Impact XP",
    currencyEmoji: "🛡️",
    levelTitles: [
      "Alert Apprentice",
      "Resilience Scout",
      "Peer Educator",
      "Community Anchor",
      "Impact Leader",
    ],
    xpPerLevel: 40,
    missionCount: 6,
    celebration: "Impact logged — keep leading!",
  },
};

const STORAGE_PREFIX = "klimaguard-play-v1";

const BASELINE_MISSIONS: Record<AgeBand, Omit<GameMission, "ageBand" | "source">[]> = {
  "5-8": [
    {
      id: "5-8-water-sips",
      title: "Sip like a little fish",
      description: "Drink water 3 times today — morning, lunch, and playtime.",
      category: "nutrition",
      xp: 4,
      difficulty: "easy",
    },
    {
      id: "5-8-shade-play",
      title: "Find shady play spots",
      description: "Play under a tree, porch, or indoors when it feels too hot.",
      category: "heat",
      xp: 4,
      difficulty: "easy",
    },
    {
      id: "5-8-elbow-cape",
      title: "Superhero elbow sneeze",
      description: "Practice coughing or sneezing into your elbow cape.",
      category: "germs",
      xp: 3,
      difficulty: "easy",
    },
    {
      id: "5-8-hand-wash",
      title: "Soap bubble wash",
      description: "Wash hands with soap before eating — sing while you scrub!",
      category: "germs",
      xp: 3,
      difficulty: "easy",
    },
  ],
  "9-12": [
    {
      id: "9-12-bottle-check",
      title: "Bottle patrol",
      description: "Fill a water bottle before school and refill it once by midday.",
      category: "nutrition",
      xp: 6,
      difficulty: "easy",
    },
    {
      id: "9-12-forecast",
      title: "Forecast check",
      description: "Look at today’s weather with a caregiver and name one risk.",
      category: "prep",
      xp: 8,
      difficulty: "medium",
    },
    {
      id: "9-12-hand-team",
      title: "Handwash coach",
      description: "Remind a younger sibling or friend to wash hands after outdoor play.",
      category: "germs",
      xp: 7,
      difficulty: "medium",
    },
    {
      id: "9-12-shade-route",
      title: "Cool route home",
      description: "Pick a shadier or cooler walking route when it is hot outside.",
      category: "heat",
      xp: 6,
      difficulty: "easy",
    },
    {
      id: "9-12-air-aware",
      title: "Air-aware break",
      description: "If the air looks hazy, choose an indoor activity instead of outdoor PE.",
      category: "air",
      xp: 8,
      difficulty: "medium",
    },
  ],
  "13-17": [
    {
      id: "13-17-buddy-hydrate",
      title: "Buddy hydration check",
      description: "Ask one teammate or classmate if they have water before outdoor activity.",
      category: "community",
      xp: 10,
      difficulty: "easy",
    },
    {
      id: "13-17-alert-share",
      title: "Share a verified alert",
      description: "Share one trusted weather or boil-water tip with family or class (no rumors).",
      category: "community",
      xp: 12,
      difficulty: "medium",
    },
    {
      id: "13-17-aqi-plan",
      title: "AQI action plan",
      description: "Check air quality and decide with an adult whether outdoor plans should move indoors.",
      category: "air",
      xp: 12,
      difficulty: "medium",
    },
    {
      id: "13-17-kit-ready",
      title: "Home prep kit",
      description: "Help restock ORS, clean water, or a simple heat/flood kit at home.",
      category: "prep",
      xp: 14,
      difficulty: "challenge",
    },
    {
      id: "13-17-peer-teach",
      title: "Peer educator moment",
      description: "Teach a younger child one germ or heat safety tip in your own words.",
      category: "germs",
      xp: 12,
      difficulty: "medium",
    },
    {
      id: "13-17-mental-check",
      title: "Talk it out",
      description: "If weather stress feels heavy, tell a trusted adult or counselor — that counts as strength.",
      category: "community",
      xp: 10,
      difficulty: "easy",
    },
  ],
};

export const BADGES: GameBadge[] = [
  {
    id: "badge-5-8-first-star",
    ageBand: "5-8",
    name: "First Star",
    description: "Complete your first mission.",
    emoji: "🌟",
    requirement: { type: "missions", value: 1 },
  },
  {
    id: "badge-5-8-water",
    ageBand: "5-8",
    name: "Water Fish",
    description: "Finish 2 nutrition missions.",
    emoji: "🐟",
    requirement: { type: "category", value: 2, category: "nutrition" },
  },
  {
    id: "badge-5-8-germ",
    ageBand: "5-8",
    name: "Germ Guard",
    description: "Finish 2 germ missions.",
    emoji: "🧼",
    requirement: { type: "category", value: 2, category: "germs" },
  },
  {
    id: "badge-5-8-hero",
    ageBand: "5-8",
    name: "Weather Superstar",
    description: "Earn 20 stars.",
    emoji: "🦸",
    requirement: { type: "xp", value: 20 },
  },
  {
    id: "badge-9-12-cadet",
    ageBand: "9-12",
    name: "Cadet Badge",
    description: "Complete 2 missions.",
    emoji: "🎖️",
    requirement: { type: "missions", value: 2 },
  },
  {
    id: "badge-9-12-prep",
    ageBand: "9-12",
    name: "Prep Pro",
    description: "Complete 2 prep missions.",
    emoji: "📋",
    requirement: { type: "category", value: 2, category: "prep" },
  },
  {
    id: "badge-9-12-air",
    ageBand: "9-12",
    name: "Air Aware",
    description: "Complete an air mission.",
    emoji: "🌬️",
    requirement: { type: "category", value: 1, category: "air" },
  },
  {
    id: "badge-9-12-captain",
    ageBand: "9-12",
    name: "Guard Captain",
    description: "Earn 50 points.",
    emoji: "🧢",
    requirement: { type: "xp", value: 50 },
  },
  {
    id: "badge-13-17-impact",
    ageBand: "13-17",
    name: "First Impact",
    description: "Complete your first leadership mission.",
    emoji: "🌱",
    requirement: { type: "missions", value: 1 },
  },
  {
    id: "badge-13-17-community",
    ageBand: "13-17",
    name: "Community Anchor",
    description: "Complete 3 community missions.",
    emoji: "🤝",
    requirement: { type: "category", value: 3, category: "community" },
  },
  {
    id: "badge-13-17-educator",
    ageBand: "13-17",
    name: "Peer Educator",
    description: "Complete 2 germ or prep missions.",
    emoji: "📣",
    requirement: { type: "missions", value: 4 },
  },
  {
    id: "badge-13-17-leader",
    ageBand: "13-17",
    name: "Impact Leader",
    description: "Earn 80 Impact XP.",
    emoji: "🏅",
    requirement: { type: "xp", value: 80 },
  },
];

function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
}

function inferCategory(text: string): MissionCategory {
  const t = text.toLowerCase();
  if (/(water|hydrat|drink|ors|bottle|sip)/.test(t)) return "nutrition";
  if (/(heat|shade|hot|sun|cool)/.test(t)) return "heat";
  if (/(air|aqi|smok|haze|mask|lung)/.test(t)) return "air";
  if (/(flood|rain|puddle|boil|drain)/.test(t)) return "water";
  if (/(germ|wash|hand|sneeze|cough|vaccine|fever)/.test(t)) return "germs";
  if (/(friend|class|community|sibling|share|teach|volunteer)/.test(t))
    return "community";
  return "prep";
}

function xpForAge(ageBand: AgeBand, difficulty: GameMission["difficulty"]): number {
  const base = { "5-8": 3, "9-12": 6, "13-17": 10 }[ageBand];
  const mult = { easy: 1, medium: 1.3, challenge: 1.6 }[difficulty];
  return Math.round(base * mult);
}

export function getBaselineMissions(ageBand: AgeBand): GameMission[] {
  return BASELINE_MISSIONS[ageBand].map((m) => ({
    ...m,
    ageBand,
    source: "baseline",
  }));
}

export function buildMissionsFromGuidance(guidance: ChildGuidance): GameMission[] {
  const tips = [
    ...guidance.prepareToday.map((t) => ({ text: t, difficulty: "easy" as const })),
    ...guidance.beatingTheDisruption
      .slice(0, 3)
      .map((t) => ({ text: t, difficulty: "medium" as const })),
    ...guidance.stayHealthyFromGerms
      .slice(0, 2)
      .map((t) => ({ text: t, difficulty: "medium" as const })),
  ];

  const profile = AGE_PROFILES[guidance.ageBand];
  const missions: GameMission[] = tips.slice(0, profile.missionCount).map((tip, index) => {
    const category = inferCategory(tip.text);
    return {
      id: `climate-${guidance.ageBand}-${slug(tip.text)}-${index}`,
      ageBand: guidance.ageBand,
      title: tip.text.length > 48 ? `${tip.text.slice(0, 45)}…` : tip.text,
      description: tip.text,
      category,
      xp: xpForAge(guidance.ageBand, tip.difficulty),
      difficulty: tip.difficulty,
      source: "climate",
    };
  });

  return missions;
}

export function resolveMissions(
  ageBand: AgeBand,
  guidance?: ChildGuidance | null
): GameMission[] {
  if (guidance) {
    const climateMissions = buildMissionsFromGuidance(guidance);
    if (climateMissions.length >= 3) return climateMissions;
  }
  return getBaselineMissions(ageBand);
}

export function getBadgesForAge(ageBand: AgeBand): GameBadge[] {
  return BADGES.filter((b) => b.ageBand === ageBand);
}

export function emptyProgress(ageBand: AgeBand): PlayerProgress {
  return {
    ageBand,
    xp: 0,
    completedMissionIds: [],
    unlockedBadgeIds: [],
    lastPlayedDate: null,
    streakDays: 0,
  };
}

function storageKey(ageBand: AgeBand): string {
  return `${STORAGE_PREFIX}:${ageBand}`;
}

export function loadProgress(ageBand: AgeBand): PlayerProgress {
  if (typeof window === "undefined") return emptyProgress(ageBand);
  try {
    const raw = localStorage.getItem(storageKey(ageBand));
    if (!raw) return emptyProgress(ageBand);
    const parsed = JSON.parse(raw) as PlayerProgress;
    if (parsed.ageBand !== ageBand) return emptyProgress(ageBand);
    return {
      ...emptyProgress(ageBand),
      ...parsed,
      completedMissionIds: parsed.completedMissionIds ?? [],
      unlockedBadgeIds: parsed.unlockedBadgeIds ?? [],
    };
  } catch {
    return emptyProgress(ageBand);
  }
}

export function saveProgress(progress: PlayerProgress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(progress.ageBand), JSON.stringify(progress));
}

export function computeLevel(
  ageBand: AgeBand,
  xp: number
): { level: number; title: string; xpIntoLevel: number; xpForNext: number; progress: number } {
  const profile = AGE_PROFILES[ageBand];
  const maxIndex = profile.levelTitles.length - 1;
  const levelIndex = Math.min(Math.floor(xp / profile.xpPerLevel), maxIndex);
  const xpIntoLevel = xp - levelIndex * profile.xpPerLevel;
  const xpForNext = levelIndex >= maxIndex ? profile.xpPerLevel : profile.xpPerLevel;
  const progress =
    levelIndex >= maxIndex
      ? 1
      : Math.min(1, xpIntoLevel / profile.xpPerLevel);

  return {
    level: levelIndex + 1,
    title: profile.levelTitles[levelIndex],
    xpIntoLevel,
    xpForNext,
    progress,
  };
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function updateStreak(progress: PlayerProgress): PlayerProgress {
  const today = todayKey();
  if (progress.lastPlayedDate === today) return progress;

  if (!progress.lastPlayedDate) {
    return { ...progress, lastPlayedDate: today, streakDays: 1 };
  }

  const prev = new Date(`${progress.lastPlayedDate}T12:00:00Z`);
  const curr = new Date(`${today}T12:00:00Z`);
  const diffDays = Math.round((curr.getTime() - prev.getTime()) / 86_400_000);

  return {
    ...progress,
    lastPlayedDate: today,
    streakDays: diffDays === 1 ? progress.streakDays + 1 : 1,
  };
}

function evaluateBadges(
  progress: PlayerProgress,
  missions: GameMission[]
): string[] {
  const badges = getBadgesForAge(progress.ageBand);
  const completed = new Set(progress.completedMissionIds);
  const categoryCounts: Partial<Record<MissionCategory, number>> = {};

  for (const mission of missions) {
    if (!completed.has(mission.id)) continue;
    categoryCounts[mission.category] = (categoryCounts[mission.category] ?? 0) + 1;
  }

  const unlocked = new Set(progress.unlockedBadgeIds);
  for (const badge of badges) {
    if (unlocked.has(badge.id)) continue;
    const { type, value, category } = badge.requirement;
    let ok = false;
    if (type === "missions") ok = progress.completedMissionIds.length >= value;
    if (type === "xp") ok = progress.xp >= value;
    if (type === "category" && category)
      ok = (categoryCounts[category] ?? 0) >= value;
    if (ok) unlocked.add(badge.id);
  }
  return [...unlocked];
}

export function completeMission(
  progress: PlayerProgress,
  mission: GameMission,
  allMissions: GameMission[]
): { progress: PlayerProgress; newlyUnlocked: GameBadge[]; gainedXp: number } {
  if (progress.completedMissionIds.includes(mission.id)) {
    return { progress, newlyUnlocked: [], gainedXp: 0 };
  }

  const withStreak = updateStreak(progress);
  const next: PlayerProgress = {
    ...withStreak,
    xp: withStreak.xp + mission.xp,
    completedMissionIds: [...withStreak.completedMissionIds, mission.id],
  };
  const unlockedBadgeIds = evaluateBadges(next, allMissions);
  const newlyUnlocked = getBadgesForAge(progress.ageBand).filter(
    (b) => unlockedBadgeIds.includes(b.id) && !progress.unlockedBadgeIds.includes(b.id)
  );
  const saved = { ...next, unlockedBadgeIds };
  saveProgress(saved);
  return { progress: saved, newlyUnlocked, gainedXp: mission.xp };
}

export function resetProgress(ageBand: AgeBand): PlayerProgress {
  const fresh = emptyProgress(ageBand);
  saveProgress(fresh);
  return fresh;
}

export function categoryLabel(category: MissionCategory): string {
  return {
    heat: "Heat",
    water: "Water",
    air: "Air",
    germs: "Germs",
    nutrition: "Food & water",
    community: "Community",
    prep: "Prep",
  }[category];
}
