import { getLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { getLocalizedField, stripHtml, ensureHtml } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import SectionDivider from "@/components/public/SectionDivider";
import AudioPlayer from "@/components/public/AudioPlayer";

export default async function HomePage() {
  const locale = await getLocale();
  const t = await getTranslations("home");

  const [featuredPoems, featuredAudio, settings] = await Promise.all([
    prisma.poem.findMany({ where: { published: true, featured: true }, take: 3, orderBy: { createdAt: "desc" } }),
    prisma.audioWork.findFirst({ where: { published: true, featured: true }, orderBy: { createdAt: "desc" } }),
    prisma.siteSetting.findMany(),
  ]);

  const settingsMap: Record<string, string> = {};
  for (const s of settings) settingsMap[s.key] = s.value;

  const heroStatement = settingsMap[`hero_statement_${locale}`] || settingsMap.hero_statement_tr || "";
  const heroIntro = settingsMap[`hero_intro_${locale}`] || settingsMap.hero_intro_tr || "";

  return (
    <div>
      {/* Hero */}
      <section className="py-20 sm:py-28 text-center px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-[family-name:var(--font-serif)] text-4xl sm:text-5xl lg:text-6xl font-bold text-fg leading-tight mb-6">
            {heroStatement || t("heroTitle")}
          </h1>
          {settingsMap.hero_image_path && (
            <div className="mt-8 flex justify-center">
              <img
                src={settingsMap.hero_image_path}
                alt=""
                className="w-40 h-40 rounded-full object-cover border-4 border-border"
              />
            </div>
          )}
          {heroIntro && (
            <div
              className="mt-6 text-lg text-fg-muted max-w-2xl mx-auto leading-relaxed prose prose-lg"
              dangerouslySetInnerHTML={{ __html: ensureHtml(heroIntro) }}
            />
          )}
        </div>
      </section>

      <SectionDivider />

      {/* Featured Audio */}
      {featuredAudio && (
        <section className="py-12 px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-[family-name:var(--font-serif)] text-2xl font-bold text-fg text-center mb-6">
              {t("latestAudio")}
            </h2>
            <div className="bg-bg-alt rounded-lg p-6 border border-border">
              <p className="text-lg font-medium text-fg mb-4">
                {getLocalizedField(featuredAudio, "title", locale)}
              </p>
              <AudioPlayer
                src={featuredAudio.filePath}
                title={getLocalizedField(featuredAudio, "title", locale)}
              />
            </div>
          </div>
        </section>
      )}

      <SectionDivider />

      {/* Featured Poems */}
      {featuredPoems.length > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-[family-name:var(--font-serif)] text-2xl font-bold text-fg">
                {t("featuredPoems")}
              </h2>
              <Link href="/poems" className="text-sm text-accent hover:underline">
                {t("viewAll")} &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredPoems.map((poem) => (
                <Link
                  key={poem.id}
                  href={`/poems/${poem.id}`}
                  className="bg-bg-alt rounded-lg p-6 border border-border hover:border-accent transition-colors group"
                >
                  <h3 className="font-[family-name:var(--font-serif)] text-lg font-bold text-fg group-hover:text-accent transition-colors mb-3">
                    {getLocalizedField(poem, "title", locale)}
                  </h3>
                  <p className="text-sm text-fg-muted line-clamp-4">
                    {stripHtml(getLocalizedField(poem, "content", locale)).substring(0, 150)}...
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
