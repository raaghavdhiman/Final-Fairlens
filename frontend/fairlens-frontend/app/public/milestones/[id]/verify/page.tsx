import { ethToInr, formatInr } from "@/utils/currency";
import MoneyAmount from "@/components/MoneyAmount";
import Card from "@/components/Card";

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
      <Card className={`mb-6 ${data.verified ? "border-green-500 bg-green-500/10 text-green-400" : "border-red-500 bg-red-500/10 text-red-400"}`}>
        <p className="font-semibold">{data.verified ? "✅ Payment Verified On-Chain" : "❌ Verification Failed"}</p>
      </Card>

      {/* PAYMENT */}
      <Card className="mb-6 border-gray-700">
        <h2 className="font-semibold mb-2">Payment Details</h2>

        <p className="text-sm text-gray-300">Amount Paid: <MoneyAmount eth={paidEth} /></p>

        <p className="text-xs text-[rgba(47,69,80,0.7)] mt-2">Transaction: <a href={`https://sepolia.etherscan.io/tx/${data.payment.txHash}`} target="_blank" className="text-[rgba(47,69,80,0.7)] ml-2 break-all">{data.payment.txHash}</a></p>
      </Card>

      {/* CRYPTO PROOF */}
      <Card className="border-gray-700">
        <h2 className="font-semibold mb-2">Cryptographic Proof</h2>

        <p className="text-xs text-[rgba(47,69,80,0.7)] mb-2 break-all"><span className="font-medium">Emitted Hash:</span> {data.cryptographicProof.emittedHash}</p>

        <p className="text-xs text-[rgba(47,69,80,0.7)] break-all"><span className="font-medium">Recomputed Hash:</span> {data.cryptographicProof.recomputedHash}</p>
      </Card>
    </div>
  );
}
