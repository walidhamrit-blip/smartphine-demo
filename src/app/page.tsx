import { HeroSlider } from "@/components/hero-slider";
import { BrandMarquee } from "@/components/brand-marquee";
import {
  CategoryGrid,
  DealsSection,
  ProductRail,
  PromoBlock,
  Testimonials,
  TrustStrip,
  WhatsAppCta,
} from "@/components/home-sections";
import {
  getBrands,
  getCategories,
  getCategoryCounts,
  getDealProducts,
  getFeaturedProducts,
  getNewProducts,
  getTestimonials,
} from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Targeted, parallel, LIMIT-capped queries: pulling the whole products table
  // (descriptions and spec JSON included) to filter it in JavaScript made every
  // cold hit on the deployed storefront noticeably slow.
  const [categories, brands, counts, featured, newArrivals, deals, testimonials] = await Promise.all([
    getCategories(),
    getBrands(),
    getCategoryCounts(),
    getFeaturedProducts(8),
    getNewProducts(4),
    getDealProducts(4),
    getTestimonials(3),
  ]);

  const marqueeBrands = brands.map((brand) => ({ name: brand.name, accent: brand.accent, monogram: brand.monogram }));

  return (
    <>
      <HeroSlider />
      <TrustStrip />
      <CategoryGrid categories={categories} counts={counts} />
      <BrandMarquee brands={marqueeBrands} />
      <ProductRail products={featured} eyebrowKey="featured.eyebrow" titleKey="featured.title" subKey="featured.sub" />
      <PromoBlock />
      {newArrivals.length > 0 ? (
        <ProductRail products={newArrivals} eyebrowKey="new.eyebrow" titleKey="new.title" href="/shop?sort=newest" />
      ) : null}
      {deals.length > 0 ? <DealsSection products={deals} /> : null}
      <Testimonials reviews={testimonials} />
      <WhatsAppCta />
    </>
  );
}
