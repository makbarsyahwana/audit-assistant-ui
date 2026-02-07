"use client";

import { useSession } from "next-auth/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bot, Info, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CitationCard } from "./citation-card";
import { ConfidenceBar } from "./confidence-bar";
import type { ChatMessage as ChatMessageType } from "@/types/chat";
import { cn, getInitials, formatConfidence } from "@/lib/utils";

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

  return (
    <div
      className={cn(
        "flex gap-3 animate-fade-in",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar className="h-8 w-8 shrink-0 mt-0.5">
        <AvatarFallback
          className={cn(
            "text-xs",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-blue-600 text-white"
          )}
        >
          {isUser ? (
            getInitials(session?.user?.name || "U")
          ) : (
            <Bot className="h-4 w-4" />
          )}
        </AvatarFallback>
      </Avatar>

      <div
        className={cn(
          "flex flex-col gap-2 max-w-[80%]",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "rounded-xl px-4 py-2.5 text-sm",
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-muted rounded-tl-sm"
          )}
        >
          <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-li:my-0.5 prose-headings:mt-3 prose-headings:mb-1">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
        </div>

        {!isUser && message.citations && message.citations.length > 0 && (
          <div className="w-full space-y-2">
            <p className="text-xs font-medium text-muted-foreground px-1">
              Sources ({message.citations.length})
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {message.citations.map((citation, index) => (
                <CitationCard
                  key={citation.id}
                  citation={citation}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}

        {!isUser && message.confidence !== undefined && (
          <div className="px-1">
            <ConfidenceBar
              confidence={message.confidence}
              latencyMs={isAuditView ? message.latencyMs : undefined}
              retrievalMode={isAuditView ? message.retrievalMode : undefined}
              explanation={isAuditView ? message.explanation : undefined}
            />
          </div>
        )}

        {/* Audit-facing: full reasoning chain */}
        {!isUser && isAuditView && message.confidence !== undefined && (
          <div className="w-full px-1">
            <button
              onClick={() => setShowTrace(!showTrace)}
              className="flex items-center gap-1.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
            >
              {showTrace ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              <Info className="h-3 w-3" />
              Agent Reasoning Chain
            </button>
            {showTrace && (
              <div className="mt-2 rounded-lg border bg-muted/30 p-3 space-y-2 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-[10px]">
                    Confidence: {formatConfidence(message.confidence)} ({(message.confidence * 100).toFixed(0)}%)
                  </Badge>
                  {message.retrievalMode && (
                    <Badge variant="secondary" className="text-[10px] capitalize">
                      Mode: {message.retrievalMode}
                    </Badge>
                  )}
                  {message.latencyMs && (
                    <Badge variant="secondary" className="text-[10px]">
                      {message.latencyMs}ms
                    </Badge>
                  )}
                  {message.citations && (
                    <Badge variant="secondary" className="text-[10px]">
                      {message.citations.length} citations
                    </Badge>
                  )}
                </div>
                {message.explanation && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-[10px] font-semibold text-muted-foreground mb-1">Explanation</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{message.explanation}</p>
                    </div>
                  </>
                )}
                <Separator />
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <span>policyCheck → queryRouter → retrieve → generate → guardrails → logAuditTrail</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
