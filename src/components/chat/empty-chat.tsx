"use client";

import { MessageSquare, FileSearch, Shield, BarChart3 } from "lucide-react";
import { Typewriter } from "@/components/fancy/typewriter";

const suggestions = [
  {
    icon: FileSearch,
    label: "Review Evidence",
    query: "Show me the latest access review evidence for Q2 2025",
  },
  {
    icon: Shield,
    label: "Risk Assessment",
    query: "What are the ISO 27001 requirements for risk assessment?",
  },
  {
    icon: BarChart3,
    label: "Control Testing",
    query: "List all change management controls and their testing status",
  },
];

interface EmptyChatProps {
  onSuggestionClick: (query: string) => void;
}

export function EmptyChat({ onSuggestionClick }: EmptyChatProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-6">
        <MessageSquare className="h-8 w-8 text-primary" />
      </div>

      <h2 className="text-xl font-semibold mb-1">
        <Typewriter
          text="How can I help with your audit?"
          speed={40}
          cursor={false}
        />
      </h2>
      <p className="text-sm text-muted-foreground mb-8 text-center max-w-md">
        Ask questions about your audit documents, standards, and evidence.
        Responses include citations and confidence scores.
      </p>

      <div className="grid gap-3 w-full max-w-lg">
        {suggestions.map((suggestion) => {
          const Icon = suggestion.icon;
          return (
            <button
              key={suggestion.label}
              onClick={() => onSuggestionClick(suggestion.query)}
              className="flex items-center gap-3 rounded-lg border bg-card p-3 text-left text-sm transition-colors hover:bg-accent hover:border-accent"
            >
              <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="font-medium">{suggestion.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {suggestion.query}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
