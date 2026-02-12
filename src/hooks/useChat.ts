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
    async (query: string) => {
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
          await new Promise((resolve) => setTimeout(resolve, 1500));
          const assistantMessage: ChatMessage = {
            id: `msg_${Date.now() + 1}`,
            role: "assistant",
            content: generateMockResponse(query),
            citations: mockCitations.slice(0, 2),
            confidence: 0.78 + Math.random() * 0.17,
            confidenceLevel: "high",
            explanation:
              "Retrieved relevant documents via hybrid search combining vector similarity and keyword matching.",
            retrievalMode: "hybrid",
            latencyMs: 800 + Math.floor(Math.random() * 1200),
            timestamp: new Date().toISOString(),
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
        }>("/chat/query", {
          query,
          engagementId,
          threadId: threadIdRef.current,
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
