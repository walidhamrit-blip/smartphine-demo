"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/admin/actions";
import { useSite } from "@/components/site-provider";
import { IconShield } from "@/components/ui";

export function AdminLogin() {
  const { t, lang } = useSite();
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {});

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-[1.6rem] border border-line bg-surface p-7">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-[color:var(--page)]">
          <IconShield className="h-6 w-6" />
        </span>
        <h1 className="mt-5 font-display text-3xl">{t("admin.loginTitle")}</h1>
        <p className="mt-2 text-[13px] leading-relaxed text-muted">{t("admin.loginSub")}</p>

        <form action={action} className="mt-6 space-y-3">
          <div>
            <label htmlFor="password" className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-muted">
              {t("admin.password")}
            </label>
            <input id="password" name="password" type="password" required className="field" placeholder="••••••••" autoComplete="current-password" />
          </div>
          {state.error ? <p className="text-xs font-semibold text-red-500">{t("admin.wrongPassword")}</p> : null}
          <button type="submit" disabled={pending} className="btn btn-primary w-full">
            {pending ? t("common.loading") : t("admin.signIn")}
          </button>
        </form>
        <p className="mt-4 rounded-xl bg-gold-soft/60 px-3 py-2 text-[11px] text-muted">
          {lang === "ar" ? "كلمة المرور التجريبية: " : "Demo password: "}
          <span className="font-mono font-bold text-ink">myphone2026</span>
        </p>
      </div>
    </div>
  );
}
