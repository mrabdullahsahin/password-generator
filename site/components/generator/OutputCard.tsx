"use client";

import { useMemo, useState } from "react";

export default function OutputCard({
  value,
  ariaLabel,
  mask = true,
}: {
  value: string;
  ariaLabel: string;
  mask?: boolean;
}) {
  const [revealed, setRevealed] = useState(false);
  const display = useMemo(() => {
    if (!value) return "…";
    if (!mask || revealed) return value;
    return "•".repeat(Math.min(value.length, 64));
  }, [mask, revealed, value]);

  async function copy() {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
    } catch {}
  }

  return (
    <div className="p-4 border rounded-md space-y-3" aria-live="polite" aria-label={ariaLabel}>
      <div className="flex items-center justify-between">
        <span className="font-mono text-lg break-all">{display}</span>
        <div className="flex items-center gap-2">
          {mask && (
            <button
              className="px-2 py-1 text-sm rounded border bg-white hover:bg-neutral-50"
              onClick={() => setRevealed((s) => !s)}
            >
              {revealed ? "Hide" : "Show"}
            </button>
          )}
          <button
            className="px-2 py-1 text-sm rounded border bg-white hover:bg-neutral-50"
            onClick={copy}
            disabled={!value}
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}


