import {Colors} from ".."
import {Line2DShape, Shape2D} from "../shapes"
import {Object2DBase} from "./object2D"

export class Overlay extends Object2DBase {

  constructor(id: string) {
    super(id)
  }

  protected createShapes(): readonly Shape2D[] {

    const width = 1
    const height = 1
    const widthMiddle = 0.5
    const heightMiddle = 0.5

    const horizontal = Line2DShape.new(this.id + ".h", Colors.gray.darker, 0, heightMiddle, width, heightMiddle)
    const vertical = Line2DShape.new(this.id + ".v", Colors.gray.darker, widthMiddle, 0, widthMiddle, height)

    return [horizontal, vertical]
  }
}
