import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { audioWorkSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";

export async function GET() {
  const works = await prisma.audioWork.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(works);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = audioWorkSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Geçersiz veri" }, { status: 400 });
    }

    const work = await prisma.audioWork.create({ data: parsed.data });
    revalidatePath("/");
    return NextResponse.json(work, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
