"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSite } from "@/components/site-provider";
import {
  IconCart,
  IconClose,
  IconMenu,
  IconMoon,
  IconSearch,
  IconSun,
  IconWhatsApp,
} from "@/components/ui";
import type { DictKey, Lang } from "@/lib/i18n";
import { STORE, whatsappUrl } from "@/lib/site";

const NAV: { href: string; key: DictKey }[] = [
  { href: "/", key: "nav.home" },
  { href: "/shop", key: "nav.shop" },
  { href: "/shop?category=smartphones", key: "nav.phones" },
  { href: "/shop?category=tablets", key: "nav.tablets" },
  { href: "/shop?category=audio", key: "nav.audio" },
  { href: "/shop?category=accessories", key: "nav.accessories" },
  { href: "/shop?deals=1", key: "nav.deals" },
];

export function SiteHeader() {
  const { t, lang, setLang, theme, toggleTheme, count, setCartOpen } = useSite();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  // Close overlays whenever the route changes (derived state, no effect needed).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
    setSearchOpen(false);
  }

  useEffect(() => {
    if (!searchOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const term = query.trim();
    setSearchOpen(false);
    router.push(term ? `/shop?q=${encodeURIComponent(term)}` : "/shop");
  };

  const searchSuggestions = ["iPhone 15", "Galaxy S24", "AirPods", "iPad", "JBL"];

  return (
    <>
      <div className="bg-ink text-[color:var(--page)]">
        <div className="container-wide flex h-9 items-center justify-between gap-4 text-[11px] font-medium tracking-wide">
          <a
            href={whatsappUrl(lang === "ar" ? "مرحباً ماي فون، أحتاج مساعدة في اختيار جهاز." : "Hello MyPhone, I need help choosing a device.")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 opacity-85 transition hover:opacity-100"
          >
            <IconWhatsApp className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t("topbar.support")}</span>
            <span className="sm:hidden">WhatsApp</span>
          </a>
          <p className="hidden truncate opacity-80 md:block">{t("topbar.delivery")}</p>
          <div className="flex items-center gap-4">
            <span className="hidden opacity-80 sm:inline">{t("topbar.warranty")}</span>
            <Link href="/admin" className="hidden items-center gap-1 rounded-full border border-white/25 px-2.5 py-0.5 tracking-widest uppercase opacity-80 transition hover:opacity-100 md:flex">
              {t("nav.admin")}
            </Link>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-line backdrop-blur-xl" style={{ backgroundColor: "var(--header)" }}>
        <div className="container-wide flex h-[68px] items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line lg:hidden"
              aria-label={t("common.menu")}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <IconClose className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
            </button>
            <Link href="/" className="group flex items-center gap-2.5">
              <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-[color:var(--page)] transition group-hover:scale-105">
                <span className="font-display text-[22px] leading-none">M</span>
                <span className="absolute -end-0.5 -top-0.5 h-2 w-2 rounded-full bg-gold" />
              </span>
              <span className="leading-none">
                <span className="font-display text-[26px] tracking-tight">MyPhone</span>
                <span className="mt-1 hidden text-[9px] font-semibold uppercase tracking-[0.28em] text-muted sm:block">
                  Tripoli · Libya
                </span>
              </span>
            </Link>
          </div>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname + (item.href.includes("?") ? "" : "") === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative rounded-full px-3.5 py-2 text-[13px] font-semibold transition hover:text-gold ${
                    active ? "text-gold" : "text-ink/85"
                  }`}
                >
                  {t(item.key)}
                  {active ? <span className="absolute inset-x-3.5 -bottom-0.5 h-px bg-gold" /> : null}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5">
            <div className="hidden items-center rounded-full border border-line p-0.5 sm:flex" role="group" aria-label={t("common.language")}>
              {(["en", "ar"] as Lang[]).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition ${
                    lang === code ? "bg-ink text-[color:var(--page)]" : "text-muted hover:text-ink"
                  }`}
                  aria-pressed={lang === code}
                >
                  {code === "en" ? "EN" : "ع"}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line transition hover:border-gold hover:text-gold"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <IconSun className="h-[18px] w-[18px]" /> : <IconMoon className="h-[18px] w-[18px]" />}
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line transition hover:border-gold hover:text-gold"
              aria-label={t("common.search")}
            >
              <IconSearch className="h-[18px] w-[18px]" />
            </button>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-ink text-[color:var(--page)] transition hover:opacity-90"
              aria-label={t("cart.title")}
            >
              <IconCart className="h-[18px] w-[18px]" />
              {count > 0 ? (
                <span className="absolute -end-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-white">
                  {count}
                </span>
              ) : null}
            </button>
          </div>
        </div>

        {menuOpen ? (
          <div className="border-t border-line bg-page lg:hidden">
            <nav className="container-wide grid gap-1 py-4">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold transition hover:bg-surface-2"
                >
                  {t(item.key)}
                  <span className="text-muted">→</span>
                </Link>
              ))}
              <div className="mt-2 flex items-center justify-between gap-2 border-t border-line pt-3">
                <div className="flex items-center gap-1">
                  {(["en", "ar"] as Lang[]).map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setLang(code)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-bold ${
                        lang === code ? "border-ink bg-ink text-[color:var(--page)]" : "border-line text-muted"
                      }`}
                    >
                      {code === "en" ? "English" : "العربية"}
                    </button>
                  ))}
                </div>
                <Link href="/admin" className="text-xs font-bold uppercase tracking-widest text-gold">
                  {t("nav.admin")}
                </Link>
              </div>
            </nav>
          </div>
        ) : null}
      </header>

      {searchOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/55 px-4 pt-24 backdrop-blur-sm" onClick={() => setSearchOpen(false)}>
          <div className="w-full max-w-2xl rounded-3xl border border-line bg-surface p-5 shadow-2xl sm:p-7" onClick={(event) => event.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <p className="font-display text-2xl">{t("search.title")}</p>
              <button type="button" onClick={() => setSearchOpen(false)} className="rounded-full border border-line p-2 text-muted transition hover:text-ink" aria-label={t("common.close")}>
                <IconClose className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={submitSearch} className="flex gap-2">
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("search.placeholder")}
                className="field"
                aria-label={t("common.search")}
              />
              <button type="submit" className="btn btn-primary shrink-0 px-5!">
                <IconSearch className="h-4 w-4" />
              </button>
            </form>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-muted">Popular</span>
              {searchSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => {
                    setSearchOpen(false);
                    router.push(`/shop?q=${encodeURIComponent(suggestion)}`);
                  }}
                  className="chip"
                >
                  {suggestion}
                </button>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted">
              {lang === "ar" ? "أو تواصل معنا مباشرة على " : "Or message us directly on "}
              <a href={whatsappUrl("Hello MyPhone!")} target="_blank" rel="noopener noreferrer" className="font-bold text-gold">
                WhatsApp {STORE.whatsappDisplay}
              </a>
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
