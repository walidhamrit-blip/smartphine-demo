import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { ShopShell } from "@/components/shop-filters";
import { IconArrow, IconSearch, Reveal } from "@/components/ui";
import { tr } from "@/lib/i18n";
import { getServerLang } from "@/lib/lang-server";
import { getBrands, getCategories, getProducts, type SortKey } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop all products",
  description: "Browse genuine smartphones, tablets, audio and accessories at MyPhone Tripoli.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const SORT_KEYS: SortKey[] = ["featured", "price-asc", "price-desc", "rating", "newest"];

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const lang = await getServerLang();
  const read = (key: string) => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const sortValue = read("sort");
  const sort = SORT_KEYS.includes(sortValue as SortKey) ? (sortValue as SortKey) : "featured";
  const page = Math.max(1, Number(read("page") ?? "1") || 1);
  const minValue = read("min");
  const maxValue = read("max");
  const category = read("category");
  const brand = read("brand");
  const query = read("q");

  const [result, categories, brands] = await Promise.all([
    getProducts({
      category,
      brand,
      q: query,
      min: minValue ? Number(minValue) : undefined,
      max: maxValue ? Number(maxValue) : undefined,
      sort,
      deals: read("deals") === "1",
      inStock: read("stock") === "1",
      page,
      perPage: 9,
    }),
    getCategories(),
    getBrands(),
  ]);

  const activeCategory = categories.find((item) => item.slug === category);
  const heading = activeCategory ? (lang === "ar" ? activeCategory.nameAr : activeCategory.nameEn) : tr(lang, "shop.title");
  const subheading = activeCategory ? (lang === "ar" ? activeCategory.taglineAr : activeCategory.taglineEn) : tr(lang, "shop.sub");

  const buildPageHref = (targetPage: number) => {
    const next = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (typeof value === "string" && key !== "page") next.set(key, value);
    }
    if (targetPage > 1) next.set("page", String(targetPage));
    const qs = next.toString();
    return qs ? `/shop?${qs}` : "/shop";
  };

  return (
    <div>
      <section className="relative overflow-hidden border-b border-line bg-ink py-14 text-[color:var(--page)] sm:py-20">
        <div className="absolute inset-0 opacity-[0.16]" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, #c9a468 0, transparent 45%), radial-gradient(circle at 80% 60%, #6e5fc0 0, transparent 40%)" }} />
        <div className="container-wide relative">
          <nav className="mb-4 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-white/45">
            <Link href="/" className="transition hover:text-white">
              {tr(lang, "nav.home")}
            </Link>
            <span>/</span>
            <span className="text-white/80">{activeCategory ? heading : tr(lang, "nav.shop")}</span>
          </nav>
          <h1 className="font-display text-4xl leading-tight sm:text-5xl lg:text-[3.6rem]">{heading}</h1>
          <p className="mt-3 max-w-xl text-sm text-white/65">{subheading}</p>
        </div>
      </section>

      <div className="container-wide py-8 sm:py-10">
        <ShopShell categories={categories} brands={brands} total={result.total}>
          {result.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-line bg-surface px-6 py-20 text-center">
              <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-2 text-gold">
                <IconSearch className="h-6 w-6" />
              </span>
              <p className="font-display text-2xl">{tr(lang, "shop.noResults")}</p>
              <p className="mt-2 max-w-sm text-sm text-muted">{tr(lang, "shop.noResultsHint")}</p>
              <Link href="/shop" className="btn btn-primary mt-6">
                {tr(lang, "shop.clear")}
                <IconArrow className="h-4 w-4 rtl:rotate-180" />
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
                {result.items.map((product, index) => (
                  <Reveal key={product.id} delay={index * 45}>
                    <ProductCard product={product} priority={index < 3} />
                  </Reveal>
                ))}
              </div>

              {result.pages > 1 ? (
                <nav className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6" aria-label="Pagination">
                  <p className="text-[12px] text-muted">
                    {tr(lang, "shop.showing", {
                      from: (result.page - 1) * 9 + 1,
                      to: Math.min(result.page * 9, result.total),
                      n: result.total,
                    })}
                  </p>
                  <div className="flex items-center gap-2">
                    {result.page > 1 ? (
                      <Link href={buildPageHref(result.page - 1)} className="chip">
                        {tr(lang, "shop.prev")}
                      </Link>
                    ) : null}
                    {Array.from({ length: result.pages }, (_, index) => index + 1).map((pageNumber) => (
                      <Link
                        key={pageNumber}
                        href={buildPageHref(pageNumber)}
                        className={`flex h-9 w-9 items-center justify-center rounded-full border text-xs font-bold transition ${
                          pageNumber === result.page ? "border-ink bg-ink text-[color:var(--page)]" : "border-line text-muted hover:border-gold hover:text-gold"
                        }`}
                        aria-current={pageNumber === result.page ? "page" : undefined}
                      >
                        {pageNumber}
                      </Link>
                    ))}
                    {result.page < result.pages ? (
                      <Link href={buildPageHref(result.page + 1)} className="chip">
                        {tr(lang, "shop.next")}
                      </Link>
                    ) : null}
                  </div>
                </nav>
              ) : null}
            </>
          )}
        </ShopShell>
      </div>
    </div>
  );
}
