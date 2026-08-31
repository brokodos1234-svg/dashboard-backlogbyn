"use client";

import { useMemo, useState } from "react";
import type { DashboardBundle } from "@/lib/types";
import { MONTHS_ID } from "@/lib/types";
import { formatNumber, formatRupiahCompact } from "@/lib/parseHelpers";
import KpiCard from "./KpiCard";
import CategoryCard from "./CategoryCard";
import TrendChart, { TrendLegend } from "./TrendChart";
import ReadinessBar from "./ReadinessBar";
import AlertCard from "./AlertCard";
import PriorityQueueTable from "./PriorityQueueTable";
import StatusPill from "./StatusPill";
import Link from "next/link";

export default function OverviewClient({ bundle }: { bundle: DashboardBundle }) {
  const [month, setMonth] = useState<string>("SEMUA");

  const selected = useMemo(() => {
    if (month === "SEMUA") {
      return {
        total: bundle.penyerapan.totalValue,
        mo: bundle.penyerapan.totalMo,
        item: bundle.penyerapan.totalItem,
        categories: bundle.penyerapan.categories,
      };
    }
    const point = bundle.penyerapan.monthlyTrend.find((m) => m.month === month);
    if (!point) return null;
    return {
      total: point.total,
      mo: null,
      item: null,
      categories: bundle.penyerapan.categories.map((c) => ({
        ...c,
        value:
          c.key === "1. BACKLOG"
            ? point.backlog
            : c.key === "2. SCHEDULE PCR"
            ? point.schedulePcr
            : point.capitalize,
        pct: point.total > 0
          ? ((c.key === "1. BACKLOG" ? point.backlog : c.key === "2. SCHEDULE PCR" ? point.schedulePcr : point.capitalize) / point.total) * 100
          : 0,
      })),
    };
  }, [month, bundle]);

  const updated = new Date(bundle.fetchedAt);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-ink-soft">
            {bundle.penyerapan.updateLabel || "Update terbaru"}
          </div>
          <h1 className="mt-1 text-3xl font-bold text-ink">Ringkasan Backlog &amp; PCR</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Progres program plan, penyerapan value, dan status keterlambatan (Backlog &amp; PCR) — Site Bayan.
          </p>
        </div>
        <label className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm shadow-card">
          <span className="text-ink-soft">Periode (Bulan)</span>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="bg-transparent font-semibold text-ink outline-none"
          >
            <option value="SEMUA">Semua Bulan</option>
            {MONTHS_ID.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="rounded-xl2 bg-gradient-to-br from-mint-50 to-white p-6 shadow-card sm:p-8">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-mint-700">
          <span className="h-1.5 w-1.5 rounded-full bg-mint-500" />
          Live dari Google Sheets · diperbarui {updated.toLocaleString("id-ID")}
        </div>
        <div className="mt-4 grid gap-6 sm:grid-cols-[1.3fr_1fr]">
          <div>
            <div className="text-sm font-medium text-ink-soft">Total Penyerapan</div>
            <div className="mt-1 text-4xl font-extrabold text-ink sm:text-5xl">
              {formatRupiahCompact(selected?.total ?? 0)}
            </div>
            <div className="mt-2 text-sm text-ink-soft">
              {selected?.mo != null && selected?.item != null
                ? `${formatNumber(selected.mo)} MO · ${formatNumber(selected.item)} item`
                : "Rincian MO/item per bulan mengikuti sheet Dashboard"}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/dashboard?statusItem=SHORTAGE"
                className="rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
              >
                Lihat item shortage →
              </Link>
              <Link
                href="/dashboard?statusEksekusi=BELUM+SIAP+ESEKUSI"
                className="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-ink shadow-card hover:opacity-90"
              >
                Lihat belum siap eksekusi
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {(selected?.categories ?? []).map((c) => (
              <div key={c.key} className="rounded-xl bg-white/70 p-3">
                <div className="text-[11px] font-medium text-ink-soft">{c.label.replace(/^\d+\.\s*/, "")}</div>
                <div className="mt-1 text-lg font-bold text-ink">{formatRupiahCompact(c.value)}</div>
                <div className="text-[11px] text-ink-soft">{c.pct.toFixed(1)}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {bundle.penyerapan.categories.map((c) => (
          <CategoryCard key={c.key} category={c} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-xl2 border border-black/5 bg-white p-6 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-semibold text-ink">Tren Penyerapan per Bulan</div>
              <div className="text-xs text-ink-soft">Seluruh bulan, tidak terpengaruh filter periode</div>
            </div>
            <TrendLegend />
          </div>
          <div className="mt-4">
            <TrendChart data={bundle.penyerapan.monthlyTrend} />
          </div>
        </div>

        <div className="rounded-xl2 border border-black/5 bg-white p-6 shadow-card">
          <div className="font-semibold text-ink">Readiness Snapshot</div>
          <div className="mt-1 text-xs text-ink-soft">
            {formatNumber(bundle.readiness.totalItem)} item · {formatNumber(bundle.readiness.totalUnit)} unit (C/N)
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-canvas p-3">
              <div className="text-[11px] font-medium text-ink-soft">Ach MO (rata-rata)</div>
              <div className="mt-1 text-xl font-bold text-ink">{bundle.readiness.pctMoClose.toFixed(1)}%</div>
            </div>
            <div className="rounded-xl bg-canvas p-3">
              <div className="text-[11px] font-medium text-ink-soft">Ach Item (READY)</div>
              <div className="mt-1 text-xl font-bold text-ink">{bundle.readiness.achItemReady.toFixed(1)}%</div>
            </div>
          </div>
          <div className="mt-5">
            <ReadinessBar data={bundle.readiness.statusEksekusi} />
          </div>
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 font-semibold text-ink">
              <span className="h-2 w-2 rounded-full bg-sev-critical" />
              Prioritas &amp; Alert
            </div>
            <div className="text-xs text-ink-soft">Item SHORTAGE atau belum siap eksekusi, diurutkan aging terlama</div>
          </div>
          <Link href="/dashboard?statusItem=SHORTAGE" className="text-sm font-medium text-mint-700 hover:underline">
            Lihat semua →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bundle.alerts.slice(0, 6).map((a, i) => (
            <AlertCard key={`${a.reservation}-${a.itemRes}-${i}`} alert={a} />
          ))}
        </div>
      </div>

      <div className="rounded-xl2 border border-black/5 bg-white p-6 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="font-semibold text-ink">Unit Prioritas (Top by Rank)</div>
            <div className="text-xs text-ink-soft">Ranked by value outstanding &amp; urgensi eksekusi</div>
          </div>
          <Link href="/dashboard/unit" className="text-sm font-medium text-mint-700 hover:underline">
            Semua unit →
          </Link>
        </div>
        <PriorityQueueTable units={bundle.priorityUnits} />
      </div>

      <div className="rounded-xl2 border border-black/5 bg-white p-6 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <div className="font-semibold text-ink">Data Terbaru (Master)</div>
          <Link href="/dashboard" className="text-sm font-medium text-mint-700 hover:underline">
            Lihat semua →
          </Link>
        </div>
        <div className="table-scroll">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-black/5 text-left text-xs uppercase tracking-wide text-ink-soft">
                <th className="py-3 pr-4 font-medium">C/N</th>
                <th className="py-3 pr-4 font-medium">MO</th>
                <th className="py-3 pr-4 font-medium">MO Type</th>
                <th className="py-3 pr-4 font-medium">Deskripsi</th>
                <th className="py-3 pr-4 font-medium">Status Eksekusi</th>
                <th className="py-3 pl-4 font-medium">Status Item</th>
              </tr>
            </thead>
            <tbody>
              {bundle.previewRows.map((r) => (
                <tr key={r.idx} className="border-b border-black/5 last:border-0">
                  <td className="py-3 pr-4 font-medium text-ink">{r.cn || "-"}</td>
                  <td className="py-3 pr-4 text-ink-soft">{r.mtcOrder || "-"}</td>
                  <td className="py-3 pr-4 text-ink-soft">{r.moType}</td>
                  <td className="py-3 pr-4 text-ink-soft max-w-[220px] truncate">{r.description}</td>
                  <td className="py-3 pr-4">
                    <StatusPill value={r.statusEksekusi} />
                  </td>
                  <td className="py-3 pl-4">
                    <StatusPill value={r.statusItem} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
