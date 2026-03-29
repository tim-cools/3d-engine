import {ElementSizeValue} from "./elementSizeValue"

export class ElementSize {

  static zero: ElementSize = new ElementSize(ElementSizeValue.zero, ElementSizeValue.zero)
  static full: ElementSize = new ElementSize(ElementSizeValue.full, ElementSizeValue.full)

  readonly width: ElementSizeValue
  readonly height: ElementSizeValue

  constructor(width: ElementSizeValue, height: ElementSizeValue) {
    this.width = width
    this.height = height
  }
}
