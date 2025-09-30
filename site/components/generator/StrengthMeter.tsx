// StrengthMeter.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

export default function StrengthMeter({ value }: { value: string }) {
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>("");

  const normalized = useMemo(() => (value || "").slice(0, 256), [value]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!normalized) {
        setScore(null);
        setFeedback("");
        return;
      }
      const { zxcvbn } = await import("@zxcvbn-ts/core");
      const res = zxcvbn(normalized);
      if (!cancelled) {
        setScore(res.score);
        const fb = res.feedback.suggestions?.join(" ") || res.feedback.warning || "";
        setFeedback(fb);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [normalized]);

  if (!normalized) return null;

  const pct = ((score ?? 0) / 4) * 100;
  const label = scoreLabel(score ?? 0);

  return (
    <div className="space-y-1">
      <div className="h-2 bg-neutral-200 rounded">
        <div
          className="h-2 rounded"
          style={{ width: `${pct}%`, backgroundColor: colorFor(score ?? 0) }}
        />
      </div>
      <div className="text-xs text-neutral-700 flex items-center justify-between">
        <span>{label}</span>
        <span>{score ?? 0}/4</span>
      </div>
      {feedback && (
        <div className="text-xs text-neutral-600">{feedback}</div>
      )}
    </div>
  );
}

function scoreLabel(s: number): string {
  switch (s) {
    case 0:
      return "Very weak";
    case 1:
      return "Weak";
    case 2:
      return "Fair";
    case 3:
      return "Good";
    case 4:
      return "Strong";
    default:
      return "";
  }
}

function colorFor(s: number): string {
  return ["#ef4444", "#f59e0b", "#fbbf24", "#22c55e", "#16a34a"][s] ?? "#ef4444";
}
