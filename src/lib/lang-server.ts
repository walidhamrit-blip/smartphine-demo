import { cookies } from "next/headers";
import type { Lang } from "@/lib/i18n";

export const LANG_COOKIE = "mp_lang";

export async function getServerLang(): Promise<Lang> {
  const store = await cookies();
  return store.get(LANG_COOKIE)?.value === "ar" ? "ar" : "en";
}
