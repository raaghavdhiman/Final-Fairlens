"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";
import { getUserFromToken } from "@/lib/authClient";

type UserRole = "PUBLIC" | "CONTRACTOR" | "GOVERNMENT";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const res = await login({
        email: email.trim(),
        password: password.trim(),
      });

      const token = res.access_token;
      localStorage.setItem("token", token);

      // ✅ FIX: explicit role typing
      const role = getUserFromToken(token) as UserRole;
      console.log("Role from token:", role);

      switch (role) {
        case "GOVERNMENT":
          router.push("/gov");
          break;
        case "CONTRACTOR":
          router.push("/contractor");
          break;
        default:
          router.push("/public/tenders");
      }
    } catch (err) {
      console.error(err);
      setError("Invalid credentials");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-page-bg)" }}>
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm p-6 surface rounded"
        style={{ border: "1px solid var(--color-border)" }}
      >
        <h1 className="text-xl font-bold mb-4" style={{ color: "var(--color-text-primary)" }}>Login</h1>

        {error && (
          <p className="text-sm mb-3" style={{ color: "var(--error)" }}>{error}</p>
        )}

        <label className="block text-sm mb-1" style={{ color: "var(--color-text-secondary)" }}>Email</label>
        <input
          type="email"
          className="w-full mb-3 p-2 rounded"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
        />

        <label className="block text-sm mb-1" style={{ color: "var(--color-text-secondary)" }}>Password</label>
        <input
          type="password"
          className="w-full mb-4 p-2 rounded"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}
        />

        <button className="w-full py-2 rounded text-[var(--btn-primary-text)]" style={{ background: "var(--color-accent)" }}>
          Login
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
