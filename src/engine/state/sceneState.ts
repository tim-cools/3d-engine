import {RenderStyle} from "./renderStyle"
import {RenderModel} from "./renderModel"

export interface SceneState {
  readonly name: string
  readonly renderStyle: RenderStyle
  readonly renderStyleCaption: string
  readonly renderModel: RenderModel
  readonly renderModelCaption: string
  readonly axisVisible: boolean
  readonly showBoundaries: boolean
}
