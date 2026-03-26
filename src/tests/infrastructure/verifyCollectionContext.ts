import {ModelPropertyHandler, VerifyModelContext} from "./verifyModelContext"
import {VerifyLogging} from "./verifyLogging"
import {any, Assert, count} from "../../infrastructure"
import {compileExpression} from "./compileExpression"
import {Nothing} from "../../infrastructure/nothing"

export class VerifyCollectionContext<TItem> {

  readonly logging: VerifyLogging

  readonly model: readonly TItem[]

  constructor(collection: readonly TItem[], logging: VerifyLogging) {
    this.model = Assert.notNull(collection, "collection")
    this.logging = Assert.notNull(logging, "logging")
  }

  length(length: number, extraMessage: string): VerifyCollectionContext<TItem> {
    this.logging.logAssert(this.model.length == length, extraMessage, `- Length Failed '${this.model.length}' != '${length}': `)
    return this
  }

  valueAt(index: number , verify: (item: TItem) => boolean, message: string | Nothing): VerifyCollectionContext<TItem> {

    const value = index >= 0 && index < this.model.length ? this.model[index] : null
    if (value != null) {
      let valid = verify(value)
      this.logging.logAssert(valid, message, `- ValueAt[${index}] not as expected: ${value.toString()}`)
      return this
    }

    this.logging.logAssert(false, message, `- valueAtEquals[${index}] invalid: no item. `)

    return this
  }

  valueModelProperty<TValue>(index: number, expression: ModelPropertyHandler<TItem, TValue>, verify: (item: VerifyModelContext<TValue>) => void): VerifyCollectionContext<TItem> {

    const item = index >= 0 && index < this.model.length ? this.model[index] : null
    const [value, message] = compileExpression(expression, item)
    if (value != null) {
      const model = new VerifyModelContext<TValue>(value, this.logging)
      verify(model)
      return this
    }

    this.logging.logAssert(false, message, `- valueModel[${index}] property is null: `)

    return this
  }

  valueModelPropertyCollection<TValue>(index: number, expression: ModelPropertyHandler<TItem, readonly TValue[]>, verify: (item: VerifyCollectionContext<TValue>) => void): VerifyCollectionContext<TItem> {

    const item = index >= 0 && index < this.model.length ? this.model[index] : null
    const [value, message] = compileExpression(expression, item)
    if (value != null) {
      const model = new VerifyCollectionContext<TValue>(value as readonly TValue[], this.logging)
      verify(model)
      return this
    }

    this.logging.logAssert(false, message, `- valueModel[${index}] property is null: `)

    return this
  }

  valueModel<TValue>(index: number, verify: (item: VerifyModelContext<TItem>) => void): VerifyCollectionContext<TItem> {

    const item = index >= 0 && index < this.model.length ? this.model[index] : null
    if (item != null) {
      const model = new VerifyModelContext<TItem>(item, this.logging)
      verify(model)
      return this
    }

    this.logging.logAssert(false, "item == null", `- valueModel[${index}] is null: `)

    return this
  }

  valueModelOfType<TValue>(index: number, typeName: string, cast: (item: TItem) => TValue | null, verify: (item: VerifyModelContext<TValue>) => void): VerifyCollectionContext<TItem> {

    const item = index >= 0 && index < this.model.length ? this.model[index] : null
    if (item == null) {
        this.logging.logAssert(false, "item == null", `- valueModel[${index}] is null: `)
        return this
    }

    const specific = cast(item)
    if (specific == null) {
      this.logging.logAssert(false, "invalid type", `- ValueModel[${index}] is not ${typeName}: `)
      return this
    }

    const model = new VerifyModelContext<TValue>(specific, this.logging)
    verify(model)
    return this
  }

  contains(expected: TItem): VerifyCollectionContext<TItem> {

    let value = this.model.indexOf(expected) >= 0
    this.logging.logAssert(value, "collection", `- Contains[${expected}] invalid: `, )

    return this
  }

  any(criteria: (value: TItem) => boolean, extraMessage: string): VerifyCollectionContext<TItem> {

    let value = any(this.model, criteria)

    this.logging.logAssert(value, criteria.toString(),`- Any invalid - >>${extraMessage}<<: `)

    return this
  }

  none(criteria: (value: TItem) => boolean, extraMessage: string): VerifyCollectionContext<TItem> {

    let value = !any(this.model, criteria)
    this.logging.logAssert(value, criteria.toString(), `- None invalid - (${extraMessage}): `)

    return this
  }

  count(number: number, filter: (item: TItem) => boolean, message: string) {
    const countNumber = count(this.model, filter)
    this.logging.logAssert(countNumber == number, message, `- Count invalid (${countNumber} != ${number}): `)
    return this
  }
}
