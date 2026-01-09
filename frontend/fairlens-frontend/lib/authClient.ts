import { jwtDecode } from "jwt-decode";

export type UserRole = "PUBLIC" | "CONTRACTOR" | "GOVERNMENT";

export type DecodedToken = {
  sub: string;
  email: string;
  role: UserRole;
  exp: number;
};

export function getUserFromToken(
  token: string | null
): UserRole | null {
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.role; // ✅ RETURN ONLY ROLE
  } catch {
    return null;
  }
}
