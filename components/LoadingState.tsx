export default function LoadingState({
  label = "Mengambil data terbaru dari Google Sheets...",
}: {
  label?: string;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-mint-200 border-t-mint-600" />
      <div>
        <div className="font-semibold text-ink">{label}</div>
        <div className="mt-1 text-sm text-ink-soft">
          Sheet Master berisi ~37 ribu baris, proses pertama bisa memakan waktu 20–40 detik.
        </div>
      </div>
    </div>
  );
}
