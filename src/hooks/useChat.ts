"use client";

import { useState, useCallback } from "react";
import type { ChatMessage, QueryRequest } from "@/types/chat";
import { mockChatMessages, mockCitations } from "@/lib/mock-data";

export function useChat(engagementId?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    // MVP: load mock chat history
    await new Promise((resolve) => setTimeout(resolve, 200));
    setMessages(mockChatMessages);
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
        // MVP: simulate API response with delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const assistantMessage: ChatMessage = {
          id: `msg_${Date.now() + 1}`,
          role: "assistant",
          content: generateMockResponse(query),
          citations: mockCitations.slice(0, 2),
          confidence: 0.78 + Math.random() * 0.17,
          confidenceLevel: "high",
          explanation:
            "Retrieved relevant documents via hybrid search combining vector similarity and keyword matching. Multiple sources corroborate the response.",
          retrievalMode: "hybrid",
          latencyMs: 800 + Math.floor(Math.random() * 1200),
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
    return "Based on the retrieved documents, here are the key findings regarding **risk assessment**:\n\n1. **Risk Assessment Framework** — The organization follows a structured approach aligned with ISO 31000, incorporating both qualitative and quantitative methods.\n\n2. **Frequency** — Risk assessments are conducted annually and upon significant changes to the business environment or IT infrastructure.\n\n3. **Key Controls** — Risk acceptance criteria are defined and approved by senior management. A 5×5 risk matrix is used for likelihood and impact scoring.\n\nPlease review the cited sources for full details.";
  }

  if (lowerQuery.includes("control") || lowerQuery.includes("change")) {
    return "Here is a summary of the **change management controls** based on the retrieved evidence:\n\n- **CHG-01**: All changes require documented approval before implementation\n- **CHG-02**: Emergency changes must be retrospectively approved within 48 hours\n- **CHG-03**: Change advisory board (CAB) reviews all significant changes weekly\n\n**Testing Status**: 85% of controls tested with no exceptions noted for the current period. Two controls pending testing for Q3.";
  }

  if (lowerQuery.includes("evidence") || lowerQuery.includes("access")) {
    return "The **access control evidence** for the requested period shows:\n\n- **User Access Reviews**: Completed quarterly with 98.5% compliance rate\n- **Privileged Access**: 12 privileged accounts identified, all with documented justification\n- **Termination Process**: Average deprovisioning time of 4 hours (within 24-hour SLA)\n\nAll evidence documents are linked in the citations below.";
  }

  return "Based on the available documents in this engagement, I found relevant information related to your query.\n\nThe retrieved sources provide context across multiple document types including policies, standards, and evidence artifacts. Please review the citations below for specific references.\n\n**Note**: For the most accurate results, consider specifying the framework clause, control ID, or time period in your question.";
}
