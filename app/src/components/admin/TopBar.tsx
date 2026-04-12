"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function TopBar() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/admin/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="h-16 bg-bg border-b border-border flex items-center justify-between px-6">
      <div />
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-sm text-fg-muted hover:text-fg transition-colors"
      >
        <LogOut size={16} />
        Çıkış Yap
      </button>
    </header>
  );
}
