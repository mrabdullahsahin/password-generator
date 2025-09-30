export type PasswordOptions = {
  length: number;
  useLowercase: boolean;
  useUppercase: boolean;
  useDigits: boolean;
  useSymbols: boolean;
  excludeLookAlikes: boolean;
  requireEachEnabledClass: boolean;
};

const LOOK_ALIKE_CHARS = new Set<string>(["0", "O", "o", "1", "l", "I", "|", "5", "$"]);

const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{};:'\",.<>?/`~";

function getCryptoRandomUint32(): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] as number;
}

function getRandomInt(maxExclusive: number): number {
  if (maxExclusive <= 0) {
    throw new Error("maxExclusive must be > 0");
  }
  // Rejection sampling to avoid modulo bias.
  const maxUint32 = 0xffffffff; // 2^32 - 1
  const limit = Math.floor((maxUint32 + 1) / maxExclusive) * maxExclusive;
  let rand: number;
  do {
    rand = getCryptoRandomUint32();
  } while (rand >= limit);
  return rand % maxExclusive;
}

function buildCharset(opts: PasswordOptions): string[] {
  let chars = "";
  if (opts.useLowercase) chars += LOWERCASE;
  if (opts.useUppercase) chars += UPPERCASE;
  if (opts.useDigits) chars += DIGITS;
  if (opts.useSymbols) chars += SYMBOLS;
  let arr = chars.split("");
  if (opts.excludeLookAlikes) {
    arr = arr.filter((c) => !LOOK_ALIKE_CHARS.has(c));
  }
  return Array.from(new Set(arr));
}

function pickRandomCharFrom(set: string[]): string {
  const idx = getRandomInt(set.length);
  return set[idx] as string;
}

function ensureClassCoverage(passwordChars: string[], opts: PasswordOptions, sets: {
  lower?: string[];
  upper?: string[];
  digit?: string[];
  symbol?: string[];
}): void {
  if (!opts.requireEachEnabledClass) return;

  const hasLower = passwordChars.some((c) => sets.lower?.includes(c));
  const hasUpper = passwordChars.some((c) => sets.upper?.includes(c));
  const hasDigit = passwordChars.some((c) => sets.digit?.includes(c));
  const hasSymbol = passwordChars.some((c) => sets.symbol?.includes(c));

  const required: Array<keyof typeof sets> = [];
  if (opts.useLowercase && !hasLower) required.push("lower");
  if (opts.useUppercase && !hasUpper) required.push("upper");
  if (opts.useDigits && !hasDigit) required.push("digit");
  if (opts.useSymbols && !hasSymbol) required.push("symbol");

  for (const key of required) {
    const pool = sets[key];
    if (pool && pool.length > 0) {
      const replaceIndex = getRandomInt(passwordChars.length);
      passwordChars[replaceIndex] = pickRandomCharFrom(pool);
    }
  }
}

export function generateRandomPassword(opts: PasswordOptions): string {
  if (opts.length < 4 || opts.length > 128) {
    throw new Error("Password length must be between 4 and 128");
  }

  const fullSet = buildCharset(opts);
  if (fullSet.length === 0) {
    throw new Error("No character classes enabled");
  }

  const sets = {
    lower: opts.useLowercase ? buildCharset({ ...opts, useUppercase: false, useDigits: false, useSymbols: false }) : [],
    upper: opts.useUppercase ? buildCharset({ ...opts, useLowercase: false, useDigits: false, useSymbols: false }) : [],
    digit: opts.useDigits ? buildCharset({ ...opts, useLowercase: false, useUppercase: false, useSymbols: false }) : [],
    symbol: opts.useSymbols ? buildCharset({ ...opts, useLowercase: false, useUppercase: false, useDigits: false }) : [],
  } as const;

  const out: string[] = [];
  for (let i = 0; i < opts.length; i++) {
    out.push(pickRandomCharFrom(fullSet));
  }

  ensureClassCoverage(out, opts, sets);
  return out.join("");
}

export function getEffectiveCharsetSize(opts: PasswordOptions): number {
  return buildCharset(opts).length;
}

export function randomIntInRange(minInclusive: number, maxInclusive: number): number {
  if (maxInclusive < minInclusive) throw new Error("Invalid range");
  const span = maxInclusive - minInclusive + 1;
  return minInclusive + getRandomInt(span);
}


