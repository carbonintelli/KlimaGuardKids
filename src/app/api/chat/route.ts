import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateChatResponse } from "@/lib/agents/chat-agent";
import { runAgentPipeline } from "@/lib/agents/orchestrator";
import { COUNTRIES, CITY_BY_COUNTRY } from "@/lib/countries";
import { checkMessagePrivacy } from "@/lib/privacy-guard";
import type { SynthesisReport } from "@/lib/types";

const bodySchema = z.object({
  sessionId: z.string().min(8).max(64).optional(),
  message: z.string().min(1).max(500),
  ageBand: z.enum(["5-8", "9-12", "13-17"]),
  countryCode: z.string().length(2),
  regionId: z.string().optional(),
  caregiverConsent: z.boolean(),
  reportContext: z.custom<SynthesisReport>().optional(),
  fetchLiveContext: z.boolean().optional(),
});

function createSessionId(): string {
  return `sess-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

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
      message,
      ageBand,
      countryCode,
      regionId,
      caregiverConsent,
      reportContext,
      fetchLiveContext,
    } = parsed.data;

    if (!caregiverConsent) {
      return NextResponse.json(
        {
          error: "Caregiver consent required",
          message:
            "A parent or guardian must agree to supervise this chat before continuing.",
        },
        { status: 403 }
      );
    }

    const privacy = checkMessagePrivacy(message);
    if (!privacy.safe) {
      return NextResponse.json({
        sessionId: parsed.data.sessionId ?? createSessionId(),
        blocked: true,
        message: {
          id: `msg-blocked-${Date.now()}`,
          role: "assistant" as const,
          content: privacy.blockedReason ?? "This message cannot be processed.",
          timestamp: new Date().toISOString(),
          actionSuggested: "consult-caregiver" as const,
        },
        privacyWarnings: privacy.warnings,
        reportContextUsed: false,
        consultantAvailable: false,
      });
    }

    const code = countryCode.toUpperCase();
    const country = COUNTRIES.find((c) => c.code === code);
    const preset = CITY_BY_COUNTRY[code];

    if (!country || !preset) {
      return NextResponse.json(
        { error: "Country not supported in demo registry" },
        { status: 404 }
      );
    }

    let report = reportContext;
    if (!report && fetchLiveContext) {
      report = await runAgentPipeline({
        country: country.name,
        countryCode: code,
        city: preset.city,
        lat: preset.lat,
        lon: preset.lon,
        regionId,
      });
    }

    const sessionId = parsed.data.sessionId ?? createSessionId();
    const response = generateChatResponse({
      sessionId,
      message: privacy.sanitizedMessage,
      ageBand,
      countryCode: code,
      report,
    });

    return NextResponse.json({
      ...response,
      privacyWarnings: privacy.warnings,
      blocked: false,
    });
  } catch (e) {
    console.error("Chat error:", e);
    return NextResponse.json(
      {
        error: "Chat agent failed",
        message: e instanceof Error ? e.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: "KlimaGuard Kids Health Chat API",
    version: "0.3.0",
    agent: "chat",
    features: [
      "age-banded responses (5-8, 9-12, 13-17)",
      "climate-health context from agent pipeline",
      "privacy filtering (no PII, no diagnosis)",
      "consultant call scheduling",
    ],
    privacy: {
      persistence: "none — messages are not stored server-side",
      consent: "caregiverConsent required per session",
    },
  });
}
