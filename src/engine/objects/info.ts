import {Shape2D} from "../shapes"
import {Object2DBase, HasSceneName} from "./object"
import {InfoShape2D} from "../shapes/infoShape2D"
import {HasRenderStyle, RenderStyle} from "./renderStyle"
import {Algorithm, HasAlgorithm} from "./algorithm"

export class Info extends Object2DBase implements HasRenderStyle, HasAlgorithm, HasSceneName {

  private scene: string = ""
  private renderStyle: RenderStyle = RenderStyle.Wireframe
  private algorithm: Algorithm = Algorithm.SubtractSegments

  constructor() {
    super("info")
  }

  shapes(): readonly Shape2D[] {
    const info = {
      scene: this.scene,
      renderStyle: RenderStyle[this.renderStyle],
      algorithm: Algorithm[this.algorithm]
    }
    return [
      new InfoShape2D(`${this.id}.border`, info)
    ]
  }

  update(timeMilliseconds: number): void {
  }

  setAlgorithm(algorithm: Algorithm): void {
    this.algorithm = algorithm
  }

  setSceneName(sceneName: string): void {
    this.scene = sceneName
  }

  setShowBoundaries(showBoundaries: boolean): void {
  }

  setStyle(style: RenderStyle): void {
    this.renderStyle = style
  }
}

export function info() {
  return new Info()
}
