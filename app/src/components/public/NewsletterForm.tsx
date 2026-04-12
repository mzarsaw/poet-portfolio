"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function NewsletterForm() {
  const t = useTranslations("newsletter");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setStatus(res.ok ? "success" : "error");
    if (res.ok) setEmail("");
    setTimeout(() => setStatus("idle"), 4000);
  }

  return (
    <div>
      <h3 className="text-sm font-medium text-fg mb-2">{t("title")}</h3>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("placeholder")}
          required
          className="flex-1 px-3 py-2 border border-border rounded-md bg-bg text-fg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-accent text-bg rounded-md hover:opacity-90 transition-opacity text-sm font-medium"
        >
          {t("subscribe")}
        </button>
      </form>
      {status === "success" && <p className="mt-2 text-xs text-green-600">{t("success")}</p>}
      {status === "error" && <p className="mt-2 text-xs text-red-600">{t("error")}</p>}
    </div>
  );
}
