import {Context} from "../../engine/context"
import {UIElement} from "../../engine/ui/uiElement"
import {UIElementType} from "../../engine/ui/uiElementType"
import {UIContext} from "../../engine/ui/uiContext"
import {MouseEnter} from "../../engine/events"
import {Scene} from "../../engine/scenes"
import {nothing, Nothing} from "../../infrastructure/nothing"

class TestElement extends UIElement {

  private readonly child: UIElement | Nothing

  public eventReceived: number = 0

  get children(): readonly UIElement[] {
    return this.child != nothing ? [this.child] : [];
  }

  get elementType(): UIElementType {
    return UIElementType.Text;
  }

  public constructor(child: UIElement | Nothing = nothing) {
    super();
    this.child = child
  }

  protected contextAttached(context: UIContext) {
    context.events.subscribe(MouseEnter, () => this.eventReceived ++, this)
  }
}

describe('element events', () => {

  test('when an element is attached it should receive the event', async () => {

    const context = new Context([
      new Scene("test1", context => []),
    ])
    const element = new TestElement()

    context.attachElement(element)
    expect(element.eventReceived).toBe(0)

    context.events.publish(new MouseEnter())
    expect(element.eventReceived).toBe(1)
  })

  test('when elements are attached they should receive the events', async () => {

    const context = new Context([
      new Scene("test1", context => []),
    ])
    const element = new TestElement()

    context.attachElements([element])
    expect(element.eventReceived).toBe(0)

    context.events.publish(new MouseEnter())
    expect(element.eventReceived).toBe(1)
  })

  test('when an element is detached is should not receive the event anymore', async () => {

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

  test('when elements are attached and one is detached, the detached should not receive the event anymore', async () => {

    const context = new Context([
      new Scene("test1", context => []),
    ])
    const element1 = new TestElement()
    const element2 = new TestElement()

    context.attachElements([element1, element2])
    expect(element1.eventReceived).toBe(0)
    expect(element2.eventReceived).toBe(0)

    context.events.publish(new MouseEnter())
    expect(element1.eventReceived).toBe(1)
    expect(element2.eventReceived).toBe(1)

    context.detachElements([element1])

    context.events.publish(new MouseEnter())
    expect(element1.eventReceived).toBe(1)
    expect(element2.eventReceived).toBe(2)
  })

  test('when elements with children are attached, they all should receive the event', async () => {

    const context = new Context([
      new Scene("test1", context => []),
    ])
    const elementChild = new TestElement()
    const elementParent = new TestElement(elementChild)

    context.attachElement(elementParent)
    expect(elementChild.eventReceived).toBe(0)
    expect(elementParent.eventReceived).toBe(0)

    context.events.publish(new MouseEnter())
    expect(elementChild.eventReceived).toBe(1)
    expect(elementParent.eventReceived).toBe(1)

    context.detachElement(elementParent)

    context.events.publish(new MouseEnter())
    expect(elementChild.eventReceived).toBe(1)
    expect(elementParent.eventReceived).toBe(1)
  })
})
