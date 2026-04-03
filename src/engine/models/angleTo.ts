//adaption from GeometRi by Sergey Tarasov
import {Linear} from "./linear"

export function angleTo(obj1: Linear, obj2: Linear): number {

  if (obj1.isOriented && obj2.isOriented) {
    const product = obj1.direction.dot(obj2.direction)
    if (product > 1) {
      Math.acos(1)
    } else if (product < -1) {
      Math.acos(-1)
    }
    return Math.acos(product)
  }

  // return smallest angle
  const angle = angleTo(obj1.direction, obj2.direction)
  if (angle <= Math.PI / 2) {
    return angle
  } else {
    return Math.PI - angle
  }
}
