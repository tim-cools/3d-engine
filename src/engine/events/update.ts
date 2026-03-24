import {EventType} from "./eventType"

export class Update {

  readonly eventType = EventType.Update
  readonly timeMilliseconds: number

  constructor(timeMilliseconds: number = 0) {
    this.timeMilliseconds = timeMilliseconds
  }
}

export class SwitchAlgorithm {
  readonly eventType = EventType.SwitchAlgorithm
}

export class SwitchRenderModel {
  readonly eventType = EventType.SwitchRenderModel
}

export class SwitchRenderStyle {
  readonly eventType = EventType.SwitchRenderStyle
}

export class MouseEnter {
  readonly eventType = EventType.MouseOver
}

export class MouseLeave {
  readonly eventType = EventType.MouseLeave
}

export class MouseOver {
  readonly eventType = EventType.MouseOver
}

export class MouseDown {
  readonly eventType = EventType.MouseDown
}

export class SelectScene {
  readonly eventType = EventType.SelectScene
  readonly index: number

  constructor(index: number = 0) {
    this.index = index
  }
}
