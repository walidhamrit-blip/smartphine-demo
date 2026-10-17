import { describeDatabase, getDb } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const { configured, target } = describeDatabase();

  if (!configured) {
    return Response.json(
      { ok: false, error: "DATABASE_URL is not configured", target: null },
      { status: 503 },
    );
  }

  try {
    await getDb().execute(sql`select 1`);
    return Response.json({ ok: true, target });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "database unreachable",
        target,
      },
      { status: 500 },
    );
  }
}
