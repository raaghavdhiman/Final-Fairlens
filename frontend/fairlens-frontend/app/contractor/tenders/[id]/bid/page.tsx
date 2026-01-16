"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { requireRole } from "@/lib/requireRole";
import MoneyAmount from "@/components/MoneyAmount";
import StatusBadge from "@/components/StatusBadge";
import Card from "@/components/Card";

const API_URL = "http://localhost:3001";

export default function PlaceBidPage() {
  requireRole("CONTRACTOR");

  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [tender, setTender] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [proposal, setProposal] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    fetchData();
  }, [id]);

  async function fetchData() {
    const token = localStorage.getItem("token");

    try {
      const [tenderRes, userRes] = await Promise.all([
        fetch(`${API_URL}/tenders/${id}`),
        fetch(`${API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const tenderData = await tenderRes.json();
      const userData = await userRes.json();

      setTender(tenderData);
      setUser(userData);
    } catch {
      setError("Failed to load data");
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

  const hasWallet = Boolean(user?.walletAddress);
  const isVerified = Boolean(user?.contractorHash);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4 compact-vertical">
      <h1 className="text-2xl font-semibold title-strong">Place Bid</h1>

      {/* TENDER SUMMARY */}
      <Card className="space-y-1">
        <p className="font-semibold">{tender.title}</p>
        <p className="text-sm text-gray-400">{tender.description}</p>
        <p>Status: <StatusBadge status={tender.status} /></p>
        <p>Budget: <MoneyAmount eth={tender.budget ?? 0} /></p>
      </Card>

      {/* BID FORM */}
      <Card className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Bid Amount (ETH)</label>
          <input type="number" className="w-full p-2 border rounded" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm mb-1">Proposal</label>
          <textarea className="w-full p-2 border rounded" rows={4} value={proposal} onChange={(e) => setProposal(e.target.value)} />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-end">
          <button
            onClick={submitBid}
            disabled={submitting || !isVerified}
            className={submitting ? "btn-disabled" : "btn-primary-action"}
          >
            {submitting ? "Submitting..." : !hasWallet ? "Link wallet to continue" : !isVerified ? "Verification pending" : "Submit Bid"}
          </button>
        </div>
      </Card>
    </div>
  );
}
