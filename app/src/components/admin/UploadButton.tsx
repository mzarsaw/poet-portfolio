"use client";

import { useState, useRef } from "react";
import { Upload } from "lucide-react";

interface UploadButtonProps {
  onUpload: (data: { filePath: string; filename: string; id: string }) => void;
  accept?: string;
  label?: string;
  multiple?: boolean;
}

export default function UploadButton({ onUpload, accept = "image/*,audio/*", label = "Dosya Yükle", multiple = false }: UploadButtonProps) {
  const [progress, setProgress] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      uploadFile(files[i]);
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  function uploadFile(file: File) {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", file);

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        setProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      setProgress(null);
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        onUpload(data);
      }
    });

    xhr.addEventListener("error", () => {
      setProgress(null);
    });

    xhr.open("POST", "/admin/api/media");
    xhr.send(formData);
    setProgress(0);
  }

  return (
    <div className="space-y-2">
      <label className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-bg rounded-md hover:opacity-90 transition-opacity text-sm font-medium cursor-pointer">
        <Upload size={16} />
        {progress !== null ? `%${progress}` : label}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFiles}
          className="hidden"
        />
      </label>
      {progress !== null && (
        <div className="w-48 h-1.5 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
