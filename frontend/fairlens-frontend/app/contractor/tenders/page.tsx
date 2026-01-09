"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { requireRole } from "@/lib/requireRole";

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
        fetch(`${API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const tendersData = await tendersRes.json();
      const meData = await meRes.json();

      setTenders(Array.isArray(tendersData) ? tendersData : []);
      setContractor(meData);
    } catch (err) {
      console.error("Failed to load tenders", err);
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
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Public Tenders</h1>

      {!isVerified && (
        <div className="p-4 border border-yellow-600 rounded text-yellow-400">
          ⚠️ You must be blockchain-verified to place bids.
        </div>
      )}

      {tenders.length === 0 && (
        <p className="text-gray-400">No tenders available.</p>
      )}

      <div className="space-y-4">
        {tenders.map((t) => {
          const canBid =
            isVerified && t.status === "OPEN";

          return (
            <div
              key={t.id}
              className="border border-gray-700 rounded p-4 space-y-2"
            >
              <div className="flex justify-between">
                <h2 className="font-semibold">{t.title}</h2>
                <span className="text-sm text-gray-400">
                  {t.status}
                </span>
              </div>

              <p className="text-sm text-gray-400">
                {t.description}
              </p>

              <p className="text-sm">
                Budget: {t.budget ?? 0} ETH
              </p>

              {canBid ? (
                <Link
                  href={`/contractor/tenders/${t.id}/bid`}
                  className="inline-block px-4 py-1 bg-blue-600 rounded hover:bg-blue-700"
                >
                  Place Bid
                </Link>
              ) : (
                <button
                  disabled
                  className="px-4 py-1 bg-gray-700 text-gray-400 rounded cursor-not-allowed"
                >
                  {t.status !== "OPEN"
                    ? "Bidding Closed"
                    : "Verification Required"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
