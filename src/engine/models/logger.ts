import {Segment} from "./primitives"
import {Text} from "../../infrastructure/nothing"

export interface Logger {
  logLine(message: Text): void
  log(segment: Segment, message: Text): void
}

export function noLogger(): Logger {
  return {
    logLine: function (message: Text) {},
    log: function (segment: Segment, message: Text) {}
  }
}
