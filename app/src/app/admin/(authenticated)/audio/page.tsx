import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus, Edit, Star } from "lucide-react";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { formatDuration } from "@/lib/utils";

export default async function AudioListPage() {
  const audioWorks = await prisma.audioWork.findMany({
    orderBy: { createdAt: "desc" },
  });

  const categoryLabels: Record<string, string> = {
    commercial: "Reklam",
    audiobook: "Sesli Kitap",
    poetry: "Şiir Seslendirme",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-[family-name:var(--font-serif)] text-2xl font-bold text-fg">
          Sesli Eserler
        </h1>
        <Link
          href="/admin/audio/new"
          className="flex items-center gap-2 px-4 py-2 bg-accent text-bg rounded-md hover:opacity-90 transition-opacity text-sm font-medium"
        >
          <Plus size={16} />
          Yeni Sesli Eser
        </Link>
      </div>

      <div className="bg-bg rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-bg-alt">
              <th className="text-left px-4 py-3 text-sm font-medium text-fg-muted">Başlık</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-fg-muted">Kategori</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-fg-muted">Süre</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-fg-muted">Durum</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-fg-muted">Öne Çıkan</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-fg-muted">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {audioWorks.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-fg-muted">
                  Henüz sesli eser eklenmemiş.
                </td>
              </tr>
            ) : (
              audioWorks.map((audio) => (
                <tr key={audio.id} className="border-b border-border last:border-0 hover:bg-bg-alt transition-colors">
                  <td className="px-4 py-3 text-sm text-fg">{audio.titleTr}</td>
                  <td className="px-4 py-3 text-sm text-fg-muted">{categoryLabels[audio.category] || audio.category}</td>
                  <td className="px-4 py-3 text-sm text-fg-muted">{formatDuration(audio.duration)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${audio.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                      {audio.published ? "Yayında" : "Taslak"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {audio.featured && <Star size={16} className="text-yellow-500 fill-yellow-500" />}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/audio/${audio.id}`} className="p-1 text-fg-muted hover:text-fg">
                        <Edit size={16} />
                      </Link>
                      <DeleteButton id={audio.id} endpoint="/admin/api/audio" />
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
