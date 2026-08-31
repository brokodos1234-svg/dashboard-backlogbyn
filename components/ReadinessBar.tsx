import type { StatusEksekusiBreakdown } from "@/lib/types";
import { formatNumber, formatPct } from "@/lib/parseHelpers";

const SEGMENTS: { key: keyof StatusEksekusiBreakdown; label: string; color: string }[] = [
  { key: "close", label: "Close", color: "#128c68" },
  { key: "siapEksekusi", label: "Siap Eksekusi", color: "#1d4ed8" },
  { key: "opsionalEksekusi", label: "Opsional Eksekusi", color: "#e0b32b" },
  { key: "belumSiapEksekusi", label: "Belum Siap Eksekusi", color: "#e0304a" },
];

export default function ReadinessBar({ data }: { data: StatusEksekusiBreakdown }) {
  const total = data.close + data.siapEksekusi + data.opsionalEksekusi + data.belumSiapEksekusi || 1;

  return (
    <div>
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-canvas">
        {SEGMENTS.map((s) => {
          const pct = (data[s.key] / total) * 100;
          if (pct <= 0) return null;
          return <div key={s.key} style={{ width: `${pct}%`, background: s.color }} />;
        })}
      </div>
      <ul className="mt-4 space-y-2.5">
        {SEGMENTS.map((s) => {
          const value = data[s.key];
          const pct = (value / total) * 100;
          return (
            <li key={s.key} className="flex items-center justify-between text-sm">
              <span className="inline-flex items-center gap-2 text-ink-soft">
                <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                {s.label}
              </span>
              <span className="font-medium text-ink">
                {formatPct(pct)}
                <span className="ml-2 text-ink-soft font-normal">{formatNumber(value)}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
