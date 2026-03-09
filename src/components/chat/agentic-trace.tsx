"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Search,
  Code,
  CheckCircle2,
  XCircle,
  Zap,
  Brain,
} from "lucide-react";
import type { AgenticTrace, PlanningStep, CriticEvaluation, RlmIteration } from "@/types/chat";
import { cn } from "@/lib/utils";

interface AgenticTraceProps {
  trace: AgenticTrace;
}

export function AgenticTraceView({ trace }: AgenticTraceProps) {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"planning" | "rlm">("planning");
  const hasRlm = trace.rlmIterations > 0;

  return (
    <div className="w-full">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        <Brain className="h-3.5 w-3.5" />
        Analysis trace
        <span className="text-muted-foreground/60">·</span>
        <span>{trace.agenticIterations} iterations</span>
        {hasRlm && (
          <>
            <span className="text-muted-foreground/60">·</span>
            <span>RLM {trace.rlmIterations}×</span>
          </>
        )}
      </button>

      {expanded && (
        <div className="mt-3 space-y-4 pl-1">
          {/* Tab navigation */}
          <div className="flex gap-3 border-b border-border">
            <button
              onClick={() => setActiveTab("planning")}
              className={cn(
                "pb-2 text-xs font-medium transition-colors border-b-2 -mb-px",
                activeTab === "planning"
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              Planning & Critique
            </button>
            {hasRlm && (
              <button
                onClick={() => setActiveTab("rlm")}
                className={cn(
                  "pb-2 text-xs font-medium transition-colors border-b-2 -mb-px",
                  activeTab === "rlm"
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                RLM Trace
              </button>
            )}
          </div>

          {activeTab === "planning" && (
            <PlanningTabContent
              planningSteps={trace.planningSteps}
              criticEvaluations={trace.criticEvaluations}
            />
          )}
          {activeTab === "rlm" && hasRlm && (
            <RlmTabContent rlmTrace={trace.rlmTrace} />
          )}
        </div>
      )}
    </div>
  );
}

function PlanningTabContent({
  planningSteps,
  criticEvaluations,
}: {
  planningSteps: PlanningStep[];
  criticEvaluations: CriticEvaluation[];
}) {
  return (
    <div className="space-y-4">
      {/* Planning steps — Harvey bullet list style */}
      <div className="space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
          Planning
        </p>
        {planningSteps.map((step, idx) => (
          <div key={idx} className="flex items-start gap-2.5 text-xs">
            <ActionIcon action={step.action} />
            <div className="flex-1 min-w-0 space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-medium text-foreground capitalize">{step.action.replace("_", " ")}</span>
                <span className="text-muted-foreground">{Math.round(step.estimatedCompleteness * 100)}%</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">{step.reasoning}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Critic evaluations */}
      <div className="space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
          Evaluations
        </p>
        {criticEvaluations.map((eval_, idx) => (
          <div key={idx} className="flex items-start gap-2.5 text-xs">
            {eval_.sufficient ? (
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5 text-foreground/60" />
            ) : (
              <XCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-muted-foreground" />
            )}
            <div className="flex-1 min-w-0 space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap text-muted-foreground">
                <span>Groundedness <strong className="text-foreground">{Math.round(eval_.groundednessScore * 100)}%</strong></span>
                <span>·</span>
                <span>Completeness <strong className="text-foreground">{Math.round(eval_.completenessScore * 100)}%</strong></span>
                {!eval_.sufficient && eval_.nextAction && (
                  <>
                    <span>·</span>
                    <span>Next: <strong className="text-foreground">{eval_.nextAction}</strong></span>
                  </>
                )}
              </div>
              <p className="text-muted-foreground">{eval_.reason}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RlmTabContent({ rlmTrace }: { rlmTrace: RlmIteration[] }) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
        RLM Execution
      </p>
      {rlmTrace.map((iter, idx) => (
        <div key={idx} className="rounded-lg bg-foreground/5 border border-border p-3">
          <p className="text-[10px] font-mono text-muted-foreground mb-2">Iteration {iter.iteration}</p>
          <pre className="text-[11px] text-foreground/80 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
            {iter.code}
          </pre>
          {iter.stdoutMeta && (
            <p className="text-[10px] text-muted-foreground mt-2 border-t border-border pt-2 font-mono">
              → {iter.stdoutMeta}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function ActionIcon({ action }: { action: string }) {
  const icons: Record<string, React.ReactNode> = {
    retrieve: <Search className="h-3.5 w-3.5 shrink-0 mt-0.5 text-muted-foreground" />,
    rlm_deep: <Code className="h-3.5 w-3.5 shrink-0 mt-0.5 text-muted-foreground" />,
    entity_graph: <Zap className="h-3.5 w-3.5 shrink-0 mt-0.5 text-muted-foreground" />,
    answer: <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5 text-muted-foreground" />,
  };
  return <>{icons[action] ?? <Brain className="h-3.5 w-3.5 shrink-0 mt-0.5 text-muted-foreground" />}</>;
}
