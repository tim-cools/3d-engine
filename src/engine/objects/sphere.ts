import {LineShape, Shape} from "../shapes"
import {Colors} from ".."
import {Size, Point, rotateY, rotateZ} from "../models"
import {BaseObject3D} from "./object"

export class Sphere extends BaseObject3D {

  private readonly shapesValue: LineShape[]

  constructor(id: string, position: Point, size: Size) {
    super(id, position, size)
    this.shapesValue = this.createShapes()
  }

  shapes(): readonly Shape[] {
    return this.shapesValue
  }

  update(timeMilliseconds: number): void {
    const offset = timeMilliseconds / 3600
    for (const shape of this.shapesValue) {
      shape.update([
        //rotateZ(offset),
        //rotateX(offset),
        //rotateY(offset),
      ])
    }
  }

  private lines(color: string) {

    const segmentsNumber = 8

    const size = 1
    const half = size / 2
    const pi = 3.14159
    const startTop = new Point(0, -half, 0)

    const result = []
    const rotateNext = rotateY(pi / segmentsNumber)

    for (let indexHorizontal = 0; indexHorizontal < segmentsNumber * 2; indexHorizontal++) {

      const rotateHorizontal = rotateY(pi / segmentsNumber * indexHorizontal)
      let valueVertical = startTop
      for (let indexVertical = 0; indexVertical <= segmentsNumber; indexVertical++) {

        const rotateVertical = rotateZ(pi / segmentsNumber * indexVertical)
        const nextVertical = rotateHorizontal(rotateVertical(startTop))

        result.push(
          new LineShape(
            `${this.id}.line.${indexHorizontal}.${indexVertical}`,
            color,
            valueVertical,
            nextVertical))

        if (indexVertical > 0 && indexVertical <= segmentsNumber) {
          const nextHorizontal = rotateNext(valueVertical)
          result.push(
            new LineShape(
              `${this.id}.line.${indexHorizontal}.${indexVertical}.h`,
              color,
              valueVertical,
              nextHorizontal))
        }

        valueVertical = nextVertical
      }
    }

    return result
  }

  private createShapes() {
    return [
      ...this.lines(Colors.red),
    ]
  }
}
