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
      <p className="text-gray-400">
        No timeline events available.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((e, idx) => (
        <div
          key={idx}
          className="border border-gray-700 rounded p-4"
        >
          <p className="text-sm text-gray-400">
            {new Date(e.timestamp).toLocaleString()}
          </p>

          <p className="font-medium mt-1">
            {e.description}
          </p>

          {e.proof?.txHash && (
            <p className="text-xs text-blue-400 mt-2 break-all">
              On-chain proof: {e.proof.txHash}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
