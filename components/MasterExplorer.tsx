"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { MasterFacets, MasterRow } from "@/lib/types";
import { MASTER_COLUMNS } from "@/lib/masterColumns";
import { exportToExcel, exportToPdf } from "@/lib/exportClient";
import StatusPill from "./StatusPill";

interface Filters {
  q: string;
  cn: string;
  moType: string;
  statusEksekusi: string;
  statusItem: string;
  moOpenClose: string;
}

const EMPTY_FACETS: MasterFacets = {
  cnOptions: [],
  moTypeOptions: [],
  statusEksekusiOptions: [],
  statusItemOptions: [],
  moOpenCloseOptions: [],
};

const PILL_KEYS = new Set(["statusEksekusi", "statusItem", "statusRunning", "moOpenClose"]);

export default function MasterExplorer() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<Filters>({
    q: searchParams.get("q") || "",
    cn: searchParams.get("cn") || "",
    moType: searchParams.get("moType") || "",
    statusEksekusi: searchParams.get("statusEksekusi") || "",
    statusItem: searchParams.get("statusItem") || "",
    moOpenClose: searchParams.get("moOpenClose") || "",
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
    if (filters.moType) sp.set("moType", filters.moType);
    if (filters.statusEksekusi) sp.set("statusEksekusi", filters.statusEksekusi);
    if (filters.statusItem) sp.set("statusItem", filters.statusItem);
    if (filters.moOpenClose) sp.set("moOpenClose", filters.moOpenClose);
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

  const updateFilter = useCallback((key: keyof Filters, value: string) => {
    setFilters((f) => ({ ...f, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ q: "", cn: "", moType: "", statusEksekusi: "", statusItem: "", moOpenClose: "" });
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
            onChange={(e) => updateFilter("q", e.target.value)}
            className="rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-ink lg:col-span-2"
          />
          <FacetSelect
            label="C/N"
            value={filters.cn}
            options={facets.cnOptions}
            onChange={(v) => updateFilter("cn", v)}
            searchable
          />
          <FacetSelect
            label="MO Type"
            value={filters.moType}
            options={facets.moTypeOptions}
            onChange={(v) => updateFilter("moType", v)}
          />
          <FacetSelect
            label="Status Eksekusi"
            value={filters.statusEksekusi}
            options={facets.statusEksekusiOptions}
            onChange={(v) => updateFilter("statusEksekusi", v)}
          />
          <FacetSelect
            label="Status Item"
            value={filters.statusItem}
            options={facets.statusItemOptions}
            onChange={(v) => updateFilter("statusItem", v)}
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <FacetSelect
              label="MO Open/Close"
              value={filters.moOpenClose}
              options={facets.moOpenCloseOptions}
              onChange={(v) => updateFilter("moOpenClose", v)}
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

function FacetSelect({
  label,
  value,
  options,
  onChange,
  searchable,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  searchable?: boolean;
}) {
  const listId = searchable ? `list-${label.replace(/\s+/g, "-")}` : undefined;

  if (searchable) {
    return (
      <div>
        <input
          list={listId}
          placeholder={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-ink"
        />
        <datalist id={listId}>
          {options.map((o) => (
            <option key={o} value={o} />
          ))}
        </datalist>
      </div>
    );
  }

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-ink"
    >
      <option value="">{label}: Semua</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
