import {Point, Segment} from "./primitives"
import {Size} from "./size"
import {invertSpace, Space, SpaceObject, translateSpace, translateSpaceTriangle} from "./transformations"
import {CanContainPoint, Model} from "./model"
import {Face} from "./face"
import {Lazy} from "../../infrastructure/lazy"
import {Boundaries} from "./boundaries"
import {Triangle} from "./triangle"

export class SpaceModel implements Space, SpaceObject, CanContainPoint {

  static empty: SpaceModel = new SpaceModel(Model.empty, Point.null, Size.default)

  private readonly middleLazy = new Lazy<Point>(() => this.translate(this.model.middle))
  private readonly pointsLazy = new Lazy<readonly Point[]>(() => this.translatePoints())
  private readonly faceLazy = new Lazy<readonly Face[]>(() => this.translateFaces())
  private readonly segmentsLazy = new Lazy<readonly Segment[]>(() => this.translateSegments())
  private readonly boundariesLazy = new Lazy<Boundaries>(() => this.translateBoundaries())
  private readonly model: Model

  readonly position: Point
  readonly scale: Size

  get middle(): Point {
    return this.middleLazy.value
  }

  get points(): readonly Point[] {
    return this.pointsLazy.value
  }

  get faces(): readonly Face[] {
    return this.faceLazy.value
  }

  get segments(): readonly Segment[] {
    return this.segmentsLazy.value
  }

  get boundaries(): Boundaries {
    return this.boundariesLazy.value
  }

  constructor(model: Model, position: Point, scale: Size) {
    this.model = model
    this.position = position
    this.scale = scale
  }

  contains(point: Point) {
    const currentSpacePoint = invertSpace(point, this)
    return this.model.contains(currentSpacePoint)
  }

  translate(point: Point): Point {
    return translateSpace(point, this)
  }

  translateTriangle(triangle: Triangle): Triangle {
    return translateSpaceTriangle(triangle, this)
  }

  private translatePoints(): readonly Point[] {
    return this.model.points.map(point => point.toSpace(this))
  }

  private translateFaces(): readonly Face[] {
    return this.model.faces.map(face => face.toSpace(this))
  }

  private translateSegments(): readonly Segment[] {
    return this.model.segments.map(segment => segment.toSpace(this))
  }

  private translateBoundaries(): Boundaries {
    return this.model.boundaries.toSpace(this)
  }
}
