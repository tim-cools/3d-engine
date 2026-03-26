import {Context} from "../../engine/scenes/sceneContext"
import {Scene} from "../../engine/scenes"
import {ApplicationContext} from "../../engine/applicationContext"
import {Object2DBase} from "../../engine/objects/object2D"
import {AlgorithmState, AlgorithmStateIdentifier} from "../../engine/state"

class TestEventObject extends Object2DBase {

  private algorithm: AlgorithmState

  called: number = 0

  constructor(context: ApplicationContext, id: string) {
    super(id)
    this.algorithm = context.state.get(AlgorithmStateIdentifier)
    context.state.subscribeUpdate(AlgorithmStateIdentifier, () => this.updated())
  }

  private updated() {
    this.called ++
  }
}

function getSceneTestObject(scenes: Scene[], number: number, scene1context: ApplicationContext) {
  return scenes[number].objects(scene1context)[0] as TestEventObject
}

describe('application context', () => {

  test('create new scene context', async () => {

    const scenes = [
      new Scene("test1", context => [new TestEventObject(context, "1")])
    ]

    const context = new Context(scenes)
    const algorithmState = context.state.get(AlgorithmStateIdentifier)
    const scene1context = context.newScene()

    const testObject1 = getSceneTestObject(scenes, 0, scene1context)
    expect(testObject1.called).toBe(0)

    algorithmState.switchAlgorithm()
    expect(testObject1.called).toBe(1)

    algorithmState.switchAlgorithm()
    expect(testObject1.called).toBe(2)
  })

  test('create new scene context should not publish events for the previous context', async () => {

    const scenes = [
      new Scene("test1", context => [new TestEventObject(context, "1")]),
      new Scene("test2", context => [new TestEventObject(context, "2")])
    ]

    const context = new Context(scenes)
    const algorithmState = context.state.get(AlgorithmStateIdentifier)
    const scene1context = context.newScene()

    const testObject1 = getSceneTestObject(scenes, 0, scene1context)
    expect(testObject1.called).toBe(0)

    algorithmState.switchAlgorithm()
    expect(testObject1.called).toBe(1)

    const scene2context = context.newScene()
    const testObject2 = getSceneTestObject(scenes, 1, scene2context)
    expect(testObject1.called).toBe(1)
    expect(testObject2.called).toBe(0)

    algorithmState.switchAlgorithm()
    expect(testObject1.called).toBe(1)
    expect(testObject2.called).toBe(1)
  })
})
