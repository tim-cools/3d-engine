export class VerifyLogging {

  private readonly stringBuilder: string[] = ["\n"]
  private errorsValue: number = 0

  private indention: number = 0

  get errors(): number {
    return this.errorsValue++
  }

  toString() {
    return `Errors: ${this.errorsValue}\n${this.stringBuilder.join("\n")}`
  }

  errorOccurred(): void {
    this.errorsValue++
  }

  appendLine(message: string) {
    this.stringBuilder.push(message)
  }

  fail(message: string | null = null, title: string) {
    if (this.indention > 0) {
      this.stringBuilder.push(' '.repeat(this.indention * 2))
    }

    this.stringBuilder.push(title + message)
    this.errorsValue++
  }

  logAssert(valid: boolean, message: string | null = null, title: string) {
    if (valid) return
    this.fail(message, title)
  }

  withIndentation(action: () => void) {
    this.indention++
    action()
    this.indention--
  }

  assertNoErrors() {
    let summary = this.toString()
    if (this.errors > 0) {
      throw new Error(summary)
    }
    console.log(summary)
  }
}
