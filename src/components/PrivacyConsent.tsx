"use client";

import { CAREGIVER_CONSENT_TEXT } from "@/lib/privacy-guard";
import { Lock, ShieldCheck } from "lucide-react";

interface PrivacyConsentProps {
  consented: boolean;
  onConsentChange: (value: boolean) => void;
  disabled?: boolean;
}

export function PrivacyConsent({
  consented,
  onConsentChange,
  disabled,
}: PrivacyConsentProps) {
  return (
    <div className="rounded-2xl border border-sky-200 bg-sky-50/80 p-4">
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-ocean" />
        <div className="flex-1 text-sm">
          <p className="font-bold text-ink">Privacy & safety first</p>
          <ul className="mt-2 space-y-1 text-ink/70">
            <li className="flex items-center gap-2">
              <Lock className="h-3.5 w-3.5 text-ocean" />
              Messages are not saved on our servers
            </li>
            <li>Do not share your name, address, phone, or school</li>
            <li>This is not a doctor — always ask a caring adult for serious concerns</li>
          </ul>
          <label className="mt-3 flex cursor-pointer items-start gap-2">
            <input
              type="checkbox"
              checked={consented}
              onChange={(e) => onConsentChange(e.target.checked)}
              disabled={disabled}
              className="mt-1 h-4 w-4 rounded border-sky-300 text-ocean focus:ring-ocean"
            />
            <span className="font-medium text-ink/90">{CAREGIVER_CONSENT_TEXT}</span>
          </label>
        </div>
      </div>
    </div>
  );
}
