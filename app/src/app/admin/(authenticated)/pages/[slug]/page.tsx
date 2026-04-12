"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { BilingualInput } from "@/components/admin/BilingualInput";

export default function EditPagePage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({
    titleTr: "", titleEn: "", contentTr: "", contentEn: "",
    metaTitleTr: "", metaTitleEn: "", metaDescriptionTr: "", metaDescriptionEn: "",
  });

  useEffect(() => {
    fetch(`/admin/api/pages/${params.slug}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          titleTr: data.titleTr || "", titleEn: data.titleEn || "",
          contentTr: data.contentTr || "", contentEn: data.contentEn || "",
          metaTitleTr: data.metaTitleTr || "", metaTitleEn: data.metaTitleEn || "",
          metaDescriptionTr: data.metaDescriptionTr || "", metaDescriptionEn: data.metaDescriptionEn || "",
        });
        setFetching(false);
      });
  }, [params.slug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/admin/api/pages/${params.slug}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { router.push("/admin/pages"); router.refresh(); }
    setLoading(false);
  }

  if (fetching) return <div className="text-fg-muted">Yükleniyor...</div>;

  return (
    <div>
      <h1 className="font-[family-name:var(--font-serif)] text-2xl font-bold text-fg mb-6">Sayfa Düzenle</h1>
      <form onSubmit={handleSubmit} className="bg-bg rounded-lg border border-border p-6 space-y-6">
        <BilingualInput labelTr="Başlık" labelEn="Title" nameTr="titleTr" nameEn="titleEn" valueTr={form.titleTr} valueEn={form.titleEn} onChangeTr={(v) => setForm({ ...form, titleTr: v })} onChangeEn={(v) => setForm({ ...form, titleEn: v })} required />
        <BilingualInput labelTr="İçerik" labelEn="Content" nameTr="contentTr" nameEn="contentEn" valueTr={form.contentTr} valueEn={form.contentEn} onChangeTr={(v) => setForm({ ...form, contentTr: v })} onChangeEn={(v) => setForm({ ...form, contentEn: v })} richText />

        <hr className="border-border" />
        <h2 className="text-lg font-medium text-fg">SEO Ayarları</h2>
        <BilingualInput labelTr="Meta Başlık" labelEn="Meta Title" nameTr="metaTitleTr" nameEn="metaTitleEn" valueTr={form.metaTitleTr} valueEn={form.metaTitleEn} onChangeTr={(v) => setForm({ ...form, metaTitleTr: v })} onChangeEn={(v) => setForm({ ...form, metaTitleEn: v })} />
        <BilingualInput labelTr="Meta Açıklama" labelEn="Meta Description" nameTr="metaDescriptionTr" nameEn="metaDescriptionEn" valueTr={form.metaDescriptionTr} valueEn={form.metaDescriptionEn} onChangeTr={(v) => setForm({ ...form, metaDescriptionTr: v })} onChangeEn={(v) => setForm({ ...form, metaDescriptionEn: v })} multiline />

        <div className="flex items-center gap-3">
          <button type="submit" disabled={loading} className="px-6 py-2 bg-accent text-bg rounded-md hover:opacity-90 text-sm font-medium disabled:opacity-50">{loading ? "Kaydediliyor..." : "Güncelle"}</button>
          <button type="button" onClick={() => router.back()} className="px-6 py-2 border border-border text-fg rounded-md hover:bg-bg-alt text-sm">İptal</button>
        </div>
      </form>
    </div>
  );
}
