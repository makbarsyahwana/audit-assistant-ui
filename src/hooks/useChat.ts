"use client";

import { useState, useCallback, useRef } from "react";
import type { ChatMessage, QueryComplexity, QueryRequest } from "@/types/chat";
import { apiClient } from "@/lib/api";

export function useChat(engagementId?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const threadIdRef = useRef<string | null>(null);

  const loadHistory = useCallback(async () => {
    // Real API: history is managed by LangGraph checkpointer via threadId
    // No separate history endpoint needed — messages accumulate in state
  }, []);

  const sendMessage = useCallback(
    async (query: string, options?: { forceDeepAnalysis?: boolean; knowledgeSourceIds?: string[] }) => {
      if (!query.trim()) return;

      const userMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        role: "user",
        content: query,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setLoading(true);
      setError(null);

      try {
        // Real API call to audit-assistant-api
        const response = await apiClient.post<{
          answer: string;
          citations: Array<{ chunkId: string; documentName: string; pageNumber?: number; content: string; score: number }>;
          confidence: number;
          explanation: string;
          runId: string;
          threadId: string;
          complexity?: "simple" | "complex";
          agenticTrace?: {
            agenticIterations: number;
            planningSteps: Array<{ action: string; reasoning: string; query: string; estimatedCompleteness: number; timestamp: string }>;
            criticEvaluations: Array<{ sufficient: boolean; groundednessScore: number; completenessScore: number; reason: string; nextAction: string }>;
            rlmIterations: number;
            rlmSubCalls: number;
            rlmTrace: Array<{ iteration: number; code: string; stdoutMeta: string }>;
          };
        }>("/chat/query", {
          query,
          engagementId,
          threadId: threadIdRef.current,
          forceDeepAnalysis: options?.forceDeepAnalysis,
          knowledgeSourceIds: options?.knowledgeSourceIds,
        });

        threadIdRef.current = response.threadId;

        const confidenceLevel =
          response.confidence >= 0.8 ? "high" : response.confidence >= 0.5 ? "medium" : "low";

        const resolvedComplexity: QueryComplexity =
          response.complexity === "simple" || response.complexity === "complex"
            ? response.complexity
            : response.agenticTrace
              ? "complex"
              : "simple";

        const assistantMessage: ChatMessage = {
          id: `msg_${response.runId}`,
          role: "assistant",
          content: response.answer,
          citations: response.citations.map((c, idx) => ({
            id: `cite_${response.runId}_${idx}`,
            documentId: c.chunkId.split("_")[0] || c.chunkId,
            documentTitle: c.documentName,
            chunkId: c.chunkId,
            pageNumber: c.pageNumber,
            snippet: c.content,
            score: c.score,
            retrievalType: "hybrid" as const,
          })),
          confidence: response.confidence,
          confidenceLevel,
          explanation: response.explanation,
          timestamp: new Date().toISOString(),
          complexity: resolvedComplexity,
          agenticTrace: response.agenticTrace
            ? { ...response.agenticTrace, complexity: resolvedComplexity }
            : undefined,
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to send message");
      } finally {
        setLoading(false);
      }
    },
    [engagementId]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    threadIdRef.current = null;
  }, []);

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearMessages,
    loadHistory,
  };
}
