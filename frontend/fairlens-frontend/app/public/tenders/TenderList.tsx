"use client";

import Link from "next/link";
import { useState } from "react";
import MoneyAmount from "@/components/MoneyAmount";
import StatusBadge from "@/components/StatusBadge";
import Card from "@/components/Card";

export default function TenderList({ tenders }: { tenders: any[] }) {
  const [query, setQuery] = useState("");

  const filtered = tenders.filter((t) => {
    const q = query.toLowerCase();

    const searchableText = `
      ${t.title}
      ${t.description}
      ${t.status}
      ${t.budget}
    `.toLowerCase();

    return searchableText.includes(q);
  });

  return (
    <>
      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search tenders..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full mb-6 px-4 py-2 border border-gray-200 rounded"
      />

      {/* LIST */}
      {filtered.length === 0 ? (
        <div className="max-w-2xl mx-auto">
          <div className="p-6 text-center text-gray-500">
            <div className="text-xl font-semibold mb-2">
              No tenders found
            </div>
            <div className="text-sm">
              Try adjusting your search or check back later.
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((t) => (
            <Link key={t.id} href={`/public/tenders/${t.id}`}>
              <Card clickable>
                <div className="flex justify-between mb-1">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {t.title}
                  </h2>
                  <StatusBadge status={t.status} />
                </div>

                <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                  {t.description}
                </p>

                <div className="text-sm text-gray-700">
                  <MoneyAmount eth={t.budget} />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
