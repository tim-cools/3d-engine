import {Point2D} from "../models"
import {Padding} from "./padding"
import {ElementPosition} from "./elementPosition"
import {ElementSize} from "./elementSize"
import {ElementSizeValue} from "./elementSizeValue"

export class ElementArea {

  readonly top: number
  readonly left: number
  readonly width: number
  readonly height: number

  get position(): Point2D {
    return new Point2D(this.left, this.top)
  }

  get bottom(): number {
    return this.top + this.height
  }

  constructor(left: number, top: number, width: number, height: number) {
    this.top = top
    this.left = left
    this.width = width
    this.height = height
  }

  toPath() {
    const start = new Point2D(this.left, this.top)
    return [
      start,
      start.add(0, this.height),
      start.add(this.width, this.height),
      start.add(this.width, 0),
    ]
  }

  part(position: ElementPosition, size: ElementSize) {
    const left = this.left + position.left
    const top = this.top + position.top
    const width = size.width.proportion ? this.width : size.width.value
    const height = size.height.proportion ? this.height : size.height.value
    return new ElementArea(left, top, width, height)
  }

  resize(size: ElementSize) {
    const width = size.width.proportion ? this.width : size.width.value
    const height = size.height.proportion ? this.height : size.height.value
    return new ElementArea(this.left, this.top, width, height)
  }

  calculateWidth(width: ElementSizeValue) {
    return width.proportion ? this.width * width.value : width.value
  }

  calculateHeight(height: ElementSizeValue) {
    return height.proportion ? this.height * height.value : height.value
  }

  pad(padding: Padding) {
    return new ElementArea(
      this.left + padding.left,
      this.top + padding.top,
      this.width - padding.left - padding.right,
      this.height - padding.top - padding.bottom
    )
  }

  addLeft(width: number) {
    return new ElementArea(this.left + width, this.top, this.width, this.height)
  }

  addTop(height: number) {
    return new ElementArea(this.left, this.top + height, this.width, this.height)
  }

  add(point: Point2D) {
    return new ElementArea(this.left + point.x, this.top + point.y, this.width, this.height)
  }

  static square(value: number) {
    return new ElementArea(0, 0, value,value)
  }

  contains(point: Point2D) {
    return point.x >= this.left
        && point.x <= this.left + this.width
        && point.y >= this.top
        && point.y <= this.top + this.height
  }

  middle(): Point2D {
    return new Point2D(this.left + this.width / 2, this.top + this.height / 2)
  }

  toString() {
    return `left: ${this.left} top: ${this.top} width: ${this.width} height: ${this.height}`
  }
}
