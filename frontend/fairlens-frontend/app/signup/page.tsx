"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveAuth } from "@/utils/auth";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("PUBLIC");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
          password,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }

      // Save token + role
      saveAuth(data.accessToken, data.user.role);

      // Redirect based on role
      if (data.user.role === "GOVERNMENT") {
        router.push("/gov");
      } else if (data.user.role === "CONTRACTOR") {
        router.push("/contractor");
      } else {
        router.push("/public/tenders");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md p-6 border border-gray-700 rounded"
      >
        <h1 className="text-2xl font-bold mb-4">Create Account</h1>

        {error && (
          <p className="text-red-400 text-sm mb-3">{error}</p>
        )}

        <input
          type="text"
          placeholder="Name"
          className="w-full mb-3 p-2 bg-black border border-gray-700 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 bg-black border border-gray-700 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-2 bg-black border border-gray-700 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <select
          className="w-full mb-4 p-2 bg-black border border-gray-700 rounded"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="PUBLIC">Public</option>
          <option value="CONTRACTOR">Contractor</option>
          <option value="GOVERNMENT">Government</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded font-medium"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>
        <div className="mt-4 text-center">
  <button
    type="button"
    onClick={() => router.push("/public/tenders")}
    className="text-sm text-gray-400 hover:underline"
  >
    Continue as Anonymous →
  </button>
</div>

      </form>
    </div>
    
  );
  
}
