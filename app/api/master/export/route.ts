import { NextRequest, NextResponse } from "next/server";
import { getMasterRows } from "@/lib/dataCache";
import { filterMasterRows } from "@/lib/masterQuery";

export const dynamic = "force-dynamic";

const EXPORT_CAP = 20000;

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const all = await getMasterRows();
    const filtered = filterMasterRows(all, {
      q: sp.get("q") || undefined,
      cn: sp.get("cn") || undefined,
      moType: sp.get("moType") || undefined,
      statusEksekusi: sp.get("statusEksekusi") || undefined,
      statusItem: sp.get("statusItem") || undefined,
      moOpenClose: sp.get("moOpenClose") || undefined,
    });

    return NextResponse.json({
      rows: filtered.slice(0, EXPORT_CAP),
      total: filtered.length,
      truncated: filtered.length > EXPORT_CAP,
    });
  } catch (err) {
    console.error("[api/master/export] failed:", err);
    return NextResponse.json(
      { error: "Gagal menyiapkan data export." },
      { status: 502 }
    );
  }
}
