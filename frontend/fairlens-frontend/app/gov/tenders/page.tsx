"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { requireRole } from "@/lib/requireRole";
import MoneyAmount from "@/components/MoneyAmount";
import StatusBadge from "@/components/StatusBadge";

type Tender = {
  id: string;
  title: string;
  status: string;
  budget: number;
  createdAt: string;
};

export default function MyTendersPage() {
  requireRole("GOVERNMENT");

  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMyTenders() {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:3001/tenders/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        setLoading(false);
        return;
      }

      const data = await res.json();
      setTenders(data);
      setLoading(false);
    }

    fetchMyTenders();
  }, []);

  if (loading) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold title-strong">My Tenders</h1>

        <Link
          href="/gov/tenders/create"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          + Create Tender
        </Link>
      </div>

      {tenders.length === 0 && (
        <p className="text-gray-400">
          You haven’t created any tenders yet.
        </p>
      )}

      <div className="space-y-4">
        {tenders.map((t) => (
          <Link
            key={t.id}
            href={`/gov/tenders/${t.id}`}
            className="block border rounded p-4 hover:shadow-sm surface"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-semibold text-[var(--text-primary)]">{t.title}</h2>
              </div>

              <div className="text-right">
                <StatusBadge status={t.status} />
                <div className="text-sm mt-2">
                  <MoneyAmount eth={t.budget} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
