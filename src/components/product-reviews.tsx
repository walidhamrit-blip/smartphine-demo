"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useSite } from "@/components/site-provider";
import { IconCheck, IconClose, FieldError, Stars } from "@/components/ui";
import { formatDate } from "@/lib/site";
import type { ReviewView } from "@/lib/store";

type Props = { productId: number; initialReviews: ReviewView[] };

export function ProductReviews({ productId, initialReviews }: Props) {
  const { t, lang } = useSite();
  const router = useRouter();
  const [reviews, setReviews] = useState<ReviewView[]>(initialReviews);
  const [name, setName] = useState("");
  const [city, setCity] = useState("Tripoli");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const average = useMemo(() => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  }, [reviews]);

  const distribution = useMemo(() => {
    return [5, 4, 3, 2, 1].map((value) => {
      const count = reviews.filter((review) => review.rating === value).length;
      return { value, count, percentage: reviews.length === 0 ? 0 : Math.round((count / reviews.length) * 100) };
    });
  }, [reviews]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (name.trim().length < 2 || body.trim().length < 4) {
      setState("error");
      setError(t("product.reviewError"));
      return;
    }
    setState("loading");
    setError(null);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, author: name, city, rating, title, body, lang }),
      });
      if (!response.ok) throw new Error("failed");
      const data = (await response.json()) as { review: ReviewView };
      setReviews((current) => [data.review, ...current]);
      setName("");
      setTitle("");
      setBody("");
      setRating(5);
      setState("done");
      router.refresh();
    } catch {
      setState("error");
      setError(t("product.reviewError"));
    }
  };

  return (
    <section id="reviews" className="border-t border-line py-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">{t("product.reviews")}</p>
          <h2 className="mt-2 font-display text-3xl">{t("testi.title")}</h2>
        </div>
        <p className="text-[12px] text-muted">{t("product.ratingSummary", { n: reviews.length })}</p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-2xl border border-line bg-surface p-6">
          <div className="flex items-end gap-3">
            <p className="font-display text-5xl leading-none">{average.toFixed(1)}</p>
            <div className="pb-1">
              <Stars rating={average} />
              <p className="mt-1 text-[11px] text-muted">
                {reviews.length} {t("common.reviews")}
              </p>
            </div>
          </div>
          <div className="mt-5 space-y-2">
            {distribution.map((row) => (
              <div key={row.value} className="flex items-center gap-2 text-[11px]">
                <span className="w-8 font-semibold text-muted">{row.value}★</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                  <div className="h-full rounded-full bg-gold" style={{ width: `${row.percentage}%` }} />
                </div>
                <span className="w-6 text-end tabular-nums text-muted">{row.count}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-start gap-2 rounded-xl bg-gold-soft/60 p-3 text-[11px] leading-relaxed text-muted">
            <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            {lang === "ar"
              ? "كل تقييم هنا من عميل استلم جهازه من ماي فون طرابلس."
              : "Every review here comes from a customer who received their device from MyPhone Tripoli."}
          </div>
        </div>

        <form onSubmit={submit} className="rounded-2xl border border-line bg-surface p-6">
          <h3 className="font-display text-2xl">{t("product.writeReview")}</h3>
          <div className="mt-4 flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                onMouseEnter={() => setHoverRating(value)}
                onMouseLeave={() => setHoverRating(0)}
                aria-label={`${value} stars`}
                className="transition hover:scale-110"
              >
                <svg
                  viewBox="0 0 20 20"
                  className={`h-7 w-7 ${(hoverRating || rating) >= value ? "text-gold" : "text-line"}`}
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="m10 1.8 2.5 5.1 5.6.8-4 4 .9 5.6-5-2.7-5 2.7.9-5.6-4-4 5.6-.8Z" />
                </svg>
              </button>
            ))}
            <span className="ms-2 text-[11px] font-semibold text-muted">{rating}/5</span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-widest text-muted" htmlFor="review-name">
                {t("product.reviewName")}
              </label>
              <input id="review-name" value={name} onChange={(event) => setName(event.target.value)} className="field" placeholder="Ahmed" required />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-widest text-muted" htmlFor="review-city">
                {t("product.reviewCity")}
              </label>
              <input id="review-city" value={city} onChange={(event) => setCity(event.target.value)} className="field" placeholder="Tripoli" />
            </div>
          </div>
          <div className="mt-3">
            <label className="mb-1 block text-[11px] font-bold uppercase tracking-widest text-muted" htmlFor="review-title">
              {t("product.reviewTitle")}
            </label>
            <input id="review-title" value={title} onChange={(event) => setTitle(event.target.value)} className="field" />
          </div>
          <div className="mt-3">
            <label className="mb-1 block text-[11px] font-bold uppercase tracking-widest text-muted" htmlFor="review-body">
              {t("product.reviewBody")}
            </label>
            <textarea
              id="review-body"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              className="field min-h-[96px] resize-y"
              required
              placeholder={lang === "ar" ? "جودة البناء، البطارية، الكاميرا…" : "Build quality, battery, camera…"}
            />
            <FieldError message={error ?? undefined} />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button type="submit" disabled={state === "loading"} className="btn btn-primary">
              {state === "loading" ? t("common.loading") : t("product.submitReview")}
            </button>
            {state === "done" ? (
              <span className="flex items-center gap-1.5 text-[12px] font-semibold text-emerald-600 dark:text-emerald-400">
                <IconCheck className="h-4 w-4" />
                {t("product.reviewThanks")}
              </span>
            ) : null}
          </div>
        </form>
      </div>

      <div className="mt-8 space-y-3">
        {reviews.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-line bg-surface p-8 text-center text-sm text-muted">{t("product.noReviews")}</p>
        ) : (
          reviews.map((review) => (
            <article key={review.id} className="rounded-2xl border border-line bg-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-soft text-sm font-bold text-gold">
                    {review.author.slice(0, 1)}
                  </span>
                  <div>
                    <p className="text-[13px] font-bold">{review.author}</p>
                    <p className="text-[11px] text-muted">
                      {review.city} · {formatDate(review.createdAt, lang)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Stars rating={review.rating} />
                  {review.verified ? (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      <IconCheck className="h-3 w-3" />
                      {t("product.verified")}
                    </span>
                  ) : null}
                </div>
              </div>
              {review.title ? <p className="mt-3 text-[13px] font-bold">{review.title}</p> : null}
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">{review.body}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

export function NoReviewsNote() {
  const { t } = useSite();
  return (
    <p className="flex items-center gap-1.5 text-[11px] text-muted">
      <IconClose className="h-3 w-3" />
      {t("product.noReviews")}
    </p>
  );
}
