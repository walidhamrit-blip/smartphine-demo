import { BrandLogo } from "@/components/brand-logo";
import { brandLogos } from "@/lib/brand-logos";
import { seedBrands } from "@/lib/catalog-data";

/**
 * Display name for a brand slug.
 *
 * Products only store `brand_slug`, so the label used to be the raw slug
 * ("apple", "sandisk"). The logo entry and the seeded catalogue both carry the
 * properly cased name, which we reuse everywhere a brand is mentioned.
 */
export function brandName(slug: string): string {
  const seeded = seedBrands.find((brand) => brand.slug === slug);
  if (seeded) return seeded.name;
  return brandLogos[slug]?.title ?? slug;
}

/**
 * Small "logo + brand name" line, used on product cards and product pages.
 * `muted` renders the mark in ink (mono) instead of the brand colour, which
 * reads better next to body text.
 */
export function BrandLine({
  slug,
  muted = false,
  className = "",
}: {
  slug: string;
  muted?: boolean;
  className?: string;
}) {
  const name = brandName(slug);
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <BrandLogo slug={slug} name={name} height={13} colored={!muted} className={muted ? "text-muted" : ""} />
      <span className="text-[10px] font-bold uppercase tracking-[0.18em]">{name}</span>
    </span>
  );
}
