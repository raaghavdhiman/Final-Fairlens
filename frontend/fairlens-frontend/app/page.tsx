import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-4xl font-bold mb-4">
        FairLens
      </h1>

      <p className="text-lg text-gray-600 max-w-xl mb-8">
        A public transparency platform for government tenders, 
        milestone-based payments, and on-chain verification.
      </p>

      <Link
        href="/public/tenders"
        className="px-6 py-3 rounded bg-black text-white hover:bg-gray-800 transition"
      >
        View Public Tenders
      </Link>
    </main>
  );
}
