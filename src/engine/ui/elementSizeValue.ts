export class ElementSizeValue {

  static zero = new ElementSizeValue(0)
  static default = new ElementSizeValue(100)
  static full = new ElementSizeValue(1, true)

  readonly value: number = 0
  readonly proportion: boolean

  constructor(value: number, percentage: boolean = false) {
    this.value = value
    this.proportion = percentage
  }

  toString() {
    return `${this.value}${this.proportion ? ' (proportion)' : ''}`
  }

  static parse(value: ElementSizeValue | number) {
    return typeof value == "number" ? new ElementSizeValue(value) : value
  }
}

export const fullSize = ElementSizeValue.full
