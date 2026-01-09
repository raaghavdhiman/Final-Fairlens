"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { requireRole } from "@/lib/requireRole";
import MoneyAmount from "@/components/MoneyAmount";
import StatusBadge from "@/components/StatusBadge";
import Card from "@/components/Card";

const API_URL = "http://localhost:3001";

type Tender = {
  id: string;
  title: string;
  description: string;
  budget: number;
  status: string;
};

type Contractor = {
  id: string;
  name: string;
  role: string;
  contractorHash?: string;
  walletAddress?: string;
};

export default function ContractorTendersPage() {
  requireRole("CONTRACTOR");

  const [tenders, setTenders] = useState<Tender[]>([]);
  const [contractor, setContractor] = useState<Contractor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const token = localStorage.getItem("token");

    try {
      const [tendersRes, meRes] = await Promise.all([
        fetch(`${API_URL}/tenders`),
              <div className="mt-3 border-t pt-3 flex justify-end">
                {canBid ? (
                  <Link href={`/contractor/tenders/${t.id}/bid`} className="inline-block px-3 py-1 text-sm bg-blue-600 rounded hover:bg-blue-700">Place Bid</Link>
                ) : (
                  <button disabled className="px-3 py-1 text-sm bg-gray-700 text-gray-400 rounded cursor-not-allowed">{t.status !== "OPEN" ? "Bidding Closed" : "Verification Required"}</button>
                )}
              </div>
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="p-6">Loading tenders...</div>;
  }

  if (!contractor) {
    return <div className="p-6">Failed to load contractor</div>;
  }

  const isVerified =
    contractor.contractorHash && contractor.walletAddress;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-4 compact-vertical">
      <h1 className="text-2xl font-semibold title-strong">Public Tenders</h1>

      {!isVerified && (
        <Card className="p-4 border-yellow-600 text-yellow-400">
          ⚠️ You must be blockchain-verified to place bids.
        </Card>
      )}

      {tenders.length === 0 && (
        <p className="text-gray-400">No tenders available.</p>
      )}

      <div className="space-y-4">
        {tenders.map((t) => {
          const canBid =
            isVerified && t.status === "OPEN";

            return (
            <Card key={t.id} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="font-semibold text-[var(--text-primary)]">{t.title}</h2>
                      <p className="text-sm muted mt-1">{t.description}</p>
                    </div>

                    <div className="text-right">
                      <StatusBadge status={t.status} />
                      <div className="text-sm mt-2">
                        <MoneyAmount eth={t.budget} />
                      </div>
                    </div>
                  </div>

              {canBid ? (
                <Link href={`/contractor/tenders/${t.id}/bid`} className="inline-block px-4 py-1 bg-blue-600 rounded hover:bg-blue-700">Place Bid</Link>
              ) : (
                <button disabled className="px-4 py-1 bg-gray-700 text-gray-400 rounded cursor-not-allowed">{t.status !== "OPEN" ? "Bidding Closed" : "Verification Required"}</button>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
