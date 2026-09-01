import { NextRequest, NextResponse } from "next/server";
import { getMasterRows } from "@/lib/dataCache";
import { filterMasterRows, parseListParam } from "@/lib/masterQuery";

export const dynamic = "force-dynamic";

const EXPORT_CAP = 20000;

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const all = await getMasterRows();
    const filtered = filterMasterRows(all, {
      q: sp.get("q") || undefined,
      cn: sp.get("cn") || undefined,
      moType: parseListParam(sp.get("moType")),
      statusEksekusi: parseListParam(sp.get("statusEksekusi")),
      statusItem: parseListParam(sp.get("statusItem")),
      moOpenClose: parseListParam(sp.get("moOpenClose")),
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
