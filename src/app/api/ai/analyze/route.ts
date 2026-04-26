import { NextResponse } from "next/server";

import { LLMService } from "@/lib/ai/llm-service";
import type { Contact } from "@/types/contact";

type AnalyzeRequest = {
  provider: "openrouter" | "groq";
  apiKey: string;
  model: string;
  contact: Contact;
  appName?: string;
  appUrl?: string;
};

export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as AnalyzeRequest;
    if (!body.apiKey) {
      return NextResponse.json({ error: "API ключ не передан" }, { status: 400 });
    }
    const service = new LLMService(body.provider, body.apiKey, body.model, body.appName, body.appUrl);
    const analysis = await service.analyzeContact(body.contact);
    return NextResponse.json({ data: analysis });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Не удалось выполнить анализ";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
