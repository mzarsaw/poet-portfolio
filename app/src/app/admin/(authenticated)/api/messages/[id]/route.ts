import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath("/");
  return NextResponse.json({ success: true });
}
