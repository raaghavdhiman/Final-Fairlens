"use client";

import { useEffect, useState } from "react";
import { requireRole } from "@/lib/requireRole";
import MoneyAmount from "@/components/MoneyAmount";
import StatusBadge from "@/components/StatusBadge";
import Card from "@/components/Card";

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
    <div className="p-6 max-w-5xl mx-auto space-y-4 compact-vertical">
      <h1 className="text-2xl font-semibold title-strong">All Contractor Bids</h1>

      {bids.length === 0 && <p className="text-muted">No bids yet.</p>}

      {bids.map((b) => (
        <Card key={b.id} className="space-y-1">
          <div className="flex justify-between items-start">
            <p className="font-semibold text-[var(--text-primary)]">Tender: {b.tender.title}</p>
            {b.isAccepted ? <StatusBadge status="AWARDED" /> : null}
          </div>

          <p>Contractor: {b.contractor.name}</p>
          <p>Amount: <MoneyAmount eth={b.amount} /></p>
        </Card>
      ))}
    </div>
  );
}
