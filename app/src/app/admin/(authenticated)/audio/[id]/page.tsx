"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { BilingualInput } from "@/components/admin/BilingualInput";

export default function EditAudioPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({
    titleTr: "", titleEn: "", descriptionTr: "", descriptionEn: "",
    filePath: "", category: "poetry", duration: 0,
    featured: false, published: false,
  });

  useEffect(() => {
    fetch(`/admin/api/audio/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          titleTr: data.titleTr || "", titleEn: data.titleEn || "",
          descriptionTr: data.descriptionTr || "", descriptionEn: data.descriptionEn || "",
          filePath: data.filePath || "", category: data.category || "poetry",
          duration: data.duration || 0, featured: data.featured || false, published: data.published || false,
        });
        setFetching(false);
      });
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/admin/api/audio/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push("/admin/audio");
      router.refresh();
    }
    setLoading(false);
  }

  if (fetching) return <div className="text-fg-muted">Yükleniyor...</div>;

  return (
    <div>
      <h1 className="font-[family-name:var(--font-serif)] text-2xl font-bold text-fg mb-6">
        Sesli Eser Düzenle
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-fg mb-1">Kategori</label>
            <select
              id="category" value={form.category}
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
              id="duration" type="number" value={form.duration}
              onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-border rounded-md bg-bg text-fg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm text-fg">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
            Yayınla
          </label>
          <label className="flex items-center gap-2 text-sm text-fg">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
            Öne Çıkar
          </label>
        </div>

        <p className="text-xs text-fg-muted">Dosya: {form.filePath}</p>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={loading} className="px-6 py-2 bg-accent text-bg rounded-md hover:opacity-90 transition-opacity text-sm font-medium disabled:opacity-50">
            {loading ? "Kaydediliyor..." : "Güncelle"}
          </button>
          <button type="button" onClick={() => router.back()} className="px-6 py-2 border border-border text-fg rounded-md hover:bg-bg-alt transition-colors text-sm">
            İptal
          </button>
        </div>
      </form>
    </div>
  );
}
