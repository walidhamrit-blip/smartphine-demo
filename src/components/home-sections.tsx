"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { useSite } from "@/components/site-provider";
import {
  IconArrow,
  IconCard,
  IconCheck,
  IconShield,
  IconSupport,
  IconTruck,
  IconWhatsApp,
  Reveal,
  SectionHeading,
  Stars,
} from "@/components/ui";
import type { DictKey } from "@/lib/i18n";
import type { Category } from "@/db/schema";
import type { ProductView, ReviewView } from "@/lib/store";
import { whatsappUrl } from "@/lib/site";

export function TrustStrip() {
  const { t } = useSite();
  const items: { icon: React.ReactNode; title: DictKey; desc: DictKey }[] = [
    { icon: <IconShield className="h-5 w-5" />, title: "trust.authentic.title", desc: "trust.authentic.desc" },
    { icon: <IconTruck className="h-5 w-5" />, title: "trust.delivery.title", desc: "trust.delivery.desc" },
    { icon: <IconCard className="h-5 w-5" />, title: "trust.pay.title", desc: "trust.pay.desc" },
    { icon: <IconSupport className="h-5 w-5" />, title: "trust.support.title", desc: "trust.support.desc" },
  ];
  return (
    <section className="border-b border-line bg-surface">
      <div className="container-wide grid grid-cols-2 gap-x-4 gap-y-5 py-6 md:grid-cols-4 md:py-7">
        {items.map((item, index) => (
          <div key={item.title} className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-soft text-gold">{item.icon}</span>
            <div className="min-w-0">
              <p className="truncate text-[12px] font-bold">{t(item.title)}</p>
              <p className="truncate text-[11px] text-muted">{t(item.desc)}</p>
            </div>
            {index < items.length - 1 ? <span className="ms-auto hidden h-8 w-px bg-line md:block" /> : null}
          </div>
        ))}
      </div>
    </section>
  );
}

export function CategoryGrid({ categories, counts }: { categories: Category[]; counts: Record<string, number> }) {
  const { t, lang } = useSite();
  return (
    <section className="container-wide py-16 sm:py-20">
      <Reveal>
        <SectionHeading
          eyebrow={t("collections.eyebrow")}
          title={t("collections.title")}
          subtitle={t("collections.sub")}
          action={
            <Link href="/shop" className="btn btn-outline">
              {t("common.viewAll")}
              <IconArrow className="h-4 w-4 rtl:rotate-180" />
            </Link>
          }
        />
      </Reveal>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {categories.map((category, index) => {
          const large = index === 0;
          return (
            <Reveal
              key={category.slug}
              delay={index * 60}
              className={`${large ? "col-span-2 lg:row-span-2" : ""} ${index === 3 ? "lg:col-span-2" : ""}`}
            >
              <Link
                href={`/shop?category=${category.slug}`}
                className={`group relative flex h-full flex-col justify-end overflow-hidden rounded-[1.4rem] border border-line bg-surface-2 ${
                  large ? "min-h-[320px] sm:min-h-[420px] lg:min-h-[520px]" : "min-h-[150px] sm:min-h-[190px] lg:min-h-[240px]"
                }`}
              >
                <Image
                  src={category.image}
                  alt={lang === "ar" ? category.nameAr : category.nameEn}
                  fill
                  sizes={large ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 1024px) 50vw, 25vw"}
                  className="object-cover transition duration-[1100ms] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-black/5" />
                <div className="relative z-10 flex items-end justify-between gap-3 p-4 text-white sm:p-5">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/65">
                      {counts[category.slug] ?? 0} {lang === "ar" ? "منتج" : "products"}
                    </p>
                    <h3 className={`mt-1 font-display ${large ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl"}`}>
                      {lang === "ar" ? category.nameAr : category.nameEn}
                    </h3>
                    {large ? <p className="mt-1.5 max-w-xs text-xs text-white/70">{lang === "ar" ? category.taglineAr : category.taglineEn}</p> : null}
                  </div>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/40 bg-white/10 backdrop-blur transition group-hover:bg-white group-hover:text-ink">
                    <IconArrow className="h-4 w-4 rtl:rotate-180" />
                  </span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

export function ProductRail({
  products,
  eyebrowKey,
  titleKey,
  subKey,
  href = "/shop",
  tone = "light",
  showAll = true,
}: {
  products: ProductView[];
  eyebrowKey: DictKey;
  titleKey: DictKey;
  subKey?: DictKey;
  href?: string;
  tone?: "light" | "dark";
  showAll?: boolean;
}) {
  const { t } = useSite();
  return (
    <section className={`container-wide py-14 sm:py-16 ${tone === "dark" ? "" : ""}`}>
      <Reveal>
        <SectionHeading
          eyebrow={t(eyebrowKey)}
          title={t(titleKey)}
          subtitle={subKey ? t(subKey) : undefined}
          action={
            showAll ? (
              <Link href={href} className={`btn ${tone === "dark" ? "btn-light" : "btn-outline"}`}>
                {t("common.viewAll")}
                <IconArrow className="h-4 w-4 rtl:rotate-180" />
              </Link>
            ) : undefined
          }
        />
      </Reveal>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {products.map((product, index) => (
          <Reveal key={product.id} delay={index * 55}>
            <ProductCard product={product} priority={index < 2} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function PromoBlock() {
  const { t, lang } = useSite();
  const bullets =
    lang === "ar"
      ? ["تقييم فوري لجهازك القديم", "نقل بيانات مجاني في المتجر", "حماية شاشة وتركيب مجاناً"]
      : ["Instant valuation for your old device", "Free in-store data transfer", "Free screen protector & setup"];
  return (
    <section className="container-wide py-4 sm:py-8">
      <Reveal>
        <div className="grid overflow-hidden rounded-[1.8rem] border border-line bg-surface lg:grid-cols-2">
          <div className="relative min-h-[280px] lg:min-h-[420px]">
            <Image src="/images/cases.jpg" alt="Phone accessories" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-4 start-4 rounded-full bg-white/90 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-ink backdrop-blur">
              {lang === "ar" ? "خدمة الاستبدال" : "Trade-in service"}
            </div>
          </div>
          <div className="flex flex-col justify-center p-7 sm:p-10">
            <p className="eyebrow">{t("cta.promo")}</p>
            <h2 className="mt-3 font-display text-3xl leading-tight sm:text-[2.7rem]">{t("promo.title")}</h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted">{t("promo.desc")}</p>
            <ul className="mt-6 space-y-2.5">
              {bullets.map((bullet) => (
                <li key={bullet} className="flex items-center gap-2.5 text-[13px] font-medium">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold-soft text-gold">
                    <IconCheck className="h-3 w-3" />
                  </span>
                  {bullet}
                </li>
              ))}
            </ul>
            <a
              href={whatsappUrl(
                lang === "ar" ? "مرحباً ماي فون، أريد تقييم جهازي القديم للاستبدال." : "Hello MyPhone, I'd like a trade-in valuation for my device.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary mt-7 self-start"
            >
              {t("promo.button")}
              <IconArrow className="h-4 w-4 rtl:rotate-180" />
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function DealsSection({ products }: { products: ProductView[] }) {
  const { t, lang } = useSite();
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      const diff = Math.max(0, end.getTime() - now.getTime());
      setTime({
        hours: Math.floor(diff / 3_600_000),
        minutes: Math.floor((diff % 3_600_000) / 60_000),
        seconds: Math.floor((diff % 60_000) / 1000),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-ink py-14 text-[color:var(--page)] sm:py-16">
      <div className="container-wide">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-[#e0bf8d]!">{t("deals.eyebrow")}</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl lg:text-[2.9rem]">{t("deals.title")}</h2>
            <p className="mt-2 max-w-lg text-sm text-white/60">{t("deals.sub")}</p>
          </div>
          <div className="flex items-center gap-2 font-semibold">
            {(["hours", "minutes", "seconds"] as const).map((unit) => (
              <div key={unit} className="flex flex-col items-center rounded-xl border border-white/15 bg-white/5 px-3 py-2 backdrop-blur">
                <span className="font-display text-xl tabular-nums leading-none">{String(time[unit]).padStart(2, "0")}</span>
                <span className="mt-1 text-[9px] uppercase tracking-widest text-white/50">
                  {lang === "ar" ? { hours: "ساعة", minutes: "دقيقة", seconds: "ثانية" }[unit] : unit}
                </span>
              </div>
            ))}
            <Link href="/shop?deals=1" className="btn btn-light ms-2 py-3!">
              {t("common.viewAll")}
            </Link>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {products.map((product, index) => (
            <Reveal key={product.id} delay={index * 60}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Testimonials({ reviews }: { reviews: ReviewView[] }) {
  const { t, lang } = useSite();
  if (reviews.length === 0) return null;
  return (
    <section className="container-wide py-16 sm:py-20">
      <Reveal>
        <SectionHeading eyebrow={t("testi.eyebrow")} title={t("testi.title")} subtitle={t("testi.sub")} align="center" />
      </Reveal>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {reviews.slice(0, 3).map((review, index) => (
          <Reveal key={review.id} delay={index * 80}>
            <figure className="flex h-full flex-col rounded-[1.4rem] border border-line bg-surface p-6 transition hover:border-gold/50">
              <Stars rating={review.rating} />
              <blockquote className="mt-4 flex-1 text-[13px] leading-relaxed text-ink/85">
                <p className="font-semibold">{review.title}</p>
                <p className="mt-2 text-muted">{review.body}</p>
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-soft text-[13px] font-bold text-gold">
                  {review.author.slice(0, 1)}
                </span>
                <div className="text-[12px]">
                  <p className="font-bold">{review.author}</p>
                  <p className="text-muted">
                    {review.city} · {t("product.verified")}
                  </p>
                </div>
                <IconCheck className="ms-auto h-4 w-4 text-emerald-500" />
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-muted">
        {lang === "ar" ? "متوسط التقييم 4.9 من 5 · بناءً على أكثر من 1,200 عميل" : "Rated 4.9/5 by more than 1,200 happy customers"}
      </p>
    </section>
  );
}

export function WhatsAppCta() {
  const { t, lang } = useSite();
  return (
    <section className="container-wide pb-6">
      <Reveal>
        <div className="relative overflow-hidden rounded-[1.8rem] bg-[#101014] px-6 py-12 text-white sm:px-12 sm:py-16">
          <Image src="/images/hero-audio.jpg" alt="" fill sizes="100vw" className="object-cover opacity-30" />
          <div className="absolute inset-0 bg-linear-to-r from-[#0b0b0e] via-[#0b0b0e]/85 to-[#0b0b0e]/30 rtl:bg-linear-to-l" />
          <div className="relative z-10 max-w-xl">
            <p className="eyebrow text-[#e0bf8d]!">{t("cta.eyebrow")}</p>
            <h2 className="mt-3 font-display text-3xl leading-tight sm:text-[2.9rem]">{t("cta.title")}</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/70">{t("cta.sub")}</p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href={whatsappUrl(lang === "ar" ? "مرحباً ماي فون! أريد المساعدة في اختيار جهاز." : "Hello MyPhone! I'd like help choosing a device.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
              >
                <IconWhatsApp className="h-4 w-4" />
                {t("cta.button")}
              </a>
              <Link href="/shop" className="btn border border-white/30 text-white hover:bg-white/10">
                {t("common.shopNow")}
              </Link>
            </div>
            <p className="mt-4 text-[11px] text-white/50">{t("cta.call")}</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
