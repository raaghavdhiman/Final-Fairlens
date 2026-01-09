"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { requireRole } from "@/lib/requireRole";

const API_URL = "http://localhost:3001";

export default function PlaceBidPage() {
  requireRole("CONTRACTOR");

  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [tender, setTender] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [proposal, setProposal] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    fetchTender();
  }, [id]);

  async function fetchTender() {
    try {
      const res = await fetch(`${API_URL}/tenders/${id}`);
      const data = await res.json();
      setTender(data);
    } catch {
      setError("Failed to load tender");
    } finally {
      setLoading(false);
    }
  }

  async function submitBid() {
    setSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/bids`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tenderId: id,
          amount: Number(amount),
          proposal,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Bid failed");
      }

      alert("Bid submitted successfully");
      router.push("/contractor/bids");
    } catch (err: any) {
      setError(err.message || "Failed to submit bid");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!tender) {
    return <div className="p-6">Tender not found</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Place Bid</h1>

      {/* TENDER SUMMARY */}
      <div className="border p-4 rounded space-y-1">
        <p className="font-semibold">{tender.title}</p>
        <p className="text-sm text-gray-400">
          {tender.description}
        </p>
        <p>Status: {tender.status}</p>
        <p>Budget: {tender.budget ?? 0} ETH</p>
      </div>

      {/* BID FORM */}
      <div className="border p-4 rounded space-y-4">
        <div>
          <label className="block text-sm mb-1">
            Bid Amount (ETH)
          </label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">
            Proposal
          </label>
          <textarea
            className="w-full p-2 border rounded"
            rows={4}
            value={proposal}
            onChange={(e) => setProposal(e.target.value)}
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <button
          onClick={submitBid}
          disabled={submitting}
          className="px-4 py-2 bg-blue-600 rounded disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Bid"}
        </button>
      </div>
    </div>
  );
}
