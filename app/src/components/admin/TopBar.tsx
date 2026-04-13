"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";

export default function TopBar() {
  const router = useRouter();
  const [profile, setProfile] = useState<{ email: string; image: string }>({ email: "", image: "" });

  useEffect(() => {
    fetch("/admin/api/settings")
      .then((r) => r.json())
      .then((s: Record<string, string>) => {
        setProfile({ email: s.contact_email || "", image: s.hero_image_path || "" });
      });
  }, []);

  async function handleLogout() {
    await fetch("/admin/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="h-16 bg-bg border-b border-border flex items-center justify-between px-6">
      <div />
      <div className="flex items-center gap-4">
        {profile.image && (
          <img
            src={profile.image}
            alt=""
            className="w-8 h-8 rounded-full object-cover border border-border"
          />
        )}
        {profile.email && (
          <span className="text-sm text-fg-muted hidden sm:block">{profile.email}</span>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-fg-muted hover:text-fg transition-colors"
        >
          <LogOut size={16} />
          Çıkış Yap
        </button>
      </div>
    </header>
  );
}
