"use client";

import { useState, useEffect } from "react";
import { BilingualInput } from "@/components/admin/BilingualInput";
import { Eye, EyeOff } from "lucide-react";
import UploadButton from "@/components/admin/UploadButton";

export default function HeroEditorPage() {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/admin/api/settings").then((r) => r.json()).then(setSettings);
  }, []);

  function update(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  function handleImageUpload(data: { filePath: string }) {
    update("hero_image_path", data.filePath);
  }

  async function handleSave() {
    setLoading(true);
    setSaved(false);
    const heroSettings = {
      hero_image_path: settings.hero_image_path || "",
      hero_statement_tr: settings.hero_statement_tr || "",
      hero_statement_en: settings.hero_statement_en || "",
      hero_intro_tr: settings.hero_intro_tr || "",
      hero_intro_en: settings.hero_intro_en || "",
    };
    const res = await fetch("/admin/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(heroSettings),
    });
    if (res.ok) setSaved(true);
    setLoading(false);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-[family-name:var(--font-serif)] text-2xl font-bold text-fg">
          Hero Bölümü
        </h1>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-2 text-sm text-fg-muted hover:text-fg transition-colors"
        >
          {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
          {showPreview ? "Önizlemeyi Gizle" : "Önizleme"}
        </button>
      </div>

      {/* Preview - matches homepage hero design */}
      {showPreview && (
        <div className="mb-8 bg-bg rounded-xl border border-border p-10 text-center overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.03] to-transparent pointer-events-none" />
          <p className="text-xs text-fg-muted mb-6 relative">Önizleme</p>
          <div className="relative">
            {settings.hero_image_path && (
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-br from-accent/20 via-accent/5 to-transparent rounded-full blur-md" />
                  <img
                    src={settings.hero_image_path}
                    alt="Portrait"
                    className="relative w-44 h-44 rounded-full object-cover border-2 border-accent/20 shadow-lg"
                  />
                </div>
              </div>
            )}
            {settings.site_logo_tr && (
              <p className="text-sm tracking-[0.3em] uppercase text-accent/70 font-medium mb-4">
                {settings.site_logo_tr}
              </p>
            )}
            <div className="mb-6">
              <span className="block text-accent/30 text-5xl font-[family-name:var(--font-serif)] leading-none select-none">&ldquo;</span>
              <h2 className="font-[family-name:var(--font-serif)] text-3xl font-bold text-fg italic -mt-4 px-4">
                {settings.hero_statement_tr || "Başlık burada görünecek"}
              </h2>
              <span className="block text-accent/30 text-5xl font-[family-name:var(--font-serif)] leading-none text-right select-none -mt-2">&rdquo;</span>
            </div>
            {settings.hero_intro_tr && (
              <div className="max-w-xl mx-auto">
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent mx-auto mb-6" />
                <div
                  className="text-fg-muted leading-relaxed prose mx-auto"
                  dangerouslySetInnerHTML={{ __html: settings.hero_intro_tr }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="space-y-8">
        {/* Portrait Photo */}
        <section className="bg-bg rounded-lg border border-border p-6">
          <h2 className="text-lg font-medium text-fg mb-4">Portre Fotoğrafı</h2>
          <div className="flex items-center gap-6">
            {settings.hero_image_path ? (
              <img
                src={settings.hero_image_path}
                alt="Portrait"
                className="w-24 h-24 rounded-full object-cover border-2 border-border"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-bg-alt border-2 border-dashed border-border flex items-center justify-center text-fg-muted text-xs">
                Fotoğraf
              </div>
            )}
            <div>
              <UploadButton
                accept="image/*"
                label="Fotoğraf Yükle"
                onUpload={handleImageUpload}
              />
              {settings.hero_image_path && (
                <button
                  type="button"
                  onClick={() => update("hero_image_path", "")}
                  className="mt-2 text-xs text-red-500 hover:underline"
                >
                  Fotoğrafı Kaldır
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Hero Statement */}
        <section className="bg-bg rounded-lg border border-border p-6 space-y-4">
          <h2 className="text-lg font-medium text-fg mb-4">Ana Başlık</h2>
          <BilingualInput
            labelTr="Başlık" labelEn="Statement"
            nameTr="hero_statement_tr" nameEn="hero_statement_en"
            valueTr={settings.hero_statement_tr || ""}
            valueEn={settings.hero_statement_en || ""}
            onChangeTr={(v) => update("hero_statement_tr", v)}
            onChangeEn={(v) => update("hero_statement_en", v)}
          />
        </section>

        {/* Brief Introduction */}
        <section className="bg-bg rounded-lg border border-border p-6 space-y-4">
          <h2 className="text-lg font-medium text-fg mb-4">Kısa Tanıtım</h2>
          <BilingualInput
            labelTr="Tanıtım" labelEn="Introduction"
            nameTr="hero_intro_tr" nameEn="hero_intro_en"
            valueTr={settings.hero_intro_tr || ""}
            valueEn={settings.hero_intro_en || ""}
            onChangeTr={(v) => update("hero_intro_tr", v)}
            onChangeEn={(v) => update("hero_intro_en", v)}
            richText
          />
        </section>

        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2 bg-accent text-bg rounded-md hover:opacity-90 transition-opacity text-sm font-medium disabled:opacity-50"
          >
            {loading ? "Kaydediliyor..." : "Kaydet"}
          </button>
          {saved && <span className="text-sm text-green-600">Kaydedildi!</span>}
        </div>
      </div>
    </div>
  );
}
