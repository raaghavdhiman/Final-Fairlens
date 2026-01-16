type TimelineEvent = {
  type: string;
  timestamp: string;
  description: string;
  proof?: {
    txHash: string;
    network: string;
  };
};

export default function TenderTimeline({
  events,
}: {
  events: TimelineEvent[];
}) {
  if (!events || events.length === 0) {
    return (
      <p className="text-[var(--color-border)]">
        No timeline events available.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((e, idx) => (
        <div
          key={idx}
          className="bg-white rounded-[12px] shadow-sm p-4"
        >
          <p className="text-sm text-[var(--color-text-muted)]">
            {new Date(e.timestamp).toLocaleString()}
          </p>

          <p className="font-medium mt-1 text-[var(--color-text-secondary)]">
            {e.description}
          </p>

          {e.proof?.txHash && (
            <p className="text-sm text-[rgba(47,69,80,0.7)] break-all">
              On-chain proof: {e.proof.txHash}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
