import type { PrivacyCheckResult } from "./types";

const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const PHONE_PATTERN =
  /(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{2,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{3,4}\b/g;
const ADDRESS_HINTS =
  /\b(?:street|st\.|road|rd\.|avenue|ave\.|lane|ln\.|apartment|apt\.|flat|house\s*no|pin\s*code|zip\s*code)\b/gi;
const NAME_INTRO_PATTERN =
  /\b(?:my name is|i am|i'm|call me)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,3}/gi;

const DIAGNOSIS_REQUESTS = [
  /\b(?:diagnos|what (?:disease|illness) do i have)\b/i,
  /\b(?:prescribe|give me (?:medicine|medication|antibiotic))\b/i,
  /\b(?:should i take|can i take)\s+\w+\s+(?:mg|pill|tablet)\b/i,
];

const BLOCKED_TOPICS = [
  /\b(?:suicid|kill myself|hurt myself|self[- ]harm)\b/i,
];

export function checkMessagePrivacy(message: string): PrivacyCheckResult {
  const trimmed = message.trim();
  if (!trimmed) {
    return {
      safe: false,
      sanitizedMessage: "",
      warnings: [],
      blockedReason: "Please type a question so we can help you.",
    };
  }

  for (const pattern of BLOCKED_TOPICS) {
    if (pattern.test(trimmed)) {
      return {
        safe: false,
        sanitizedMessage: "",
        warnings: [],
        blockedReason:
          "If you are feeling very upset or unsafe, please talk to a trusted adult, parent, teacher, or counselor right away. You can also ask a grown-up to call your local emergency or child helpline.",
      };
    }
  }

  const warnings: string[] = [];
  let sanitized = trimmed;

  if (EMAIL_PATTERN.test(trimmed)) {
    warnings.push("We removed an email address to protect your privacy.");
    sanitized = sanitized.replace(EMAIL_PATTERN, "[private info removed]");
  }

  if (PHONE_PATTERN.test(sanitized)) {
    warnings.push("We removed a phone number to protect your privacy.");
    sanitized = sanitized.replace(PHONE_PATTERN, "[private info removed]");
  }

  if (ADDRESS_HINTS.test(sanitized)) {
    warnings.push("Please do not share your home address in chat.");
    sanitized = sanitized.replace(ADDRESS_HINTS, "[location detail]");
  }

  if (NAME_INTRO_PATTERN.test(sanitized)) {
    warnings.push("Please do not share your full name in chat.");
    sanitized = sanitized.replace(NAME_INTRO_PATTERN, "I have a question");
  }

  for (const pattern of DIAGNOSIS_REQUESTS) {
    if (pattern.test(sanitized)) {
      return {
        safe: false,
        sanitizedMessage: sanitized,
        warnings,
        blockedReason:
          "I cannot diagnose illnesses or prescribe medicine. A caring adult or health consultant can help with that. Would you like tips on staying healthy instead?",
      };
    }
  }

  return {
    safe: true,
    sanitizedMessage: sanitized.slice(0, 500),
    warnings,
  };
}

export const PRIVACY_NOTICE =
  "This chat does not save your messages on our servers. Do not share your full name, address, phone number, or school. A caring adult should supervise children under 13.";

export const CAREGIVER_CONSENT_TEXT =
  "I understand this is not a doctor. My child will not share personal details. I agree to supervise this chat session.";
