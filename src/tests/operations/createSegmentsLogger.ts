import {Text} from "../../engine/nothing"
import {Segment} from "../../engine/models"
import {VerifyLogging} from "../infrastructure"

export function createSegmentsLogger(factor: number | null = null) {

  const lines: string[] = []

  function logLine(message: Text) {
    lines.push(message)
  }

  function log(segment: Segment, message: Text) {
    const temp = factor != null ? new Segment(segment.begin.divide(factor), segment.end.divide(factor), segment.type, segment.debug) : segment
    lines.push(` - ${temp}: ${message}`)
  }

  function dump(logging: VerifyLogging) {
    logging.appendLine(`------------------------------------------\nsubtraction log: \n${lines.join("\n")}\n------------------------------------------\n`)
  }

  return {
    logLine: logLine,
    log: log,
    dump: dump
  }
}
