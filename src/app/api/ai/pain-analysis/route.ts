import { NextResponse } from "next/server";

import { LLMService } from "@/lib/ai/llm-service";
import type { Contact } from "@/types/contact";

type PainAnalysisRequest = {
  provider: "openrouter" | "groq";
  apiKey: string;
  model: string;
  contacts: Contact[];
  appName?: string;
  appUrl?: string;
};

export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as PainAnalysisRequest;
    if (!body.apiKey) {
      return NextResponse.json({ error: "API ключ не передан" }, { status: 400 });
    }
    const service = new LLMService(body.provider, body.apiKey, body.model, body.appName, body.appUrl);
    const analysis = await service.analyzeAllPainPoints(body.contacts);
    return NextResponse.json({ data: analysis });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Не удалось выполнить сводный анализ";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
