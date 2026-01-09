"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { requireRole } from "@/lib/requireRole";
import Link from "next/link";
import ConfirmDialog from "@/components/ConfirmDialog";
import MoneyAmount from "@/components/MoneyAmount";
import StatusBadge from "@/components/StatusBadge";
import Card from "@/components/Card";

const API_URL = "http://localhost:3001";

export default function GovTenderBidsPage() {
  requireRole("GOVERNMENT");

  const { id } = useParams<{ id: string }>();

  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedBid, setSelectedBid] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchBids();
  }, [id]);

  async function fetchBids() {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/bids/tender/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setBids(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  async function awardBidConfirmed() {
    if (!selectedBid || !id) return;

    const token = localStorage.getItem("token");

    await fetch(`${API_URL}/tenders/${id}/award/${selectedBid}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setConfirmOpen(false);
    setSelectedBid(null);
    fetchBids();
  }

  function onAwardClick(bidId: string) {
    setSelectedBid(bidId);
    setConfirmOpen(true);
  }

  if (loading) {
    return <div className="p-6">Loading bids...</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold title-strong">Bids for this Tender</h1>
        <Link href="/gov/tenders" className="text-sm text-blue-600">Back to tenders</Link>
      </div>

      {bids.length === 0 && (
        <p className="text-gray-400">No bids submitted yet.</p>
      )}

      {bids.map((b) => (
        <Card key={b.id} className="bg-white">
          <div className="flex justify-between items-start">
            <p className="font-semibold text-gray-800">Contractor: {b.contractor.name}</p>
            {b.isAccepted ? <StatusBadge status={"AWARDED"} /> : null}
          </div>

          <p className="text-sm">Bid Amount: <MoneyAmount eth={b.amount} /></p>
          <p className="text-sm text-gray-500">Wallet: {b.contractor.walletAddress}</p>

          <div className="mt-3 border-t pt-3 flex justify-end gap-2">
            {!b.isAccepted && (
              <button onClick={() => onAwardClick(b.id)} className="px-3 py-1 text-sm bg-green-600 text-white rounded">Award Bid</button>
            )}
          </div>
        </Card>
      ))}

      <ConfirmDialog
        open={confirmOpen}
        title={"Are you sure you want to award this bid?"}
        onConfirm={awardBidConfirmed}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
