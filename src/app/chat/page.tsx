"use client";

import { ChatPanel } from "@/components/ChatPanel";
import { MessageCircle } from "lucide-react";

export default function ChatPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-ink flex items-center gap-3">
          <MessageCircle className="h-8 w-8 text-ocean" />
          Kids health chat
        </h1>
        <p className="mt-2 max-w-2xl text-ink/70">
          Ask questions about staying healthy — including how climate affects your
          body, germs, food, and feelings. Answers match your age level and can use
          live climate-health data for your area. Chat privately in your browser;
          schedule a consultant call when you need expert help.
        </p>
      </div>

      <ChatPanel />
    </div>
  );
}
