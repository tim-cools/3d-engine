import {ElementSizeValue} from "./elementSizeValue"

export class ElementSize {

  static zero: ElementSize = new ElementSize(ElementSizeValue.zero, ElementSizeValue.zero)

  readonly width: ElementSizeValue
  readonly height: ElementSizeValue

  constructor(width: ElementSizeValue, height: ElementSizeValue) {
    this.width = width
    this.height = height
  }
}
