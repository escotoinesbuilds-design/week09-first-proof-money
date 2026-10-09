import {
  createExplanationHandler,
  generateGeminiText,
} from "@/lib/explanation";

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json(
      {
        error:
          "LLM explanation is unavailable. Configure the server-side GEMINI_API_KEY to enable it.",
      },
      { status: 503 },
    );
  }

  return createExplanationHandler((prompt) =>
    generateGeminiText(prompt, apiKey),
  )(request);
}
