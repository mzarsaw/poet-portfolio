import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateFile, saveFile, createMediaRecord } from "@/lib/upload";

export async function GET() {
  const items = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Dosya gereklidir" }, { status: 400 });
    }

    const validation = validateFile(file);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { filePath, filename } = await saveFile(file);
    const record = await createMediaRecord(file, filePath, filename);

    return NextResponse.json(record, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Yükleme hatası" }, { status: 500 });
  }
}
