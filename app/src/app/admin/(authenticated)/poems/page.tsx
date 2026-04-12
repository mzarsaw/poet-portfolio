import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus, Edit, Trash2, Star, Mic } from "lucide-react";
import { DeleteButton } from "@/components/admin/DeleteButton";

export default async function PoemsListPage() {
  const poems = await prisma.poem.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-[family-name:var(--font-serif)] text-2xl font-bold text-fg">
          Şiirler
        </h1>
        <Link
          href="/admin/poems/new"
          className="flex items-center gap-2 px-4 py-2 bg-accent text-bg rounded-md hover:opacity-90 transition-opacity text-sm font-medium"
        >
          <Plus size={16} />
          Yeni Şiir
        </Link>
      </div>

      <div className="bg-bg rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-bg-alt">
              <th className="text-left px-4 py-3 text-sm font-medium text-fg-muted">Başlık (TR)</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-fg-muted">Kategori</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-fg-muted">Durum</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-fg-muted">Ses</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-fg-muted">Öne Çıkan</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-fg-muted">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {poems.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-fg-muted">
                  Henüz şiir eklenmemiş.
                </td>
              </tr>
            ) : (
              poems.map((poem) => (
                <tr key={poem.id} className="border-b border-border last:border-0 hover:bg-bg-alt transition-colors">
                  <td className="px-4 py-3 text-sm text-fg">{poem.titleTr}</td>
                  <td className="px-4 py-3 text-sm text-fg-muted">{poem.category || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${poem.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                      {poem.published ? "Yayında" : "Taslak"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {poem.audioFilePath && <Mic size={16} className="text-accent" />}
                  </td>
                  <td className="px-4 py-3">
                    {poem.featured && <Star size={16} className="text-yellow-500 fill-yellow-500" />}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/poems/${poem.id}`} className="p-1 text-fg-muted hover:text-fg">
                        <Edit size={16} />
                      </Link>
                      <DeleteButton id={poem.id} endpoint="/admin/api/poems" />
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
