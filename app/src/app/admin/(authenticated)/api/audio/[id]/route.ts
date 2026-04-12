import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { audioWorkSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const work = await prisma.audioWork.findUnique({ where: { id } });
  if (!work) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  return NextResponse.json(work);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = audioWorkSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Geçersiz veri" }, { status: 400 });
    }

    const work = await prisma.audioWork.update({ where: { id }, data: parsed.data });
    revalidatePath("/");
    return NextResponse.json(work);
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.audioWork.delete({ where: { id } });
  revalidatePath("/");
  return NextResponse.json({ success: true });
}
