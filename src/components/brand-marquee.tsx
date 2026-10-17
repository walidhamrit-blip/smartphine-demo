"use client";

import { useSite } from "@/components/site-provider";

export type MarqueeBrand = { name: string; accent: string; monogram: string };

function BrandPill({ brand }: { brand: MarqueeBrand }) {
  return (
    <div className="flex shrink-0 items-center gap-3 px-7 py-2 sm:px-10">
      <span
        className="flex h-9 w-9 items-center justify-center rounded-full border text-[11px] font-black"
        style={{ borderColor: `${brand.accent}55`, color: brand.accent, backgroundColor: `${brand.accent}12` }}
      >
        {brand.monogram || brand.name.slice(0, 1)}
      </span>
      <span className="whitespace-nowrap text-lg font-extrabold uppercase tracking-[0.16em] text-ink/75 transition hover:text-ink sm:text-xl">
        {brand.name}
      </span>
      <span className="ms-3 h-1 w-1 rounded-full bg-gold/60" />
    </div>
  );
}

function Row({ brands, reverse }: { brands: MarqueeBrand[]; reverse?: boolean }) {
  return (
    <div className="marquee-viewport py-1">
      <div className={`marquee-track ${reverse ? "reverse" : ""}`}>
        <div className="flex items-center">
          {brands.map((brand, index) => (
            <BrandPill key={`a-${brand.name}-${index}`} brand={brand} />
          ))}
        </div>
        <div className="flex items-center" aria-hidden>
          {brands.map((brand, index) => (
            <BrandPill key={`b-${brand.name}-${index}`} brand={brand} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function BrandMarquee({ brands }: { brands: MarqueeBrand[] }) {
  const { t } = useSite();
  if (brands.length === 0) return null;
  const rowOne = brands.slice(0, Math.ceil(brands.length / 2));
  const rowTwo = brands.slice(Math.ceil(brands.length / 2));

  return (
    <section className="border-y border-line bg-surface py-9 sm:py-11">
      <p className="container-wide mb-6 text-center text-[10px] font-bold uppercase tracking-[0.32em] text-muted">{t("marquee.title")}</p>
      <Row brands={rowOne} />
      <Row brands={rowTwo.length > 0 ? rowTwo : rowOne} reverse />
    </section>
  );
}
