import { prisma } from "@/lib/prisma";
import { DeleteButton } from "@/components/admin/DeleteButton";

export default async function SubscribersPage() {
  const subscribers = await prisma.newsletterSubscriber.findMany({ orderBy: { subscribedAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-[family-name:var(--font-serif)] text-2xl font-bold text-fg">Aboneler</h1>
        <span className="text-sm text-fg-muted">{subscribers.length} abone</span>
      </div>
      <div className="bg-bg rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-bg-alt">
              <th className="text-left px-4 py-3 text-sm font-medium text-fg-muted">E-posta</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-fg-muted">Tarih</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-fg-muted">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.length === 0 ? (
              <tr><td colSpan={3} className="px-4 py-8 text-center text-fg-muted">Henüz abone yok.</td></tr>
            ) : (
              subscribers.map((sub) => (
                <tr key={sub.id} className="border-b border-border last:border-0 hover:bg-bg-alt transition-colors">
                  <td className="px-4 py-3 text-sm text-fg">{sub.email}</td>
                  <td className="px-4 py-3 text-sm text-fg-muted">{new Date(sub.subscribedAt).toLocaleDateString("tr-TR")}</td>
                  <td className="px-4 py-3 text-right">
                    <DeleteButton id={sub.id} endpoint="/admin/api/subscribers" />
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
