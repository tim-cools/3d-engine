import {Path, Point, PrimitiveSource, PrimitiveType, Segment, Triangle} from "../../models"

export function generateModelCode(primitives: PrimitiveSource[]) {

  function addPrimitive(primitive: PrimitiveSource) {
    if (primitive.primitive.primitiveType == PrimitiveType.Point) {
      return addPoint(primitive.primitive as Point)
    } else if (primitive.primitive.primitiveType == PrimitiveType.Segment) {
      return addSegment(primitive.primitive as Segment)
    } else if (primitive.primitive.primitiveType == PrimitiveType.Triangle) {
      return addTriangle(primitive.primitive as Triangle)
    } else if (primitive.primitive.primitiveType == PrimitiveType.Path) {
      return addPath(primitive.primitive as Path)
    }
    code.push()
    return []
  }

  function addPoint(primitive: Point) {
    code.push("// point " + index++)
    return [pointRow("point", primitive)]
  }

  function addSegment(segment: Segment) {
    code.push("// segment " + index++)
    return [
      pointRow("begin", segment.begin),
      pointRow("end", segment.end),
    ]
  }

  function addTriangle(triangle: Triangle) {
    code.push("// triangle " + index++)
    return [
      pointRow("point 1", triangle.point1),
      pointRow("point 2", triangle.point2),
      pointRow("point 3", triangle.point3)
    ]
  }

  function addPath(path: Path) {
    code.push("// path " + index++)
    return path.points.map((point, index) => pointRow("point " + index, point))
  }

  function pointRow(label: string, point: Point) {
    return code.push("new Point(" + point.x + ", " + point.y + ", " + point.z)
  }

  let index = 0
  const code: string[] = []
  primitives.map(primitive => addPrimitive(primitive))
  return code.join('\n')
}
