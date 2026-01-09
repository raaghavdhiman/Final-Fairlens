"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserFromToken, UserRole } from "@/lib/authClient";

export function requireRole(requiredRole: UserRole) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const role = getUserFromToken(token);

      if (role !== requiredRole) {
        router.replace("/public/tenders");
      }
    } catch {
      router.replace("/login");
    }
  }, [router, requiredRole]);
}
