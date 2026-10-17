import { updateOrderStatusAction } from "@/app/admin/actions";
import { IconWhatsApp } from "@/components/ui";
import { tr } from "@/lib/i18n";
import { getServerLang } from "@/lib/lang-server";
import { getAllOrders } from "@/lib/store";
import { formatDate, formatPrice, ORDER_STATUSES } from "@/lib/site";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

function toWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("218")) return digits;
  if (digits.startsWith("0")) return `218${digits.slice(1)}`;
  return `218${digits}`;
}

export default async function AdminOrdersPage() {
  await requireAdmin();
  const [orders, lang] = await Promise.all([getAllOrders(), getServerLang()]);
  const counts = ORDER_STATUSES.map((status) => ({ status, count: orders.filter((order) => order.status === status).length }));

  return (
    <div>
      <p className="eyebrow">{tr(lang, "admin.title")}</p>
      <h1 className="mt-1 font-display text-3xl">{tr(lang, "admin.orders")}</h1>
      <p className="mt-1 text-[12px] text-muted">
        {orders.length} {tr(lang, "admin.ordersCount")} · {formatPrice(orders.reduce((sum, order) => sum + order.total, 0), lang)}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {counts.map((entry) => (
          <span key={entry.status} className="rounded-full border border-line px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted">
            {tr(lang, `admin.status.${entry.status}`)}: {entry.count}
          </span>
        ))}
      </div>

      {orders.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-line bg-page py-14 text-center text-[13px] text-muted">{tr(lang, "admin.none")}</p>
      ) : (
        <div className="mt-5 space-y-3">
          {orders.map((order) => (
            <details key={order.id} className="group overflow-hidden rounded-2xl border border-line bg-page">
              <summary className="flex cursor-pointer flex-wrap items-center gap-3 px-4 py-3.5 marker:hidden">
                <div className="min-w-0 flex-1">
                  <p className="text-[12.5px] font-bold">{order.reference}</p>
                  <p className="text-[10.5px] text-muted">
                    {order.customerName} · {order.city} · {formatDate(order.createdAt, lang)}
                  </p>
                </div>
                <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted">
                  {tr(lang, `admin.status.${order.status === "new" || order.status === "confirmed" || order.status === "shipped" || order.status === "delivered" || order.status === "cancelled" ? order.status : "new"}`)}
                </span>
                <span className="text-[12px] font-bold">{formatPrice(order.total, lang)}</span>
                <span className="text-[10px] text-muted">{order.items.length} {tr(lang, "admin.orderItems")}</span>
              </summary>

              <div className="border-t border-line px-4 py-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted">{tr(lang, "admin.customer")}</p>
                    <p className="mt-1.5 text-[12.5px] font-semibold">{order.customerName}</p>
                    <p className="text-[11.5px] text-muted" dir="ltr">{order.phone}</p>
                    <p className="text-[11.5px] text-muted">{order.city} · {order.address}</p>
                    {order.notes ? <p className="mt-1 text-[11px] italic text-muted">{order.notes}</p> : null}
                    <a
                      href={`https://wa.me/${toWhatsAppNumber(order.phone)}?text=${encodeURIComponent(
                        lang === "ar" ? `مرحباً ${order.customerName}، بخصوص طلبك ${order.reference} من ماي فون.` : `Hello ${order.customerName}, regarding your MyPhone order ${order.reference}.`,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#1faa5a]/10 px-2.5 py-1 text-[10px] font-bold text-[#1faa5a]"
                    >
                      <IconWhatsApp className="h-3 w-3" />
                      WhatsApp
                    </a>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted">{tr(lang, "admin.orderItems")}</p>
                    <ul className="mt-1.5 space-y-1 text-[11.5px]">
                      {order.items.map((item, index) => (
                        <li key={`${order.id}-${index}`} className="flex justify-between gap-2">
                          <span className="text-muted">
                            {(lang === "ar" ? item.name.ar : item.name.en)} × {item.qty}
                            {item.color ? ` · ${item.color}` : ""}
                            {item.storage ? ` · ${item.storage}` : ""}
                          </span>
                          <span className="font-semibold">{formatPrice(item.price * item.qty, lang)}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-2 flex justify-between border-t border-line pt-2 text-[11.5px]">
                      <span className="text-muted">{tr(lang, "cart.shipping")}</span>
                      <span>{order.shipping === 0 ? tr(lang, "common.free") : formatPrice(order.shipping, lang)}</span>
                    </div>
                    <div className="flex justify-between text-[12px] font-bold">
                      <span>{tr(lang, "cart.total")}</span>
                      <span>{formatPrice(order.total, lang)}</span>
                    </div>
                    <p className="mt-1 text-[10px] uppercase tracking-widest text-muted">
                      {order.paymentMethod} · {order.deliveryMethod}
                    </p>
                  </div>
                </div>

                <form action={updateOrderStatusAction} className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-3">
                  <input type="hidden" name="id" value={order.id} />
                  <select name="status" defaultValue={order.status} className="field w-auto! py-1.5! text-[11px]" aria-label={tr(lang, "admin.status")}>
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {tr(lang, `admin.status.${status}`)}
                      </option>
                    ))}
                  </select>
                  <button type="submit" className="btn btn-primary px-3.5! py-1.5! text-[11px]">
                    {tr(lang, "admin.updateStatus")}
                  </button>
                </form>
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
