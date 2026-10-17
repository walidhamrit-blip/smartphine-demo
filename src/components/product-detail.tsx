"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useSite } from "@/components/site-provider";
import {
  IconArrow,
  IconCard,
  IconCheck,
  IconChevron,
  IconMinus,
  IconPlus,
  IconShield,
  IconTruck,
  IconWhatsApp,
  Stars,
} from "@/components/ui";
import type { DictKey } from "@/lib/i18n";
import { productWhatsappMessage, whatsappUrl } from "@/lib/site";
import type { ProductView } from "@/lib/store";

export function ProductGallery({ product }: { product: ProductView }) {
  const { lang, price, t } = useSite();
  const [active, setActive] = useState(0);
  const name = lang === "ar" ? product.nameAr : product.nameEn;
  const discount = product.compareAtPrice ? Math.round((1 - product.price / product.compareAtPrice) * 100) : 0;
  const images = product.images.length > 0 ? product.images : ["/images/hero-phone.jpg"];

  return (
    <div className="grid gap-3 md:grid-cols-[78px_1fr]">
      <div className="order-2 flex gap-2 overflow-x-auto md:order-1 md:flex-col md:overflow-visible">
        {images.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setActive(index)}
            className={`relative aspect-square w-[68px] shrink-0 overflow-hidden rounded-xl border transition md:w-full ${
              active === index ? "border-gold ring-2 ring-gold/25" : "border-line opacity-70 hover:opacity-100"
            }`}
            aria-label={`${name} ${index + 1}`}
            aria-current={active === index}
          >
            <Image src={image} alt="" fill sizes="78px" className="object-cover" />
          </button>
        ))}
      </div>
      <div className="group relative order-1 aspect-square overflow-hidden rounded-[1.5rem] border border-line bg-surface-2 md:order-2">
        {images.map((image, index) => (
          <Image
            key={`${image}-main-${index}`}
            src={image}
            alt={`${name} — view ${index + 1}`}
            fill
            priority={index === 0}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className={`object-cover transition-all duration-700 ${index === active ? "scale-100 opacity-100" : "scale-105 opacity-0"} group-hover:scale-[1.04]`}
          />
        ))}
        <div className="pointer-events-none absolute inset-x-4 top-4 flex items-start justify-between">
          <div className="flex flex-col gap-1.5">
            {discount > 0 ? (
              <span className="rounded-full bg-[#b33a32] px-3 py-1 text-[11px] font-bold text-white">-{discount}%</span>
            ) : null}
            {product.isNew ? (
              <span className="rounded-full bg-ink/85 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur">{t("common.new")}</span>
            ) : null}
          </div>
          <span className="rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-bold tabular-nums text-ink backdrop-blur">
            {active + 1}/{images.length}
          </span>
        </div>
        <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-center justify-between">
          <span className="rounded-full bg-white/85 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-ink backdrop-blur">
            {t("product.verified")}
          </span>
          <span className="rounded-full bg-ink/80 px-3 py-1.5 text-[10px] font-semibold text-white backdrop-blur">{price(product.price)}</span>
        </div>
      </div>
    </div>
  );
}

function Accordion({ title, body, icon }: { title: string; body: string; icon: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-line">
      <button type="button" onClick={() => setOpen((value) => !value)} className="flex w-full items-center gap-3 py-4 text-start" aria-expanded={open}>
        <span className="text-gold">{icon}</span>
        <span className="flex-1 text-[13px] font-bold">{title}</span>
        <IconChevron direction={open ? "up" : "down"} className="h-4 w-4 text-muted" />
      </button>
      <div className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr] pb-4 opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <p className="overflow-hidden ps-8 text-[12px] leading-relaxed text-muted">{body}</p>
      </div>
    </div>
  );
}

export function ProductPurchase({ product }: { product: ProductView }) {
  const { t, lang, price, addItem } = useSite();
  const [colorIndex, setColorIndex] = useState(0);
  const [storageIndex, setStorageIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const name = lang === "ar" ? product.nameAr : product.nameEn;
  const color = product.colors[colorIndex];
  const colorLabel = color ? (lang === "ar" ? color.name.ar : color.name.en) : undefined;
  const storage = product.storages[storageIndex];
  const discount = product.compareAtPrice ? Math.round((1 - product.price / product.compareAtPrice) * 100) : 0;

  const handleAdd = (goToCheckout = false) => {
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        nameEn: product.nameEn,
        nameAr: product.nameAr,
        price: product.price,
        image: product.images[0] ?? "/images/hero-phone.jpg",
        color: colorLabel,
        storage,
        stock: product.stock,
      },
    );
    setQty(1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    if (goToCheckout) window.location.href = "/checkout";
  };

  const waHref = whatsappUrl(
    productWhatsappMessage(lang, {
      nameEn: product.nameEn,
      nameAr: product.nameAr,
      price: product.price * qty,
      slug: product.slug,
      color: colorLabel,
      storage,
    }),
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
        <Link href={`/shop?brand=${product.brandSlug}`} className="transition hover:text-gold">
          {product.brandSlug}
        </Link>
        <span>·</span>
        <Link href={`/shop?category=${product.categorySlug}`} className="transition hover:text-gold">
          {product.categorySlug}
        </Link>
        <span className="ms-auto normal-case tracking-normal">
          {t("product.sku")}: MP-{String(product.id).padStart(4, "0")}
        </span>
      </div>

      <h1 className="mt-3 font-display text-3xl leading-tight sm:text-[2.9rem]">{name}</h1>
      <p className="mt-2 text-sm text-muted">{lang === "ar" ? product.taglineAr : product.taglineEn}</p>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-[12px]">
        <span className="flex items-center gap-1.5">
          <Stars rating={product.rating} />
          <span className="font-bold">{product.rating.toFixed(1)}</span>
        </span>
        <span className="text-muted">({product.reviewCount} {t("common.reviews")})</span>
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${product.stock > 0 ? "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400" : "bg-red-500/10 text-red-500"}`}>
          {product.stock > 0 ? t("common.inStock") : t("common.outOfStock")}
        </span>
        {product.stock > 0 && product.stock <= 6 ? <span className="text-[11px] font-bold text-gold">{t("common.lowStock", { n: product.stock })}</span> : null}
      </div>

      <div className="mt-5 flex flex-wrap items-end gap-3">
        <p className="font-display text-[2.2rem] leading-none">{price(product.price)}</p>
        {product.compareAtPrice ? (
          <>
            <p className="pb-1 text-sm text-muted line-through">{price(product.compareAtPrice)}</p>
            <span className="mb-1 rounded-full bg-[#b33a32] px-2 py-0.5 text-[10px] font-bold uppercase text-white">
              {t("common.off")} {discount}%
            </span>
          </>
        ) : null}
      </div>
      <p className="mt-1.5 text-[11px] text-muted">{t("product.installments", { price: price(Math.round(product.price / 3)) })}</p>

      {product.colors.length > 0 ? (
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted">{t("product.colors")}</p>
            <p className="text-[12px] font-semibold">{colorLabel}</p>
          </div>
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            {product.colors.map((option, index) => (
              <button
                key={option.hex + index}
                type="button"
                onClick={() => setColorIndex(index)}
                className={`flex items-center gap-2 rounded-full border px-2.5 py-1.5 text-[11px] font-semibold transition ${
                  colorIndex === index ? "border-ink bg-surface-2" : "border-line hover:border-gold"
                }`}
                aria-pressed={colorIndex === index}
              >
                <span className="h-4 w-4 rounded-full border border-black/10" style={{ backgroundColor: option.hex }} />
                {lang === "ar" ? option.name.ar : option.name.en}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {product.storages.length > 0 ? (
        <div className="mt-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted">{t("product.storage")}</p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {product.storages.map((option, index) => (
              <button
                key={option}
                type="button"
                onClick={() => setStorageIndex(index)}
                className={`rounded-full border px-4 py-2 text-[12px] font-bold transition ${
                  storageIndex === index ? "border-ink bg-ink text-[color:var(--page)]" : "border-line hover:border-gold"
                }`}
                aria-pressed={storageIndex === index}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex items-center rounded-full border border-line">
          <button type="button" onClick={() => setQty((value) => Math.max(1, value - 1))} className="flex h-11 w-11 items-center justify-center text-muted transition hover:text-ink" aria-label="-">
            <IconMinus className="h-4 w-4" />
          </button>
          <span className="min-w-8 text-center text-sm font-bold tabular-nums">{qty}</span>
          <button type="button" onClick={() => setQty((value) => Math.min(Math.max(product.stock, 1), value + 1))} className="flex h-11 w-11 items-center justify-center text-muted transition hover:text-ink" aria-label="+">
            <IconPlus className="h-4 w-4" />
          </button>
        </div>
        <button type="button" onClick={() => handleAdd(false)} disabled={product.stock <= 0} className="btn btn-primary flex-1 sm:flex-none">
          {added ? <IconCheck className="h-4 w-4 text-emerald-400" /> : null}
          {added ? t("common.added") : t("product.addToCart")}
          {!added ? <IconArrow className="h-4 w-4 rtl:rotate-180" /> : null}
        </button>
        <a href={waHref} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
          <IconWhatsApp className="h-4 w-4" />
          {t("product.whatsapp")}
        </a>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 text-center">
        {[
          { icon: <IconTruck className="h-4 w-4" />, label: t("trust.delivery.title") },
          { icon: <IconShield className="h-4 w-4" />, label: t("trust.authentic.title") },
          { icon: <IconCard className="h-4 w-4" />, label: t("trust.pay.title") },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-line bg-surface px-2 py-2.5">
            <span className="mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-full bg-gold-soft text-gold">{item.icon}</span>
            <p className="text-[10px] font-semibold leading-tight text-muted">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Accordion title={t("product.deliveryTitle")} body={t("product.deliveryBody")} icon={<IconTruck className="h-4 w-4" />} />
        <Accordion title={t("product.warrantyTitle")} body={t("product.warrantyBody")} icon={<IconShield className="h-4 w-4" />} />
        <Accordion title={t("product.payTitle")} body={t("product.payBody")} icon={<IconCard className="h-4 w-4" />} />
      </div>
    </div>
  );
}

export function ProductStory({ product }: { product: ProductView }) {
  const { lang, t } = useSite();
  return (
    <section className="grid gap-8 border-t border-line py-12 lg:grid-cols-[1fr_1.1fr]">
      <div>
        <p className="eyebrow">{t("product.overview")}</p>
        <h2 className="mt-2 font-display text-3xl">{lang === "ar" ? product.nameAr : product.nameEn}</h2>
        <p className="mt-4 max-w-lg text-[14px] leading-relaxed text-muted">{lang === "ar" ? product.descriptionAr : product.descriptionEn}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {[product.brandSlug, product.categorySlug, ...product.storages].filter(Boolean).map((tag) => (
            <span key={tag} className="rounded-full border border-line px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-muted">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div>
        <p className="eyebrow">{t("product.specs")}</p>
        <dl className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
          {product.specs.map((spec, index) => (
            <div key={index} className="grid grid-cols-2 gap-4 px-5 py-3.5 text-[12px]">
              <dt className="font-semibold text-muted">{lang === "ar" ? spec.label.ar : spec.label.en}</dt>
              <dd className="text-end font-semibold">{lang === "ar" ? spec.value.ar : spec.value.en}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function ProductTrustRow() {
  const { t } = useSite();
  const items: { key: DictKey; icon: React.ReactNode }[] = [
    { key: "trust.authentic.title", icon: <IconShield className="h-4 w-4" /> },
    { key: "trust.delivery.title", icon: <IconTruck className="h-4 w-4" /> },
    { key: "trust.support.title", icon: <IconWhatsApp className="h-4 w-4" /> },
  ];
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-semibold text-muted">
      {items.map((item) => (
        <span key={item.key} className="flex items-center gap-1.5">
          <span className="text-gold">{item.icon}</span>
          {t(item.key)}
        </span>
      ))}
    </div>
  );
}
