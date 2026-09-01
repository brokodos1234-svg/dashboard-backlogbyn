"use client";

import * as XLSX from "xlsx";
import type { PriorityUnit } from "@/lib/types";

const HEADERS: { key: keyof PriorityUnit; header: string }[] = [
  { key: "cn", header: "C/N" },
  { key: "statusRunning", header: "Status Running" },
  { key: "moOpen", header: "MO Open" },
  { key: "itemOutstanding", header: "Item Outstanding" },
  { key: "ready", header: "Ready" },
  { key: "shortage", header: "Shortage" },
  { key: "achItemPct", header: "Ach Item (%)" },
  { key: "siapEksekusi", header: "Siap Eksekusi" },
  { key: "opsionalEksekusi", header: "Opsional Eksekusi" },
  { key: "belumSiapEksekusi", header: "Belum Siap Eksekusi" },
  { key: "backlogMo", header: "MO Backlog" },
  { key: "schedulePcrMo", header: "MO Schedule PCR" },
  { key: "capitalizeMo", header: "MO Capitalize" },
  { key: "valueOutstandingMn", header: "Value Outstanding (Rp jt)" },
  { key: "rank", header: "Rank" },
];

export default function ExportMoOpenButton({ units }: { units: PriorityUnit[] }) {
  function handleExport() {
    const aoa = [
      HEADERS.map((h) => h.header),
      ...units.map((u) => HEADERS.map((h) => u[h.key])),
    ];
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    ws["!cols"] = HEADERS.map(() => ({ wch: 16 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "MO Open");
    XLSX.writeFile(wb, "mo-open-prioritas.xlsx");
  }

  return (
    <button
      onClick={handleExport}
      className="rounded-full bg-mint-500 px-5 py-2.5 text-sm font-semibold text-white shadow-card hover:bg-mint-600"
    >
      + Export MO Open
    </button>
  );
}
