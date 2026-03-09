"use client";

import { useState, useCallback, useRef } from "react";
import type { ChatMessage, QueryRequest } from "@/types/chat";
import { apiClient } from "@/lib/api";
import { mockChatMessages, mockCitations } from "@/lib/mock-data";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export function useChat(engagementId?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const threadIdRef = useRef<string | null>(null);

  const loadHistory = useCallback(async () => {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setMessages(mockChatMessages);
      return;
    }
    // Real API: history is managed by LangGraph checkpointer via threadId
    // No separate history endpoint needed — messages accumulate in state
  }, []);

  const sendMessage = useCallback(
    async (query: string, options?: { forceDeepAnalysis?: boolean }) => {
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
        if (USE_MOCK) {
          // Simulate longer delay for deep analysis
          const delay = options?.forceDeepAnalysis ? 3000 : 1500;
          await new Promise((resolve) => setTimeout(resolve, delay));
          
          const isComplex = options?.forceDeepAnalysis || query.length > 100;
          const assistantMessage: ChatMessage = {
            id: `msg_${Date.now() + 1}`,
            role: "assistant",
            content: generateMockResponse(query),
            citations: mockCitations.slice(0, 2),
            confidence: 0.78 + Math.random() * 0.17,
            confidenceLevel: "high",
            explanation: isComplex
              ? "Used agentic loop with planner and critic for deep multi-document analysis."
              : "Retrieved relevant documents via hybrid search combining vector similarity and keyword matching.",
            retrievalMode: "hybrid",
            latencyMs: isComplex ? 2500 + Math.floor(Math.random() * 1500) : 800 + Math.floor(Math.random() * 1200),
            timestamp: new Date().toISOString(),
            complexity: isComplex ? "complex" : "simple",
            agenticTrace: isComplex ? {
              complexity: "complex",
              agenticIterations: 3,
              planningSteps: [
                { action: "retrieve", reasoning: "Need to gather relevant documents first", query: query, estimatedCompleteness: 0.3, timestamp: new Date().toISOString() },
                { action: "rlm_deep", reasoning: "Query requires cross-document analysis", query: "Analyze patterns across documents", estimatedCompleteness: 0.7, timestamp: new Date().toISOString() },
                { action: "answer", reasoning: "Sufficient evidence gathered", query: query, estimatedCompleteness: 1.0, timestamp: new Date().toISOString() },
              ],
              criticEvaluations: [
                { sufficient: false, groundednessScore: 0.6, completenessScore: 0.4, reason: "Need more evidence", nextAction: "rlm_deep" },
                { sufficient: true, groundednessScore: 0.92, completenessScore: 0.88, reason: "Good coverage achieved", nextAction: "answer" },
              ],
              rlmIterations: 4,
              rlmSubCalls: 2,
              rlmTrace: [
                { iteration: 1, code: "results = rag_retrieve(query, mode='hybrid', top_k=10)", stdoutMeta: "Retrieved 10 chunks" },
                { iteration: 2, code: "analysis = sub_rlm('Analyze compliance gaps')", stdoutMeta: "Sub-RLM completed" },
              ],
            } : undefined,
          };
          setMessages((prev) => [...prev, assistantMessage]);
          return;
        }

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
        });

        threadIdRef.current = response.threadId;

        const confidenceLevel =
          response.confidence >= 0.8 ? "high" : response.confidence >= 0.5 ? "medium" : "low";

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
          complexity: response.complexity,
          agenticTrace: response.agenticTrace ? {
            complexity: response.complexity || "complex",
            ...response.agenticTrace,
          } : undefined,
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

function generateMockResponse(query: string): string {
  const lowerQuery = query.toLowerCase();
  if (lowerQuery.includes("risk") || lowerQuery.includes("assessment")) {
    return "Based on the retrieved documents, here are the key findings regarding **risk assessment**:\n\n1. **Risk Assessment Framework** — The organization follows a structured approach aligned with ISO 31000.\n\n2. **Frequency** — Risk assessments are conducted annually.\n\n3. **Key Controls** — Risk acceptance criteria are defined and approved by senior management.\n\nPlease review the cited sources for full details.";
  }
  if (lowerQuery.includes("control") || lowerQuery.includes("change")) {
    return "Here is a summary of the **change management controls** based on the retrieved evidence:\n\n- **CHG-01**: All changes require documented approval before implementation\n- **CHG-02**: Emergency changes must be retrospectively approved within 48 hours\n- **CHG-03**: CAB reviews all significant changes weekly";
  }
  return "Based on the available documents in this engagement, I found relevant information related to your query.\n\nPlease review the citations below for specific references.\n\n**Note**: For the most accurate results, consider specifying the framework clause, control ID, or time period in your question.";
}
