export function differenceInMilliseconds(laterDate: Date, earlierDate: Date): number {
  return (+laterDate - +earlierDate)
}

export function pad(value: string, number: number) {
  return value + ' '.repeat(number - value.toString().length);
}

export function padNumber(value: number, number: number) {
  return value + ' '.repeat(number - value.toString().length);
}
