import {View} from "./view"
import {
  Boundaries,
  Space2D,
  Space,
  Point,
  translateSpace,
  SpaceObject,
  Triangle,
  translateSpaceTriangle
} from "./models"
import {Shape, Shape2D} from "./shapes"
import {Scene, scenes} from "./scenes"
import {
  Object2D,
  Object3D,
  axis,
  info,
  HasRenderStyle,
  RenderStyle,
  Algorithm,
  HasAlgorithm,
  HasSceneName,
  Object
} from "./objects"

type ObjectRender = {
  z: number
  shape: Shape | Shape2D
  render: (context: CanvasRenderingContext2D) => void
}

export class World {

  private readonly logEnabled = false

  private readonly axis = axis();
  private readonly info = info();
  private readonly lastZ: Map<string, number> = new Map()
  private readonly scenes: readonly Scene[] = []
  private readonly view: View

  private axisVisible: boolean = false
  private showBoundaries: boolean = false
  private renderStyle: RenderStyle = RenderStyle.Wireframe
  private algorithm: Algorithm = Algorithm.SubtractFaces
  private scene: Scene
  private objects: Object[] = []

  constructor(view: View) {
    this.view = view
    this.scenes = scenes()
    this.scene = this.scenes[0]
    this.setScene(0)
  }

  update(difference: number) {
    for (const object of this.scene.objects.value) {
      object.update(difference)
    }
  }

  render(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {

    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height)

    const shapes = this.updateShapes()
    shapes.sort((first, second) => {
      return first.z > second.z ? -1 : 1
    })

    for (const objectShape of shapes) {
      objectShape.render(context)
    }
  }

  setScene(number: number) {
    if (number < 0 || number >= this.scenes.length) {
      return
    }
    this.scene = this.scenes[number]
    this.updateShapes()
    this.setRenderStyle()
    this.setAlgorithm()
    this.setSceneName()
  }

  switchRenderStyle() {
    this.renderStyle = (this.renderStyle + 1) % (RenderStyle.WireframeDebug + 1)
    console.log("switchRenderStyle: " + RenderStyle[this.renderStyle])
    this.setRenderStyle()
  }

  switchAlgorithm() {
    this.algorithm = (this.algorithm + 1) % (Algorithm.SubtractFaces + 1)
    console.log("switchSAlgorithm: " + Algorithm[this.algorithm])
    this.setAlgorithm()
  }

  toggleAxis() {
    this.axisVisible = !this.axisVisible;
  }

  toggleShowBoundaries() {
    this.showBoundaries = !this.showBoundaries
    for (const object of this.objects) {
      const hasObjectStyle = object as any as HasRenderStyle
      if (hasObjectStyle.setShowBoundaries != undefined) {
        hasObjectStyle.setShowBoundaries(this.showBoundaries)
      }
    }
  }

  logShapes() {
    const shapes = this.updateShapes()
    console.log("Shapes     ----------------------------------------------------------------------")
    for (const objectShape of shapes) {
      console.log("-- " + objectShape.shape.toString())
    }
    console.log("Shapes End ----------------------------------------------------------------------")
  }

  private setRenderStyle() {
    for (const object of this.objects) {
      const hasObjectStyle = object as any as HasRenderStyle
      if (hasObjectStyle.setStyle != undefined) {
        hasObjectStyle.setStyle(this.renderStyle)
      }
    }
  }

  private setAlgorithm() {
    for (const object of this.objects) {
      const hasObjectStyle = object as any as HasAlgorithm
      if (hasObjectStyle.setAlgorithm != undefined) {
        hasObjectStyle.setAlgorithm(this.algorithm)
      }
    }
  }

  private setSceneName() {
    for (const object of this.objects) {
      const hasSceneName = object as any as HasSceneName
      if (hasSceneName.setSceneName != undefined) {
        hasSceneName.setSceneName(this.scene.title)
      }
    }
  }

  private updateShapes(): ObjectRender[] {
    const result: ObjectRender[] = []
    const space2D = this.view.space2D()

    this.objects = this.axisVisible
      ? [this.axis, this.info, ...this.scene.objects.value]
      : [this.info, ...this.scene.objects.value]

    for (const object of this.objects) {
      if (object.is3D) {
        this.renderObject3D(object, result)
      } else {
        this.renderObject2D(object, space2D, result)
      }
    }

    result.sort((first, second) => {
      return first.z > second.z ? -1 : 1
    })

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
    const z = this.view.toViewCoordinateZ(boundaries.averageZ)
    const view = this.view

    this.logZ(shape, z, boundaries)

    result.push({
      z: z,
      shape: shape,
      render(context: CanvasRenderingContext2D) {
        shape.render(space, view, context)
      }
    })
  }

  private objectSpace(object: SpaceObject): Space {
    function translate(point: Point) {
      return translateSpace(point, object)
    }
    function translateTriangle(triangle: Triangle): Triangle {
      return translateSpaceTriangle(triangle, object)
    }
    return {translate: translate, translateTriangle: translateTriangle}
  }

  private renderObject2D(object: Object2D, space2D: Space2D, result: ObjectRender[]) {
    for (const shape of object.shapes()) {
      this.renderShape2D(shape, space2D, result)
    }
  }

  private renderShape2D(shape: Shape2D, space: Space2D, result: ObjectRender[]) {
    const view = this.view
    result.push({
      z: 0,
      shape: shape,
      render(context: CanvasRenderingContext2D) {
        shape.render(space, view, context)
      }
    })
  }

  private logZ(shape: Shape, z: number, boundaries: Boundaries) {
    if (!this.logEnabled) return
    if (!this.lastZ.has(shape.id) || this.lastZ.get(shape.id) != z) {
      this.lastZ.set(shape.id, z)
    }
  }
}
