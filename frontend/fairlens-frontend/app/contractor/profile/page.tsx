"use client";

import { useEffect, useState } from "react";
import { requireRole } from "@/lib/requireRole";

const API_URL = "http://localhost:3001";

export default function ContractorProfilePage() {
  requireRole("CONTRACTOR");

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (loading) {
    return <div className="p-6">Loading profile...</div>;
  }

  if (!user) {
    return <div className="p-6">Profile not found</div>;
  }

  const isVerified = Boolean(user.contractorHash);

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">
        Contractor Profile
      </h1>

      {/* BASIC INFO */}
      <div className="border p-4 rounded space-y-2">
        <p>
          <span className="font-medium">Name:</span>{" "}
          {user.name}
        </p>
        <p>
          <span className="font-medium">Email:</span>{" "}
          {user.email}
        </p>
        <p>
          <span className="font-medium">Wallet:</span>{" "}
          {user.walletAddress ?? "Not linked"}
        </p>
      </div>

      {/* VERIFICATION STATUS */}
      <div className="border p-4 rounded space-y-3">
        <h2 className="text-xl font-semibold">
          Verification Status
        </h2>

        {isVerified ? (
          <>
            <p className="text-green-500 font-medium">
              ✅ Verified on Blockchain
            </p>

            <p className="text-sm text-gray-400 break-all">
              <span className="font-medium text-gray-300">
                Contractor Hash:
              </span>{" "}
              {user.contractorHash}
            </p>

            <p className="text-sm text-gray-400">
              <span className="font-medium text-gray-300">
                Verified At:
              </span>{" "}
              {new Date(user.verifiedAt).toLocaleString()}
            </p>
          </>
        ) : (
          <p className="text-yellow-500">
            ⚠️ Not verified yet.  
            You cannot bid until a government authority verifies you.
          </p>
        )}
      </div>
    </div>
  );
}
