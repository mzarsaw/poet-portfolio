"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BilingualInput } from "@/components/admin/BilingualInput";

export default function NewTestimonialPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", role: "", quoteTr: "", quoteEn: "",
    published: false, sortOrder: 0,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/admin/api/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) { router.push("/admin/testimonials"); router.refresh(); }
    setLoading(false);
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-serif)] text-2xl font-bold text-fg mb-6">Yeni Referans</h1>
      <form onSubmit={handleSubmit} className="bg-bg rounded-lg border border-border p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-fg mb-1">İsim <span className="text-red-500">*</span></label>
            <input id="name" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full px-3 py-2 border border-border rounded-md bg-bg text-fg focus:outline-none focus:ring-2 focus:ring-accent text-sm" />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-fg mb-1">Rol / Unvan</label>
            <input id="role" type="text" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-3 py-2 border border-border rounded-md bg-bg text-fg focus:outline-none focus:ring-2 focus:ring-accent text-sm" />
          </div>
        </div>
        <BilingualInput labelTr="Alıntı" labelEn="Quote" nameTr="quoteTr" nameEn="quoteEn" valueTr={form.quoteTr} valueEn={form.quoteEn} onChangeTr={(v) => setForm({ ...form, quoteTr: v })} onChangeEn={(v) => setForm({ ...form, quoteEn: v })} richText required />
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm text-fg">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Yayınla
          </label>
          <div>
            <label htmlFor="sortOrder" className="text-sm text-fg mr-2">Sıra:</label>
            <input id="sortOrder" type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} className="w-20 px-2 py-1 border border-border rounded-md bg-bg text-fg text-sm" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button type="submit" disabled={loading} className="px-6 py-2 bg-accent text-bg rounded-md hover:opacity-90 text-sm font-medium disabled:opacity-50">{loading ? "Kaydediliyor..." : "Kaydet"}</button>
          <button type="button" onClick={() => router.back()} className="px-6 py-2 border border-border text-fg rounded-md hover:bg-bg-alt text-sm">İptal</button>
        </div>
      </form>
    </div>
  );
}
