import Link from "next/link";
import { IconArrow, IconCart, IconStar } from "@/components/ui";
import { tr } from "@/lib/i18n";
import { getServerLang } from "@/lib/lang-server";
import { getDashboardStats } from "@/lib/store";
import { formatDate, formatPrice } from "@/lib/site";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await requireAdmin();
  const [stats, lang] = await Promise.all([getDashboardStats(), getServerLang()]);

  const cards = [
    { label: tr(lang, "admin.revenue"), value: formatPrice(stats.revenue, lang), hint: tr(lang, "admin.ordersCount") + `: ${stats.orders}`, accent: "bg-gold-soft text-gold" },
    { label: tr(lang, "admin.ordersCount"), value: String(stats.orders), hint: tr(lang, "admin.status.new"), accent: "bg-surface-2 text-ink" },
    { label: tr(lang, "admin.productsCount"), value: String(stats.products), hint: tr(lang, "admin.lowStock") + `: ${stats.lowStock}`, accent: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
    { label: tr(lang, "admin.pendingReviews"), value: String(stats.pendingReviews), hint: tr(lang, "admin.reviews"), accent: "bg-indigo-500/10 text-indigo-500" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">{tr(lang, "admin.title")}</p>
          <h1 className="mt-1 font-display text-3xl">{tr(lang, "admin.dashboard")}</h1>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/products/new" className="btn btn-primary py-2.5! text-[12px]">
            {tr(lang, "admin.newProduct")}
          </Link>
          <Link href="/admin/orders" className="btn btn-outline py-2.5! text-[12px]">
            {tr(lang, "admin.orders")}
          </Link>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-line bg-page p-4">
            <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${card.accent}`}>
              <IconStar className="h-4 w-4" />
            </span>
            <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-muted">{card.label}</p>
            <p className="mt-1 font-display text-2xl leading-none sm:text-3xl">{card.value}</p>
            <p className="mt-1.5 text-[10px] text-muted">{card.hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <section className="rounded-2xl border border-line bg-page p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-xl">
              <IconCart className="h-4 w-4 text-gold" />
              {tr(lang, "admin.recentOrders")}
            </h2>
            <Link href="/admin/orders" className="text-[11px] font-bold text-gold">
              {tr(lang, "common.viewAll")}
            </Link>
          </div>
          {stats.recentOrders.length === 0 ? (
            <p className="py-8 text-center text-[12px] text-muted">{tr(lang, "admin.none")}</p>
          ) : (
            <div className="mt-3 divide-y divide-line">
              {stats.recentOrders.map((order) => (
                <div key={order.id} className="flex flex-wrap items-center gap-2 py-3 text-[12px]">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold">{order.reference}</p>
                    <p className="text-[10.5px] text-muted">
                      {order.customerName} · {order.city} · {formatDate(order.createdAt, lang)}
                    </p>
                  </div>
                  <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                    {tr(lang, `admin.status.${order.status === "new" || order.status === "confirmed" || order.status === "shipped" || order.status === "delivered" || order.status === "cancelled" ? order.status : "new"}`)}
                  </span>
                  <span className="font-bold">{formatPrice(order.total, lang)}</span>
                  <Link href="/admin/orders" className="text-muted hover:text-gold">
                    <IconArrow className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-line bg-page p-4 sm:p-5">
          <h2 className="font-display text-xl">{tr(lang, "admin.lowStockProducts")}</h2>
          <div className="mt-3 space-y-2.5">
            {stats.lowStockProducts.map((product) => (
              <Link key={product.id} href={`/admin/products/${product.id}`} className="flex items-center gap-2.5 rounded-xl border border-line bg-surface p-2.5 transition hover:border-gold">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-2 text-[11px] font-bold">
                  {product.stock}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12px] font-bold">{lang === "ar" ? product.nameAr : product.nameEn}</span>
                  <span className="block text-[10px] text-muted">{formatPrice(product.price, lang)}</span>
                </span>
                <IconArrow className="h-3.5 w-3.5 text-muted" />
              </Link>
            ))}
            {stats.lowStockProducts.length === 0 ? <p className="py-6 text-center text-[12px] text-muted">{tr(lang, "admin.none")}</p> : null}
          </div>
          {stats.pendingReviews > 0 ? (
            <Link href="/admin/reviews" className="mt-4 flex items-center justify-between rounded-xl bg-gold-soft/60 px-3.5 py-2.5 text-[11px] font-bold text-gold">
              {tr(lang, "admin.pendingReviews")}: {stats.pendingReviews}
              <IconArrow className="h-3.5 w-3.5" />
            </Link>
          ) : null}
        </section>
      </div>
    </div>
  );
}
