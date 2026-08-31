import type { MonthlyTrendPoint } from "@/lib/types";
import { formatRupiahCompact } from "@/lib/parseHelpers";

const SERIES = [
  { key: "backlog" as const, label: "Backlog", color: "#128c68" },
  { key: "schedulePcr" as const, label: "Schedule PCR", color: "#e0b32b" },
  { key: "capitalize" as const, label: "Capitalize", color: "#db2777" },
];

const W = 760;
const H = 260;
const PAD_L = 56;
const PAD_R = 16;
const PAD_T = 16;
const PAD_B = 32;

export default function TrendChart({ data }: { data: MonthlyTrendPoint[] }) {
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;

  const maxVal = Math.max(1, ...data.map((d) => Math.max(d.backlog, d.schedulePcr, d.capitalize)));
  const niceMax = niceCeil(maxVal);

  const x = (i: number) => PAD_L + (innerW * i) / Math.max(1, data.length - 1);
  const y = (v: number) => PAD_T + innerH - (innerH * v) / niceMax;

  const gridLines = 4;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Tren penyerapan bulanan">
      {Array.from({ length: gridLines + 1 }).map((_, i) => {
        const v = (niceMax / gridLines) * i;
        const yy = y(v);
        return (
          <g key={i}>
            <line x1={PAD_L} x2={W - PAD_R} y1={yy} y2={yy} stroke="#e5e8ef" strokeWidth={1} />
            <text x={PAD_L - 10} y={yy + 4} textAnchor="end" fontSize={10} fill="#8b90a0">
              {formatRupiahCompact(v)}
            </text>
          </g>
        );
      })}

      {data.map((d, i) => (
        <text
          key={d.month}
          x={x(i)}
          y={H - 10}
          textAnchor="middle"
          fontSize={10}
          fill="#8b90a0"
        >
          {d.month.slice(0, 3)}
        </text>
      ))}

      {SERIES.map((s) => {
        const points = data.map((d, i) => [x(i), y(d[s.key])] as const);
        const linePath = points.map(([px, py], i) => `${i === 0 ? "M" : "L"}${px},${py}`).join(" ");
        const areaPath =
          `M${points[0][0]},${y(0)} ` +
          points.map(([px, py]) => `L${px},${py}`).join(" ") +
          ` L${points[points.length - 1][0]},${y(0)} Z`;
        return (
          <g key={s.key}>
            <path d={areaPath} fill={s.color} opacity={0.06} />
            <path d={linePath} fill="none" stroke={s.color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
            {points.map(([px, py], i) => (
              <circle key={i} cx={px} cy={py} r={2.5} fill={s.color} />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

export function TrendLegend() {
  return (
    <div className="flex flex-wrap gap-4 text-xs text-ink-soft">
      {SERIES.map((s) => (
        <span key={s.key} className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
          {s.label}
        </span>
      ))}
    </div>
  );
}

function niceCeil(v: number): number {
  if (v <= 0) return 1;
  const exp = Math.floor(Math.log10(v));
  const base = Math.pow(10, exp);
  const frac = v / base;
  let niceFrac = 10;
  if (frac <= 1) niceFrac = 1;
  else if (frac <= 2) niceFrac = 2;
  else if (frac <= 5) niceFrac = 5;
  return niceFrac * base;
}
