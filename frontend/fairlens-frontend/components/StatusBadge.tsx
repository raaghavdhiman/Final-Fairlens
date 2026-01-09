"use client";

export default function StatusBadge({ status }: { status: string }) {
  const key = (status || "").toUpperCase();

  const map: Record<string, { bg: string; color: string }> = {
    OPEN: { bg: "var(--accent-blue)", color: "#ffffff" },
    ACTIVE: { bg: "var(--accent-blue)", color: "#ffffff" },
    AWARDED: { bg: "var(--success)", color: "#ffffff" },
    COMPLETED: { bg: "var(--success)", color: "#ffffff" },
    DRAFT: { bg: "var(--warning)", color: "#ffffff" },
    PENDING: { bg: "var(--warning)", color: "#0F172A" },
    IN_PROGRESS: { bg: "var(--accent-blue)", color: "#ffffff" },
    DELAYED: { bg: "var(--error)", color: "#ffffff" },
    CLOSED: { bg: "#E6EEF6", color: "var(--text-secondary)" },
    REJECTED: { bg: "var(--error)", color: "#ffffff" },
  };

  const styles = map[key] ?? { bg: "#E6EEF6", color: "var(--text-secondary)" };

  return (
    <span
      style={{ background: styles.bg, color: styles.color }}
      className="px-3 py-1 rounded-full text-sm font-medium"
    >
      {status}
    </span>
  );
}
