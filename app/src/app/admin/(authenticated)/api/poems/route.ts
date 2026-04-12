import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { poemSchema } from "@/lib/validators";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function GET() {
  const poems = await prisma.poem.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(poems);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = poemSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Geçersiz veri" }, { status: 400 });
    }

    const data = parsed.data;
    let slug = slugify(data.titleTr);

    const existing = await prisma.poem.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const poem = await prisma.poem.create({
      data: { ...data, slug },
    });

    revalidatePath("/");
    return NextResponse.json(poem, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
