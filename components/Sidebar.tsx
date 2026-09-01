"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

const ITEMS = [
  { href: "/", label: "Overview", icon: HomeIcon },
  { href: "/dashboard", label: "Detail Data (Master)", icon: TableIcon },
  { href: "/dashboard/unit", label: "Breakdown Unit (C/N)", icon: UnitIcon },
  { href: "/dashboard/mo-open", label: "MO Open", icon: MoOpenIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col bg-sidebar px-4 py-6 text-white">
      <div className="flex items-center gap-2 px-2">
        <div className="rounded-lg bg-white p-2">
          <Logo size={20} />
        </div>
        <div>
          <div className="text-sm font-semibold">BSS Bayan</div>
          <div className="text-[11px] text-white/50">Backlog &amp; PCR</div>
        </div>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {ITEMS.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                active ? "bg-sidebar-soft text-white" : "text-white/60 hover:bg-sidebar-soft hover:text-white"
              }`}
            >
              <Icon />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-lg border border-sidebar-border px-3 py-3 text-[11px] text-white/50">
        Data live dari Google Sheets. Update sheet langsung memperbarui dashboard (cache singkat).
      </div>
    </aside>
  );
}

function iconProps() {
  return { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8 };
}

function HomeIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M3 11.5 12 4l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TableIcon() {
  return (
    <svg {...iconProps()}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
      <path d="M3.5 9.5h17M9 4.5v15" />
    </svg>
  );
}

function UnitIcon() {
  return (
    <svg {...iconProps()}>
      <rect x="3.5" y="3.5" width="8" height="8" rx="1.5" />
      <rect x="12.5" y="3.5" width="8" height="8" rx="1.5" />
      <rect x="3.5" y="12.5" width="8" height="8" rx="1.5" />
      <rect x="12.5" y="12.5" width="8" height="8" rx="1.5" />
    </svg>
  );
}

function MoOpenIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M4 7.5 12 3l8 4.5-8 4.5-8-4.5Z" strokeLinejoin="round" />
      <path d="M4 7.5V16l8 4.5 8-4.5V7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 12v8.5" strokeLinecap="round" />
    </svg>
  );
}
