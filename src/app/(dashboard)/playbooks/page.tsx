"use client";

import { useState } from "react";
import { Clock, ChevronRight, Play, BookOpen, Search } from "lucide-react";
import { useModeContext } from "@/contexts/ModeContext";
import { mockPlaybooks } from "@/lib/mock-data-playbooks";
import type { Playbook } from "@/lib/mock-data-playbooks";
import { cn } from "@/lib/utils";

function PlaybookCard({ playbook, onRun }: { playbook: Playbook; onRun: (p: Playbook) => void }) {
  return (
    <div className="group rounded-lg border border-border bg-card p-4 hover:border-foreground/20 hover:shadow-sm transition-all">
      <div className="flex items-start gap-3 min-w-0">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-muted">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">{playbook.name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{playbook.description}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          ~{playbook.estimatedHours}h
        </span>
        <span>{playbook.stepCount} steps</span>
        <span>{playbook.usageCount} uses</span>
        <span className="rounded px-1.5 py-0.5 bg-muted font-medium">{playbook.category}</span>
      </div>

      <div className="mt-2 flex flex-wrap gap-1">
        {playbook.tags.map((tag) => (
          <span key={tag} className="rounded px-1.5 py-0.5 text-[10px] font-medium bg-muted text-muted-foreground">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
        <button
          onClick={() => onRun(playbook)}
          className="flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background hover:bg-foreground/90 transition-colors"
        >
          <Play className="h-3 w-3" />
          Run Playbook
        </button>
        <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
          View steps
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

function PlaybookRunner({ playbook, onClose }: { playbook: Playbook; onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = playbook.steps[currentStep];
  const isLast = currentStep === playbook.steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-xl border border-border bg-background shadow-xl mx-4">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <p className="text-xs text-muted-foreground">{playbook.name}</p>
            <p className="text-sm font-medium text-foreground">
              Step {currentStep + 1} of {playbook.steps.length}
            </p>
          </div>
          <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Close
          </button>
        </div>

        <div className="h-1 bg-muted">
          <div
            className="h-1 bg-foreground transition-all duration-300"
            style={{ width: `${((currentStep + 1) / playbook.steps.length) * 100}%` }}
          />
        </div>

        <div className="px-5 py-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-[11px] font-semibold text-background">
              {step.order}
            </span>
            <h2 className="font-serif text-lg font-normal text-foreground">{step.title}</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
          <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            ~{step.estimatedMinutes} min
          </p>

          {step.counselPrompt && (
            <div className="mt-4 rounded-lg border border-border bg-muted/40 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Suggested Counsel query
              </p>
              <p className="text-xs text-foreground italic">&ldquo;{step.counselPrompt}&rdquo;</p>
            </div>
          )}
        </div>

        <div className="px-5 pb-3">
          <div className="flex gap-1">
            {playbook.steps.map((s, i) => (
              <button
                key={s.order}
                onClick={() => setCurrentStep(i)}
                className={cn(
                  "flex-1 h-1.5 rounded-full transition-colors",
                  i < currentStep ? "bg-foreground" : i === currentStep ? "bg-foreground/60" : "bg-muted"
                )}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border px-5 py-3">
          <button
            onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
            disabled={currentStep === 0}
            className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
          >
            Back
          </button>
          {isLast ? (
            <button
              onClick={onClose}
              className="rounded-md bg-foreground px-4 py-1.5 text-sm font-medium text-background hover:bg-foreground/90 transition-colors"
            >
              Complete
            </button>
          ) : (
            <button
              onClick={() => setCurrentStep((s) => s + 1)}
              className="flex items-center gap-1.5 rounded-md bg-foreground px-4 py-1.5 text-sm font-medium text-background hover:bg-foreground/90 transition-colors"
            >
              Next step
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PlaybooksPage() {
  const { mode, config } = useModeContext();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [runningPlaybook, setRunningPlaybook] = useState<Playbook | null>(null);

  const playbooks = mockPlaybooks.filter((p) => p.mode === mode);
  const categories = ["all", ...Array.from(new Set(playbooks.map((p) => p.category)))];

  const filtered = playbooks.filter((p) => {
    const matchesCategory = activeCategory === "all" || p.category === activeCategory;
    const matchesSearch =
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border px-6 py-4">
        <h1 className="font-serif text-2xl font-normal text-foreground">Playbooks</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Pre-built workflows for {config.label.toLowerCase()} — run step-by-step or customize.
        </p>

        <div className="mt-4 flex items-center gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-3 py-1.5 text-xs rounded-md transition-colors capitalize",
                activeCategory === cat
                  ? "bg-foreground/5 text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {cat === "all" ? "All" : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-3 border-b border-border">
        <div className="relative max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search playbooks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-border bg-background pl-8 pr-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        <p className="mb-3 text-xs text-muted-foreground">
          {filtered.length} playbook{filtered.length !== 1 ? "s" : ""}
        </p>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((pb) => (
            <PlaybookCard key={pb.id} playbook={pb} onRun={setRunningPlaybook} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-16 text-center text-sm text-muted-foreground">
              No playbooks found.
            </div>
          )}
        </div>
      </div>

      {runningPlaybook && (
        <PlaybookRunner playbook={runningPlaybook} onClose={() => setRunningPlaybook(null)} />
      )}
    </div>
  );
}
