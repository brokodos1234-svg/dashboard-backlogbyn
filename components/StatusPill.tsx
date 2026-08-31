const TONE_MAP: Record<string, { bg: string; fg: string }> = {
  CLOSE: { bg: "#dcfce7", fg: "#16a34a" },
  "BELUM SIAP ESEKUSI": { bg: "#fee2e2", fg: "#dc2626" },
  "SIAP ESEKUSI": { bg: "#dbeafe", fg: "#1d4ed8" },
  "OPSIONAL ESEKUSI": { bg: "#fef9c3", fg: "#a16207" },
  READY: { bg: "#dcfce7", fg: "#16a34a" },
  SHORTAGE: { bg: "#fee2e2", fg: "#dc2626" },
  OPEN: { bg: "#ffedd5", fg: "#c2410c" },
  RUNNING: { bg: "#dcfce7", fg: "#16a34a" },
  "NO RUNNING": { bg: "#fce7f3", fg: "#db2777" },
};

export default function StatusPill({ value }: { value: string }) {
  const tone = TONE_MAP[value] || { bg: "#e5e7eb", fg: "#374151" };
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap"
      style={{ background: tone.bg, color: tone.fg }}
    >
      {value || "-"}
    </span>
  );
}
