export default function HowItWorksPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl how-title">
        How FairLens Ensures Transparency
      </h1>

      <p className="how-subtitle">
        FairLens is a public transparency platform designed to let citizens
        track government tenders, payments, and project progress in a
        verifiable and tamper-proof manner.
      </p>

      <section className="how-step">
        <div className="how-step-row">
          <span className="how-badge" aria-hidden>1</span>
          <div>
            <h2 className="how-step-title">Tender Publication</h2>
            <p className="how-step-desc">
              Government departments publish tenders on FairLens along with
              budgets, timelines, and milestones. Once published, this
              information is visible to everyone.
            </p>
          </div>
        </div>
      </section>

      <section className="how-step">
        <div className="how-step-row">
          <span className="how-badge" aria-hidden>2</span>
          <div>
            <h2 className="how-step-title">Contractor Selection & Milestones</h2>
            <p className="how-step-desc">
              Contractors submit bids. After selection, the project is broken
              into milestones with clear amounts and deadlines.
            </p>
          </div>
        </div>
      </section>

      <section className="how-step">
        <div className="how-step-row">
          <span className="how-badge" aria-hidden>3</span>
          <div>
            <h2 className="how-step-title">Blockchain-Backed Payments</h2>
            <p className="how-step-desc">
              When a milestone is completed, payment details are recorded on
              the blockchain. This creates an immutable public record that
              cannot be altered later.
            </p>
          </div>
        </div>
      </section>

      <section className="how-step">
        <div className="how-step-row">
          <span className="how-badge" aria-hidden>4</span>
          <div>
            <h2 className="how-step-title">Public Verification</h2>
            <p className="how-step-desc">
              Every citizen can independently verify milestone payments using
              cryptographic proof. No government authority can modify or hide
              these records.
            </p>
          </div>
        </div>
      </section>

      <section className="how-warning">
        <p className="text-sm">
          <span className="icon">⚠️</span>
          FairLens does not store money. It only stores proofs.
          Government funds remain under official control.
        </p>
      </section>
    </div>
  );
}
