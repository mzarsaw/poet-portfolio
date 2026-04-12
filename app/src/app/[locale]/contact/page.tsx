import { getTranslations } from "next-intl/server";
import ContactForm from "@/components/public/ContactForm";

export default async function ContactPage() {
  const t = await getTranslations("contact");

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="font-[family-name:var(--font-serif)] text-3xl font-bold text-fg text-center mb-12">
        {t("title")}
      </h1>

      <div className="flex justify-center">
        <ContactForm />
      </div>
    </div>
  );
}
