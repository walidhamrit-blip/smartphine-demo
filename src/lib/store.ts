import { db } from "@/db";
import {
  brands,
  categories,
  orders,
  products,
  reviews,
  type Brand,
  type Category,
  type ColorOption,
  type LocalizedText,
  type OrderItem,
  type Product,
  type Review,
  type SpecItem,
} from "@/db/schema";
import { ensureSeeded } from "@/lib/seed";
import { and, asc, desc, eq, gte, ilike, lte, ne, or, sql } from "drizzle-orm";

/**
 * Every read goes through this helper: a missing or unreachable database must
 * never break a build or take the storefront down. The error is logged and an
 * empty result is returned instead.
 */
async function safe<T>(label: string, run: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await run();
  } catch (error) {
    console.error(`[store] ${label} failed:`, error instanceof Error ? error.message : error);
    return fallback;
  }
}

export type ProductView = {
  id: number;
  slug: string;
  categorySlug: string;
  brandSlug: string;
  nameEn: string;
  nameAr: string;
  taglineEn: string;
  taglineAr: string;
  descriptionEn: string;
  descriptionAr: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  rating: number;
  reviewCount: number;
  images: string[];
  colors: ColorOption[];
  storages: string[];
  specs: SpecItem[];
  badgeEn: string | null;
  badgeAr: string | null;
  featured: boolean;
  deal: boolean;
  isNew: boolean;
  createdAt: string;
};

export type ReviewView = {
  id: number;
  author: string;
  city: string;
  rating: number;
  title: string;
  body: string;
  lang: string;
  verified: boolean;
  status: string;
  createdAt: string;
  productName?: LocalizedText;
};

export type OrderView = {
  id: number;
  reference: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  notes: string;
  paymentMethod: string;
  deliveryMethod: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  lang: string;
  items: OrderItem[];
  createdAt: string;
};

export function toProductView(row: Product): ProductView {
  return {
    ...row,
    price: Number(row.price),
    compareAtPrice: row.compareAtPrice === null ? null : Number(row.compareAtPrice),
    rating: Number(row.rating),
    createdAt: row.createdAt.toISOString(),
  };
}

function toReviewView(row: Review): ReviewView {
  return {
    id: row.id,
    author: row.author,
    city: row.city,
    rating: row.rating,
    title: row.title,
    body: row.body,
    lang: row.lang,
    verified: row.verified,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
  };
}

function toOrderView(row: typeof orders.$inferSelect): OrderView {
  return {
    id: row.id,
    reference: row.reference,
    customerName: row.customerName,
    phone: row.phone,
    city: row.city,
    address: row.address,
    notes: row.notes,
    paymentMethod: row.paymentMethod,
    deliveryMethod: row.deliveryMethod,
    subtotal: Number(row.subtotal),
    shipping: Number(row.shipping),
    total: Number(row.total),
    status: row.status,
    lang: row.lang,
    items: row.items,
    createdAt: row.createdAt.toISOString(),
  };
}

export type SortKey = "featured" | "price-asc" | "price-desc" | "rating" | "newest";

export type ProductFilters = {
  category?: string;
  brand?: string;
  q?: string;
  min?: number;
  max?: number;
  sort?: SortKey;
  deals?: boolean;
  inStock?: boolean;
  page?: number;
  perPage?: number;
};

export async function getCategories(): Promise<Category[]> {
  return safe("getCategories", async () => {
    await ensureSeeded();
    return db.select().from(categories).orderBy(asc(categories.sortOrder));
  }, []);
}

export async function getBrands(): Promise<Brand[]> {
  return safe("getBrands", async () => {
    await ensureSeeded();
    return db.select().from(brands).orderBy(asc(brands.sortOrder));
  }, []);
}

function orderClause(sort: SortKey | undefined) {
  switch (sort) {
    case "price-asc":
      return [asc(products.price)];
    case "price-desc":
      return [desc(products.price)];
    case "rating":
      return [desc(products.rating), desc(products.reviewCount)];
    case "newest":
      return [desc(products.isNew), desc(products.id)];
    default:
      return [desc(products.featured), desc(products.rating), desc(products.reviewCount)];
  }
}

export async function getProducts(filters: ProductFilters = {}) {
  return safe(
    "getProducts",
    async () => {
      await ensureSeeded();
      const perPage = filters.perPage ?? 9;
      const page = Math.max(1, filters.page ?? 1);

      const conditions = [];
      if (filters.category) conditions.push(eq(products.categorySlug, filters.category));
      if (filters.brand) conditions.push(eq(products.brandSlug, filters.brand));
      if (filters.deals) conditions.push(eq(products.deal, true));
      if (filters.inStock) conditions.push(gte(products.stock, 1));
      if (typeof filters.min === "number") conditions.push(gte(products.price, filters.min.toFixed(2)));
      if (typeof filters.max === "number") conditions.push(lte(products.price, filters.max.toFixed(2)));
      if (filters.q) {
        const term = `%${filters.q}%`;
        conditions.push(
          or(
            ilike(products.nameEn, term),
            ilike(products.nameAr, term),
            ilike(products.taglineEn, term),
            ilike(products.taglineAr, term),
            ilike(products.brandSlug, term),
          ),
        );
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const [countRow] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(products)
        .where(where);

      const total = countRow?.count ?? 0;

      const rows = await db
        .select()
        .from(products)
        .where(where)
        .orderBy(...orderClause(filters.sort))
        .limit(perPage)
        .offset((page - 1) * perPage);

      return {
        items: rows.map(toProductView),
        total,
        page,
        pages: Math.max(1, Math.ceil(total / perPage)),
      };
    },
    { items: [], total: 0, page: 1, pages: 1 },
  );
}

export async function getFeaturedProducts(limit = 8): Promise<ProductView[]> {
  return safe("getFeaturedProducts", async () => {
    await ensureSeeded();
    const rows = await db
      .select()
      .from(products)
      .where(eq(products.featured, true))
      .orderBy(desc(products.rating))
      .limit(limit);
    return rows.map(toProductView);
  }, []);
}

export async function getDealProducts(limit = 4): Promise<ProductView[]> {
  return safe("getDealProducts", async () => {
    await ensureSeeded();
    const rows = await db
      .select()
      .from(products)
      .where(eq(products.deal, true))
      .orderBy(desc(products.rating))
      .limit(limit);
    return rows.map(toProductView);
  }, []);
}

export async function getNewProducts(limit = 4): Promise<ProductView[]> {
  return safe("getNewProducts", async () => {
    await ensureSeeded();
    const rows = await db
      .select()
      .from(products)
      .where(eq(products.isNew, true))
      .orderBy(desc(products.id))
      .limit(limit);
    return rows.map(toProductView);
  }, []);
}

export async function getProductBySlug(slug: string): Promise<ProductView | null> {
  return safe("getProductBySlug", async () => {
    await ensureSeeded();
    const [row] = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
    return row ? toProductView(row) : null;
  }, null);
}

export async function getRelatedProducts(categorySlug: string, slug: string, limit = 4): Promise<ProductView[]> {
  return safe("getRelatedProducts", async () => {
    await ensureSeeded();
    const rows = await db
      .select()
      .from(products)
      .where(and(eq(products.categorySlug, categorySlug), ne(products.slug, slug)))
      .orderBy(desc(products.rating))
      .limit(limit);
    return rows.map(toProductView);
  }, []);
}

export async function getProductReviews(productId: number): Promise<ReviewView[]> {
  return safe("getProductReviews", async () => {
    await ensureSeeded();
    const rows = await db
      .select()
      .from(reviews)
      .where(and(eq(reviews.productId, productId), eq(reviews.status, "approved")))
      .orderBy(desc(reviews.createdAt));
    return rows.map(toReviewView);
  }, []);
}

export async function getTestimonials(limit = 3): Promise<ReviewView[]> {
  return safe("getTestimonials", async () => {
    await ensureSeeded();
    const rows = await db
      .select()
      .from(reviews)
      .where(and(eq(reviews.status, "approved"), eq(reviews.rating, 5)))
      .orderBy(desc(reviews.createdAt))
      .limit(limit);
    return rows.map(toReviewView);
  }, []);
}

export async function getProductsByIds(ids: number[]): Promise<ProductView[]> {
  if (ids.length === 0) return [];
  return safe("getProductsByIds", async () => {
    await ensureSeeded();
    const rows = await db.select().from(products).orderBy(desc(products.featured));
    return rows.filter((row) => ids.includes(row.id)).map(toProductView);
  }, []);
}

export async function getOrderByReference(reference: string): Promise<OrderView | null> {
  return safe("getOrderByReference", async () => {
    await ensureSeeded();
    const [row] = await db.select().from(orders).where(eq(orders.reference, reference)).limit(1);
    return row ? toOrderView(row) : null;
  }, null);
}

export async function getAllOrders(): Promise<OrderView[]> {
  return safe("getAllOrders", async () => {
    await ensureSeeded();
    const rows = await db.select().from(orders).orderBy(desc(orders.id));
    return rows.map(toOrderView);
  }, []);
}

export async function getAllProducts(): Promise<ProductView[]> {
  return safe("getAllProducts", async () => {
    await ensureSeeded();
    const rows = await db.select().from(products).orderBy(desc(products.id));
    return rows.map(toProductView);
  }, []);
}

export async function getAllReviews(): Promise<ReviewView[]> {
  return safe("getAllReviews", async () => {
    await ensureSeeded();
    const rows = await db
      .select({ review: reviews, nameEn: products.nameEn, nameAr: products.nameAr })
      .from(reviews)
      .innerJoin(products, eq(products.id, reviews.productId))
      .orderBy(desc(reviews.createdAt));
    return rows.map(({ review, nameEn, nameAr }) => ({
      ...toReviewView(review),
      productName: { en: nameEn, ar: nameAr },
    }));
  }, []);
}

export async function getDashboardStats() {
  return safe(
    "getDashboardStats",
    async () => {
      await ensureSeeded();
      const [productCount] = await db.select({ count: sql<number>`count(*)::int` }).from(products);
      const [orderCount] = await db.select({ count: sql<number>`count(*)::int` }).from(orders);
      const [revenueRow] = await db
        .select({ total: sql<string>`coalesce(sum(${orders.total}), 0)` })
        .from(orders);
      const [pendingReviews] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(reviews)
        .where(eq(reviews.status, "pending"));
      const [lowStock] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(products)
        .where(sql`${products.stock} <= 10`);
      const recentOrders = await db.select().from(orders).orderBy(desc(orders.id)).limit(5);
      const lowStockProducts = await db
        .select()
        .from(products)
        .where(sql`${products.stock} <= 12`)
        .orderBy(asc(products.stock))
        .limit(5);

      return {
        products: productCount?.count ?? 0,
        orders: orderCount?.count ?? 0,
        revenue: Number(revenueRow?.total ?? 0),
        pendingReviews: pendingReviews?.count ?? 0,
        lowStock: lowStock?.count ?? 0,
        recentOrders: recentOrders.map(toOrderView),
        lowStockProducts: lowStockProducts.map(toProductView),
      };
    },
    {
      products: 0,
      orders: 0,
      revenue: 0,
      pendingReviews: 0,
      lowStock: 0,
      recentOrders: [],
      lowStockProducts: [],
    },
  );
}

export async function getProductForEdit(id: number): Promise<ProductView | null> {
  return safe("getProductForEdit", async () => {
    await ensureSeeded();
    const [row] = await db.select().from(products).where(eq(products.id, id)).limit(1);
    return row ? toProductView(row) : null;
  }, null);
}
