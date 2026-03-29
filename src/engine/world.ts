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
import {Scene} from "./scenes"
import {Object, Object3D} from "./objects"
import {Selectable, SelectableObject} from "./shapes/selectable"
import {nothing, Nothing} from "../infrastructure/nothing"
import {UIRenderContext, UI} from "./ui"
import {Context} from "./context"
import {Colors} from "../infrastructure/colors"
import {Object2D} from "./objects/object2D"
import {ElementArea} from "./ui/elementArea"
import {MouseOver, Update} from "./events"
import {SceneState, SceneStateType} from "./state"
import {CanvasUIRenderContext} from "./ui/rendering/canvasUIRenderContext"

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
    return new CanvasUIRenderContext(this.canvasContext)
  }
}

export class World {

  private readonly logEnabled = false

  private readonly ui: UI;
  private readonly lastZ: Map<string, number> = new Map()
  private readonly view: View
  private readonly context: Context

  private sceneValue: Scene
  private objects: Object[] = []
  private selectables: SelectableObject[] = []
  private selected: SelectableObject | Nothing = nothing
  private sceneObjectsValue: Object[] = []

  get scene(): Scene {
    return this.sceneValue
  }

  get sceneObjects(): Object[] {
    return this.sceneObjectsValue
  }

  constructor(view: View, scenes: readonly Scene[], context: Context) {

    this.view = view
    this.context = context
    this.ui = new UI()
    this.context.attachElement(this.ui)

    const sceneState = context.state.get(SceneStateType)
    this.sceneValue = sceneState.current

    this.setScene(sceneState)

    context.state.subscribeUpdate(SceneStateType, state => this.setScene(state), nothing)
    context.events.subscribe(MouseOver, event => this.mouseOver(event), nothing)
  }

  update(difference: number) {
    this.context.events.publish(new Update(difference))
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

  private mouseOver(event: MouseOver) {
    this.selectAt(event.point)
    if (event.mouseIsDown) {
      this.clearSelection()
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

  private setScene(state: SceneState) {

    this.sceneValue = state.current
    this.sceneObjectsValue = state.objects

    this.clearSelection()
    this.updateShapes()
  }

  private updateShapes(): ShapeRender[] {

    const space2D = this.view.space2D()

    this.objects = [...this.sceneObjects]

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

  private selectAt(point: Point2D) {
    for (let index = this.selectables.length - 1; index >= 0; index--) {
      const selectable = this.selectables[index]
      if (selectable.includes(point)) {
        this.selected = selectable
        return
      }
    }
    this.selected = nothing
  }
}
