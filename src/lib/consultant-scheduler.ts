import type {
  AgeBand,
  ConsultantBooking,
  ConsultantSlot,
} from "./types";

const CONSULTANTS = [
  { name: "Dr. Priya Sharma", specialty: "Pediatric climate-health" },
  { name: "Dr. James Okonkwo", specialty: "Child nutrition & hydration" },
  { name: "Dr. Maria Santos", specialty: "Respiratory & air quality" },
  { name: "Dr. Ananya Patel", specialty: "Vector-borne disease prevention" },
  { name: "Nurse Counselor Lee", specialty: "Child wellness & anxiety support" },
];

const SPECIALTY_BY_TOPIC: Record<string, string> = {
  heat: "Pediatric climate-health",
  respiratory: "Respiratory & air quality",
  vector: "Vector-borne disease prevention",
  water: "Pediatric climate-health",
  nutrition: "Child nutrition & hydration",
  mental: "Child wellness & anxiety support",
  emergency: "Pediatric climate-health",
  default: "Pediatric climate-health",
};

function pickTimezone(countryCode: string): string {
  const map: Record<string, string> = {
    IN: "Asia/Kolkata",
    US: "America/New_York",
    GB: "Europe/London",
    AU: "Australia/Sydney",
    JP: "Asia/Tokyo",
    BR: "America/Sao_Paulo",
  };
  return map[countryCode.toUpperCase()] ?? "UTC";
}

function nextWeekdaySlots(base: Date, count: number): Date[] {
  const slots: Date[] = [];
  const cursor = new Date(base);
  cursor.setHours(9, 0, 0, 0);

  while (slots.length < count) {
    cursor.setDate(cursor.getDate() + 1);
    const day = cursor.getDay();
    if (day === 0 || day === 6) continue;
    slots.push(new Date(cursor));
    cursor.setHours(cursor.getHours() + 3);
    if (cursor.getHours() >= 17) {
      cursor.setHours(9, 0, 0, 0);
    }
  }

  return slots;
}

export function getConsultantSlots(params: {
  countryCode: string;
  topic?: string;
  limit?: number;
}): ConsultantSlot[] {
  const { countryCode, topic = "default", limit = 4 } = params;
  const timezone = pickTimezone(countryCode);
  const specialty =
    SPECIALTY_BY_TOPIC[topic] ?? SPECIALTY_BY_TOPIC.default;
  const matching = CONSULTANTS.filter((c) => c.specialty === specialty);
  const pool = matching.length ? matching : CONSULTANTS;
  const times = nextWeekdaySlots(new Date(), limit);

  return times.map((datetime, index) => {
    const consultant = pool[index % pool.length];
    return {
      id: `slot-${datetime.getTime()}-${index}`,
      consultantName: consultant.name,
      specialty: consultant.specialty,
      datetime: datetime.toISOString(),
      durationMinutes: 20,
      timezone,
      available: true,
    };
  });
}

export function bookConsultantSlot(params: {
  sessionId: string;
  slotId: string;
  ageBand: AgeBand;
  reason: string;
  slots: ConsultantSlot[];
}): ConsultantBooking | null {
  const slot = params.slots.find((s) => s.id === params.slotId && s.available);
  if (!slot) return null;

  const reasonSummary = params.reason.slice(0, 120);

  return {
    bookingId: `bk-${params.sessionId.slice(0, 8)}-${Date.now()}`,
    slotId: slot.id,
    consultantName: slot.consultantName,
    specialty: slot.specialty,
    datetime: slot.datetime,
    durationMinutes: slot.durationMinutes,
    timezone: slot.timezone,
    sessionId: params.sessionId,
    ageBand: params.ageBand,
    reasonSummary,
    confirmationNote:
      "A caring adult will receive call details in a full production system. This demo confirms the slot only in your browser session — no personal data is stored on our servers.",
  };
}
