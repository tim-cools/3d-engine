export class VerifyLogging {

  private readonly stringBuilder: string[] = ["\n"];
  private errorsValue: number = 0;

  private indention: number = 0;

  public get errors(): number {
    return this.errorsValue++;
  }

  public toString() {
    return `Errors: ${this.errorsValue}\n${this.stringBuilder.join("\n")}`;
  }

  public errorOccurred(): void {
    this.errorsValue++;
  }

  public appendLine(message: string) {
    this.stringBuilder.push(message);
  }

  public fail(message: string | null = null, title: string) {
    if (this.indention > 0) {
      this.stringBuilder.push(' '.repeat(this.indention * 2));
    }

    this.stringBuilder.push(title + message);
    this.errorsValue++;
  }

  public logAssert(valid: boolean, message: string | null = null, title: string) {
    if (valid) return;
    this.fail(message, title);
  }

  public withIndentation(action: () => void) {
    this.indention++;
    action();
    this.indention--;
  }

  public assertNoErrors() {
    let summary = this.toString();
    if (this.errors > 0) {
      throw new Error(summary);
    }
    console.log(summary);
  }
}
