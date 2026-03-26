import {
  CubeModel,
  FaceType,
  modelColor,
  ModelType,
  Path,
  Point,
  SpaceModel,
  Transformer,
  translateSpace,
  Triangle
} from "../models"
import {LineShape, PathShape, PointShape, Shape} from "../shapes"
import {Object3DBase} from "./object"
import {Nothing, nothing} from "../../infrastructure/nothing"
import {Colors} from "../../infrastructure/colors"
import {ApplicationContext} from "../applicationContext"
import {RenderStyle, SceneState, SceneStateIdentifier} from "../state"

export class ModelObject extends Object3DBase {

  private readonly debugShapes: ((translate: Transformer) => readonly Shape[]) | Nothing
  private readonly scene: SceneState
  private readonly context: ApplicationContext

  protected model: SpaceModel
  protected shapesValue: readonly Shape[]

  constructor(context: ApplicationContext, id: string, spaceModel: SpaceModel, debugShape: ((translate: Transformer) => readonly Shape[]) | Nothing = nothing) {
    super(id, Point.null)
    this.model = spaceModel
    this.debugShapes = debugShape
    this.context = context
    this.scene = context.state.get(SceneStateIdentifier)
    context.state.subscribeUpdate(SceneStateIdentifier, () => this.updateShapes())
    this.shapesValue = this.createShapes()
  }

  shapes(): readonly Shape[] {
    return this.shapesValue
  }

  protected updateShapes() {
    this.shapesValue = this.createShapes()
  }

  private createShapes(): readonly Shape[] {
    const style = this.scene.renderStyle
    if (style == RenderStyle.Wireframe) {
      return this.wireframe(false)
    } else if (style == RenderStyle.WireframeDebug) {
      return this.wireframe(true)
    } else if (style == RenderStyle.Solid) {
      return this.solid()
    }
    throw new Error(`Invalid style: ${RenderStyle[style]}`)
  }

  private wireframe(debug: boolean) {
    const result: Shape[] = []
    this.addFacesWireframe(debug, result)
    this.addBoundaries(debug, result)
    this.addSegments(debug, result)
    this.addPoints(debug, result)
    this.addDebugShapes(result)
    return result
  }

  private addSegments(debug: boolean, result: Shape[]) {
    for (let index = 0; index < this.model.segments.length; index++) {
      const segment = this.model.segments[index]
      if (debug || !segment.debug) {
        result.push(LineShape.fromSegment(`${this.id}.line.${index}`, segment, debug))
      }
    }
  }

  private addPoints(debug: boolean, result: Shape[]) {
    for (let index = 0; index < this.model.points.length; index++) {
      const point = this.model.points[index]
      if (debug || !point.debug) {
        const color = debug ? modelColor(point.type) : point.type == ModelType.Utility ? Colors.gray.darker : Colors.primary.middle
        result.push(new PointShape(`${this.id}.point.${index}`, color, point, 2))
      }
    }
  }

  private addDebugShapes(result: Shape[]) {
    if (this.debugShapes == nothing) return
    let debugShapes = this.debugShapes(point => translateSpace(point, this.model))
    for (const debugShape of debugShapes) {
      result.push(debugShape)
    }
  }

  private addBoundaries(debug: boolean, result: Shape[]) {
    if (!this.scene.showBoundaries) return

    const boundaries = this.model.boundaries
    const cubeModel = CubeModel.create(1, boundaries.min, boundaries.max, ModelType.UtilityLight)

    for (let index = 0; index < cubeModel.segments.length; index++) {
      const segment = cubeModel.segments[index]
      result.push(LineShape.fromSegment(`${this.id}.boundary.${index}`, segment, true))
    }
  }

  private solid() {
    const result: Shape[] = []
    for (let index = 0; index < this.model.faces.length; index++) {
      const face = this.model.faces[index]
      this.addFace(face, result, index)
    }
    return result
  }

  private addFace(face: Triangle | Path, result: Shape[], index: number) {
    if (face.debug) return
    if (face.faceType == FaceType.Triangle) {
      result.push(PathShape.fromTriangle(this.id + ".triangle." + index, false, face))
    } else {
      result.push(PathShape.fromPolygon(this.id + ".closePath." + index, false, face))
    }
  }

  private addFacesWireframe(debug: boolean, result: Shape[]) {
    if (this.model.segments.length > 0 && !debug) return
    for (const face of this.model.faces) {
      this.addFaceWireframeTriangles(face, debug, result)
    }
  }

  private addFaceWireframeTriangles(face: Triangle | Path, debug: boolean, result: Shape[]) {

    if (face.faceType == FaceType.Triangle) {
      result.push(PathShape.fromTriangle(this.id + ".triangle." + face.hash, debug, face, false))
      return
    }

    if (debug || !face.debug) {
      for (const triangle of face.triangles) {
        result.push(PathShape.fromTriangle(this.id + ".triangle." + triangle.hash, debug, triangle, false))
      }
      result.push(PathShape.fromPolygon(this.id + ".polygon." + face.hash, debug, face, false))
    }
  }
}
