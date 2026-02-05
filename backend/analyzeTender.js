import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: "us-east-1" });

export const handler = async () => {
  const prompt = `
You are a procurement compliance assistant.
Analyze the following tender text and return JSON only.

Tender text:
"The bidder must submit a signed SBD1 form and a valid tax clearance certificate."

Return format:
{
  "mandatoryDocuments": [],
  "signatureRequired": true
}
`;

  const command = new InvokeModelCommand({
    modelId: "amazon.nova-2-lite",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      inputText: prompt,
      maxTokens: 300
    })
  });

  const response = await client.send(command);
  const result = JSON.parse(new TextDecoder().decode(response.body));

  return {
    statusCode: 200,
    body: JSON.stringify(result)
  };
};

