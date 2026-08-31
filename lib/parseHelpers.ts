export function toNumber(v: unknown): number {
  if (v === null || v === undefined) return 0;
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  let s = String(v).trim();
  if (s === "" || s === "-") return 0;
  s = s.replace(/rp/gi, "").replace(/[%]/g, "").trim();
  // Handles both "1,437,064,430" (US thousands) and "1.437,06" (ID) shaped strings.
  const hasComma = s.includes(",");
  const hasDot = s.includes(".");
  if (hasComma && hasDot) {
    if (s.lastIndexOf(",") > s.lastIndexOf(".")) {
      s = s.replace(/\./g, "").replace(",", ".");
    } else {
      s = s.replace(/,/g, "");
    }
  } else if (hasComma) {
    const parts = s.split(",");
    if (parts.length === 2 && parts[1].length <= 2) {
      s = s.replace(",", ".");
    } else {
      s = s.replace(/,/g, "");
    }
  }
  s = s.replace(/[^0-9.-]/g, "");
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
}

export function toPct(v: unknown): number {
  const n = toNumber(v);
  return n;
}

export function toStr(v: unknown): string {
  if (v === null || v === undefined) return "";
  return String(v).trim();
}

/** Parses loose M/D/YY(YY) style dates coming out of the sheet as text. */
export function parseSheetDate(v: unknown): Date | null {
  const s = toStr(v);
  if (!s || s === "-") return null;
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (m) {
    let [, mo, da, yr] = m;
    let year = parseInt(yr, 10);
    if (year < 100) year += 2000;
    const month = parseInt(mo, 10) - 1;
    const day = parseInt(da, 10);
    const d = new Date(Date.UTC(year, month, day));
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function agingDaysFrom(v: unknown, now = new Date()): number | null {
  const d = parseSheetDate(v);
  if (!d) return null;
  const ms = now.getTime() - d.getTime();
  return Math.max(0, Math.round(ms / 86400000));
}

export function formatRupiah(n: number): string {
  const rounded = Math.round(n);
  return "Rp " + rounded.toLocaleString("id-ID");
}

export function formatRupiahCompact(n: number): string {
  const abs = Math.abs(n);
  // Mirrors the source sheet's own convention (e.g. "Rp 1.829 jt" for a
  // 1.8-miliar figure) instead of switching to "M" too early.
  if (abs >= 1_000_000_000_000) return "Rp " + (n / 1_000_000_000_000).toFixed(2).replace(/\.00$/, "") + " T";
  if (abs >= 1_000_000) return "Rp " + (n / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 }) + " jt";
  if (abs >= 1_000) return "Rp " + (n / 1_000).toFixed(1).replace(/\.0$/, "") + " rb";
  return "Rp " + Math.round(n).toLocaleString("id-ID");
}

export function formatNumber(n: number): string {
  return Math.round(n).toLocaleString("id-ID");
}

export function formatPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}
