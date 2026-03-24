import {View} from "./view"
import {
  Point,
  Point2D,
  Space,
  Space2D,
  SpaceObject,
  translateSpace,
  translateSpaceTriangle,
  Triangle
} from "./models"
import {RenderShape2DContext, RenderShapeContext, Shape, Shape2D} from "./shapes"
import {Scene, scenes} from "./scenes"
import {axis, Object, Object3D} from "./objects"
import {Selectable, SelectableObject} from "./shapes/selectable"
import {nothing, Nothing} from "./nothing"
import {UIRenderContext, UI} from "./ui"
import {Update} from "./events/update"
import {RenderStyle} from "./state/renderStyle"
import {Algorithm} from "./state/algorithm"
import {GlobalContext} from "./scenes/currentSceneContext"
import {Colors} from "./colors"
import {Object2D} from "./objects/object2D"
import {ElementArea} from "./ui/elementArea"

type ShapeRender = {
  z: number
  shape: Shape | Shape2D
  render: (factory: RenderContextFactory) => void
}

class RenderContextFactory {

  private readonly selectables: Selectable[]
  private readonly view: View
  private readonly canvasContext: CanvasRenderingContext2D

  constructor(view: View, canvasContext: CanvasRenderingContext2D, selectables: Selectable[]) {
    this.view = view
    this.canvasContext = canvasContext
    this.selectables = selectables
  }

  create3D(space: Space): RenderShapeContext {
    return new RenderShapeContext(space, this.view, this.selectables, this.canvasContext)
  }

  create2D(space: Space2D): RenderShape2DContext {
    return new RenderShape2DContext(space, this.view, this.selectables, this.canvasContext)
  }

  createUI(): UIRenderContext {
    return new UIRenderContext(this.canvasContext)
  }
}

export class World {

  private readonly logEnabled = false

  private readonly ui: UI;
  private readonly axis = axis();
  private readonly lastZ: Map<string, number> = new Map()
  private readonly scenes: readonly Scene[] = []
  private readonly view: View

  private scene: Scene
  private objects: Object[] = []
  private selectables: SelectableObject[] = []
  private selected: SelectableObject | Nothing = nothing
  private globalContext = new GlobalContext()
  private sceneObjects: Object[] = []

  private get sceneState() {
    return this.globalContext.scene.value
  }

  constructor(view: View) {
    this.view = view
    this.scenes = scenes()
    this.scene = this.scenes[0]
    this.ui = new UI(this.globalContext)
    this.setScene(0)
  }

  update(difference: number) {
    this.globalContext.events.publish(Update, new Update(difference))
  }

  render(canvas: HTMLCanvasElement, canvasContext: CanvasRenderingContext2D) {

    const gradient = canvasContext.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, Colors.white)
    gradient.addColorStop(1, Colors.primary.lightest)

    canvasContext.fillStyle = gradient
    canvasContext.fillRect(0, 0, canvas.width, canvas.height)

    const shapes = this.updateShapes()

    this.selectables = []
    const context = new RenderContextFactory(this.view, canvasContext, this.selectables)
    for (const objectShape of shapes) {
      objectShape.render(context)
    }
    this.renderUI(context)
  }

  private renderUI(context: RenderContextFactory) {
    const area = new ElementArea(0, 0, this.view.width, this.view.height)
    this.ui.render(area, context.createUI())
  }

  clearSelection() {
    this.selected = nothing
  }

  setScene(number: number) {
    if (number < 0 || number >= this.scenes.length) {
      return
    }

    this.scene = this.scenes[number]

    this.globalContext.scene.update(state => ({...state, name: this.scene.title}))

    const context = this.globalContext.setScene()
    this.sceneObjects = this.scene.objects(context)
    this.clearSelection()
    this.updateShapes()
  }

  selectAt(point: Point2D) {
    for (let index = this.selectables.length - 1; index >= 0; index--){
      const selectable = this.selectables[index]
      if (selectable.includes(point)) {
        this.selected = selectable
        return
      }
    }
    this.selected = nothing
  }

  switchRenderStyle() {
    this.globalContext.scene.update(state => {
      const value = (state.renderStyle + 1) % (RenderStyle.WireframeDebug + 1)
      console.log("switchRenderStyle: " + value)
      return {
        ...state,
        renderStyle: value,
        renderStyleCaption: RenderStyle[value]
      }
    })
  }

  switchAlgorithm() {
    this.globalContext.algorithm.update(state => {
      const value = (state.value + 1) % (Algorithm.SubtractFaces + 1)
      console.log("switchSAlgorithm: " + value)
      return {
        ...state,
        value: value,
        caption: RenderStyle[value]
      }
    })
  }

  toggleAxis() {
    this.globalContext.scene.update(state => {
      return {
        ...state,
        axisVisible: !state.axisVisible
      }
    })
  }

  toggleShowBoundaries() {
    this.globalContext.scene.update(state => {
      return {
        ...state,
        showBoundaries: !state.showBoundaries
      }
    })
  }

  logShapes() {
    const shapes = this.updateShapes()
    console.log("Shapes     ----------------------------------------------------------------------")
    for (const objectShape of shapes) {
      console.log("-- " + objectShape.shape.toString())
    }
    console.log("Shapes End ----------------------------------------------------------------------")
  }

  private updateShapes(): ShapeRender[] {

    const space2D = this.view.space2D()

    this.objects = this.sceneState.axisVisible
      ? [this.axis, ...this.sceneObjects]
      : [...this.sceneObjects]

    const result = this.shapesRenderers(space2D)
    result.sort((first, second) => first.z > second.z ? -1 : 1)

    if (this.selected) {
      this.renderShape2D(this.selected, space2D, result)
    }

    return result
  }

  private shapesRenderers(space2D: Space2D) {
    const result: ShapeRender[] = []
    for (const object of this.objects) {
      if (object.is3D) {
        this.renderObject3D(object, result)
      } else {
        this.renderObject2D(object, space2D, result)
      }
    }
    return result
  }

  private renderObject3D(object: Object3D, result: ShapeRender[]) {
    const space = this.objectSpace(object)
    for (const shape of object.shapes()) {
      this.renderShape3D(shape, space, result)
    }
  }

  private renderShape3D(shape: Shape, space: Space, result: ShapeRender[]) {

    const boundaries = shape.boundaries(space)
    const z = this.view.toViewCoordinateZ(boundaries.averageZ)

    this.logZ(shape, z)

    result.push({
      z: z,
      shape: shape,
      render(contextFactory: RenderContextFactory) {
        shape.render(contextFactory.create3D(space))
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

  private renderObject2D(object: Object2D, space2D: Space2D, result: ShapeRender[]) {
    for (const shape of object.shapes) {
      this.renderShape2D(shape, space2D, result)
    }
  }

  private renderShape2D(shape: Shape2D, space: Space2D, result: ShapeRender[]) {
    result.push({
      z: shape.z,
      shape: shape,
      render(contextFactory: RenderContextFactory) {
        shape.render(contextFactory.create2D(space))
      }
    })
  }

  private logZ(shape: Shape, z: number) {
    if (!this.logEnabled) return
    if (!this.lastZ.has(shape.id) || this.lastZ.get(shape.id) != z) {
      this.lastZ.set(shape.id, z)
    }
  }
}
