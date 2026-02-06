import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">
        AI Tender Assistant
      </h1>
      <p className="text-gray-600 mb-6 text-center max-w-xl">
        Analyze tender documents, auto-fill compliance forms,
        and prepare ready-to-sign submission packs.
      </p>
      <Link
        href="/upload"
        className="bg-black text-white px-6 py-3 rounded-xl"
      >
        Upload Tender
      </Link>
    </main>
  );
}

