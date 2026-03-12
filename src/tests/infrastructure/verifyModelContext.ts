import {compileExpression} from "./compileExpression"
import {Assert} from "../../infrastructure"
import {VerifyLogging} from "./verifyLogging"
import {VerifyCollectionContext} from "./verifyCollectionContext"

export type ModelPropertyHandler<TModel, TProperty> = (value: TModel) => TProperty

export class VerifyModelContext<TModel> {

  readonly model: TModel
  readonly logging: VerifyLogging

  constructor(model: TModel, logging: VerifyLogging) {
    this.model = Assert.notNull(model, "model")
    this.logging = Assert.notNull(logging, "logging")
  }

  collection<TItem>(expression: ModelPropertyHandler<TModel, readonly TItem[]>,
                           handler: (context: VerifyCollectionContext<TItem>) => void): VerifyModelContext<TModel> {
    const [value, message] = compileExpression(expression, this.model)
    if (value == null) {
      this.logging.fail(message, "collection item value is null")
      return this
    }
    this.logging.appendLine("Collection: " + message)
    handler(new VerifyCollectionContext<TItem>(value, this.logging))
    return this
  }

  fail(message: string): VerifyModelContext<TModel> {
    this.logging.appendLine(">> " + message)
    this.logging.errorOccurred()
    return this
  }

  areEqual<TValue>(expression: ModelPropertyHandler<TModel, TValue>, actual: TValue, extraMessage: string | null = null): VerifyModelContext<TModel> {
    const [value, message] = compileExpression(expression, this.model)
    const suffix = extraMessage != null ? ` (${extraMessage})` : ""
    this.logging.logAssert(value == actual, message, `- areEqual Failed '${value}' != '${actual}' ${suffix}: `)
    return this
  }

  areNotEqual<TValue>(expression: ModelPropertyHandler<TModel, TValue>, actual: TValue): VerifyModelContext<TModel> {
    const [value, message] = compileExpression(expression, this.model)
    this.logging.logAssert(value != actual, message, `- areNotEqual Failed '${value}' == '${actual}': `)
    return this
  }

  areSame<TValue>(expression: ModelPropertyHandler<TModel, TValue>, actual: TValue): VerifyModelContext<TModel> {
    const [value, message] = compileExpression(expression, this.model)
    this.logging.logAssert(value === actual, message, `- areSame Failed '${value}' !== '${actual}': `)
    return this
  }

  isEmpty<TValue>(expression: ModelPropertyHandler<TModel, TValue>): VerifyModelContext<TModel> {
    const [value, message] = compileExpression(expression, this.model)
    this.logging.logAssert(value == "", message, `- isEmpty Failed '${value}': `)
    return this
  }

  isNotNull<TSubModel>(expression: ModelPropertyHandler<TModel, TSubModel>,
                              subContext: (context: VerifyModelContext<TSubModel>) => void,
                              extraMessage: string | null = null): VerifyModelContext<TModel> {
    const [value, message] = compileExpression(expression, this.model)
    const valid = value != null
    if (valid) {
      return this.inSubContext(subContext, value)
    }
    this.logging.logAssert(value != null, message, `- isNotNull Failed '${extraMessage}': `)
    return this
  }

  isNull<TValue>(expression: ModelPropertyHandler<TModel, TValue>, extraMessage: string | null = null): VerifyModelContext<TModel> {
    const [value, message] = compileExpression(expression, this.model)
    const suffix = extraMessage != null ? ` (${extraMessage})` : ""
    this.logging.logAssert(value == null, message, `- isNull Failed '${value}${suffix}': `)
    return this
  }

  isTrue(expression: ModelPropertyHandler<TModel, boolean | null>): VerifyModelContext<TModel> {
    const [value, message] = compileExpression(expression, this.model)
    this.logging.logAssert(value === true, message, `- isTrue Failed '${value}': `)
    return this
  }

  isFalse(expression: ModelPropertyHandler<TModel, boolean | null>): VerifyModelContext<TModel> {
    const [value, message] = compileExpression(expression, this.model)
    this.logging.logAssert(value === true, message, `- isFalse Failed '${value}': `)
    return this
  }

  isOfType<TExpected>(expression: ModelPropertyHandler<TModel, object>, typeName: string, cast: (value: object) => TExpected, subContext: ((context: VerifyModelContext<TExpected>) => void) | null = null): VerifyModelContext<TModel> {
    const [value, message] = compileExpression(expression, this.model)
    if (value == null) {
      this.logging.fail(message, " - isOfType is null")
      return this
    }
    const subInstance = cast(value)
    const valid = subInstance != null
    if (valid) {
      return this.inSubContext(subContext, subInstance)
    }

    this.logging.logAssert(false, message, `- isOfType<${typeName}> Failed: `)
    return this
  }

  countIs<T>(expression: ModelPropertyHandler<TModel, ReadonlyArray<T>>, expected: number): VerifyModelContext<TModel> {
    const [collection, message] = compileExpression(expression, this.model)
    if (collection == null) {
      this.logging.fail(message, " - countIs is null")
      return this
    }
    let valid = collection.length == expected
    this.logging.logAssert(valid, message, `- countIs Failed '${collection.length}' != '${expected}': `)
    return this
  }

  countMapIs<TKey, TValue>(expression: ModelPropertyHandler<TModel, Map<TKey, TValue>>, expected: number): VerifyModelContext<TModel> {
    const [collection, message] = compileExpression(expression, this.model)
    if (collection == null) {
      this.logging.fail(message, " - countMapIs is null")
      return this
    }
    let valid = collection.size == expected
    this.logging.logAssert(valid, message, `- CountIs Failed '${collection.size}' != '${expected}': `)
    return this
  }

  containsKey<TKey, TValue>(expression: ModelPropertyHandler<TModel, Map<TKey, TValue>>, key: TKey, subContext: ((context: VerifyModelContext<TModel>) => void) | null = null) {
    const [collection, message] = compileExpression(expression, this.model)
    if (collection == null) {
      this.logging.fail(message, " - containsKey collection is null")
      return this
    }
    const collectionValue = collection.get(key)
    const valid = collectionValue != undefined
    if (collectionValue) {
      if (!subContext) return this
      return this.inSubContext<TValue>(subContext, collectionValue)
    }

    this.logging.logAssert(valid, message, `- containsKey '${key}': `)
    return this
  }

  valuePropertyAtEquals<TItem, TValue>(expression: ModelPropertyHandler<TModel, ReadonlyArray<TItem>>, index: number, property: (item: TItem) => TValue, expected: TValue) {
    const [listValue, itemMessage] = compileExpression(expression, this.model)
    if (listValue == null) {
      this.logging.fail(itemMessage, " - valuePropertyAtEquals listValue is null")
      return this
    }
    let item = index >= 0 && index < listValue.length ? listValue[index] : null
    if (item != null) {
      const [propertyValue, propertyMessage] = compileExpression(property, item)

      this.logging.logAssert(propertyValue == propertyValue, propertyMessage, `- propertyValueAtEquals[${index}] '${expected}' != '${propertyValue}': `)
      return this
    }
    this.logging.logAssert(false, itemMessage, `- propertyValueAtEquals[${index}] invalid: `)

    return this
  }

  ifNotNull<T>(value: T, subContext: (context: VerifyModelContext<TModel>) => void): VerifyModelContext<TModel> {
    if (value != null) {
      subContext(this)
    }
    return this
  }

  forEach<TItem>(items: readonly TItem[], handler: (item: TItem) => void): void {
    for (const item of items) {
      handler(item)
    }
  }

  action(action: (context: VerifyModelContext<TModel>) => void) {
    action(this)
    return this
  }

  private inContext(subContext: (context: VerifyModelContext<TModel>) => void): VerifyModelContext<TModel> {
    this.logging.withIndentation(() => subContext(this))
    return this
  }

  private inSubContext<TSubModel>(subContext: ((context: VerifyModelContext<TSubModel>) => void) | null, value: TSubModel) {
    if (subContext != null) {
      this.logging.withIndentation(() => subContext(new VerifyModelContext<TSubModel>(value, this.logging)))
    }
    return this
  }
}
