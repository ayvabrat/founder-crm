import { NextResponse } from "next/server";
import { z } from "zod";

import { funstatService } from "@/lib/funstat/funstat-service";
import { handleError } from "@/lib/utils/error-handler";

const schema = z.object({
  username: z.string().min(2),
});

export async function POST(request: Request): Promise<Response> {
  try {
    const body = schema.parse(await request.json());
    const data = await funstatService.analyzeUser(body.username);
    return NextResponse.json({ data });
  } catch (error) {
    const appError = handleError(error);
    return NextResponse.json({ error: appError.message, code: appError.code }, { status: appError.statusCode });
  }
}

