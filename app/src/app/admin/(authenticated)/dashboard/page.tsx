import { prisma } from "@/lib/prisma";
import { PenLine, Mic, Mail, Users } from "lucide-react";

async function getStats() {
  const [poemsCount, audioCount, messagesCount, subscribersCount, unreadMessages] =
    await Promise.all([
      prisma.poem.count(),
      prisma.audioWork.count(),
      prisma.contactMessage.count(),
      prisma.newsletterSubscriber.count(),
      prisma.contactMessage.count({ where: { read: false } }),
    ]);

  return { poemsCount, audioCount, messagesCount, subscribersCount, unreadMessages };
}

export default async function DashboardPage() {
  const stats = await getStats();

  const cards = [
    { label: "Şiirler", value: stats.poemsCount, icon: PenLine, color: "text-blue-600" },
    { label: "Sesli Eserler", value: stats.audioCount, icon: Mic, color: "text-green-600" },
    { label: "Mesajlar", value: stats.messagesCount, icon: Mail, color: "text-orange-600", badge: stats.unreadMessages },
    { label: "Aboneler", value: stats.subscribersCount, icon: Users, color: "text-purple-600" },
  ];

  return (
    <div>
      <h1 className="font-[family-name:var(--font-serif)] text-2xl font-bold text-fg mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-bg rounded-lg border border-border p-6 flex items-center gap-4"
            >
              <div className={`${card.color}`}>
                <Icon size={32} />
              </div>
              <div>
                <p className="text-2xl font-bold text-fg">
                  {card.value}
                  {card.badge ? (
                    <span className="ml-2 text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                      {card.badge} yeni
                    </span>
                  ) : null}
                </p>
                <p className="text-sm text-fg-muted">{card.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
