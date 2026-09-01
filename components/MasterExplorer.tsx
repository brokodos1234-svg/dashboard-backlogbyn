"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { MasterFacets, MasterRow } from "@/lib/types";
import { MASTER_COLUMNS } from "@/lib/masterColumns";
import { exportToExcel, exportToPdf } from "@/lib/exportClient";
import StatusPill from "./StatusPill";
import MultiSelectFilter from "./MultiSelectFilter";

interface Filters {
  q: string;
  cn: string;
  moType: string[];
  statusEksekusi: string[];
  statusItem: string[];
  moOpenClose: string[];
}

const EMPTY_FACETS: MasterFacets = {
  cnOptions: [],
  moTypeOptions: [],
  statusEksekusiOptions: [],
  statusItemOptions: [],
  moOpenCloseOptions: [],
};

const PILL_KEYS = new Set(["statusEksekusi", "statusItem", "statusRunning", "moOpenClose"]);

function parseParam(v: string | null): string[] {
  return v ? v.split(",").filter(Boolean) : [];
}

export default function MasterExplorer() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<Filters>({
    q: searchParams.get("q") || "",
    cn: searchParams.get("cn") || "",
    moType: parseParam(searchParams.get("moType")),
    statusEksekusi: parseParam(searchParams.get("statusEksekusi")),
    statusItem: parseParam(searchParams.get("statusItem")),
    moOpenClose: parseParam(searchParams.get("moOpenClose")),
  });
  const [page, setPage] = useState(1);
  const [pageSize] = useState(50);
  const [rows, setRows] = useState<MasterRow[]>([]);
  const [total, setTotal] = useState(0);
  const [facets, setFacets] = useState<MasterFacets>(EMPTY_FACETS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState<"excel" | "pdf" | null>(null);

  const queryString = useMemo(() => {
    const sp = new URLSearchParams();
    if (filters.q) sp.set("q", filters.q);
    if (filters.cn) sp.set("cn", filters.cn);
    if (filters.moType.length) sp.set("moType", filters.moType.join(","));
    if (filters.statusEksekusi.length) sp.set("statusEksekusi", filters.statusEksekusi.join(","));
    if (filters.statusItem.length) sp.set("statusItem", filters.statusItem.join(","));
    if (filters.moOpenClose.length) sp.set("moOpenClose", filters.moOpenClose.join(","));
    return sp;
  }, [filters]);

  useEffect(() => {
    router.replace(`/dashboard?${queryString.toString()}`, { scroll: false });
  }, [queryString, router]);

  useEffect(() => {
    setPage(1);
  }, [queryString]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    const sp = new URLSearchParams(queryString);
    sp.set("page", String(page));
    sp.set("pageSize", String(pageSize));

    fetch(`/api/master?${sp.toString()}`)
      .then((r) => {
        if (!r.ok) throw new Error("Gagal memuat data");
        return r.json();
      })
      .then((data) => {
        if (cancelled) return;
        setRows(data.rows);
        setTotal(data.total);
        setFacets(data.facets);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [queryString, page, pageSize]);

  const updateText = useCallback((key: "q" | "cn", value: string) => {
    setFilters((f) => ({ ...f, [key]: value }));
  }, []);

  const updateMulti = useCallback(
    (key: "moType" | "statusEksekusi" | "statusItem" | "moOpenClose", values: string[]) => {
      setFilters((f) => ({ ...f, [key]: values }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters({ q: "", cn: "", moType: [], statusEksekusi: [], statusItem: [], moOpenClose: [] });
  }, []);

  const runExport = useCallback(
    async (kind: "excel" | "pdf") => {
      setExporting(kind);
      try {
        const res = await fetch(`/api/master/export?${queryString.toString()}`);
        const data = await res.json();
        if (kind === "excel") exportToExcel(data.rows);
        else await exportToPdf(data.rows);
      } catch (e) {
        console.error(e);
      } finally {
        setExporting(null);
      }
    },
    [queryString]
  );

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-5">
      <div className="rounded-xl2 border border-black/5 bg-white p-5 shadow-card">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <input
            type="text"
            placeholder="Cari MO / PR / PO / material..."
            value={filters.q}
            onChange={(e) => updateText("q", e.target.value)}
            className="rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-ink lg:col-span-2"
          />
          <CnSearchInput
            value={filters.cn}
            options={facets.cnOptions}
            onChange={(v) => updateText("cn", v)}
          />
          <MultiSelectFilter
            label="MO Type"
            options={facets.moTypeOptions}
            selected={filters.moType}
            onChange={(v) => updateMulti("moType", v)}
          />
          <MultiSelectFilter
            label="Status Eksekusi"
            options={facets.statusEksekusiOptions}
            selected={filters.statusEksekusi}
            onChange={(v) => updateMulti("statusEksekusi", v)}
          />
          <MultiSelectFilter
            label="Status Item"
            options={facets.statusItemOptions}
            selected={filters.statusItem}
            onChange={(v) => updateMulti("statusItem", v)}
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <MultiSelectFilter
              label="MO Open/Close"
              options={facets.moOpenCloseOptions}
              selected={filters.moOpenClose}
              onChange={(v) => updateMulti("moOpenClose", v)}
            />
            <button
              onClick={resetFilters}
              className="text-sm font-medium text-ink-soft hover:text-ink"
            >
              Reset filter
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => runExport("excel")}
              disabled={exporting !== null}
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink shadow-card hover:opacity-90 disabled:opacity-50"
            >
              {exporting === "excel" ? "Mengekspor..." : "Export to Excel"}
            </button>
            <button
              onClick={() => runExport("pdf")}
              disabled={exporting !== null}
              className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
            >
              {exporting === "pdf" ? "Mengekspor..." : "Export to PDF"}
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-xl2 border border-black/5 bg-white p-5 shadow-card">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm text-ink-soft">
            {loading ? "Memuat..." : `${total.toLocaleString("id-ID")} baris ditemukan`}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-black/10 px-3 py-1.5 disabled:opacity-40"
            >
              ←
            </button>
            <span className="text-ink-soft">
              Hal {page} / {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-lg border border-black/10 px-3 py-1.5 disabled:opacity-40"
            >
              →
            </button>
          </div>
        </div>

        {error && <div className="mb-3 text-sm text-sev-critical">{error}</div>}

        <div className="table-scroll">
          <table className="w-full min-w-[2200px] text-xs">
            <thead>
              <tr className="border-b border-black/5 text-left uppercase tracking-wide text-ink-soft">
                {MASTER_COLUMNS.map((c) => (
                  <th key={c.key} className="py-3 pr-4 font-medium whitespace-nowrap">
                    {c.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.idx} className="border-b border-black/5 last:border-0 hover:bg-canvas/60">
                  {MASTER_COLUMNS.map((c) => (
                    <td key={c.key} className="py-2.5 pr-4 whitespace-nowrap text-ink-soft">
                      {PILL_KEYS.has(c.key) ? (
                        <StatusPill value={String(r[c.key])} />
                      ) : (
                        String(r[c.key] ?? "") || "-"
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={MASTER_COLUMNS.length} className="py-10 text-center text-ink-soft">
                    Tidak ada data yang cocok dengan filter ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CnSearchInput({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <input
        list="list-cn"
        placeholder="C/N"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-ink"
      />
      <datalist id="list-cn">
        {options.map((o) => (
          <option key={o} value={o} />
        ))}
      </datalist>
    </div>
  );
}
