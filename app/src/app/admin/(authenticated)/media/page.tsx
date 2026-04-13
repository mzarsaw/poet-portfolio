"use client";

import { useState, useEffect } from "react";
import { Trash2, Music } from "lucide-react";
import UploadButton from "@/components/admin/UploadButton";

interface MediaItem {
  id: string;
  filename: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
}

export default function MediaManagerPage() {
  const [items, setItems] = useState<MediaItem[]>([]);

  useEffect(() => {
    fetch("/admin/api/media").then((res) => res.json()).then(setItems);
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Bu dosyayı silmek istediğinize emin misiniz?")) return;
    const res = await fetch(`/admin/api/media/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-[family-name:var(--font-serif)] text-2xl font-bold text-fg">Medya</h1>
        <UploadButton
          accept="image/*,audio/*"
          multiple
          label="Dosya Yükle"
          onUpload={(data) => setItems((prev) => [data as unknown as MediaItem, ...prev])}
        />
      </div>

      {items.length === 0 ? (
        <div className="bg-bg rounded-lg border border-border p-12 text-center text-fg-muted">
          Henüz dosya yüklenmemiş.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-bg rounded-lg border border-border overflow-hidden group relative">
              <div className="aspect-square flex items-center justify-center bg-bg-alt">
                {item.fileType.startsWith("image/") ? (
                  <img src={item.filePath} alt={item.filename} className="w-full h-full object-cover" />
                ) : (
                  <Music size={32} className="text-fg-muted" />
                )}
              </div>
              <div className="p-2">
                <p className="text-xs text-fg truncate">{item.filename}</p>
                <p className="text-xs text-fg-muted">{formatSize(item.fileSize)}</p>
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
