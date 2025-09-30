"use client";

import { evaluatePolicy, type PolicySettings } from "@/features/generator/policy/policy-engine";

export default function PolicyWarnings({ value, settings }: { value: string; settings: PolicySettings }) {
  const { warnings } = evaluatePolicy(value, settings);
  if (warnings.length === 0) return null;
  return (
    <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded p-3">
      <ul className="list-disc list-inside space-y-1">
        {warnings.map((w, i) => (
          <li key={i}>{w}</li>
        ))}
      </ul>
    </div>
  );
}


