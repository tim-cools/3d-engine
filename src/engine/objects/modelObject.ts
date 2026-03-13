import {
  CubeModel,
  FaceType,
  modelColor,
  ModelType,
  Point,
  Path,
  SpaceModel,
  translateSpace,
  Triangle
} from "../models"
import {LineShape, PathShape, PointShape, Shape, UpdatableShape} from "../shapes"
import {BaseObject3D, HasObjectStyle, ObjectStyle} from "./object"
import {Transformer} from "../models"
import {Nothing, nothing} from "../nothing"
import {Colors} from "../colors"
import {pushMany} from "../../infrastructure"

export class ModelObject extends BaseObject3D implements HasObjectStyle {

  protected readonly model: SpaceModel

  private showBoundaries: boolean = false
  private debugShapes: ((translate: Transformer) => readonly UpdatableShape[]) | Nothing
  private style: ObjectStyle = ObjectStyle.Wireframe

  protected shapesValue: readonly UpdatableShape[]

  constructor(id: string, spaceModel: SpaceModel, debugShape: ((translate: Transformer) => readonly UpdatableShape[]) | Nothing = nothing) {
    super(id, Point.null)
    this.model = spaceModel
    this.debugShapes = debugShape
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

    this.addBoundaries(debug, result)
    this.addSegments(debug, result)
    this.addPoints(debug, result)
    this.addDebugShapes(result)

    return result
  }

  private addSegments(debug: boolean, result: UpdatableShape[]) {
    for (let index = 0; index < this.model.segments.length; index++) {
      const segment = this.model.segments[index]
      if (debug || !segment.debug) {
        result.push(LineShape.fromSegment(`${this.id}.line.${index}`, segment, debug))
      }
    }
  }

  private addPoints(debug: boolean, result: UpdatableShape[]) {
    for (let index = 0; index < this.model.points.length; index++) {
      const point = this.model.points[index]
      if (debug || !point.debug) {
        const color = debug ? modelColor(point.type) : point.type == ModelType.Utility ? Colors.gray.darker : Colors.primary.middle
        result.push(new PointShape(`${this.id}.point.${index}`, color, point, 2))
      }
    }
  }

  private addDebugShapes(result: UpdatableShape[]) {
    if (this.debugShapes == nothing) return
    let debugShapes = this.debugShapes(point => translateSpace(point, this.model))
    for (const debugShape of debugShapes) {
      result.push(debugShape)
    }
  }

  private addBoundaries(showBoundaries: boolean, result: UpdatableShape[]) {
    if (!this.showBoundaries) return

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

  private addFace(face: Triangle | Path, result: UpdatableShape[], index: number) {
    if (face.debug) return
    if (face.faceType == FaceType.Triangle) {
      result.push(PathShape.fromTriangle(this.id + ".triangle." + index, face))
    } else {
      pushMany(result, PathShape.fromPolygon(this.id + ".closePath." + index, face))
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
    this.addPoints(true, result)
    return result
  }
}
