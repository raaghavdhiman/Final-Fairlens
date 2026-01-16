import Card from "@/components/Card";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
        About FairLens
      </h1>

      <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
        FairLens is a public transparency platform designed to enhance accountability in government procurement processes.
        By providing citizens with real-time access to tender information, milestone tracking, and blockchain-verified payments,
        FairLens empowers communities to monitor public spending and ensure fair, efficient use of taxpayer funds.
      </p>

      <Card>
        <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-4">
          Our Mission
        </h2>
        <p className="text-[var(--color-text-secondary)] leading-relaxed">
          To build trust in government operations through transparent, verifiable, and accessible public procurement data.
          We believe that open access to information strengthens democracy and promotes responsible governance.
        </p>
      </Card>

      <Card>
        <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-4">
          Why Transparency Matters
        </h2>
        <p className="text-[var(--color-text-secondary)] leading-relaxed">
          Transparent procurement processes reduce corruption, improve efficiency, and ensure that public funds are used
          effectively. When citizens can track tenders from initiation to completion, it creates accountability at every level
          of government operations and builds public confidence in institutional processes.
        </p>
      </Card>

      <Card>
        <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-4">
          How FairLens Helps Citizens
        </h2>
        <p className="text-[var(--color-text-secondary)] leading-relaxed">
          FairLens provides comprehensive visibility into government tenders, contractor milestones, and payment verification.
          Citizens can monitor project progress, verify fund utilization, and ensure that procurement follows established
          guidelines. Our platform serves as a public watchdog, making government operations more accessible and accountable.
        </p>
      </Card>

      <Card>
        <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-4">
          Blockchain as a Trust Layer
        </h2>
        <p className="text-[var(--color-text-secondary)] leading-relaxed">
          By leveraging blockchain technology, FairLens provides immutable records of all procurement activities.
          Smart contracts ensure that milestones are met before payments are released, and cryptographic proofs
          allow independent verification of all transactions. This creates an unalterable audit trail that
          enhances trust in public financial management.
        </p>
      </Card>
    </div>
  );
}
