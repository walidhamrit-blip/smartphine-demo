import { describeDatabase } from "@/db";
import { tr } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";

/**
 * Shown on every page while DATABASE_URL is missing, so the empty catalog is
 * never a mystery. Renders nothing as soon as the variable is configured.
 */
export function DatabaseBanner({ lang }: { lang: Lang }) {
  const { configured } = describeDatabase();
  if (configured) {
    return null;
  }

  return (
    <div className="border-b border-amber-500/30 bg-amber-100/70 px-4 py-2.5 text-center text-[12px] leading-relaxed text-amber-900 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-100">
      <strong className="font-bold">{tr(lang, "db.banner.title")}</strong>
      <span className="mx-1.5 text-amber-700/60 dark:text-amber-200/40">·</span>
      {tr(lang, "db.banner.body")}
    </div>
  );
}
