import {Box, Button, IconButton, Text} from "../controls"
import {UIElementType} from "../uiElementType"
import {Row, Stack, Panel, ContentElement, EmptyElement} from "../layout"
import {UIContext} from "../uiContext"
import {SelectionStateType} from "../../state"
import {ElementSizeValue} from "../elementSizeValue"
import {Icon} from "../rendering/icons"
import {nothing} from "../../../infrastructure/nothing"
import {Colors} from "../../../infrastructure/colors"
import {SelectionListState, SelectionListStateType} from "../../state/selectionListState"

export class Selection extends ContentElement {

  private readonly list: Stack

  readonly elementType: UIElementType = UIElementType.ScenesInfo

  constructor() {
    super()
    this.list = new Stack()
    this.content = new Panel({title: "Selection", content: new Stack({
        children: [
          new Text({text: "Press 'g' to add selected element to group."}),
          this.list,
          new Stack({children: [
            new Row({children: [
              new EmptyElement({width: ElementSizeValue.full}),
              new Button({title: "Select intersection", width: new ElementSizeValue(250)}),
            ]}),
            new Row({children: [
              new EmptyElement({width: ElementSizeValue.full}),
              new Button({title: "Copy model clipboard", width: new ElementSizeValue(250)})
            ]})
          ]})
        ]
      })})
  }

  protected contextAttached(context: UIContext) {
    this.context.state.subscribeUpdate(SelectionListStateType, state => this.setSelected(state), this)
    this.setSelected(this.context.state.get(SelectionListStateType))
  }

  private setSelected(state: SelectionListState) {
    const rows = state.faceIds.map(id => new Box({
      backgroundColor: Colors.ui.titleBackground,
      content: new Row({
        children: [
          new Stack({children: [
              new Text({text: "id: " + id}),
              new Text({text: "x: "}),
              new Text({text: "y: "}),
              new Text({text: "z: "}),
          ]}),
          new IconButton({size: new ElementSizeValue(18), icon: Icon.Close, onClick: () => this.remove(id)})
        ],
        onEnter: () => this.onEnterRow(id),
        onLeave: () => this.onLeaveRow()
      })
    }))
    this.list.children = rows
  }

  private remove(id: string) {
    const selectionState = this.context.state.get(SelectionListStateType)
    selectionState.remove(id)
  }

  private onLeaveRow() {
    const selectionState = this.context.state.get(SelectionStateType)
    selectionState.hover = nothing
  }

  private onEnterRow(id: string) {
    const selectionState = this.context.state.get(SelectionStateType)
    selectionState.hover = id
  }
}
