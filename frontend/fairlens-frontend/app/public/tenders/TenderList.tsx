"use client";

import Link from "next/link";
import { useState } from "react";
import { ethToInr, formatInr } from "@/utils/currency";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    OPEN: "bg-green-600/20 text-green-400",
    AWARDED: "bg-blue-600/20 text-blue-400",
    CLOSED: "bg-gray-600/20 text-gray-400",
    CANCELLED: "bg-red-600/20 text-red-400",
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${map[status]}`}>
      {status}
    </span>
  );
}

export default function TenderList({ tenders }: { tenders: any[] }) {
  const [query, setQuery] = useState("");

  const filtered = tenders.filter((t) => {
  const q = query.toLowerCase();

  const searchableText = `
    ${t.title}
    ${t.description}
    ${t.status}
    ${t.budget}
    ${ethToInr(t.budget)}
  `.toLowerCase();

  return searchableText.includes(q);
});
;

  return (
    <>
      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search tenders..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full mb-6 px-4 py-2 bg-gray-900 border border-gray-700 rounded"
      />

      {/* LIST */}
      <div className="space-y-4">
        {filtered.map((t) => (
          <Link
            key={t.id}
            href={`/public/tenders/${t.id}`}
            className="block border border-gray-700 rounded p-4 hover:bg-gray-900 transition"
          >
            <div className="flex justify-between mb-1">
              <h2 className="text-lg font-semibold">{t.title}</h2>
              <StatusBadge status={t.status} />
            </div>

            <p className="text-sm text-gray-400 mb-2 line-clamp-2">
              {t.description}
            </p>

            <div className="text-sm text-gray-300">
              Budget: {formatInr(ethToInr(t.budget))}{" "}
              <span className="text-gray-500">({t.budget} ETH)</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
