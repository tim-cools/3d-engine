import {EventType} from "./eventType"

export class KeyDown {

  readonly eventType = EventType.MouseOver
  readonly key: string

  constructor(key: string = "") {
    this.key = key
  }
}
