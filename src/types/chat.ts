export type RetrievalMode =
  | "vector"
  | "fulltext"
  | "graph"
  | "graph_vector"
  | "hybrid";

export type ConfidenceLevel = "high" | "medium" | "low";

export interface Citation {
  id: string;
  documentId: string;
  documentTitle: string;
  chunkId: string;
  pageNumber?: number;
  sectionPath?: string;
  snippet: string;
  score: number;
  retrievalType: RetrievalMode;
}

export type MessageRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  citations?: Citation[];
  confidence?: number;
  confidenceLevel?: ConfidenceLevel;
  explanation?: string;
  retrievalMode?: RetrievalMode;
  latencyMs?: number;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  engagementId: string;
  title?: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface QueryRequest {
  query: string;
  engagementId: string;
  sessionId?: string;
  entityId?: string;
  periodStart?: string;
  periodEnd?: string;
  docType?: string;
  retrievalMode?: RetrievalMode;
}

export interface QueryResponse {
  messageId: string;
  content: string;
  citations: Citation[];
  confidence: number;
  confidenceLevel: ConfidenceLevel;
  explanation: string;
  retrievalMode: RetrievalMode;
  latencyMs: number;
  runId: string;
}
