import { getLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { getLocalizedField, stripHtml } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { Mic } from "lucide-react";

export default async function PoemsPage() {
  const locale = await getLocale();
  const t = await getTranslations("poems");

  const poems = await prisma.poem.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-[family-name:var(--font-serif)] text-3xl font-bold text-fg text-center mb-12">
        {t("title")}
      </h1>

      {poems.length === 0 ? (
        <p className="text-center text-fg-muted">{t("noPoems")}</p>
      ) : (
        <div className="space-y-8">
          {poems.map((poem) => (
            <Link
              key={poem.id}
              href={`/poems/${poem.id}`}
              className="block bg-bg-alt rounded-lg p-8 border border-border hover:border-accent transition-colors group"
            >
              <h2 className="font-[family-name:var(--font-serif)] text-xl font-bold text-fg group-hover:text-accent transition-colors mb-4">
                {getLocalizedField(poem, "title", locale)}
              </h2>
              <p className="text-fg-muted line-clamp-4 text-sm leading-relaxed">
                {stripHtml(getLocalizedField(poem, "content", locale)).substring(0, 250)}
              </p>
              <div className="flex items-center gap-3 mt-4">
                {poem.category && (
                  <span className="text-xs text-fg-muted border border-border rounded-full px-3 py-1">
                    {poem.category}
                  </span>
                )}
                {poem.audioFilePath && (
                  <span className="inline-flex items-center gap-1 text-xs text-accent">
                    <Mic size={12} /> Sesli
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
