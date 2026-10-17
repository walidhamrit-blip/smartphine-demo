"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSite } from "@/components/site-provider";
import { IconArrow, IconChevron, IconShield, Stars } from "@/components/ui";
import type { DictKey } from "@/lib/i18n";

type Slide = {
  image: string;
  eyebrow: DictKey;
  title: DictKey;
  accent: DictKey;
  desc: DictKey;
  href: string;
  cta: DictKey;
  label: string;
  product: string;
};

const SLIDES: Slide[] = [
  {
    image: "/images/hero-phone.jpg",
    eyebrow: "home.hero1.eyebrow",
    title: "home.hero1.title",
    accent: "home.hero1.titleAccent",
    desc: "home.hero1.desc",
    href: "/product/iphone-15-pro-max",
    cta: "common.shopNow",
    label: "Titanium",
    product: "iPhone 15 Pro Max",
  },
  {
    image: "/images/hero-audio.jpg",
    eyebrow: "home.hero2.eyebrow",
    title: "home.hero2.title",
    accent: "home.hero2.titleAccent",
    desc: "home.hero2.desc",
    href: "/shop?category=audio",
    cta: "common.explore",
    label: "Audio",
    product: "Sony WH-1000XM5",
  },
  {
    image: "/images/hero-tablet.jpg",
    eyebrow: "home.hero3.eyebrow",
    title: "home.hero3.title",
    accent: "home.hero3.titleAccent",
    desc: "home.hero3.desc",
    href: "/shop?category=tablets",
    cta: "common.explore",
    label: "Tablets",
    product: "iPad Air M2",
  },
];

const DURATION = 7000;

export function HeroSlider() {
  const { t, lang } = useSite();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((next: number) => {
    setIndex((next + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    timer.current = setInterval(() => setIndex((current) => (current + 1) % SLIDES.length), DURATION);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused, index]);

  const slide = SLIDES[index];

  return (
    <section
      className="relative isolate h-[86svh] min-h-[560px] max-h-[900px] overflow-hidden bg-[#0b0b0e] text-[#f7f2e9]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      {SLIDES.map((item, slideIndex) => (
        <div
          key={item.image}
          className={`absolute inset-0 transition-opacity duration-[1200ms] ease-out ${slideIndex === index ? "z-10 opacity-100" : "z-0 opacity-0"}`}
          aria-hidden={slideIndex !== index}
        >
          <Image
            src={item.image}
            alt={item.product}
            fill
            priority={slideIndex === 0}
            sizes="100vw"
            className={`object-cover ${slideIndex === index ? "kenburns" : ""}`}
          />
        </div>
      ))}

      <div className="absolute inset-0 z-20 bg-linear-to-t from-black/90 via-black/35 to-black/25" />
      <div className="absolute inset-0 z-20 bg-linear-to-r from-black/70 via-black/20 to-transparent rtl:bg-linear-to-l" />

      <div className="container-wide relative z-30 flex h-full flex-col justify-center pb-28 pt-16 sm:pb-32">
        <div key={index} className="max-w-2xl">
          <p className="fade-up eyebrow text-[#e3c48f]!" style={{ animationDelay: "80ms" }}>
            {t(slide.eyebrow)}
          </p>
          <h1 className="fade-up font-display mt-4 text-[clamp(2.6rem,6.8vw,5.4rem)] leading-[0.95] tracking-tight" style={{ animationDelay: "160ms" }}>
            {t(slide.title)}
            <br />
            <span className="italic text-[#e6c893]">{t(slide.accent)}</span>
          </h1>
          <p className="fade-up mt-5 max-w-xl text-[14px] leading-relaxed text-white/75 sm:text-base" style={{ animationDelay: "260ms" }}>
            {t(slide.desc)}
          </p>
          <div className="fade-up mt-8 flex flex-wrap items-center gap-3" style={{ animationDelay: "340ms" }}>
            <Link href={slide.href} className="btn btn-light">
              {t(slide.cta)}
              <IconArrow className="h-4 w-4 rtl:rotate-180" />
            </Link>
            <Link href="/shop" className="btn border border-white/35 text-white transition hover:bg-white/10">
              {t("common.viewAll")}
            </Link>
          </div>
          <div className="fade-up mt-9 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-white/70" style={{ animationDelay: "420ms" }}>
            <span className="flex items-center gap-2">
              <Stars rating={5} size="text-[12px]" />
              <span className="font-semibold text-white/90">4.9/5</span>
              <span>{lang === "ar" ? "· أكثر من 1,200 عميل في طرابلس" : "· 1,200+ Tripoli customers"}</span>
            </span>
            <span className="hidden items-center gap-1.5 sm:flex">
              <IconShield className="h-3.5 w-3.5 text-[#e3c48f]" />
              {lang === "ar" ? "ضمان رسمي 12 شهراً" : "Official 12-month warranty"}
            </span>
          </div>
        </div>
      </div>

      <div className="container-wide absolute inset-x-0 bottom-6 z-30">
        <div className="flex items-end justify-between gap-4">
          <div className="flex items-center gap-2">
            {SLIDES.map((item, dotIndex) => (
              <button
                key={item.image}
                type="button"
                onClick={() => goTo(dotIndex)}
                aria-label={`Slide ${dotIndex + 1}`}
                aria-current={dotIndex === index}
                className="group relative h-1 overflow-hidden rounded-full bg-white/25 transition-all"
                style={{ width: dotIndex === index ? 64 : 24 }}
              >
                {dotIndex === index ? (
                  <span
                    key={`${index}-${paused}`}
                    className="absolute inset-y-0 left-0 bg-[#e6c893]"
                    style={{ animation: paused ? "none" : `hero-progress ${DURATION}ms linear forwards`, width: paused ? "100%" : undefined }}
                  />
                ) : null}
              </button>
            ))}
            <span className="ms-2 text-[11px] font-semibold tabular-nums text-white/60">
              {String(index + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
            </span>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <div className="me-2 hidden text-end lg:block">
              <p className="text-[10px] uppercase tracking-[0.28em] text-white/50">{slide.label}</p>
              <p className="text-sm font-semibold">{slide.product}</p>
            </div>
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white/80 backdrop-blur transition hover:bg-white/15 hover:text-white"
              aria-label="Previous slide"
            >
              <IconChevron direction="left" className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white/80 backdrop-blur transition hover:bg-white/15 hover:text-white"
              aria-label="Next slide"
            >
              <IconChevron direction="right" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
