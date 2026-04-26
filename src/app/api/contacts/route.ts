import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { mapContactToRow, mapRowToContact } from "@/lib/server/contacts-mapper";
import { getUserContacts, saveUserContacts } from "@/lib/server/in-memory-db";
import { getSupabaseServerClient, hasSupabaseServerConfig } from "@/lib/supabase/server";
import { handleError, ValidationError } from "@/lib/utils/error-handler";
import { ContactSchema } from "@/types/contact";

const contactCreateSchema = ContactSchema.omit({ id: true, createdAt: true, updatedAt: true });

async function getUserId(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore.get("userId")?.value ?? "demo-user";
}

export async function GET(): Promise<Response> {
  const userId = await getUserId();
  if (hasSupabaseServerConfig) {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase.from("contacts").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ data: (data ?? []).map((row) => mapRowToContact(row)) });
  }
  return NextResponse.json({ data: getUserContacts(userId) });
}

export async function POST(request: Request): Promise<Response> {
  try {
    const userId = await getUserId();
    const body = contactCreateSchema.parse(await request.json());
    if (hasSupabaseServerConfig) {
      const supabase = getSupabaseServerClient();
      const { data, error } = await supabase.from("contacts").insert([mapContactToRow(body, userId)]).select("*").single();
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ data: mapRowToContact(data) }, { status: 201 });
    }
    const list = getUserContacts(userId);
    const nextContact = {
      ...body,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    list.push(nextContact);
    saveUserContacts(userId, list);
    return NextResponse.json({ data: nextContact }, { status: 201 });
  } catch (error) {
    const appError =
      error instanceof z.ZodError ? new ValidationError("Ошибка валидации контакта", error.flatten()) : handleError(error);
    return NextResponse.json({ error: appError.message, details: appError.details }, { status: appError.statusCode });
  }
}

