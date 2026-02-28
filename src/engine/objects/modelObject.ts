import {Color, Colors} from ".."
import {Boundaries, CubeModel, Model, SpaceModel, TransformablePoint} from "../models"
import {LineShape, PathShape, Shape, UpdatableShape} from "../shapes"
import {BaseObject3D, HasObjectStyle, ObjectStyle} from "./object"
import {nothing, Nothing} from "../nothing"

export class ModelObject extends BaseObject3D implements HasObjectStyle {

  private boundariesValue: Boundaries | Nothing = nothing;

  private readonly color: Color
  private readonly model: Model

  private style: ObjectStyle = ObjectStyle.Wireframe

  protected shapesValue: readonly UpdatableShape[]

  protected get boundaries(): Boundaries {
    if (this.boundariesValue == null) {
      this.boundariesValue = this.model.boundaries()
    }
    return this.boundariesValue
  }

  constructor(id: string, color: string, spaceModel: SpaceModel) {
    super(id, spaceModel.position, spaceModel.scale)
    this.color = color
    this.model = spaceModel.model
    this.shapesValue = this.createShapes()
  }

  setStyle(style: ObjectStyle) {
    console.log("setStyle: "+ style);
    this.style = style
    this.shapesValue = this.createShapes()
  }

  update(timeMilliseconds: number): void {
  }

  public shapes(): readonly Shape[] {
    return this.shapesValue
  }

  private createShapes(): readonly UpdatableShape[] {
    if (this.style == ObjectStyle.Wireframe) {
      return this.wireframe(false)
    } else if (this.style == ObjectStyle.WireframeBoundaries) {
      return this.wireframe(true)
    } else if (this.style == ObjectStyle.Solid) {
      return this.solid()
    } else if (this.style == ObjectStyle.FacesWireframe) {
      return this.facesWireframe()
    }
    throw new Error(`Invalid style: ${ObjectStyle[this.style]}`)
  }

  private wireframe(showBoundaries: boolean) {
    const result: UpdatableShape[] = []
    for (let index = 0 ; index < this.model.segments.length ; index++) {
      const vertex = this.model.segments[index]
      result.push(new LineShape(this.id + ".line." + index, this.color, new TransformablePoint(vertex.begin), new TransformablePoint(vertex.end)))
    }
    this.addBoundaries(showBoundaries, result)
    return result
  }

  private addBoundaries(showBoundaries: boolean, result: UpdatableShape[]) {
    if (!showBoundaries) return

    const boundaries = this.boundaries
    const cubeModel = CubeModel.create(1, boundaries.min, boundaries.max)
    for (let index = 0; index < cubeModel.segments.length; index++) {
      const vertex = cubeModel.segments[index]
      result.push(new LineShape(this.id + ".boundary." + index, Colors.gray.middle, new TransformablePoint(vertex.begin), new TransformablePoint(vertex.end)))
    }
  }

  private solid() {
    const result: UpdatableShape[] = []
    for (let index = 0 ; index < this.model.triangles.length ; index++) {
      const triangle = this.model.triangles[index]
      result.push(new PathShape(
        this.id + ".triangle." + index,
        this.color,
        [triangle.point1, triangle.point2, triangle.point3]))
    }
    return result
  }

  private facesWireframe() {
    const added: Map<string, any> = new Map();
    const result: UpdatableShape[] = []
    for (let index = 0 ; index < this.model.triangles.length ; index++) {
      const triangle = this.model.triangles[index]
      const key = `-${triangle.point1}-${triangle.point2}-${triangle.point3}` // todo sort so it's always the same
      if (!added.has(key)) {
        result.push(new LineShape(this.id + ".line." + index, this.color, new TransformablePoint(triangle.point1), new TransformablePoint(triangle.point2)))
        result.push(new LineShape(this.id + ".line." + index, this.color, new TransformablePoint(triangle.point2), new TransformablePoint(triangle.point3)))
        result.push(new LineShape(this.id + ".line." + index, this.color, new TransformablePoint(triangle.point3), new TransformablePoint(triangle.point1)))
        added.set(key, {});
      }
    }
    return result
  }
}
