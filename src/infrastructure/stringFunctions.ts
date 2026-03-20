export function pad(value: string, number: number): string {
  return value + ' '.repeat(number - value.toString().length);
}

export function hashCode(value: string): number {
  let hash: number = 0
  for (let index = 0; index < value.length; index++) {
    hash = (hash << 5) - hash + value.charCodeAt(index++) | 0;
  }
  return hash
}
