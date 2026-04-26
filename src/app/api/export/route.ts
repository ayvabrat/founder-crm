import { NextResponse } from "next/server";

import type { Contact } from "@/types/contact";

type ExportRequest = {
  format: "json" | "csv";
  contacts: Contact[];
};

function toCsv(contacts: Contact[]): string {
  const headers = ["id", "name", "company", "role", "source", "niche", "lastContact", "createdAt", "updatedAt"];
  const rows = contacts.map((c) => [
    c.id,
    c.name,
    c.company ?? "",
    c.role ?? "",
    c.source ?? "",
    c.niche ?? "",
    c.lastContact ? new Date(c.lastContact).toISOString() : "",
    new Date(c.createdAt).toISOString(),
    new Date(c.updatedAt).toISOString(),
  ]);
  const escapeCell = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
  return [headers, ...rows].map((line) => line.map(escapeCell).join(",")).join("\n");
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as ExportRequest;
    if (!Array.isArray(body.contacts)) {
      return NextResponse.json({ error: "Ожидается массив контактов" }, { status: 400 });
    }
    if (body.format === "csv") {
      return new Response(toCsv(body.contacts), {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": "attachment; filename=founder-crm-contacts.csv",
        },
      });
    }
    return new Response(JSON.stringify(body.contacts, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": "attachment; filename=founder-crm-contacts.json",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ошибка экспорта";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
