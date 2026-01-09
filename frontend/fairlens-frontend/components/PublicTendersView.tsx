"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
    return <p className="text-gray-400">Loading tenders…</p>;
  }

  return (
    <div className="space-y-4">
      {tenders.map((t) => (
        <Link
          key={t.id}
          href={`/public/tenders/${t.id}`}
          className="block border border-gray-700 p-4 rounded hover:bg-gray-900 transition"
        >
          <div className="flex justify-between">
            <h3 className="font-semibold">{t.title}</h3>
            <span className="text-sm text-gray-400">
              {t.status}
            </span>
          </div>

          <p className="text-sm text-gray-400 mt-1">
            Budget: {t.budget ?? "—"}
          </p>
        </Link>
      ))}
    </div>
  );
}
