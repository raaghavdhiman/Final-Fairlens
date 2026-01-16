"use client";

import { useEffect, useState } from "react";
import { requireRole } from "@/lib/requireRole";
import Card from "@/components/Card";

const API_URL = "http://localhost:3001";

export default function ContractorProfilePage() {
  requireRole("CONTRACTOR");

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [walletInput, setWalletInput] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);

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

  const handleWalletChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setWalletInput(val);
    setIsValid(/^0x[a-fA-F0-9]{40}$/.test(val));
    setMessage(null);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("token");

      // ✅ FIX: correct endpoint
      const res = await fetch(`${API_URL}/users/me/wallet`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ walletAddress: walletInput }),
      });

      if (!res.ok) {
        throw new Error("Failed to link wallet");
      }

      // Re-fetch updated profile
      const profileRes = await fetch(`${API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedUser = await profileRes.json();
      setUser(updatedUser);

      setMessage("Wallet linked successfully!");
      setMessageType("success");
      setWalletInput("");
    } catch (err) {
      console.error(err);
      setMessage("Failed to link wallet. Please try again.");
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading profile...</div>;
  }

  if (!user) {
    return <div className="p-6">Profile not found</div>;
  }

  const hasWallet = Boolean(user.walletAddress);
  const isVerified = Boolean(user.contractorHash);

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-4 compact-vertical">
      <h1 className="text-3xl font-semibold title-strong">
        Contractor Profile
      </h1>

      {/* BASIC INFO */}
      <Card className="space-y-2">
        <p><span className="font-medium">Name:</span> {user.name}</p>
        <p><span className="font-medium">Email:</span> {user.email}</p>
        <p><span className="font-medium">Wallet:</span> {user.walletAddress ?? "Not linked"}</p>
      </Card>

      {/* VERIFICATION STATUS */}
      <Card className="space-y-3">
        <h2 className="text-xl font-semibold">Verification Status</h2>

        {isVerified ? (
          <>
            <p className="text-green-500 font-medium">✅ Verified on blockchain</p>

            <p className="text-sm text-gray-400 break-all">
              <span className="font-medium text-gray-300">Contractor Hash:</span>{" "}
              {user.contractorHash}
            </p>

            <p className="text-sm text-gray-400">
              <span className="font-medium text-gray-300">Verified At:</span>{" "}
              {new Date(user.verifiedAt).toLocaleString()}
            </p>
          </>
        ) : hasWallet ? (
          <p className="text-yellow-500 font-medium">
            Wallet linked. Awaiting government verification.
          </p>
        ) : (
          <p className="text-yellow-500">
            ⚠️ Not verified yet. You cannot bid until a government authority verifies you.
          </p>
        )}
      </Card>

      {/* WALLET ADDRESS */}
      <Card className="space-y-3">
        <h2 className="text-xl font-semibold">Wallet Address</h2>

        {user.walletAddress ? (
          <>
            <p>
              <span className="font-medium">Wallet Address:</span>{" "}
              {user.walletAddress}
            </p>
            <p className="text-green-500 text-sm">Wallet linked</p>
            <p className="text-sm text-gray-500">
              Wallet addresses are locked once linked.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-600">
              Enter your Ethereum wallet address. Once linked, it cannot be changed.
            </p>

            <input
              type="text"
              value={walletInput}
              onChange={handleWalletChange}
              placeholder="0x..."
              className="w-full p-2 border border-gray-300 rounded"
            />

            <button
              onClick={handleSubmit}
              disabled={!isValid || submitting}
              className={submitting ? "btn-disabled" : "btn-primary-action"}
            >
              {submitting ? "Linking..." : "Link Wallet"}
            </button>

            {message && (
              <p
                className={`text-sm ${
                  messageType === "success" ? "text-green-500" : "text-red-500"
                }`}
              >
                {message}
              </p>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
