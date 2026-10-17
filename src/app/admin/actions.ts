"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db, isDatabaseConfigured } from "@/db";
import { orders, products, reviews, type ColorOption, type SpecItem } from "@/db/schema";
import { ADMIN_PASSWORD, clearAdminSession, isAdmin, setAdminSession } from "@/lib/admin-auth";
import { and, eq, ne, sql } from "drizzle-orm";
import { ensureSeeded } from "@/lib/seed";

export type LoginState = { error?: string };

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function guard(): Promise<void> {
  if (!(await isAdmin())) {
    redirect("/admin/login");
  }
}

/** Writes are impossible without a database: fail with a readable message. */
function requireDatabase(): void {
  if (!isDatabaseConfigured()) {
    redirect("/admin/products?error=db");
  }
}

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  if (password !== ADMIN_PASSWORD) {
    return { error: "invalid" };
  }
  await setAdminSession();
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function saveProductAction(formData: FormData): Promise<void> {
  await guard();
  requireDatabase();
  await ensureSeeded();

  const idRaw = String(formData.get("id") ?? "");
  const id = Number(idRaw);
  const nameEn = String(formData.get("nameEn") ?? "").trim();
  const nameAr = String(formData.get("nameAr") ?? "").trim();
  const price = Number(formData.get("price") ?? 0);
  if (!nameEn || !nameAr || !Number.isFinite(price) || price <= 0) {
    redirect("/admin/products");
  }

  const baseSlug = slugify(String(formData.get("slug") ?? "") || nameEn);
  const compareRaw = String(formData.get("compareAtPrice") ?? "").trim();
  const compareAt = compareRaw ? Number(compareRaw) : null;

  const images = String(formData.get("images") ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const storages = String(formData.get("storages") ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const colors: ColorOption[] = String(formData.get("colors") ?? "")
    .split("\n")
    .map((line) => line.split("|").map((part) => part.trim()))
    .filter((parts) => parts.length >= 3 && parts[0] && parts[1])
    .map((parts) => ({ name: { en: parts[0], ar: parts[1] }, hex: parts[2] || "#cccccc" }));

  const specs: SpecItem[] = String(formData.get("specs") ?? "")
    .split("\n")
    .map((line) => line.split("|").map((part) => part.trim()))
    .filter((parts) => parts.length >= 4 && parts[0] && parts[2])
    .map((parts) => ({ label: { en: parts[0], ar: parts[1] || parts[0] }, value: { en: parts[2], ar: parts[3] || parts[2] } }));

  const values = {
    slug: baseSlug,
    nameEn,
    nameAr,
    categorySlug: String(formData.get("categorySlug") ?? "smartphones"),
    brandSlug: String(formData.get("brandSlug") ?? "apple"),
    taglineEn: String(formData.get("taglineEn") ?? "").trim(),
    taglineAr: String(formData.get("taglineAr") ?? "").trim(),
    descriptionEn: String(formData.get("descriptionEn") ?? "").trim(),
    descriptionAr: String(formData.get("descriptionAr") ?? "").trim(),
    price: price.toFixed(2),
    compareAtPrice: compareAt && Number.isFinite(compareAt) && compareAt > price ? compareAt.toFixed(2) : null,
    stock: Math.max(0, Math.round(Number(formData.get("stock") ?? 0) || 0)),
    images: images.length > 0 ? images : ["/images/hero-phone.jpg"],
    colors,
    storages,
    specs,
    badgeEn: String(formData.get("badgeEn") ?? "").trim() || null,
    badgeAr: String(formData.get("badgeAr") ?? "").trim() || null,
    featured: formData.get("featured") === "on",
    deal: formData.get("deal") === "on",
    isNew: formData.get("isNew") === "on",
  };

  try {
    if (Number.isFinite(id) && id > 0) {
      const [conflict] = await db
        .select({ id: products.id })
        .from(products)
        .where(and(eq(products.slug, values.slug), ne(products.id, id)))
        .limit(1);
      if (conflict) values.slug = `${values.slug}-${id}`;
      await db.update(products).set(values).where(eq(products.id, id));
      revalidatePath(`/product/${values.slug}`);
    } else {
      const [conflict] = await db.select({ id: products.id }).from(products).where(eq(products.slug, values.slug)).limit(1);
      if (conflict) values.slug = `${values.slug}-${Date.now().toString().slice(-4)}`;
      await db.insert(products).values(values);
    }
  } catch {
    redirect("/admin/products?error=save");
  }

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/products");
  redirect("/admin/products?saved=1");
}

export async function deleteProductAction(formData: FormData): Promise<void> {
  await guard();
  requireDatabase();
  const id = Number(formData.get("id"));
  if (Number.isFinite(id) && id > 0) {
    try {
      await db.delete(products).where(eq(products.id, id));
    } catch {
      redirect("/admin/products?error=delete");
    }
  }
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products?deleted=1");
}

export async function updateOrderStatusAction(formData: FormData): Promise<void> {
  await guard();
  requireDatabase();
  const id = Number(formData.get("id"));
  const status = String(formData.get("status") ?? "new");
  const allowed = ["new", "confirmed", "shipped", "delivered", "cancelled"];
  if (Number.isFinite(id) && id > 0 && allowed.includes(status)) {
    try {
      await db.update(orders).set({ status }).where(eq(orders.id, id));
    } catch {
      redirect("/admin/orders?error=update");
    }
  }
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}

export async function setReviewStatusAction(formData: FormData): Promise<void> {
  await guard();
  requireDatabase();
  const id = Number(formData.get("id"));
  const status = String(formData.get("status") ?? "approved");
  if (Number.isFinite(id) && id > 0 && ["approved", "pending", "hidden"].includes(status)) {
    try {
      const [review] = await db.update(reviews).set({ status }).where(eq(reviews.id, id)).returning();
      if (review) {
        const [aggregate] = await db
          .select({ average: sql<string>`coalesce(avg(${reviews.rating}), 5)`, count: sql<number>`count(*)::int` })
          .from(reviews)
          .where(and(eq(reviews.productId, review.productId), eq(reviews.status, "approved")));
        await db
          .update(products)
          .set({ rating: Number(aggregate?.average ?? 5).toFixed(2), reviewCount: aggregate?.count ?? 0 })
          .where(eq(products.id, review.productId));
      }
    } catch {
      redirect("/admin/reviews?error=update");
    }
  }
  revalidatePath("/admin/reviews");
}

export async function deleteReviewAction(formData: FormData): Promise<void> {
  await guard();
  requireDatabase();
  const id = Number(formData.get("id"));
  if (Number.isFinite(id) && id > 0) {
    try {
      await db.delete(reviews).where(eq(reviews.id, id));
    } catch {
      redirect("/admin/reviews?error=delete");
    }
  }
  revalidatePath("/admin/reviews");
}
