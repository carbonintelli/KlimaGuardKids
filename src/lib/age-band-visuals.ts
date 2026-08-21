import type { AgeBand } from "./types";

export type AgeSceneId = "hero" | "safety" | "hygiene" | "action";

export type AgeScene = {
  id: AgeSceneId;
  imageSrc: string;
  imageAlt: string;
  caption: string;
  tipTitle: string;
};

export type AgeBandVisual = {
  band: AgeBand;
  imageSrc: string;
  imageAlt: string;
  accentClass: string;
  badgeLabel: string;
  headline: string;
  tagline: string;
  scenes: AgeScene[];
};

/** Age-appropriate artwork for guidance tabs, care teasers, and play hub. */
export const AGE_BAND_VISUALS: Record<AgeBand, AgeBandVisual> = {
  "5-8": {
    band: "5-8",
    imageSrc: "/age-bands/heroes-5-8.webp",
    imageAlt:
      "Little Climate Hero resting in tree shade and drinking water on a sunny day",
    accentClass: "from-sun/30 via-sky-100 to-leaf/20",
    badgeLabel: "Hero story",
    headline: "Little Climate Heroes",
    tagline: "Stories and stars for staying cool, clean, and kind.",
    scenes: [
      {
        id: "hero",
        imageSrc: "/age-bands/heroes-5-8.webp",
        imageAlt:
          "Little Climate Hero resting in tree shade and drinking water on a sunny day",
        caption: "Rest in the shade and sip water when the sun feels strong.",
        tipTitle: "Cool & calm",
      },
      {
        id: "safety",
        imageSrc: "/age-bands/heroes-5-8-shade.webp",
        imageAlt:
          "Young kids under a leafy tree drinking water with a caring adult nearby",
        caption: "Play under trees. Ask an adult for a hat and a water bottle.",
        tipTitle: "Beat the heat",
      },
      {
        id: "hygiene",
        imageSrc: "/age-bands/heroes-5-8-wash.webp",
        imageAlt: "Young kids washing hands with soap at an outdoor tap",
        caption: "Wash hands with soap after play and before snacks.",
        tipTitle: "Keep germs away",
      },
      {
        id: "action",
        imageSrc: "/age-bands/heroes-5-8-wash.webp",
        imageAlt: "Kids helping keep hands clean before eating",
        caption: "Tell a grown-up if you feel too hot, thirsty, or tummy-sick.",
        tipTitle: "Ask for help",
      },
    ],
  },
  "9-12": {
    band: "9-12",
    imageSrc: "/age-bands/cadets-9-12.webp",
    imageAlt:
      "Climate Cadet checking the forecast and choosing a cooler shaded route",
    accentClass: "from-ocean/20 via-sky-100 to-leaf/10",
    badgeLabel: "Cadet mission",
    headline: "Climate Cadets",
    tagline: "Check the forecast, pack smart, and level up your prep skills.",
    scenes: [
      {
        id: "hero",
        imageSrc: "/age-bands/cadets-9-12.webp",
        imageAlt:
          "Climate Cadet checking the forecast and choosing a cooler shaded route",
        caption: "Read the weather signal before you head out.",
        tipTitle: "Weather watch",
      },
      {
        id: "safety",
        imageSrc: "/age-bands/cadets-9-12-prep.webp",
        imageAlt:
          "Kids packing water bottles and hats after checking a weather chart",
        caption: "Pack water, a hat, and a cooler route for hot afternoons.",
        tipTitle: "Prep pack",
      },
      {
        id: "hygiene",
        imageSrc: "/age-bands/cadets-9-12-germs.webp",
        imageAlt:
          "Kids covering food, washing fruit, and fitting a mosquito screen",
        caption: "Cover food, wash fruit, and keep mosquito screens closed.",
        tipTitle: "Stop germs",
      },
      {
        id: "action",
        imageSrc: "/age-bands/cadets-9-12-prep.webp",
        imageAlt: "Cadets preparing for outdoor heat with water and shade gear",
        caption: "Share one heat tip with your family or classmates today.",
        tipTitle: "Share the tip",
      },
    ],
  },
  "13-17": {
    band: "13-17",
    imageSrc: "/age-bands/leaders-13-17.webp",
    imageAlt:
      "Impact Leaders sharing water and a verified weather tip with friends",
    accentClass: "from-leaf/25 via-sky-50 to-ocean/15",
    badgeLabel: "Leader action",
    headline: "Impact Leaders",
    tagline: "Turn alerts into peer support and neighborhood action.",
    scenes: [
      {
        id: "hero",
        imageSrc: "/age-bands/leaders-13-17.webp",
        imageAlt:
          "Impact Leaders sharing water and a verified weather tip with friends",
        caption: "Share verified heat and air tips — skip rumor forwards.",
        tipTitle: "Lead with facts",
      },
      {
        id: "safety",
        imageSrc: "/age-bands/leaders-13-17-care.webp",
        imageAlt:
          "Teens filling water bottles and sharing a heat-alert tip at a park",
        caption: "Hydration stations and shade check-ins protect younger kids.",
        tipTitle: "Care network",
      },
      {
        id: "hygiene",
        imageSrc: "/age-bands/leaders-13-17-care.webp",
        imageAlt: "Teens helping peers stay hydrated during a heat alert",
        caption: "Remind peers about ORS, clean water, and mosquito protection.",
        tipTitle: "Health habits",
      },
      {
        id: "action",
        imageSrc: "/age-bands/leaders-13-17-action.webp",
        imageAlt:
          "Teens organizing a neighborhood clean-up near a drain after rain",
        caption: "Organize a drain clean-up or heat-buddy system after alerts.",
        tipTitle: "Community move",
      },
    ],
  },
};

export function scenesForAge(band: AgeBand): AgeScene[] {
  return AGE_BAND_VISUALS[band].scenes;
}
