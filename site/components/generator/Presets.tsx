"use client";

import type { PasswordOptions } from "@/features/generator/core/random";

type Preset = { name: string; apply: (opts: PasswordOptions) => PasswordOptions };

const PRESETS: Preset[] = [
  {
    name: "Easy to read 16",
    apply: (o) => ({ ...o, length: 16, useLowercase: true, useUppercase: true, useDigits: true, useSymbols: false, excludeLookAlikes: true, requireEachEnabledClass: true }),
  },
  {
    name: "Strong 24 + symbols",
    apply: (o) => ({ ...o, length: 24, useLowercase: true, useUppercase: true, useDigits: true, useSymbols: true, excludeLookAlikes: false, requireEachEnabledClass: true }),
  },
  {
    name: "Digits only 8",
    apply: (o) => ({ ...o, length: 8, useLowercase: false, useUppercase: false, useDigits: true, useSymbols: false, excludeLookAlikes: false, requireEachEnabledClass: false }),
  },
];

export default function Presets({ value, onChange }: { value: PasswordOptions; onChange: (v: PasswordOptions) => void }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-neutral-700">Preset:</span>
      <select className="border rounded px-2 py-1"
              onChange={(e) => {
                const idx = Number(e.target.value);
                if (!Number.isNaN(idx) && PRESETS[idx]) onChange(PRESETS[idx]!.apply(value));
              }}>
        <option value="">Select…</option>
        {PRESETS.map((p, i) => (
          <option value={String(i)} key={p.name}>{p.name}</option>
        ))}
      </select>
    </div>
  );
}


