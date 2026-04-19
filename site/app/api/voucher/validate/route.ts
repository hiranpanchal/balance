export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code")?.trim().toUpperCase();

  if (!code) {
    return NextResponse.json({ valid: false, error: "No code provided" }, { status: 400 });
  }

  const voucher = await db.voucher.findUnique({ where: { code } });

  if (!voucher || !voucher.paid) {
    return NextResponse.json({ valid: false, error: "Voucher not found" });
  }

  if (voucher.redeemedAt) {
    return NextResponse.json({ valid: false, error: "Voucher has already been used" });
  }

  if (new Date() > voucher.expiresAt) {
    return NextResponse.json({ valid: false, error: "Voucher has expired" });
  }

  return NextResponse.json({
    valid: true,
    amountPence: voucher.amountPence,
    amountGbp: voucher.amountPence / 100,
  });
}
