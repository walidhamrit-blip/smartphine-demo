"use client";

import { deleteProductAction, deleteReviewAction } from "@/app/admin/actions";
import { useSite } from "@/components/site-provider";
import { IconTrash } from "@/components/ui";

export function DeleteProductButton({ id }: { id: number }) {
  const { t } = useSite();
  return (
    <form
      action={deleteProductAction}
      onSubmit={(event) => {
        if (!window.confirm(t("admin.confirmDelete"))) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line text-muted transition hover:border-red-400 hover:text-red-500" aria-label={t("common.delete")}>
        <IconTrash className="h-3.5 w-3.5" />
      </button>
    </form>
  );
}

export function DeleteReviewButton({ id }: { id: number }) {
  const { t } = useSite();
  return (
    <form action={deleteReviewAction}>
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="rounded-full border border-line px-2.5 py-1 text-[10px] font-bold text-muted transition hover:border-red-400 hover:text-red-500">
        {t("common.delete")}
      </button>
    </form>
  );
}
