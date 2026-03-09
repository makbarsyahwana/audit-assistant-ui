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

// Agentic loop types
export type QueryComplexity = "simple" | "complex";

export interface PlanningStep {
  action: string;
  reasoning: string;
  query: string;
  estimatedCompleteness: number;
  timestamp: string;
}

export interface CriticEvaluation {
  sufficient: boolean;
  groundednessScore: number;
  completenessScore: number;
  reason: string;
  nextAction: string;
}

export interface RlmIteration {
  iteration: number;
  code: string;
  stdoutMeta: string;
}

export interface AgenticTrace {
  complexity: QueryComplexity;
  agenticIterations: number;
  planningSteps: PlanningStep[];
  criticEvaluations: CriticEvaluation[];
  rlmIterations: number;
  rlmSubCalls: number;
  rlmTrace: RlmIteration[];
}

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
  // Agentic RAG fields
  complexity?: QueryComplexity;
  agenticTrace?: AgenticTrace;
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
  forceDeepAnalysis?: boolean; // Force complex path even for simple queries
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
