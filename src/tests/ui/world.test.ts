import {Scene} from "../../engine/scenes"
import {Context} from "../../engine/context"
import {View, World} from "../../engine"
import {cube} from "../../engine/scenes/cube"
import {sphere} from "../../engine/scenes/sphere"
import {Point, Point2D, Space2D} from "../../engine/models"
import {SceneStateType} from "../../engine/state"

class DummyView implements View {
  
  height: number = 0
  width: number = 0

  moveCamera(x: number | null, y: number | null, z: number | null): void {
  }

  reset(): void {
  }

  rotate(x: number, y: number): void {
  }

  space2D(): Space2D {

    function translate(point: Point2D): Point2D {
      return new Point2D(point.x, point.y)
    }

    function translatePoints(points: readonly Point2D[]): Point2D[] {
      return []
    }

    return {
      translate: translate,
      translatePoints: translatePoints
    }
  }

  toViewCoordinateZ(coordinate: Point): number {
    return 0
  }

  translate(point: Point): Point2D {
    return new Point2D(point.x, point.y)
  }

  translateMany(point: readonly Point[]): readonly Point2D[] {
    return []
  }
}

describe('world', () => {

  test('create world', async () => {
    const scenes = [
      new Scene("test 1", () => []),
      new Scene("test 2", () => []),
      new Scene("test 3", () => [])
    ]
    const context = new Context(scenes)
    const view = new DummyView()
    const world = new World(view, scenes, context)
    expect(world.scene.title).toBe("test 1")
  })

  test('switch scene', async () => {
    const scenes = [
      new Scene("test 1", () => []),
      new Scene("test 2", () => []),
      new Scene("test 3", () => [])
    ]
    const context = new Context(scenes)
    const view = new DummyView()
    const world = new World(view, scenes, context)
    context.state.get(SceneStateType).setScene(1)
    expect(world.scene.title).toBe("test 2")
  })

  test('create with real createObjects', async () => {
    const scenes = [
      cube(),
      sphere()
    ]
    const context = new Context(scenes)
    const view = new DummyView()
    const world = new World(view, scenes, context)
    expect(world.scene.title).toBe("Cube")
  })
})
