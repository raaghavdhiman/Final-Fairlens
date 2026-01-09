"use client";

import Link from "next/link";
import { requireRole } from "@/lib/requireRole";

export default function ContractorDashboard() {
  requireRole("CONTRACTOR");

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">
        Contractor Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* PROFILE / VERIFICATION */}
        <Link
          href="/contractor/profile"
          className="border border-gray-700 p-6 rounded hover:bg-gray-900 transition"
        >
          <h2 className="text-xl font-semibold mb-2">
            My Profile & Verification
          </h2>
          <p className="text-gray-400 text-sm">
            View wallet, verification status, and blockchain proof
          </p>
        </Link>

        {/* BROWSE TENDERS */}
        <Link
          href="/contractor/tenders"
          className="border border-gray-700 p-6 rounded hover:bg-gray-900 transition"
        >
          <h2 className="text-xl font-semibold mb-2">
            Browse Open Tenders
          </h2>
          <p className="text-gray-400 text-sm">
            View public tenders and submit bids
          </p>
        </Link>

        {/* MY BIDS */}
        <Link
          href="/contractor/bids"
          className="border border-gray-700 p-6 rounded hover:bg-gray-900 transition"
        >
          <h2 className="text-xl font-semibold mb-2">
            My Bids
          </h2>
          <p className="text-gray-400 text-sm">
            Track bids you have submitted
          </p>
        </Link>

        {/* MY WORK */}
        <Link
          href="/contractor/milestones"
          className="border border-gray-700 p-6 rounded hover:bg-gray-900 transition"
        >
          <h2 className="text-xl font-semibold mb-2">
            My Work & Milestones
          </h2>
          <p className="text-gray-400 text-sm">
            Start and submit milestone work for awarded tenders
          </p>
        </Link>
      </div>
    </div>
  );
}
