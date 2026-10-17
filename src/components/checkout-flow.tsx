"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useSite } from "@/components/site-provider";
import {
  IconArrow,
  IconCard,
  IconCheck,
  IconChevron,
  IconMapPin,
  IconShield,
  IconTruck,
  IconWhatsApp,
  FieldError,
} from "@/components/ui";
import { CITIES, formatPrice, orderWhatsappMessage, shippingFor, whatsappUrl, type DeliveryId, type PaymentId } from "@/lib/site";

type OrderResult = {
  reference: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  notes: string;
  deliveryMethod: string;
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  total: number;
  items: { name: { en: string; ar: string }; qty: number; price: number; color?: string; storage?: string; image: string }[];
};

const DELIVERY_IDS: DeliveryId[] = ["tripoli", "other", "pickup"];
const PAYMENT_IDS: PaymentId[] = ["cash", "transfer", "whatsapp"];

export function CheckoutFlow() {
  const { t, lang, price, items, subtotal, clearCart, hydrated } = useSite();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", phone: "", city: "Tripoli", address: "", notes: "" });
  const [delivery, setDelivery] = useState<DeliveryId>("tripoli");
  const [payment, setPayment] = useState<PaymentId>("cash");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placing, setPlacing] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderResult | null>(null);

  const shippingCost = shippingFor(delivery, subtotal);
  const total = subtotal + shippingCost;

  const deliveryMeta: Record<DeliveryId, { title: string; desc: string; cost: number; icon: React.ReactNode }> = {
    tripoli: { title: t("checkout.tripoli"), desc: t("checkout.tripoliDesc"), cost: shippingFor("tripoli", subtotal), icon: <IconTruck className="h-4 w-4" /> },
    other: { title: t("checkout.otherCity"), desc: t("checkout.otherCityDesc"), cost: shippingFor("other", subtotal), icon: <IconMapPin className="h-4 w-4" /> },
    pickup: { title: t("checkout.pickup"), desc: t("checkout.pickupDesc"), cost: 0, icon: <IconShield className="h-4 w-4" /> },
  };

  const paymentMeta: Record<PaymentId, { title: string; desc: string; icon: React.ReactNode }> = {
    cash: { title: t("checkout.cash"), desc: t("checkout.cashDesc"), icon: <IconTruck className="h-4 w-4" /> },
    transfer: { title: t("checkout.transfer"), desc: t("checkout.transferDesc"), icon: <IconCard className="h-4 w-4" /> },
    whatsapp: { title: t("checkout.whatsappPay"), desc: t("checkout.whatsappPayDesc"), icon: <IconWhatsApp className="h-4 w-4" /> },
  };

  const validateDetails = () => {
    const next: Record<string, string> = {};
    if (form.name.trim().length < 3) next.name = t("checkout.invalidName");
    const digits = form.phone.replace(/\D/g, "");
    if (digits.length < 9) next.phone = t("checkout.invalidPhone");
    if (delivery !== "pickup" && form.address.trim().length < 3) next.address = t("checkout.invalidAddress");
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goToStep = (target: number) => {
    if (target === 2 && !validateDetails()) return;
    setStep(target);
  };

  const placeOrder = async () => {
    if (!validateDetails()) {
      setStep(1);
      return;
    }
    setPlacing(true);
    setServerError(null);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.name,
          phone: form.phone,
          city: form.city,
          address: form.address,
          notes: form.notes,
          deliveryMethod: delivery,
          paymentMethod: payment,
          lang,
          items: items.map((item) => ({ productId: item.productId, qty: item.qty, color: item.color, storage: item.storage })),
        }),
      });
      if (!response.ok) throw new Error("failed");
      const data = (await response.json()) as { order: OrderResult };
      setOrder(data.order);
      clearCart();
      setStep(4);
    } catch {
      setServerError(t("checkout.error"));
    } finally {
      setPlacing(false);
    }
  };

  if (!hydrated) {
    return <p className="py-16 text-center text-sm text-muted">{t("common.loading")}</p>;
  }

  if (order) {
    const message = orderWhatsappMessage(lang, {
      reference: order.reference,
      customerName: order.customerName,
      phone: order.phone,
      city: order.city,
      address: order.address,
      notes: order.notes,
      deliveryMethod: order.deliveryMethod,
      paymentMethod: order.paymentMethod,
      total: order.total,
      items: order.items.map((item) => ({
        name: lang === "ar" ? item.name.ar : item.name.en,
        qty: item.qty,
        price: item.price,
        color: item.color,
        storage: item.storage,
      })),
    });

    return (
      <div className="mx-auto max-w-2xl py-10 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/12 text-emerald-600 dark:text-emerald-400">
          <IconCheck className="h-8 w-8" />
        </span>
        <h2 className="mt-5 font-display text-3xl sm:text-4xl">{t("checkout.successTitle")}</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted">{t("checkout.successSub")}</p>

        <div className="mt-7 rounded-2xl border border-line bg-surface p-6 text-start">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">{t("checkout.orderRef")}</p>
              <p className="font-display text-2xl">{order.reference}</p>
            </div>
            <p className="font-display text-2xl">{price(order.total)}</p>
          </div>
          <ul className="mt-4 space-y-2 text-[12px]">
            {order.items.map((item, index) => (
              <li key={index} className="flex justify-between gap-3">
                <span className="text-muted">
                  {(lang === "ar" ? item.name.ar : item.name.en)} × {item.qty}
                  {item.color ? ` · ${item.color}` : ""}
                  {item.storage ? ` · ${item.storage}` : ""}
                </span>
                <span className="font-semibold">{price(item.price * item.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 grid gap-1 border-t border-line pt-3 text-[12px] text-muted">
            <p>
              {order.customerName} · {order.phone}
            </p>
            <p>
              {order.city} · {order.address || deliveryMeta[delivery].title}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <a href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
            <IconWhatsApp className="h-4 w-4" />
            {t("checkout.openWhatsApp")}
          </a>
          <Link href={`/order/${order.reference}`} className="btn btn-outline">
            {t("order.title")}
          </Link>
          <Link href="/shop" className="btn btn-outline">
            {t("checkout.continueShopping")}
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-2 text-gold">
          <IconCard className="h-7 w-7" />
        </span>
        <p className="font-display text-2xl">{t("cart.empty")}</p>
        <p className="mt-2 text-sm text-muted">{t("checkout.emptyCart")}</p>
        <Link href="/shop" className="btn btn-primary mt-6">
          {t("checkout.backToCart")}
        </Link>
      </div>
    );
  }

  const steps = [t("checkout.step1"), t("checkout.step2"), t("checkout.step3")];

  return (
    <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:items-start">
      <div>
        <ol className="mb-7 flex items-center gap-2">
          {steps.map((label, index) => {
            const value = index + 1;
            const active = step === value;
            const complete = step > value;
            return (
              <li key={label} className="flex flex-1 items-center gap-2">
                <button type="button" onClick={() => (complete ? goToStep(value) : undefined)} className="flex items-center gap-2 text-start">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold transition ${
                      active ? "border-ink bg-ink text-[color:var(--page)]" : complete ? "border-emerald-500 bg-emerald-500 text-white" : "border-line text-muted"
                    }`}
                  >
                    {complete ? <IconCheck className="h-4 w-4" /> : value}
                  </span>
                  <span className={`hidden text-[11px] font-bold uppercase tracking-widest sm:block ${active ? "text-ink" : "text-muted"}`}>{label}</span>
                </button>
                {index < steps.length - 1 ? <span className={`h-px flex-1 ${complete ? "bg-emerald-500" : "bg-line"}`} /> : null}
              </li>
            );
          })}
        </ol>

        {step === 1 ? (
          <div className="drawer-enter rounded-2xl border border-line bg-surface p-6">
            <h2 className="font-display text-2xl">{t("checkout.step1")}</h2>
            <p className="mt-1 text-[12px] text-muted">{t("checkout.phoneHint")}</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="name" className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-muted">
                  {t("checkout.fullName")}
                </label>
                <input
                  id="name"
                  className="field"
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  placeholder={lang === "ar" ? "محمد الشريف" : "Mohamed Al-Sharif"}
                  autoComplete="name"
                />
                <FieldError message={errors.name} />
              </div>
              <div>
                <label htmlFor="phone" className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-muted">
                  {t("checkout.phone")}
                </label>
                <input
                  id="phone"
                  className="field"
                  value={form.phone}
                  onChange={(event) => setForm({ ...form, phone: event.target.value })}
                  placeholder="091 555 0123"
                  inputMode="tel"
                  autoComplete="tel"
                  dir="ltr"
                />
                <FieldError message={errors.phone} />
              </div>
              <div>
                <label htmlFor="city" className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-muted">
                  {t("checkout.city")}
                </label>
                <select id="city" className="field" value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })}>
                  {CITIES.map((cityName) => (
                    <option key={cityName} value={cityName}>
                      {cityName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="address" className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-muted">
                  {t("checkout.address")}
                </label>
                <input
                  id="address"
                  className="field"
                  value={form.address}
                  onChange={(event) => setForm({ ...form, address: event.target.value })}
                  placeholder={lang === "ar" ? "شارع السرايا، قرب المصرف" : "Al-Saraya St, near the bank"}
                  autoComplete="street-address"
                />
                <FieldError message={errors.address} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="notes" className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-muted">
                  {t("checkout.notes")}
                </label>
                <textarea
                  id="notes"
                  className="field min-h-[80px] resize-y"
                  value={form.notes}
                  onChange={(event) => setForm({ ...form, notes: event.target.value })}
                  placeholder={lang === "ar" ? "وقت مناسب للتوصيل، اللون المطلوب…" : "Preferred delivery time, colour request…"}
                />
              </div>
            </div>
            <button type="button" onClick={() => goToStep(2)} className="btn btn-primary mt-6 w-full sm:w-auto">
              {t("common.next")}
              <IconArrow className="h-4 w-4 rtl:rotate-180" />
            </button>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="drawer-enter rounded-2xl border border-line bg-surface p-6">
            <h2 className="font-display text-2xl">{t("checkout.deliveryMethod")}</h2>
            <div className="mt-4 space-y-2.5">
              {DELIVERY_IDS.map((id) => {
                const meta = deliveryMeta[id];
                const active = delivery === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setDelivery(id)}
                    className={`flex w-full items-center gap-3 rounded-xl border p-4 text-start transition ${
                      active ? "border-gold bg-gold-soft/40" : "border-line hover:border-gold/60"
                    }`}
                  >
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full ${active ? "bg-gold text-white" : "bg-surface-2 text-muted"}`}>{meta.icon}</span>
                    <span className="flex-1">
                      <span className="block text-[13px] font-bold">{meta.title}</span>
                      <span className="block text-[11px] text-muted">{meta.desc}</span>
                    </span>
                    <span className="text-[12px] font-bold">{meta.cost === 0 ? t("common.free") : price(meta.cost)}</span>
                  </button>
                );
              })}
            </div>

            <h2 className="mt-7 font-display text-2xl">{t("checkout.paymentMethod")}</h2>
            <div className="mt-4 space-y-2.5">
              {PAYMENT_IDS.map((id) => {
                const meta = paymentMeta[id];
                const active = payment === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPayment(id)}
                    className={`flex w-full items-center gap-3 rounded-xl border p-4 text-start transition ${
                      active ? "border-gold bg-gold-soft/40" : "border-line hover:border-gold/60"
                    }`}
                  >
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full ${active ? "bg-gold text-white" : "bg-surface-2 text-muted"}`}>{meta.icon}</span>
                    <span className="flex-1">
                      <span className="block text-[13px] font-bold">{meta.title}</span>
                      <span className="block text-[11px] text-muted">{meta.desc}</span>
                    </span>
                    <span className={`h-4 w-4 rounded-full border ${active ? "border-4 border-gold" : "border-line"}`} />
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-between gap-3">
              <button type="button" onClick={() => setStep(1)} className="btn btn-outline">
                <IconChevron direction={lang === "ar" ? "right" : "left"} className="h-4 w-4" />
                {t("common.back")}
              </button>
              <button type="button" onClick={() => setStep(3)} className="btn btn-primary">
                {t("common.next")}
                <IconArrow className="h-4 w-4 rtl:rotate-180" />
              </button>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="drawer-enter rounded-2xl border border-line bg-surface p-6">
            <h2 className="font-display text-2xl">{t("checkout.step3")}</h2>
            <div className="mt-4 space-y-3 text-[13px]">
              <div className="rounded-xl border border-line p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted">{t("checkout.step1")}</p>
                  <button type="button" onClick={() => setStep(1)} className="text-[11px] font-bold text-gold">
                    {t("common.edit")}
                  </button>
                </div>
                <p className="mt-2 font-semibold">{form.name}</p>
                <p className="text-muted" dir="ltr">
                  {form.phone}
                </p>
                <p className="text-muted">
                  {form.city} · {form.address}
                </p>
                {form.notes ? <p className="mt-1 text-[11px] italic text-muted">{form.notes}</p> : null}
              </div>
              <div className="rounded-xl border border-line p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted">{t("checkout.step2")}</p>
                  <button type="button" onClick={() => setStep(2)} className="text-[11px] font-bold text-gold">
                    {t("common.edit")}
                  </button>
                </div>
                <p className="mt-2 font-semibold">{deliveryMeta[delivery].title}</p>
                <p className="text-muted">{paymentMeta[payment].title}</p>
              </div>
            </div>
            {serverError ? <FieldError message={serverError} /> : null}
            <button type="button" onClick={placeOrder} disabled={placing} className="btn btn-primary mt-5 w-full">
              {placing ? t("checkout.placing") : t("checkout.placeOrder")}
              {!placing ? <IconCheck className="h-4 w-4" /> : null}
            </button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] text-muted">
              <IconShield className="h-3.5 w-3.5 text-gold" />
              {t("checkout.secureNote")}
            </p>
            <button type="button" onClick={() => setStep(2)} className="mt-3 w-full text-center text-[11px] font-bold uppercase tracking-widest text-muted transition hover:text-gold">
              {t("common.back")}
            </button>
          </div>
        ) : null}
      </div>

      <aside className="rounded-2xl border border-line bg-surface p-6 lg:sticky lg:top-24">
        <h2 className="font-display text-2xl">{t("checkout.summary")}</h2>
        <ul className="mt-4 max-h-[320px] space-y-3 overflow-y-auto pe-1">
          {items.map((item) => (
            <li key={item.key} className="flex gap-3">
              <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-surface-2">
                <Image src={item.image} alt="" fill sizes="56px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-[12px] font-bold leading-snug">{lang === "ar" ? item.nameAr : item.nameEn}</p>
                <p className="mt-0.5 text-[10px] text-muted">
                  {[item.color, item.storage].filter(Boolean).join(" · ")} × {item.qty}
                </p>
              </div>
              <p className="text-[12px] font-bold">{price(item.price * item.qty)}</p>
            </li>
          ))}
        </ul>
        <dl className="mt-5 space-y-2 border-t border-line pt-4 text-[12px]">
          <div className="flex justify-between">
            <dt className="text-muted">{t("cart.subtotal")}</dt>
            <dd className="font-semibold">{price(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">{t("cart.shipping")}</dt>
            <dd className="font-semibold">{shippingCost === 0 ? t("common.free") : price(shippingCost)}</dd>
          </div>
          <div className="flex items-center justify-between border-t border-line pt-3">
            <dt className="text-[13px] font-bold">{t("cart.total")}</dt>
            <dd className="font-display text-2xl">{price(total)}</dd>
          </div>
        </dl>
        {subtotal < 500 ? (
          <p className="mt-3 rounded-xl bg-gold-soft/60 p-3 text-[11px] leading-relaxed text-muted">
            {t("cart.freeShipAhead", { amount: formatPrice(500 - subtotal, lang) })}
          </p>
        ) : (
          <p className="mt-3 rounded-xl bg-emerald-500/10 p-3 text-[11px] font-semibold leading-relaxed text-emerald-700 dark:text-emerald-400">
            {t("cart.freeShipReached")}
          </p>
        )}
        <p className="mt-3 flex items-start gap-1.5 text-[10px] leading-relaxed text-muted">
          <IconShield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
          {t("checkout.secureNote")}
        </p>
      </aside>
    </div>
  );
}
