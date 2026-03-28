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
import {Scene} from "./scene"

export function createScenes(): readonly Scene[] {
  return [
    cube(),
    sphere(),
    layers(),
    cubesAndSphere(),
    subtractCube(),
    subtractSphere(),
    subtractTriangle1(),
    subtractTriangle2(),
    subtractTriangle3(),
    subtractTriangle4(),
    subtractTriangle5(),
  ]
}
