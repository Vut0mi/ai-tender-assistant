"use client";

import { useState } from "react";

export default function PdfUploader() {
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setFileUrl(url);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="font-semibold mb-4">
        Upload Tender Document (PDF)
      </h2>

      <input
        type="file"
        accept="application/pdf"
        onChange={handleUpload}
      />

      {fileUrl && (
        <iframe
          src={fileUrl}
          className="mt-4 w-full h-[500px] border rounded"
        />
      )}
    </div>
  );
}

