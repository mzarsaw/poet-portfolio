"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useTransition } from "react";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function switchLocale() {
    const nextLocale = locale === "tr" ? "en" : "tr";
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <button
      onClick={switchLocale}
      disabled={isPending}
      className="text-sm text-fg-muted hover:text-fg transition-colors border border-border rounded-md px-2 py-1"
    >
      {locale === "tr" ? "EN" : "TR"}
    </button>
  );
}
