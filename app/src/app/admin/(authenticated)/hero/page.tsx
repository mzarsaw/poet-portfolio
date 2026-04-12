"use client";

import { useState, useEffect } from "react";
import { BilingualInput } from "@/components/admin/BilingualInput";
import { Upload, Eye, EyeOff } from "lucide-react";

export default function HeroEditorPage() {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/admin/api/settings").then((r) => r.json()).then(setSettings);
  }, []);

  function update(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/admin/api/media", { method: "POST", body: formData });
    if (res.ok) {
      const data = await res.json();
      update("hero_image_path", data.filePath);
    }
    setUploading(false);
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

      {/* Preview */}
      {showPreview && (
        <div className="mb-8 bg-bg rounded-lg border border-border p-8 text-center">
          <p className="text-xs text-fg-muted mb-4">Önizleme</p>
          {settings.hero_image_path && (
            <div className="flex justify-center mb-6">
              <img
                src={settings.hero_image_path}
                alt="Portrait"
                className="w-40 h-40 rounded-full object-cover border-4 border-border"
              />
            </div>
          )}
          <h2 className="font-[family-name:var(--font-serif)] text-3xl font-bold text-fg mb-4">
            {settings.hero_statement_tr || "Başlık burada görünecek"}
          </h2>
          {settings.hero_intro_tr && (
            <p className="text-fg-muted max-w-2xl mx-auto whitespace-pre-line">
              {settings.hero_intro_tr}
            </p>
          )}
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
              <label className="flex items-center gap-2 px-4 py-2 bg-accent text-bg rounded-md hover:opacity-90 transition-opacity text-sm font-medium cursor-pointer">
                <Upload size={16} />
                {uploading ? "Yükleniyor..." : "Fotoğraf Yükle"}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
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
