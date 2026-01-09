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
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm p-6 border rounded"
      >
        <h1 className="text-xl font-bold mb-4">Login</h1>

        {error && (
          <p className="text-red-500 text-sm mb-3">{error}</p>
        )}

        <input
          type="email"
          className="w-full mb-3 p-2 border rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="w-full mb-4 p-2 border rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="w-full bg-black text-white py-2 rounded">
          Login
        </button>

        {/* 🔓 Anonymous Access */}
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
