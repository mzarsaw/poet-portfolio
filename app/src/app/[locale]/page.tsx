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
      {/* Hero — split layout */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.04] via-transparent to-accent/[0.02] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
            {/* Portrait side */}
            {s.hero_image_path && (
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="absolute -inset-3 bg-gradient-to-br from-accent/15 via-accent/5 to-transparent rounded-full blur-lg" />
                  <div className="absolute -inset-1 border border-accent/10 rounded-full" />
                  <img
                    src={s.hero_image_path}
                    alt={siteLogo}
                    className="relative w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 rounded-full object-cover border-2 border-accent/20 shadow-xl"
                  />
                </div>
              </div>
            )}

            {/* Text side */}
            <div className={`flex-1 ${s.hero_image_path ? "text-center md:text-left" : "text-center"}`}>
              {siteLogo && (
                <p className="text-xs tracking-[0.3em] uppercase text-accent/60 font-medium mb-4">
                  {siteLogo}
                </p>
              )}

              <div className="mb-6">
                <h1 className="font-[family-name:var(--font-serif)] text-3xl sm:text-4xl lg:text-5xl font-bold text-fg leading-snug italic">
                  <span className="text-accent/30 font-[family-name:var(--font-serif)]">&ldquo;</span>
                  {heroStatement || t("heroTitle")}
                  <span className="text-accent/30 font-[family-name:var(--font-serif)]">&rdquo;</span>
                </h1>
              </div>

              {heroIntro && (
                <>
                  <div className={`w-16 h-px bg-accent/20 mb-5 ${s.hero_image_path ? "mx-auto md:mx-0" : "mx-auto"}`} />
                  <div
                    className="text-base text-fg-muted leading-relaxed prose max-w-lg"
                    dangerouslySetInnerHTML={{ __html: ensureHtml(heroIntro) }}
                  />
                </>
              )}

              <div className={`mt-8 flex flex-wrap gap-3 ${s.hero_image_path ? "justify-center md:justify-start" : "justify-center"}`}>
                <Link
                  href="/poems"
                  className="px-7 py-2.5 bg-accent text-bg rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  {t("explorePoems")}
                </Link>
                <Link
                  href="/audio"
                  className="px-7 py-2.5 border border-accent/30 text-accent rounded-full text-sm font-medium hover:bg-accent/5 transition-colors"
                >
                  {t("listenNow")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Audio */}
      {featuredAudio && (
        <>
          <SectionDivider />
          <section className="py-14 px-4">
            <div className="max-w-2xl mx-auto">
              <h2 className="font-[family-name:var(--font-serif)] text-xl font-bold text-fg text-center mb-6">
                {t("latestAudio")}
              </h2>
              <div className="bg-bg-alt/50 rounded-2xl p-6 border border-border/50 shadow-sm">
                <p className="text-lg font-[family-name:var(--font-serif)] font-medium text-fg mb-4 text-center italic">
                  {getLocalizedField(featuredAudio, "title", locale)}
                </p>
                <AudioPlayer
                  src={featuredAudio.filePath}
                  title={getLocalizedField(featuredAudio, "title", locale)}
                />
              </div>
            </div>
          </section>
        </>
      )}

      {/* Featured Poems */}
      {featuredPoems.length > 0 && (
        <>
          <SectionDivider />
          <section className="py-14 px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="font-[family-name:var(--font-serif)] text-xl font-bold text-fg mb-2">
                  {t("featuredPoems")}
                </h2>
                <div className="w-10 h-px bg-accent/30 mx-auto" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredPoems.map((poem) => (
                  <Link
                    key={poem.id}
                    href={`/poems/${poem.id}`}
                    className="group block"
                  >
                    <div className="bg-bg rounded-xl p-6 border border-border/50 hover:border-accent/30 hover:shadow-lg transition-all duration-300 h-full">
                      <h3 className="font-[family-name:var(--font-serif)] text-base font-bold text-fg group-hover:text-accent transition-colors mb-3">
                        {getLocalizedField(poem, "title", locale)}
                      </h3>
                      <div className="w-6 h-px bg-accent/20 mb-3 group-hover:w-10 transition-all duration-300" />
                      <p className="text-sm text-fg-muted leading-relaxed line-clamp-5 font-[family-name:var(--font-serif)] italic">
                        {stripHtml(getLocalizedField(poem, "content", locale)).substring(0, 160)}...
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="text-center mt-8">
                <Link href="/poems" className="text-sm text-accent hover:underline font-medium">
                  {t("viewAll")} &rarr;
                </Link>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <>
          <SectionDivider />
          <section className="py-14 px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="font-[family-name:var(--font-serif)] text-xl font-bold text-fg mb-2">
                  {t("testimonials")}
                </h2>
                <div className="w-10 h-px bg-accent/30 mx-auto" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map((item) => (
                  <div key={item.id} className="bg-bg-alt/30 rounded-xl p-6 border border-border/40">
                    <div className="text-accent/30 text-2xl font-[family-name:var(--font-serif)] leading-none mb-2">&ldquo;</div>
                    <p className="text-sm text-fg-muted leading-relaxed italic mb-4">
                      {getLocalizedField(item, "quote", locale)}
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-px bg-accent/20" />
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
