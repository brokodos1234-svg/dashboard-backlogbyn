import type { MasterFacets, MasterRow } from "./types";

export interface MasterFilterParams {
  q?: string;
  cn?: string;
  moType?: string;
  statusEksekusi?: string;
  statusItem?: string;
  moOpenClose?: string;
}

export function filterMasterRows(rows: MasterRow[], f: MasterFilterParams): MasterRow[] {
  const q = f.q?.trim().toLowerCase();
  return rows.filter((r) => {
    if (f.cn && r.cn !== f.cn) return false;
    if (f.moType && r.moType !== f.moType) return false;
    if (f.statusEksekusi && r.statusEksekusi !== f.statusEksekusi) return false;
    if (f.statusItem && r.statusItem !== f.statusItem) return false;
    if (f.moOpenClose && r.moOpenClose !== f.moOpenClose) return false;
    if (q) {
      const hay = `${r.reservation} ${r.mtcOrder} ${r.pr} ${r.po} ${r.cn} ${r.material} ${r.description} ${r.equipment}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

let facetCache: { key: number; facets: MasterFacets } | null = null;

export function buildFacets(rows: MasterRow[]): MasterFacets {
  if (facetCache && facetCache.key === rows.length) return facetCache.facets;

  const cnSet = new Set<string>();
  const moTypeSet = new Set<string>();
  const statusEksekusiSet = new Set<string>();
  const statusItemSet = new Set<string>();
  const moOpenCloseSet = new Set<string>();

  for (const r of rows) {
    if (r.cn) cnSet.add(r.cn);
    if (r.moType) moTypeSet.add(r.moType);
    if (r.statusEksekusi) statusEksekusiSet.add(r.statusEksekusi);
    if (r.statusItem) statusItemSet.add(r.statusItem);
    if (r.moOpenClose) moOpenCloseSet.add(r.moOpenClose);
  }

  const facets: MasterFacets = {
    cnOptions: Array.from(cnSet).sort(),
    moTypeOptions: Array.from(moTypeSet).sort(),
    statusEksekusiOptions: Array.from(statusEksekusiSet).sort(),
    statusItemOptions: Array.from(statusItemSet).sort(),
    moOpenCloseOptions: Array.from(moOpenCloseSet).sort(),
  };

  facetCache = { key: rows.length, facets };
  return facets;
}
