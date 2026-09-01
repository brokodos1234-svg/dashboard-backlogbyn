import * as XLSX from "xlsx";
import { cell } from "./csvParse";
import { toNumber, toStr, agingDaysFrom } from "./parseHelpers";
import {
  MONTHS_ID,
  type CategoryRow,
  type MonthlyTrendPoint,
  type PenyerapanSummary,
  type ReadinessSummary,
  type PriorityUnit,
  type UnitBreakdownRow,
  type MasterRow,
  type AlertItem,
} from "./types";

export function readWorkbook(buf: ArrayBuffer): XLSX.WorkBook {
  return XLSX.read(buf, {
    type: "array",
    cellDates: false,
    dense: true,
    sheets: ["RESUME PENYERAPAN", "RESUME DASHBOARD", "MASTER"],
  });
}

export function sheetToRows(wb: XLSX.WorkBook, sheetName: string): string[][] {
  const ws = wb.Sheets[sheetName];
  if (!ws) throw new Error(`Sheet "${sheetName}" tidak ditemukan pada workbook.`);

  // Force the range to always start at column A / row 1: when a sheet's real
  // content starts further right (e.g. "B1:S32"), sheet_to_json's dense
  // array is indexed relative to that starting column instead of absolute
  // column A, silently shifting every column lookup by however many columns
  // were skipped.
  const ref = ws["!ref"];
  let range: string | undefined;
  if (ref) {
    const decoded = XLSX.utils.decode_range(ref);
    range = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: decoded.e });
  }

  return XLSX.utils.sheet_to_json<string[]>(ws, {
    header: 1,
    defval: "",
    raw: false,
    blankrows: true,
    range,
  });
}

export function buildPenyerapanSummary(rows: string[][]): PenyerapanSummary {
  const catDefs: { rowNum: number; key: CategoryRow["key"] }[] = [
    { rowNum: 13, key: "1. BACKLOG" },
    { rowNum: 14, key: "2. SCHEDULE PCR" },
    { rowNum: 15, key: "3. CAPITALIZE" },
  ];

  const categories: CategoryRow[] = catDefs.map(({ rowNum, key }) => ({
    key,
    label: toStr(cell(rows, rowNum, "B")) || key,
    mo: toNumber(cell(rows, rowNum, "C")),
    item: toNumber(cell(rows, rowNum, "D")),
    value: toNumber(cell(rows, rowNum, "E")),
    pct: toNumber(cell(rows, rowNum, "F")),
    avgPerMo: toNumber(cell(rows, rowNum, "G")),
  }));

  const totalValue = toNumber(cell(rows, 16, "E"));
  const totalMo = toNumber(cell(rows, 16, "C"));
  const totalItem = toNumber(cell(rows, 16, "D"));

  const monthlyTrend: MonthlyTrendPoint[] = MONTHS_ID.map((month, i) => {
    const rowNum = 11 + i; // row 11 = Januari ... row 22 = Desember
    const backlog = toNumber(cell(rows, rowNum, "Q")) * 1_000_000;
    const schedulePcr = toNumber(cell(rows, rowNum, "R")) * 1_000_000;
    const capitalize = toNumber(cell(rows, rowNum, "S")) * 1_000_000;
    return {
      month,
      backlog,
      schedulePcr,
      capitalize,
      total: backlog + schedulePcr + capitalize,
    };
  });

  return {
    updateLabel: toStr(cell(rows, 4, "B")),
    totalValue,
    totalMo,
    totalItem,
    categories,
    monthlyTrend,
  };
}

export function buildReadinessSummary(rows: string[][]): ReadinessSummary {
  const statusRunningLabels = ["RUNNING", "NO RUNNING", "DISASSEMBLY", "CLOSE DEMOB", "NON EXIST"];
  const statusRunning = statusRunningLabels.map((label, i) => {
    const rowNum = 17 + i;
    return {
      label: toStr(cell(rows, rowNum, "Y")) || label,
      open: toNumber(cell(rows, rowNum, "Z")),
      close: toNumber(cell(rows, rowNum, "AA")),
    };
  });

  return {
    totalUnit: toNumber(cell(rows, 6, "A")),
    totalMo: toNumber(cell(rows, 6, "B")),
    totalItem: toNumber(cell(rows, 6, "C")),
    moClose: toNumber(cell(rows, 6, "D")),
    moOpen: toNumber(cell(rows, 6, "E")),
    pctMoClose: toNumber(cell(rows, 6, "F")),
    achItemReady: toNumber(cell(rows, 6, "G")),
    itemShortage: toNumber(cell(rows, 6, "H")),
    totalValuesIdr: toNumber(cell(rows, 6, "I")),
    statusEksekusi: {
      close: toNumber(cell(rows, 6, "Z")),
      siapEksekusi: toNumber(cell(rows, 7, "Z")),
      opsionalEksekusi: toNumber(cell(rows, 8, "Z")),
      belumSiapEksekusi: toNumber(cell(rows, 9, "Z")),
    },
    moType: {
      backlog: toNumber(cell(rows, 12, "Z")),
      schedulePcr: toNumber(cell(rows, 13, "Z")),
      capitalize: toNumber(cell(rows, 14, "Z")),
    },
    statusRunning,
  };
}

export function buildPriorityUnits(rows: string[][], limit = 8): PriorityUnit[] {
  const out: PriorityUnit[] = [];
  for (let rowNum = 373; rowNum <= 718; rowNum++) {
    const cn = toStr(cell(rows, rowNum, "A"));
    if (!cn || cn === "(TANPA C/N)") continue;
    const rank = toNumber(cell(rows, rowNum, "S"));
    if (!rank) continue;
    out.push({
      cn,
      statusRunning: toStr(cell(rows, rowNum, "B")),
      moOpen: toNumber(cell(rows, rowNum, "C")),
      achMoAvg: toNumber(cell(rows, rowNum, "D")),
      itemOutstanding: toNumber(cell(rows, rowNum, "E")),
      ready: toNumber(cell(rows, rowNum, "F")),
      shortage: toNumber(cell(rows, rowNum, "G")),
      achItemPct: toNumber(cell(rows, rowNum, "H")),
      siapEksekusi: toNumber(cell(rows, rowNum, "I")),
      opsionalEksekusi: toNumber(cell(rows, rowNum, "J")),
      belumSiapEksekusi: toNumber(cell(rows, rowNum, "K")),
      backlogMo: toNumber(cell(rows, rowNum, "L")),
      schedulePcrMo: toNumber(cell(rows, rowNum, "M")),
      capitalizeMo: toNumber(cell(rows, rowNum, "N")),
      valueOutstandingMn: toNumber(cell(rows, rowNum, "Q")),
      rank,
    });
  }
  out.sort((a, b) => a.rank - b.rank);
  return out.slice(0, limit);
}

export function buildUnitBreakdown(rows: string[][]): UnitBreakdownRow[] {
  const out: UnitBreakdownRow[] = [];
  for (let rowNum = 21; rowNum <= 366; rowNum++) {
    const cn = toStr(cell(rows, rowNum, "A"));
    if (!cn) continue;
    out.push({
      cn,
      model: toStr(cell(rows, rowNum, "B")),
      cluster: toStr(cell(rows, rowNum, "C")),
      statusRunning: toStr(cell(rows, rowNum, "D")),
      totalMo: toNumber(cell(rows, rowNum, "E")),
      moOpen: toNumber(cell(rows, rowNum, "F")),
      moClose: toNumber(cell(rows, rowNum, "G")),
      pctClose: toNumber(cell(rows, rowNum, "H")),
      achMo: toNumber(cell(rows, rowNum, "I")),
      totalItem: toNumber(cell(rows, rowNum, "J")),
      ready: toNumber(cell(rows, rowNum, "K")),
      shortage: toNumber(cell(rows, rowNum, "L")),
      achItemPct: toNumber(cell(rows, rowNum, "M")),
      totalValues: toNumber(cell(rows, rowNum, "W")),
    });
  }
  return out;
}

const MASTER_FIELD_ORDER: (keyof MasterRow)[] = [
  "statusEksekusi",
  "achMo",
  "achItem",
  "soh",
  "moType",
  "statDesc",
  "reservation",
  "itemRes",
  "creationResDate",
  "reqDate",
  "plant",
  "plantName",
  "material",
  "partNumber",
  "description",
  "brand",
  "unitModel",
  "matType",
  "qtyRes",
  "uomRes",
  "equipment",
  "equipmentDesc",
  "mtcOrder",
  "createdBy",
  "priority",
  "pr",
  "prItem",
  "prQuantity",
  "prUom",
  "releaseStrategy",
  "releaseState",
  "releaseDate",
  "deliveryDatePr",
  "createDatePr",
  "agingResToPr",
  "po",
  "poItem",
  "requestor",
  "poQuantity",
  "poUom",
  "deliveryDatePo",
  "createDatePo",
  "agingResToPo",
  "amountPrice",
  "vendor",
  "gr",
  "grQuantity",
  "grUom",
  "grPostingDate",
  "grCreatedDate",
  "slocGr",
  "diterimaGr",
  "diserahkanGr",
  "agingResToGr",
  "gi",
  "giQuantity",
  "giUom",
  "giPostingDate",
  "giCreateDate",
  "diterimaGi",
  "diserahkanGi",
  "agingResToGi",
  "maintOrderDesc",
  "statusRunning",
  "statusEksekusiByPlan",
  "price",
  "totalValues",
  "cn",
  "moFlagFirstRow",
  "moOpenClose",
  "statusItem",
];

function cellText(ws: XLSX.WorkSheet, r: number, c: number): string {
  // readWorkbook() parses with `dense: true`, which stores each row as
  // ws[rowIndex] (an array of cells) instead of the usual ws["A1"]-keyed
  // object — a plain ws[encode_cell(...)] lookup silently returns undefined
  // here.
  const row = (ws as unknown as Record<number, XLSX.CellObject[]>)[r];
  const obj = row?.[c];
  if (!obj) return "";
  // .w is SheetJS's already-computed formatted text (what raw:false would
  // give); falling back to .v avoids re-deriving it from scratch.
  return toStr(obj.w !== undefined ? obj.w : obj.v);
}

export function parseMasterSheet(wb: XLSX.WorkBook): MasterRow[] {
  const ws = wb.Sheets["MASTER"];
  if (!ws) throw new Error('Sheet "MASTER" tidak ditemukan pada workbook.');
  const ref = ws["!ref"];
  if (!ref) return [];
  const range = XLSX.utils.decode_range(ref);

  // Read cells straight off the parsed sheet into the final MasterRow shape
  // instead of first materializing a full string[][] via sheet_to_json and
  // then mapping that into objects — on a ~37k-row sheet that intermediate
  // copy was enough to push memory-constrained hosts (e.g. Railway's trial
  // tier) into an OOM crash.
  const out: MasterRow[] = [];
  for (let r = range.s.r + 1; r <= range.e.r; r++) {
    if (!cellText(ws, r, 0)) continue;
    const rowObj: Partial<MasterRow> = { idx: out.length };
    MASTER_FIELD_ORDER.forEach((field, colIdx) => {
      (rowObj as Record<string, string | number>)[field] = cellText(ws, r, colIdx);
    });
    out.push(rowObj as MasterRow);
  }
  return out;
}

export function buildAlerts(master: MasterRow[], limit = 12): AlertItem[] {
  const now = new Date();
  const candidates = master.filter(
    (r) => r.statusItem === "SHORTAGE" || r.statusEksekusi === "BELUM SIAP ESEKUSI"
  );

  const withAging: AlertItem[] = candidates.map((r) => ({
    reservation: r.reservation,
    itemRes: r.itemRes,
    cn: r.cn,
    material: r.material,
    description: r.description,
    mtcOrder: r.mtcOrder,
    moType: r.moType,
    statusEksekusi: r.statusEksekusi,
    statusItem: r.statusItem,
    reqDate: r.reqDate,
    agingDays: agingDaysFrom(r.reqDate, now),
    totalValues: toNumber(r.totalValues),
  }));

  withAging.sort((a, b) => (b.agingDays ?? -1) - (a.agingDays ?? -1));
  return withAging.slice(0, limit);
}
