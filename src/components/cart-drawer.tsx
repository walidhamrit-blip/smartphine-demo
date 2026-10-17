"use client";

import Image from "next/image";
import Link from "next/link";
import { useSite } from "@/components/site-provider";
import {
  IconArrow,
  IconCart,
  IconCheck,
  IconClose,
  IconMinus,
  IconPlus,
  IconShield,
  IconTrash,
  IconWhatsApp,
} from "@/components/ui";
import { FREE_SHIPPING_THRESHOLD, cartWhatsappMessage, formatPrice, whatsappUrl } from "@/lib/site";

export function CartDrawer() {
  const { t, lang, price, items, cartOpen, setCartOpen, removeItem, setQty, subtotal, shipping, total, hydrated } = useSite();
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const whatsappItems = items.map((item) => ({
    name: lang === "ar" ? item.nameAr : item.nameEn,
    qty: item.qty,
    price: item.price,
    color: item.color,
    storage: item.storage,
  }));

  return (
    <div className={`fixed inset-0 z-50 ${cartOpen ? "pointer-events-auto" : "pointer-events-none"}`} aria-hidden={!cartOpen}>
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-[3px] transition-opacity duration-500 ${cartOpen ? "opacity-100" : "opacity-0"}`}
        onClick={() => setCartOpen(false)}
      />
      <aside
        className={`drawer-panel absolute inset-y-0 end-0 flex w-full max-w-[440px] flex-col border-line bg-page shadow-2xl ${cartOpen ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={t("cart.title")}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div className="flex items-center gap-2.5">
            <IconCart className="h-5 w-5 text-gold" />
            <h2 className="font-display text-2xl leading-none">{t("cart.title")}</h2>
            <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-bold text-muted">
              {hydrated ? items.reduce((sum, item) => sum + item.qty, 0) : 0}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setCartOpen(false)}
            className="rounded-full border border-line p-2 text-muted transition hover:text-ink"
            aria-label={t("common.close")}
          >
            <IconClose className="h-4 w-4" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-surface-2 text-gold">
              <IconCart className="h-9 w-9" />
            </div>
            <p className="font-display text-2xl">{t("cart.empty")}</p>
            <p className="mt-2 text-sm text-muted">{t("cart.emptyHint")}</p>
            <Link href="/shop" onClick={() => setCartOpen(false)} className="btn btn-primary mt-6">
              {t("cart.emptyCta")}
              <IconArrow className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>
        ) : (
          <>
            <div className="border-b border-line bg-surface px-5 py-3">
              <div className="flex items-center justify-between text-[11px] font-semibold">
                <span className={remaining === 0 ? "flex items-center gap-1 text-emerald-600 dark:text-emerald-400" : "text-muted"}>
                  {remaining === 0 ? <IconCheck className="h-3.5 w-3.5" /> : null}
                  {remaining === 0 ? t("cart.freeShipReached") : t("cart.freeShipAhead", { amount: formatPrice(remaining, lang) })}
                </span>
                <span className="text-muted">{Math.round(progress)}%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
                <div className="h-full rounded-full bg-gold transition-all duration-700" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item.key} className="flex gap-3 rounded-2xl border border-line bg-surface p-3">
                    <Link href={`/product/${item.slug}`} onClick={() => setCartOpen(false)} className="relative h-[86px] w-[72px] shrink-0 overflow-hidden rounded-xl bg-surface-2">
                      <Image src={item.image} alt={item.nameEn} fill sizes="72px" className="object-cover" />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={() => setCartOpen(false)}
                          className="line-clamp-2 text-[13px] font-bold leading-snug hover:text-gold"
                        >
                          {lang === "ar" ? item.nameAr : item.nameEn}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeItem(item.key)}
                          className="shrink-0 text-muted transition hover:text-red-500"
                          aria-label={t("cart.remove")}
                        >
                          <IconTrash className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="mt-0.5 text-[11px] text-muted">
                        {[item.color, item.storage].filter(Boolean).join(" · ") || t("product.sku")}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center rounded-full border border-line">
                          <button
                            type="button"
                            onClick={() => setQty(item.key, item.qty - 1)}
                            className="flex h-7 w-7 items-center justify-center text-muted transition hover:text-ink"
                            aria-label="-"
                          >
                            <IconMinus className="h-3.5 w-3.5" />
                          </button>
                          <span className="min-w-6 text-center text-xs font-bold">{item.qty}</span>
                          <button
                            type="button"
                            onClick={() => setQty(item.key, item.qty + 1)}
                            className="flex h-7 w-7 items-center justify-center text-muted transition hover:text-ink"
                            aria-label="+"
                          >
                            <IconPlus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="text-sm font-bold">{price(item.price * item.qty)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-4 flex items-center gap-1.5 text-[11px] text-muted">
                <IconShield className="h-3.5 w-3.5 text-gold" />
                {t("cart.note")}
              </p>
            </div>

            <div className="border-t border-line bg-surface px-5 py-4">
              <dl className="space-y-1.5 text-[13px]">
                <div className="flex justify-between">
                  <dt className="text-muted">{t("cart.subtotal")}</dt>
                  <dd className="font-semibold">{price(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">{t("cart.shipping")}</dt>
                  <dd className="font-semibold">{shipping === 0 ? t("common.free") : price(shipping)}</dd>
                </div>
                <div className="flex justify-between border-t border-line pt-2 text-base">
                  <dt className="font-bold">{t("cart.total")}</dt>
                  <dd className="font-display text-xl">{price(total)}</dd>
                </div>
              </dl>
              <Link href="/checkout" onClick={() => setCartOpen(false)} className="btn btn-primary mt-4 w-full">
                {t("cart.checkout")}
                <IconArrow className="h-4 w-4 rtl:rotate-180" />
              </Link>
              <a
                href={whatsappUrl(cartWhatsappMessage(lang, whatsappItems, total))}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline mt-2 w-full border-[#1faa5a]/40! text-[#1faa5a]! hover:bg-[#1faa5a]/10!"
              >
                <IconWhatsApp className="h-4 w-4" />
                {t("cart.whatsapp")}
              </a>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
