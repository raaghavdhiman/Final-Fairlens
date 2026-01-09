"use client";

import { useEffect, useState } from "react";
import { requireRole } from "@/lib/requireRole";

const API_URL = "http://localhost:3001";

type Contractor = {
  id: string;
  name: string;
  email: string;
  walletAddress: string | null;
  contractorHash: string | null;
  verifiedAt: string | null;
};

export default function VerifyContractorsPage() {
  requireRole("GOVERNMENT");

  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState<string | null>(null);

  useEffect(() => {
    fetchContractors();
  }, []);

  async function fetchContractors() {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    // Only contractors
    setContractors(
      Array.isArray(data)
        ? data.filter((u) => u.role === "CONTRACTOR")
        : []
    );

    setLoading(false);
  }

  async function verifyContractor(contractorId: string) {
    const token = localStorage.getItem("token");
    setVerifying(contractorId);

    try {
      const res = await fetch(
        `${API_URL}/users/${contractorId}/verify`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const err = await res.json();
        alert(err.message || "Verification failed");
        return;
      }

      alert("Contractor verified on blockchain");
      fetchContractors();
    } catch (err) {
      console.error(err);
      alert("Verification error");
    } finally {
      setVerifying(null);
    }
  }

  if (loading) {
    return <div className="p-6">Loading contractors...</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Verify Contractors</h1>

      {contractors.length === 0 && (
        <p className="text-gray-400">No contractors found</p>
      )}

      {contractors.map((c) => (
        <div
          key={c.id}
          className="border border-gray-700 p-4 rounded space-y-2"
        >
          <div>
            <p className="font-semibold">{c.name}</p>
            <p className="text-sm text-gray-400">{c.email}</p>
            <p className="text-sm">
              Wallet:{" "}
              {c.walletAddress ? c.walletAddress : "Not linked"}
            </p>
          </div>

          {c.contractorHash ? (
            <p className="text-green-500">
              ✅ Verified on blockchain
            </p>
          ) : (
            <button
              onClick={() => verifyContractor(c.id)}
              disabled={
                verifying === c.id || !c.walletAddress
              }
              className="px-4 py-1 bg-blue-600 rounded disabled:opacity-50"
            >
              {verifying === c.id
                ? "Verifying..."
                : "Verify Contractor"}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
