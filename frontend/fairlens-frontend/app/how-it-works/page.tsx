export default function HowItWorksPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">
        How FairLens Ensures Transparency
      </h1>

      <p className="text-gray-300">
        FairLens is a public transparency platform designed to let citizens
        track government tenders, payments, and project progress in a
        verifiable and tamper-proof manner.
      </p>

      <section>
        <h2 className="text-xl font-semibold mb-2">
          1️⃣ Tender Publication
        </h2>
        <p className="text-gray-400">
          Government departments publish tenders on FairLens along with
          budgets, timelines, and milestones. Once published, this
          information is visible to everyone.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">
          2️⃣ Contractor Selection & Milestones
        </h2>
        <p className="text-gray-400">
          Contractors submit bids. After selection, the project is broken
          into milestones with clear amounts and deadlines.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">
          3️⃣ Blockchain-Backed Payments
        </h2>
        <p className="text-gray-400">
          When a milestone is completed, payment details are recorded on
          the blockchain. This creates an immutable public record that
          cannot be altered later.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">
          4️⃣ Public Verification
        </h2>
        <p className="text-gray-400">
          Every citizen can independently verify milestone payments using
          cryptographic proof. No government authority can modify or hide
          these records.
        </p>
      </section>

      <section className="border border-gray-700 rounded p-4">
        <p className="text-sm text-gray-400">
          ⚠️ FairLens does not store money. It only stores proofs.
          Government funds remain under official control.
        </p>
      </section>
    </div>
  );
}
