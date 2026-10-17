import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { ProductGallery, ProductPurchase, ProductStory } from "@/components/product-detail";
import { ProductReviews } from "@/components/product-reviews";
import { IconArrow, Reveal, Stars } from "@/components/ui";
import { tr } from "@/lib/i18n";
import { getServerLang } from "@/lib/lang-server";
import { getProductBySlug, getProductReviews, getRelatedProducts } from "@/lib/store";
import { formatPrice, STORE } from "@/lib/site";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: `${product.nameEn} — ${formatPrice(product.price, "en")}`,
    description: product.taglineEn || product.descriptionEn.slice(0, 150),
    openGraph: { images: product.images.slice(0, 1) },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [reviews, related, lang] = await Promise.all([
    getProductReviews(product.id),
    getRelatedProducts(product.categorySlug, product.slug, 4),
    getServerLang(),
  ]);

  const name = lang === "ar" ? product.nameAr : product.nameEn;
  const categoryLabel =
    lang === "ar"
      ? { smartphones: "الهواتف الذكية", tablets: "الأجهزة اللوحية", audio: "الصوتيات", wearables: "الساعات الذكية", accessories: "الإكسسوارات" }[product.categorySlug] ?? product.categorySlug
      : { smartphones: "Smartphones", tablets: "Tablets", audio: "Sound & audio", wearables: "Wearables", accessories: "Accessories" }[product.categorySlug] ?? product.categorySlug;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    image: product.images,
    description: lang === "ar" ? product.descriptionAr : product.descriptionEn,
    brand: { "@type": "Brand", name: product.brandSlug },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating.toFixed(1),
      reviewCount: Math.max(1, product.reviewCount),
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "LYD",
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@type": "Store", name: STORE.name },
    },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="border-b border-line bg-surface">
        <nav className="container-wide flex items-center gap-2 overflow-x-auto py-3.5 text-[11px] uppercase tracking-[0.14em] text-muted">
          <Link href="/" className="shrink-0 transition hover:text-gold">
            {tr(lang, "nav.home")}
          </Link>
          <span>/</span>
          <Link href="/shop" className="shrink-0 transition hover:text-gold">
            {tr(lang, "product.breadcrumb")}
          </Link>
          <span>/</span>
          <Link href={`/shop?category=${product.categorySlug}`} className="shrink-0 transition hover:text-gold">
            {categoryLabel}
          </Link>
          <span>/</span>
          <span className="shrink-0 truncate text-ink">{name}</span>
        </nav>
      </div>

      <div className="container-wide py-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <ProductGallery product={product} />
          <ProductPurchase product={product} />
        </div>

        <ProductStory product={product} />

        <ProductReviews productId={product.id} initialReviews={reviews} />

        <section className="grid gap-8 border-t border-line py-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="eyebrow">{lang === "ar" ? "خدمة ماي فون" : "The MyPhone service"}</p>
            <h2 className="mt-2 font-display text-3xl leading-tight sm:text-4xl">
              {lang === "ar" ? "اشتري براحة بال" : "Buy with total peace of mind"}
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
              {lang === "ar"
                ? "كل جهاز نبيعه يمر بفحص من فريقنا. تصلك العلبة مغلقة ومختومة، مع فاتورة رسمية وبطاقة ضمان يمكنك استخدامها في أي مركز خدمة معتمد."
                : "Every device passes a check by our team before it leaves the store. You receive a sealed box, an official invoice and a warranty card valid at any authorised service centre."}
            </p>
            <div className="mt-5 flex items-center gap-2 text-[12px]">
              <Stars rating={product.rating} />
              <span className="font-bold">{product.rating.toFixed(1)}</span>
              <span className="text-muted">
                · {product.reviewCount} {tr(lang, "common.reviews")}
              </span>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { title: tr(lang, "trust.authentic.title"), desc: tr(lang, "trust.authentic.desc") },
              { title: tr(lang, "trust.delivery.title"), desc: tr(lang, "trust.delivery.desc") },
              { title: tr(lang, "trust.support.title"), desc: tr(lang, "trust.support.desc") },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-line bg-surface p-4">
                <p className="font-display text-lg leading-snug">{item.title}</p>
                <p className="mt-1.5 text-[11px] leading-relaxed text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {related.length > 0 ? (
          <section className="border-t border-line pt-12">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="eyebrow">{categoryLabel}</p>
                <h2 className="mt-2 font-display text-3xl">{tr(lang, "product.related")}</h2>
              </div>
              <Link href={`/shop?category=${product.categorySlug}`} className="btn btn-outline">
                {tr(lang, "common.viewAll")}
                <IconArrow className="h-4 w-4 rtl:rotate-180" />
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {related.map((item, index) => (
                <Reveal key={item.id} delay={index * 60}>
                  <ProductCard product={item} />
                </Reveal>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
