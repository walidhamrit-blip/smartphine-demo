"use client";

import { useEffect, useState } from "react";
import { useSite } from "@/components/site-provider";
import { IconWhatsApp } from "@/components/ui";
import { whatsappUrl } from "@/lib/site";

export function WhatsAppFab() {
  const { lang, cartOpen } = useSite();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const href = whatsappUrl(
    lang === "ar"
      ? "مرحباً ماي فون! أبحث عن جهاز وأحتاج نصيحتكم."
      : "Hello MyPhone! I'm looking for a device and would love your advice.",
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group fixed bottom-5 end-5 z-30 flex items-center gap-2 rounded-full bg-[#1faa5a] py-3.5 ps-3.5 pe-4 text-white shadow-xl transition-all duration-500 hover:bg-[#18914c] ${
        visible && !cartOpen ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
      aria-label="WhatsApp"
    >
      <span className="pulse-ring flex h-6 w-6 items-center justify-center rounded-full">
        <IconWhatsApp className="h-6 w-6" />
      </span>
      <span className="hidden text-xs font-bold sm:inline">{lang === "ar" ? "اطلب على واتساب" : "Order on WhatsApp"}</span>
    </a>
  );
}
