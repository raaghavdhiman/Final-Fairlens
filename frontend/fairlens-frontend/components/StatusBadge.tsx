"use client";

export default function StatusBadge({ status }: { status: string }) {
  const key = (status || "").toUpperCase();

  const map: Record<string, { bg: string; color: string }> = {
    OPEN: { bg: "var(--color-accent)", color: "#ffffff" },
    ACTIVE: { bg: "var(--color-accent)", color: "#ffffff" },
    AWARDED: { bg: "var(--success)", color: "#ffffff" },
    COMPLETED: { bg: "var(--success)", color: "#ffffff" },
    DRAFT: { bg: "#6b7280", color: "#ffffff" }, // neutral gray
    PENDING: { bg: "var(--color-border)", color: "#ffffff" }, // Blue Slate
    PENDING_VERIFICATION: { bg: "var(--color-border)", color: "#ffffff" },
    IN_PROGRESS: { bg: "var(--color-accent)", color: "#ffffff" },
    DELAYED: { bg: "var(--error)", color: "#ffffff" },
    CLOSED: { bg: "#6b7280", color: "#ffffff" }, // neutral gray
    REJECTED: { bg: "var(--error)", color: "#ffffff" },
  };

  const styles = map[key] ?? { bg: "var(--color-bg)", color: "var(--color-text-secondary)" };

  return (
    <span
      style={{ background: styles.bg, color: styles.color }}
      className="px-3 py-1 rounded-full text-sm font-medium"
    >
      {status}
    </span>
  );
}
