import { randomIntInRange } from "./random";

export type PassphraseOptions = {
  words: string[];
  wordCount: number; // 3-8
  separator: string; // '-', '_', '.', ' '
  capitalizeWords: boolean;
  avoidDuplicates: boolean;
  numericOrSymbolSuffix?: string | null; // e.g. '1' or '!'
};

export function generatePassphrase(opts: PassphraseOptions): string {
  if (opts.wordCount < 3 || opts.wordCount > 8) {
    throw new Error("wordCount must be 3-8");
  }
  if (!opts.words || opts.words.length === 0) {
    throw new Error("words list is empty");
  }
  if (opts.avoidDuplicates && opts.words.length < opts.wordCount) {
    throw new Error("words list too small for unique selection");
  }

  const chosen: string[] = [];
  const used = new Set<string>();
  for (let i = 0; i < opts.wordCount; i++) {
    let w: string;
    let safety = 0;
    do {
      w = opts.words[randomIntInRange(0, opts.words.length - 1)]!;
      safety++;
      if (safety > 1000) throw new Error("word selection overflow");
    } while (opts.avoidDuplicates && used.has(w));
    used.add(w);
    chosen.push(opts.capitalizeWords ? capitalize(w) : w);
  }

  const core = chosen.join(opts.separator);
  return opts.numericOrSymbolSuffix ? core + String(opts.numericOrSymbolSuffix) : core;
}

function capitalize(w: string): string {
  if (!w) return w;
  return w.charAt(0).toUpperCase() + w.slice(1);
}


