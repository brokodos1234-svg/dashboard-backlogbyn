"use client";

import * as XLSX from "xlsx";
import { MASTER_COLUMNS } from "./masterColumns";
import type { MasterRow } from "./types";

function toAoa(rows: MasterRow[]): (string | number)[][] {
  const header = MASTER_COLUMNS.map((c) => c.header);
  const body = rows.map((r) => MASTER_COLUMNS.map((c) => r[c.key]));
  return [header, ...body];
}

export function exportToExcel(rows: MasterRow[], filename = "master-backlog-pcr.xlsx") {
  const aoa = toAoa(rows);
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  ws["!cols"] = MASTER_COLUMNS.map(() => ({ wch: 16 }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Master");
  XLSX.writeFile(wb, filename);
}

export async function exportToPdf(rows: MasterRow[], filename = "master-backlog-pcr.pdf") {
  const { jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;

  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a3" });
  doc.setFontSize(14);
  doc.text("Detail Data Master — Backlog & PCR (Site Bayan)", 24, 28);
  doc.setFontSize(9);
  doc.text(`Diekspor: ${new Date().toLocaleString("id-ID")} · ${rows.length} baris`, 24, 44);

  autoTable(doc, {
    startY: 56,
    head: [MASTER_COLUMNS.map((c) => c.header)],
    body: rows.map((r) => MASTER_COLUMNS.map((c) => String(r[c.key] ?? ""))),
    styles: { fontSize: 6.5, cellPadding: 3 },
    headStyles: { fillColor: [15, 17, 21] },
    margin: { left: 24, right: 24 },
  });

  doc.save(filename);
}
