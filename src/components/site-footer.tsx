"use client";

import Link from "next/link";
import { useState } from "react";
import { useSite } from "@/components/site-provider";
import { IconArrow, IconCheck, IconInstagram, IconMapPin, IconWhatsApp } from "@/components/ui";
import { STORE, whatsappUrl } from "@/lib/site";

const SHOP_LINKS = [
  { href: "/shop?category=smartphones", labelEn: "Smartphones", labelAr: "الهواتف الذكية" },
  { href: "/shop?category=tablets", labelEn: "Tablets", labelAr: "الأجهزة اللوحية" },
  { href: "/shop?category=audio", labelEn: "Sound & audio", labelAr: "الصوتيات" },
  { href: "/shop?category=wearables", labelEn: "Wearables", labelAr: "الساعات الذكية" },
  { href: "/shop?category=accessories", labelEn: "Accessories", labelAr: "الإكسسوارات" },
  { href: "/shop?deals=1", labelEn: "Deals", labelAr: "العروض" },
];

export function SiteFooter() {
  const { t, lang } = useSite();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const supportLinks = [
    { href: "/shop", label: t("footer.shipping") },
    { href: "/shop", label: t("footer.warranty") },
    { href: "/track", label: t("footer.track") },
    { href: "/shop", label: t("footer.faq") },
  ];

  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="container-wide py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-[color:var(--page)]">
                <span className="font-display text-[22px] leading-none">M</span>
                <span className="absolute -end-0.5 -top-0.5 h-2 w-2 rounded-full bg-gold" />
              </span>
              <span className="font-display text-[26px]">MyPhone</span>
            </Link>
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-muted">{t("footer.about")}</p>
            <div className="mt-5 flex items-center gap-2">
              <a
                href={whatsappUrl("Hello MyPhone!")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition hover:border-gold hover:text-gold"
                aria-label="WhatsApp"
              >
                <IconWhatsApp className="h-4 w-4" />
              </a>
              <a
                href={STORE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition hover:border-gold hover:text-gold"
                aria-label="Instagram"
              >
                <IconInstagram className="h-4 w-4" />
              </a>
              <span className="ms-1 text-[11px] font-semibold uppercase tracking-widest text-muted">@myphone.ly</span>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-ink">{t("footer.shop")}</h3>
            <ul className="space-y-2.5">
              {SHOP_LINKS.map((link) => (
                <li key={link.href + link.labelEn}>
                  <Link href={link.href} className="text-[13px] text-muted transition hover:text-gold">
                    {lang === "ar" ? link.labelAr : link.labelEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-ink">{t("footer.support")}</h3>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-[13px] text-muted transition hover:text-gold">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-ink">{t("footer.contact")}</h3>
            <ul className="space-y-3 text-[13px] text-muted">
              <li className="flex items-start gap-2">
                <IconMapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>{lang === "ar" ? STORE.address.ar : STORE.address.en}</span>
              </li>
              <li className="flex items-start gap-2">
                <IconWhatsApp className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <a href={whatsappUrl("Hello MyPhone!")} target="_blank" rel="noopener noreferrer" className="transition hover:text-gold">
                  {STORE.whatsappDisplay}
                </a>
              </li>
              <li>{lang === "ar" ? STORE.hours.ar : STORE.hours.en}</li>
              <li className="text-[11px] uppercase tracking-widest">{t("footer.payment")}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 grid gap-5 rounded-3xl border border-line bg-page p-6 md:grid-cols-[1.1fr_1fr] md:items-center md:p-8">
          <div>
            <h3 className="font-display text-2xl sm:text-[28px]">{t("footer.newsletter")}</h3>
            <p className="mt-2 text-[13px] text-muted">{t("footer.newsletterDesc")}</p>
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (!email.includes("@")) return;
              setSubscribed(true);
              setEmail("");
            }}
            className="flex flex-col gap-2 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={t("footer.emailPlaceholder")}
              className="field"
              aria-label={t("footer.emailPlaceholder")}
            />
            <button type="submit" className="btn btn-primary shrink-0">
              {subscribed ? <IconCheck className="h-4 w-4" /> : null}
              {subscribed ? t("footer.subscribed") : t("footer.subscribe")}
              {!subscribed ? <IconArrow className="h-4 w-4 rtl:rotate-180" /> : null}
            </button>
          </form>
        </div>

        <div className="mt-10 flex flex-col-reverse items-center justify-between gap-4 border-t border-line pt-6 text-[11px] text-muted md:flex-row">
          <p>
            © {new Date().getFullYear()} {STORE.name}. {t("footer.rights")}
          </p>
          <div className="flex items-center gap-4">
            <span>{t("footer.payment")}</span>
            <Link href="/admin" className="uppercase tracking-widest transition hover:text-gold">
              {t("nav.admin")}
            </Link>
          </div>
        </div>
      </div>
      <div className="select-none overflow-hidden border-t border-line">
        <p className="container-wide -mb-4 text-center font-display text-[19vw] leading-none text-ink/[0.045] dark:text-ink/[0.06]">MyPhone</p>
      </div>
    </footer>
  );
}
