import { AdminProductForm } from "@/components/admin-product-form";
import { tr } from "@/lib/i18n";
import { getServerLang } from "@/lib/lang-server";
import { getBrands, getCategories } from "@/lib/store";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  await requireAdmin();
  const [categories, brands, lang] = await Promise.all([getCategories(), getBrands(), getServerLang()]);
  return (
    <div>
      <p className="eyebrow">{tr(lang, "admin.products")}</p>
      <h1 className="mt-1 font-display text-3xl">{tr(lang, "admin.newProduct")}</h1>
      <div className="mt-5">
        <AdminProductForm categories={categories} brands={brands} lang={lang} />
      </div>
    </div>
  );
}
