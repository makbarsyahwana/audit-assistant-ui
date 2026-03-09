"use client";

import { useSession } from "next-auth/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChevronDown, ChevronRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { CitationCard } from "./citation-card";
import { ConfidenceBar } from "./confidence-bar";
import { AgenticTraceView } from "./agentic-trace";
import type { ChatMessage as ChatMessageType } from "@/types/chat";
import { getInitials, formatConfidence } from "@/lib/utils";

type DetailLevel = "user" | "audit";

interface ChatMessageProps {
  message: ChatMessageType;
  detailLevel?: DetailLevel;
}

export function ChatMessage({ message, detailLevel = "user" }: ChatMessageProps) {
  const { data: session } = useSession();
  const isUser = message.role === "user";
  const isAuditView = detailLevel === "audit";
  const [showTrace, setShowTrace] = useState(false);

  if (isUser) {
    return (
      <div className="flex justify-end animate-fade-in">
        <div className="max-w-[78%]">
          <div className="rounded-xl rounded-br-sm bg-foreground px-4 py-2.5">
            <p className="text-sm text-background leading-relaxed">{message.content}</p>
          </div>
          <p className="mt-1 text-right text-[10px] text-muted-foreground pr-1">
            {getInitials(session?.user?.name || "You")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-3">
      {/* AI response — Harvey uses serif for content */}
      <div className="prose-harvey text-sm leading-[1.8]">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => <p className="mb-3 last:mb-0 font-serif text-foreground leading-[1.8]">{children}</p>,
            ul: ({ children }) => <ul className="mb-3 pl-5 space-y-1 list-disc">{children}</ul>,
            ol: ({ children }) => <ol className="mb-3 pl-5 space-y-1 list-decimal">{children}</ol>,
            li: ({ children }) => <li className="text-sm text-foreground">{children}</li>,
            strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
            h1: ({ children }) => <h1 className="font-serif text-xl font-normal mt-4 mb-2 text-foreground">{children}</h1>,
            h2: ({ children }) => <h2 className="font-serif text-lg font-normal mt-4 mb-2 text-foreground">{children}</h2>,
            h3: ({ children }) => <h3 className="font-serif text-base font-normal mt-3 mb-1 text-foreground">{children}</h3>,
            code: ({ children }) => <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-foreground">{children}</code>,
            blockquote: ({ children }) => <blockquote className="border-l-2 border-border pl-4 italic text-muted-foreground">{children}</blockquote>,
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>

      {/* Deep Analysis badge */}
      {message.complexity === "complex" && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Sparkles className="h-3 w-3 text-accent" />
          <span className="text-accent font-medium">Deep Analysis</span>
          <span className="text-muted-foreground">·</span>
          <span>Agentic loop with planner + critic</span>
        </div>
      )}

      {/* Confidence bar */}
      {message.confidence !== undefined && (
        <ConfidenceBar
          confidence={message.confidence}
          latencyMs={isAuditView ? message.latencyMs : undefined}
          retrievalMode={isAuditView ? message.retrievalMode : undefined}
          explanation={isAuditView ? message.explanation : undefined}
        />
      )}

      {/* Sources */}
      {message.citations && message.citations.length > 0 && (
        <div className="space-y-2 pt-1">
          <p className="text-xs font-medium text-muted-foreground">
            Sources ({message.citations.length})
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {message.citations.map((citation, index) => (
              <CitationCard key={citation.id} citation={citation} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* Audit view extras */}
      {isAuditView && (
        <div className="space-y-2 border-t border-border pt-3">
          {/* Agentic trace */}
          {message.agenticTrace && (
            <AgenticTraceView trace={message.agenticTrace} />
          )}

          {/* Reasoning chain toggle */}
          {message.confidence !== undefined && (
            <div>
              <button
                onClick={() => setShowTrace(!showTrace)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {showTrace ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                Reasoning chain
              </button>
              {showTrace && (
                <div className="mt-2 rounded-lg bg-muted/50 border border-border p-3 space-y-2">
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span>Confidence: <strong className="text-foreground">{formatConfidence(message.confidence)} ({(message.confidence * 100).toFixed(0)}%)</strong></span>
                    {message.retrievalMode && <span>· Mode: <strong className="text-foreground capitalize">{message.retrievalMode}</strong></span>}
                    {message.latencyMs && <span>· <strong className="text-foreground">{message.latencyMs}ms</strong></span>}
                    {message.citations && <span>· <strong className="text-foreground">{message.citations.length}</strong> citations</span>}
                  </div>
                  {message.explanation && (
                    <p className="text-xs text-muted-foreground leading-relaxed border-t border-border pt-2">{message.explanation}</p>
                  )}
                  <p className="text-[10px] text-muted-foreground/60 border-t border-border pt-2 font-mono">
                    policyCheck → queryRouter → retrieve → generate → guardrails → logAuditTrail
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
