"use client";

import { useEffect, useState } from "react";
import { requireRole } from "@/lib/requireRole";

const API_URL = "http://localhost:3001";

export default function GovAllBidsPage() {
  requireRole("GOVERNMENT");

  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllBids();
  }, []);

  async function fetchAllBids() {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/bids`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setBids(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  if (loading) {
    return <div className="p-6">Loading bids...</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">All Contractor Bids</h1>

      {bids.length === 0 && (
        <p className="text-gray-400">No bids yet.</p>
      )}

      {bids.map((b) => (
        <div
          key={b.id}
          className="border border-gray-700 rounded p-4 space-y-1"
        >
          <p className="font-semibold">
            Tender: {b.tender.title}
          </p>

          <p>Contractor: {b.contractor.name}</p>
          <p>Amount: {b.amount} ETH</p>

          {b.isAccepted && (
            <span className="text-green-500">🏆 Awarded</span>
          )}
        </div>
      ))}
    </div>
  );
}
