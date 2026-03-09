"use client";

import { useModeContext } from "@/contexts/ModeContext";

interface EmptyChatProps {
  onSuggestionClick: (query: string) => void;
}

export function EmptyChat({ onSuggestionClick }: EmptyChatProps) {
  const { config } = useModeContext();

  return (
    <div className="flex h-full flex-col items-center justify-center px-8 py-16">
      <div className="w-full max-w-2xl space-y-8">
        {/* Harvey-style heading — Instrument Serif */}
        <div className="text-center space-y-2">
          <h1 className="font-serif text-3xl font-normal text-foreground leading-snug">
            {config.terminology.counselGreeting}
          </h1>
          <p className="text-sm text-muted-foreground">
            {config.terminology.counselSubtitle}
          </p>
        </div>

        {/* Suggestion grid */}
        <div className="grid grid-cols-2 gap-2">
          {config.suggestions.map((suggestion) => (
            <button
              key={suggestion.label}
              onClick={() => onSuggestionClick(suggestion.query)}
              className="group rounded-lg border border-border bg-card p-3.5 text-left transition-all hover:border-foreground/20 hover:shadow-sm"
            >
              <p className="text-sm font-medium text-foreground group-hover:text-foreground">
                {suggestion.label}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                {suggestion.query}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
