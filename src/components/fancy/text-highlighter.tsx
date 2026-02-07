"use client";

import React from "react";

interface TextHighlighterProps {
  text: string;
  highlight: string;
  highlightClassName?: string;
  className?: string;
}

export function TextHighlighter({
  text,
  highlight,
  highlightClassName = "bg-amber-200/60 text-amber-900 rounded px-0.5",
  className = "",
}: TextHighlighterProps) {
  if (!highlight.trim()) {
    return <span className={className}>{text}</span>;
  }

  const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark key={index} className={highlightClassName}>
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  );
}
