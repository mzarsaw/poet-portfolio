import { getLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { getLocalizedField, ensureHtml } from "@/lib/utils";
import { Quote } from "lucide-react";
import SectionDivider from "@/components/public/SectionDivider";

export default async function CreditsPage() {
  const locale = await getLocale();
  const t = await getTranslations("credits");

  const testimonials = await prisma.testimonial.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-[family-name:var(--font-serif)] text-3xl font-bold text-fg text-center mb-4">
        {t("title")}
      </h1>
      <p className="text-center text-fg-muted mb-12">{t("testimonials")}</p>

      <SectionDivider />

      {testimonials.length === 0 ? (
        <p className="text-center text-fg-muted mt-8">Henüz referans eklenmemiş.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-bg-alt rounded-lg p-6 border border-border"
            >
              <Quote size={24} className="text-accent opacity-40 mb-3" />
              <div
                className="text-fg italic leading-relaxed mb-4 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: "&ldquo;" + ensureHtml(getLocalizedField(testimonial, "quote", locale)) + "&rdquo;" }}
              />
              <div className="border-t border-border pt-3">
                <p className="text-sm font-medium text-fg">{testimonial.name}</p>
                {testimonial.role && (
                  <p className="text-xs text-fg-muted">{testimonial.role}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
