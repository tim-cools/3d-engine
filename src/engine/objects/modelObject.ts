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
import {RenderStyle} from "../state"
import {ObjectProperty, TypedObjectProperty} from "./objectProperties"

export class ModelObject extends Object3DBase {

  private readonly renderStyleProperty: TypedObjectProperty<RenderStyle>
  private readonly showBoundariesProperty: TypedObjectProperty<boolean>

  private readonly debugShapes: ((translate: Transformer) => readonly Shape[]) | Nothing
  private readonly context: ApplicationContext

  protected model: SpaceModel
  protected shapesValue: readonly Shape[]

  constructor(context: ApplicationContext, id: string, spaceModel: SpaceModel, debugShape: ((translate: Transformer) => readonly Shape[]) | Nothing = nothing) {
    super(id, Point.null)
    this.model = spaceModel
    this.debugShapes = debugShape
    this.context = context
    this.renderStyleProperty = this.properties.add<RenderStyle>("Render Style", RenderStyle.Solid, value => RenderStyle[value], value => ModelObject.switchRenderStyle(value))
    this.showBoundariesProperty = this.properties.add<boolean>("Show Boundaries", false, nothing, value => !value)
    this.shapesValue = this.createShapes()
  }

  shapes(): readonly Shape[] {
    return this.shapesValue
  }

  protected propertiesChanged(properties: readonly ObjectProperty[]) {
    this.updateShapes()
  }

  private static switchRenderStyle(value: RenderStyle) {
    const newValue = (value + 1) % (RenderStyle.WireframeDebug + 1)
    console.log(`switchRenderStyle: ${RenderStyle[newValue]}`)
    return newValue;
  }

  protected updateShapes() {
    this.shapesValue = this.createShapes()
  }

  private createShapes(): readonly Shape[] {
    const style = this.renderStyleProperty.typed
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
    this.addSegments(debug, result)
    this.addPoints(debug, result)
    this.addDebugShapes(result)
    return result
  }

  private addSegments(debug: boolean, result: Shape[]) {
    for (let index = 0; index < this.model.segments.length; index++) {
      const segment = this.model.segments[index]
      if (debug || !segment.debug) {
        result.push(LineShape.fromSegment(segment, debug))
      }
    }
  }

  private addPoints(debug: boolean, result: Shape[]) {
    for (let index = 0; index < this.model.points.length; index++) {
      const point = this.model.points[index]
      if (debug || !point.debug) {
        const color = debug ? modelColor(point.type) : point.type == ModelType.Utility ? Colors.gray.darker : Colors.primary.middle
        result.push(new PointShape(color, point, 2))
      }
    }
  }

  private addDebugShapes(result: Shape[]) {
    if (this.debugShapes == nothing) return
    const debugShapes = this.debugShapes(point => translateSpace(point, this.model))
    for (const debugShape of debugShapes) {
      result.push(debugShape)
    }
  }

  private addBoundaries(debug: boolean, result: Shape[]) {
    if (!this.showBoundariesProperty.typed) return

    const boundaries = this.model.boundaries
    const cubeModel = CubeModel.create(1, boundaries.min, boundaries.max, ModelType.UtilityLight)

    for (let index = 0; index < cubeModel.segments.length; index++) {
      const segment = cubeModel.segments[index]
      result.push(LineShape.fromSegment(segment, true))
    }
  }

  private solid() {
    const result: Shape[] = []
    for (let index = 0; index < this.model.faces.length; index++) {
      const face = this.model.faces[index]
      this.addFace(face, result, index)
    }
    this.addBoundaries(false, result)
    return result
  }

  private addFace(face: Triangle | Path, result: Shape[], index: number) {
    if (face.debug) return
    if (face.faceType == FaceType.Triangle) {
      result.push(PathShape.fromTriangle(face, false, true))
    } else {
      result.push(PathShape.fromPolygon(face, false, true))
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
      result.push(PathShape.fromTriangle(face, debug, false))
      return
    }

    if (debug || !face.debug) {
      for (const triangle of face.triangles) {
        result.push(PathShape.fromTriangle(triangle, debug, false))
      }
      result.push(PathShape.fromPolygon(face, debug, false))
    }
  }
}
