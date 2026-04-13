export const dynamic = "force-dynamic";

import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { prisma } from "@/lib/prisma";

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

  const messages = await getMessages();
  const heroImageSetting = await prisma.siteSetting.findUnique({ where: { key: "hero_image_path" } });
  const profileImage = heroImageSetting?.value || "";

  return (
    <NextIntlClientProvider messages={messages}>
      <Header profileImage={profileImage} />
      <main className="flex-1">{children}</main>
      <Footer />
    </NextIntlClientProvider>
  );
}
