import { getLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { getLocalizedField, ensureHtml } from "@/lib/utils";

export default async function AboutPage() {
  const locale = await getLocale();
  const t = await getTranslations("about");

  const page = await prisma.page.findUnique({ where: { slug: "about" } });

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-[family-name:var(--font-serif)] text-3xl font-bold text-fg text-center mb-12">
        {t("title")}
      </h1>

      {page && getLocalizedField(page, "content", locale) ? (
        <div
          className="prose prose-lg max-w-none text-fg prose-headings:font-[family-name:var(--font-serif)] prose-headings:text-fg prose-p:text-fg-muted"
          dangerouslySetInnerHTML={{ __html: ensureHtml(getLocalizedField(page, "content", locale)) }}
        />
      ) : (
        <p className="text-center text-fg-muted">İçerik yakında eklenecek.</p>
      )}
    </div>
  );
}
