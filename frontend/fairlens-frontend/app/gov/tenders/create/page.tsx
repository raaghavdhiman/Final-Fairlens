"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { requireRole } from "@/lib/requireRole";

const API_URL = "http://localhost:3001";

export default function CreateTenderPage() {
  requireRole("GOVERNMENT");
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem("token");

    await fetch(`${API_URL}/tenders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description,
        budget: Number(budget),
      }),
    });

    router.push("/gov/tenders");
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold title-strong">Create Tender</h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="w-full p-2 border rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          className="w-full p-2 border rounded"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          className="w-full p-2 border rounded"
          type="number"
          placeholder="Budget (ETH)"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          required
        />

        <button className="px-4 py-2 bg-blue-600 rounded">
          Create Tender
        </button>
      </form>
    </div>
  );
}
