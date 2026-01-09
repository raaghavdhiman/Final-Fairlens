"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import MoneyAmount from "@/components/MoneyAmount";
import StatusBadge from "@/components/StatusBadge";

const API_URL = "http://localhost:3001";

export default function GovTenderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [tender, setTender] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchTender() {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/tenders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
    return <div className="p-6">Loading...</div>;
  }

  if (!tender) {
    return <div className="p-6">Tender not found</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold title-strong">{tender.title}</h1>
      <p className="text-gray-400">{tender.description}</p>

      <div className="space-y-1">
        <p>
          <span className="font-medium">Budget:</span>{" "}
          <MoneyAmount eth={tender.budget} />
        </p>
        <p>
          <span className="font-medium">Status:</span>{" "}
          <StatusBadge status={tender.status} />
        </p>
      </div>

      {/* ACTIONS */}
      <div className="flex flex-wrap gap-3 mt-6">
        {tender.status === "DRAFT" && (
          <button
            onClick={() => handleOpen(id)}
            className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
          >
            Open Tender
          </button>
        )}

        {tender.status === "OPEN" && (
          <button
            onClick={() => handleClose(id)}
            className="px-4 py-2 bg-yellow-600 rounded hover:bg-yellow-700"
          >
            Close Tender
          </button>
        )}

        <button
          onClick={() => router.push(`/gov/milestones/${id}`)}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          Manage Milestones
        </button>

        <button
          onClick={() => router.push(`/gov/bids/${id}`)}
          className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700"
        >
          View / Award Bids
        </button>
      </div>
    </div>
  );
}

/* ---------- helpers ---------- */

async function handleOpen(id: string) {
  const token = localStorage.getItem("token");

  await fetch(`${API_URL}/tenders/${id}/open`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  window.location.reload();
}

async function handleClose(id: string) {
  const token = localStorage.getItem("token");

  await fetch(`${API_URL}/tenders/${id}/close`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  window.location.reload();
}
