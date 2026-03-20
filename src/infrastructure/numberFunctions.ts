function ulp(x: number) {
  if (!isFinite(x)) return NaN;
  x = Math.abs(x);
  if (x === 0) return Number.MIN_VALUE; // smallest positive subnormal
  const exp = Math.floor(Math.log2(x));
  return 2 ** (exp - 52); // double: 52 fraction bits
}

export function round(n: number, p: number = 2) {
  const e = 10 ** p;
  const x = n * e;
  // nudge by half an ulp at the scale you're rounding
  return Math.round(x + 0.5 * ulp(x)) / e;
}
