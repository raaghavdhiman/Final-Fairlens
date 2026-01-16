import Link from "next/link";
import Card from "@/components/Card";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-20">
        <h1 className="text-4xl font-bold mb-4 text-[var(--color-text-primary)]">
          FairLens
        </h1>

        <p className="text-lg text-[var(--color-text-secondary)] max-w-xl mb-8">
          A public transparency platform for government tenders,
          milestone-based payments, and on-chain verification.
        </p>

        <Link
          href="/public/tenders"
          className="px-6 py-3 rounded bg-[var(--color-accent)] text-[var(--btn-primary-text)] hover:bg-[#1ae8ff] transition"
        >
          View Public Tenders
        </Link>
      </section>

      {/* What is FairLens? */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] text-center mb-8">
            What is FairLens?
          </h2>
          <div className="bg-white shadow-sm rounded-xl p-8">
            <p className="text-lg leading-relaxed text-[var(--color-text-secondary)]">
              FairLens is a public transparency platform that provides citizens with real-time access to government tender processes.
              By tracking tenders from publication to completion, and verifying payments through blockchain technology,
              FairLens ensures accountability and builds trust in public procurement.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-[var(--color-text-primary)]">
            How It Works
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white shadow-sm rounded-xl p-8 h-full">
            <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">
              1. Tender Published
            </h3>
            <p className="text-[var(--color-text-secondary)] leading-relaxed">
              Government publishes tender requirements and budget details.
            </p>
          </div>

          <div className="bg-white shadow-sm rounded-xl p-8 h-full">
            <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">
              2. Bids Submitted
            </h3>
            <p className="text-[var(--color-text-secondary)] leading-relaxed">
              Contractors submit competitive bids through the platform.
            </p>
          </div>

          <div className="bg-white shadow-sm rounded-xl p-8 h-full">
            <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">
              3. Milestones Defined
            </h3>
            <p className="text-[var(--color-text-secondary)] leading-relaxed">
              Project milestones and payment schedules are established.
            </p>
          </div>

          <div className="bg-white shadow-sm rounded-xl p-8 h-full">
            <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">
              4. Payments Verified
            </h3>
            <p className="text-[var(--color-text-secondary)] leading-relaxed">
              Milestone completion verified on-chain before payments.
            </p>
          </div>
        </div>
      </section>

      {/* Why FairLens? */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-[var(--color-text-primary)]">
            Why FairLens?
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <h3 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-4">
              Transparency
            </h3>
            <p className="text-[var(--color-text-secondary)] leading-relaxed">
              Complete visibility into government procurement processes.
            </p>
          </Card>

          <Card>
            <h3 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-4">
              Accountability
            </h3>
            <p className="text-[var(--color-text-secondary)] leading-relaxed">
              Ensures funds are used according to established guidelines.
            </p>
          </Card>

          <Card>
            <h3 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-4">
              Public Trust
            </h3>
            <p className="text-[var(--color-text-secondary)] leading-relaxed">
              Builds confidence through verifiable, tamper-proof records.
            </p>
          </Card>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm text-[var(--color-text-muted)] bg-white rounded-lg shadow-sm p-6">
            FairLens does not hold or transfer funds. It only stores verifiable public proofs.
          </p>
        </div>
      </section>
    </main>
  );
}
