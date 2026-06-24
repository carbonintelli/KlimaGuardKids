import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  bookConsultantSlot,
  getConsultantSlots,
} from "@/lib/consultant-scheduler";
import { checkMessagePrivacy } from "@/lib/privacy-guard";

const bodySchema = z.object({
  sessionId: z.string().min(8).max(64),
  slotId: z.string().min(4),
  ageBand: z.enum(["5-8", "9-12", "13-17"]),
  countryCode: z.string().length(2),
  reason: z.string().min(3).max(200),
  topic: z.string().optional(),
  caregiverConsent: z.boolean(),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      sessionId,
      slotId,
      ageBand,
      countryCode,
      reason,
      topic,
      caregiverConsent,
    } = parsed.data;

    if (!caregiverConsent) {
      return NextResponse.json(
        {
          error: "Caregiver consent required",
          message: "A parent or guardian must confirm before booking a consultant call.",
        },
        { status: 403 }
      );
    }

    const privacy = checkMessagePrivacy(reason);
    if (!privacy.safe) {
      return NextResponse.json(
        {
          error: "Reason blocked",
          message: privacy.blockedReason ?? "Please describe your question without personal details.",
        },
        { status: 400 }
      );
    }

    const slots = getConsultantSlots({
      countryCode: countryCode.toUpperCase(),
      topic: topic ?? "default",
      limit: 6,
    });

    const booking = bookConsultantSlot({
      sessionId,
      slotId,
      ageBand,
      reason: privacy.sanitizedMessage,
      slots,
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Slot unavailable", message: "That time is no longer available. Please pick another." },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      booking,
      privacyNote:
        "Booking is held in your browser session only. No email or phone is stored on our servers in this demo.",
    });
  } catch (e) {
    console.error("Consultant schedule error:", e);
    return NextResponse.json(
      {
        error: "Scheduling failed",
        message: e instanceof Error ? e.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const countryCode = req.nextUrl.searchParams.get("countryCode") ?? "IN";
  const topic = req.nextUrl.searchParams.get("topic") ?? "default";

  const slots = getConsultantSlots({
    countryCode: countryCode.toUpperCase(),
    topic,
    limit: 5,
  });

  return NextResponse.json({
    service: "KlimaGuard Consultant Scheduling",
    slots,
    note: "Demo slots only — production would integrate with a certified telehealth provider.",
  });
}
