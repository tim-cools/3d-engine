import {nothing, Nothing} from "../infrastructure/nothing"

export class Lazy<T> {

  private readonly factory: () => T
  private instance: T | Nothing = nothing

  get value(): T {
    if (this.instance == nothing) {
      this.instance = this.factory()
    }
    return this.instance
  }

  constructor(factory: () => T) {
    this.factory = factory
  }
}
