"use client";

import { useMemo, useState } from "react";
import type { UnitBreakdownRow } from "@/lib/types";
import { formatNumber, formatPct, formatRupiahCompact } from "@/lib/parseHelpers";

type SortKey = keyof UnitBreakdownRow;

export default function UnitTable({ units }: { units: UnitBreakdownRow[] }) {
  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("totalValues");
  const [sortDir, setSortDir] = useState<1 | -1>(-1);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    let list = units;
    if (query) {
      list = units.filter(
        (u) =>
          u.cn.toLowerCase().includes(query) ||
          u.model.toLowerCase().includes(query) ||
          u.cluster.toLowerCase().includes(query)
      );
    }
    const sorted = [...list].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * sortDir;
      return String(av).localeCompare(String(bv)) * sortDir;
    });
    return sorted;
  }, [units, q, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) setSortDir((d) => (d === 1 ? -1 : 1));
    else {
      setSortKey(key);
      setSortDir(-1);
    }
  }

  const columns: { key: SortKey; header: string }[] = [
    { key: "cn", header: "C/N" },
    { key: "model", header: "Model" },
    { key: "cluster", header: "Cluster" },
    { key: "statusRunning", header: "Status Running" },
    { key: "totalMo", header: "Total MO" },
    { key: "moOpen", header: "MO Open" },
    { key: "moClose", header: "MO Close" },
    { key: "pctClose", header: "% Close" },
    { key: "achMo", header: "Ach MO" },
    { key: "totalItem", header: "Total Item" },
    { key: "ready", header: "Ready" },
    { key: "shortage", header: "Shortage" },
    { key: "achItemPct", header: "Ach Item" },
    { key: "totalValues", header: "Total Values" },
  ];

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Cari C/N, model, atau cluster..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="w-full max-w-sm rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-ink"
      />
      <div className="rounded-xl2 border border-black/5 bg-white p-5 shadow-card">
        <div className="mb-3 text-sm text-ink-soft">{filtered.length.toLocaleString("id-ID")} unit</div>
        <div className="table-scroll">
          <table className="w-full min-w-[1200px] text-xs">
            <thead>
              <tr className="border-b border-black/5 text-left uppercase tracking-wide text-ink-soft">
                {columns.map((c) => (
                  <th
                    key={c.key}
                    onClick={() => toggleSort(c.key)}
                    className="cursor-pointer select-none py-3 pr-4 font-medium whitespace-nowrap hover:text-ink"
                  >
                    {c.header} {sortKey === c.key ? (sortDir === 1 ? "↑" : "↓") : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.cn} className="border-b border-black/5 last:border-0 hover:bg-canvas/60">
                  <td className="py-2.5 pr-4 font-semibold text-ink">{u.cn}</td>
                  <td className="py-2.5 pr-4 text-ink-soft">{u.model}</td>
                  <td className="py-2.5 pr-4 text-ink-soft">{u.cluster}</td>
                  <td className="py-2.5 pr-4 text-ink-soft">{u.statusRunning}</td>
                  <td className="py-2.5 pr-4 text-ink-soft">{formatNumber(u.totalMo)}</td>
                  <td className="py-2.5 pr-4 text-ink-soft">{formatNumber(u.moOpen)}</td>
                  <td className="py-2.5 pr-4 text-ink-soft">{formatNumber(u.moClose)}</td>
                  <td className="py-2.5 pr-4 text-ink-soft">{formatPct(u.pctClose)}</td>
                  <td className="py-2.5 pr-4 text-ink-soft">{formatPct(u.achMo)}</td>
                  <td className="py-2.5 pr-4 text-ink-soft">{formatNumber(u.totalItem)}</td>
                  <td className="py-2.5 pr-4 text-ink-soft">{formatNumber(u.ready)}</td>
                  <td className="py-2.5 pr-4 text-ink-soft">{formatNumber(u.shortage)}</td>
                  <td className="py-2.5 pr-4 text-ink-soft">{formatPct(u.achItemPct)}</td>
                  <td className="py-2.5 pr-4 text-ink-soft">{formatRupiahCompact(u.totalValues)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
