import type { Metadata } from "next";
import { OrderTracker } from "@/components/order-tracker";
import { tr } from "@/lib/i18n";
import { getServerLang } from "@/lib/lang-server";

export const metadata: Metadata = { title: "Track your order" };

export default async function TrackPage() {
  const lang = await getServerLang();
  return (
    <div>
      <section className="border-b border-line bg-surface">
        <div className="container-wide py-10 sm:py-12">
          <p className="eyebrow">{tr(lang, "footer.support")}</p>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl">{tr(lang, "footer.track")}</h1>
          <p className="mt-2 max-w-xl text-sm text-muted">{tr(lang, "order.sub")}</p>
        </div>
      </section>
      <div className="container-wide py-10 sm:py-14">
        <OrderTracker />
      </div>
    </div>
  );
}
