import {EventType} from "./eventType"

export class KeyDown {

  readonly eventType = EventType.KeyDown
  readonly key: string

  constructor(key: string = "") {
    this.key = key
  }
}
