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
  { key: "equipment", header: "Equipment" },
  { key: "description", header: "Description" },
  { key: "partNumber", header: "Part Number" },
  { key: "material", header: "Material" },
  { key: "itemRes", header: "Item Res" },
  { key: "mtcOrder", header: "Mtc. Order" },
  { key: "pr", header: "PR" },
  { key: "po", header: "PO" },
  { key: "gr", header: "GR" },
  { key: "gi", header: "GI" },
  { key: "achMo", header: "Ach MO" },
  { key: "achItem", header: "Ach Item" },
  { key: "soh", header: "SOH" },
  { key: "price", header: "Price" },
  { key: "totalValues", header: "Total Values" },
];
