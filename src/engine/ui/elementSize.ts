import {ElementSizeValue} from "./elementSizeValue"

export class ElementSize {

  readonly width: ElementSizeValue
  readonly height: ElementSizeValue

  constructor(width: ElementSizeValue, height: ElementSizeValue) {
    this.width = width
    this.height = height
  }
}
