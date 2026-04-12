"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function ContactForm() {
  const t = useTranslations("contact");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", honeypot: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setStatus(res.ok ? "success" : "error");
    if (res.ok) setForm({ name: "", email: "", subject: "", message: "", honeypot: "" });
    setLoading(false);
  }

  const inputClass = "w-full px-4 py-2 border border-border rounded-md bg-bg text-fg focus:outline-none focus:ring-2 focus:ring-accent text-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      {/* Honeypot */}
      <div className="hidden" aria-hidden="true">
        <input
          type="text"
          name="honeypot"
          value={form.honeypot}
          onChange={(e) => setForm({ ...form, honeypot: e.target.value })}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-fg mb-1">{t("nameLabel")}</label>
        <input id="name" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className={inputClass} />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-fg mb-1">{t("emailLabel")}</label>
        <input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className={inputClass} />
      </div>
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-fg mb-1">{t("subjectLabel")}</label>
        <input id="subject" type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className={inputClass} />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-fg mb-1">{t("messageLabel")}</label>
        <textarea id="message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows={6} className={inputClass} />
      </div>
      <button type="submit" disabled={loading} className="px-6 py-2 bg-accent text-bg rounded-md hover:opacity-90 transition-opacity text-sm font-medium disabled:opacity-50">
        {loading ? "..." : t("submitButton")}
      </button>
      {status === "success" && <p className="text-sm text-green-600">{t("successMessage")}</p>}
      {status === "error" && <p className="text-sm text-red-600">{t("errorMessage")}</p>}
    </form>
  );
}
