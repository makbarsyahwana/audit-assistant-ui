"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useTransform } from "motion/react";

interface BasicNumberTickerProps {
  value: number;
  direction?: "up" | "down";
  delay?: number;
  className?: string;
  decimalPlaces?: number;
}

export function BasicNumberTicker({
  value,
  direction = "up",
  delay = 0,
  className = "",
  decimalPlaces = 0,
}: BasicNumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const motionValue = useSpring(direction === "down" ? value : 0, {
    damping: 60,
    stiffness: 100,
  });

  const displayValue = useTransform(motionValue, (latest) =>
    Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    }).format(Number(latest.toFixed(decimalPlaces)))
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      setHasStarted(true);
      motionValue.set(direction === "down" ? 0 : value);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [motionValue, delay, value, direction]);

  useEffect(() => {
    if (hasStarted) {
      motionValue.set(direction === "down" ? 0 : value);
    }
  }, [motionValue, value, direction, hasStarted]);

  return <motion.span ref={ref} className={className}>{displayValue}</motion.span>;
}
