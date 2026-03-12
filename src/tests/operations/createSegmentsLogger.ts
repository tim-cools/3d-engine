import {Text} from "../../engine/nothing"
import {Segment} from "../../engine/models"
import {VerifyLogging} from "../infrastructure"
import {differenceInMilliseconds, padNumber} from "../../infrastructure/date"

export function createSegmentsLogger(factor: number | null = null) {

  const lines: string[] = []
  let lastDate: Date = new Date()

  function logLine(message: Text) {
    const now = new Date()
    const milliseconds = differenceInMilliseconds(now, lastDate)
    lines.push(`${timestamp()} (${padNumber(milliseconds, 10)}) - ${message}`)
    lastDate = now
  }

  function log(segment: Segment, message: Text) {
    const temp = factor != null ? new Segment(segment.begin.divide(factor), segment.end.divide(factor), segment.type, segment.debug) : segment
    lines.push(`${timestamp()} - ${temp}: ${message}`)
  }

  function dump(logging: VerifyLogging) {
    logging.appendLine(`------------------------------------------\nsubtraction log: \n${lines.join("\n")}\n------------------------------------------\n`)
  }

  function timestamp() {
    let now = new Date();
    return now.getFullYear()
      + ("0" + (now.getMonth() + 1)).slice(-2)
      + ("0" + now.getDate()).slice(-2)
      + ("0" + now.getHours()).slice(-2)
      + ("0" + now.getMinutes()).slice(-2)
      + ("0" + now.getSeconds()).slice(-2);
  }

  return {
    logLine: logLine,
    log: log,
    dump: dump
  }
}
