import { ethToInr, formatInr } from "@/utils/currency";

async function getVerification(id: string) {
  const res = await fetch(
    `http://localhost:3001/public/verify/milestone/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;
  return res.json();
}

export default async function MilestoneVerificationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getVerification(id);

  if (!data) {
    return (
      <div className="p-6 text-red-400">
        Verification data not found.
      </div>
    );
  }

  const paidEth = data.payment.paidEth;
  const paidInr = ethToInr(paidEth);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        Milestone Payment Verification
      </h1>

      {/* STATUS */}
      <div
        className={`mb-6 p-4 rounded border ${
          data.verified
            ? "border-green-500 bg-green-500/10"
            : "border-red-500 bg-red-500/10"
        }`}
      >
        <p
          className={`font-semibold ${
            data.verified ? "text-green-400" : "text-red-400"
          }`}
        >
          {data.verified ? "✅ Payment Verified On-Chain" : "❌ Verification Failed"}
        </p>
      </div>

      {/* PAYMENT */}
      <div className="mb-6 border border-gray-700 rounded p-4">
        <h2 className="font-semibold mb-2">Payment Details</h2>

        <p className="text-sm text-gray-300">
          Amount Paid:{" "}
          <span className="font-medium">
            {formatInr(paidInr)}
          </span>{" "}
          <span className="text-gray-500">
            ({paidEth} ETH)
          </span>
        </p>

        <p className="text-xs text-gray-400 mt-2">
          Transaction:
          <a
            href={`https://sepolia.etherscan.io/tx/${data.payment.txHash}`}
            target="_blank"
            className="text-blue-400 ml-2 break-all"
          >
            {data.payment.txHash}
          </a>
        </p>
      </div>

      {/* CRYPTO PROOF */}
      <div className="border border-gray-700 rounded p-4">
        <h2 className="font-semibold mb-2">
          Cryptographic Proof
        </h2>

        <p className="text-xs text-gray-400 mb-2 break-all">
          <span className="font-medium">Emitted Hash:</span>{" "}
          {data.cryptographicProof.emittedHash}
        </p>

        <p className="text-xs text-gray-400 break-all">
          <span className="font-medium">Recomputed Hash:</span>{" "}
          {data.cryptographicProof.recomputedHash}
        </p>
      </div>
    </div>
  );
}
