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
  shortage: number;
  achItemPct: number;
  belumSiapEksekusi: number;
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

export interface MasterRow {
  idx: number;
  statusEksekusi: string;
  achMo: string;
  achItem: string;
  soh: string;
  moType: string;
  statDesc: string;
  reservation: string;
  itemRes: string;
  creationResDate: string;
  reqDate: string;
  plant: string;
  plantName: string;
  material: string;
  partNumber: string;
  description: string;
  brand: string;
  unitModel: string;
  matType: string;
  qtyRes: string;
  uomRes: string;
  equipment: string;
  equipmentDesc: string;
  mtcOrder: string;
  createdBy: string;
  priority: string;
  pr: string;
  prItem: string;
  prQuantity: string;
  prUom: string;
  releaseStrategy: string;
  releaseState: string;
  releaseDate: string;
  deliveryDatePr: string;
  createDatePr: string;
  agingResToPr: string;
  po: string;
  poItem: string;
  requestor: string;
  poQuantity: string;
  poUom: string;
  deliveryDatePo: string;
  createDatePo: string;
  agingResToPo: string;
  amountPrice: string;
  vendor: string;
  gr: string;
  grQuantity: string;
  grUom: string;
  grPostingDate: string;
  grCreatedDate: string;
  slocGr: string;
  diterimaGr: string;
  diserahkanGr: string;
  agingResToGr: string;
  gi: string;
  giQuantity: string;
  giUom: string;
  giPostingDate: string;
  giCreateDate: string;
  diterimaGi: string;
  diserahkanGi: string;
  agingResToGi: string;
  maintOrderDesc: string;
  statusRunning: string;
  statusEksekusiByPlan: string;
  price: string;
  totalValues: string;
  cn: string;
  moFlagFirstRow: string;
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
