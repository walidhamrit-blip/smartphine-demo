import { setReviewStatusAction } from "@/app/admin/actions";
import { DeleteReviewButton } from "@/components/admin-buttons";
import { IconStar } from "@/components/ui";
import { tr } from "@/lib/i18n";
import { getServerLang } from "@/lib/lang-server";
import { getAllReviews } from "@/lib/store";
import { formatDate } from "@/lib/site";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  await requireAdmin();
  const [reviews, lang] = await Promise.all([getAllReviews(), getServerLang()]);
  const pending = reviews.filter((review) => review.status === "pending");
  const others = reviews.filter((review) => review.status !== "pending");

  return (
    <div>
      <p className="eyebrow">{tr(lang, "admin.title")}</p>
      <h1 className="mt-1 font-display text-3xl">{tr(lang, "admin.reviews")}</h1>
      <p className="mt-1 text-[12px] text-muted">
        {reviews.length} {tr(lang, "common.reviews")} · {pending.length} {tr(lang, "admin.pendingReviews")}
      </p>

      <div className="mt-5 space-y-6">
        {[{ title: tr(lang, "admin.reviewPending"), items: pending }, { title: tr(lang, "admin.dashboard"), items: others }].map((group) => (
          <section key={group.title}>
            <h2 className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
              {group.title} ({group.items.length})
            </h2>
            {group.items.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-line bg-page py-8 text-center text-[12px] text-muted">{tr(lang, "admin.none")}</p>
            ) : (
              <div className="space-y-2.5">
                {group.items.map((review) => (
                  <article key={review.id} className="rounded-2xl border border-line bg-page p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-[12.5px] font-bold">{review.author} <span className="font-normal text-muted">· {review.city}</span></p>
                        <p className="text-[10.5px] text-muted">
                          {review.productName ? (lang === "ar" ? review.productName.ar : review.productName.en) : ""} · {formatDate(review.createdAt, lang)} · {review.lang.toUpperCase()}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-gold">
                        {Array.from({ length: review.rating }).map((_, index) => (
                          <IconStar key={index} className="h-3 w-3" />
                        ))}
                        <span className={`ms-2 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                          review.status === "approved" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : review.status === "pending" ? "bg-gold-soft text-gold" : "bg-surface-2 text-muted"
                        }`}>
                          {review.status === "approved" ? tr(lang, "admin.reviewApproved") : review.status === "pending" ? tr(lang, "admin.reviewPending") : tr(lang, "admin.reviewHidden")}
                        </span>
                      </div>
                    </div>
                    {review.title ? <p className="mt-2 text-[12px] font-semibold">{review.title}</p> : null}
                    <p className="mt-1 line-clamp-3 text-[11.5px] leading-relaxed text-muted">{review.body}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <form action={setReviewStatusAction}>
                        <input type="hidden" name="id" value={review.id} />
                        <input type="hidden" name="status" value="approved" />
                        <button type="submit" className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-600 transition hover:bg-emerald-500/20 dark:text-emerald-400">
                          {tr(lang, "admin.approve")}
                        </button>
                      </form>
                      <form action={setReviewStatusAction}>
                        <input type="hidden" name="id" value={review.id} />
                        <input type="hidden" name="status" value="hidden" />
                        <button type="submit" className="rounded-full border border-line px-2.5 py-1 text-[10px] font-bold text-muted transition hover:border-gold hover:text-gold">
                          {tr(lang, "admin.reject")}
                        </button>
                      </form>
                      <DeleteReviewButton id={review.id} />
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
