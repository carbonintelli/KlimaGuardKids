"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  AgeBand,
  ChatMessage,
  ConsultantBooking,
  ConsultantSlot,
  CountryOption,
  SynthesisReport,
} from "@/lib/types";
import { starterPrompts } from "@/lib/agents/chat-agent";
import { AgeBandPicker } from "@/components/AgeBandPicker";
import { PrivacyConsent } from "@/components/PrivacyConsent";
import { CountrySelector } from "@/components/CountrySelector";
import { IndiaRegionSelector } from "@/components/IndiaRegionSelector";
import { INDIA_REGIONS } from "@/lib/india-regions";
import {
  CalendarCheck,
  Loader2,
  MessageCircle,
  Send,
  Sparkles,
  Trash2,
} from "lucide-react";

const SESSION_KEY = "klimaguard-chat-session";

function loadSession(): { sessionId: string; messages: ChatMessage[] } {
  if (typeof window === "undefined") {
    return { sessionId: "", messages: [] };
  }
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return { sessionId: "", messages: [] };
    return JSON.parse(raw) as { sessionId: string; messages: ChatMessage[] };
  } catch {
    return { sessionId: "", messages: [] };
  }
}

function saveSession(sessionId: string, messages: ChatMessage[]) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ sessionId, messages }));
}

function formatSlotTime(iso: string, timezone: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone: timezone,
    }).format(new Date(iso));
  } catch {
    return new Date(iso).toLocaleString();
  }
}

export function ChatPanel() {
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [countryCode, setCountryCode] = useState("IN");
  const [regionId, setRegionId] = useState("delhi-ncr");
  const [ageBand, setAgeBand] = useState<AgeBand>("9-12");
  const [consented, setConsented] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [contextLoading, setContextLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<SynthesisReport | null>(null);
  const [consultantSlots, setConsultantSlots] = useState<ConsultantSlot[]>([]);
  const [booking, setBooking] = useState<ConsultantBooking | null>(null);
  const [bookingSlotId, setBookingSlotId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const isIndia = countryCode === "IN";

  useEffect(() => {
    const saved = loadSession();
    if (saved.sessionId) setSessionId(saved.sessionId);
    if (saved.messages.length) setMessages(saved.messages);
  }, []);

  useEffect(() => {
    fetch("/api/countries")
      .then((r) => r.json())
      .then((data: CountryOption[]) => setCountries(data))
      .catch(() => setError("Could not load countries"));
  }, []);

  useEffect(() => {
    if (sessionId) {
      saveSession(sessionId, messages);
    }
  }, [sessionId, messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, consultantSlots, booking]);

  const loadLiveContext = useCallback(async () => {
    setContextLoading(true);
    setError(null);
    try {
      const body: { countryCode: string; regionId?: string } = { countryCode };
      if (isIndia) body.regionId = regionId;

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? data.error ?? "Context load failed");
      setReport(data as SynthesisReport);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setContextLoading(false);
    }
  }, [countryCode, isIndia, regionId]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      if (!consented) {
        setError("Please confirm caregiver consent before chatting.");
        return;
      }

      setLoading(true);
      setError(null);
      setBooking(null);

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: trimmed,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: sessionId || undefined,
            message: trimmed,
            ageBand,
            countryCode,
            regionId: isIndia ? regionId : undefined,
            caregiverConsent: consented,
            reportContext: report ?? undefined,
            fetchLiveContext: !report,
          }),
        });

        const data = await res.json();
        if (!res.ok && !data.message) {
          throw new Error(data.message ?? data.error ?? "Chat failed");
        }

        if (data.sessionId) setSessionId(data.sessionId);
        if (data.message) {
          setMessages((prev) => [...prev, data.message as ChatMessage]);
        }
        if (data.consultantSlots?.length) {
          setConsultantSlots(data.consultantSlots);
        } else if (data.message?.actionSuggested !== "schedule-consultant") {
          setConsultantSlots([]);
        }

        if (data.privacyWarnings?.length) {
          setError(data.privacyWarnings.join(" "));
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [
      loading,
      consented,
      sessionId,
      ageBand,
      countryCode,
      isIndia,
      regionId,
      report,
    ]
  );

  const bookSlot = useCallback(
    async (slot: ConsultantSlot) => {
      if (!consented || !sessionId) return;
      setBookingSlotId(slot.id);
      setError(null);

      try {
        const res = await fetch("/api/consultant/schedule", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            slotId: slot.id,
            ageBand,
            countryCode,
            reason: "Climate-health question from kids chat",
            topic: slot.specialty,
            caregiverConsent: consented,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message ?? data.error ?? "Booking failed");
        setBooking(data.booking as ConsultantBooking);
        setConsultantSlots([]);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setBookingSlotId(null);
      }
    },
    [consented, sessionId, ageBand, countryCode]
  );

  const clearChat = () => {
    setMessages([]);
    setConsultantSlots([]);
    setBooking(null);
    setSessionId("");
    sessionStorage.removeItem(SESSION_KEY);
  };

  const prompts = starterPrompts(ageBand);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,320px)_1fr]">
      <aside className="space-y-4">
        <div className="rounded-3xl border border-sky-100 bg-white p-5 shadow-lg">
          <CountrySelector
            countries={
              countries.length
                ? countries
                : [{ code: "IN", name: "India", flag: "🇮🇳" }]
            }
            value={countryCode}
            onChange={setCountryCode}
            disabled={loading}
          />
          {isIndia && (
            <div className="mt-4">
              <IndiaRegionSelector
                regions={INDIA_REGIONS}
                value={regionId}
                onChange={setRegionId}
                disabled={loading}
              />
            </div>
          )}
          <div className="mt-4">
            <AgeBandPicker
              value={ageBand}
              onChange={setAgeBand}
              disabled={loading}
            />
          </div>
          <button
            type="button"
            onClick={loadLiveContext}
            disabled={contextLoading || loading}
            className="mt-4 w-full rounded-xl border border-ocean/30 bg-ocean/5 py-2.5 text-sm font-bold text-ocean hover:bg-ocean/10 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {contextLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading climate context…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                {report ? "Refresh local climate context" : "Load local climate context"}
              </>
            )}
          </button>
          {report && (
            <p className="mt-2 text-xs text-ink/60">
              Context: {report.location.city} · {report.overallRisk} risk ·{" "}
              {report.disruptionWindow}
            </p>
          )}
        </div>

        <PrivacyConsent
          consented={consented}
          onConsentChange={setConsented}
          disabled={loading}
        />
      </aside>

      <section className="flex min-h-[520px] flex-col rounded-3xl border border-sky-100 bg-white shadow-lg overflow-hidden">
        <div className="flex items-center justify-between border-b border-sky-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-ocean" />
            <h2 className="font-extrabold text-ink">Health chat for kids</h2>
          </div>
          <button
            type="button"
            onClick={clearChat}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-ink/50 hover:bg-sky-50 hover:text-ink"
            title="Clear chat (browser only)"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.length === 0 && (
            <div className="rounded-2xl bg-sky-50 p-4 text-sm text-ink/70">
              <p className="font-bold text-ink">Ask anything about health & climate!</p>
              <p className="mt-1">
                Answers are tailored to your age and can use live weather-health data
                for your location.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {prompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    disabled={!consented || loading}
                    onClick={() => sendMessage(prompt)}
                    className="rounded-full border border-sky-200 bg-white px-3 py-1.5 text-xs font-semibold text-ocean hover:bg-ocean/5 disabled:opacity-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                  msg.role === "user"
                    ? "bg-ocean text-white"
                    : "bg-sky-50 text-ink border border-sky-100"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                {msg.citations && msg.citations.length > 0 && msg.role === "assistant" && (
                  <p className="mt-2 text-xs opacity-70">
                    Sources: {msg.citations.join(" · ")}
                  </p>
                )}
                {msg.actionSuggested === "consult-caregiver" && msg.role === "assistant" && (
                  <p className="mt-2 text-xs font-semibold text-saffron">
                    👨‍👩‍👧 Talk to a caring adult about this
                  </p>
                )}
              </div>
            </div>
          ))}

          {consultantSlots.length > 0 && (
            <div className="rounded-2xl border border-leaf/30 bg-leaf/5 p-4">
              <p className="flex items-center gap-2 font-bold text-ink text-sm">
                <CalendarCheck className="h-4 w-4 text-leaf" />
                Schedule a call with a health consultant
              </p>
              <p className="mt-1 text-xs text-ink/60">
                A caring adult should join for children under 13. Demo bookings stay in
                your browser only.
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {consultantSlots.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={!consented || bookingSlotId === slot.id}
                    onClick={() => bookSlot(slot)}
                    className="rounded-xl border border-sky-200 bg-white p-3 text-left text-xs hover:border-ocean disabled:opacity-60"
                  >
                    <p className="font-bold text-ink">{slot.consultantName}</p>
                    <p className="text-ink/60">{slot.specialty}</p>
                    <p className="mt-1 font-semibold text-ocean">
                      {formatSlotTime(slot.datetime, slot.timezone)}
                    </p>
                    {bookingSlotId === slot.id && (
                      <span className="mt-1 flex items-center gap-1 text-ink/50">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Booking…
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {booking && (
            <div className="rounded-2xl border border-ocean/30 bg-ocean/5 p-4 text-sm">
              <p className="font-bold text-ocean">Call scheduled!</p>
              <p className="mt-1 text-ink/80">
                {booking.consultantName} · {booking.specialty}
              </p>
              <p className="mt-1 font-semibold">
                {formatSlotTime(booking.datetime, booking.timezone)} ({booking.durationMinutes}{" "}
                min)
              </p>
              <p className="mt-2 text-xs text-ink/60">{booking.confirmationNote}</p>
            </div>
          )}

          {loading && (
            <div className="flex items-center gap-2 text-sm text-ink/50">
              <Loader2 className="h-4 w-4 animate-spin" />
              Thinking with health agents…
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {error && (
          <p className="px-5 pb-2 text-sm font-medium text-coral">{error}</p>
        )}

        <form
          className="border-t border-sky-100 p-4"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={!consented || loading}
              placeholder={
                consented
                  ? "Ask about health, weather, germs, food, or climate…"
                  : "Confirm consent above to start chatting"
              }
              maxLength={500}
              className="flex-1 rounded-2xl border border-sky-200 px-4 py-3 text-sm outline-none focus:border-ocean focus:ring-2 focus:ring-ocean/20 disabled:bg-sky-50"
            />
            <button
              type="submit"
              disabled={!consented || loading || !input.trim()}
              className="rounded-2xl bg-ocean px-4 py-3 text-white shadow-md hover:bg-sky-600 disabled:opacity-50"
              aria-label="Send message"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
