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
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background-canvas)" }}>
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md p-6 surface rounded"
        style={{ border: "1px solid var(--text-muted)" }}
      >
        <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>Create Account</h1>

        {error && (
          <p className="text-sm mb-3" style={{ color: "var(--error)" }}>{error}</p>
        )}

        <label className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>Name</label>
        <input
          type="text"
          placeholder="Full name"
          className="w-full mb-3 p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ background: "var(--surface-white)", border: "1px solid var(--text-muted)" }}
        />

        <label className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          className="w-full mb-3 p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ background: "var(--surface-white)", border: "1px solid var(--text-muted)" }}
        />

        <label className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>Password</label>
        <input
          type="password"
          placeholder="••••••••"
          className="w-full mb-3 p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ background: "var(--surface-white)", border: "1px solid var(--text-muted)" }}
        />

        <label className="block text-sm mb-1" style={{ color: "var(--text-secondary)" }}>Role</label>
        <select
          className="w-full mb-4 p-2 rounded"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ background: "var(--surface-white)", border: "1px solid var(--text-muted)" }}
        >
          <option value="PUBLIC">Public</option>
          <option value="CONTRACTOR">Contractor</option>
          <option value="GOVERNMENT">Government</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full text-white p-2 rounded font-medium"
          style={{ background: "var(--accent-blue)" }}
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => router.push("/public/tenders")}
            className="text-sm muted"
          >
            Continue as Anonymous →
          </button>
        </div>

      </form>
    </div>
    
  );
  
}
