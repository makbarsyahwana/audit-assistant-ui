"use client";

import React from "react";

interface UnderlineAnimationProps {
  children: React.ReactNode;
  className?: string;
  direction?: "center" | "left" | "right";
  thickness?: string;
  color?: string;
}

export function UnderlineAnimation({
  children,
  className = "",
  direction = "left",
  thickness = "2px",
  color = "currentColor",
}: UnderlineAnimationProps) {
  const originMap = {
    center: "center",
    left: "left",
    right: "right",
  };

  return (
    <span className={`relative inline-block group ${className}`}>
      {children}
      <span
        className="absolute bottom-0 left-0 w-full scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100"
        style={{
          height: thickness,
          backgroundColor: color,
          transformOrigin: originMap[direction],
        }}
      />
    </span>
  );
}
