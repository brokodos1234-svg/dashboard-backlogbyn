import { getDashboardBundle } from "@/lib/dataCache";
import TopNav from "@/components/TopNav";
import OverviewClient from "@/components/OverviewClient";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const bundle = await getDashboardBundle();

  return (
    <div className="min-h-screen bg-canvas px-4 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-3xl bg-canvas">
          <TopNav />
        </div>
        <OverviewClient bundle={bundle} />
      </div>
    </div>
  );
}
