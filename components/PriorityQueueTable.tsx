import type { PriorityUnit } from "@/lib/types";
import { formatNumber, formatPct, formatRupiahCompact } from "@/lib/parseHelpers";

export default function PriorityQueueTable({ units }: { units: PriorityUnit[] }) {
  return (
    <div className="table-scroll">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-black/5 text-left text-xs uppercase tracking-wide text-ink-soft">
            <th className="py-3 pr-4 font-medium">C/N</th>
            <th className="py-3 pr-4 font-medium">Status Running</th>
            <th className="py-3 pr-4 font-medium">MO Open</th>
            <th className="py-3 pr-4 font-medium">Item Outstanding</th>
            <th className="py-3 pr-4 font-medium">Ach Item</th>
            <th className="py-3 pr-4 font-medium">Value Outstanding</th>
            <th className="py-3 pl-4 font-medium text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {units.map((u) => (
            <tr key={u.cn} className="border-b border-black/5 last:border-0">
              <td className="py-3 pr-4 font-semibold text-ink">{u.cn}</td>
              <td className="py-3 pr-4 text-ink-soft">{u.statusRunning}</td>
              <td className="py-3 pr-4 text-ink-soft">{formatNumber(u.moOpen)}</td>
              <td className="py-3 pr-4 text-ink-soft">{formatNumber(u.itemOutstanding)}</td>
              <td className="py-3 pr-4 text-ink-soft">{formatPct(u.achItemPct)}</td>
              <td className="py-3 pr-4 text-ink-soft">{formatRupiahCompact(u.valueOutstandingMn * 1_000_000)}</td>
              <td className="py-3 pl-4 text-right">
                <a
                  href={`/dashboard?cn=${encodeURIComponent(u.cn)}`}
                  className="text-mint-700 font-medium hover:underline"
                >
                  Lihat detail
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
