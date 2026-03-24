import {Object} from "../objects"
import {Text} from "../nothing"
import {intro} from "./intro"
import {subtractTriangle1} from "./subtractTriangle1"
import {subtractTriangle2} from "./subtractTriangle2"
import {subtractTriangle3} from "./subtractTriangle3"
import {subtractTriangle4} from "./subtractTriangle4"
import {subtractTriangle5} from "./subtractTriangle5"
import {subtractCube} from "./subtractCube"
import {subtractSphere} from "./subtractSphere"
import {layers} from "./layers"
import {cube} from "./cube"
import {sphere} from "./sphere"
import {cubesAndSphere} from "./cubesAndSphere"
import {SceneContext} from "./sceneContext"

export type SceneFactory = (context: SceneContext) => Object[]

export class Scene {

  readonly title: Text
  readonly objects: SceneFactory

  constructor(title: Text, objects: SceneFactory) {
    this.title = title
    this.objects = objects
  }
}

export function scenes(): readonly Scene[] {

  const scenes = [
    layers(),
    cube(),
    sphere(),
    cubesAndSphere(),
    subtractCube(),
    subtractSphere(),
    subtractTriangle1(),
    subtractTriangle2(),
    subtractTriangle3(),
    subtractTriangle4(),
    subtractTriangle5(),
  ]

  return [intro(scenes), ...scenes]
}
