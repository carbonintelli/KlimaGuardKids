import { NextResponse } from "next/server";

export function caregiverConsentDeniedResponse(context: "chat" | "booking") {
  const message =
    context === "booking"
      ? "A parent or guardian must confirm before booking a consultant call."
      : "A parent or guardian must agree to supervise this chat before continuing.";

  return NextResponse.json(
    {
      success: false,
      blocked: true,
      caregiverConsent: false,
      error: "Caregiver consent required",
      message,
    },
    { status: 403 }
  );
}
