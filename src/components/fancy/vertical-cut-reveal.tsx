"use client";

import { motion } from "motion/react";

interface VerticalCutRevealProps {
  children: string;
  splitBy?: "words" | "characters" | "lines";
  staggerDuration?: number;
  staggerFrom?: "first" | "last" | "center" | "random";
  reverse?: boolean;
  transition?: {
    type?: string;
    stiffness?: number;
    damping?: number;
    duration?: number;
  };
  className?: string;
  as?: React.ElementType;
}

export function VerticalCutReveal({
  children,
  splitBy = "words",
  staggerDuration = 0.04,
  staggerFrom = "first",
  reverse = false,
  transition = { type: "spring", stiffness: 200, damping: 25 },
  className = "",
  as: Component = "div",
}: VerticalCutRevealProps) {
  const splitText = (text: string): string[] => {
    switch (splitBy) {
      case "characters":
        return text.split("");
      case "lines":
        return text.split("\n");
      case "words":
      default:
        return text.split(" ");
    }
  };

  const pieces = splitText(children);

  const getDelay = (index: number, total: number): number => {
    switch (staggerFrom) {
      case "last":
        return (total - 1 - index) * staggerDuration;
      case "center": {
        const center = (total - 1) / 2;
        return Math.abs(center - index) * staggerDuration;
      }
      case "random":
        return Math.random() * staggerDuration * total;
      case "first":
      default:
        return index * staggerDuration;
    }
  };

  return (
    <Component className={className}>
      {pieces.map((piece, index) => (
        <span
          key={index}
          style={{
            position: "relative",
            overflow: "hidden",
            display: "inline-block",
          }}
        >
          <motion.span
            initial={{ y: reverse ? "-100%" : "100%" }}
            animate={{ y: "0%" }}
            transition={{
              ...transition,
              delay: getDelay(index, pieces.length),
            }}
            style={{ display: "inline-block" }}
          >
            {piece}
            {splitBy === "words" && index < pieces.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </Component>
  );
}
