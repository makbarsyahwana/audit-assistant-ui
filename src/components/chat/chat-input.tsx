"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowRight, Loader2, Paperclip, Sparkles, Globe, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGlobalDocuments } from "@/hooks/useGlobalDocuments";

interface ChatInputProps {
  onSend: (message: string, options?: { forceDeepAnalysis?: boolean; knowledgeSourceIds?: string[] }) => void;
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
  const [showSources, setShowSources] = useState(false);
  const [selectedSourceIds, setSelectedSourceIds] = useState<string[]>([]);
  const sourcesRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { documents: globalDocs } = useGlobalDocuments();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sourcesRef.current && !sourcesRef.current.contains(e.target as Node)) {
        setShowSources(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function toggleSource(id: string) {
    setSelectedSourceIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    onSend(input.trim(), {
      forceDeepAnalysis: deepAnalysis,
      knowledgeSourceIds: selectedSourceIds.length > 0 ? selectedSourceIds : undefined,
    });
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

            {/* Sources dropdown */}
            <div ref={sourcesRef} className="relative">
              <button
                type="button"
                onClick={() => setShowSources((v) => !v)}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                  selectedSourceIds.length > 0
                    ? "bg-accent/10 text-accent font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Globe className="h-3.5 w-3.5" />
                Sources
                {selectedSourceIds.length > 0 && (
                  <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white">
                    {selectedSourceIds.length}
                  </span>
                )}
              </button>

              {showSources && (
                <div className="absolute bottom-full left-0 mb-2 w-72 rounded-lg border border-border bg-card shadow-lg z-50">
                  <div className="flex items-center justify-between border-b border-border px-3 py-2">
                    <span className="text-xs font-semibold text-foreground">External Knowledge Sources</span>
                    {selectedSourceIds.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedSourceIds([])}
                        className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X className="h-3 w-3" />
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="max-h-56 overflow-y-auto py-1 scrollbar-thin">
                    {globalDocs.length === 0 ? (
                      <p className="px-3 py-4 text-center text-xs text-muted-foreground">
                        No external sources available
                      </p>
                    ) : (
                      globalDocs.map((doc) => {
                        const selected = selectedSourceIds.includes(doc.id);
                        return (
                          <button
                            key={doc.id}
                            type="button"
                            onClick={() => toggleSource(doc.id)}
                            className={cn(
                              "flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs transition-colors hover:bg-muted",
                              selected && "bg-accent/5"
                            )}
                          >
                            <span className={cn(
                              "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                              selected
                                ? "border-accent bg-accent text-white"
                                : "border-border bg-background"
                            )}>
                              {selected && <Check className="h-2.5 w-2.5" />}
                            </span>
                            <span className="flex-1 truncate font-medium text-foreground">{doc.title}</span>
                            <span className="shrink-0 text-[10px] text-muted-foreground">{doc.docType}</span>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

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

          {/* Right: send button */}
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
