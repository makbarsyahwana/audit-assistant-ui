"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowRight, Loader2, Paperclip, Sparkles, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string, options?: { forceDeepAnalysis?: boolean }) => void;
  loading?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  loading = false,
  placeholder = "Ask a question about your audit documents…",
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const [deepAnalysis, setDeepAnalysis] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    onSend(input.trim(), { forceDeepAnalysis: deepAnalysis });
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Harvey-style floating card */}
      <div className="rounded-xl border border-border bg-card shadow-sm focus-within:shadow-md focus-within:border-foreground/20 transition-all">
        {/* Textarea */}
        <div className="px-4 pt-4 pb-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={3}
            disabled={loading}
            className="w-full resize-none bg-transparent text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/60 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 scrollbar-thin"
          />
        </div>

        {/* Bottom toolbar */}
        <div className="flex items-center justify-between border-t border-border/60 px-3 py-2">
          {/* Left: tool toggles */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Paperclip className="h-3.5 w-3.5" />
              Files
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Globe className="h-3.5 w-3.5" />
              Sources
            </button>
            <button
              type="button"
              onClick={() => setDeepAnalysis(!deepAnalysis)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                deepAnalysis
                  ? "bg-accent/10 text-accent font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Sparkles className="h-3.5 w-3.5" />
              {deepAnalysis ? "Deep Analysis" : "Improve"}
            </button>
          </div>

          {/* Right: send button — Harvey dark rounded button */}
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
              input.trim() && !loading
                ? "bg-foreground text-background hover:bg-foreground/85"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ArrowRight className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
