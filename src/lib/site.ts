import type { Lang } from "@/lib/i18n";

export const STORE = {
  name: "MyPhone",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "218915550123",
  whatsappDisplay: "+218 91 555 0123",
  phoneHref: "tel:+218915550123",
  email: "hello@myphone.ly",
  instagram: "https://instagram.com",
  facebook: "https://facebook.com",
  address: { en: "Al-Saraya Street, Tripoli · Libya", ar: "شارع السرايا، طرابلس · ليبيا" },
  hours: { en: "Sat – Thu · 9:00 to 21:00", ar: "السبت – الخميس · 9:00 إلى 21:00" },
  mapsUrl: "https://maps.google.com/?q=Al+Saraya+Street+Tripoli+Libya",
};

export const FREE_SHIPPING_THRESHOLD = 500;

export const CITIES = [
  "Tripoli",
  "Benghazi",
  "Misrata",
  "Zawiya",
  "Sabratha",
  "Janzur",
  "Tajoura",
  "Khoms",
  "Gharian",
  "Zintan",
  "Sabha",
  "Tobruk",
  "Sirte",
  "Derna",
];

export type DeliveryId = "tripoli" | "other" | "pickup";
export type PaymentId = "cash" | "transfer" | "whatsapp";

export const DELIVERY_OPTIONS: { id: DeliveryId; price: number }[] = [
  { id: "tripoli", price: 20 },
  { id: "other", price: 35 },
  { id: "pickup", price: 0 },
];

export function shippingFor(method: string, subtotal: number): number {
  if (method === "pickup") return 0;
  if (method === "other") return 35;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 20;
}

export function formatPrice(value: number, lang: Lang): string {
  const rounded = Math.round(value * 100) / 100;
  const grouped = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: Number.isInteger(rounded) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(rounded);
  return lang === "ar" ? `${grouped} د.ل` : `${grouped} LYD`;
}

export function formatDate(iso: string, lang: Lang): string {
  const date = new Date(iso);
  return new Intl.DateTimeFormat(lang === "ar" ? "ar-LY" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    numberingSystem: "latn",
  }).format(date);
}

export function whatsappUrl(message: string): string {
  return `https://wa.me/${STORE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function productWhatsappMessage(
  lang: Lang,
  product: { nameEn: string; nameAr: string; price: number; slug: string; color?: string; storage?: string },
): string {
  const name = lang === "ar" ? product.nameAr : product.nameEn;
  const lines =
    lang === "ar"
      ? [
          `مرحباً ${STORE.name}، أريد طلب هذا المنتج:`,
          `• ${name}`,
          product.color ? `• اللون: ${product.color}` : "",
          product.storage ? `• الخيار: ${product.storage}` : "",
          `• السعر: ${formatPrice(product.price, lang)}`,
          `• الرابط: /product/${product.slug}`,
        ]
      : [
          `Hello ${STORE.name}, I'd like to order:`,
          `• ${name}`,
          product.color ? `• Colour: ${product.color}` : "",
          product.storage ? `• Option: ${product.storage}` : "",
          `• Price: ${formatPrice(product.price, lang)}`,
          `• Link: /product/${product.slug}`,
        ];
  return lines.filter(Boolean).join("\n");
}

export function cartWhatsappMessage(
  lang: Lang,
  items: { name: string; qty: number; price: number; color?: string; storage?: string }[],
  total: number,
): string {
  const header = lang === "ar" ? `مرحباً ${STORE.name}، أريد طلب:` : `Hello ${STORE.name}, I'd like to order:`;
  const lines = items.map(
    (item) =>
      `• ${item.name}${item.color ? ` (${item.color})` : ""}${item.storage ? ` ${item.storage}` : ""} × ${item.qty} — ${formatPrice(item.price * item.qty, lang)}`,
  );
  const footer = lang === "ar" ? `الإجمالي: ${formatPrice(total, lang)}` : `Total: ${formatPrice(total, lang)}`;
  return [header, ...lines, footer].join("\n");
}

export function orderWhatsappMessage(
  lang: Lang,
  order: {
    reference: string;
    customerName: string;
    phone: string;
    city: string;
    address: string;
    notes: string;
    deliveryMethod: string;
    paymentMethod: string;
    total: number;
    items: { name: string; qty: number; price: number; color?: string; storage?: string }[];
  },
): string {
  const deliveryLabel = { tripoli: "Tripoli same-day", other: "Other cities", pickup: "Store pickup" } as Record<string, string>;
  const paymentLabel = { cash: "Cash on delivery", transfer: "Bank transfer", whatsapp: "Arrange on WhatsApp" } as Record<string, string>;
  const lines =
    lang === "ar"
      ? [
          `مرحباً ${STORE.name}، طلب جديد:`,
          `رقم الطلب: ${order.reference}`,
          `الاسم: ${order.customerName}`,
          `الهاتف: ${order.phone}`,
          `المدينة: ${order.city}`,
          `العنوان: ${order.address}`,
          "",
          ...order.items.map(
            (item) =>
              `• ${item.name}${item.color ? ` (${item.color})` : ""}${item.storage ? ` ${item.storage}` : ""} × ${item.qty} — ${formatPrice(item.price * item.qty, lang)}`,
          ),
          "",
          `التوصيل: ${deliveryLabel[order.deliveryMethod] ?? order.deliveryMethod}`,
          `الدفع: ${paymentLabel[order.paymentMethod] ?? order.paymentMethod}`,
          `الإجمالي: ${formatPrice(order.total, lang)}`,
          order.notes ? `ملاحظات: ${order.notes}` : "",
        ]
      : [
          `Hello ${STORE.name}, new order:`,
          `Reference: ${order.reference}`,
          `Name: ${order.customerName}`,
          `Phone: ${order.phone}`,
          `City: ${order.city}`,
          `Address: ${order.address}`,
          "",
          ...order.items.map(
            (item) =>
              `• ${item.name}${item.color ? ` (${item.color})` : ""}${item.storage ? ` ${item.storage}` : ""} × ${item.qty} — ${formatPrice(item.price * item.qty, lang)}`,
          ),
          "",
          `Delivery: ${deliveryLabel[order.deliveryMethod] ?? order.deliveryMethod}`,
          `Payment: ${paymentLabel[order.paymentMethod] ?? order.paymentMethod}`,
          `Total: ${formatPrice(order.total, lang)}`,
          order.notes ? `Notes: ${order.notes}` : "",
        ];
  return lines.filter((line) => line !== undefined).join("\n");
}

export const ORDER_STATUSES = ["new", "confirmed", "shipped", "delivered", "cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];
