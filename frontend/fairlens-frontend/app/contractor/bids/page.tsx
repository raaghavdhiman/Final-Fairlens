"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { requireRole } from "@/lib/requireRole";
import MoneyAmount from "@/components/MoneyAmount";
import StatusBadge from "@/components/StatusBadge";
import Card from "@/components/Card";

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
    <div className="p-6 max-w-5xl mx-auto space-y-4 compact-vertical">
      <h1 className="text-2xl font-semibold title-strong">My Bids</h1>

      {bids.length === 0 && (
        <p className="text-muted">You haven’t placed any bids yet.</p>
      )}

      {bids.map((bid) => (
        <Card key={bid.id} className="space-y-2">
          <div className="flex justify-between">
            <h2 className="font-semibold text-[var(--text-primary)]">{bid.tender.title}</h2>

            {bid.isAccepted ? <StatusBadge status={"AWARDED"} /> : <StatusBadge status={"PENDING"} />}
          </div>

          <p className="text-sm muted">Tender Status: <StatusBadge status={bid.tender.status} /></p>

          <p>Bid Amount: <MoneyAmount eth={bid.amount} /></p>

          <div className="pt-2">
            <Link href={`/contractor/tenders/${bid.tender.id}`} className="text-[var(--accent-blue)] text-sm hover:underline">View Tender</Link>
          </div>
        </Card>
      ))}
    </div>
  );
}
