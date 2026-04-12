"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BilingualInput } from "@/components/admin/BilingualInput";
import { Upload } from "lucide-react";

export default function NewAudioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    titleTr: "", titleEn: "", descriptionTr: "", descriptionEn: "",
    filePath: "", category: "poetry", duration: 0,
    featured: false, published: false,
  });

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/admin/api/media", { method: "POST", body: formData });
    if (res.ok) {
      const data = await res.json();
      setForm((prev) => ({ ...prev, filePath: data.filePath }));
    }
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/admin/api/audio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push("/admin/audio");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-serif)] text-2xl font-bold text-fg mb-6">
        Yeni Sesli Eser
      </h1>

      <form onSubmit={handleSubmit} className="bg-bg rounded-lg border border-border p-6 space-y-6">
        <BilingualInput
          labelTr="Başlık" labelEn="Title"
          nameTr="titleTr" nameEn="titleEn"
          valueTr={form.titleTr} valueEn={form.titleEn}
          onChangeTr={(v) => setForm({ ...form, titleTr: v })}
          onChangeEn={(v) => setForm({ ...form, titleEn: v })}
          required
        />

        <BilingualInput
          labelTr="Açıklama" labelEn="Description"
          nameTr="descriptionTr" nameEn="descriptionEn"
          valueTr={form.descriptionTr} valueEn={form.descriptionEn}
          onChangeTr={(v) => setForm({ ...form, descriptionTr: v })}
          onChangeEn={(v) => setForm({ ...form, descriptionEn: v })}
          richText
        />

        <div>
          <label className="block text-sm font-medium text-fg mb-1">
            Ses Dosyası <span className="text-red-500">*</span>
          </label>
          <label className="flex items-center gap-2 px-4 py-2 border border-dashed border-border rounded-md cursor-pointer hover:bg-bg-alt transition-colors w-fit">
            <Upload size={16} />
            <span className="text-sm">{uploading ? "Yükleniyor..." : form.filePath ? "Dosya yüklendi" : "Dosya seç"}</span>
            <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
          </label>
          {form.filePath && <p className="mt-1 text-xs text-fg-muted">{form.filePath}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-fg mb-1">Kategori</label>
            <select
              id="category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md bg-bg text-fg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
            >
              <option value="poetry">Şiir Seslendirme</option>
              <option value="audiobook">Sesli Kitap</option>
              <option value="commercial">Reklam</option>
            </select>
          </div>
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-fg mb-1">Süre (saniye)</label>
            <input
              id="duration"
              type="number"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-border rounded-md bg-bg text-fg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm text-fg">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="rounded border-border" />
            Yayınla
          </label>
          <label className="flex items-center gap-2 text-sm text-fg">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded border-border" />
            Öne Çıkar
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={loading || !form.filePath} className="px-6 py-2 bg-accent text-bg rounded-md hover:opacity-90 transition-opacity text-sm font-medium disabled:opacity-50">
            {loading ? "Kaydediliyor..." : "Kaydet"}
          </button>
          <button type="button" onClick={() => router.back()} className="px-6 py-2 border border-border text-fg rounded-md hover:bg-bg-alt transition-colors text-sm">
            İptal
          </button>
        </div>
      </form>
    </div>
  );
}
