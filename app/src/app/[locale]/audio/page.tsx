import { getLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { getLocalizedField, formatDuration, ensureHtml } from "@/lib/utils";
import AudioPlayer from "@/components/public/AudioPlayer";
import SectionDivider from "@/components/public/SectionDivider";

export default async function AudioPage() {
  const locale = await getLocale();
  const t = await getTranslations("audio");

  const audioWorks = await prisma.audioWork.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  const categories = ["poetry", "audiobook", "commercial"] as const;
  const categoryLabels: Record<string, string> = {
    poetry: t("poetry"),
    audiobook: t("audiobook"),
    commercial: t("commercial"),
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-[family-name:var(--font-serif)] text-3xl font-bold text-fg text-center mb-12">
        {t("title")}
      </h1>

      {audioWorks.length === 0 ? (
        <p className="text-center text-fg-muted">{t("noAudio")}</p>
      ) : (
        <div className="space-y-12">
          {categories.map((category) => {
            const works = audioWorks.filter((w) => w.category === category);
            if (works.length === 0) return null;

            return (
              <section key={category}>
                <h2 className="font-[family-name:var(--font-serif)] text-xl font-bold text-fg mb-6">
                  {categoryLabels[category]}
                </h2>
                <div className="space-y-4">
                  {works.map((work) => (
                    <div key={work.id} className="bg-bg-alt rounded-lg p-6 border border-border">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-medium text-fg">
                            {getLocalizedField(work, "title", locale)}
                          </h3>
                          {getLocalizedField(work, "description", locale) && (
                            <div
                              className="text-sm text-fg-muted mt-1 prose prose-sm max-w-none"
                              dangerouslySetInnerHTML={{ __html: ensureHtml(getLocalizedField(work, "description", locale)) }}
                            />
                          )}
                        </div>
                        {work.duration > 0 && (
                          <span className="text-xs text-fg-muted">
                            {t("duration")}: {formatDuration(work.duration)}
                          </span>
                        )}
                      </div>
                      <AudioPlayer
                        src={work.filePath}
                        title={getLocalizedField(work, "title", locale)}
                        compact
                      />
                    </div>
                  ))}
                </div>
                <SectionDivider />
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
