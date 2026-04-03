import {Point, Segment} from "./primitives"
import {Size} from "./size"
import {nothing, Nothing} from "../../infrastructure/nothing"
import {ModelType} from "./modelType"

export function segments(segments: number, begin: Point, end: Point, size: Size | null = null, type: ModelType = ModelType.Primary) {

  const xSize = (end.x - begin.x) * (size != null ? size.x : 1)
  const ySize = (end.y - begin.y) * (size != null ? size.y : 1)
  const zSize = (end.z - begin.z) * (size != null ? size.z : 1)
  const ratio = 1 / segments

  let beginWorld = size != null ? size.transform(begin) : begin
  let start = beginWorld

  const result = []
  for (let index = 1; index <= segments; index++) {

    const target = new Point(
      xSize * ratio * index + beginWorld.x,
      ySize * ratio * index + beginWorld.y,
      zSize * ratio * index + beginWorld.z)

    result.push(new Segment(start, target, type))

    start = target
  }
  return result
}
