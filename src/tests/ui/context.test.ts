import {Scene} from "../../engine/scenes"
import {Context} from "../../engine/context"
import {ApplicationContext} from "../../engine/applicationContext"
import {Object2DBase} from "../../engine/objects/object2D"
import {nothing} from "../../infrastructure/nothing"
import {SelectionListState, SelectionListStateType} from "../../engine/state/selectionListState"
import {Point, PrimitiveSource} from "../../engine/models"

class TestEventObject extends Object2DBase {

  private selectionState: SelectionListState

  called: number = 0

  constructor(context: ApplicationContext, id: string) {
    super(id)
    this.selectionState = context.state.get(SelectionListStateType)
    context.state.subscribeUpdate(SelectionListStateType, () => this.updated(), nothing)
  }

  private updated() {
    this.called ++
  }
}

function getSceneTestObject(scenes: Scene[], number: number, scene1context: ApplicationContext) {
  return scenes[number].createObjects(scene1context)[0] as TestEventObject
}

function newPrimitive() {
  return new PrimitiveSource(Point.null, "test")
}

describe('application context', () => {

  test('create new scene context', async () => {

    const scenes = [
      new Scene("test1", context => [new TestEventObject(context, "1")]),
      new Scene("test1", context => [new TestEventObject(context, "1")]),
    ]

    const context = new Context(scenes)
    const selectionState = context.state.get(SelectionListStateType)
    const scene1context = context.newScene()

    const testObject1 = getSceneTestObject(scenes, 0, scene1context)
    expect(testObject1.called).toBe(0)

    selectionState.select(newPrimitive())
    expect(testObject1.called).toBe(1)

    selectionState.select(newPrimitive())
    expect(testObject1.called).toBe(2)
  })

  test('create new scene context should not publish events for the previous context', async () => {

    const scenes = [
      new Scene("test1", context => [new TestEventObject(context, "1")]),
      new Scene("test2", context => [new TestEventObject(context, "2")])
    ]

    const context = new Context(scenes)
    const selectionState = context.state.get(SelectionListStateType)
    const scene1context = context.newScene()

    const testObject1 = getSceneTestObject(scenes, 0, scene1context)
    expect(testObject1.called).toBe(0)

    selectionState.select(newPrimitive())
    expect(testObject1.called).toBe(1)

    const scene2context = context.newScene()
    const testObject2 = getSceneTestObject(scenes, 1, scene2context)
    expect(testObject1.called).toBe(1)
    expect(testObject2.called).toBe(0)

    selectionState.select(newPrimitive())
    expect(testObject1.called).toBe(1)
    expect(testObject2.called).toBe(1)
  })
})
