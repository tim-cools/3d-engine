import {Object} from "../objects"
import {Text} from "../nothing"
import {intro} from "./intro"
import {subtractTriangle1} from "./subtractTriangle1"
import {subtractTriangle2} from "./subtractTriangle2"
import {subtractCube} from "./subtractCube"
import {subtractSphere} from "./subtractSphere"

export class Scene {

  readonly title: Text
  readonly objects: Object[] = []

  constructor(title: Text, objects: Object[]) {
    this.title = title
    this.objects = objects
  }
}

export function scenes(): readonly Scene[] {

  const scenes = [
    /*layers(),
    cube(),
    sphere(),
    cubesAndSphere(),
    subtractCube(),
    subtractSphere(),
    subtractCubeTest(), */
    subtractCube(),
    subtractSphere(),
    //subtractTriangle1(),
    subtractTriangle2(),
  ]

  return [intro(scenes), ...scenes]
}
