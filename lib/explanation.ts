import {
  assessPlacement,
  placements,
  type Placement,
  type PlacementAssessment,
} from "./funding";

export class ExplanationProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ExplanationProviderError";
  }
}

function buildPrompt(
  placement: Placement,
  assessment: PlacementAssessment,
): string {
  return [
    "Explain this fictional university funding record in at most 3 short sentences.",
    "Use only the structured fields and deterministic assessment below; do not infer facts.",
    "Describe eligibility only as eligibility for human payment review, never as payment approval.",
    "Do not assess employability, verify evidence, recommend a hire, or make a funding decision.",
    "Mention any warning flags as matters for human review, not as proven misconduct.",
    JSON.stringify({
      fictional: true,
      placement: {
        id: placement.id,
        studentId: placement.studentId,
        employerName: placement.employerName,
        isPartner: placement.isPartner,
        genuineRole: placement.genuineRole,
        role: placement.role,
        paid: placement.paid,
        officialStartDate: placement.officialStartDate,
        evidenceStatus: placement.evidenceStatus,
      },
      deterministicAssessment: {
        verifiedPaidStart: assessment.verifiedPaidStart,
        paymentEligibleForHumanReview: assessment.paymentEligible,
        eligibilityReason: assessment.eligibilityReason,
        warningFlags: assessment.warningFlags,
      },
    }),
  ].join("\n");
}

export function createExplanationHandler(
  generateText: (prompt: string) => Promise<string>,
) {
  return async (request: Request): Promise<Response> => {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
    }

    if (
      typeof body !== "object" ||
      body === null ||
      !("placementId" in body) ||
      typeof body.placementId !== "string" ||
      body.placementId.length > 32
    ) {
      return Response.json({ error: "A valid placement ID is required." }, { status: 400 });
    }

    const placement = placements.find(({ id }) => id === body.placementId);
    if (!placement) {
      return Response.json({ error: "Placement not found." }, { status: 404 });
    }

    try {
      const summary = (await generateText(
        buildPrompt(placement, assessPlacement(placement)),
      )).trim();
      if (!summary) {
        throw new ExplanationProviderError("The LLM returned an empty explanation.");
      }
      return Response.json({ summary: summary.slice(0, 1200), source: "llm" });
    } catch (error) {
      if (error instanceof ExplanationProviderError) {
        return Response.json({ error: error.message }, { status: 502 });
      }
      throw error;
    }
  };
}

export async function generateGeminiText(
  prompt: string,
  apiKey: string,
  fetcher: typeof fetch = fetch,
): Promise<string> {
  let response: Response;
  try {
    response = await fetcher(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 180 },
        }),
        signal: AbortSignal.timeout(20000),
      },
    );
  } catch {
    throw new ExplanationProviderError("The LLM service could not be reached.");
  }

  if (!response.ok) {
    throw new ExplanationProviderError(
      `The LLM service returned HTTP ${response.status}.`,
    );
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new ExplanationProviderError("The LLM service returned an invalid response.");
  }

  if (typeof payload !== "object" || payload === null || !("candidates" in payload)) {
    throw new ExplanationProviderError("The LLM service returned no explanation.");
  }
  const candidates = payload.candidates;
  if (!Array.isArray(candidates) || candidates.length === 0) {
    throw new ExplanationProviderError("The LLM service returned no explanation.");
  }
  const firstCandidate: unknown = candidates[0];
  if (
    typeof firstCandidate !== "object" ||
    firstCandidate === null ||
    !("content" in firstCandidate) ||
    typeof firstCandidate.content !== "object" ||
    firstCandidate.content === null ||
    !("parts" in firstCandidate.content) ||
    !Array.isArray(firstCandidate.content.parts)
  ) {
    throw new ExplanationProviderError("The LLM service returned no explanation.");
  }
  const text = firstCandidate.content.parts
    .map((part: unknown) =>
      typeof part === "object" && part !== null && "text" in part &&
      typeof part.text === "string"
        ? part.text
        : "",
    )
    .join("")
    .trim();
  if (!text) {
    throw new ExplanationProviderError("The LLM service returned no explanation.");
  }
  return text;
}
