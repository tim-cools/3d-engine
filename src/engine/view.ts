import {Rotation, Space2D} from "./models"
import {Point2D, Point, TransformablePoint} from "./models"
import {
  subtract,
  moveBy,
  transform
} from "./models"

export interface View2D {
  width: number
  height: number
  translate(point: Point): Point2D
  translateMany(point: readonly Point[]): readonly Point2D[]
}

export class View implements View2D {

  private static defaultRotation: Rotation = Rotation.default

  private rotation: Rotation = View.defaultRotation

  private viewPort: Point = Point.null
  private camera: Point = Point.null

  get width(): number {
    return this.canvas.width
  }

  get height(): number {
    return this.canvas.height
  }

  canvas: HTMLCanvasElement

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.reset()
  }

  translate(coordinate: Point): Point2D {

    const transformers = [
      ...this.rotation.transformers,   // is currently [rotateX(-phi), rotateY(-theta)]
      subtract(this.camera)
    ]

    const transformed = transform(coordinate, transformers)
    const u = this.viewPort.z / transformed.z * transformed.x
    const v = this.viewPort.z / transformed.z * transformed.y

    const widthMiddle = this.width / 2
    const heightMiddle = this.height / 2
    const x = widthMiddle - u * this.height
    const y = heightMiddle + v * this.height

    return new Point2D(x, y)
  }

  moveCamera(x: number | null, y: number | null, z: number | null) {
    this.camera = transform(this.camera, [moveBy(x, y, z)])
  }

  rotate(x: number, y: number) {
    this.rotation.rotate(x, y)
  }

  translateMany(points: readonly Point[]): readonly Point2D[] {
    return points.map(value => this.translate(value))
  }

  reset() {
    this.rotation = View.defaultRotation
    this.viewPort = new Point(0, 0, -750)
    this.camera = TransformablePoint.new(0, 0, -1500)
  }

  toViewCoordinateZ(coordinate: Point) {
    const viewCoordinates = transform(coordinate, this.rotation.transformers)
    return viewCoordinates.z
  }

  space2D(): Space2D {
    const width = this.width
    const height = this.height
    return {
      translate(point: Point2D): Point2D {
        return new Point2D(width * point.x, height * point.y)
      },
      translatePoints(points: Point2D[]): Point2D[] {
        return points.map(point => new Point2D(width * point.x, height * point.y))
      }
    }
  }
}
