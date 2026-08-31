import { Suspense } from "react";
import MasterExplorer from "@/components/MasterExplorer";

export const dynamic = "force-dynamic";

export default function DetailDataPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Detail Data — Master</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Seluruh baris Reservation/Item dari sheet Master, dengan filter C/N, MO, dan status, serta export ke
          Excel/PDF sesuai hasil filter yang tampil.
        </p>
      </div>
      <Suspense fallback={<div className="text-sm text-ink-soft">Memuat...</div>}>
        <MasterExplorer />
      </Suspense>
    </div>
  );
}
