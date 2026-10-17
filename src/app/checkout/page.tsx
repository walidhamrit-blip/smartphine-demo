import type { Metadata } from "next";
import { CheckoutFlow } from "@/components/checkout-flow";
import { tr } from "@/lib/i18n";
import { getServerLang } from "@/lib/lang-server";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const lang = await getServerLang();
  return (
    <div>
      <section className="border-b border-line bg-surface">
        <div className="container-wide py-10 sm:py-12">
          <p className="eyebrow">{tr(lang, "nav.shop")}</p>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl">{tr(lang, "checkout.title")}</h1>
          <p className="mt-2 text-sm text-muted">{tr(lang, "checkout.sub")}</p>
        </div>
      </section>
      <div className="container-wide py-8 sm:py-10">
        <CheckoutFlow />
      </div>
    </div>
  );
}
