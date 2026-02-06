"use client";

import { useState } from "react";
import PdfUploader from "../components/PdfUploader";
import AnalysisResult from "../components/AnalysisResult";

export default function DashboardPage() {
  const [analysis, setAnalysis] = useState<any>(null);

  const runMockAnalysis = () => {
    setAnalysis({
      eligibility: "Eligible",
      missingDocuments: [
        "Tax Clearance Certificate",
        "BBBEE Certificate",
      ],
      deadline: "15 March 2026",
      riskLevel: "Medium",
      summary:
        "The tender is suitable for SMEs but requires compliance documents before submission.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">
        AI Tender Assistant
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PdfUploader />

        <div className="bg-white p-6 rounded-xl shadow">
          <button
            onClick={runMockAnalysis}
            className="bg-black text-white px-4 py-2 rounded-lg"
          >
            Analyse Tender
          </button>

          {analysis && <AnalysisResult data={analysis} />}
        </div>
      </div>
    </div>
  );
}

