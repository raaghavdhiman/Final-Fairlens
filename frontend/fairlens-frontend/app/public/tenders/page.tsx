import TenderList from "./TenderList";

async function getTenders() {
  const res = await fetch(
    "http://localhost:3001/public/tenders",
    { cache: "no-store" }
  );

  if (!res.ok) return [];
  return res.json();
}

export default async function PublicTendersPage() {
  const tenders = await getTenders();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Public Tenders
      </h1>

      <TenderList tenders={tenders} />
    </div>
  );
}
