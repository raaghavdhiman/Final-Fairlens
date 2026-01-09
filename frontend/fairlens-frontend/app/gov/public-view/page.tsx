"use client";

import { requireRole } from "@/lib/requireRole";
import PublicTendersView from "@/components/PublicTendersView";

export default function GovPublicViewPage() {
  requireRole("GOVERNMENT");

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-2 title-strong">Public Tenders View</h1>

      <p className="text-gray-400 mb-6">
        This is exactly how citizens see public tenders.
      </p>

      <PublicTendersView />
    </div>
  );
}
