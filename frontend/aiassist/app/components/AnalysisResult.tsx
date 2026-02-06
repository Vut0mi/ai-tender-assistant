export default function AnalysisResult({ data }: any) {
  return (
    <div className="mt-6 space-y-4">
      <div>
        <strong>Eligibility:</strong>{" "}
        <span className="text-green-600">
          {data.eligibility}
        </span>
      </div>

      <div>
        <strong>Deadline:</strong> {data.deadline}
      </div>

      <div>
        <strong>Risk Level:</strong>{" "}
        <span className="text-yellow-600">
          {data.riskLevel}
        </span>
      </div>

      <div>
        <strong>Missing Documents:</strong>
        <ul className="list-disc ml-6">
          {data.missingDocuments.map((doc: string, i: number) => (
            <li key={i}>{doc}</li>
          ))}
        </ul>
      </div>

      <div>
        <strong>Summary:</strong>
        <p className="text-gray-700 mt-1">
          {data.summary}
        </p>
      </div>
    </div>
  );
}

