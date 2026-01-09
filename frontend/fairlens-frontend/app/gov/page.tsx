"use client";

import Link from "next/link";
import { requireRole } from "@/lib/requireRole";

export default function GovernmentDashboard() {
  requireRole("GOVERNMENT");

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">
        Government Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* MY TENDERS */}
        <Link
          href="/gov/tenders"
          className="border border-gray-700 p-6 rounded hover:bg-gray-900 transition"
        >
          <h2 className="text-xl font-semibold mb-2">
            My Tenders
          </h2>
          <p className="text-gray-400 text-sm">
            Create, open, close tenders and manage milestones
          </p>
        </Link>

        {/* CONTRACTOR BIDS */}
        <Link
          href="/gov/bids"
          className="border border-gray-700 p-6 rounded hover:bg-gray-900 transition"
        >
          <h2 className="text-xl font-semibold mb-2">
            Contractor Bids
          </h2>
          <p className="text-gray-400 text-sm">
            View and award bids for your tenders
          </p>
        </Link>

        {/* VERIFY CONTRACTOR */}
        <Link
          href="/gov/contractors"
          className="border border-gray-700 p-6 rounded hover:bg-gray-900 transition"
        >
          <h2 className="text-xl font-semibold mb-2">
            Verify Contractor
          </h2>
          <p className="text-gray-400 text-sm">
            Verify contractor identities on blockchain
          </p>
        </Link>

        {/* PUBLIC VIEW */}
        <Link
          href="/gov/public-view"
          className="border border-gray-700 p-6 rounded hover:bg-gray-900 transition"
        >
          <h2 className="text-xl font-semibold mb-2">
            Public Tenders View
          </h2>
          <p className="text-gray-400 text-sm">
            See how citizens view public tenders
          </p>
        </Link>
      </div>
    </div>
  );
}
