"use client";

import Link from "next/link";
import { requireRole } from "@/lib/requireRole";
import Card from "@/components/Card";

export default function GovernmentDashboard() {
  requireRole("GOVERNMENT");

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-semibold mb-8 title-strong">
        Government Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* MY TENDERS */}
        <Link href="/gov/tenders">
          <Card clickable className="p-6">
            <h2 className="text-xl font-semibold mb-2">My Tenders</h2>
            <p className="text-gray-400 text-sm">Create, open, close tenders and manage milestones</p>
          </Card>
        </Link>

        {/* CONTRACTOR BIDS */}
        <Link href="/gov/bids">
          <Card clickable className="p-6">
            <h2 className="text-xl font-semibold mb-2">Contractor Bids</h2>
            <p className="text-gray-400 text-sm">View and award bids for your tenders</p>
          </Card>
        </Link>

        {/* VERIFY CONTRACTOR */}
        <Link href="/gov/contractors">
          <Card clickable className="p-6">
            <h2 className="text-xl font-semibold mb-2">Verify Contractor</h2>
            <p className="text-gray-400 text-sm">Verify contractor identities on blockchain</p>
          </Card>
        </Link>

        {/* PUBLIC VIEW */}
        <Link href="/gov/public-view">
          <Card clickable className="p-6">
            <h2 className="text-xl font-semibold mb-2">Public Tenders View</h2>
            <p className="text-gray-400 text-sm">See how citizens view public tenders</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
