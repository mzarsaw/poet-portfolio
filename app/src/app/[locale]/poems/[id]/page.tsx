import { getLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { getLocalizedField, ensureHtml } from "@/lib/utils";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import SectionDivider from "@/components/public/SectionDivider";
import AudioPlayer from "@/components/public/AudioPlayer";

export default async function PoemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const locale = await getLocale();
  const t = await getTranslations("common");

  const poem = await prisma.poem.findUnique({ where: { id } });
  if (!poem || !poem.published) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/poems" className="inline-flex items-center gap-2 text-sm text-fg-muted hover:text-fg mb-8">
        <ArrowLeft size={16} /> {t("back")}
      </Link>

      <article className="text-center">
        <h1 className="font-[family-name:var(--font-serif)] text-3xl sm:text-4xl font-bold text-fg mb-4">
          {getLocalizedField(poem, "title", locale)}
        </h1>

        {poem.category && (
          <span className="inline-block text-xs text-fg-muted border border-border rounded-full px-3 py-1 mb-8">
            {poem.category}
          </span>
        )}

        <SectionDivider />

        <div
          className="poem-content prose prose-lg mx-auto text-fg mt-8"
          dangerouslySetInnerHTML={{ __html: ensureHtml(getLocalizedField(poem, "content", locale)) }}
        />
      </article>

      {poem.audioFilePath && (
        <div className="mt-12 max-w-2xl mx-auto">
          <AudioPlayer
            src={poem.audioFilePath}
            title={getLocalizedField(poem, "title", locale)}
          />
        </div>
      )}
    </div>
  );
}
