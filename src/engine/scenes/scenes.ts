import {Point, Size, SpaceModel} from "../models"
import {Object} from "../objects"
import {Colors} from "../colors"
import {ModelObject} from "../objects/modelObject"
import {AxisModel} from "../models/axisModel"
import {Text} from "../nothing"
import {intro} from "./intro"
import {layers} from "./layers"
import {cubesAndSphere} from "./cubesAndSphere"
import {cube} from "./cube"
import {sphere} from "./sphere"
import {subtractSphere} from "./subtractSphere"
import {subtractCube} from "./subtractCube"

export class Scene {

  readonly title: Text
  readonly objects: Object[] = []

  constructor(title: Text, objects: Object[]) {
    this.title = title
    this.objects = objects
  }
}

export function axis() {
  const model = AxisModel.create(Point.null, Size.default)
  const spaceModel = new SpaceModel(model, Point.null, Size.default)
  return new ModelObject("axis", Colors.gray.dark, spaceModel)
}

export function scenes(): readonly Scene[] {

  const scenes = [
    layers(),
    cube(),
    sphere(),
    cubesAndSphere(),
    //subtractCube(),
    subtractSphere(),
  ]

  return [intro(scenes), ...scenes]
}
