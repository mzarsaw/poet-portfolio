"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BilingualInput } from "@/components/admin/BilingualInput";
import { Upload, X } from "lucide-react";

export default function NewPoemPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    titleTr: "", titleEn: "", contentTr: "", contentEn: "",
    category: "", audioFilePath: "", featured: false, published: false,
  });

  async function handleAudioUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/admin/api/media", { method: "POST", body: formData });
    if (res.ok) {
      const data = await res.json();
      setForm((prev) => ({ ...prev, audioFilePath: data.filePath }));
    }
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/admin/api/poems", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push("/admin/poems");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-serif)] text-2xl font-bold text-fg mb-6">
        Yeni Şiir
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
          labelTr="İçerik" labelEn="Content"
          nameTr="contentTr" nameEn="contentEn"
          valueTr={form.contentTr} valueEn={form.contentEn}
          onChangeTr={(v) => setForm({ ...form, contentTr: v })}
          onChangeEn={(v) => setForm({ ...form, contentEn: v })}
          richText required
        />

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-fg mb-1">Kategori</label>
          <input
            id="category"
            type="text"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full max-w-xs px-3 py-2 border border-border rounded-md bg-bg text-fg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-fg mb-1">Ses Dosyası (Opsiyonel)</label>
          {form.audioFilePath ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-fg-muted">{form.audioFilePath}</span>
              <button type="button" onClick={() => setForm((prev) => ({ ...prev, audioFilePath: "" }))} className="p-1 text-red-400 hover:text-red-600">
                <X size={14} />
              </button>
            </div>
          ) : (
            <label className="flex items-center gap-2 px-4 py-2 border border-dashed border-border rounded-md cursor-pointer hover:bg-bg-alt transition-colors w-fit">
              <Upload size={16} />
              <span className="text-sm">{uploading ? "Yükleniyor..." : "Ses dosyası seç"}</span>
              <input type="file" accept="audio/*" onChange={handleAudioUpload} className="hidden" />
            </label>
          )}
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
          <button type="submit" disabled={loading} className="px-6 py-2 bg-accent text-bg rounded-md hover:opacity-90 transition-opacity text-sm font-medium disabled:opacity-50">
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
