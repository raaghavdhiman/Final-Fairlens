"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { requireRole } from "@/lib/requireRole";
import MoneyAmount from "@/components/MoneyAmount";
import StatusBadge from "@/components/StatusBadge";

const API_URL = "http://localhost:3001";

export default function ContractorTenderDetailPage() {
  requireRole("CONTRACTOR");

  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [tender, setTender] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchTender() {
      const res = await fetch(`${API_URL}/tenders/${id}`);
      if (!res.ok) {
        setLoading(false);
        return;
      }

      const data = await res.json();
      setTender(data);
      setLoading(false);
    }

    fetchTender();
  }, [id]);

  if (loading) {
    return <div className="p-6">Loading tender...</div>;
  }

  if (!tender) {
    return <div className="p-6">Tender not found</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold title-strong">{tender.title}</h1>
      <p className="text-gray-400">{tender.description}</p>

      <div className="space-y-1">
        <p>
          <b>Budget:</b> <MoneyAmount eth={tender.budget} />
        </p>
        <p>
          <b>Status:</b> <StatusBadge status={tender.status} />
        </p>
      </div>

      {tender.status === "OPEN" && (
        <button
          onClick={() => router.push(`/contractor/tenders/${id}/bid`)}
          className="px-4 py-2 bg-blue-600 rounded"
        >
          Place Bid
        </button>
      )}
    </div>
  );
}
