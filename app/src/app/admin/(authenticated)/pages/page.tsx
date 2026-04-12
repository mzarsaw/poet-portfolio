import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Edit } from "lucide-react";

export default async function PagesListPage() {
  const pages = await prisma.page.findMany({ orderBy: { slug: "asc" } });

  return (
    <div>
      <h1 className="font-[family-name:var(--font-serif)] text-2xl font-bold text-fg mb-6">Sayfalar</h1>
      <div className="bg-bg rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-bg-alt">
              <th className="text-left px-4 py-3 text-sm font-medium text-fg-muted">Sayfa</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-fg-muted">Slug</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-fg-muted">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page.id} className="border-b border-border last:border-0 hover:bg-bg-alt transition-colors">
                <td className="px-4 py-3 text-sm text-fg">{page.titleTr}</td>
                <td className="px-4 py-3 text-sm text-fg-muted">{page.slug}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/pages/${page.slug}`} className="p-1 text-fg-muted hover:text-fg"><Edit size={16} /></Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
