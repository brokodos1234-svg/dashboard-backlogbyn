import { NextRequest, NextResponse } from "next/server";
import { getMasterRows } from "@/lib/dataCache";
import { filterMasterRows, buildFacets } from "@/lib/masterQuery";
import type { MasterQueryResult } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const page = Math.max(1, Number(sp.get("page") || 1));
    const pageSize = Math.min(200, Math.max(10, Number(sp.get("pageSize") || 50)));

    const all = await getMasterRows();
    const filtered = filterMasterRows(all, {
      q: sp.get("q") || undefined,
      cn: sp.get("cn") || undefined,
      moType: sp.get("moType") || undefined,
      statusEksekusi: sp.get("statusEksekusi") || undefined,
      statusItem: sp.get("statusItem") || undefined,
      moOpenClose: sp.get("moOpenClose") || undefined,
    });

    const start = (page - 1) * pageSize;
    const rows = filtered.slice(start, start + pageSize);

    const result: MasterQueryResult = {
      rows,
      total: filtered.length,
      page,
      pageSize,
      facets: buildFacets(all),
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error("[api/master] failed:", err);
    return NextResponse.json(
      { error: "Gagal mengambil data Master dari Google Sheets." },
      { status: 502 }
    );
  }
}
