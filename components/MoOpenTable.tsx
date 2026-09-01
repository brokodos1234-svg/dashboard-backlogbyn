"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { PriorityUnit } from "@/lib/types";
import { formatNumber, formatPct, formatRupiahCompact } from "@/lib/parseHelpers";
import StatusPill from "./StatusPill";

type SortKey = keyof PriorityUnit;

interface ColDef {
  key: SortKey;
  header: string;
  menu?: boolean;
}

const COLUMNS: ColDef[] = [
  { key: "cn", header: "C/N" },
  { key: "statusRunning", header: "Status Running", menu: true },
  { key: "moOpen", header: "MO Open" },
  { key: "itemOutstanding", header: "Item Outstanding" },
  { key: "achItemPct", header: "Ach Item" },
  { key: "belumSiapEksekusi", header: "Belum Siap", menu: true },
  { key: "valueOutstandingMn", header: "Value Outstanding" },
];

function severityOf(u: PriorityUnit): { label: string; tone: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" } {
  if (u.achItemPct < 40) return { label: "CRITICAL", tone: "CRITICAL" };
  if (u.achItemPct < 60) return { label: "HIGH", tone: "HIGH" };
  if (u.achItemPct < 80) return { label: "MEDIUM", tone: "MEDIUM" };
  return { label: "LOW", tone: "LOW" };
}

const SEVERITY_STYLE: Record<string, { bg: string; fg: string }> = {
  CRITICAL: { bg: "#fde3e7", fg: "#c81e3a" },
  HIGH: { bg: "#fdebd8", fg: "#b5620f" },
  MEDIUM: { bg: "#fdf3d0", fg: "#8a6a09" },
  LOW: { bg: "#dcfce7", fg: "#16a34a" },
};

export default function MoOpenTable({ units }: { units: PriorityUnit[] }) {
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [sortKey, setSortKey] = useState<SortKey>("rank");
  const [sortDir, setSortDir] = useState<1 | -1>(1);
  const [hidden, setHidden] = useState<Set<SortKey>>(new Set());
  const [openMenu, setOpenMenu] = useState<SortKey | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const statusOptions = useMemo(
    () => Array.from(new Set(units.map((u) => u.statusRunning))).filter(Boolean).sort(),
    [units]
  );

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    let list = units;
    if (query) list = list.filter((u) => u.cn.toLowerCase().includes(query));
    if (statusFilter) list = list.filter((u) => u.statusRunning === statusFilter);
    return [...list].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * sortDir;
      return String(av).localeCompare(String(bv)) * sortDir;
    });
  }, [units, q, statusFilter, sortKey, sortDir]);

  useEffect(() => {
    setPage(1);
  }, [q, statusFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const pageRows = useMemo(
    () => rows.slice((page - 1) * pageSize, page * pageSize),
    [rows, page]
  );

  function applySort(key: SortKey, dir: 1 | -1) {
    setSortKey(key);
    setSortDir(dir);
    setOpenMenu(null);
  }

  function toggleHide(key: SortKey) {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
    setOpenMenu(null);
  }

  const visibleColumns = COLUMNS.filter((c) => !hidden.has(c.key));

  const pagerButtons = (
    <>
      <button
        disabled={page <= 1}
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        className="rounded-lg border border-black/10 px-3 py-1.5 disabled:opacity-40"
      >
        ← Kembali
      </button>
      <div className="flex items-center gap-1">
        {pageNumbers(page, totalPages).map((p, i) =>
          p === "..." ? (
            <span key={`gap-${i}`} className="px-1.5 text-ink-soft">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`min-w-[32px] rounded-lg border px-2.5 py-1.5 ${
                p === page
                  ? "border-ink bg-ink text-white"
                  : "border-black/10 text-ink-soft hover:bg-canvas"
              }`}
            >
              {p}
            </button>
          )
        )}
      </div>
      <button
        disabled={page >= totalPages}
        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        className="rounded-lg border border-black/10 px-3 py-1.5 disabled:opacity-40"
      >
        Lanjut →
      </button>
    </>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Cari C/N..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full max-w-xs rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-ink"
        />
        {hidden.size > 0 && (
          <button
            onClick={() => setHidden(new Set())}
            className="text-sm font-medium text-ink-soft hover:text-ink"
          >
            Tampilkan semua kolom ({hidden.size} disembunyikan)
          </button>
        )}
        <div className="ml-auto text-sm text-ink-soft">{rows.length.toLocaleString("id-ID")} unit MO Open</div>
      </div>

      <div className="rounded-xl2 border border-black/5 bg-white shadow-card">
        <div className="table-scroll">
          <table className="w-full min-w-[980px] text-sm">
            <thead>
              <tr className="border-b border-black/5 text-left text-xs uppercase tracking-wide text-ink-soft">
                {visibleColumns.map((c) => (
                  <th key={c.key} className="relative py-3 pr-4 pl-4 font-medium first:pl-6">
                    <span className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => applySort(c.key, sortKey === c.key && sortDir === 1 ? -1 : 1)}
                        className="hover:text-ink"
                      >
                        {c.header} {sortKey === c.key ? (sortDir === 1 ? "↑" : "↓") : ""}
                      </button>
                      {c.menu && (
                        <button
                          onClick={() => setOpenMenu(openMenu === c.key ? null : c.key)}
                          className="rounded p-0.5 text-ink-soft hover:bg-canvas hover:text-ink"
                          aria-label="Opsi kolom"
                        >
                          ⋮
                        </button>
                      )}
                    </span>
                    {openMenu === c.key && (
                      <div className="absolute left-4 top-8 z-10 w-44 rounded-lg border border-black/10 bg-white py-1 text-xs font-normal normal-case text-ink shadow-cardHover">
                        {c.key === "statusRunning" ? (
                          <>
                            <div className="px-3 py-1.5 text-[11px] font-semibold text-ink-soft">Filter</div>
                            <button
                              onClick={() => {
                                setStatusFilter("");
                                setOpenMenu(null);
                              }}
                              className="block w-full px-3 py-1.5 text-left hover:bg-canvas"
                            >
                              Semua status
                            </button>
                            {statusOptions.map((s) => (
                              <button
                                key={s}
                                onClick={() => {
                                  setStatusFilter(s);
                                  setOpenMenu(null);
                                }}
                                className="block w-full px-3 py-1.5 text-left hover:bg-canvas"
                              >
                                {s}
                              </button>
                            ))}
                            <div className="my-1 border-t border-black/5" />
                          </>
                        ) : null}
                        <button
                          onClick={() => applySort(c.key, 1)}
                          className="block w-full px-3 py-1.5 text-left hover:bg-canvas"
                        >
                          Urutkan naik (ASC)
                        </button>
                        <button
                          onClick={() => applySort(c.key, -1)}
                          className="block w-full px-3 py-1.5 text-left hover:bg-canvas"
                        >
                          Urutkan turun (DESC)
                        </button>
                        <div className="my-1 border-t border-black/5" />
                        <button
                          onClick={() => toggleHide(c.key)}
                          className="block w-full px-3 py-1.5 text-left text-ink-soft hover:bg-canvas"
                        >
                          Sembunyikan kolom
                        </button>
                      </div>
                    )}
                  </th>
                ))}
                <th className="py-3 pr-6 pl-4 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((u) => {
                const sev = severityOf(u);
                return (
                  <tr
                    key={u.cn}
                    className="border-b border-black/5 last:border-0 hover:bg-canvas/60"
                    onClick={() => setOpenMenu(null)}
                  >
                    {visibleColumns.map((c) => (
                      <td key={c.key} className="py-3 pr-4 pl-4 text-ink-soft first:pl-6">
                        {c.key === "cn" ? (
                          <span className="font-semibold text-ink">{u.cn}</span>
                        ) : c.key === "statusRunning" ? (
                          <StatusPill value={u.statusRunning} />
                        ) : c.key === "moOpen" || c.key === "itemOutstanding" || c.key === "belumSiapEksekusi" ? (
                          formatNumber(u[c.key] as number)
                        ) : c.key === "achItemPct" ? (
                          formatPct(u.achItemPct)
                        ) : c.key === "valueOutstandingMn" ? (
                          formatRupiahCompact(u.valueOutstandingMn * 1_000_000)
                        ) : (
                          String(u[c.key])
                        )}
                      </td>
                    ))}
                    <td className="py-3 pr-6 pl-4 text-right">
                      <span
                        className="mr-3 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide"
                        style={{ background: SEVERITY_STYLE[sev.tone].bg, color: SEVERITY_STYLE[sev.tone].fg }}
                      >
                        {sev.label}
                      </span>
                      <Link
                        href={`/dashboard?cn=${encodeURIComponent(u.cn)}&moOpenClose=OPEN`}
                        className="font-medium text-mint-700 hover:underline"
                      >
                        Lihat detail
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={visibleColumns.length + 1} className="py-10 text-center text-ink-soft">
                    Tidak ada unit yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-black/5 px-6 py-3 text-sm">
          <span className="text-ink-soft">
            Menampilkan {rows.length === 0 ? 0 : (page - 1) * pageSize + 1}–
            {Math.min(page * pageSize, rows.length)} dari {rows.length.toLocaleString("id-ID")} unit
          </span>
          <div className="flex items-center gap-2">{pagerButtons}</div>
        </div>
      </div>
    </div>
  );
}

function pageNumbers(current: number, total: number): (number | "...")[] {
  const delta = 1;
  const range: (number | "...")[] = [];
  const start = Math.max(2, current - delta);
  const end = Math.min(total - 1, current + delta);

  range.push(1);
  if (start > 2) range.push("...");
  for (let i = start; i <= end; i++) range.push(i);
  if (end < total - 1) range.push("...");
  if (total > 1) range.push(total);

  return range;
}
