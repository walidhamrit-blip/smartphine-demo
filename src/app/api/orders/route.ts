import { db } from "@/db";
import { orders, products, type OrderItem } from "@/db/schema";
import { ensureSeeded } from "@/lib/seed";
import { shippingFor } from "@/lib/site";
import { inArray } from "drizzle-orm";

export const dynamic = "force-dynamic";

type IncomingItem = { productId?: number; qty?: number; color?: string; storage?: string };

function makeReference(): string {
  const now = new Date();
  const stamp = `${String(now.getFullYear()).slice(2)}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const random = Math.floor(1000 + Math.random() * 9000);
  return `MP-${stamp}-${random}`;
}

export async function POST(request: Request) {
  try {
    await ensureSeeded();
    const payload = (await request.json()) as {
      customerName?: string;
      phone?: string;
      city?: string;
      address?: string;
      notes?: string;
      deliveryMethod?: string;
      paymentMethod?: string;
      lang?: string;
      items?: IncomingItem[];
    };

    const customerName = (payload.customerName ?? "").trim().slice(0, 120);
    const phone = (payload.phone ?? "").trim().slice(0, 30);
    const city = (payload.city ?? "Tripoli").trim().slice(0, 60) || "Tripoli";
    const address = (payload.address ?? "").trim().slice(0, 240);
    const notes = (payload.notes ?? "").trim().slice(0, 500);
    const deliveryMethod = ["tripoli", "other", "pickup"].includes(payload.deliveryMethod ?? "") ? payload.deliveryMethod! : "tripoli";
    const paymentMethod = ["cash", "transfer", "whatsapp"].includes(payload.paymentMethod ?? "") ? payload.paymentMethod! : "cash";
    const lang = payload.lang === "ar" ? "ar" : "en";
    const incoming = Array.isArray(payload.items) ? payload.items.slice(0, 30) : [];

    if (customerName.length < 2 || phone.replace(/\D/g, "").length < 9 || incoming.length === 0) {
      return Response.json({ ok: false, error: "invalid_input" }, { status: 400 });
    }

    const ids = [...new Set(incoming.map((item) => Number(item.productId)).filter((id) => Number.isFinite(id)))];
    if (ids.length === 0) {
      return Response.json({ ok: false, error: "empty_cart" }, { status: 400 });
    }

    const rows = await db.select().from(products).where(inArray(products.id, ids));
    const byId = new Map(rows.map((row) => [row.id, row]));

    const items: OrderItem[] = [];
    for (const item of incoming) {
      const product = byId.get(Number(item.productId));
      if (!product) continue;
      const qty = Math.max(1, Math.min(10, Math.round(Number(item.qty) || 1)));
      items.push({
        productId: product.id,
        slug: product.slug,
        name: { en: product.nameEn, ar: product.nameAr },
        price: Number(product.price),
        qty,
        image: product.images[0] ?? "/images/hero-phone.jpg",
        color: (item.color ?? "").slice(0, 60) || undefined,
        storage: (item.storage ?? "").slice(0, 60) || undefined,
      });
    }

    if (items.length === 0) {
      return Response.json({ ok: false, error: "no_valid_items" }, { status: 400 });
    }

    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const shipping = shippingFor(deliveryMethod, subtotal);
    const total = subtotal + shipping;

    let reference = makeReference();
    let inserted: typeof orders.$inferSelect | undefined;
    for (let attempt = 0; attempt < 4 && !inserted; attempt += 1) {
      try {
        const result = await db
          .insert(orders)
          .values({
            reference,
            customerName,
            phone,
            city,
            address,
            notes,
            paymentMethod,
            deliveryMethod,
            subtotal: subtotal.toFixed(2),
            shipping: shipping.toFixed(2),
            total: total.toFixed(2),
            status: "new",
            lang,
            items,
          })
          .returning();
        inserted = result[0];
      } catch {
        reference = makeReference();
      }
    }

    if (!inserted) {
      return Response.json({ ok: false, error: "could_not_save" }, { status: 500 });
    }

    return Response.json({
      ok: true,
      order: {
        id: inserted.id,
        reference: inserted.reference,
        customerName: inserted.customerName,
        phone: inserted.phone,
        city: inserted.city,
        address: inserted.address,
        notes: inserted.notes,
        paymentMethod: inserted.paymentMethod,
        deliveryMethod: inserted.deliveryMethod,
        subtotal,
        shipping,
        total,
        status: inserted.status,
        lang: inserted.lang,
        items,
        createdAt: inserted.createdAt.toISOString(),
      },
    });
  } catch {
    return Response.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
