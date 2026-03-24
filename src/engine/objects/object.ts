import {Point, Size, SpaceObject, TransformablePoint} from "../models"
import {Shape} from "../shapes"
import {Object2D} from "./object2D"

export type Object = Object2D | Object3D

export interface Object3D extends SpaceObject {

  readonly is3D: true
  readonly id: string

  shapes(): readonly Shape[]
}

export abstract class Object3DBase {

  protected transformablePosition: TransformablePoint

  readonly is3D = true
  readonly id: string

  readonly scale: Size

  get position(): Point {
    return this.transformablePosition
  }

  protected constructor(id: string, position: Point, scale: Size | undefined = undefined) {
    this.id = id
    this.transformablePosition = new TransformablePoint(position)
    this.scale = scale ?? Size.default
  }

  abstract shapes(): readonly Shape[]
}
