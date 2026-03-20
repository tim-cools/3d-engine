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
import {BaseObject3D} from "./object"
import {Transformer} from "../models"
import {Nothing, nothing} from "../nothing"
import {Colors} from "../colors"
import {HasRenderStyle, RenderStyle} from "./renderStyle"

export class ModelObject extends BaseObject3D implements HasRenderStyle {

  protected model: SpaceModel

  private showBoundaries: boolean = false
  private debugShapes: ((translate: Transformer) => readonly UpdatableShape[]) | Nothing
  private style: RenderStyle = RenderStyle.Wireframe

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

  setStyle(style: RenderStyle) {
    this.style = style
    this.shapesValue = this.createShapes()
  }

  update(timeMilliseconds: number): void {
  }

  shapes(): readonly Shape[] {
    return this.shapesValue
  }

  protected createShapes(): readonly UpdatableShape[] {
    if (this.style == RenderStyle.Wireframe) {
      return this.wireframe(false)
    } else if (this.style == RenderStyle.WireframeDebug) {
      return this.wireframe(true)
    } else if (this.style == RenderStyle.Solid) {
      return this.solid()
    }
    throw new Error(`Invalid style: ${RenderStyle[this.style]}`)
  }

  private wireframe(debug: boolean) {

    const result: UpdatableShape[] = []
    this.addFacesWireframe(debug, result)
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
      result.push(PathShape.fromTriangle(this.id + ".triangle." + index, false, face))
    } else {
      result.push(PathShape.fromPolygon(this.id + ".closePath." + index, false, face))
    }
  }

  private addFacesWireframe(debug: boolean, result: UpdatableShape[]) {
    if (this.model.segments.length > 0 && !debug) return
    const added: Map<string, any> = new Map()
    for (let index = 0 ; index < this.model.faces.length ; index++) {
      const face = this.model.faces[index]
      if (debug || !face.debug) {
        this.addFaceWireframeTriangles(face, debug, added, result, index)
      }
    }
  }

  private addFaceWireframeTriangles(face: Triangle | Path, debug: boolean, added: Map<string, any>, result: UpdatableShape[], index: number) {
    for (const triangle of face.triangles) {

      const key = triangle.key()
      if (added.has(key)) continue

      result.push(LineShape.fromPoints(this.id + ".line." + index, debug, triangle.type, triangle.point1, triangle.point2))
      result.push(LineShape.fromPoints(this.id + ".line." + index, debug, triangle.type, triangle.point2, triangle.point3))
      result.push(LineShape.fromPoints(this.id + ".line." + index, debug, triangle.type, triangle.point3, triangle.point1))

      added.set(key, {})
    }
  }
}
