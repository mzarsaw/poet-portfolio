import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const password = process.env.ADMIN_PASSWORD || "admin123";

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash },
  });

  console.log(`Admin user seeded: ${email}`);

  const defaultSettings: Record<string, string> = {
    theme: "murekep",
    site_title_tr: "Şair Portfolyo",
    site_title_en: "Poet Portfolio",
    site_description_tr: "Şiir ve seslendirme portfolyosu",
    site_description_en: "Poetry and narration portfolio",
    contact_email: email,
    social_instagram: "",
    social_twitter: "",
    social_youtube: "",
    social_linkedin: "",
    hero_image_path: "",
    hero_statement_tr: "Kelimelerin sesi",
    hero_statement_en: "The voice of words",
  };

  for (const [key, value] of Object.entries(defaultSettings)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: {},
      create: { key, value },
    });
  }

  console.log("Default site settings seeded");

  const defaultPages = [
    {
      slug: "about",
      titleTr: "Hakkımda",
      titleEn: "About Me",
      contentTr: "",
      contentEn: "",
    },
    {
      slug: "equipment",
      titleTr: "Ekipman",
      titleEn: "Equipment",
      contentTr: "",
      contentEn: "",
    },
  ];

  for (const page of defaultPages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: {},
      create: page,
    });
  }

  console.log("Default pages seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
