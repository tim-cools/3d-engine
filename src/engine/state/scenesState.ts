import {State, StateIdentifier, UpdatableState} from "./state"
import {Scene} from "../scenes"
import {SceneName} from "./sceneName"

export const ScenesStateIdentifier = new StateIdentifier<ScenesState>("scenes")

export interface ScenesState extends UpdatableState<ScenesState> {
  readonly scenes: readonly SceneName[]
}

export class ScenesStateHandler extends State<ScenesState> implements ScenesState {

  scenes: SceneName[]

  constructor(scenes: readonly Scene[]) {
    super(ScenesStateIdentifier)
    this.scenes = ScenesStateHandler.createScenes(scenes)
  }

  private static createScenes(scenes: readonly Scene[]) {
    const result: SceneName[] = []
    for (let index = 0; index < scenes.length; index++){
      const scene = scenes[index]
      result.push(new SceneName(index, scene.title))
    }
    return result
  }
}
