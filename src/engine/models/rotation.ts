import {Transformer, rotateX, rotateY, rotateZ, transform} from "./transformations"
import {Point} from "./basics"
import {pi} from "../nothing"

export class Rotation {

  static full = pi * 2
  static half = pi
  static quarter = pi * .5
  static eight = pi * .25

  static default = new Rotation()

  private transformersValue: Transformer[] = []
  private direction: Point = Point.null

  get transformers(): Transformer[] {
    return this.transformersValue
  }

  constructor() {
    this.updateTransformation(new Point(1, 0, 0))
  }

  rotate(x: number, y: number) {

//    console.log(`rotate:    ${this.direction} (x: ${x}, y: ${y})`)
    const rotated = transform(this.direction, [rotateX(x), rotateY(y)])
//    console.log(`rotated:   ${rotated}`)

    this.updateTransformation(rotated)
  }

  private updateTransformation(rotated: Point) {
    this.direction = rotated

    const theta = Math.atan2(rotated.x, rotated.y)
    const phi = Math.asin(rotated.z)

//    console.log(`radiants:  theta: ${theta}, phi =: ${phi}`)

    this.transformersValue = [rotateX(-phi), rotateY(-theta)]
  }
}
