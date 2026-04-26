import type { Contact } from "@/types/contact";

import { hasSupabaseConfig, supabase } from "./client";

export class SupabaseContactRepository {
  async getAll(userId: string): Promise<Contact[]> {
    if (!hasSupabaseConfig || !supabase) return [];
    const { data, error } = await supabase.from("contacts").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as Contact[];
  }

  async create(contact: Omit<Contact, "id" | "createdAt" | "updatedAt">, userId: string): Promise<Contact> {
    if (!hasSupabaseConfig || !supabase) throw new Error("Supabase not configured");
    const { data, error } = await supabase
      .from("contacts")
      .insert([{ ...contact, user_id: userId }])
      .select()
      .single();
    if (error) throw error;
    return data as Contact;
  }
}

export const supabaseContactRepo = new SupabaseContactRepository();

