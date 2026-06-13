import OpenAI from "openai";

function getAiClient(): OpenAI {
  const apiKey = process.env.AI_API_KEY;
  const baseURL = process.env.AI_BASE_URL;

  if (!apiKey) {
    throw new Error("AI_API_KEY is not set in environment variables.");
  }

  return new OpenAI({
    apiKey,
    baseURL: baseURL ?? "https://api.openai.com/v1",
  });
}

export interface AiMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AiCompletionOptions {
  messages: AiMessage[];
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
}

export async function createCompletion(
  options: AiCompletionOptions
): Promise<string> {
  const client = getAiClient();
  const model = process.env.AI_MODEL ?? "gpt-4o";

  const response = await client.chat.completions.create({
    model,
    messages: options.messages,
    temperature: options.temperature ?? 0.2,
    max_tokens: options.maxTokens ?? 4096,
    ...(options.jsonMode && { response_format: { type: "json_object" } }),
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("AI returned empty response.");
  }

  return content;
}
