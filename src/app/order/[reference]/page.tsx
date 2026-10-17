import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IconArrow, IconCheck, IconTruck, IconWhatsApp } from "@/components/ui";
import { tr } from "@/lib/i18n";
import { getServerLang } from "@/lib/lang-server";
import { getOrderByReference } from "@/lib/store";
import { formatDate, formatPrice, orderWhatsappMessage, whatsappUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Your order" };

type PageProps = { params: Promise<{ reference: string }> };

export default async function OrderPage({ params }: PageProps) {
  const { reference } = await params;
  const [order, lang] = await Promise.all([getOrderByReference(reference), getServerLang()]);
  if (!order) notFound();

  const message = orderWhatsappMessage(lang, {
    reference: order.reference,
    customerName: order.customerName,
    phone: order.phone,
    city: order.city,
    address: order.address,
    notes: order.notes,
    deliveryMethod: order.deliveryMethod,
    paymentMethod: order.paymentMethod,
    total: order.total,
    items: order.items.map((item) => ({
      name: lang === "ar" ? item.name.ar : item.name.en,
      qty: item.qty,
      price: item.price,
      color: item.color,
      storage: item.storage,
    })),
  });

  const statusLabels: Record<string, string> = {
    new: tr(lang, "admin.status.new"),
    confirmed: tr(lang, "admin.status.confirmed"),
    shipped: tr(lang, "admin.status.shipped"),
    delivered: tr(lang, "admin.status.delivered"),
    cancelled: tr(lang, "admin.status.cancelled"),
  };

  const deliveryLabel =
    order.deliveryMethod === "pickup" ? tr(lang, "checkout.pickup") : order.deliveryMethod === "other" ? tr(lang, "checkout.otherCity") : tr(lang, "checkout.tripoli");
  const paymentLabel =
    order.paymentMethod === "transfer" ? tr(lang, "checkout.transfer") : order.paymentMethod === "whatsapp" ? tr(lang, "checkout.whatsappPay") : tr(lang, "checkout.cash");

  return (
    <div className="container-wide py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow">{tr(lang, "checkout.orderRef")}</p>
            <h1 className="mt-1 font-display text-4xl">{order.reference}</h1>
            <p className="mt-2 text-[12px] text-muted">
              {formatDate(order.createdAt, lang)} · {tr(lang, "order.sub")}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-soft px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-gold">
            <IconCheck className="h-3.5 w-3.5" />
            {statusLabels[order.status] ?? order.status}
          </span>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-line bg-surface p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">{tr(lang, "checkout.customer")}</p>
            <p className="mt-2 text-[13px] font-bold">{order.customerName}</p>
            <p className="text-[12px] text-muted" dir="ltr">
              {order.phone}
            </p>
            <p className="text-[12px] text-muted">
              {order.city} · {order.address}
            </p>
            {order.notes ? <p className="mt-2 text-[11px] italic text-muted">{order.notes}</p> : null}
          </div>
          <div className="rounded-2xl border border-line bg-surface p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">{tr(lang, "order.status")}</p>
            <p className="mt-2 flex items-center gap-2 text-[13px] font-bold">
              <IconTruck className="h-4 w-4 text-gold" />
              {deliveryLabel}
            </p>
            <p className="mt-1 text-[12px] text-muted">{paymentLabel}</p>
            <p className="mt-2 text-[11px] text-muted">{tr(lang, "order.sub")}</p>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-surface">
          <p className="border-b border-line px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">{tr(lang, "order.items")}</p>
          <ul className="divide-y divide-line">
            {order.items.map((item, index) => (
              <li key={`${item.slug}-${index}`} className="flex items-center gap-3 px-5 py-3.5">
                <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-lg bg-surface-2">
                  <Image src={item.image} alt="" fill sizes="48px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <Link href={`/product/${item.slug}`} className="line-clamp-1 text-[12.5px] font-bold hover:text-gold">
                    {lang === "ar" ? item.name.ar : item.name.en}
                  </Link>
                  <p className="text-[11px] text-muted">
                    {[item.color, item.storage].filter(Boolean).join(" · ")} × {item.qty}
                  </p>
                </div>
                <p className="text-[12.5px] font-bold">{formatPrice(item.price * item.qty, lang)}</p>
              </li>
            ))}
          </ul>
          <dl className="space-y-1.5 border-t border-line px-5 py-4 text-[12px]">
            <div className="flex justify-between">
              <dt className="text-muted">{tr(lang, "cart.subtotal")}</dt>
              <dd className="font-semibold">{formatPrice(order.subtotal, lang)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">{tr(lang, "cart.shipping")}</dt>
              <dd className="font-semibold">{order.shipping === 0 ? tr(lang, "common.free") : formatPrice(order.shipping, lang)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-2">
              <dt className="text-[13px] font-bold">{tr(lang, "cart.total")}</dt>
              <dd className="font-display text-xl">{formatPrice(order.total, lang)}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <a href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
            <IconWhatsApp className="h-4 w-4" />
            {tr(lang, "order.whatsapp")}
          </a>
          <Link href="/shop" className="btn btn-outline">
            {tr(lang, "common.continueShopping")}
            <IconArrow className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
}
