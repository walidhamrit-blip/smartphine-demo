"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { useSite } from "@/components/site-provider";

export type MarqueeBrand = { slug: string; name: string; accent: string; monogram: string };

/** Optical height of a ribbon logo: bigger on desktop, trimmed on mobile. */
const LOGO_SIZE = "var(--brand-logo-h, 34px)";

/**
 * One ribbon cell: the brand's real logo, in its own colours.
 * The wordmark is kept as accessible text (visually hidden) so screen readers
 * and search engines still know which brand is displayed.
 */
function BrandPill({ brand, titleId }: { brand: MarqueeBrand; titleId?: string }) {
  return (
    <div className="group flex shrink-0 items-center gap-3 px-6 py-2 sm:gap-4 sm:px-9" title={brand.name}>
      <span className="flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
        <BrandLogo
          slug={brand.slug}
          name={brand.name}
          monogram={brand.monogram}
          accent={brand.accent}
          height={LOGO_SIZE}
          titleId={titleId}
        />
      </span>
      <span className="sr-only">{brand.name}</span>
      <span className="h-1 w-1 shrink-0 rounded-full bg-gold/50 transition group-hover:bg-gold" />
    </div>
  );
}

function Copies({ brands, count, withTitles }: { brands: MarqueeBrand[]; count: number; withTitles?: boolean }) {
  return (
    <>
      {Array.from({ length: count }, (_, copy) => (
        <div className="flex items-center" key={copy} aria-hidden={withTitles ? undefined : true}>
          {brands.map((brand, index) => (
            <BrandPill
              key={`${copy}-${brand.slug}-${index}`}
              brand={brand}
              titleId={withTitles && copy === 0 ? `marquee-logo-${brand.slug}-${index}` : undefined}
            />
          ))}
        </div>
      ))}
    </>
  );
}

function Row({ brands, reverse, hidden }: { brands: MarqueeBrand[]; reverse?: boolean; hidden?: boolean }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  // A row holding fewer logos than the viewport is wider than the screen used to
  // scroll past an empty gap. The group is now repeated until it overflows the
  // viewport, which keeps both halves of the track identical: the CSS animation
  // still loops seamlessly on its -50% translation.
  const [copies, setCopies] = useState(2);

  useEffect(() => {
    const viewport = viewportRef.current;
    const group = groupRef.current;
    if (!viewport || !group) return;

    const measure = () => {
      const groupWidth = group.scrollWidth;
      if (groupWidth <= 0) return;
      const needed = Math.ceil(viewport.clientWidth / groupWidth) + 1;
      setCopies(Math.max(2, needed));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(group);
    return () => observer.disconnect();
  }, [brands.length]);

  return (
    <div ref={viewportRef} className="marquee-viewport py-1" aria-hidden={hidden ? true : undefined}>
      <div className={`marquee-track ${reverse ? "reverse" : ""}`}>
        {/* Measuring pass: laid out (so it reports a real width) but never painted. */}
        <div ref={groupRef} className="h-0 w-max shrink-0 overflow-hidden" aria-hidden>
          <div className="flex w-max items-center">
            {brands.map((brand, index) => (
              <BrandPill key={`measure-${brand.slug}-${index}`} brand={brand} />
            ))}
          </div>
        </div>
        <div className="contents">
          <Copies brands={brands} count={Math.ceil(copies / 2)} withTitles={!hidden} />
        </div>
        <div className="contents">
          <Copies brands={brands} count={Math.ceil(copies / 2)} />
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
    <section
      className="border-y border-line bg-surface py-10 sm:py-12"
      style={{ "--brand-logo-h": "clamp(32px, 3.2vw, 42px)" } as CSSProperties}
    >
      <p className="container-wide mb-7 text-center text-[10px] font-bold uppercase tracking-[0.32em] text-muted">{t("marquee.title")}</p>
      <Row brands={rowOne} />
      <Row brands={rowTwo.length > 0 ? rowTwo : rowOne} reverse hidden />
    </section>
  );
}
