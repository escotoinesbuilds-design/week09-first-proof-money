import assert from "node:assert/strict";
import test from "node:test";
import {
  createExplanationHandler,
  ExplanationProviderError,
  generateGeminiText,
} from "./explanation";

test("LLM handler uses structured fictional placement and deterministic assessment", async () => {
  let capturedPrompt = "";
  const handler = createExplanationHandler(async (prompt) => {
    capturedPrompt = prompt;
    return "This is a pending-evidence fictional record.";
  });
  const response = await handler(
    new Request("http://localhost/api/ai-explanation", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ placementId: "FP-1004" }),
    }),
  );

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    summary: "This is a pending-evidence fictional record.",
    source: "llm",
  });
  assert.match(capturedPrompt, /"fictional":true/);
  assert.match(capturedPrompt, /"evidenceStatus":"pending"/);
  assert.match(capturedPrompt, /"paymentEligibleForHumanReview":false/);
  assert.match(capturedPrompt, /Possible shadow-clause issue/);
  assert.match(capturedPrompt, /Do not assess employability/);
});

test("LLM handler rejects invalid JSON, malformed identifiers, and unknown records", async () => {
  let generationCount = 0;
  const handler = createExplanationHandler(async () => {
    generationCount += 1;
    return "Should not run";
  });

  const invalidJson = await handler(
    new Request("http://localhost/api/ai-explanation", {
      method: "POST",
      body: "{",
    }),
  );
  const invalidId = await handler(
    new Request("http://localhost/api/ai-explanation", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ placementId: 12 }),
    }),
  );
  const unknownId = await handler(
    new Request("http://localhost/api/ai-explanation", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ placementId: "FP-9999" }),
    }),
  );

  assert.equal(invalidJson.status, 400);
  assert.equal(invalidId.status, 400);
  assert.equal(unknownId.status, 404);
  assert.equal(generationCount, 0);
});

test("Gemini API key is sent server-side in a header and response text is extracted", async () => {
  let requestUrl = "";
  let requestHeaders = new Headers();
  let requestBody: unknown;
  const fakeFetch: typeof fetch = async (input, init) => {
    requestUrl = String(input);
    requestHeaders = new Headers(init?.headers);
    requestBody = JSON.parse(String(init?.body));
    return new Response(
      JSON.stringify({
        candidates: [
          { content: { parts: [{ text: "A bounded explanation." }] } },
        ],
      }),
      { status: 200, headers: { "content-type": "application/json" } },
    );
  };

  const text = await generateGeminiText("fictional record prompt", "test-key", fakeFetch);

  assert.equal(text, "A bounded explanation.");
  assert.match(requestUrl, /gemini-2\.5-flash:generateContent$/);
  assert.equal(requestHeaders.get("x-goog-api-key"), "test-key");
  assert.equal(requestUrl.includes("test-key"), false);
  assert.deepEqual(requestBody, {
    contents: [{ parts: [{ text: "fictional record prompt" }] }],
    generationConfig: { temperature: 0.2, maxOutputTokens: 180 },
  });
});

test("Gemini provider errors are surfaced as explicit unavailable responses", async () => {
  const handler = createExplanationHandler(async () => {
    throw new ExplanationProviderError("The LLM service returned HTTP 429.");
  });
  const response = await handler(
    new Request("http://localhost/api/ai-explanation", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ placementId: "FP-1004" }),
    }),
  );

  assert.equal(response.status, 502);
  assert.deepEqual(await response.json(), {
    error: "The LLM service returned HTTP 429.",
  });
});
