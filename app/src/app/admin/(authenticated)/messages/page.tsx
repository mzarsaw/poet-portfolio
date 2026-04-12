import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Mail, MailOpen } from "lucide-react";
import { DeleteButton } from "@/components/admin/DeleteButton";

export default async function MessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="font-[family-name:var(--font-serif)] text-2xl font-bold text-fg mb-6">Mesajlar</h1>
      <div className="bg-bg rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-bg-alt">
              <th className="w-8 px-4 py-3"></th>
              <th className="text-left px-4 py-3 text-sm font-medium text-fg-muted">Gönderen</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-fg-muted">E-posta</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-fg-muted">Konu</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-fg-muted">Tarih</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-fg-muted">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {messages.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-fg-muted">Henüz mesaj yok.</td></tr>
            ) : (
              messages.map((msg) => (
                <tr key={msg.id} className={`border-b border-border last:border-0 hover:bg-bg-alt transition-colors ${!msg.read ? "font-medium" : ""}`}>
                  <td className="px-4 py-3">{msg.read ? <MailOpen size={16} className="text-fg-muted" /> : <Mail size={16} className="text-accent" />}</td>
                  <td className="px-4 py-3 text-sm text-fg">{msg.name}</td>
                  <td className="px-4 py-3 text-sm text-fg-muted">{msg.email}</td>
                  <td className="px-4 py-3 text-sm text-fg-muted">{msg.subject || "—"}</td>
                  <td className="px-4 py-3 text-sm text-fg-muted">{new Date(msg.createdAt).toLocaleDateString("tr-TR")}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/messages/${msg.id}`} className="text-xs text-accent hover:underline">Görüntüle</Link>
                      <DeleteButton id={msg.id} endpoint="/admin/api/messages" />
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
