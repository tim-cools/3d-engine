import {Scene} from "../../engine/scenes"
import {Context} from "../../engine/context"
import {nothing, Nothing} from "../../infrastructure/nothing"

export function createTestContext(scenes: readonly Scene[] | Nothing = nothing) {
  return new Context(scenes ?? [
    new Scene("test", () => [])
  ])
}
