import type { CategoryRow } from "@/lib/types";
import { formatRupiahCompact, formatNumber, formatPct } from "@/lib/parseHelpers";

const COLOR: Record<CategoryRow["key"], string> = {
  "1. BACKLOG": "#128c68",
  "2. SCHEDULE PCR": "#c99512",
  "3. CAPITALIZE": "#db2777",
};

export default function CategoryCard({ category }: { category: CategoryRow }) {
  const color = COLOR[category.key];
  return (
    <div className="rounded-xl2 border border-black/5 bg-white p-5 shadow-card">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
          {category.label}
        </span>
      </div>
      <div className="mt-3 text-2xl font-bold text-ink">{formatRupiahCompact(category.value)}</div>
      <div className="mt-1 text-sm text-ink-soft">
        {formatPct(category.pct)} dari total · {formatNumber(category.mo)} MO
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-black/5 pt-3 text-xs text-ink-soft">
        <span>{formatNumber(category.item)} item</span>
        <span>rata-rata {formatRupiahCompact(category.avgPerMo)}/MO</span>
      </div>
    </div>
  );
}
