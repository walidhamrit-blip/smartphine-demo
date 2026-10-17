import { db } from "@/db";
import { products, reviews } from "@/db/schema";
import { ensureSeeded } from "@/lib/seed";
import { and, eq, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    await ensureSeeded();
    const payload = (await request.json()) as {
      productId?: number;
      author?: string;
      city?: string;
      rating?: number;
      title?: string;
      body?: string;
      lang?: string;
    };

    const productId = Number(payload.productId);
    const author = (payload.author ?? "").trim().slice(0, 80);
    const body = (payload.body ?? "").trim().slice(0, 1200);
    const title = (payload.title ?? "").trim().slice(0, 120);
    const city = (payload.city ?? "Tripoli").trim().slice(0, 60) || "Tripoli";
    const rating = Math.min(5, Math.max(1, Math.round(Number(payload.rating) || 5)));
    const lang = payload.lang === "ar" ? "ar" : "en";

    if (!Number.isFinite(productId) || author.length < 2 || body.length < 4) {
      return Response.json({ ok: false, error: "invalid_input" }, { status: 400 });
    }

    const [product] = await db.select({ id: products.id }).from(products).where(eq(products.id, productId)).limit(1);
    if (!product) {
      return Response.json({ ok: false, error: "not_found" }, { status: 404 });
    }

    const [created] = await db
      .insert(reviews)
      .values({ productId, author, city, rating, title, body, lang, verified: true, status: "approved" })
      .returning();

    const [aggregate] = await db
      .select({
        average: sql<string>`coalesce(avg(${reviews.rating}), 5)`,
        count: sql<number>`count(*)::int`,
      })
      .from(reviews)
      .where(and(eq(reviews.productId, productId), eq(reviews.status, "approved")));

    await db
      .update(products)
      .set({
        rating: Number(aggregate?.average ?? 5).toFixed(2),
        reviewCount: aggregate?.count ?? 1,
      })
      .where(eq(products.id, productId));

    return Response.json({
      ok: true,
      review: {
        id: created.id,
        author: created.author,
        city: created.city,
        rating: created.rating,
        title: created.title,
        body: created.body,
        lang: created.lang,
        verified: created.verified,
        status: created.status,
        createdAt: created.createdAt.toISOString(),
      },
    });
  } catch {
    return Response.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
