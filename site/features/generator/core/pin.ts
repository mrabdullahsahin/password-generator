import { randomIntInRange } from "./random";

export function generatePin(length: number): string {
  if (length < 3 || length > 12) throw new Error("PIN length must be 3-12");
  const digits: string[] = [];
  for (let i = 0; i < length; i++) {
    digits.push(String(randomIntInRange(0, 9)));
  }
  return digits.join("");
}


