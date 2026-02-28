import {Point} from "./basics"
import {Size} from "./size"
import {invertSpace, SpaceObject} from "./transformations"
import {Model} from "./model"

export class SpaceModel implements SpaceObject {

  public readonly model: Model
  public readonly position: Point
  public readonly scale: Size

  constructor(model: Model, position: Point, scale: Size) {
    this.model = model
    this.position = position
    this.scale = scale
  }

  contains(coordinate: Point) {
    const worldCoordinate = invertSpace(coordinate, this)
    return this.model.contains(worldCoordinate)
  }
}
