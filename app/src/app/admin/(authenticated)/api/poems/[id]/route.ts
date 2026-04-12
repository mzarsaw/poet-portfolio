import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { poemSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const poem = await prisma.poem.findUnique({ where: { id } });
  if (!poem) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  return NextResponse.json(poem);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = poemSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Geçersiz veri" }, { status: 400 });
    }

    const poem = await prisma.poem.update({
      where: { id },
      data: parsed.data,
    });

    revalidatePath("/");
    return NextResponse.json(poem);
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.poem.delete({ where: { id } });
  revalidatePath("/");
  return NextResponse.json({ success: true });
}
