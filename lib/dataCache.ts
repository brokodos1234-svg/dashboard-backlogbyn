import { fetchWorkbookArrayBuffer } from "./googleSheet";
import {
  readWorkbook,
  sheetToRows,
  buildPenyerapanSummary,
  buildReadinessSummary,
  buildPriorityUnits,
  buildUnitBreakdown,
  parseMasterSheet,
  buildAlerts,
} from "./aggregate";
import type { DashboardBundle, MasterRow } from "./types";

const CACHE_TTL_MS = Number(process.env.CACHE_TTL_MS || 15 * 60 * 1000); // 15 minutes

interface FullData {
  bundle: DashboardBundle;
  master: MasterRow[];
}

let cache: { data: FullData | null; fetchedAt: number } = {
  data: null,
  fetchedAt: 0,
};
let inflight: Promise<FullData> | null = null;

async function loadFullData(): Promise<FullData> {
  const workbookBuf = await fetchWorkbookArrayBuffer();
  const wb = readWorkbook(workbookBuf);

  const penyerapanRows = sheetToRows(wb, "RESUME PENYERAPAN");
  const readinessRows = sheetToRows(wb, "RESUME DASHBOARD");

  const penyerapan = buildPenyerapanSummary(penyerapanRows);
  const readiness = buildReadinessSummary(readinessRows);
  const priorityUnits = buildPriorityUnits(readinessRows, 8);
  const moOpenList = buildPriorityUnits(readinessRows, Infinity);
  const unitBreakdown = buildUnitBreakdown(readinessRows);
  const master = parseMasterSheet(wb);
  const alerts = buildAlerts(master);

  const bundle: DashboardBundle = {
    fetchedAt: new Date().toISOString(),
    penyerapan,
    readiness,
    priorityUnits,
    moOpenList,
    unitBreakdown,
    alerts,
    previewRows: master.slice(0, 8),
    masterRowCount: master.length,
  };

  return { bundle, master };
}

function refresh(): Promise<FullData> {
  // De-duplicate concurrent callers (e.g. several visitors hitting a cold
  // cache at once) onto a single in-flight parse instead of each kicking
  // off their own ~20s workbook parse.
  if (!inflight) {
    inflight = loadFullData()
      .then((data) => {
        cache = { data, fetchedAt: Date.now() };
        inflight = null;
        return data;
      })
      .catch((err) => {
        inflight = null;
        throw err;
      });
  }
  return inflight;
}

export async function getFullData(): Promise<FullData> {
  const isStale = Date.now() - cache.fetchedAt > CACHE_TTL_MS;

  if (!cache.data) {
    return refresh();
  }

  if (isStale) {
    // Stale-while-revalidate: serve what we have, refresh in the background.
    refresh().catch((err) => {
      console.error("[dataCache] background refresh failed:", err);
    });
  }

  return cache.data;
}

export async function getDashboardBundle(): Promise<DashboardBundle> {
  const { bundle } = await getFullData();
  return bundle;
}

export async function getMasterRows(): Promise<MasterRow[]> {
  const { master } = await getFullData();
  return master;
}
