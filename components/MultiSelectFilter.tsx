"use client";

import { useEffect, useRef, useState } from "react";

export default function MultiSelectFilter({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function toggle(value: string) {
    if (selected.includes(value)) onChange(selected.filter((v) => v !== value));
    else onChange([...selected, value]);
  }

  const buttonLabel =
    selected.length === 0
      ? `${label}: Semua`
      : selected.length === 1
      ? `${label}: ${selected[0]}`
      : `${label}: ${selected.length} dipilih`;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-left text-sm outline-none focus:border-ink"
      >
        {buttonLabel}
      </button>
      {open && (
        <div className="absolute left-0 top-[calc(100%+4px)] z-20 w-56 rounded-lg border border-black/10 bg-white py-1.5 text-sm shadow-cardHover">
          {selected.length > 0 && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="block w-full px-3 py-1.5 text-left text-ink-soft hover:bg-canvas"
            >
              Reset ({selected.length} dipilih)
            </button>
          )}
          {options.map((o) => (
            <label
              key={o}
              className="flex cursor-pointer items-center gap-2 px-3 py-1.5 hover:bg-canvas"
            >
              <input
                type="checkbox"
                checked={selected.includes(o)}
                onChange={() => toggle(o)}
                className="h-3.5 w-3.5"
              />
              {o}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
