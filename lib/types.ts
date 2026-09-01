export const MONTHS_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
] as const;

export type MonthName = (typeof MONTHS_ID)[number];

export interface CategoryRow {
  key: "1. BACKLOG" | "2. SCHEDULE PCR" | "3. CAPITALIZE";
  label: string;
  mo: number;
  item: number;
  value: number;
  pct: number;
  avgPerMo: number;
}

export interface MonthlyTrendPoint {
  month: MonthName;
  backlog: number;
  schedulePcr: number;
  capitalize: number;
  total: number;
}

export interface PenyerapanSummary {
  updateLabel: string;
  totalValue: number;
  totalMo: number;
  totalItem: number;
  categories: CategoryRow[];
  monthlyTrend: MonthlyTrendPoint[];
}

export interface StatusEksekusiBreakdown {
  close: number;
  siapEksekusi: number;
  opsionalEksekusi: number;
  belumSiapEksekusi: number;
}

export interface MoTypeBreakdown {
  backlog: number;
  schedulePcr: number;
  capitalize: number;
}

export interface StatusRunningBucket {
  label: string;
  open: number;
  close: number;
}

export interface ReadinessSummary {
  totalUnit: number;
  totalMo: number;
  totalItem: number;
  moClose: number;
  moOpen: number;
  pctMoClose: number;
  achItemReady: number;
  itemShortage: number;
  totalValuesIdr: number;
  statusEksekusi: StatusEksekusiBreakdown;
  moType: MoTypeBreakdown;
  statusRunning: StatusRunningBucket[];
}

export interface PriorityUnit {
  cn: string;
  statusRunning: string;
  moOpen: number;
  achMoAvg: number;
  itemOutstanding: number;
  ready: number;
  shortage: number;
  achItemPct: number;
  siapEksekusi: number;
  opsionalEksekusi: number;
  belumSiapEksekusi: number;
  backlogMo: number;
  schedulePcrMo: number;
  capitalizeMo: number;
  valueOutstandingMn: number;
  rank: number;
}

export interface UnitBreakdownRow {
  cn: string;
  model: string;
  cluster: string;
  statusRunning: string;
  totalMo: number;
  moOpen: number;
  moClose: number;
  pctClose: number;
  achMo: number;
  totalItem: number;
  ready: number;
  shortage: number;
  achItemPct: number;
  totalValues: number;
}

/**
 * Only the ~23 of MASTER's 71 columns that the app actually displays,
 * filters, searches, or sorts by. Storing all 71 columns for ~37k rows was
 * a major contributor to OOM crashes on memory-constrained hosts (see
 * parseMasterSheet in aggregate.ts) for data nothing ever read.
 */
export interface MasterRow {
  idx: number;
  statusEksekusi: string;
  achMo: string;
  achItem: string;
  soh: string;
  moType: string;
  reservation: string;
  itemRes: string;
  reqDate: string;
  material: string;
  partNumber: string;
  description: string;
  equipment: string;
  mtcOrder: string;
  pr: string;
  po: string;
  gr: string;
  gi: string;
  statusRunning: string;
  price: string;
  totalValues: string;
  cn: string;
  moOpenClose: string;
  statusItem: string;
}

export interface AlertItem {
  reservation: string;
  itemRes: string;
  cn: string;
  material: string;
  description: string;
  mtcOrder: string;
  moType: string;
  statusEksekusi: string;
  statusItem: string;
  reqDate: string;
  agingDays: number | null;
  totalValues: number;
}

export interface DashboardBundle {
  fetchedAt: string;
  penyerapan: PenyerapanSummary;
  readiness: ReadinessSummary;
  priorityUnits: PriorityUnit[];
  moOpenList: PriorityUnit[];
  unitBreakdown: UnitBreakdownRow[];
  alerts: AlertItem[];
  previewRows: MasterRow[];
  masterRowCount: number;
}

export interface MasterFacets {
  cnOptions: string[];
  moTypeOptions: string[];
  statusEksekusiOptions: string[];
  statusItemOptions: string[];
  moOpenCloseOptions: string[];
}

export interface MasterQueryResult {
  rows: MasterRow[];
  total: number;
  page: number;
  pageSize: number;
  facets: MasterFacets;
}
