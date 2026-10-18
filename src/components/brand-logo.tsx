import { brandLogos } from "@/lib/brand-logos";

/**
 * Real brand marks rendered as inline SVG.
 *
 * Inline (instead of `<img src="/brands/*.svg">`) so the artwork:
 *  - never 404s when an admin adds a brand through the console,
 *  - inherits `currentColor`/brand colour in both light and dark mode,
 *  - costs no extra network request inside the animated ribbons.
 *
 * When a slug has no known artwork we fall back to the brand's text monogram,
 * so the ribbon always shows something clean.
 */

export function hasBrandLogo(slug?: string | null) {
  return Boolean(slug && brandLogos[slug]);
}

type Props = {
  slug?: string | null;
  name: string;
  monogram?: string | null;
  accent?: string | null;
  /** Optical height of the mark: a px number or any CSS length (`clamp()`, var…). */
  height?: number | string;
  /** Force the brand's own colour instead of inheriting `currentColor`. */
  colored?: boolean;
  className?: string;
  titleId?: string;
};

export function BrandLogo({
  slug,
  name,
  monogram,
  accent,
  height = 26,
  colored = true,
  className = "",
  titleId,
}: Props) {
  const logo = slug ? brandLogos[slug] : undefined;

  if (!logo) {
    const color = accent || "currentColor";
    return (
      <span
        className={`flex shrink-0 items-center justify-center rounded-full border text-[11px] font-black ${className}`}
        style={{
          height,
          width: height,
          borderColor: `${color}55`,
          color,
          backgroundColor: `${color}12`,
        }}
        aria-hidden={titleId ? undefined : true}
      >
        {monogram || name.slice(0, 1)}
      </span>
    );
  }

  const fill = colored ? logo.color : "currentColor";

  return (
    <svg
      role="img"
      aria-labelledby={titleId}
      aria-hidden={titleId ? undefined : true}
      focusable="false"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`.trim()}
      style={{ height, width: height, color: fill }}
    >
      {titleId ? <title id={titleId}>{logo.title || name}</title> : null}
      {logo.paths.map((d, index) => (
        <path key={index} d={d} fill="currentColor" />
      ))}
    </svg>
  );
}
