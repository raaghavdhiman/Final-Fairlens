export default function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="p-6 text-center" style={{ color: "var(--text-muted)" }}>
      <div className="text-2xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>{title}</div>
      {subtitle && <div className="text-sm">{subtitle}</div>}
    </div>
  );
}
