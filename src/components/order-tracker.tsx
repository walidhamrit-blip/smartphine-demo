"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSite } from "@/components/site-provider";
import { IconArrow, IconSearch, IconWhatsApp } from "@/components/ui";
import { whatsappUrl } from "@/lib/site";

export function OrderTracker() {
  const { t, lang } = useSite();
  const router = useRouter();
  const [reference, setReference] = useState("");
  const [error, setError] = useState(false);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const value = reference.trim().toUpperCase();
    if (value.length < 4) {
      setError(true);
      return;
    }
    setError(false);
    router.push(`/order/${encodeURIComponent(value)}`);
  };

  return (
    <div className="mx-auto max-w-xl">
      <div className="rounded-[1.6rem] border border-line bg-surface p-6 sm:p-8">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-soft text-gold">
          <IconSearch className="h-5 w-5" />
        </span>
        <h2 className="mt-5 font-display text-2xl sm:text-3xl">{lang === "ar" ? "تابع طلبك" : "Track your order"}</h2>
        <p className="mt-2 text-[13px] leading-relaxed text-muted">
          {lang === "ar"
            ? "أدخل رقم الطلب الذي وصلك بعد إتمام الشراء (مثال: MP-261017-1234) لعرض التفاصيل والحالة."
            : "Enter the reference you received after checkout (for example MP-261017-1234) to see your items and status."}
        </p>
        <form onSubmit={submit} className="mt-5 flex flex-col gap-2 sm:flex-row">
          <input
            value={reference}
            onChange={(event) => setReference(event.target.value)}
            placeholder="MP-261017-1234"
            className="field font-mono text-[13px]!"
            dir="ltr"
            aria-label={t("checkout.orderRef")}
          />
          <button type="submit" className="btn btn-primary shrink-0">
            {lang === "ar" ? "عرض الطلب" : "View order"}
            <IconArrow className="h-4 w-4 rtl:rotate-180" />
          </button>
        </form>
        {error ? (
          <p className="mt-2 text-xs font-semibold text-red-500">
            {lang === "ar" ? "أدخل رقم طلب صحيح." : "Please enter a valid order reference."}
          </p>
        ) : null}
        <a
          href={whatsappUrl(lang === "ar" ? "مرحباً ماي فون، أريد متابعة حالة طلبي." : "Hello MyPhone, I'd like to follow up on my order.")}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-1.5 text-[12px] font-bold text-[#1faa5a]"
        >
          <IconWhatsApp className="h-4 w-4" />
          {lang === "ar" ? "أو تابع معنا على واتساب" : "Or follow up on WhatsApp"}
        </a>
      </div>
    </div>
  );
}
