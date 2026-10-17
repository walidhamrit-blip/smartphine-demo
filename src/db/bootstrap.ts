import { sql } from "drizzle-orm";
import { getDb, isDatabaseConfigured } from "@/db";

/**
 * Idempotent schema bootstrap.
 *
 * The project ships without a migration folder, so the tables are created the
 * first time the app talks to Postgres. `CREATE TABLE IF NOT EXISTS` keeps it
 * safe to run on every cold start and on an already provisioned database.
 */
const SCHEMA_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS categories (
    id serial PRIMARY KEY,
    slug text NOT NULL UNIQUE,
    name_en text NOT NULL,
    name_ar text NOT NULL,
    tagline_en text NOT NULL DEFAULT '',
    tagline_ar text NOT NULL DEFAULT '',
    image text NOT NULL,
    icon text NOT NULL DEFAULT '✦',
    sort_order integer NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS brands (
    id serial PRIMARY KEY,
    slug text NOT NULL UNIQUE,
    name text NOT NULL,
    monogram text NOT NULL DEFAULT '',
    accent text NOT NULL DEFAULT '#111111',
    sort_order integer NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS products (
    id serial PRIMARY KEY,
    slug text NOT NULL UNIQUE,
    category_slug text NOT NULL,
    brand_slug text NOT NULL,
    name_en text NOT NULL,
    name_ar text NOT NULL,
    tagline_en text NOT NULL DEFAULT '',
    tagline_ar text NOT NULL DEFAULT '',
    description_en text NOT NULL DEFAULT '',
    description_ar text NOT NULL DEFAULT '',
    price numeric(10, 2) NOT NULL,
    compare_at_price numeric(10, 2),
    stock integer NOT NULL DEFAULT 0,
    rating numeric(3, 2) NOT NULL DEFAULT 4.8,
    review_count integer NOT NULL DEFAULT 0,
    images jsonb NOT NULL DEFAULT '[]'::jsonb,
    colors jsonb NOT NULL DEFAULT '[]'::jsonb,
    storages jsonb NOT NULL DEFAULT '[]'::jsonb,
    specs jsonb NOT NULL DEFAULT '[]'::jsonb,
    badge_en text,
    badge_ar text,
    featured boolean NOT NULL DEFAULT false,
    deal boolean NOT NULL DEFAULT false,
    is_new boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS reviews (
    id serial PRIMARY KEY,
    product_id integer NOT NULL REFERENCES products (id) ON DELETE CASCADE,
    author text NOT NULL,
    city text NOT NULL DEFAULT 'Tripoli',
    rating integer NOT NULL DEFAULT 5,
    title text NOT NULL DEFAULT '',
    body text NOT NULL,
    lang text NOT NULL DEFAULT 'en',
    verified boolean NOT NULL DEFAULT true,
    status text NOT NULL DEFAULT 'approved',
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS orders (
    id serial PRIMARY KEY,
    reference text NOT NULL UNIQUE,
    customer_name text NOT NULL,
    phone text NOT NULL,
    city text NOT NULL DEFAULT 'Tripoli',
    address text NOT NULL DEFAULT '',
    notes text NOT NULL DEFAULT '',
    payment_method text NOT NULL DEFAULT 'cash',
    delivery_method text NOT NULL DEFAULT 'tripoli',
    subtotal numeric(10, 2) NOT NULL,
    shipping numeric(10, 2) NOT NULL DEFAULT 0,
    total numeric(10, 2) NOT NULL,
    status text NOT NULL DEFAULT 'new',
    lang text NOT NULL DEFAULT 'en',
    items jsonb NOT NULL DEFAULT '[]'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS products_category_slug_idx ON products (category_slug)`,
  `CREATE INDEX IF NOT EXISTS products_brand_slug_idx ON products (brand_slug)`,
  `CREATE INDEX IF NOT EXISTS reviews_product_id_idx ON reviews (product_id)`,
  `CREATE INDEX IF NOT EXISTS orders_reference_idx ON orders (reference)`,
];

let schemaPromise: Promise<void> | null = null;

/**
 * Creates the tables when they are missing. Returns false when no database is
 * configured, so callers can degrade gracefully instead of crashing a build.
 */
export async function ensureSchema(): Promise<boolean> {
  if (!isDatabaseConfigured()) {
    return false;
  }

  if (!schemaPromise) {
    schemaPromise = (async () => {
      const database = getDb();
      for (const statement of SCHEMA_STATEMENTS) {
        await database.execute(sql.raw(statement));
      }
    })().catch((error) => {
      schemaPromise = null;
      throw error;
    });
  }

  await schemaPromise;
  return true;
}
