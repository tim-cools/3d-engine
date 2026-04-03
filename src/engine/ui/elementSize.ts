import {ElementSizeValue} from "./elementSizeValue"
import {Padding} from "./padding"

export class ElementSize {

  static zero: ElementSize = new ElementSize(ElementSizeValue.zero, ElementSizeValue.zero)
  static full: ElementSize = new ElementSize(ElementSizeValue.full, ElementSizeValue.full)

  readonly width: ElementSizeValue
  readonly height: ElementSizeValue

  constructor(width: ElementSizeValue | number, height: ElementSizeValue | number) {
    this.width = typeof width === 'number' ? new ElementSizeValue(width as number) : width
    this.height =  typeof height === 'number' ? new ElementSizeValue(height as number) : height
  }

  pad(padding: Padding) {
    const width = this.width.proportion ? this.width : new ElementSizeValue(this.width.value + padding.left + padding.right)
    const height = this.height.proportion ? this.height : new ElementSizeValue(this.height.value + padding.top + padding.bottom)
    return new ElementSize(width, height)
  }

  toString() {
    return `width: ${this.width} height: ${this.height}`
  }
}

