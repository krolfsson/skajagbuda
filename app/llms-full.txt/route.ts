import { buildLlmsFullTxt, llmsTxtHeaders } from "@/lib/llms-txt";

export const dynamic = "force-static";
export const revalidate = 86400;

export async function GET() {
  return new Response(buildLlmsFullTxt(), { headers: llmsTxtHeaders() });
}
