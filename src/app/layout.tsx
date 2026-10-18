import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { SiteProvider } from "@/components/site-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartDrawer } from "@/components/cart-drawer";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { DatabaseBanner } from "@/components/database-banner";
import { getServerLang } from "@/lib/lang-server";

export const metadata: Metadata = {
  title: {
    default: "MyPhone — Premium smartphones, tablets & audio in Tripoli",
    template: "%s · MyPhone Tripoli",
  },
  description:
    "MyPhone is Tripoli's technology boutique for genuine smartphones, tablets, audio and accessories. Same-day delivery, official warranty and WhatsApp ordering.",
  keywords: ["MyPhone", "Tripoli", "smartphones", "Libya", "iPhone", "Samsung", "tablets", "headphones"],
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "MyPhone — Technology, curated in Tripoli",
    description: "Genuine smartphones, tablets, audio and accessories with same-day Tripoli delivery.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f1e9" },
    { media: "(prefers-color-scheme: dark)", color: "#09090c" },
  ],
};

const themeScript = `(function(){try{var stored=localStorage.getItem('mp_theme');var prefers=window.matchMedia('(prefers-color-scheme: dark)').matches;var dark=stored?stored==='dark':prefers;if(dark)document.documentElement.classList.add('dark');}catch(e){}})();`;

export default async function RootLayout({ children }: { children: ReactNode }) {
  const lang = await getServerLang();

  return (
    <html lang={lang} dir={lang === "ar" ? "rtl" : "ltr"} suppressHydrationWarning>
      <head>
        {/* Preconnect + a single stylesheet request: much faster than the CSS
            @import waterfall, and the variable fonts cover every weight used. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- root layout of the App Router: loads site-wide, not for a single page */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300..800&family=Instrument+Serif:ital@0;1&family=Manrope:wght@300..800&display=swap"
        />
      </head>
      <body className="min-h-screen bg-page text-ink antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <SiteProvider initialLang={lang}>
          <DatabaseBanner lang={lang} />
          <SiteHeader />
          <main className="min-h-[60vh]">{children}</main>
          <SiteFooter />
          <CartDrawer />
          <WhatsAppFab />
        </SiteProvider>
      </body>
    </html>
  );
}
