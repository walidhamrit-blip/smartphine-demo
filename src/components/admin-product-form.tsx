import Link from "next/link";
import { saveProductAction } from "@/app/admin/actions";
import { tr } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";
import type { Brand, Category } from "@/db/schema";
import type { ProductView } from "@/lib/store";

type Props = {
  categories: Category[];
  brands: Brand[];
  lang: Lang;
  product?: ProductView;
};

export function AdminProductForm({ categories, brands, lang, product }: Props) {
  const isEdit = Boolean(product);
  const colorsValue = product?.colors.map((color) => `${color.name.en} | ${color.name.ar} | ${color.hex}`).join("\n") ?? "";
  const specsValue = product?.specs.map((spec) => `${spec.label.en} | ${spec.label.ar} | ${spec.value.en} | ${spec.value.ar}`).join("\n") ?? "";

  return (
    <form action={saveProductAction} className="space-y-5">
      {isEdit ? <input type="hidden" name="id" value={product?.id} /> : null}

      <div className="rounded-2xl border border-line bg-page p-5">
        <h2 className="font-display text-xl">{tr(lang, "admin.nameEn")} / {tr(lang, "admin.nameAr")}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-muted">{tr(lang, "admin.nameEn")}</span>
            <input name="nameEn" defaultValue={product?.nameEn ?? ""} required className="field" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-muted">{tr(lang, "admin.nameAr")}</span>
            <input name="nameAr" defaultValue={product?.nameAr ?? ""} required className="field" dir="rtl" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-muted">{tr(lang, "admin.slug")}</span>
            <input name="slug" defaultValue={product?.slug ?? ""} className="field" placeholder="iphone-15-pro" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-muted">{tr(lang, "admin.brand")}</span>
            <select name="brandSlug" defaultValue={product?.brandSlug ?? "apple"} className="field">
              {brands.map((brand) => (
                <option key={brand.slug} value={brand.slug}>
                  {brand.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-muted">{tr(lang, "admin.taglineEn")}</span>
            <input name="taglineEn" defaultValue={product?.taglineEn ?? ""} className="field" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-muted">{tr(lang, "admin.taglineAr")}</span>
            <input name="taglineAr" defaultValue={product?.taglineAr ?? ""} className="field" dir="rtl" />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-muted">{tr(lang, "admin.descEn")}</span>
            <textarea name="descriptionEn" defaultValue={product?.descriptionEn ?? ""} className="field min-h-[90px]" />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-muted">{tr(lang, "admin.descAr")}</span>
            <textarea name="descriptionAr" defaultValue={product?.descriptionAr ?? ""} className="field min-h-[90px]" dir="rtl" />
          </label>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-page p-5">
        <h2 className="font-display text-xl">{tr(lang, "admin.price")}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block">
            <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-muted">{tr(lang, "admin.price")}</span>
            <input name="price" type="number" min="0" step="0.01" defaultValue={product?.price ?? ""} required className="field" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-muted">{tr(lang, "admin.compareAt")}</span>
            <input name="compareAtPrice" type="number" min="0" step="0.01" defaultValue={product?.compareAtPrice ?? ""} className="field" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-muted">{tr(lang, "admin.stock")}</span>
            <input name="stock" type="number" min="0" defaultValue={product?.stock ?? 10} className="field" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-muted">{tr(lang, "shop.category")}</span>
            <select name="categorySlug" defaultValue={product?.categorySlug ?? "smartphones"} className="field">
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {lang === "ar" ? category.nameAr : category.nameEn}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-4 flex flex-wrap gap-5 text-[11px] font-bold uppercase tracking-widest text-muted">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="featured" defaultChecked={product?.featured ?? false} className="h-4 w-4 accent-[var(--gold)]" />
            {tr(lang, "admin.featured")}
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="deal" defaultChecked={product?.deal ?? false} className="h-4 w-4 accent-[var(--gold)]" />
            {tr(lang, "admin.deal")}
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isNew" defaultChecked={product?.isNew ?? false} className="h-4 w-4 accent-[var(--gold)]" />
            {tr(lang, "admin.isNew")}
          </label>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-page p-5">
        <h2 className="font-display text-xl">{tr(lang, "admin.images")}</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-muted">{tr(lang, "admin.images")}</span>
            <textarea name="images" defaultValue={product?.images.join("\n") ?? "/images/hero-phone.jpg"} className="field min-h-[110px] font-mono text-[11px]!" dir="ltr" />
          </label>
          <div className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-muted">{tr(lang, "admin.storages")}</span>
              <input name="storages" defaultValue={product?.storages.join(", ") ?? ""} className="field" placeholder="128GB, 256GB" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-muted">{tr(lang, "admin.colors")}</span>
              <textarea name="colors" defaultValue={colorsValue} className="field min-h-[70px] text-[11px]!" placeholder="Black | أسود | #111111" />
            </label>
          </div>
        </div>
        <label className="mt-4 block">
          <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-muted">Specs (Label EN | Label AR | Value EN | Value AR)</span>
          <textarea name="specs" defaultValue={specsValue} className="field min-h-[90px] text-[11px]!" placeholder="Display | الشاشة | 6.7&quot; OLED | 6.7 بوصة" />
        </label>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-muted">Badge EN</span>
            <input name="badgeEn" defaultValue={product?.badgeEn ?? ""} className="field" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-muted">Badge AR</span>
            <input name="badgeAr" defaultValue={product?.badgeAr ?? ""} className="field" dir="rtl" />
          </label>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="submit" className="btn btn-primary">
          {tr(lang, "admin.saveProduct")}
        </button>
        <Link href="/admin/products" className="btn btn-outline">
          {tr(lang, "admin.backToList")}
        </Link>
      </div>
    </form>
  );
}
