const KEYBOARD_ROWS = [
  "qwertyuiop",
  "asdfghjkl",
  "zxcvbnm",
  "1234567890",
];

export function hasTripleRepeat(input: string): boolean {
  if (!input) return false;
  let run = 1;
  for (let i = 1; i < input.length; i++) {
    if (input[i] === input[i - 1]) {
      run++;
      if (run >= 3) return true;
    } else {
      run = 1;
    }
  }
  return false;
}

export function hasAscendingSequence(input: string, minLen: number = 4): boolean {
  if (!input || input.length < minLen) return false;
  const isAlnum = (c: string) => /[a-z0-9]/i.test(c);
  const toVal = (c: string) => {
    const lower = c.toLowerCase();
    if (/[a-z]/.test(lower)) return lower.charCodeAt(0) - 97; // a=0
    if (/[0-9]/.test(lower)) return 26 + (lower.charCodeAt(0) - 48); // 0=26
    return -1000;
  };
  let streak = 1;
  for (let i = 1; i < input.length; i++) {
    const a = input[i - 1] ?? "";
    const b = input[i] ?? "";
    if (!isAlnum(a) || !isAlnum(b)) {
      streak = 1;
      continue;
    }
    const va = toVal(a);
    const vb = toVal(b);
    if (vb - va === 1) {
      streak++;
      if (streak >= minLen) return true;
    } else {
      streak = 1;
    }
  }
  return false;
}

export function hasKeyboardRun(input: string, minLen: number = 4): boolean {
  if (!input || input.length < minLen) return false;
  const s = input.toLowerCase();
  for (const row of KEYBOARD_ROWS) {
    if (containsRun(s, row, minLen)) return true;
    const rev = row.split("").reverse().join("");
    if (containsRun(s, rev, minLen)) return true;
  }
  return false;
}

function containsRun(haystack: string, row: string, minLen: number): boolean {
  for (let i = 0; i <= row.length - minLen; i++) {
    const sub = row.slice(i, i + minLen);
    if (haystack.includes(sub)) return true;
  }
  return false;
}


