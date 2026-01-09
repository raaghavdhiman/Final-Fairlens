"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MoneyAmount from "@/components/MoneyAmount";
import StatusBadge from "@/components/StatusBadge";

const API_URL = "http://localhost:3001";

export default function PublicTendersView() {
  const [tenders, setTenders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTenders() {
      const res = await fetch(`${API_URL}/tenders`);
      const data = await res.json();
      setTenders(Array.isArray(data) ? data : []);
      setLoading(false);
    }

    fetchTenders();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading tenders…</p>;
  }

  return (
    <div className="space-y-4">
      {tenders.map((t) => (
        <Link
          key={t.id}
          href={`/public/tenders/${t.id}`}
          className="block border p-4 rounded hover:shadow-sm surface"
        >
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg text-['var(--text-primary)']">{t.title}</h3>
            <StatusBadge status={t.status} />
          </div>

                <p className="text-sm text-muted mt-1">
            <MoneyAmount eth={t.budget} />
          </p>
        </Link>
      ))}
    </div>
  );
}
