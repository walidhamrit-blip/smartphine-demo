import { notFound } from "next/navigation";
import { AdminProductForm } from "@/components/admin-product-form";
import { tr } from "@/lib/i18n";
import { getServerLang } from "@/lib/lang-server";
import { getBrands, getCategories, getProductForEdit } from "@/lib/store";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: PageProps) {
  await requireAdmin();
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isFinite(productId)) notFound();

  const [product, categories, brands, lang] = await Promise.all([
    getProductForEdit(productId),
    getCategories(),
    getBrands(),
    getServerLang(),
  ]);

  if (!product) notFound();

  return (
    <div>
      <p className="eyebrow">{lang === "ar" ? product.nameAr : product.nameEn}</p>
      <h1 className="mt-1 font-display text-3xl">{tr(lang, "admin.editProduct")}</h1>
      <div className="mt-5">
        <AdminProductForm categories={categories} brands={brands} lang={lang} product={product} />
      </div>
    </div>
  );
}
