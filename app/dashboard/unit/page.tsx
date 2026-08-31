import { getDashboardBundle } from "@/lib/dataCache";
import UnitTable from "@/components/UnitTable";

export const dynamic = "force-dynamic";

export default async function UnitBreakdownPage() {
  const bundle = await getDashboardBundle();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Breakdown per Unit (C/N)</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Resume readiness per nomor lambung (C/N) — {bundle.readiness.totalUnit} unit, sumber sheet Resume
          Dashboard.
        </p>
      </div>
      <UnitTable units={bundle.unitBreakdown} />
    </div>
  );
}
