import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus, Edit } from "lucide-react";
import { DeleteButton } from "@/components/admin/DeleteButton";

export default async function TestimonialsListPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-[family-name:var(--font-serif)] text-2xl font-bold text-fg">Referanslar</h1>
        <Link href="/admin/testimonials/new" className="flex items-center gap-2 px-4 py-2 bg-accent text-bg rounded-md hover:opacity-90 transition-opacity text-sm font-medium">
          <Plus size={16} /> Yeni Referans
        </Link>
      </div>

      <div className="bg-bg rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-bg-alt">
              <th className="text-left px-4 py-3 text-sm font-medium text-fg-muted">İsim</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-fg-muted">Rol</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-fg-muted">Durum</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-fg-muted">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-fg-muted">Henüz referans eklenmemiş.</td></tr>
            ) : (
              testimonials.map((t) => (
                <tr key={t.id} className="border-b border-border last:border-0 hover:bg-bg-alt transition-colors">
                  <td className="px-4 py-3 text-sm text-fg">{t.name}</td>
                  <td className="px-4 py-3 text-sm text-fg-muted">{t.role || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${t.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                      {t.published ? "Yayında" : "Taslak"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/testimonials/${t.id}`} className="p-1 text-fg-muted hover:text-fg"><Edit size={16} /></Link>
                      <DeleteButton id={t.id} endpoint="/admin/api/testimonials" />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
