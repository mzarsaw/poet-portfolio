"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function DeleteButton({ id, endpoint }: { id: string; endpoint: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Bu öğeyi silmek istediğinize emin misiniz?")) return;

    const res = await fetch(`${endpoint}/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    }
  }

  return (
    <button onClick={handleDelete} className="p-1 text-red-400 hover:text-red-600">
      <Trash2 size={16} />
    </button>
  );
}
