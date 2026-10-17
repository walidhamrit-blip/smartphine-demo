import Image from "next/image";
import Link from "next/link";
import { DeleteProductButton } from "@/components/admin-buttons";
import { IconPlus } from "@/components/ui";
import { tr } from "@/lib/i18n";
import { getServerLang } from "@/lib/lang-server";
import { getAllProducts } from "@/lib/store";
import { formatPrice } from "@/lib/site";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function AdminProductsPage({ searchParams }: PageProps) {
  await requireAdmin();
  const [products, lang, params] = await Promise.all([getAllProducts(), getServerLang(), searchParams]);
  const saved = params.saved === "1";
  const deleted = params.deleted === "1";

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">{tr(lang, "admin.title")}</p>
          <h1 className="mt-1 font-display text-3xl">{tr(lang, "admin.products")}</h1>
          <p className="mt-1 text-[12px] text-muted">{products.length} {tr(lang, "admin.productsCount")}</p>
        </div>
        <Link href="/admin/products/new" className="btn btn-primary py-2.5! text-[12px]">
          <IconPlus className="h-4 w-4" />
          {tr(lang, "admin.newProduct")}
        </Link>
      </div>

      {saved || deleted ? (
        <p className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-[12px] font-semibold text-emerald-600 dark:text-emerald-400">
          {saved ? tr(lang, "admin.saved") : tr(lang, "common.delete")}
        </p>
      ) : null}

      <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-page">
        <div className="hidden grid-cols-[2.5fr_1fr_0.8fr_0.8fr_auto] gap-3 border-b border-line px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-muted md:grid">
          <span>{tr(lang, "admin.products")}</span>
          <span>{tr(lang, "shop.category")}</span>
          <span>{tr(lang, "admin.price")}</span>
          <span>{tr(lang, "admin.stock")}</span>
          <span className="text-end">{tr(lang, "admin.actions")}</span>
        </div>
        <div className="divide-y divide-line">
          {products.map((product) => (
            <div key={product.id} className="grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-3 md:grid-cols-[2.5fr_1fr_0.8fr_0.8fr_auto]">
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative h-11 w-10 shrink-0 overflow-hidden rounded-lg bg-surface-2">
                  <Image src={product.images[0] ?? "/images/hero-phone.jpg"} alt="" fill sizes="40px" className="object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[12.5px] font-bold">{lang === "ar" ? product.nameAr : product.nameEn}</p>
                  <p className="truncate text-[10px] text-muted">
                    {product.brandSlug} · {product.slug}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {product.featured ? <span className="rounded bg-gold-soft px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-gold">featured</span> : null}
                    {product.deal ? <span className="rounded bg-red-500/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-red-500">sale</span> : null}
                    {product.isNew ? <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-emerald-600">new</span> : null}
                  </div>
                </div>
              </div>
              <span className="hidden truncate text-[11px] capitalize text-muted md:block">{product.categorySlug}</span>
              <span className="hidden text-[12px] font-semibold md:block">{formatPrice(product.price, lang)}</span>
              <span className="hidden md:block">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${product.stock === 0 ? "bg-red-500/10 text-red-500" : product.stock <= 10 ? "bg-gold-soft text-gold" : "bg-surface-2 text-muted"}`}>
                  {product.stock}
                </span>
              </span>
              <div className="flex items-center justify-end gap-1.5">
                <Link href={`/admin/products/${product.id}`} className="rounded-full border border-line px-2.5 py-1 text-[10px] font-bold transition hover:border-gold hover:text-gold">
                  {tr(lang, "common.edit")}
                </Link>
                <DeleteProductButton id={product.id} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
