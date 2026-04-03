import {box, button, iconButton, text} from "../controls"
import {UIElementType} from "../uiElementType"
import {collapsablePanel, ContentElement, row, Stack, stack} from "../layout"
import {UIContext} from "../uiContext"
import {SelectionState, SelectionStateType} from "../../state"
import {Icon} from "../rendering/icons"
import {nothing} from "../../../infrastructure/nothing"
import {Colors} from "../../../infrastructure/colors"
import {SelectionListState, SelectionListStateType} from "../../state/selectionListState"
import {Path, Point, PrimitiveSource, PrimitiveType, Segment, Triangle} from "../../models"
import {UIElement} from "../uiElement"
import {scrollablePanel} from "../layout/scrollablePanel"
import {generateModelCode} from "./generateModelCode"


export function selection() {
  return new Selection()
}

function item(primitive: PrimitiveSource, index: number, onEnterRow: (primitive: PrimitiveSource) => void, onLeaveRow: () => void, remove: (primitive: PrimitiveSource) => void) {

  function details(primitive: PrimitiveSource): UIElement[] {
    if (primitive.primitive.primitiveType == PrimitiveType.Point) {
      return addPoint(primitive.primitive as Point)
    } else if (primitive.primitive.primitiveType == PrimitiveType.Segment) {
      return addSegment(primitive.primitive as Segment)
    } else if (primitive.primitive.primitiveType == PrimitiveType.Triangle) {
      return addTriangle(primitive.primitive as Triangle)
    } else if (primitive.primitive.primitiveType == PrimitiveType.Path) {
      return addPath(primitive.primitive as Path)
    }
    return []
  }

  function addPoint(primitive: Point) {
    return [pointRow("point", primitive)]
  }

  function addSegment(segment: Segment) {
    return [
      pointRow("begin", segment.begin),
      pointRow("end", segment.end),
    ]
  }

  function addTriangle(triangle: Triangle) {
    return [
      pointRow("point 1", triangle.point1),
      pointRow("point 2", triangle.point2),
      pointRow("point 3", triangle.point3)
    ]
  }

  function addPath(path: Path) {
    return path.points.map((point, index) => pointRow("point " + index, point))
  }

  function pointRow(label: string, point: Point) {
    return row({
      id: "Primitive" + index,
      padding: 0
    }, [
      text(label),
      text("x: " + point.x.toFixed(2)),
      text("y: " + point.y.toFixed(2)),
      text("z: " + point.z.toFixed(2))
    ])
  }

  return box({backgroundColor: Colors.ui.titleBackground},
    row({
      onEnter: () => onEnterRow(primitive),
      onLeave: () => onLeaveRow()
    }, [
      stack({padding: 0}, [
        text("type: " + PrimitiveType[primitive.primitive.primitiveType]),
        text("id: " + primitive.id),
        text("source: " + primitive.source),
        ...details(primitive)
      ]),
      iconButton(Icon.Close, {size: 18, onClick: () => remove(primitive)})
    ])
  )
}

export class Selection extends ContentElement {

  private readonly list: Stack

  readonly elementType: UIElementType = UIElementType.ScenesInfo

  get selectionListState(): SelectionListState {
    return this.context.state.get(SelectionListStateType)
  }

  get selectionState(): SelectionState {
    return this.context.state.get(SelectionStateType)
  }

  constructor() {
    super()
    this.list = stack({spacing: 2})
    this.content = collapsablePanel("Selection",
      stack({}, [
        text("Press 'g' to add selected element to group."),
        box({backgroundColor: Colors.ui.listBackground, padding: 2}, scrollablePanel(this.list)),
        stack({}, [
          Selection.button("Copy model clipboard", () => this.copyToClipboard()),
        ])
      ])
    )
  }

  private static button(title: string, onClick: () => void) {
    return row({padding: 0}, [button(title, onClick,{width: 250})])
  }

  protected contextAttached(context: UIContext) {
    this.context.state.subscribeUpdate(SelectionListStateType, state => this.setSelected(state), this)
    this.setSelected(this.selectionListState)
  }

  private setSelected(state: SelectionListState) {
    this.list.children = state.primitives.map((primitive, index) =>
      item(primitive, index, () => this.onEnterRow(primitive), () => this.onLeaveRow(), () => this.remove(primitive)))
  }

  private remove(primitive: PrimitiveSource) {
    const selectionState = this.context.state.get(SelectionListStateType)
    selectionState.remove(primitive)
  }

  private onLeaveRow() {
    this.selectionState.hover = nothing
  }

  private onEnterRow(primitive: PrimitiveSource) {
    this.selectionState.hover = primitive
  }

  private copyToClipboard() {
    const modelCode = generateModelCode(this.selectionListState.primitives)

    navigator.clipboard.writeText(modelCode)
  }
}
