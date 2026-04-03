import {Point} from "./primitives"
import {add, multiply, transform, Transformer} from "./transformations"
import {Size} from "./size"
import {Triangle} from "./triangle"
import {ModelType} from "./modelType"

export function rectangleTriangles(segments: number, position: Point, sizeHorizontal: number, sizeVertical: number, rotation: Transformer, type: ModelType = ModelType.Primary) {

  const ratio = 1 / segments
  const result: Triangle[] = []

  const transformations: Transformer[] = [
    multiply(new Size(sizeHorizontal, sizeVertical, 1)),
    rotation,
    add(position),
  ]

  for (let horizontal = 0; horizontal < segments; horizontal++) {
    for (let vertical = 0; vertical < segments; vertical++) {

      const start = new Point(horizontal * ratio, vertical * ratio, 0)
      const right = new Point((horizontal + 1) * ratio, vertical * ratio, 0)
      const top = new Point(horizontal * ratio, (vertical + 1) * ratio, 0)
      const topRight = new Point((horizontal + 1) * ratio, (vertical + 1) * ratio, 0)
      
      const startTransformed = transform(start, transformations)
      const rightTransformed = transform(right, transformations)
      const topTransformed = transform(top, transformations)
      const topRightTransformed = transform(topRight, transformations)

      result.push(new Triangle(startTransformed, topTransformed, rightTransformed, type))
      result.push(new Triangle(topTransformed, topRightTransformed, rightTransformed, type))
    }
  }
  return result
}
