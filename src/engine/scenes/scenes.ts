import {Object} from "../objects"
import {Text} from "../nothing"
import {intro} from "./intro"
import {subtractTriangle1} from "./subtractTriangle1"
import {subtractTriangle2} from "./subtractTriangle2"
import {subtractTriangle3} from "./subtractTriangle3"
import {subtractCube} from "./subtractCube"
import {subtractSphere} from "./subtractSphere"
import {layers} from "./layers"
import {cube} from "./cube"
import {sphere} from "./sphere"
import {cubesAndSphere} from "./cubesAndSphere"
import {subtractTriangle4} from "./subtractTriangle4"
import {Lazy} from "../../infrastructure/lazy"

export class Scene {

  readonly title: Text
  readonly objects: Lazy<Object[]>

  constructor(title: Text, objects: Lazy<Object[]>) {
    this.title = title
    this.objects = objects
  }
}

export function scenes(): readonly Scene[] {

  const scenes = [
    /* layers(),
    cube(),
    sphere(),
    cubesAndSphere(), */
    subtractCube(),
    subtractSphere(),
    subtractTriangle1(),
    subtractTriangle2(),
    subtractTriangle3(),
    subtractTriangle4(),
  ]

  return [intro(scenes), ...scenes]
}
