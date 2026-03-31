import {SelectableObject} from "./shapes/selectable"
import {nothing, Nothing} from "../infrastructure/nothing"

export class RoundEnumerator {

  private readonly beginIndex: number
  private needRestart: boolean
  private indexValue: number
  private ended: boolean = false

  get current(): SelectableObject | Nothing {
    if (this.ended) {
      return nothing
    }
    return this.selectables[this.index]
  }

  get index(): number {
    return this.indexValue
  }

  constructor(private lastSelectedIndex: number | Nothing, private selectables: SelectableObject[]) {

    this.beginIndex = lastSelectedIndex != nothing
      ? lastSelectedIndex <= selectables.length - 1 && lastSelectedIndex >= 1 ? lastSelectedIndex - 1 : selectables.length - 1
      : selectables.length - 1

    this.indexValue = this.beginIndex
    this.needRestart = true
  }

  next() {
    if (this.index == 0) {
      if (this.needRestart) {
        this.indexValue = this.selectables.length - 1
        this.needRestart = false
        return true
      }
      this.ended = true
      return false
    }

    if (this.needRestart || this.index >= this.beginIndex) {
      this.indexValue--
      return true
    }
    this.ended = true
    return false
  }

}
