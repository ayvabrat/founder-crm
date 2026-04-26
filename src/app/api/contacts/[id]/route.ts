import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { mapRowToContact } from "@/lib/server/contacts-mapper";
import { getUserContacts, saveUserContacts } from "@/lib/server/in-memory-db";
import { getSupabaseServerClient, hasSupabaseServerConfig } from "@/lib/supabase/server";
import { handleError, ValidationError } from "@/lib/utils/error-handler";
import { ContactSchema } from "@/types/contact";

const patchSchema = ContactSchema.partial();

async function getUserId(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore.get("userId")?.value ?? "demo-user";
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }): Promise<Response> {
  try {
    const { id } = await context.params;
    const body = patchSchema.parse(await request.json());
    const userId = await getUserId();
    if (hasSupabaseServerConfig) {
      const supabase = getSupabaseServerClient();
      const { data, error } = await supabase.from("contacts").update(body).eq("id", id).eq("user_id", userId).select("*").single();
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ data: mapRowToContact(data) });
    }
    const list = getUserContacts(userId);
    const index = list.findIndex((item) => item.id === id);
    if (index < 0) {
      return NextResponse.json({ error: "Контакт не найден" }, { status: 404 });
    }
    list[index] = { ...list[index], ...body, updatedAt: new Date() };
    saveUserContacts(userId, list);
    return NextResponse.json({ data: list[index] });
  } catch (error) {
    const appError =
      error instanceof z.ZodError ? new ValidationError("Ошибка валидации обновления", error.flatten()) : handleError(error);
    return NextResponse.json({ error: appError.message, details: appError.details }, { status: appError.statusCode });
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }): Promise<Response> {
  try {
    const { id } = await context.params;
    const userId = await getUserId();
    if (hasSupabaseServerConfig) {
      const supabase = getSupabaseServerClient();
      const { error } = await supabase.from("contacts").delete().eq("id", id).eq("user_id", userId);
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ data: { success: true } });
    }
    const next = getUserContacts(userId).filter((item) => item.id !== id);
    saveUserContacts(userId, next);
    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    const appError = handleError(error);
    return NextResponse.json({ error: appError.message }, { status: appError.statusCode });
  }
}

