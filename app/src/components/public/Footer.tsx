import { useTranslations } from "next-intl";
import NewsletterForm from "./NewsletterForm";

interface FooterProps {
  siteLogo?: string;
  siteTagline?: string;
  socialInstagram?: string;
  socialTwitter?: string;
  socialYoutube?: string;
  socialLinkedin?: string;
}

export default function Footer({ siteLogo, siteTagline, socialInstagram, socialTwitter, socialYoutube, socialLinkedin }: FooterProps) {
  const t = useTranslations("footer");

  const socials = [
    { url: socialInstagram, label: "Instagram" },
    { url: socialTwitter, label: "Twitter / X" },
    { url: socialYoutube, label: "YouTube" },
    { url: socialLinkedin, label: "LinkedIn" },
  ].filter((s) => s.url);

  return (
    <footer className="border-t border-border bg-bg mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-[family-name:var(--font-serif)] text-lg font-bold text-fg mb-2">
              {siteLogo || "Şair"}
            </h3>
            {siteTagline && (
              <p className="text-sm text-fg-muted italic">{siteTagline}</p>
            )}
          </div>

          {/* Newsletter */}
          <div>
            <NewsletterForm />
          </div>

          {/* Social */}
          {socials.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-fg mb-3">{t("followMe")}</h4>
              <div className="flex flex-col gap-2">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-fg-muted hover:text-accent transition-colors"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-xs text-fg-muted">
            &copy; {new Date().getFullYear()} {siteLogo || "Şair"}. {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
