const mockAnalysis = {
  mandatoryDocuments: [
    "Signed SBD1 Form",
    "Tax Clearance Certificate"
  ],
  manualFields: ["Pricing Schedule"],
  signatureRequired: true,
  complianceScore: 0.85
};

export default function ReviewPage() {
  return (
    <div className="p-10 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">
        Tender Analysis
      </h2>

      <p className="mb-4">
        Compliance Score: <strong>{mockAnalysis.complianceScore * 100}%</strong>
      </p>

      <h3 className="font-semibold">Mandatory Documents</h3>
      <ul className="list-disc pl-6 mb-4">
        {mockAnalysis.mandatoryDocuments.map(doc => (
          <li key={doc}>{doc}</li>
        ))}
      </ul>

      {mockAnalysis.signatureRequired && (
        <p className="text-red-600 font-medium">
          ⚠ Signature required before submission
        </p>
      )}
    </div>
  );
}

