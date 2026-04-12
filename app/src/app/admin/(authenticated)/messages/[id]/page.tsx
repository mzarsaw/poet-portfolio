import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function MessageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const message = await prisma.contactMessage.findUnique({ where: { id } });

  if (!message) notFound();

  // Mark as read
  if (!message.read) {
    await prisma.contactMessage.update({ where: { id }, data: { read: true } });
  }

  return (
    <div>
      <Link href="/admin/messages" className="flex items-center gap-2 text-sm text-fg-muted hover:text-fg mb-6">
        <ArrowLeft size={16} /> Mesajlara Dön
      </Link>

      <div className="bg-bg rounded-lg border border-border p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-fg-muted">Gönderen</p>
            <p className="text-sm text-fg font-medium">{message.name}</p>
          </div>
          <div>
            <p className="text-xs text-fg-muted">E-posta</p>
            <p className="text-sm text-fg">{message.email}</p>
          </div>
          <div>
            <p className="text-xs text-fg-muted">Konu</p>
            <p className="text-sm text-fg">{message.subject || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-fg-muted">Tarih</p>
            <p className="text-sm text-fg">{new Date(message.createdAt).toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
          </div>
        </div>
        <hr className="border-border" />
        <div>
          <p className="text-xs text-fg-muted mb-2">Mesaj</p>
          <p className="text-sm text-fg whitespace-pre-wrap">{message.message}</p>
        </div>
      </div>
    </div>
  );
}
