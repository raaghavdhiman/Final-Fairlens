import Link from "next/link";
import { ethToInr, formatInr } from "@/utils/currency";
import TenderTimeline from "@/components/TenderTimeline";

/* ===============================
   API HELPERS
================================ */

async function getTender(id: string) {
  const res = await fetch(
    `http://localhost:3001/public/tenders/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;
  return res.json();
}

async function getMilestones(id: string) {
  const res = await fetch(
    `http://localhost:3001/public/tenders/${id}/milestones`,
    { cache: "no-store" }
  );

  if (!res.ok) return [];
  return res.json();
}

async function getTimeline(id: string) {
  const res = await fetch(
    `http://localhost:3001/public/timeline/tender/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) return { timeline: [] };
  return res.json();
}

/* ===============================
   PAGE
================================ */

export default async function TenderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const tender = await getTender(id);
  if (!tender) {
    return <p className="p-6">Tender not found.</p>;
  }

  const milestones = await getMilestones(id);
  const timelineResponse = await getTimeline(id);
  const timeline = timelineResponse.timeline ?? [];

  /* ===============================
     CALCULATIONS
  ================================ */

  const totalBudgetEth = tender.budget ?? 0;
  const totalBudgetInr = ethToInr(totalBudgetEth);

  const paidEth = milestones.reduce(
    (sum: number, m: any) => sum + (m.amount ?? 0),
    0
  );

  const progressPercent =
    totalBudgetEth > 0
      ? Math.min(
          Math.round((paidEth / totalBudgetEth) * 100),
          100
        )
      : 0;

  /* ===============================
     STATUS COLOR HELPER (NEW)
  ================================ */

  const statusStyles = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-500/20 text-green-400";
      case "IN_PROGRESS":
        return "bg-blue-500/20 text-blue-400";
      case "DELAYED":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  /* ===============================
     UI
  ================================ */

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-2">
        {tender.title}
      </h1>

      {/* DESCRIPTION */}
      <p className="mb-4 text-gray-300">
        {tender.description}
      </p>

      {/* META INFO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm text-gray-400">
        {tender.department && (
          <p>
            <span className="font-medium text-gray-300">Department:</span>{" "}
            {tender.department}
          </p>
        )}

        {tender.location && (
          <p>
            <span className="font-medium text-gray-300">Location:</span>{" "}
            {tender.location}
          </p>
        )}

        {tender.expectedTimeline && (
          <p>
            <span className="font-medium text-gray-300">
              Expected Timeline:
            </span>{" "}
            {tender.expectedTimeline}
          </p>
        )}

        <p>
          <span className="font-medium text-gray-300">Status:</span>{" "}
          {tender.status}
        </p>
      </div>

      {/* BUDGET + PROGRESS */}
      <div className="mb-6 text-gray-400">
        <p>
          <span className="font-medium">Total Budget:</span>{" "}
          {formatInr(totalBudgetInr)}{" "}
          <span className="text-gray-500">
            ({totalBudgetEth} ETH)
          </span>
        </p>

        <p className="mt-1">
          <span className="font-medium">Progress:</span>{" "}
          {progressPercent}%
        </p>

        <div className="w-full h-2 bg-gray-800 rounded mt-2">
          <div
            className="h-2 bg-green-500 rounded transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* OPEN TENDER — BIDDING INFO */}
      {tender.status === "OPEN" && (
        <div className="border border-yellow-500/40 bg-yellow-500/10 p-4 rounded mb-8">
          <p className="font-medium text-yellow-400">
            🟡 Bidding is currently in progress
          </p>

          <p className="text-sm text-gray-300 mt-1">
            Number of bids received:{" "}
            <span className="font-medium">
              {tender._count?.bids ?? 0}
            </span>
          </p>

          <p className="text-xs text-gray-400 mt-1">
            Bids will be disclosed after the tender is awarded.
          </p>
        </div>
      )}

      {/* CONTRACTOR INFO */}
      {tender.winningContractor && (
        <div className="mb-8 border border-gray-700 rounded p-4">
          <h3 className="font-semibold mb-2">
            Awarded Contractor
          </h3>

          {tender.winningContractor.name && (
            <p className="text-sm text-gray-300">
              <span className="font-medium">Name:</span>{" "}
              {tender.winningContractor.name}
            </p>
          )}

          <p className="text-sm text-gray-300 mt-1">
            <span className="font-medium">Wallet:</span>{" "}
            <span className="text-gray-400">
              {tender.winningContractor.walletAddress ?? "Not available"}
            </span>
          </p>

          {tender.winningContractor.contractorHash && (
            <p className="text-xs text-gray-500 mt-1 break-all">
              Hash: {tender.winningContractor.contractorHash}
            </p>
          )}
        </div>
      )}

      {/* MILESTONES */}
      <h2 className="text-xl font-semibold mb-3">
        Milestones
      </h2>

      {milestones.length === 0 && (
        <p className="text-gray-400">No milestones added yet.</p>
      )}

      <div className="space-y-3 mb-10">
        {milestones.map((m: any) => {
  const status =
    m.verifiedAt
      ? "COMPLETED"
      : m.submittedAt
      ? "IN_PROGRESS"
      : m.delayDays > 0
      ? "DELAYED"
      : "PENDING";

  const statusStyles: Record<string, string> = {
    COMPLETED: "bg-green-500/10 text-green-400 border-green-500/30",
    IN_PROGRESS: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    DELAYED: "bg-red-500/10 text-red-400 border-red-500/30",
  };

  return (
    <div
      key={m.id}
      className={`border p-4 rounded relative ${statusStyles[status]}`}
    >
      {/* STATUS BADGE */}
      <span className="absolute top-3 right-3 text-xs px-2 py-0.5 rounded border">
        {status}
      </span>

      <p className="font-medium">
        {m.description}
      </p>

      <p className="text-sm text-gray-300 mt-1">
        {formatInr(ethToInr(m.amount))}{" "}
        <span className="text-gray-500">
          ({m.amount} ETH)
        </span>
      </p>

      {m.dueDate && (
        <p className="text-xs text-gray-500 mt-1">
          Due: {new Date(m.dueDate).toDateString()}
        </p>
      )}

      {/* PENALTY */}
      {m.penaltyAmount > 0 && (
        <p className="text-xs text-red-400 mt-1">
          ⚠ Penalty applied: {formatInr(ethToInr(m.penaltyAmount))}
        </p>
      )}

      {/* ACT OF GOD */}
      {m.actOfGod && (
        <p className="text-xs text-yellow-400 mt-1">
          🌪 Act of God declared
        </p>
      )}

      {/* VERIFY */}
      {m.paymentTxHash && (
        <Link
          href={`/public/milestones/${m.id}/verify`}
          className="inline-block mt-2 text-sm text-blue-400 hover:underline"
        >
          Verify on Blockchain →
        </Link>
      )}
    </div>
  );
})}

      </div>

      {/* TIMELINE */}
      <h2 className="text-xl font-semibold mb-3">
        Tender Timeline
      </h2>

      <TenderTimeline events={timeline} />
    </div>
  );
  <p className="text-xs text-gray-500 mt-6">
  Learn how verification works →{" "}
  <a href="/how-it-works" className="text-blue-400 hover:underline">
    How FairLens Works
  </a>
</p>

}
