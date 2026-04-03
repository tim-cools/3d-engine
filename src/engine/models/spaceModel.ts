import {Point, Segment} from "./primitives"
import {Size} from "./size"
import {invertSpace, Space, SpaceObject, translateSpace, translateSpaceTriangle} from "./transformations"
import {CanContainPoint, Model, ModelBase} from "./model"
import {Face} from "./face"
import {Lazy} from "../../infrastructure/lazy"
import {Boundaries} from "./boundaries"
import {Triangle} from "./triangle"
import {ValuesCache} from "../../infrastructure/valuesCache"

export class SpaceModel implements ModelBase, Space, SpaceObject, CanContainPoint {

  static empty: SpaceModel = new SpaceModel(Model.empty, Point.null, Size.default)

  private readonly cache: ValuesCache = new ValuesCache()

  readonly model: Model

  readonly position: Point
  readonly scale: Size

  get middle(): Point {
    return this.cache.get("middle", () => this.translate(this.model.middle))
  }

  get points(): readonly Point[] {
    return this.cache.get("points", () => this.translatePoints())
  }

  get faces(): readonly Face[] {
    return this.cache.get("faces", () => this.translateFaces())
  }

  get segments(): readonly Segment[] {
    return this.cache.get("segments", () => this.translateSegments())
  }

  get boundaries(): Boundaries {
    return this.cache.get("boundaries", () => this.translateBoundaries())
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
