import {EventType} from "./eventType"

export class Update {

  readonly eventType = EventType.Update
  readonly timeMilliseconds: number

  constructor(timeMilliseconds: number = 0) {
    this.timeMilliseconds = timeMilliseconds
  }
}
