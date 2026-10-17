"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { logoutAction } from "@/app/admin/actions";
import { useSite } from "@/components/site-provider";
import { IconArrow, IconCart, IconSliders, IconSupport } from "@/components/ui";
import type { DictKey } from "@/lib/i18n";
import { STORE } from "@/lib/site";

const NAV: { href: string; key: DictKey; icon: ReactNode }[] = [
  { href: "/admin", key: "admin.dashboard", icon: <IconSliders className="h-4 w-4" /> },
  { href: "/admin/products", key: "admin.products", icon: <IconCart className="h-4 w-4" /> },
  { href: "/admin/orders", key: "admin.orders", icon: <IconArrow className="h-4 w-4" /> },
  { href: "/admin/reviews", key: "admin.reviews", icon: <IconStar className="h-4 w-4" /> },
];

export function IconStar({ className }: { className?: string }) {
  return (
    <svg className={className ?? "h-4 w-4"} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path d="m10 1.8 2.5 5.1 5.6.8-4 4 .9 5.6-5-2.7-5 2.7.9-5.6-4-4 5.6-.8Z" />
    </svg>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  const { t, lang } = useSite();
  const pathname = usePathname();

  return (
    <div className="min-h-[80vh] bg-page">
      <div className="container-wide py-6 lg:py-8">
        <div className="overflow-hidden rounded-[1.6rem] border border-line bg-surface lg:grid lg:grid-cols-[240px_1fr]">
          <aside className="bg-[#111116] p-5 text-[#f4efe5] lg:min-h-[70vh]">
            <div className="flex items-center justify-between">
              <Link href="/admin" className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f4efe5] text-[#111116]">
                  <span className="font-display text-xl leading-none">M</span>
                </span>
                <span>
                  <span className="block font-display text-xl leading-none">MyPhone</span>
                  <span className="text-[9px] uppercase tracking-[0.24em] text-white/45">{t("admin.title")}</span>
                </span>
              </Link>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-emerald-300">Live</span>
            </div>

            <nav className="mt-6 flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
              {NAV.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-[12px] font-semibold transition ${
                      active ? "bg-[#f4efe5] text-[#111116]" : "text-white/65 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {item.icon}
                    {t(item.key)}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-6 hidden rounded-xl border border-white/10 bg-white/5 p-3.5 text-[11px] text-white/60 lg:block">
              <p className="flex items-center gap-1.5 font-bold text-white/85">
                <IconSupport className="h-3.5 w-3.5" />
                {STORE.whatsappDisplay}
              </p>
              <p className="mt-1.5 leading-relaxed">
                {lang === "ar" ? "لوحة تجريبية — التغييرات تُحفظ في قاعدة البيانات فوراً." : "Demo console — changes are saved to the database instantly."}
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <Link href="/" className="flex items-center justify-between rounded-xl border border-white/15 px-3.5 py-2.5 text-[11px] font-semibold text-white/75 transition hover:bg-white/10 hover:text-white">
                {t("admin.viewStore")}
                <IconArrow className="h-3.5 w-3.5" />
              </Link>
              <form action={logoutAction}>
                <button type="submit" className="w-full rounded-xl bg-white/10 px-3.5 py-2.5 text-[11px] font-semibold text-white/75 transition hover:bg-white/20 hover:text-white">
                  {t("admin.signOut")}
                </button>
              </form>
            </div>
          </aside>

          <main className="min-w-0 p-5 sm:p-7">{children}</main>
        </div>
      </div>
    </div>
  );
}
