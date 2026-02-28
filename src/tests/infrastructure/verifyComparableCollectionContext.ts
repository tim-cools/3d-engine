import {VerifyModelContext} from "./verifyModelContext"
import {VerifyLogging} from "./verifyLogging"
import { any } from "../../infrastructure"

export class VerifyComparableCollectionContext<TItem> extends VerifyModelContext<readonly TItem[]> {

  constructor(model: readonly TItem[], logging: VerifyLogging) {
    super(model, logging)
  }

  valueAtEquals(index: number, expected: TItem): VerifyComparableCollectionContext<TItem> {
    let value = index >= 0 && index < this.model.length ? this.model[index] : null
    if (value != null) {
      this.logging.logAssert(expected == value, "collection", `- valueAtEquals[${index}] '${expected}' != '${value}': `)
      return this
    }

    this.logging.logAssert(false, "collection", `- valueAtEquals[${index}] invalid: `)

    return this
  }

  length(length: number, extraMessage: string): VerifyComparableCollectionContext<TItem> {

    let suffix = extraMessage != null ? ` (${extraMessage})` : ""
    this.logging.logAssert(this.model.length == length, "Length", `- Length Failed '${this.model}' != '${length}'${suffix}: `)

    return this
  }

  contains(expected: TItem): VerifyComparableCollectionContext<TItem> {

    let value = this.model.indexOf(expected) >= 0
    this.logging.logAssert(value, "collection", `- Contains[${expected}] invalid: `)

    return this
  }

  any(criteria: (item: TItem) => boolean): VerifyComparableCollectionContext<TItem> {

    let value = any(this.model, criteria)
    this.logging.logAssert(value, "collection", `- Any[${criteria}] invalid: `)

    return this
  }
}
