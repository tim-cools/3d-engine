import {Model} from "./model"
import {segments} from "./segments"
import {Size} from "./size"
import {Point, Segment} from "./basics"
import {Triangle} from "./triangle"
import {rectangleTriangles} from "./triangles"
import {Rotation} from "./rotation"
import {dontTransform, rotateX, rotateY, rotateZ} from "./transformations"

export class CubeModel extends Model {

  private static leftBottomFront  = new Point(0, 0, 0)
  private static rightBottomFront = new Point(1, 0, 0)
  private static leftTopFront     = new Point(0, 1, 0)
  private static rightTopFront    = new Point(1, 1, 0)
  private static leftBottomBack   = new Point(0, 0, 1)
  private static rightBottomBack  = new Point(1, 0, 1)
  private static leftTopBack      = new Point(0, 1, 1)
  private static rightTopBack     = new Point(1, 1, 1)

  private constructor(vertices: readonly Segment[], triangles: readonly Triangle[]) {
    super(vertices, triangles, CubeModel.contains(), CubeModel.onBoundary())
  }

  static create(segmentsNumber: number, start: Point = Point.null, end: Point = Point.one) {

    const size = new Size(end.x - start.x, end.y - start.y, end.z - start.z)
    function translate(point: Point): Point {
      return point.multiplySize(size).add(start)
    }

    const cubeSegments = this.segments(segmentsNumber, translate)
    const cubeTriangles = this.triangles(segmentsNumber, translate, size)

    return new CubeModel(cubeSegments, cubeTriangles)
  }

  private static segments(segmentsNumber: number, translate: (point: Point) => Point) {
    return [
      //back
      ...segments(segmentsNumber, translate(CubeModel.leftBottomBack), translate(CubeModel.rightBottomBack)),
      ...segments(segmentsNumber, translate(CubeModel.leftBottomBack), translate(CubeModel.leftTopBack)),
      ...segments(segmentsNumber, translate(CubeModel.rightBottomBack), translate(CubeModel.rightTopBack)),
      ...segments(segmentsNumber, translate(CubeModel.leftTopBack), translate(CubeModel.rightTopBack)),

      //z
      ...segments(segmentsNumber, translate(CubeModel.leftBottomBack), translate(CubeModel.leftBottomFront)),
      ...segments(segmentsNumber, translate(CubeModel.rightBottomBack), translate(CubeModel.rightBottomFront)),
      ...segments(segmentsNumber, translate(CubeModel.leftTopBack), translate(CubeModel.leftTopFront)),
      ...segments(segmentsNumber, translate(CubeModel.rightTopBack), translate(CubeModel.rightTopFront)),

      //front
      ...segments(segmentsNumber, translate(CubeModel.leftBottomFront), translate(CubeModel.rightBottomFront)),
      ...segments(segmentsNumber, translate(CubeModel.leftBottomFront), translate(CubeModel.leftTopFront)),
      ...segments(segmentsNumber, translate(CubeModel.rightBottomFront), translate(CubeModel.rightTopFront)),
      ...segments(segmentsNumber, translate(CubeModel.leftTopFront), translate(CubeModel.rightTopFront))
    ]
  }

  private static triangles(segmentsNumber: number, translate: (point: Point) => Point, size: Size) {
    return [
      ...rectangleTriangles(segmentsNumber, translate(CubeModel.leftBottomFront), size.x, size.y, dontTransform),
      ...rectangleTriangles(segmentsNumber, translate(CubeModel.leftBottomBack), size.x, size.y, dontTransform),

      ...rectangleTriangles(segmentsNumber, translate(CubeModel.leftBottomFront), size.y, size.z, rotateY(-Rotation.quarter)),
      ...rectangleTriangles(segmentsNumber, translate(CubeModel.rightBottomFront), size.y, size.z, rotateY(-Rotation.quarter)),

      ...rectangleTriangles(segmentsNumber, translate(CubeModel.leftBottomFront), size.x, size.z, rotateX(Rotation.quarter)),
      ...rectangleTriangles(segmentsNumber, translate(CubeModel.leftTopFront), size.x, size.z, rotateX(Rotation.quarter))
    ]
  }

  private static contains() {
    return (point: Point) => Size.default.contains(point)
  }

  private static onBoundary() {
    return (point: Point) => Size.default.onBoundary(point)
  }
}
