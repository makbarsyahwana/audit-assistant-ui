"use client";

import { useState, useCallback, useRef } from "react";

interface ScrambleHoverProps {
  children: string;
  className?: string;
  scrambleSpeed?: number;
  maxIterations?: number;
  characters?: string;
  as?: React.ElementType;
}

export function ScrambleHover({
  children,
  className = "",
  scrambleSpeed = 50,
  maxIterations = 10,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  as: Component = "span",
}: ScrambleHoverProps) {
  const [displayText, setDisplayText] = useState(children);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const iterationRef = useRef(0);

  const scramble = useCallback(() => {
    iterationRef.current = 0;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      iterationRef.current += 1;

      setDisplayText(
        children
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iterationRef.current) return children[index];
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join("")
      );

      if (iterationRef.current >= children.length || iterationRef.current >= maxIterations) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        setDisplayText(children);
      }
    }, scrambleSpeed);
  }, [children, characters, maxIterations, scrambleSpeed]);

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setDisplayText(children);
  }, [children]);

  return (
    <Component
      className={className}
      onMouseEnter={scramble}
      onMouseLeave={reset}
    >
      {displayText}
    </Component>
  );
}
