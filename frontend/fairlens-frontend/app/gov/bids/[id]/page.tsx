"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { requireRole } from "@/lib/requireRole";

const API_URL = "http://localhost:3001";

export default function GovTenderBidsPage() {
  requireRole("GOVERNMENT");

  // ✅ FIX: correct param name
  const { id } = useParams<{ id: string }>();

  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchBids();
  }, [id]);

  async function fetchBids() {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${API_URL}/bids/tender/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    setBids(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  async function awardBid(bidId: string) {
    const token = localStorage.getItem("token");

    await fetch(
      `${API_URL}/tenders/${id}/award/${bidId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchBids();
  }

  if (loading) {
    return <div className="p-6">Loading bids...</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Bids for this Tender</h1>

      {bids.length === 0 && (
        <p className="text-gray-400">No bids submitted yet.</p>
      )}

      {bids.map((b) => (
        <div
          key={b.id}
          className="border border-gray-700 rounded p-4 space-y-2"
        >
          <p className="font-semibold">
            Contractor: {b.contractor.name}
          </p>

          <p>Bid Amount: {b.amount} ETH</p>

          <p className="text-sm text-gray-400">
            Wallet: {b.contractor.walletAddress}
          </p>

          {!b.isAccepted && (
            <button
              onClick={() => awardBid(b.id)}
              className="px-3 py-1 bg-green-600 rounded"
            >
              Award Bid
            </button>
          )}

          {b.isAccepted && (
            <span className="text-green-500">🏆 Awarded</span>
          )}
        </div>
      ))}
    </div>
  );
}
