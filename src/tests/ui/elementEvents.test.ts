import {Context} from "../../engine/context"
import {SelectionStateType} from "../../engine/state"
import {UIElement} from "../../engine/ui/uiElement"
import {UIElementType} from "../../engine/ui/uiElementType"
import {UIContext} from "../../engine/ui/uiContext"
import {MouseEnter} from "../../engine/events"
import {Scene} from "../../engine/scenes"

class TestElement extends UIElement {

  public eventReceived: number = 0

  get children(): readonly UIElement[] {
    return [];
  }

  get elementType(): UIElementType {
    return UIElementType.Text;
  }

  protected contextAttached(context: UIContext) {
    context.events.subscribe(MouseEnter, () => this.eventReceived ++, this)
  }
}

describe('element events', () => {

  test('when an element are detached they should not receive the event anymore', async () => {

    const context = new Context([
      new Scene("test1", context => []),
    ])
    const element = new TestElement()
    context.attachElement(element)

    expect(element.eventReceived).toBe(0)

    context.events.publish(new MouseEnter())
    expect(element.eventReceived).toBe(1)

    context.detachElement(element)

    context.events.publish(new MouseEnter())
    expect(element.eventReceived).toBe(1)
  })

  test('when elements are detached they should not receive the event anymore', async () => {

    const context = new Context([
      new Scene("test1", context => []),
    ])
    const element = new TestElement()
    context.attachElements([element])

    expect(element.eventReceived).toBe(0)

    context.events.publish(new MouseEnter())
    expect(element.eventReceived).toBe(1)

    context.detachElements([element])

    context.events.publish(new MouseEnter())
    expect(element.eventReceived).toBe(1)
  })
})
