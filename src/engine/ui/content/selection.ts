import {box, button, iconButton, text} from "../controls"
import {UIElementType} from "../uiElementType"
import {ContentElement,  Stack, stack, collapsablePanel, row} from "../layout"
import {UIContext} from "../uiContext"
import {SelectionStateType} from "../../state"
import {Icon} from "../rendering/icons"
import {nothing} from "../../../infrastructure/nothing"
import {Colors} from "../../../infrastructure/colors"
import {SelectionListState, SelectionListStateType} from "../../state/selectionListState"
import {Path, Point, PrimitiveSource, PrimitiveType, Segment, Triangle} from "../../models"
import {UIElement} from "../uiElement"
import {scrollablePanel} from "../layout/scrollablePanel"

export function selection() {
  return new Selection()
}

export class Selection extends ContentElement {

  private readonly list: Stack

  readonly elementType: UIElementType = UIElementType.ScenesInfo

  constructor() {
    super()
    this.list = stack({spacing: 2})
    this.content = collapsablePanel("Selection",
      stack({}, [
        text("Press 'g' to add selected element to group."),
        box({backgroundColor: Colors.ui.listBackground, padding: 2}, scrollablePanel(this.list)),
        stack({}, [
          Selection.button("Select intersection"),
          Selection.button("Copy model clipboard"),
        ])
      ])
    )
  }

  private static button(title: string) {
    return row({padding: 0}, [button(title, {width: 250})])
  }

  protected contextAttached(context: UIContext) {
    this.context.state.subscribeUpdate(SelectionListStateType, state => this.setSelected(state), this)
    this.setSelected(this.context.state.get(SelectionListStateType))
  }

  private setSelected(state: SelectionListState) {
    this.list.children = state.primitives.map(primitive => this.item(primitive) )
  }

  private item(primitive: PrimitiveSource) {
    return box({
      backgroundColor: Colors.ui.titleBackground
    }, row({
        onEnter: () => this.onEnterRow(primitive),
        onLeave: () => this.onLeaveRow()
      }, [
        stack({padding: 0}, [
          text("type: " + PrimitiveType[primitive.primitive.primitiveType]),
          text("id: " + primitive.id),
          text("source: " + primitive.source),
          ...Selection.details(primitive)
        ]),
        iconButton(Icon.Close, {size: 18, onClick: () => this.remove(primitive)})
      ]))
  }

  private static details(primitive: PrimitiveSource): UIElement[] {
    if (primitive.primitive.primitiveType == PrimitiveType.Point) {
      return this.addPoint(primitive.primitive as Point)
    } else if (primitive.primitive.primitiveType == PrimitiveType.Segment) {
      return this.addSegment(primitive.primitive as Segment)
    } else if (primitive.primitive.primitiveType == PrimitiveType.Triangle) {
      return this.addTriangle(primitive.primitive as Triangle)
    } else if (primitive.primitive.primitiveType == PrimitiveType.Path) {
      return this.addPath(primitive.primitive as Path)
    }
    return []
  }

  private static addPoint(primitive: Point) {
    return [this.pointRow("point", primitive)]
  }

  private static addSegment(segment: Segment) {
    return [
      this.pointRow("begin", segment.begin),
      this.pointRow("end", segment.end),
    ]
  }

  private static addTriangle(triangle: Triangle) {
    return [
      this.pointRow("point 1", triangle.point1),
      this.pointRow("point 2", triangle.point2),
      this.pointRow("point 3", triangle.point3)
    ]
  }

  private static addPath(path: Path) {
    return path.points.map((point, index) => this.pointRow("point " + index, point))
  }

  private static pointRow(label: string, point: Point) {
    return row({
      padding: 0
    }, [
      text(label),
      text("x: " + point.x),
      text("y: " + point.y),
      text("z: " + point.z)
    ])
  }

  private remove(primitive: PrimitiveSource) {
    const selectionState = this.context.state.get(SelectionListStateType)
    selectionState.remove(primitive)
  }

  private onLeaveRow() {
    const selectionState = this.context.state.get(SelectionStateType)
    selectionState.hover = nothing
  }

  private onEnterRow(primitive: PrimitiveSource) {
    const selectionState = this.context.state.get(SelectionStateType)
    selectionState.hover = primitive
  }
}
