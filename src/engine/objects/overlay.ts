import {Colors} from ".."
import {Line2DShape, Shape, Shape2D} from "../shapes"
import {Object2DBase} from "./object"

export class Overlay extends Object2DBase {

  readonly id: string

  constructor(id: string) {
    super(id)
    this.id = id
  }

  shapes(): readonly Shape2D[] {

    const width = 1
    const height = 1
    const widthMiddle = 0.5
    const heightMiddle = 0.5

    const horizontal = Line2DShape.new(this.id + ".h", Colors.gray.darker, 0, heightMiddle, width, heightMiddle)
    const vertical = Line2DShape.new(this.id + ".v", Colors.gray.darker, widthMiddle, 0, widthMiddle, height)

    return [horizontal, vertical]
  }

  update(timeMilliseconds: number): void {
  }
}
