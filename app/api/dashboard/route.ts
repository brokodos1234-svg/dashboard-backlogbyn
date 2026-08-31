import { NextResponse } from "next/server";
import { getDashboardBundle } from "@/lib/dataCache";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const bundle = await getDashboardBundle();
    return NextResponse.json(bundle);
  } catch (err) {
    console.error("[api/dashboard] failed:", err);
    return NextResponse.json(
      { error: "Gagal mengambil data dashboard dari Google Sheets." },
      { status: 502 }
    );
  }
}
