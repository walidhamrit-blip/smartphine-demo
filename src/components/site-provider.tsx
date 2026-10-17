"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { isRtl, tr, type DictKey, type Lang } from "@/lib/i18n";
import { formatPrice, shippingFor } from "@/lib/site";

export type CartItem = {
  key: string;
  productId: number;
  slug: string;
  nameEn: string;
  nameAr: string;
  price: number;
  image: string;
  color?: string;
  storage?: string;
  qty: number;
  stock: number;
};

type Theme = "light" | "dark";

type SiteContextValue = {
  lang: Lang;
  dir: "rtl" | "ltr";
  setLang: (lang: Lang) => void;
  t: (key: DictKey, vars?: Record<string, string | number>) => string;
  price: (value: number) => string;
  theme: Theme;
  toggleTheme: () => void;
  items: CartItem[];
  hydrated: boolean;
  addItem: (item: Omit<CartItem, "key" | "qty">, qty?: number) => void;
  removeItem: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clearCart: () => void;
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  lastAdded: string | null;
};

const SiteContext = createContext<SiteContextValue | null>(null);
const CART_KEY = "myphone-cart-v1";
const LANG_KEY = "mp_lang";

function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item && typeof item.slug === "string" && typeof item.price === "number")
      .map((item) => ({
        ...item,
        qty: Math.max(1, Math.min(Number(item.qty) || 1, 10)),
      }));
  } catch {
    return [];
  }
}

export function SiteProvider({
  children,
  initialLang,
}: {
  children: ReactNode;
  initialLang: Lang;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [lang, setLangState] = useState<Lang>(initialLang);
  const [theme, setTheme] = useState<Theme>("light");
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Hydrate persisted cart + theme after mount so server HTML stays deterministic.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(readCart());
    setHydrated(true);
    const storedTheme = window.localStorage.getItem("mp_theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const nextTheme: Theme = storedTheme === "dark" || storedTheme === "light" ? storedTheme : prefersDark ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCartOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = cartOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen]);

  const setLang = useCallback(
    (nextLang: Lang) => {
      setLangState(nextLang);
      document.cookie = `${LANG_KEY}=${nextLang}; path=/; max-age=31536000; samesite=lax`;
      document.documentElement.lang = nextLang;
      document.documentElement.dir = isRtl(nextLang) ? "rtl" : "ltr";
      router.refresh();
    },
    [router],
  );

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", next === "dark");
      window.localStorage.setItem("mp_theme", next);
      return next;
    });
  }, []);

  const addItem = useCallback((item: Omit<CartItem, "key" | "qty">, qty = 1) => {
    const key = `${item.slug}__${item.color ?? "default"}__${item.storage ?? "default"}`;
    setItems((current) => {
      const existing = current.find((entry) => entry.key === key);
      if (existing) {
        return current.map((entry) =>
          entry.key === key ? { ...entry, qty: Math.min(entry.qty + qty, Math.max(1, item.stock || 10)) } : entry,
        );
      }
      return [...current, { ...item, key, qty: Math.max(1, qty) }];
    });
    setLastAdded(key);
    setCartOpen(true);
    if (addedTimer.current) clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setLastAdded(null), 2200);
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((current) => current.filter((entry) => entry.key !== key));
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setItems((current) =>
      current
        .map((entry) => (entry.key === key ? { ...entry, qty: Math.max(0, Math.min(qty, 10)) } : entry))
        .filter((entry) => entry.qty > 0),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.qty, 0), [items]);
  const shipping = useMemo(() => shippingFor("tripoli", subtotal), [subtotal]);
  const count = useMemo(() => items.reduce((sum, item) => sum + item.qty, 0), [items]);

  const value = useMemo<SiteContextValue>(
    () => ({
      lang,
      dir: isRtl(lang) ? "rtl" : "ltr",
      setLang,
      t: (key, vars) => tr(lang, key, vars),
      price: (amount) => formatPrice(amount, lang),
      theme,
      toggleTheme,
      items,
      hydrated,
      addItem,
      removeItem,
      setQty,
      clearCart,
      count,
      subtotal,
      shipping,
      total: subtotal + shipping,
      cartOpen,
      setCartOpen,
      lastAdded,
    }),
    [lang, setLang, theme, toggleTheme, items, hydrated, addItem, removeItem, setQty, clearCart, count, subtotal, shipping, cartOpen, lastAdded],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite(): SiteContextValue {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error("useSite must be used inside SiteProvider");
  }
  return context;
}
