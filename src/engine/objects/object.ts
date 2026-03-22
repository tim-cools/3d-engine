import {Point, Size, SpaceObject, TransformablePoint} from "../models"
import {Shape, Shape2D} from "../shapes"

export interface HasSceneName {
  setSceneName(sceneName: string): void
}

export type Object = Object2D | Object3D

export interface Object2D {

  readonly is3D: false
  readonly id: string

  shapes(): readonly Shape2D[]
  update(timeMilliseconds: number): void
}

export interface Object3D extends SpaceObject {
  readonly is3D: true
  readonly id: string

  shapes(): readonly Shape[]
  update(timeMilliseconds: number): void
}

export abstract class Object2DBase {

  readonly is3D = false
  readonly id: string

  protected constructor(id: string) {
    this.id = id
  }

  abstract shapes(): readonly Shape2D[]
}

export abstract class Object3DBase {

  protected transformablePosition: TransformablePoint

  readonly is3D = true
  readonly id: string

  get position(): Point {
    return this.transformablePosition
  }

  readonly scale: Size

  protected constructor(id: string, position: Point, scale: Size | undefined = undefined) {
    this.id = id
    this.transformablePosition = new TransformablePoint(position)
    this.scale = scale ?? Size.default
  }

  abstract shapes(): readonly Shape[]
  abstract update(timeMilliseconds: number): void
}
