import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { pageSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await prisma.page.findUnique({ where: { slug } });
  if (!page) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  return NextResponse.json(page);
}

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const parsed = pageSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Geçersiz veri" }, { status: 400 });
    const page = await prisma.page.update({ where: { slug }, data: parsed.data });
    revalidatePath("/");
    return NextResponse.json(page);
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
