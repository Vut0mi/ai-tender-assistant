"use client";

import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();

  return (
    <div className="p-10 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">
        Upload Tender Documents
      </h2>

      <input
        type="file"
        className="border p-4 w-full mb-6"
      />

      <button
        onClick={() => router.push("/review")}
        className="bg-black text-white px-6 py-3 rounded-xl"
      >
        Analyze Tender
      </button>
    </div>
  );
}

