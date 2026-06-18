import { buildLlmsTxt, llmsTxtHeaders } from "@/lib/llms-txt";

export const dynamic = "force-static";
export const revalidate = 86400;

/** Alias for crawlers that look for /llm.txt instead of /llms.txt. */
export async function GET() {
  return new Response(buildLlmsTxt(), { headers: llmsTxtHeaders() });
}
