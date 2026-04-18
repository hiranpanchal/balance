import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { put } from "@vercel/blob";

export async function GET(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const slot = searchParams.get("slot");

  const images = await db.image.findMany({
    where: slot ? { slot } : {},
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(images);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const slot = (formData.get("slot") as string) ?? "";
  const alt = (formData.get("alt") as string) ?? "";

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const blob = await put(file.name, file, { access: "public" });

  const image = await db.image.create({
    data: {
      url: blob.url,
      alt,
      slot,
      filename: file.name,
      size: file.size,
    },
  });

  return NextResponse.json(image, { status: 201 });
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  await db.image.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
