"use client";

import Image from "next/image";
import Link from "next/link";
import { useSite } from "@/components/site-provider";
import { BrandLine } from "@/components/brand-name";
import { IconCart, IconCheck, IconPlus, Stars } from "@/components/ui";
import type { ProductView } from "@/lib/store";

export function ProductCard({ product, priority = false }: { product: ProductView; priority?: boolean }) {
  const { t, lang, price, addItem, lastAdded } = useSite();
  const name = lang === "ar" ? product.nameAr : product.nameEn;
  const discount = product.compareAtPrice ? Math.round((1 - product.price / product.compareAtPrice) * 100) : 0;
  const defaultColor = product.colors[0]?.name;
  const defaultStorage = product.storages[0];
  const key = `${product.slug}__${defaultColor ? (lang === "ar" ? defaultColor.ar : defaultColor.en) : "default"}__${defaultStorage ?? "default"}`;
  const justAdded = lastAdded === key;
  const soldOut = product.stock <= 0;

  const handleAdd = () => {
    if (soldOut) return;
    addItem({
      productId: product.id,
      slug: product.slug,
      nameEn: product.nameEn,
      nameAr: product.nameAr,
      price: product.price,
      image: product.images[0] ?? "/images/phone.jpg",
      color: defaultColor ? (lang === "ar" ? defaultColor.ar : defaultColor.en) : undefined,
      storage: defaultStorage,
      stock: product.stock,
    });
  };

  return (
    <article className="product-card group relative flex h-full flex-col overflow-hidden rounded-[1.4rem] border border-line bg-surface transition duration-500 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[var(--shadow)]">
      <div className="product-media relative aspect-[4/5] overflow-hidden bg-surface-2">
        <Link href={`/product/${product.slug}`} aria-label={name} className="absolute inset-0">
          <Image
            src={product.images[0] ?? "/images/hero-phone.jpg"}
            alt={name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 25vw"
            className="object-cover"
          />
        </Link>
        <div className="absolute start-3 top-3 z-10 flex flex-col items-start gap-1.5">
          {discount > 0 ? (
            <span className="rounded-full bg-[#b33a32] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              -{discount}%
            </span>
          ) : null}
          {product.isNew ? (
            <span className="rounded-full bg-ink/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[color:var(--page)] backdrop-blur">
              {t("common.new")}
            </span>
          ) : null}
          {product.badgeEn && discount === 0 && !product.isNew ? (
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink backdrop-blur">
              {lang === "ar" ? product.badgeAr ?? product.badgeEn : product.badgeEn}
            </span>
          ) : null}
        </div>
        <button
          type="button"
          onClick={handleAdd}
          disabled={soldOut}
          aria-label={t("common.addToCart")}
          className={`absolute bottom-3 end-3 z-10 flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition duration-300 ${
            soldOut ? "bg-surface-2 text-muted" : justAdded ? "bg-emerald-600 text-white" : "bg-white/95 text-ink hover:scale-105 hover:bg-ink hover:text-white dark:bg-white dark:text-ink"
          }`}
        >
          {justAdded ? <IconCheck className="h-5 w-5" /> : <IconPlus className="h-5 w-5" />}
        </button>
        {soldOut ? (
          <span className="absolute inset-x-0 bottom-0 z-10 bg-ink/80 py-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--page)]">
            {t("common.outOfStock")}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2">
          <BrandLine slug={product.brandSlug} muted />
          <span className="flex items-center gap-1 text-[11px] text-muted">
            <Stars rating={product.rating} size="text-[11px]" />
            <span className="tabular-nums">({product.reviewCount})</span>
          </span>
        </div>
        <h3 className="mt-2 line-clamp-2 text-[15px] font-bold leading-snug tracking-tight">
          <Link href={`/product/${product.slug}`} className="transition hover:text-gold">
            {name}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-1 text-[11px] text-muted">{lang === "ar" ? product.taglineAr : product.taglineEn}</p>

        {product.colors.length > 0 ? (
          <div className="mt-3 flex items-center gap-1.5">
            {product.colors.slice(0, 4).map((color) => (
              <span
                key={color.hex}
                className="h-3 w-3 rounded-full border border-line ring-1 ring-white/40"
                style={{ backgroundColor: color.hex }}
                title={lang === "ar" ? color.name.ar : color.name.en}
              />
            ))}
            {product.stock > 0 && product.stock <= 6 ? (
              <span className="ms-auto text-[10px] font-bold text-gold">{t("common.lowStock", { n: product.stock })}</span>
            ) : null}
          </div>
        ) : null}

        <div className="mt-3 flex items-end justify-between gap-2 pt-1">
          <div>
            <p className="text-[15px] font-extrabold tracking-tight">{price(product.price)}</p>
            {product.compareAtPrice ? (
              <p className="text-[11px] text-muted line-through">{price(product.compareAtPrice)}</p>
            ) : (
              <p className="text-[10px] text-muted">{t("product.installments", { price: price(Math.round(product.price / 3)) })}</p>
            )}
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={soldOut}
            className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-2 text-[11px] font-bold transition hover:border-ink hover:bg-ink hover:text-[color:var(--page)] disabled:opacity-40"
          >
            <IconCart className="h-3.5 w-3.5" />
            {justAdded ? t("common.added") : t("common.addToCart")}
          </button>
        </div>
      </div>
    </article>
  );
}
