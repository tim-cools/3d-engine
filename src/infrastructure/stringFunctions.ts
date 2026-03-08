export function pad(value: string, number: number): string {
  return value + ' '.repeat(number - value.toString().length);
}
