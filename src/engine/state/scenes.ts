import {StateIdentifier} from "./state"
import {Scene} from "../scenes"
import {StateHandlerBase} from "./stateHandler"
import {SceneName} from "./sceneName"

export const ScenesState = new StateIdentifier<Scenes>("scenes")

export interface Scenes {
  readonly scenes: SceneName[]
}

export class ScenesStateHandler extends StateHandlerBase<Scenes> {

  constructor(private scenes: readonly Scene[]) {
    super(ScenesState)
  }

  protected createState(): Scenes {
    return {
      scenes: this.createScenes()
    }
  }

  private createScenes() {
    const result: SceneName[] = []
    for (let index = 0; index < this.scenes.length; index++){
      const scene = this.scenes[index]
      result.push(new SceneName(index, scene.title))
    }
    return result
  }
}
