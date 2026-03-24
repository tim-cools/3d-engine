export class Padding {

  public static default = Padding.single(8)

  readonly top: number
  readonly bottom: number
  readonly left: number
  readonly right: number

  constructor(top: number, bottom: number, left: number, right: number) {
    this.top = top
    this.bottom = bottom
    this.left = left
    this.right = right
  }

  static single(number: number) {
    return new Padding(number, number, number, number)
  }

  static both(horizontal: number, vertical: number) {
    return new Padding(vertical, vertical, horizontal, horizontal)
  }
}
