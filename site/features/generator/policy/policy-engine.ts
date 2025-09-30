import { hasAscendingSequence, hasKeyboardRun, hasTripleRepeat } from "./rules";

export type PolicySettings = {
  warnOnRepeats: boolean;
  warnOnSequences: boolean;
  warnOnKeyboardRuns: boolean;
};

export type PolicyResult = {
  warnings: string[];
};

export function evaluatePolicy(password: string, settings: PolicySettings): PolicyResult {
  const warnings: string[] = [];
  if (settings.warnOnRepeats && hasTripleRepeat(password)) {
    warnings.push("Contains triple repeat (e.g., aaa)");
  }
  if (settings.warnOnSequences && hasAscendingSequence(password)) {
    warnings.push("Contains ascending sequence (e.g., 1234 or abcd)");
  }
  if (settings.warnOnKeyboardRuns && hasKeyboardRun(password)) {
    warnings.push("Contains keyboard run (e.g., qwerty)");
  }
  return { warnings };
}


