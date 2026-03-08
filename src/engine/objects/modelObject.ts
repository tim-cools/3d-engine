import {CubeModel, FaceType, ModelType, Point, Polygon, SpaceModel, Triangle} from "../models"
import {LineShape, PathShape, Shape, UpdatableShape} from "../shapes"
import {BaseObject3D, HasObjectStyle, ObjectStyle} from "./object"

export class ModelObject extends BaseObject3D implements HasObjectStyle {

  protected readonly model: SpaceModel

  private showBoundaries: boolean = false
  private style: ObjectStyle = ObjectStyle.Wireframe

  protected shapesValue: readonly UpdatableShape[]

  constructor(id: string, spaceModel: SpaceModel) {
    super(id, Point.null)
    this.model = spaceModel
    this.shapesValue = this.createShapes()
  }

  setShowBoundaries(showBoundaries: boolean) {
    this.showBoundaries = showBoundaries
    this.shapesValue = this.createShapes()
  }

  setStyle(style: ObjectStyle) {
    this.style = style
    this.shapesValue = this.createShapes()
  }

  update(timeMilliseconds: number): void {
  }

  shapes(): readonly Shape[] {
    return this.shapesValue
  }

  private createShapes(): readonly UpdatableShape[] {
    if (this.style == ObjectStyle.Wireframe) {
      return this.wireframe(false)
    } else if (this.style == ObjectStyle.WireframeDebug) {
      return this.wireframe(true)
    } else if (this.style == ObjectStyle.Solid) {
      return this.solid()
    } else if (this.style == ObjectStyle.FacesWireframe) {
      return this.facesWireframe()
    }
    throw new Error(`Invalid style: ${ObjectStyle[this.style]}`)
  }

  private wireframe(debug: boolean) {
    const result: UpdatableShape[] = []
    if (this.showBoundaries) {
      this.addBoundaries(debug, result)
    }
    for (let index = 0; index < this.model.segments.length; index++) {
      const segment = this.model.segments[index]
      if (debug || !segment.debug) {
        result.push(LineShape.fromSegment(this.id + ".line." + index, segment, debug))
      }
    }
    return result
  }

  private addBoundaries(showBoundaries: boolean, result: UpdatableShape[]) {
    if (!showBoundaries) return

    const boundaries = this.model.boundaries
    const cubeModel = CubeModel.create(1, boundaries.min, boundaries.max, ModelType.UtilityLight)

    for (let index = 0; index < cubeModel.segments.length; index++) {
      const segment = cubeModel.segments[index]
      result.push(LineShape.fromSegment(`${this.id}.boundary.${index}`, segment, true))
    }
  }

  private solid() {
    const result: UpdatableShape[] = []
    for (let index = 0; index < this.model.faces.length; index++) {
      const face = this.model.faces[index]
      this.addFace(face, result, index)
    }
    return result
  }

  private addFace(face: Triangle | Polygon, result: UpdatableShape[], index: number) {
    if (face.debug) return
    if (face.faceType == FaceType.Triangle) {
      result.push(PathShape.fromTriangle(this.id + ".triangle." + index, face))
    } else {
      result.push(PathShape.fromPolygon(this.id + ".polygon." + index, face))
    }
  }

  private facesWireframe() {
    const added: Map<string, any> = new Map()
    const result: UpdatableShape[] = []
    for (let index = 0 ; index < this.model.faces.length ; index++) {
      const face = this.model.faces[index]
      for (const triangle of face.triangles) {
        const key = triangle.key()
        if (!added.has(key)) {
          result.push(LineShape.fromPoints(this.id + ".line." + index, triangle.type, triangle.point1, triangle.point2))
          result.push(LineShape.fromPoints(this.id + ".line." + index, triangle.type, triangle.point2, triangle.point3))
          result.push(LineShape.fromPoints(this.id + ".line." + index, triangle.type, triangle.point3, triangle.point1))
          added.set(key, {})
        }
      }
    }
    return result
  }
}
