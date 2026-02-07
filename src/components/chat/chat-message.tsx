"use client";

import { useSession } from "next-auth/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bot } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CitationCard } from "./citation-card";
import { ConfidenceBar } from "./confidence-bar";
import type { ChatMessage as ChatMessageType } from "@/types/chat";
import { cn, getInitials } from "@/lib/utils";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { data: session } = useSession();
  const isUser = message.role === "user";

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
              latencyMs={message.latencyMs}
              retrievalMode={message.retrievalMode}
              explanation={message.explanation}
            />
          </div>
        )}
      </div>
    </div>
  );
}
