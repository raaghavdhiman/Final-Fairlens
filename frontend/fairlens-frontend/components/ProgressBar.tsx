type Props = {
  value: number; // 0–100
};

export default function ProgressBar({ value }: Props) {
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <div className="w-full bg-gray-200 rounded h-2">
      <div
        className="bg-[var(--success)] h-2 rounded transition-all"
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}
