import { db } from "@/db";
import { brands, categories, orders, products, reviews, type OrderItem } from "@/db/schema";
import { buildReviewTemplates, seedBrands, seedCategories, seedProducts } from "@/lib/catalog-data";
import { shippingFor } from "@/lib/site";
import { sql } from "drizzle-orm";

let seedPromise: Promise<void> | null = null;

const DEMO_ORDERS: {
  customerName: string;
  phone: string;
  city: string;
  address: string;
  status: string;
  paymentMethod: string;
  deliveryMethod: string;
  daysAgo: number;
  items: { slug: string; qty: number; color?: string; storage?: string }[];
}[] = [
  {
    customerName: "Ahmed Al-Mansouri",
    phone: "091 234 5678",
    city: "Tripoli",
    address: "Hay Al-Andalus, near Palm City",
    status: "delivered",
    paymentMethod: "cash",
    deliveryMethod: "tripoli",
    daysAgo: 2,
    items: [{ slug: "iphone-15-pro-max", qty: 1, color: "Natural Titanium", storage: "256GB" }],
  },
  {
    customerName: "Salma Ben Ashour",
    phone: "092 771 4433",
    city: "Misrata",
    address: "Al-Ghiran district, building 14",
    status: "shipped",
    paymentMethod: "transfer",
    deliveryMethod: "other",
    daysAgo: 1,
    items: [
      { slug: "airpods-pro-2", qty: 1 },
      { slug: "anker-65w-gan-charger", qty: 1, color: "White" },
    ],
  },
  {
    customerName: "Yousef Al-Turki",
    phone: "094 550 9021",
    city: "Tripoli",
    address: "Al-Saraya Street, pick up at store",
    status: "confirmed",
    paymentMethod: "whatsapp",
    deliveryMethod: "pickup",
    daysAgo: 0,
    items: [{ slug: "samsung-galaxy-s24-ultra", qty: 1, color: "Titanium Gray", storage: "512GB" }],
  },
];

async function seedDemoOrders() {
  const [orderCount] = await db.select({ count: sql<number>`count(*)::int` }).from(orders);
  if ((orderCount?.count ?? 0) > 0) return;

  const rows = await db
    .select({
      id: products.id,
      slug: products.slug,
      nameEn: products.nameEn,
      nameAr: products.nameAr,
      price: products.price,
      images: products.images,
    })
    .from(products);
  const bySlug = new Map(rows.map((row) => [row.slug, row]));
  const now = Date.now();

  for (const [index, demo] of DEMO_ORDERS.entries()) {
    const items: OrderItem[] = [];
    for (const line of demo.items) {
      const product = bySlug.get(line.slug);
      if (!product) continue;
      items.push({
        productId: product.id,
        slug: product.slug,
        name: { en: product.nameEn, ar: product.nameAr },
        price: Number(product.price),
        qty: line.qty,
        image: product.images[0] ?? "/images/hero-phone.jpg",
        color: line.color,
        storage: line.storage,
      });
    }
    if (items.length === 0) continue;
    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const shipping = shippingFor(demo.deliveryMethod, subtotal);
    const total = subtotal + shipping;
    await db
      .insert(orders)
      .values({
        reference: `MP-${String(now).slice(-6)}-${1000 + index * 137}`,
        customerName: demo.customerName,
        phone: demo.phone,
        city: demo.city,
        address: demo.address,
        notes: "",
        paymentMethod: demo.paymentMethod,
        deliveryMethod: demo.deliveryMethod,
        subtotal: subtotal.toFixed(2),
        shipping: shipping.toFixed(2),
        total: total.toFixed(2),
        status: demo.status,
        lang: "en",
        items,
        createdAt: new Date(now - demo.daysAgo * 24 * 60 * 60 * 1000 - index * 3_600_000),
      })
      .onConflictDoNothing();
  }
}

async function runSeed() {
  const existing = await db.select({ count: sql<number>`count(*)::int` }).from(products);
  if ((existing[0]?.count ?? 0) === 0) {
    await seedCatalog();
  }
  await seedDemoOrders();
}

async function seedCatalog() {

  await db.insert(categories).values(seedCategories).onConflictDoNothing();
  await db.insert(brands).values(seedBrands).onConflictDoNothing();

  const inserted = await db
    .insert(products)
    .values(
      seedProducts.map((product) => ({
        slug: product.slug,
        categorySlug: product.categorySlug,
        brandSlug: product.brandSlug,
        nameEn: product.nameEn,
        nameAr: product.nameAr,
        taglineEn: product.taglineEn,
        taglineAr: product.taglineAr,
        descriptionEn: product.descriptionEn,
        descriptionAr: product.descriptionAr,
        price: product.price.toFixed(2),
        compareAtPrice: product.compareAt ? product.compareAt.toFixed(2) : null,
        stock: product.stock,
        images: product.images,
        colors: product.colors,
        storages: product.storages,
        specs: product.specs,
        badgeEn: product.badgeEn ?? null,
        badgeAr: product.badgeAr ?? null,
        featured: product.featured ?? false,
        deal: product.deal ?? false,
        isNew: product.isNew ?? false,
      })),
    )
    .onConflictDoNothing()
    .returning({ id: products.id, slug: products.slug });

  const templates = buildReviewTemplates();
  const now = Date.now();
  const reviewRows: (typeof reviews.$inferInsert)[] = [];
  const ratingBuckets = new Map<number, number[]>();

  inserted.forEach((row, index) => {
    const count = index % 4 === 0 ? 5 : 4;
    for (let i = 0; i < count; i += 1) {
      const template = templates[(index * 3 + i * 5) % templates.length];
      const rating = i === count - 1 && index % 3 !== 0 ? 4 : template.rating;
      reviewRows.push({
        productId: row.id,
        author: template.author,
        city: template.city,
        rating,
        title: template.title,
        body: template.body,
        lang: template.lang,
        verified: i !== 2,
        status: index % 9 === 4 && i === 0 ? "pending" : "approved",
        createdAt: new Date(now - (template.daysAgo + i * 3) * 24 * 60 * 60 * 1000),
      });
      const bucket = ratingBuckets.get(row.id) ?? [];
      bucket.push(rating);
      ratingBuckets.set(row.id, bucket);
    }
  });

  if (reviewRows.length > 0) {
    await db.insert(reviews).values(reviewRows);
  }

  await Promise.all(
    [...ratingBuckets.entries()].map(([productId, ratings]) => {
      const approvedOnly = ratings;
      const average = approvedOnly.reduce((sum, value) => sum + value, 0) / approvedOnly.length;
      return db
        .update(products)
        .set({ rating: average.toFixed(2), reviewCount: approvedOnly.length })
        .where(sql`${products.id} = ${productId}`);
    }),
  );
}

export async function ensureSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = runSeed().catch((error) => {
      seedPromise = null;
      throw error;
    });
  }
  return seedPromise;
}
