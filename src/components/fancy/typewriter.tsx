"use client";

import { useEffect, useState, useCallback } from "react";

interface TypewriterProps {
  text: string | string[];
  speed?: number;
  delay?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
  loop?: boolean;
  cursor?: boolean;
  cursorChar?: string | React.ReactNode;
  cursorClassName?: string;
  className?: string;
  onComplete?: () => void;
  as?: React.ElementType;
}

export function Typewriter({
  text,
  speed = 50,
  delay = 0,
  deleteSpeed = 30,
  pauseDuration = 2000,
  loop = false,
  cursor = true,
  cursorChar = "|",
  cursorClassName = "ml-1",
  className = "",
  onComplete,
  as: Component = "span",
}: TypewriterProps) {
  const texts = Array.isArray(text) ? text : [text];
  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setHasStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  const tick = useCallback(() => {
    if (!hasStarted) return;

    const currentText = texts[textIndex];

    if (!isDeleting) {
      if (displayText.length < currentText.length) {
        setDisplayText(currentText.slice(0, displayText.length + 1));
      } else if (texts.length > 1) {
        setTimeout(() => setIsDeleting(true), pauseDuration);
        return;
      } else {
        onComplete?.();
        return;
      }
    } else {
      if (displayText.length > 0) {
        setDisplayText(displayText.slice(0, -1));
      } else {
        setIsDeleting(false);
        const nextIndex = (textIndex + 1) % texts.length;
        if (nextIndex === 0 && !loop) {
          onComplete?.();
          return;
        }
        setTextIndex(nextIndex);
      }
    }
  }, [displayText, hasStarted, isDeleting, textIndex, texts, pauseDuration, loop, onComplete]);

  useEffect(() => {
    const timeout = setTimeout(tick, isDeleting ? deleteSpeed : speed);
    return () => clearTimeout(timeout);
  }, [tick, isDeleting, deleteSpeed, speed]);

  return (
    <Component className={className}>
      {displayText}
      {cursor && (
        <span className={`${cursorClassName} animate-pulse`}>
          {cursorChar}
        </span>
      )}
    </Component>
  );
}
