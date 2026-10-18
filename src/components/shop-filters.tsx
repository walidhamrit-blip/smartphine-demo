"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type ReactNode } from "react";
import { useSite } from "@/components/site-provider";
import { BrandLogo } from "@/components/brand-logo";
import { IconClose, IconFilter, IconSliders, IconWhatsApp } from "@/components/ui";
import type { DictKey } from "@/lib/i18n";
import type { Brand, Category } from "@/db/schema";
import { whatsappUrl } from "@/lib/site";

type Props = {
  categories: Category[];
  brands: Brand[];
  total: number;
  children: ReactNode;
};

const PRICE_PRESETS: { id: string; label: DictKey; min?: number; max?: number }[] = [
  { id: "u250", label: "shop.under250", max: 250 },
  { id: "250-750", label: "shop.250to750", min: 250, max: 750 },
  { id: "750-2000", label: "shop.750to2000", min: 750, max: 2000 },
  { id: "2000", label: "shop.above2000", min: 2000 },
];

const SORTS: { id: string; label: DictKey }[] = [
  { id: "featured", label: "shop.sort.featured" },
  { id: "price-asc", label: "shop.sort.priceAsc" },
  { id: "price-desc", label: "shop.sort.priceDesc" },
  { id: "rating", label: "shop.sort.rating" },
  { id: "newest", label: "shop.sort.newest" },
];

export function ShopShell({ categories, brands, total, children }: Props) {
  const { t, lang } = useSite();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const category = searchParams.get("category") ?? "";
  const brand = searchParams.get("brand") ?? "";
  const sort = searchParams.get("sort") ?? "featured";
  const min = searchParams.get("min");
  const max = searchParams.get("max");
  const deals = searchParams.get("deals") === "1";
  const stock = searchParams.get("stock") === "1";
  const query = searchParams.get("q") ?? "";

  const update = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "") params.delete(key);
      else params.set(key, value);
    }
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `/shop?${qs}` : "/shop", { scroll: false });
  };

  const activeCount = [category, brand, min, max, deals ? "1" : "", stock ? "1" : "", query].filter(Boolean).length;
  const priceLabel = (() => {
    const preset = PRICE_PRESETS.find((item) => String(item.min ?? "") === (min ?? "") && String(item.max ?? "") === (max ?? ""));
    return preset ? t(preset.label) : null;
  })();

  const filtersUi = (
    <div className="space-y-6">
      <div>
        <p className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-muted">{t("shop.category")}</p>
        <div className="flex flex-wrap gap-1.5">
          <button type="button" onClick={() => update({ category: null })} className={`chip ${!category ? "chip-active" : ""}`}>
            {t("common.all")}
          </button>
          {categories.map((item) => (
            <button
              key={item.slug}
              type="button"
              onClick={() => update({ category: category === item.slug ? null : item.slug })}
              className={`chip ${category === item.slug ? "chip-active" : ""}`}
            >
              {lang === "ar" ? item.nameAr : item.nameEn}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-muted">{t("shop.brand")}</p>
        <div className="flex flex-wrap gap-1.5">
          {brands.map((item) => (
            <button
              key={item.slug}
              type="button"
              onClick={() => update({ brand: brand === item.slug ? null : item.slug })}
              className={`chip ${brand === item.slug ? "chip-active" : ""}`}
            >
              <BrandLogo
                slug={item.slug}
                name={item.name}
                monogram={item.monogram}
                accent={item.accent}
                height={14}
                colored={brand !== item.slug}
              />
              {item.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-muted">{t("shop.price")}</p>
        <div className="flex flex-wrap gap-1.5">
          {PRICE_PRESETS.map((preset) => {
            const active = priceLabel === t(preset.label);
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() =>
                  update({
                    min: active ? null : preset.min !== undefined ? String(preset.min) : null,
                    max: active ? null : preset.max !== undefined ? String(preset.max) : null,
                  })
                }
                className={`chip ${active ? "chip-active" : ""}`}
              >
                {t(preset.label)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3 border-t border-line pt-5">
        <label className="flex cursor-pointer items-center justify-between gap-3 text-[13px] font-semibold">
          {t("shop.inStockOnly")}
          <input
            type="checkbox"
            checked={stock}
            onChange={(event) => update({ stock: event.target.checked ? "1" : null })}
            className="h-4 w-4 accent-[var(--gold)]"
          />
        </label>
        <label className="flex cursor-pointer items-center justify-between gap-3 text-[13px] font-semibold">
          {t("shop.dealsOnly")}
          <input
            type="checkbox"
            checked={deals}
            onChange={(event) => update({ deals: event.target.checked ? "1" : null })}
            className="h-4 w-4 accent-[var(--gold)]"
          />
        </label>
      </div>

      <a
        href={whatsappUrl(
          lang === "ar" ? "مرحباً ماي فون، أبحث عن جهاز محدد ولم أجده في المتجر." : "Hello MyPhone, I'm looking for a specific device I couldn't find in the shop.",
        )}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-start gap-2.5 rounded-2xl border border-line bg-surface p-3.5 text-[12px] leading-relaxed text-muted transition hover:border-gold"
      >
        <IconWhatsApp className="mt-0.5 h-4 w-4 shrink-0 text-[#1faa5a]" />
        <span>
          <span className="block font-bold text-ink">{lang === "ar" ? "لم تجد ما تبحث عنه؟" : "Can't find what you need?"}</span>
          {lang === "ar" ? "راسلنا على واتساب وسنوفره لك." : "Message us — we can source almost anything."}
        </span>
      </a>

      {activeCount > 0 ? (
        <button
          type="button"
          onClick={() => router.push("/shop", { scroll: false })}
          className="w-full rounded-full border border-line py-2.5 text-xs font-bold uppercase tracking-widest text-muted transition hover:border-gold hover:text-gold"
        >
          {t("shop.clear")}
        </button>
      ) : null}
    </div>
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setMobileOpen(true)} className="chip lg:hidden">
            <IconFilter className="h-4 w-4" />
            {t("shop.filters")}
            {activeCount > 0 ? <span className="rounded-full bg-gold px-1.5 text-[10px] text-white">{activeCount}</span> : null}
          </button>
          <p className="text-[12px] font-semibold text-muted">{t("shop.results", { n: total })}</p>
          {query ? (
            <span className="hidden items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-semibold sm:inline-flex">
              “{query}”
              <button type="button" onClick={() => update({ q: null })} aria-label={t("shop.clear")}>
                <IconClose className="h-3 w-3" />
              </button>
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <IconSliders className="h-4 w-4 text-muted" />
          <select value={sort} onChange={(event) => update({ sort: event.target.value })} className="field w-auto! py-2! text-xs font-semibold" aria-label={t("shop.sort")}>
            {SORTS.map((option) => (
              <option key={option.id} value={option.id}>
                {t(option.label)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {activeCount > 0 ? (
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">{t("shop.applied")}</span>
          {category ? (
            <button type="button" className="chip chip-active" onClick={() => update({ category: null })}>
              {categories.find((item) => item.slug === category)?.[lang === "ar" ? "nameAr" : "nameEn"] ?? category}
              <IconClose className="h-3 w-3" />
            </button>
          ) : null}
          {brand ? (
            <button type="button" className="chip chip-active" onClick={() => update({ brand: null })}>
              {brands.find((item) => item.slug === brand)?.name ?? brand}
              <IconClose className="h-3 w-3" />
            </button>
          ) : null}
          {priceLabel ? (
            <button type="button" className="chip chip-active" onClick={() => update({ min: null, max: null })}>
              {priceLabel}
              <IconClose className="h-3 w-3" />
            </button>
          ) : null}
          {deals ? (
            <button type="button" className="chip chip-active" onClick={() => update({ deals: null })}>
              {t("shop.dealsOnly")}
              <IconClose className="h-3 w-3" />
            </button>
          ) : null}
          {stock ? (
            <button type="button" className="chip chip-active" onClick={() => update({ stock: null })}>
              {t("shop.inStockOnly")}
              <IconClose className="h-3 w-3" />
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-line bg-surface p-5">
            <p className="mb-5 flex items-center gap-2 font-display text-xl">
              <IconSliders className="h-4 w-4 text-gold" />
              {t("shop.filters")}
            </p>
            {filtersUi}
          </div>
        </aside>
        <div>{children}</div>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="drawer-panel is-open absolute inset-y-0 end-0 w-[88%] max-w-sm overflow-y-auto bg-page p-5">
            <div className="mb-5 flex items-center justify-between">
              <p className="font-display text-2xl">{t("shop.filters")}</p>
              <button type="button" onClick={() => setMobileOpen(false)} className="rounded-full border border-line p-2" aria-label={t("common.close")}>
                <IconClose className="h-4 w-4" />
              </button>
            </div>
            {filtersUi}
            <button type="button" onClick={() => setMobileOpen(false)} className="btn btn-primary mt-6 w-full">
              {t("shop.results", { n: total })}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
