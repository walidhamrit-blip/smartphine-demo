import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export type LocalizedText = { en: string; ar: string };

export type ColorOption = { name: LocalizedText; hex: string };
export type SpecItem = { label: LocalizedText; value: LocalizedText };

export type OrderItem = {
  productId: number;
  slug: string;
  name: LocalizedText;
  price: number;
  qty: number;
  image: string;
  color?: string;
  storage?: string;
};

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  nameEn: text("name_en").notNull(),
  nameAr: text("name_ar").notNull(),
  taglineEn: text("tagline_en").notNull().default(""),
  taglineAr: text("tagline_ar").notNull().default(""),
  image: text("image").notNull(),
  icon: text("icon").notNull().default("✦"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  monogram: text("monogram").notNull().default(""),
  accent: text("accent").notNull().default("#111111"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  categorySlug: text("category_slug").notNull(),
  brandSlug: text("brand_slug").notNull(),
  nameEn: text("name_en").notNull(),
  nameAr: text("name_ar").notNull(),
  taglineEn: text("tagline_en").notNull().default(""),
  taglineAr: text("tagline_ar").notNull().default(""),
  descriptionEn: text("description_en").notNull().default(""),
  descriptionAr: text("description_ar").notNull().default(""),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  compareAtPrice: numeric("compare_at_price", { precision: 10, scale: 2 }),
  stock: integer("stock").notNull().default(0),
  rating: numeric("rating", { precision: 3, scale: 2 }).notNull().default("4.8"),
  reviewCount: integer("review_count").notNull().default(0),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  colors: jsonb("colors").$type<ColorOption[]>().notNull().default([]),
  storages: jsonb("storages").$type<string[]>().notNull().default([]),
  specs: jsonb("specs").$type<SpecItem[]>().notNull().default([]),
  badgeEn: text("badge_en"),
  badgeAr: text("badge_ar"),
  featured: boolean("featured").notNull().default(false),
  deal: boolean("deal").notNull().default(false),
  isNew: boolean("is_new").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  author: text("author").notNull(),
  city: text("city").notNull().default("Tripoli"),
  rating: integer("rating").notNull().default(5),
  title: text("title").notNull().default(""),
  body: text("body").notNull(),
  lang: text("lang").notNull().default("en"),
  verified: boolean("verified").notNull().default(true),
  status: text("status").notNull().default("approved"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  reference: text("reference").notNull().unique(),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  city: text("city").notNull().default("Tripoli"),
  address: text("address").notNull().default(""),
  notes: text("notes").notNull().default(""),
  paymentMethod: text("payment_method").notNull().default("cash"),
  deliveryMethod: text("delivery_method").notNull().default("tripoli"),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  shipping: numeric("shipping", { precision: 10, scale: 2 }).notNull().default("0"),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("new"),
  lang: text("lang").notNull().default("en"),
  items: jsonb("items").$type<OrderItem[]>().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Product = typeof products.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Brand = typeof brands.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Order = typeof orders.$inferSelect;
