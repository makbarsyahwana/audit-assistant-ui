"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Trash2, Eye, ShieldCheck } from "lucide-react";
import { ChatMessage } from "@/components/chat/chat-message";
import { ChatInput } from "@/components/chat/chat-input";
import { EmptyChat } from "@/components/chat/empty-chat";
import { DeepAnalysisProgress } from "@/components/chat/deep-analysis-progress";
import { useChat } from "@/hooks/useChat";
import { cn } from "@/lib/utils";

export type DetailLevel = "user" | "audit";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const engagementId = searchParams.get("engagement") ?? undefined;
  const { messages, loading, sendMessage, clearMessages } = useChat(engagementId);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [detailLevel, setDetailLevel] = useState<DetailLevel>("user");
  const [isDeepAnalysis, setIsDeepAnalysis] = useState(false);

  const handleSendMessage = (message: string, options?: { forceDeepAnalysis?: boolean }) => {
    setIsDeepAnalysis(options?.forceDeepAnalysis || false);
    sendMessage(message, options);
  };

  useEffect(() => {
    if (!loading) {
      setIsDeepAnalysis(false);
    }
  }, [loading]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Slim Harvey-style toolbar — only visible when there are messages */}
      {messages.length > 0 && (
        <div className="flex items-center justify-between border-b border-border px-8 py-2">
          <div className="flex items-center rounded-md border border-border p-0.5 gap-0.5">
            <button
              onClick={() => setDetailLevel("user")}
              className={cn(
                "flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors",
                detailLevel === "user"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Eye className="h-3 w-3" />
              User
            </button>
            <button
              onClick={() => setDetailLevel("audit")}
              className={cn(
                "flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors",
                detailLevel === "audit"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <ShieldCheck className="h-3 w-3" />
              Audit
            </button>
          </div>
          <button
            onClick={() => {
              clearMessages();
              setIsDeepAnalysis(false);
            }}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Trash2 className="h-3 w-3" />
            Clear
          </button>
        </div>
      )}

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin">
        {messages.length === 0 ? (
          <EmptyChat onSuggestionClick={(msg) => handleSendMessage(msg)} />
        ) : (
          <div className="mx-auto max-w-3xl space-y-8 px-8 py-8">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} detailLevel={detailLevel} />
            ))}
            {loading && isDeepAnalysis && (
              <DeepAnalysisProgress isActive={true} />
            )}
            {loading && !isDeepAnalysis && (
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground">Working…</p>
                <div className="flex gap-1 pl-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 animate-pulse" />
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 animate-pulse [animation-delay:0.15s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50 animate-pulse [animation-delay:0.3s]" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Harvey-style floating input */}
      <div className="px-8 pb-6 pt-2">
        <div className="mx-auto max-w-3xl">
          <ChatInput onSend={handleSendMessage} loading={loading} />
        </div>
      </div>
    </div>
  );
}
