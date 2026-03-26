import {Transformer, rotateX, rotateY, rotateZ, transform} from "./transformations"
import {Point} from "./primitives"

export class Rotation {

  static full = Math.PI * 2
  static half = Math.PI
  static quarter = Math.PI * .5
  static eight = Math.PI * .25

  static default = new Rotation()

  private transformersValue: Transformer[] = []
  private direction: Point = Point.null

  get transformers(): Transformer[] {
    return this.transformersValue
  }

  constructor() {
    this.updateTransformation(new Point(0, 1, 0))
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
