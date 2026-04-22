export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { prisma } from "@/lib/prisma";

async function getSettingsMap() {
  const rows = await prisma.siteSetting.findMany();
  const s: Record<string, string> = {};
  for (const r of rows) s[r.key] = r.value;
  return s;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const s = await getSettingsMap();

  const title = s[`site_title_${locale}`] || s.site_title_tr || "Şair Portfolyo";
  const description = s[`site_description_${locale}`] || s.site_description_tr || "Şiir ve seslendirme portfolyosu";

  return {
    title: {
      default: title,
      template: `%s — ${title}`,
    },
    description,
  };
}

export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const [messages, s] = await Promise.all([
    getMessages(),
    getSettingsMap(),
  ]);

  const siteProps = {
    profileImage: s.hero_image_path || "",
    siteLogo: s[`site_logo_${locale}`] || s.site_logo_tr || s[`site_title_${locale}`] || s.site_title_tr || "",
    siteTagline: s[`site_tagline_${locale}`] || s.site_tagline_tr || "",
    socialInstagram: s.social_instagram || "",
    socialTwitter: s.social_twitter || "",
    socialYoutube: s.social_youtube || "",
    socialLinkedin: s.social_linkedin || "",
  };

  return (
    <NextIntlClientProvider messages={messages}>
      <Header profileImage={siteProps.profileImage} siteLogo={siteProps.siteLogo} />
      <main className="flex-1">{children}</main>
      <Footer
        siteLogo={siteProps.siteLogo}
        siteTagline={siteProps.siteTagline}
        socialInstagram={siteProps.socialInstagram}
        socialTwitter={siteProps.socialTwitter}
        socialYoutube={siteProps.socialYoutube}
        socialLinkedin={siteProps.socialLinkedin}
      />
    </NextIntlClientProvider>
  );
}
