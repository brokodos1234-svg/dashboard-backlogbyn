import Link from "next/link";
import Logo from "./Logo";

export default function TopNav() {
  return (
    <div className="flex items-center justify-between">
      <Link href="/" className="flex items-center gap-3">
        <Logo size={30} />
      </Link>
      <nav className="flex items-center gap-2 rounded-full bg-white p-1.5 shadow-card">
        <Link
          href="/"
          className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white"
        >
          Overview
        </Link>
        <Link
          href="/dashboard"
          className="rounded-full px-4 py-2 text-sm font-medium text-ink-soft hover:bg-canvas"
        >
          Detail Data
        </Link>
        <Link
          href="/dashboard/unit"
          className="rounded-full px-4 py-2 text-sm font-medium text-ink-soft hover:bg-canvas"
        >
          Per Unit
        </Link>
      </nav>
      <div className="hidden items-center gap-3 sm:flex">
        <div className="text-right">
          <div className="text-sm font-semibold text-ink">Site Bayan</div>
          <div className="text-xs text-ink-soft">Warehouse Management</div>
        </div>
      </div>
    </div>
  );
}
