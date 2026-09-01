import Link from "next/link";
import { getDashboardBundle } from "@/lib/dataCache";
import { formatNumber, formatRupiahCompact } from "@/lib/parseHelpers";
import CratesIllustration from "@/components/CratesIllustration";
import ExportMoOpenButton from "@/components/ExportMoOpenButton";
import MoOpenTable from "@/components/MoOpenTable";

export const dynamic = "force-dynamic";

export default async function MoOpenPage() {
  const bundle = await getDashboardBundle();
  const units = bundle.moOpenList;

  const totalMoOpen = units.reduce((s, u) => s + u.moOpen, 0);
  const totalItemOutstanding = units.reduce((s, u) => s + u.itemOutstanding, 0);
  const totalValueOutstanding = units.reduce((s, u) => s + u.valueOutstandingMn, 0) * 1_000_000;

  return (
    <div className="space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink"
      >
        ← Kembali ke Beranda
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">MO Open</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Unit dengan Maintenance Order yang masih Open, diranking berdasarkan sheet Resume Dashboard
            (RESUME PER C/N — KHUSUS MO OPEN).
          </p>
        </div>
        <ExportMoOpenButton units={units} />
      </div>

      <div className="overflow-hidden rounded-xl2 border border-black/5 bg-white shadow-card">
        <div className="grid gap-6 p-6 sm:grid-cols-[1fr_180px] sm:p-8">
          <div>
            <div className="text-2xl font-extrabold text-ink sm:text-3xl">MO Open Saat Ini</div>
            <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3 text-sm">
              <StatItem label="Unit Existing" value={formatNumber(units.length)} />
              <StatItem label="Total MO Open" value={formatNumber(totalMoOpen)} />
              <StatItem label="Item Outstanding" value={formatNumber(totalItemOutstanding)} />
              <StatItem label="Value Outstanding" value={formatRupiahCompact(totalValueOutstanding)} />
            </div>
          </div>
          <div className="hidden sm:block">
            <CratesIllustration />
          </div>
        </div>
      </div>

      <MoOpenTable units={units} />
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="font-semibold text-ink">{value}</span>{" "}
      <span className="text-ink-soft">{label}</span>
    </div>
  );
}
