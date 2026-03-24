export class ElementPosition {

  static readonly zero: ElementPosition = new ElementPosition(0, 0)

  readonly left: number
  readonly top: number

  constructor(left: number, top: number) {
    this.left = left
    this.top = top
  }
}
