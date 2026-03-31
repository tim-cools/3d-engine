import {Scene} from "../../engine/scenes"
import {Context} from "../../engine/context"

export function createTestContext(scenes: readonly Scene[]) {
  return new Context(scenes)
}
