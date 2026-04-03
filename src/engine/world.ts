import {View} from "./view"
import {Point, Point2D, Space, Space2D, SpaceObject, translateSpace, translateSpaceTriangle, Triangle} from "./models"
import {RenderShape2DContext, RenderShapeContext, Shape, Shape2D} from "./shapes"
import {Scene} from "./scenes"
import {Object, Object3D} from "./objects"
import {Selectable, SelectableObject, SelectableState} from "./shapes/selectable"
import {nothing, Nothing} from "../infrastructure/nothing"
import {UI, RenderUIContext} from "./ui"
import {Context} from "./context"
import {Colors} from "../infrastructure/colors"
import {Object2D} from "./objects/object2D"
import {ElementArea} from "./ui/elementArea"
import {MouseDown, MouseOver, Update} from "./events"
import {SceneState, SceneStateType, SelectionState, SelectionStateType} from "./state"
import {RenderUICanvasContext} from "./ui/rendering/renderUICanvasContext"
import {RoundEnumerator} from "./roundEnumerator"
import {SelectionListState, SelectionListStateType} from "./state/selectionListState"
import {UIElement} from "./ui/uiElement"
import {UIElementType} from "./ui/uiElementType"

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

  createUI(): RenderUIContext {
    return new RenderUICanvasContext(this.canvasContext)
  }
}

export class World {

  private readonly ui: UI;
  private readonly view: View
  private readonly context: Context
  private readonly selectionState: SelectionState
  private readonly selectionListState: SelectionListState

  private sceneValue: Scene
  private objects: Object[] = []
  private selectables: SelectableObject[] = []
  private sceneObjectsValue: Object[] = []
  private lastSelectedIndex: number | Nothing = nothing

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
    this.selectionState = context.state.get(SelectionStateType)
    this.selectionListState = context.state.get(SelectionListStateType)

    const sceneState = context.state.get(SceneStateType)
    this.sceneValue = sceneState.current

    this.setScene(sceneState)

    context.state.subscribeUpdate(SceneStateType, state => this.setScene(state), nothing)
    context.events.subscribe(MouseOver, event => this.mouseOver(event), nothing)
    context.events.subscribe(MouseDown, event => this.mouseDown(event), nothing)
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
    this.renderShapes(canvasContext, shapes)
  }

  logShapes() {
    const shapes = this.updateShapes()
    console.log("Shapes     ----------------------------------------------------------------------")
    for (const objectShape of shapes) {
      console.log("-- " + objectShape.shape.toString())
    }
    console.log("Shapes End ----------------------------------------------------------------------")

    console.log("UI         ----------------------------------------------------------------------")
    this.logElements(this.ui.children, 0)
    console.log("UI End     ----------------------------------------------------------------------")
  }

  pointInUI(point: Point2D) {
    return this.ui.pointInUI(point)
  }

  private renderShapes(canvasContext: CanvasRenderingContext2D, shapes: ShapeRender[]) {
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

  private mouseOver(event: MouseOver) {
    this.hoverAt(event.point)
    this.lastSelectedIndex = nothing
  }

  private mouseDown(event: MouseDown) {
    this.selectAt(event.point)
  }

  private setScene(state: SceneState) {

    this.sceneValue = state.current
    this.sceneObjectsValue = state.objects

    this.clearSelection()
  }

  private updateShapes(): ShapeRender[] {

    const space2D = this.view.space2D()

    this.objects = [...this.sceneObjects]

    const result = this.shapesRenderers(space2D)
    result.sort((first, second) => first.z > second.z ? -1 : 1)

    this.renderSelected(space2D, result)

    return result
  }

  private renderSelected(space2D: Space2D, result: ShapeRender[]) {
    let hoverSelectable: SelectableObject | Nothing = nothing
    let selected: SelectableObject | Nothing = nothing
    for (const selectable of this.selectables) {
      const selectionState = this.selectionState
      const selectionListState = this.selectionListState
      const id = selectable.source.primitive.id
      if (selectionState.hover != nothing && selectionState.hover.id == id) {
        hoverSelectable = selectable
      } else if (selectionState.selected != nothing && selectionState.selected.id == id) {
        selected = selectable
      } else if (selectionListState.primitives.findIndex(where => where.id == id) >= 0) {
        selectable.state = SelectableState.Group
        this.renderShape2D(selectable, space2D, result)
      }
    }

    if (hoverSelectable != nothing) {
      hoverSelectable.state = SelectableState.Hover
      this.renderShape2D(hoverSelectable, space2D, result)
    }
    if (selected != nothing) {
      selected.state = SelectableState.Selected
      this.renderShape2D(selected, space2D, result)
    }
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

  private hoverAt(point: Point2D) {

    const selectionState = this.selectionState

    for (let index = this.selectables.length - 1; index >= 0; index--) {
      const selectable = this.selectables[index]
      if (selectable.includes(point)) {
        const id = selectable.source.primitive.id
        if (selectionState.hover == nothing || selectionState.hover.id != id) {
          selectionState.hover = selectable.source
          this.lastSelectedIndex = nothing
        }
        return
      }
    }

    selectionState.hover = nothing
  }

  private selectAt(point: Point2D) {

    const roundEnumerator = new RoundEnumerator(this.lastSelectedIndex, this.selectables)
    const selectionState = this.selectionState

    while (roundEnumerator.current != nothing) {
      const selectable = roundEnumerator.current
      if (selectable.includes(point)) {
        selectionState.selected = selectable.source
        this.lastSelectedIndex = roundEnumerator.index
        return
      }
      roundEnumerator.next()
    }

    this.lastSelectedIndex = nothing
    selectionState.selected = nothing
  }

  private clearSelection() {
    this.selectionState.hover = nothing
  }

  private logElements(children: readonly UIElement[], indent: number) {
    for (const child of children) {
      console.log(`${" ".repeat(indent * 2)}- ${child.id} (${UIElementType[child.elementType]}): ${child.calculateSize()} (last: ${child.lastArea}}`)
      this.logElements(child.children, indent + 1)
    }
  }
}
