export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import { prisma } from "@/lib/prisma";

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-serif",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

async function getSettings() {
  try {
    const rows = await prisma.siteSetting.findMany();
    const s: Record<string, string> = {};
    for (const r of rows) s[r.key] = r.value;
    return s;
  } catch {
    return {} as Record<string, string>;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    title: s.site_title_tr || "Şair Portfolyo",
    description: s.site_description_tr || "Şiir ve seslendirme portfolyosu",
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const s = await getSettings();
  const theme = s.theme || "murekep";

  return (
    <html
      data-theme={theme}
      className={`${playfair.variable} ${montserrat.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
