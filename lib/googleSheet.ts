import { parseCsv } from "./csvParse";

export const SHEET_ID =
  process.env.SHEET_ID || "1jLfzddQ-XKN5So-hx-eetcBn0CLJS4Q5";

const GVIZ_BASE = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq`;
const EXPORT_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=xlsx`;

/**
 * Small tabs (RESUME PENYERAPAN, RESUME DASHBOARD) are unaffected by any
 * view filter set on MASTER, and CSV export via gviz is far cheaper than
 * pulling the whole workbook.
 */
export async function fetchSheetCsvRows(sheetName: string): Promise<string[][]> {
  const url = `${GVIZ_BASE}?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Gagal mengambil sheet "${sheetName}" (HTTP ${res.status})`);
  }
  const text = await res.text();
  return parseCsv(text);
}

/**
 * MASTER has an autofilter applied inside the spreadsheet, which gviz's CSV
 * export silently respects (it only returns currently-visible rows). The
 * only reliable way to read the true, unfiltered data is the full workbook
 * export, parsed with SheetJS.
 */
export async function fetchWorkbookArrayBuffer(): Promise<ArrayBuffer> {
  const res = await fetch(EXPORT_URL, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Gagal mengunduh workbook Google Sheets (HTTP ${res.status})`);
  }
  return res.arrayBuffer();
}
