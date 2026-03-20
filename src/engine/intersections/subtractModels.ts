import {Model, SpaceModel} from "../models"

export class SubtractModels {

  readonly master: Model
  readonly subtract: SpaceModel

  constructor(master: Model, subtract: SpaceModel) {
    this.master = master
    this.subtract = subtract
  }
}
