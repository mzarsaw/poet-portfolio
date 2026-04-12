import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteFile } from "@/lib/upload";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const media = await prisma.media.findUnique({ where: { id } });

  if (!media) {
    return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  }

  await deleteFile(media.filePath);
  await prisma.media.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
