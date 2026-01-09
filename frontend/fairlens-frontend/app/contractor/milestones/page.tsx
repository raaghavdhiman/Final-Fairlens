"use client";

import { useEffect, useState } from "react";
import { requireRole } from "@/lib/requireRole";

const API_URL = "http://localhost:3001";

export default function ContractorMilestonesPage() {
  requireRole("CONTRACTOR");

  const [milestones, setMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMilestones();
  }, []);

  async function fetchMilestones() {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/milestones/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setMilestones(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load milestones", err);
      setMilestones([]);
    } finally {
      setLoading(false);
    }
  }

  async function startWork(milestoneId: string) {
    const token = localStorage.getItem("token");

    await fetch(`${API_URL}/milestones/${milestoneId}/start`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchMilestones();
  }

  async function submitWork(milestoneId: string) {
    const token = localStorage.getItem("token");

    await fetch(`${API_URL}/milestones/${milestoneId}/submit`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchMilestones();
  }

  if (loading) {
    return <div className="p-6">Loading milestones...</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">My Milestones</h1>

      {milestones.length === 0 && (
        <p className="text-gray-400">
          No milestones assigned yet.
        </p>
      )}

      {milestones.map((m) => (
        <div
          key={m.id}
          className="border border-gray-700 rounded p-4 space-y-2"
        >
          <div className="flex justify-between">
            <h2 className="font-semibold">{m.description}</h2>
            <span className="text-sm text-gray-400">
              {m.tender?.title}
            </span>
          </div>

          <p className="text-sm text-gray-400">
            Amount: {m.amount} ETH
          </p>

          <p>
            Status:{" "}
            <span className="font-medium">{m.status}</span>
          </p>

          {/* ACTIONS */}
          <div className="flex gap-3 mt-3">
            {m.status === "PENDING" && (
              <button
                onClick={() => startWork(m.id)}
                className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
              >
                Start Work
              </button>
            )}

            {m.status === "IN_PROGRESS" && (
              <button
                onClick={() => submitWork(m.id)}
                className="px-3 py-1 bg-yellow-600 rounded hover:bg-yellow-700"
              >
                Submit Work
              </button>
            )}

            {m.status === "COMPLETED" && !m.paidAt && (
              <span className="text-yellow-400 text-sm">
                ⏳ Awaiting government verification
              </span>
            )}

            {m.paidAt && (
              <div className="text-green-500 text-sm space-y-1">
                <div>✅ Paid</div>
                {m.paymentTxHash && (
                  <div className="text-gray-400">
                    Tx: {m.paymentTxHash.slice(0, 12)}...
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
