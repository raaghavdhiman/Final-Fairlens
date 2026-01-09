"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { requireRole } from "@/lib/requireRole";

const API_URL = "http://localhost:3001";

export default function ContractorBidsPage() {
  requireRole("CONTRACTOR");

  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyBids();
  }, []);

  async function fetchMyBids() {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/bids/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setBids(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load bids", err);
      setBids([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="p-6">Loading bids...</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">My Bids</h1>

      {bids.length === 0 && (
        <p className="text-gray-400">You haven’t placed any bids yet.</p>
      )}

      {bids.map((bid) => (
        <div
          key={bid.id}
          className="border p-4 rounded space-y-2"
        >
          <div className="flex justify-between">
            <h2 className="font-semibold">
              {bid.tender.title}
            </h2>

            {bid.isAccepted ? (
              <span className="text-green-500 font-medium">
                🏆 Awarded
              </span>
            ) : (
              <span className="text-gray-400">
                Pending
              </span>
            )}
          </div>

          <p className="text-sm text-gray-400">
            Tender Status: {bid.tender.status}
          </p>

          <p>
            Bid Amount:{" "}
            <span className="font-medium">
              {bid.amount} ETH
            </span>
          </p>

          <div className="pt-2">
            <Link
              href={`/contractor/tenders/${bid.tender.id}`}
              className="text-blue-500 text-sm hover:underline"
            >
              View Tender
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
