import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@/db/schema";

export type Database = NodePgDatabase<typeof schema>;

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
  __arenaNextJsPostgresqlDb?: Database;
};

/**
 * The connection string is resolved lazily (never at import time).
 *
 * `next build` imports every route module while collecting page data, so a
 * module-level `throw` on a missing DATABASE_URL used to abort the whole
 * Vercel build before the environment variables were even available.
 */
export function getDatabaseUrl(): string | undefined {
  const value = process.env.DATABASE_URL?.trim();
  return value ? value : undefined;
}

export function isDatabaseConfigured(): boolean {
  return getDatabaseUrl() !== undefined;
}

/** Connection details safe to display (the password is never exposed). */
export function describeDatabase(): { configured: boolean; target: string | null } {
  const url = getDatabaseUrl();
  if (!url) {
    return { configured: false, target: null };
  }
  try {
    const parsed = new URL(url);
    const host = parsed.hostname || "localhost";
    const port = parsed.port ? `:${parsed.port}` : "";
    const database = parsed.pathname.replace(/^\//, "") || "postgres";
    return { configured: true, target: `${host}${port}/${database}` };
  } catch {
    return { configured: true, target: "postgres" };
  }
}

export function getPool(): Pool {
  if (!globalForDb.__arenaNextJsPostgresqlPool) {
    const connectionString = getDatabaseUrl();
    if (!connectionString) {
      throw new Error("DATABASE_URL is required");
    }
    globalForDb.__arenaNextJsPostgresqlPool = new Pool({
      connectionString,
      max: Number(process.env.DATABASE_POOL_MAX ?? 5),
      connectionTimeoutMillis: Number(process.env.DATABASE_CONNECT_TIMEOUT_MS ?? 10_000),
      idleTimeoutMillis: 30_000,
    });
  }
  return globalForDb.__arenaNextJsPostgresqlPool;
}

export function getDb(): Database {
  if (!globalForDb.__arenaNextJsPostgresqlDb) {
    globalForDb.__arenaNextJsPostgresqlDb = drizzle<typeof schema>(getPool(), { schema });
  }
  return globalForDb.__arenaNextJsPostgresqlDb;
}

/**
 * Drop-in replacement for the drizzle instance: the pool is only created on the
 * first property access, so importing this module never touches the network.
 * Touching `db` without a DATABASE_URL still throws a clear, actionable error.
 */
export const db: Database = new Proxy({} as Database, {
  get(_target, property) {
    const instance = getDb() as unknown as Record<string | symbol, unknown>;
    const value = instance[property];
    return typeof value === "function" ? value.bind(instance) : value;
  },
});
