"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getRole, clearAuth } from "@/utils/auth";

function IconShield({ className }: { className?: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L4 5v6c0 5.25 3.5 10 8 11 4.5-1 8-5.75 8-11V5l-8-3z" fill="currentColor" />
      <path d="M9.5 11.5l1.8 1.8 3.2-3.2" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconLogIn({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M15 3h4a1 1 0 011 1v16a1 1 0 01-1 1h-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 17l5-5-5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 12H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconUserPlus({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20 8v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M23 11h-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconLogOut({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 17l5-5-5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 12H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Navbar() {
  const [role, setRole] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setRole(getRole());
  }, []);

  function isActive(href: string) {
    if (!pathname) return false;
    if (href === "/" && pathname === "/") return true;
    return pathname.startsWith(href) && href !== "/";
  }

  return (
    <header
      style={{ background: "var(--navy-authority)", boxShadow: "0 1px 0 rgba(15,23,42,0.06)" }}
      className="w-full"
    >
      <div className="max-w-[var(--app-max-width)] mx-auto flex items-center" style={{ height: 76 }}>
        {/* LEFT: Brand */}
        <div className="flex items-center px-6" style={{ minWidth: 300, gap: 12 }}>
          <Link href="/" className="flex items-center gap-3">
            <div style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
              <IconShield />
            </div>
            <div className="flex flex-col">
              <span style={{ color: "var(--surface-white)" }} className="text-2xl brand-title">FairLens</span>
              <span className="brand-sub">Public Transparency Platform</span>
            </div>
          </Link>
        </div>

        {/* CENTER: primary nav */}
        <nav className="flex-1 px-6">
          <ul className="flex items-center justify-start gap-8 text-sm">
            <li>
              <Link
                href="/"
                className={`nav-link ${isActive("/") ? "nav-link active" : ""}`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/public/tenders"
                className={`nav-link ${isActive("/public/tenders") ? "nav-link active" : ""}`}
              >
                Public Tenders
              </Link>
            </li>
            <li>
              <Link
                href="/how-it-works"
                className={`nav-link ${isActive("/how-it-works") ? "nav-link active" : ""}`}
              >
                How It Works
              </Link>
            </li>

            {role === "CONTRACTOR" && (
              <>
                <li>
                  <Link href="/contractor/tenders" className={`text-white/90 hover:text-white meta ${isActive("/contractor") ? "border-b-2 border-[var(--accent-blue)] pb-2" : "pb-2"}`}>
                    My Tenders
                  </Link>
                </li>
                <li>
                  <Link href="/contractor/work" className="text-white/90 hover:text-white meta pb-2">
                    Work
                  </Link>
                </li>
              </>
            )}

            {role === "GOVERNMENT" && (
              <>
                <li>
                  <Link href="/gov/tenders" className={`text-white/90 hover:text-white meta ${isActive("/gov/tenders") ? "border-b-2 border-[var(--accent-blue)] pb-2" : "pb-2"}`}>
                    My Tenders
                  </Link>
                </li>
                <li>
                  <Link href="/gov/bids" className="text-white/90 hover:text-white meta pb-2">
                    Bids
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* RIGHT: actions */}
        <div className="px-6 flex items-center gap-3">
          {(() => {
            const isDashboard = !!pathname && (pathname.startsWith("/gov") || pathname.startsWith("/contractor"));

            if (isDashboard) {
              return (
                <button
                  onClick={async () => {
                    try {
                      clearAuth();
                    } catch (err) {
                      console.error("Logout failed", err);
                    }
                    router.push("/login");
                  }}
                  className="btn-logout"
                  title="Logout"
                >
                  <IconLogOut />
                  <span>Logout</span>
                </button>
              );
            }

            // Non-dashboard routes: preserve previous behavior
            return (
              <>
                {!role && (
                  <>
                    <Link href="/login" className="btn-ghost" aria-label="Login">
                      <IconLogIn />
                      <span>Login</span>
                    </Link>

                    <Link
                      href="/signup"
                      className="btn-primary"
                      aria-label="Signup"
                    >
                      <IconUserPlus />
                      <span>Signup</span>
                    </Link>
                  </>
                )}

                {role === "CONTRACTOR" && (
                  <Link href="/contractor/profile" className="px-3 py-1 text-white/95 meta">
                    Contractor
                  </Link>
                )}

                {role === "GOVERNMENT" && (
                  <Link href="/gov" className="px-3 py-1 text-white/95 meta">
                    Government
                  </Link>
                )}
              </>
            );
          })()}
        </div>
      </div>
    </header>
  );
}
