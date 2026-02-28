import {View} from "./view"
import {Boundaries, Space2D, Space, Point, translateSpace, SpaceObject} from "./models"
import {Shape, Shape2D} from "./shapes"
import {Scene, scenes} from "./scenes"
import {HasObjectStyle, Object2D, Object3D, ObjectStyle} from "./objects"

type ObjectRender = {
  z: number
  render: (context: CanvasRenderingContext2D) => void
}

export class World {

  private readonly logEnabled = false;

  private readonly lastZ: Map<string, number> = new Map()
  private readonly scenes: readonly Scene[] = []
  private readonly view: View

  private objectStyle: ObjectStyle = ObjectStyle.Wireframe;
  private scene: Scene

  constructor(view: View) {
    this.view = view
    this.scenes = scenes()
    this.scene = this.scenes[0]
    this.setScene(0)
  }

  update(difference: number) {
    for (const object of this.scene.objects) {
      object.update(difference)
    }
  }

  render(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {

    context.clearRect(0, 0, canvas.width, canvas.height)

    const shapes = this.shapes()
    shapes.sort((first, second) => {
      return first.z > second.z ? -1 : 1
    })
    for (const objectShape of shapes) {
      objectShape.render(context);
    }
  }

  setScene(number: number) {
    if (!(number >= 0 && number < this.scenes.length)) {
      return
    }
    this.scene = this.scenes[number]
    this.setObjectStyle()
  }

  switchObjectStyle() {
    this.objectStyle = (this.objectStyle + 1) % 4;
    console.log("switchObjectStyle: " + ObjectStyle[this.objectStyle])
    this.setObjectStyle()
  }

  private setObjectStyle() {
    for (const object of this.scene.objects) {
      const hasObjectStyle = object as any as HasObjectStyle
      if (hasObjectStyle.setStyle != undefined) {
        hasObjectStyle.setStyle(this.objectStyle)
      }
    }
  }

  private shapes(): ObjectRender[] {
    const result: ObjectRender[] = []
    const space2D = this.view.space2D();

    for (const object of this.scene.objects) {
      if (object.is3D) {
        this.renderObject3D(object, result)
      } else {
        this.renderObject2D(object, space2D, result)
      }
    }
    return result
  }

  private renderObject3D(object: Object3D, result: ObjectRender[]) {
    const space = this.objectSpace(object)
    for (const shape of object.shapes()) {
      this.renderShape3D(shape, space, result)
    }
  }

  private renderShape3D(shape: Shape, space: Space, result: ObjectRender[]) {

    const boundaries = shape.boundaries(space)
    const z = this.view.toViewCoordinateZ(boundaries.maxZPoint)
    const view = this.view;

    this.logZ(shape, z, boundaries)

    result.push({
      z: z,
      render(context: CanvasRenderingContext2D) {
        shape.render(space, view, context)
      }
    })
  }

  private objectSpace(object: SpaceObject): Space {
    function translate(point: Point) {
      return translateSpace(point, object);
    }
    return {translate: translate}
  }

  private renderObject2D(object: Object2D, space2D: Space2D, result: ObjectRender[]) {
    for (const shape of object.shapes()) {
      this.renderShape2D(shape, space2D, result)
    }
  }

  private renderShape2D(shape: Shape2D, space: Space2D, result: ObjectRender[]) {
    const view = this.view;
    result.push({
      z: 0,
      render(context: CanvasRenderingContext2D) {
        shape.render(space, view, context)
      }
    })
  }

  private logZ(shape: Shape, z: number, boundaries: Boundaries) {
    if (!this.logEnabled) return;
    if (!this.lastZ.has(shape.id) || this.lastZ.get(shape.id) != z) {
      console.log(`shape: ${shape.id}z: ${z} (${boundaries})`)
      this.lastZ.set(shape.id, z)
    }
  }
}
