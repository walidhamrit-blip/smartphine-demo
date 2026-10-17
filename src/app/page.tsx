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
import { getAllProducts, getBrands, getCategories, getTestimonials } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, brands, allProducts, testimonials] = await Promise.all([
    getCategories(),
    getBrands(),
    getAllProducts(),
    getTestimonials(3),
  ]);

  const counts = allProducts.reduce<Record<string, number>>((acc, product) => {
    acc[product.categorySlug] = (acc[product.categorySlug] ?? 0) + 1;
    return acc;
  }, {});

  const featured = allProducts
    .filter((product) => product.featured)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 8);

  const newArrivals = allProducts.filter((product) => product.isNew).slice(0, 4);

  const deals = allProducts
    .filter((product) => product.deal)
    .sort((a, b) => {
      const discountA = a.compareAtPrice ? 1 - a.price / a.compareAtPrice : 0;
      const discountB = b.compareAtPrice ? 1 - b.price / b.compareAtPrice : 0;
      return discountB - discountA;
    })
    .slice(0, 4);

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
