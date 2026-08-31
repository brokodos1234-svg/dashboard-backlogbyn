import type { AlertItem } from "@/lib/types";
import { formatRupiahCompact } from "@/lib/parseHelpers";

function severityOf(a: AlertItem): "critical" | "high" | "medium" {
  if (a.statusItem === "SHORTAGE" && a.statusEksekusi === "BELUM SIAP ESEKUSI") return "critical";
  if (a.statusItem === "SHORTAGE" || (a.agingDays ?? 0) > 60) return "high";
  return "medium";
}

const SEV_STYLE = {
  critical: { label: "CRITICAL", bg: "#fde3e7", fg: "#c81e3a" },
  high: { label: "HIGH", bg: "#fdebd8", fg: "#b5620f" },
  medium: { label: "MEDIUM", bg: "#fdf3d0", fg: "#8a6a09" },
};

export default function AlertCard({ alert }: { alert: AlertItem }) {
  const sev = severityOf(alert);
  const style = SEV_STYLE[sev];

  const reason =
    alert.statusItem === "SHORTAGE" && alert.statusEksekusi === "BELUM SIAP ESEKUSI"
      ? `Stok kosong & belum siap eksekusi. Aging ${alert.agingDays ?? "-"} hari sejak req date.`
      : alert.statusItem === "SHORTAGE"
      ? `Material shortage pada unit ${alert.cn || "-"}. Menunggu ${alert.agingDays ?? "-"} hari.`
      : `Belum siap eksekusi. Menunggu ${alert.agingDays ?? "-"} hari sejak req date.`;

  return (
    <div className="rounded-xl2 border border-black/5 bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-semibold text-ink">{alert.cn || alert.reservation}</div>
          <div className="text-xs text-ink-soft mt-0.5">
            {alert.mtcOrder ? `MO ${alert.mtcOrder}` : `Res ${alert.reservation}`} · {alert.moType}
          </div>
        </div>
        <span
          className="rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide"
          style={{ background: style.bg, color: style.fg }}
        >
          {style.label}
        </span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft line-clamp-3">
        {alert.description ? `${alert.description}. ` : ""}
        {reason}
      </p>
      <div className="mt-4 flex items-center justify-between text-xs">
        <span className="text-ink-soft">
          Aging <span className="font-semibold text-ink">{alert.agingDays ?? "-"} hari</span>
        </span>
        <span className="text-ink-soft">{formatRupiahCompact(alert.totalValues)}</span>
      </div>
    </div>
  );
}
