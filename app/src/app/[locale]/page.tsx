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

  const s: Record<string, string> = {};
  for (const setting of settings) s[setting.key] = setting.value;

  const heroStatement = s[`hero_statement_${locale}`] || s.hero_statement_tr || "";
  const heroIntro = s[`hero_intro_${locale}`] || s.hero_intro_tr || "";

  return (
    <div>
      {/* Hero */}
      <section className="relative py-24 sm:py-32 px-4 overflow-hidden">
        {/* Decorative gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.03] via-transparent to-transparent pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Portrait */}
          {s.hero_image_path && (
            <div className="mb-12 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-br from-accent/20 via-accent/5 to-transparent rounded-full blur-md" />
                <img
                  src={s.hero_image_path}
                  alt=""
                  className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full object-cover border-2 border-accent/20 shadow-lg"
                />
              </div>
            </div>
          )}

          {/* Poetic statement */}
          <div className="mb-10">
            <div className="inline-block">
              <span className="block text-accent/40 text-5xl sm:text-6xl font-[family-name:var(--font-serif)] leading-none select-none" aria-hidden="true">&ldquo;</span>
              <h1 className="font-[family-name:var(--font-serif)] text-3xl sm:text-4xl lg:text-5xl font-bold text-fg leading-snug -mt-4 italic">
                {heroStatement || t("heroTitle")}
              </h1>
              <span className="block text-accent/40 text-5xl sm:text-6xl font-[family-name:var(--font-serif)] leading-none text-right select-none -mt-2" aria-hidden="true">&rdquo;</span>
            </div>
          </div>

          {/* Brief intro */}
          {heroIntro && (
            <div className="max-w-2xl mx-auto">
              <div className="w-16 h-px bg-accent/30 mx-auto mb-8" />
              <div
                className="text-base sm:text-lg text-fg-muted leading-relaxed prose prose-lg mx-auto"
                dangerouslySetInnerHTML={{ __html: ensureHtml(heroIntro) }}
              />
            </div>
          )}
        </div>
      </section>

      <SectionDivider />

      {/* Featured Audio */}
      {featuredAudio && (
        <section className="py-16 px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-[family-name:var(--font-serif)] text-2xl font-bold text-fg text-center mb-8">
              {t("latestAudio")}
            </h2>
            <div className="bg-bg-alt/50 rounded-xl p-8 border border-border/60 backdrop-blur-sm">
              <p className="text-lg font-[family-name:var(--font-serif)] font-medium text-fg mb-5 text-center">
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
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-10">
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
                  className="group bg-bg rounded-xl p-6 border border-border/60 hover:border-accent/40 hover:shadow-md transition-all duration-300"
                >
                  <h3 className="font-[family-name:var(--font-serif)] text-lg font-bold text-fg group-hover:text-accent transition-colors mb-4">
                    {getLocalizedField(poem, "title", locale)}
                  </h3>
                  <div className="w-8 h-px bg-accent/30 mb-4" />
                  <p className="text-sm text-fg-muted leading-relaxed line-clamp-5 italic">
                    {stripHtml(getLocalizedField(poem, "content", locale)).substring(0, 180)}...
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
