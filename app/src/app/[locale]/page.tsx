import { getLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { getLocalizedField, stripHtml, ensureHtml } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import SectionDivider from "@/components/public/SectionDivider";
import AudioPlayer from "@/components/public/AudioPlayer";

export default async function HomePage() {
  const locale = await getLocale();
  const t = await getTranslations("home");

  const [featuredPoems, featuredAudio, testimonials, settings] = await Promise.all([
    prisma.poem.findMany({ where: { published: true, featured: true }, take: 3, orderBy: { createdAt: "desc" } }),
    prisma.audioWork.findFirst({ where: { published: true, featured: true }, orderBy: { createdAt: "desc" } }),
    prisma.testimonial.findMany({ where: { published: true }, take: 3, orderBy: { sortOrder: "asc" } }),
    prisma.siteSetting.findMany(),
  ]);

  const s: Record<string, string> = {};
  for (const setting of settings) s[setting.key] = setting.value;

  const heroStatement = s[`hero_statement_${locale}`] || s.hero_statement_tr || "";
  const heroIntro = s[`hero_intro_${locale}`] || s.hero_intro_tr || "";
  const siteLogo = s[`site_logo_${locale}`] || s.site_logo_tr || s[`site_title_${locale}`] || s.site_title_tr || "";

  return (
    <div>
      {/* Hero */}
      <section className="relative py-24 sm:py-36 px-4 overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.04] via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/[0.03] rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Portrait */}
          {s.hero_image_path && (
            <div className="mb-14 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-3 bg-gradient-to-br from-accent/20 via-accent/5 to-transparent rounded-full blur-lg" />
                <div className="absolute -inset-1 border border-accent/10 rounded-full" />
                <img
                  src={s.hero_image_path}
                  alt={siteLogo}
                  className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full object-cover border-2 border-accent/20 shadow-xl"
                />
              </div>
            </div>
          )}

          {/* Poet name */}
          {siteLogo && (
            <p className="text-sm tracking-[0.3em] uppercase text-accent/70 font-medium mb-6">
              {siteLogo}
            </p>
          )}

          {/* Poetic statement */}
          <div className="mb-12">
            <span className="block text-accent/30 text-6xl sm:text-7xl font-[family-name:var(--font-serif)] leading-none select-none" aria-hidden="true">&ldquo;</span>
            <h1 className="font-[family-name:var(--font-serif)] text-3xl sm:text-4xl lg:text-5xl font-bold text-fg leading-snug -mt-6 italic px-4">
              {heroStatement || t("heroTitle")}
            </h1>
            <span className="block text-accent/30 text-6xl sm:text-7xl font-[family-name:var(--font-serif)] leading-none text-right select-none -mt-3 pr-8" aria-hidden="true">&rdquo;</span>
          </div>

          {/* Brief intro */}
          {heroIntro && (
            <div className="max-w-2xl mx-auto">
              <div className="w-20 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent mx-auto mb-8" />
              <div
                className="text-base sm:text-lg text-fg-muted leading-relaxed prose prose-lg mx-auto"
                dangerouslySetInnerHTML={{ __html: ensureHtml(heroIntro) }}
              />
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/poems"
              className="px-8 py-3 bg-accent text-bg rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
            >
              {t("explorePoems")}
            </Link>
            <Link
              href="/audio"
              className="px-8 py-3 border border-accent/30 text-accent rounded-full text-sm font-medium hover:bg-accent/5 transition-colors"
            >
              {t("listenNow")}
            </Link>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Featured Audio */}
      {featuredAudio && (
        <section className="py-20 px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-[family-name:var(--font-serif)] text-2xl font-bold text-fg text-center mb-10">
              {t("latestAudio")}
            </h2>
            <div className="bg-bg-alt/50 rounded-2xl p-8 border border-border/50 shadow-sm">
              <p className="text-lg font-[family-name:var(--font-serif)] font-medium text-fg mb-5 text-center italic">
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

      {featuredAudio && <SectionDivider />}

      {/* Featured Poems */}
      {featuredPoems.length > 0 && (
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-[family-name:var(--font-serif)] text-2xl font-bold text-fg mb-3">
                {t("featuredPoems")}
              </h2>
              <div className="w-12 h-px bg-accent/30 mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredPoems.map((poem) => (
                <Link
                  key={poem.id}
                  href={`/poems/${poem.id}`}
                  className="group block"
                >
                  <div className="bg-bg rounded-2xl p-7 border border-border/50 hover:border-accent/30 hover:shadow-lg transition-all duration-300 h-full">
                    <h3 className="font-[family-name:var(--font-serif)] text-lg font-bold text-fg group-hover:text-accent transition-colors mb-4">
                      {getLocalizedField(poem, "title", locale)}
                    </h3>
                    <div className="w-8 h-px bg-accent/20 mb-4 group-hover:w-12 transition-all duration-300" />
                    <p className="text-sm text-fg-muted leading-relaxed line-clamp-6 font-[family-name:var(--font-serif)] italic">
                      {stripHtml(getLocalizedField(poem, "content", locale)).substring(0, 200)}...
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/poems" className="text-sm text-accent hover:underline font-medium">
                {t("viewAll")} &rarr;
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <>
          <SectionDivider />
          <section className="py-20 px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-[family-name:var(--font-serif)] text-2xl font-bold text-fg mb-3">
                  {t("testimonials")}
                </h2>
                <div className="w-12 h-px bg-accent/30 mx-auto" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((item) => (
                  <div key={item.id} className="bg-bg-alt/30 rounded-2xl p-7 border border-border/40">
                    <div className="text-accent/30 text-3xl font-[family-name:var(--font-serif)] leading-none mb-3">&ldquo;</div>
                    <p className="text-sm text-fg-muted leading-relaxed italic mb-5">
                      {getLocalizedField(item, "quote", locale)}
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-px bg-accent/20" />
                      <div>
                        <p className="text-sm font-medium text-fg">{item.name}</p>
                        {item.role && <p className="text-xs text-fg-muted">{item.role}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
