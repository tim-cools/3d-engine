import {Model} from "./model"
import {segments} from "./segments"
import {Size} from "./size"
import {Point, Segment} from "./primitives"
import {rectangleTriangles} from "./triangles"
import {Rotation} from "./rotation"
import {dontTransform, rotateX, rotateY} from "./transformations"
import {Boundaries} from "./boundaries"
import {Face} from "./face"
import {ModelType} from "./modelType"

export class CubeModel extends Model {

  private static leftBottomFront  = new Point(0, 0, 0)
  private static rightBottomFront = new Point(1, 0, 0)
  private static leftTopFront     = new Point(0, 1, 0)
  private static rightTopFront    = new Point(1, 1, 0)
  private static leftBottomBack   = new Point(0, 0, 1)
  private static rightBottomBack  = new Point(1, 0, 1)
  private static leftTopBack      = new Point(0, 1, 1)
  private static rightTopBack     = new Point(1, 1, 1)

  private constructor(boundaries: Boundaries, segments: readonly Segment[], faces: readonly Face[]) {
    super([], segments, faces, CubeModel.contains(boundaries), CubeModel.onBoundary(boundaries))
  }

  static create(segmentsNumber: number, start: Point = Point.null, end: Point = Point.one, type: ModelType = ModelType.Primary) {

    const size = new Size(end.x - start.x, end.y - start.y, end.z - start.z)
    const boundaries = Boundaries.fromItems(start, end)

    function translate(point: Point): Point {
      return point.multiplySize(size).add(start)
    }

    const cubeSegments = this.segments(segmentsNumber, translate, type)
    const cubeTriangles = this.triangles(segmentsNumber, translate, size, type)

    return new CubeModel(boundaries, cubeSegments, cubeTriangles)
  }

  private static segments(segmentsNumber: number, translate: (point: Point) => Point, type: ModelType) {
    return [
      //back
      ...segments(segmentsNumber, translate(CubeModel.leftBottomBack), translate(CubeModel.rightBottomBack), null, type),
      ...segments(segmentsNumber, translate(CubeModel.leftBottomBack), translate(CubeModel.leftTopBack), null, type),
      ...segments(segmentsNumber, translate(CubeModel.rightBottomBack), translate(CubeModel.rightTopBack), null, type),
      ...segments(segmentsNumber, translate(CubeModel.leftTopBack), translate(CubeModel.rightTopBack), null, type),

      //z
      ...segments(segmentsNumber, translate(CubeModel.leftBottomBack), translate(CubeModel.leftBottomFront), null, type),
      ...segments(segmentsNumber, translate(CubeModel.rightBottomBack), translate(CubeModel.rightBottomFront), null, type),
      ...segments(segmentsNumber, translate(CubeModel.leftTopBack), translate(CubeModel.leftTopFront), null, type),
      ...segments(segmentsNumber, translate(CubeModel.rightTopBack), translate(CubeModel.rightTopFront), null, type),

      //front
      ...segments(segmentsNumber, translate(CubeModel.leftBottomFront), translate(CubeModel.rightBottomFront), null, type),
      ...segments(segmentsNumber, translate(CubeModel.leftBottomFront), translate(CubeModel.leftTopFront), null, type),
      ...segments(segmentsNumber, translate(CubeModel.rightBottomFront), translate(CubeModel.rightTopFront), null, type),
      ...segments(segmentsNumber, translate(CubeModel.leftTopFront), translate(CubeModel.rightTopFront), null, type)
    ]
  }

  private static triangles(segmentsNumber: number, translate: (point: Point) => Point, size: Size, type: ModelType) {
    return [
      ...rectangleTriangles(segmentsNumber, translate(CubeModel.leftBottomFront), size.x, size.y, dontTransform, type),
      ...rectangleTriangles(segmentsNumber, translate(CubeModel.leftBottomBack), size.x, size.y, dontTransform, type),

      ...rectangleTriangles(segmentsNumber, translate(CubeModel.leftBottomFront), size.y, size.z, rotateY(-Rotation.quarter), type),
      ...rectangleTriangles(segmentsNumber, translate(CubeModel.rightBottomFront), size.y, size.z, rotateY(-Rotation.quarter), type),

      ...rectangleTriangles(segmentsNumber, translate(CubeModel.leftBottomFront), size.x, size.z, rotateX(Rotation.quarter), type),
      ...rectangleTriangles(segmentsNumber, translate(CubeModel.leftTopFront), size.x, size.z, rotateX(Rotation.quarter), type)
    ]
  }

  private static contains(boundaries: Boundaries) {
    return (point: Point) => boundaries.contains(point)
  }

  private static onBoundary(boundaries: Boundaries) {
    return (point: Point) => boundaries.onBoundary(point)
  }
}
