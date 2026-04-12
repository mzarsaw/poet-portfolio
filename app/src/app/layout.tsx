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

export const metadata: Metadata = {
  title: "Şair Portfolyo",
  description: "Şiir ve seslendirme portfolyosu",
};

async function getTheme() {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: "theme" },
    });
    return setting?.value || "murekep";
  } catch {
    return "murekep";
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = await getTheme();

  return (
    <html
      data-theme={theme}
      className={`${playfair.variable} ${montserrat.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
