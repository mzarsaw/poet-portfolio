import { writeFile, unlink, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "./prisma";

const UPLOAD_DIR = path.join(process.cwd(), "public/uploads");

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_AUDIO_TYPES = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp4", "audio/x-m4a"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_AUDIO_SIZE = 50 * 1024 * 1024; // 50MB

export function getFileCategory(mimeType: string): "images" | "audio" | null {
  if (ALLOWED_IMAGE_TYPES.includes(mimeType)) return "images";
  if (ALLOWED_AUDIO_TYPES.includes(mimeType)) return "audio";
  return null;
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  const category = getFileCategory(file.type);
  if (!category) {
    return { valid: false, error: "Desteklenmeyen dosya tipi / Unsupported file type" };
  }
  const maxSize = category === "images" ? MAX_IMAGE_SIZE : MAX_AUDIO_SIZE;
  if (file.size > maxSize) {
    const maxMB = maxSize / (1024 * 1024);
    return { valid: false, error: `Dosya boyutu ${maxMB}MB limitini aşıyor / File exceeds ${maxMB}MB limit` };
  }
  return { valid: true };
}

export async function saveFile(file: File): Promise<{ filePath: string; filename: string }> {
  const category = getFileCategory(file.type);
  if (!category) throw new Error("Invalid file type");

  const ext = file.name.split(".").pop() || "bin";
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 10);
  const filename = `${timestamp}-${randomId}.${ext}`;
  const dir = path.join(UPLOAD_DIR, category);

  await mkdir(dir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), buffer);

  const filePath = `/uploads/${category}/${filename}`;
  return { filePath, filename };
}

export async function deleteFile(filePath: string): Promise<void> {
  const fullPath = path.join(process.cwd(), "public", filePath);
  try {
    await unlink(fullPath);
  } catch {
    // File may already be deleted
  }
}

export async function createMediaRecord(file: File, filePath: string, filename: string) {
  return prisma.media.create({
    data: {
      filename,
      filePath,
      fileType: file.type,
      fileSize: file.size,
      altText: "",
    },
  });
}
