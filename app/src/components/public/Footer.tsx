import { useTranslations } from "next-intl";
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-border bg-bg mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-[family-name:var(--font-serif)] text-lg font-bold text-fg mb-2">
              Şair
            </h3>
            <p className="text-sm text-fg-muted">
              Kelimelerin sesi, hikayelerin nefesi.
            </p>
          </div>

          {/* Newsletter */}
          <div>
            <NewsletterForm />
          </div>

          {/* Social */}
          <div id="social-links" />
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-xs text-fg-muted">
            &copy; {new Date().getFullYear()} Şair. {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
