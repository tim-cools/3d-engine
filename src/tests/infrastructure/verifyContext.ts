import {VerifyLogging} from "./verifyLogging"
import {Assert} from "../../infrastructure"
import {VerifyCollectionContext} from "./verifyCollectionContext"
import {VerifyModelContext} from "./verifyModelContext"

export class VerifyContext {

  private readonly logging: VerifyLogging

  constructor(logging: VerifyLogging) {
    this.logging = Assert.notNull(logging, "logging")
  }

  collection<TItem>(list: readonly TItem[], testHandler: (context: VerifyCollectionContext<TItem>) => void): VerifyContext {

    Assert.notNull(list, "list")
    Assert.notNull(testHandler, "testHandler")

    let verify = new VerifyCollectionContext<TItem>(list, this.logging)
    testHandler(verify)

    return this
  }

  log(message: string): VerifyContext {
    this.logging.appendLine(message)
    return this
  }

  fail(message: string): VerifyContext {
    this.logging.logAssert(false, message, "Failed")
    return this
  }

  isTrue(contains: boolean, message: string): VerifyContext {
    this.logging.logAssert(contains, message, "- Is true invalid: ")
    return this
  }

  isNotNull<TSubModel>(value: TSubModel, subContext: (context: VerifyModelContext<TSubModel>) => void,
                              extraMessage: string | null = null): VerifyContext {
    const valid = value != null
    if (valid) {
      return this.inContext(subContext, value)
    }
    this.logging.logAssert(false, extraMessage, `- IsNotNull Failed: `)
    return this
  }

  isNull<TSubModel>(value: TSubModel, extraMessage: string | null = null): VerifyContext {
    this.logging.logAssert(value == null, extraMessage, `- IsNull Failed '${value}'`)
    return this
  }

  private inContext<TSubModel>(subContext: (context: VerifyModelContext<TSubModel>) => void,
                               value: TSubModel): VerifyContext {

    this.logging.withIndentation(() => subContext(new VerifyModelContext<TSubModel>(value, this.logging)))

    return this
  }
}
