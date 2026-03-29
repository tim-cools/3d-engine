import {State, StateIdentifier} from "./state"
import {Context, Scene} from "../scenes"
import {Object} from "../objects"
import {PublishStateEvents} from "./stateManager"
import {ObjectStateType} from "./objectState"
import {nothing} from "../../infrastructure/nothing"

export const SceneStateType = new StateIdentifier<SceneState>("scene")

export interface SceneState {

  readonly objects: Object[]
  readonly current: Scene
  readonly index: number
  readonly title: string

  setScene(index: number): void
}

export class SceneStateHandler extends State<SceneState> implements SceneState {

  current: Scene
  index: number = 0
  title: string = ""
  objects: Object[] =[]

  constructor(private scenes: readonly Scene[], publishStateEvents: PublishStateEvents, private context: Context) {
    super(SceneStateType, publishStateEvents)
    if (scenes.length == 0) {
      throw new Error("No scenes")
    }
    this.current = scenes[0]
    this.initializeScene(0)
  }

  setScene(index: number) {

    if (index < 0 || index >= this.scenes.length) {
      return
    }

    this.initializeScene(index)
    this.updated()
  }

  private initializeScene(index: number) {

    const scene = this.scenes[index]
    this.index = index
    this.title = scene.title
    this.current = scene

    const context = this.context.newScene()
    this.objects = scene.createObjects(context)

    const object = this.context.state.get(ObjectStateType)
    object.setObject(this.objects.length > 0 ? this.objects[0] : nothing)
  }
}
