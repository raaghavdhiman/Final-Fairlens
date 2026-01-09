"use client";

import { useEffect, useState } from "react";
import { requireRole } from "@/lib/requireRole";
import MoneyAmount from "@/components/MoneyAmount";
import StatusBadge from "@/components/StatusBadge";
import Card from "@/components/Card";

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
    <div className="p-6 max-w-5xl mx-auto space-y-4 compact-vertical">
      <h1 className="text-2xl font-semibold title-strong">My Milestones</h1>

      {milestones.length === 0 && (
        <p className="text-gray-400">
          No milestones assigned yet.
        </p>
      )}

      {milestones.map((m) => (
        <Card key={m.id} className="space-y-2">
          <div className="flex justify-between">
            <h2 className="font-semibold">{m.description}</h2>
            <span className="text-sm text-gray-400">{m.tender?.title}</span>
          </div>

          <p className="text-sm text-gray-400">Amount: <MoneyAmount eth={m.amount} /></p>

          <p>Status: <StatusBadge status={m.status} /></p>

          <div className="mt-3 border-t pt-3 flex justify-end items-center gap-2">
            {m.status === "PENDING" && (
              <button onClick={() => startWork(m.id)} className="px-3 py-1 text-sm bg-blue-600 rounded">Start Work</button>
            )}

            {m.status === "IN_PROGRESS" && (
              <button onClick={() => submitWork(m.id)} className="px-3 py-1 text-sm bg-yellow-600 rounded">Submit Work</button>
            )}

            {m.status === "COMPLETED" && !m.paidAt && (
              <span className="text-yellow-400 text-sm">⏳ Awaiting government verification</span>
            )}

            {m.paidAt && (
              <div className="text-green-500 text-sm space-y-1 text-right">
                <div>✅ Paid</div>
                {m.paymentTxHash && <div className="text-gray-400">Tx: {m.paymentTxHash.slice(0, 12)}...</div>}
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
