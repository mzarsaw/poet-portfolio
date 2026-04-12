"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PenLine,
  Mic,
  Quote,
  FileText,
  Image,
  Users,
  Mail,
  Settings,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/hero", label: "Hero Bölümü", icon: Sparkles },
  { href: "/admin/poems", label: "Şiirler", icon: PenLine },
  { href: "/admin/audio", label: "Sesli Eserler", icon: Mic },
  { href: "/admin/testimonials", label: "Referanslar", icon: Quote },
  { href: "/admin/pages", label: "Sayfalar", icon: FileText },
  { href: "/admin/media", label: "Medya", icon: Image },
  { href: "/admin/subscribers", label: "Aboneler", icon: Users },
  { href: "/admin/messages", label: "Mesajlar", icon: Mail },
  { href: "/admin/settings", label: "Ayarlar", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-bg border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="font-[family-name:var(--font-serif)] text-xl font-bold text-fg">
          Yönetim Paneli
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-bg"
                  : "text-fg-muted hover:bg-bg-alt hover:text-fg"
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-fg-muted hover:text-fg transition-colors"
        >
          Siteyi Görüntüle &rarr;
        </a>
      </div>
    </aside>
  );
}
