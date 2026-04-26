import { NextResponse } from "next/server";

import { LLMService } from "@/lib/ai/llm-service";
import type { MessageTone } from "@/types/ai";
import type { Contact } from "@/types/contact";

type MessageRequest = {
  provider: "openrouter" | "groq";
  apiKey: string;
  model: string;
  contact: Contact;
  tone: MessageTone;
  appName?: string;
  appUrl?: string;
};

export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as MessageRequest;
    if (!body.apiKey) {
      return NextResponse.json({ error: "API ключ не передан" }, { status: 400 });
    }
    const service = new LLMService(body.provider, body.apiKey, body.model, body.appName, body.appUrl);
    const message = await service.generateMessage(body.contact, body.tone);
    return NextResponse.json({ data: { message } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Не удалось сгенерировать сообщение";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
