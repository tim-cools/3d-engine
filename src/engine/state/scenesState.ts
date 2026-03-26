import {State, StateIdentifier} from "./state"
import {Scene} from "../scenes"
import {SceneName} from "./sceneName"
import {PublishStateEvents} from "./stateManager"

export const ScenesStateIdentifier = new StateIdentifier<ScenesState>("scenes")

export interface ScenesState {
  readonly scenes: readonly SceneName[]
}

export class ScenesStateHandler extends State<ScenesState> implements ScenesState {

  scenes: SceneName[]

  constructor(scenes: readonly Scene[], publishStateEvents: PublishStateEvents) {
    super(ScenesStateIdentifier, publishStateEvents)
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
