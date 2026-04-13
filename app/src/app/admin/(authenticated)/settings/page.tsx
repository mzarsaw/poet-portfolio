"use client";

import { useState, useEffect } from "react";
import { themes, type ThemeKey } from "@/lib/themes";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/admin/api/settings").then((res) => res.json()).then(setSettings);
  }, []);

  async function handleSave() {
    setLoading(true);
    setSaved(false);
    const res = await fetch("/admin/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    if (res.ok) setSaved(true);
    setLoading(false);
    setTimeout(() => setSaved(false), 3000);
  }

  function updateSetting(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  const inputClass = "w-full px-3 py-2 border border-border rounded-md bg-bg text-fg focus:outline-none focus:ring-2 focus:ring-accent text-sm";

  return (
    <div>
      <h1 className="font-[family-name:var(--font-serif)] text-2xl font-bold text-fg mb-6">Ayarlar</h1>

      <div className="space-y-8">
        {/* Theme */}
        <section className="bg-bg rounded-lg border border-border p-6">
          <h2 className="text-lg font-medium text-fg mb-4">Tema</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(Object.keys(themes) as ThemeKey[]).map((key) => {
              const theme = themes[key];
              const isActive = settings.theme === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => updateSetting("theme", key)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    isActive ? "border-accent ring-2 ring-accent/20" : "border-border hover:border-fg-muted"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex gap-1">
                      <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.colors.bg }} />
                      <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.colors.fg }} />
                      <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.colors.accent }} />
                    </div>
                    {isActive && <span className="text-xs bg-accent text-bg px-2 py-0.5 rounded-full">Aktif</span>}
                  </div>
                  <p className="font-medium text-fg">{theme.name}</p>
                  <p className="text-xs text-fg-muted">{theme.description}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Site Settings */}
        <section className="bg-bg rounded-lg border border-border p-6 space-y-4">
          <h2 className="text-lg font-medium text-fg mb-4">Site Bilgileri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-fg mb-1">Site Başlığı (TR)</label>
              <input value={settings.site_title_tr || ""} onChange={(e) => updateSetting("site_title_tr", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-fg mb-1">Site Title (EN)</label>
              <input value={settings.site_title_en || ""} onChange={(e) => updateSetting("site_title_en", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-fg mb-1">Site Açıklaması (TR)</label>
              <input value={settings.site_description_tr || ""} onChange={(e) => updateSetting("site_description_tr", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-fg mb-1">Site Description (EN)</label>
              <input value={settings.site_description_en || ""} onChange={(e) => updateSetting("site_description_en", e.target.value)} className={inputClass} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-fg mb-1">İletişim E-postası</label>
            <input value={settings.contact_email || ""} onChange={(e) => updateSetting("contact_email", e.target.value)} className={inputClass + " max-w-md"} />
          </div>
          <p className="text-sm text-fg-muted">
            Hero bölümü ayarları için{" "}
            <a href="/admin/hero" className="text-accent hover:underline">Hero Bölümü</a>{" "}
            sayfasını kullanın.
          </p>
        </section>

        {/* Social Links */}
        <section className="bg-bg rounded-lg border border-border p-6 space-y-4">
          <h2 className="text-lg font-medium text-fg mb-4">Sosyal Medya</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-fg mb-1">Instagram</label>
              <input value={settings.social_instagram || ""} onChange={(e) => updateSetting("social_instagram", e.target.value)} placeholder="https://instagram.com/..." className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-fg mb-1">Twitter / X</label>
              <input value={settings.social_twitter || ""} onChange={(e) => updateSetting("social_twitter", e.target.value)} placeholder="https://twitter.com/..." className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-fg mb-1">YouTube</label>
              <input value={settings.social_youtube || ""} onChange={(e) => updateSetting("social_youtube", e.target.value)} placeholder="https://youtube.com/..." className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-fg mb-1">LinkedIn</label>
              <input value={settings.social_linkedin || ""} onChange={(e) => updateSetting("social_linkedin", e.target.value)} placeholder="https://linkedin.com/..." className={inputClass} />
            </div>
          </div>
        </section>

        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2 bg-accent text-bg rounded-md hover:opacity-90 transition-opacity text-sm font-medium disabled:opacity-50"
          >
            {loading ? "Kaydediliyor..." : "Ayarları Kaydet"}
          </button>
          {saved && <span className="text-sm text-green-600">Kaydedildi!</span>}
        </div>

        {/* Change Password */}
        <section className="bg-bg rounded-lg border border-border p-6 space-y-4">
          <h2 className="text-lg font-medium text-fg mb-4">Şifre Değiştir</h2>
          <div className="max-w-md space-y-4">
            <div>
              <label className="block text-sm font-medium text-fg mb-1">Mevcut Şifre</label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-fg mb-1">Yeni Şifre</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-fg mb-1">Yeni Şifre (Tekrar)</label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                className={inputClass}
              />
            </div>
            {passwordMessage && (
              <p className={`text-sm ${passwordMessage.type === "success" ? "text-green-600" : "text-red-600"}`}>
                {passwordMessage.text}
              </p>
            )}
            <button
              onClick={async () => {
                setPasswordLoading(true);
                setPasswordMessage(null);
                try {
                  const res = await fetch("/admin/api/auth/change-password", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(passwordForm),
                  });
                  const data = await res.json();
                  if (res.ok) {
                    setPasswordMessage({ type: "success", text: "Şifre başarıyla değiştirildi" });
                    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                  } else {
                    setPasswordMessage({ type: "error", text: data.error || "Bir hata oluştu" });
                  }
                } catch {
                  setPasswordMessage({ type: "error", text: "Bir hata oluştu" });
                } finally {
                  setPasswordLoading(false);
                }
              }}
              disabled={passwordLoading || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
              className="px-6 py-2 bg-accent text-bg rounded-md hover:opacity-90 transition-opacity text-sm font-medium disabled:opacity-50"
            >
              {passwordLoading ? "Değiştiriliyor..." : "Şifreyi Değiştir"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
