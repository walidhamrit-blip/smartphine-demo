"use client";

import { BrandLogo } from "@/components/brand-logo";
import { useSite } from "@/components/site-provider";

export type MarqueeBrand = { slug: string; name: string; accent: string; monogram: string };

/**
 * One ribbon cell: the brand's real logo, in its own colours.
 * The wordmark is kept as accessible text (visually hidden) so screen readers
 * and search engines still know which brand is displayed.
 */
function BrandPill({ brand, titleId }: { brand: MarqueeBrand; titleId?: string }) {
  return (
    <div className="group flex shrink-0 items-center gap-3 px-7 py-2 sm:px-10" title={brand.name}>
      <span className="flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
        <BrandLogo
          slug={brand.slug}
          name={brand.name}
          monogram={brand.monogram}
          accent={brand.accent}
          height={26}
          titleId={titleId}
        />
      </span>
      <span className="sr-only">{brand.name}</span>
      <span className="ms-2 h-1 w-1 rounded-full bg-gold/50 transition group-hover:bg-gold" />
    </div>
  );
}

function Row({ brands, reverse, hidden }: { brands: MarqueeBrand[]; reverse?: boolean; hidden?: boolean }) {
  return (
    <div className="marquee-viewport py-1" aria-hidden={hidden ? true : undefined}>
      <div className={`marquee-track ${reverse ? "reverse" : ""}`}>
        <div className="flex items-center">
          {brands.map((brand, index) => (
            <BrandPill
              key={`a-${brand.slug}-${index}`}
              brand={brand}
              titleId={hidden ? undefined : `marquee-logo-${brand.slug}-${index}`}
            />
          ))}
        </div>
        <div className="flex items-center">
          {brands.map((brand, index) => (
            <BrandPill key={`b-${brand.slug}-${index}`} brand={brand} />
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
      <Row brands={rowTwo.length > 0 ? rowTwo : rowOne} reverse hidden />
    </section>
  );
}
