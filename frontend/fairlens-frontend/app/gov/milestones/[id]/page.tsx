"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { requireRole } from "@/lib/requireRole";

import MoneyAmount from "@/components/MoneyAmount";
import StatusBadge from "@/components/StatusBadge";
import Card from "@/components/Card";

const API_URL = "http://localhost:3001";
const SEPOLIA_RPC = process.env.NEXT_PUBLIC_SEPOLIA_RPC!;

export default function GovMilestonesPage() {
  requireRole("GOVERNMENT");

  const { id } = useParams<{ id: string }>();

  const [milestones, setMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [penaltyRate, setPenaltyRate] = useState("");



  useEffect(() => {
    if (!id) return;
    fetchMilestones();
  }, [id]);

  async function fetchMilestones() {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/milestones/tender/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setMilestones(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch milestones", err);
      setMilestones([]);
    } finally {
      setLoading(false);
    }
  }

  async function createMilestone() {
    const token = localStorage.getItem("token");

    await fetch(`${API_URL}/milestones/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        description,
        amount: Number(amount),
        dueDate,
        penaltyRate: Number(penaltyRate),
      }),
    });

    setDescription("");
    setAmount("");
    setDueDate("");
    setPenaltyRate("");

    fetchMilestones();
  }

  async function verifyMilestone(milestoneId: string) {
    const token = localStorage.getItem("token");

    await fetch(`${API_URL}/milestones/${milestoneId}/verify`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchMilestones();
  }

  async function releasePayment(milestoneId: string) {
    const token = localStorage.getItem("token");

    await fetch(`${API_URL}/milestones/${milestoneId}/pay`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchMilestones();
  }



  if (loading) {
    return <div className="p-6">Loading milestones...</div>;
  }

  return (
    <div className="p-6 space-y-4 compact-vertical">
      <h1 className="text-2xl font-semibold title-strong">Milestones</h1>

      {/* CREATE MILESTONE */}
      <Card className="space-y-3">
        <h2 className="font-semibold">Create Milestone</h2>

        <input
          className="w-full p-2 border rounded"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          className="w-full p-2 border rounded"
          type="number"
          placeholder="Amount (ETH)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <input
          className="w-full p-2 border rounded"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <input
          className="w-full p-2 border rounded"
          type="number"
          placeholder="Penalty % per day"
          value={penaltyRate}
          onChange={(e) => setPenaltyRate(e.target.value)}
        />

        <div className="flex justify-end">
          <button onClick={createMilestone} className="btn-primary-action">Add Milestone</button>
        </div>
      </Card>

      {milestones.map((m) => (
        <Card key={m.id} size="sm" className="space-y-2">
          <p className="font-medium">{m.description}</p>
          <p className="text-sm text-gray-400">Amount: <MoneyAmount eth={m.amount} /></p>
          <p>Status: <StatusBadge status={m.status} /></p>

          <div className="mt-3 border-t pt-3 flex justify-end items-center gap-2">
            {m.status === "COMPLETED" && !m.verifiedAt && (
              <button onClick={() => verifyMilestone(m.id)} className="btn-secondary">Verify Work</button>
            )}

            {m.status === "COMPLETED" && m.verifiedAt && !m.paidAt && (
              <button onClick={() => releasePayment(m.id)} className="btn-warning">Release Payment</button>
            )}

            {m.paidAt && (
              m.paymentTxHash ? (
                <a
                  href={`https://sepolia.etherscan.io/tx/${m.paymentTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-500 text-sm hover:underline"
                >
                  Verified on-chain ↗
                </a>
              ) : (
                <p className="text-gray-500 text-sm">Not yet verified on-chain</p>
              )
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
