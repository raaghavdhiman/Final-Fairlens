export default function Footer() {
  return (
    <footer style={{ background: "var(--background-canvas)" }} className="w-full border-t">
      <div className="max-w-[var(--app-max-width)] mx-auto px-6 py-8 text-sm" style={{ color: "var(--text-secondary)" }}>
        <div className="flex items-start justify-between gap-6">
          <div style={{ maxWidth: 520 }}>
            <div className="flex items-center gap-3">
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(10,37,64,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* simple brand mark */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L4 5v6c0 5.25 3.5 10 8 11 4.5-1 8-5.75 8-11V5l-8-3z" fill="currentColor" opacity="0.9" />
                </svg>
              </div>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>FairLens</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Public Transparency Platform</div>
              </div>
            </div>

            <p style={{ marginTop: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              About FairLens<br />
              FairLens is a public transparency platform enabling citizens to track government tenders, milestones, and payments with on-chain verification.
            </p>
          </div>

          <div className="flex gap-12">
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Explore</div>
              <ul style={{ marginTop: 8 }}>
                <li className="mt-2"><a className="footer-link" href="/public/tenders">Public Tenders</a></li>
                <li className="mt-2"><a className="footer-link" href="/how-it-works">How It Works</a></li>
                <li className="mt-2"><a className="footer-link" href="/about">About Us</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 20, borderTop: '1px solid rgba(15,23,42,0.04)', paddingTop: 14, color: 'var(--text-secondary)' }}>
          © {new Date().getFullYear()} FairLens — Public Procurement Dashboard
        </div>
      </div>
    </footer>
  );
}
