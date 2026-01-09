"use client";

import { ethToInr, formatInr } from "@/utils/currency";

export default function MoneyAmount({
  eth,
  inr,
  className,
}: {
  eth?: number | null;
  inr?: number | null;
  className?: string;
}) {
  const ethVal = typeof eth === "number" ? eth : 0;
  const inrVal = typeof inr === "number" ? inr : ethVal ? ethToInr(ethVal) : 0;

  return (
    <div className={className}>
      <span style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: "1.05rem" }}>
        {formatInr(inrVal)}
      </span>{" "}
      {typeof eth === "number" && (
        <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
          ({Number(eth).toLocaleString("en-IN")} ETH)
        </span>
      )}
    </div>
  );
}
