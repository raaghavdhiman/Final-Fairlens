"use client";

import React from "react";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  /** Make the card show a hover lift and pointer */
  clickable?: boolean;
  /** size controls padding: sm=12, md=16, lg=20 */
  size?: "sm" | "md" | "lg";
};

export default function Card({
  children,
  className = "",
  clickable = false,
  size = "md",
  ...rest
}: CardProps) {
  const padding = size === "sm" ? "p-3" : size === "lg" ? "p-5" : "p-4";
  const base = `card ${padding} rounded-[12px] bg-white border border-gray-200 shadow-sm transform transition-all`;
  const clickableClass = clickable ? "card-clickable cursor-pointer" : "";

  return (
    <div className={`${base} ${clickableClass} ${className}`} {...rest}>
      {children}
    </div>
  );
}
