import type { MasterRow } from "./types";

export interface ColumnDef {
  key: keyof MasterRow;
  header: string;
  width?: number;
}

export const MASTER_COLUMNS: ColumnDef[] = [
  { key: "cn", header: "C/N" },
  { key: "moType", header: "MO Type" },
  { key: "statusEksekusi", header: "Status Eksekusi" },
  { key: "statusItem", header: "Status Item" },
  { key: "moOpenClose", header: "MO Open/Close" },
  { key: "statusRunning", header: "Status Running" },
  { key: "reservation", header: "Reservation" },
  { key: "itemRes", header: "Item Res" },
  { key: "reqDate", header: "Req Date" },
  { key: "equipment", header: "Equipment" },
  { key: "equipmentDesc", header: "Equipment Desc" },
  { key: "description", header: "Description" },
  { key: "mtcOrder", header: "Mtc. Order" },
  { key: "pr", header: "PR" },
  { key: "agingResToPr", header: "Aging→PR" },
  { key: "po", header: "PO" },
  { key: "agingResToPo", header: "Aging→PO" },
  { key: "gr", header: "GR" },
  { key: "agingResToGr", header: "Aging→GR" },
  { key: "gi", header: "GI" },
  { key: "agingResToGi", header: "Aging→GI" },
  { key: "achMo", header: "Ach MO" },
  { key: "achItem", header: "Ach Item" },
  { key: "soh", header: "SOH" },
  { key: "price", header: "Price" },
  { key: "totalValues", header: "Total Values" },
];
