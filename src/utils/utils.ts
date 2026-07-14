export const range = (
  start: number,
  stop: number,
  step: number,
  p0: (t: any) => Date,
) => Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);


/** Multiply two numbers. */
export const multiply = (a: number, b: number): number => a * b;
